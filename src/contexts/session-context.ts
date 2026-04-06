"use client";

import { createContext, useContext } from "react";
import type { UserRole } from "@/lib/auth";

export type SessionUser = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
};

export type SessionContextType = {
  user: SessionUser | null;
  isPending: boolean;
};

export const SessionContext = createContext<SessionContextType>({
  user: null,
  isPending: true,
});

export const useSessionContext = () => useContext(SessionContext);
