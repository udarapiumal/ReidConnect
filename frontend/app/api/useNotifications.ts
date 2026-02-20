import { useEffect, useRef, useState, useCallback } from 'react';
import React from 'react';
import { Client, IMessage } from '@stomp/stompjs';
// @ts-ignore - types may not be bundled
import SockJS from 'sockjs-client';
import axiosInstance from './axiosInstance';
import { BASE_URL } from '@/constants/config';
import AsyncStorage from '@react-native-async-storage/async-storage';

// STOMP over SockJS endpoint (Spring typically exposes /ws-notifications)
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

export function useNotifications(userId: string) {
  const clientRef = useRef<Client | null>(null);
  const [items, setItems] = useState<NotificationRecipientDto[]>([]);
  const [connected, setConnected] = useState<boolean>(false);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  // Use relative path with axiosInstance (already has BASE_URL). Keep absolute for clarity if needed.
  const base = `/api/notifications`;

  const loadInitial = useCallback(async () => {
    try {
      const [listRes, countRes] = await Promise.all([
        axiosInstance.get(`${base}`, { params: { userId } }),
        axiosInstance.get(`${base}/unread-count`, { params: { userId } })
      ]);
      setItems(listRes.data);
      setUnreadCount(countRes.data.count ?? 0);
    } catch (e) {
      console.warn('Failed to load notifications', e);
    }
  }, [userId]);

  const markAsRead = useCallback(async (recipientId: string) => {
    try {
      await axiosInstance.put(`${base}/${recipientId}/read`, null, { params: { userId } });
      setItems(prev => prev.map(n => n.id === recipientId ? { ...n, isRead: true, readAt: new Date().toISOString() } : n));
      setUnreadCount(c => Math.max(0, c - 1));
    } catch (e) {
      console.warn('Failed to mark notification as read', e);
    }
  }, [userId]);

  useEffect(() => {
    if (!userId) return;
    loadInitial();

    const initSocket = async () => {
      let token: string | null = null;
      try {
        token = await AsyncStorage.getItem('token');
      } catch (e) {
        console.warn('Unable to read token from storage', e);
      }

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
                  setItems(prev => [dto, ...prev]);
                  setUnreadCount(c => c + (dto.isRead ? 0 : 1));
                }
              } else {
                setItems(prev => [body, ...prev]);
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
        }
      });

      client.activate();
      clientRef.current = client;
    };

    initSocket();

    return () => {
      try {
        clientRef.current?.deactivate();
      } finally {
        setConnected(false);
      }
    };
  }, [userId, loadInitial]);

  return { notifications: items, unreadCount, markAsRead, reload: loadInitial, connected };
}

// Minimal default export so Expo Router treats this file as a valid route file.
// This module primarily exports the `useNotifications` hook; the default
// component is a no-op placeholder and should not be rendered.
export default function NotificationsRoute(): null {
  return null;
}