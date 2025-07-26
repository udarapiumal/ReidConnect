import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { jwtDecode, JwtPayload } from 'jwt-decode';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { BASE_URL } from '../../constants/config';

interface UserType extends JwtPayload {
  id: string;
  sub: string;
  role: string;
  // add any other token fields here
}

interface ClubProviderProps {
  children: ReactNode;
}

interface ClubContextType {
  user: UserType | null;
  clubDetails: any;
  loading: boolean;
  token: string | null;
}

const ClubContext = createContext<ClubContextType | null>(null);

export const ClubProvider = ({ children }: ClubProviderProps) => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<UserType | null>(null);
  const [clubDetails, setClubDetails] = useState<any>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (!token) throw new Error("No token");

        const decoded = jwtDecode<UserType>(token);
        setUser(decoded);
        setToken(token);

        const res = await axios.get(
          `${BASE_URL}/api/club/by-user/${decoded.id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setClubDetails(res.data);
      } catch (err) {
        console.error("Error in ClubProvider:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <ClubContext.Provider value={{ user, clubDetails, loading, token }}>
      {children}
    </ClubContext.Provider>
  );
};

export const useClub = () => {
  const context = useContext(ClubContext);
  if (!context) throw new Error("useClub must be used within a ClubProvider");
  return context;
};

export default ClubProvider;