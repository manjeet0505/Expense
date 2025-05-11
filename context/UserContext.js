"use client";

import { createContext, useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

export const UserContext = createContext();

export function UserProvider({ children }) {
  const { data: session } = useSession();
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (session?.user) {
      setUser(session.user);
    }
  }, [session]);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
} 