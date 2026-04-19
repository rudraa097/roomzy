// ─────────────────────────────────────────────────────────────────────────────
//  AppContext — centralises all session state that previously lived in
//  scattered localStorage calls across App.tsx and ProfilePage.tsx.
//
//  localStorage is still used here for lightweight client-side persistence
//  of UI preferences (role, plan, login state) — these are NOT sensitive
//  and are fine to keep in localStorage. Core data (rooms, bookings,
//  payments) comes from the API, not localStorage.
// ─────────────────────────────────────────────────────────────────────────────

import React, { createContext, useContext, useState, useEffect } from "react";

export type UserRole = "tenant" | "owner";
export type UserPlan = "free" | "standard" | "premium" | "broker";

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  city: string;
  avatar: string;
}

const DEFAULT_PROFILE: UserProfile = {
  name: "Demo User",
  email: "demo@roomzy.in",
  phone: "9876543210",
  city: "Mumbai",
  avatar: "https://i.pravatar.cc/80?img=10",
};

interface AppContextValue {
  isLoggedIn: boolean;
  setIsLoggedIn: (v: boolean) => void;
  userRole: UserRole;
  setUserRole: (r: UserRole) => void;
  userPlan: UserPlan;
  setUserPlan: (p: UserPlan) => void;
  userProfile: UserProfile;
  setUserProfile: (p: UserProfile) => void;
  logout: () => void;
}

const AppContext = createContext<AppContextValue | null>(null);

function readLS<T>(key: string, fallback: T): T {
  try {
    const val = localStorage.getItem(key);
    return val ? (JSON.parse(val) as T) : fallback;
  } catch {
    return fallback;
  }
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isLoggedIn, setIsLoggedInRaw] = useState<boolean>(() =>
    readLS("rz_logged_in", false)
  );
  const [userRole, setUserRoleRaw] = useState<UserRole>(() =>
    readLS("rz_role", "tenant")
  );
  const [userPlan, setUserPlanRaw] = useState<UserPlan>(() =>
    readLS("rz_plan", "free")
  );
  const [userProfile, setUserProfileRaw] = useState<UserProfile>(() =>
    readLS("rz_profile", DEFAULT_PROFILE)
  );

  // Sync to localStorage whenever state changes
  const setIsLoggedIn = (v: boolean) => {
    localStorage.setItem("rz_logged_in", JSON.stringify(v));
    setIsLoggedInRaw(v);
  };
  const setUserRole = (r: UserRole) => {
    localStorage.setItem("rz_role", JSON.stringify(r));
    setUserRoleRaw(r);
  };
  const setUserPlan = (p: UserPlan) => {
    localStorage.setItem("rz_plan", JSON.stringify(p));
    setUserPlanRaw(p);
  };
  const setUserProfile = (p: UserProfile) => {
    localStorage.setItem("rz_profile", JSON.stringify(p));
    setUserProfileRaw(p);
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUserRole("tenant");
    setUserPlan("free");
    localStorage.removeItem("rz_logged_in");
    localStorage.removeItem("rz_role");
    localStorage.removeItem("rz_plan");
  };

  return (
    <AppContext.Provider
      value={{
        isLoggedIn,
        setIsLoggedIn,
        userRole,
        setUserRole,
        userPlan,
        setUserPlan,
        userProfile,
        setUserProfile,
        logout,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = (): AppContextValue => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside AppProvider");
  return ctx;
};
