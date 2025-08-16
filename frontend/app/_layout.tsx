// app/_layout.tsx
import { Slot } from 'expo-router';
import { AuthProvider } from './context/AuthContext';
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Ensure a single QueryClient instance across renders/HMR
const queryClient = new QueryClient();

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Slot />
      </AuthProvider>
    </QueryClientProvider>
  );
}
