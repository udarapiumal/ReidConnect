import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Client, IMessage } from '@stomp/stompjs';
// @ts-ignore
import SockJS from 'sockjs-client';
import axiosInstance from '@/app/api/axiosInstance';
import { BASE_URL } from '@/constants/config';
import { jwtDecode } from 'jwt-decode';

// Use same dynamic BASE_URL logic so it works on device/emulator (localhost would fail off-PC)
const SOCKJS_ENDPOINT = `${BASE_URL}/ws-notifications`;

export interface NotificationRecipientDto {
  id: string;
  userId: string;
  isRead: boolean;
  readAt?: string;
  deliveredAt?: string;
  notificationId: string;
  title: string;
  message: string;
  type: string;
  senderUserId?: string;
  createdAt: string;
}

interface NotificationsContextValue {
  notifications: NotificationRecipientDto[];
  unreadCount: number;
  connected: boolean;
  markAsRead: (recipientId: string) => Promise<void>;
  reload: () => Promise<void>;
  userId: string | null;
}

const NotificationsContext = createContext<NotificationsContextValue | null>(null);

export const NotificationsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const clientRef = useRef<Client | null>(null);
  const [notifications, setNotifications] = useState<NotificationRecipientDto[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [connected, setConnected] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const hasActivatedRef = useRef(false); // guard for StrictMode double-mount

  const loadInitial = useCallback(async () => {
    if (!userId) return;
    try {
      const [listRes, countRes] = await Promise.all([
        axiosInstance.get(`/api/notifications`, { params: { userId } }),
        axiosInstance.get(`/api/notifications/unread-count`, { params: { userId } })
      ]);
      setNotifications(listRes.data);
      setUnreadCount(countRes.data.count ?? 0);
    } catch (e) {
      console.warn('Failed to load notifications', e);
    }
  }, [userId]);

  const markAsRead = useCallback(async (recipientId: string) => {
    if (!userId) return;
    try {
      await axiosInstance.put(`/api/notifications/${recipientId}/read`, null, { params: { userId } });
      setNotifications(prev => prev.map(n => n.id === recipientId ? { ...n, isRead: true, readAt: new Date().toISOString() } : n));
      setUnreadCount(c => Math.max(0, c - 1));
    } catch (e) {
      console.warn('Failed to mark notification as read', e);
    }
  }, [userId]);

  // Acquire user id once (reuse jwt-decode to avoid Buffer dependency issues in RN)
  useEffect(() => {
    (async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (!token) return;
        const decoded: any = jwtDecode(token);
        if (decoded?.id) {
          setUserId(decoded.id);
        } else if (decoded?.sub) {
          // fallback if backend puts id into sub
            setUserId(decoded.sub);
        } else {
          console.warn('jwt decoded but no id/sub field present');
        }
      } catch (e) {
        console.warn('Failed to decode token for notifications provider', e);
      }
    })();
  }, []);

  // Establish single socket connection for lifetime of provider
  useEffect(() => {
    if (!userId) return; // wait until we have userId
    loadInitial();

    if (hasActivatedRef.current) {
      // Already active (e.g., userId change) -> teardown previous first
      clientRef.current?.deactivate();
    }

    let isUnmounting = false;

    (async () => {
      let token: string | null = null;
      try { token = await AsyncStorage.getItem('token'); } catch {/* ignore */}

      const client = new Client({
        webSocketFactory: () => new SockJS(SOCKJS_ENDPOINT),
        connectHeaders: token ? { Authorization: `Bearer ${token}` } : {},
        debug: (str) => console.log('STOMP', str),
        reconnectDelay: 5000,
        heartbeatIncoming: 10000,
        heartbeatOutgoing: 10000,
        onConnect: () => {
          setConnected(true);
          client.subscribe('/user/queue/notifications', (msg: IMessage) => {
            try {
              const body = JSON.parse(msg.body);
              if (body.recipients && Array.isArray(body.recipients)) {
                const rec = body.recipients.find((r: any) => r.userId === String(userId));
                if (rec) {
                  const dto: NotificationRecipientDto = {
                    id: rec.id,
                    userId: rec.userId,
                    isRead: rec.isRead,
                    readAt: rec.readAt,
                    deliveredAt: rec.deliveredAt,
                    notificationId: body.id,
                    title: body.title,
                    message: body.message,
                    type: body.type,
                    senderUserId: body.senderUserId,
                    createdAt: body.createdAt
                  };
                  setNotifications(prev => [dto, ...prev]);
                  setUnreadCount(c => c + (dto.isRead ? 0 : 1));
                }
              } else {
                setNotifications(prev => [body, ...prev]);
                setUnreadCount(c => c + (body.isRead ? 0 : 1));
              }
            } catch (e) {
              console.warn('Failed to parse notification', e);
            }
          });
        },
        onStompError: frame => {
          console.warn('Broker error', frame.headers['message']);
          setConnected(false);
        },
        onWebSocketClose: evt => {
          console.log('WebSocket closed', evt.reason);
          setConnected(false);
          if (!isUnmounting) {
            // allow reconnectDelay to handle reactivation
          }
        }
      });

      client.activate();
      hasActivatedRef.current = true;
      clientRef.current = client;
    })();

    return () => {
      isUnmounting = true;
      // Only fully deactivate when provider actually unmounts
      clientRef.current?.deactivate();
      setConnected(false);
    };
  }, [userId, loadInitial]);

  const value: NotificationsContextValue = {
    notifications,
    unreadCount,
    connected,
    markAsRead,
    reload: loadInitial,
    userId
  };

  return (
    <NotificationsContext.Provider value={value}>
      {children}
    </NotificationsContext.Provider>
  );
};

export const useNotificationsContext = () => {
  const ctx = useContext(NotificationsContext);
  if (!ctx) throw new Error('useNotificationsContext must be used within NotificationsProvider');
  return ctx;
};

// Default export placeholder so Expo Router does not error when treating this as a route.
// This component should never actually render; provider is applied in layout.
export default function NotificationsContextRoute(): null {
  return null;
}
