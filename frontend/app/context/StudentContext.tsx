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

interface StudentProviderProps {
  children: ReactNode;
}

interface StudentContextType {
  user: UserType | null;
  studentDetails: any;
  loading: boolean;
  token: string | null;
}

const StudentContext = createContext<StudentContextType | null>(null);

export const StudentProvider = ({ children }: StudentProviderProps) => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<UserType | null>(null);
  const [studentDetails, setStudentDetails] = useState<any>(null);
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
          `${BASE_URL}/api/student/by-user/${decoded.id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        console.log("🛠️ API response student details:", res.data);

        setStudentDetails(res.data);
      } catch (err) {
        console.error("Error in StudentProvider:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <StudentContext.Provider value={{ user, studentDetails, loading, token }}>
      {children}
    </StudentContext.Provider>
  );
};

export const useStudent = () => {
  const context = useContext(StudentContext);
  if (!context) throw new Error("useStudent must be used within a StudentProvider");
  return context;
};

export default StudentProvider;