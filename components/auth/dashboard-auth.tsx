"use client";

import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type DashboardAuthSource = "jwt" | "nextauth";

type DashboardUser = {
  id?: string;
  name?: string | null;
  email?: string | null;
  plan?: string;
  dailyLimit?: number | null;
  generationsUsedToday?: number;
  remainingGenerations?: number | null;
  hasUnlimitedGenerations?: boolean;
  authSource: DashboardAuthSource;
};

type JwtMeResponse = {
  success?: boolean;
  user?: {
    id: string;
    name?: string | null;
    email?: string | null;
    plan?: string;
    dailyLimit?: number | null;
    generationsUsedToday?: number;
    remainingGenerations?: number | null;
    hasUnlimitedGenerations?: boolean;
    authSource?: DashboardAuthSource;
  };
};

type DashboardAuthContextValue = {
  user: DashboardUser;
  displayName: string;
  initials: string;
  loggingOut: boolean;
  logout: () => Promise<void>;
};

const DashboardAuthContext = createContext<DashboardAuthContextValue | null>(
  null
);

export function DashboardAuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [apiUser, setApiUser] = useState<DashboardUser | null>(null);
  const [apiChecked, setApiChecked] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const apiUserAuthSource = apiUser?.authSource;
  const sessionUserEmail = session?.user?.email ?? null;
  const sessionUserName = session?.user?.name ?? null;

  useEffect(() => {
    let active = true;

    async function loadApiUser() {
      try {
        const response = await fetch("/api/auth/me", {
          cache: "no-store",
        });

        if (!response.ok) {
          if (active) {
            setApiUser(null);
          }
          return;
        }

        const data = (await response.json()) as JwtMeResponse;

        if (active && data.success && data.user) {
          setApiUser({
            ...data.user,
            authSource: data.user.authSource ?? "jwt",
          });
        } else if (active) {
          setApiUser(null);
        }
      } catch {
        if (active) {
          setApiUser(null);
        }
      } finally {
        if (active) {
          setApiChecked(true);
        }
      }
    }

    loadApiUser();

    const refreshApiUser = () => {
      void loadApiUser();
    };

    window.addEventListener("aiflow:generation-saved", refreshApiUser);
    window.addEventListener("aiflow:user-updated", refreshApiUser);

    return () => {
      active = false;
      window.removeEventListener("aiflow:generation-saved", refreshApiUser);
      window.removeEventListener("aiflow:user-updated", refreshApiUser);
    };
  }, []);

  const nextAuthUser = useMemo<DashboardUser | null>(() => {
    if (status !== "authenticated" || (!sessionUserName && !sessionUserEmail)) {
      return null;
    }

    return {
      name: sessionUserName,
      email: sessionUserEmail,
      authSource: "nextauth",
    };
  }, [sessionUserEmail, sessionUserName, status]);

  const user = apiUser ?? nextAuthUser;
  const authResolved = apiChecked && status !== "loading";

  useEffect(() => {
    if (authResolved && !user && !loggingOut) {
      router.replace("/login");
    }
  }, [authResolved, loggingOut, router, user]);

  const logout = useCallback(async () => {
    setLoggingOut(true);

    try {
      if (apiUserAuthSource === "jwt") {
        await fetch("/api/auth/logout", {
          method: "POST",
        });
      }

      if (status === "authenticated") {
        await signOut({ callbackUrl: "/login" });
        return;
      }

      router.replace("/login");
      router.refresh();
    } catch {
      router.replace("/login");
    }
  }, [apiUserAuthSource, router, status]);

  const displayName = getDisplayName(user);
  const initials = getInitials(displayName);

  const value = useMemo<DashboardAuthContextValue | null>(() => {
    if (!user) {
      return null;
    }

    return {
      user,
      displayName,
      initials,
      loggingOut,
      logout,
    };
  }, [displayName, initials, loggingOut, logout, user]);

  if (!authResolved || !value) {
    return <main className="min-h-screen bg-[#F8FAFC]" />;
  }

  return (
    <DashboardAuthContext.Provider value={value}>
      {children}
    </DashboardAuthContext.Provider>
  );
}

export function useDashboardAuth() {
  const context = useContext(DashboardAuthContext);

  if (!context) {
    throw new Error(
      "useDashboardAuth must be used inside DashboardAuthProvider."
    );
  }

  return context;
}

export function DashboardUserMenu() {
  const { displayName, initials, user } = useDashboardAuth();

  return (
    <div className="hidden items-center gap-3 rounded-[18px] border border-[#E2E8F0] bg-white px-3 py-2 shadow-sm sm:flex">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#0F172A] text-sm font-black text-white">
        {initials}
      </div>
      <div>
        <p className="text-sm font-bold leading-none text-[#0F172A]">
          {displayName}
        </p>
        <p className="mt-1 text-xs font-medium text-slate-500">
          {getUsageSubtitle(user)}
        </p>
      </div>
    </div>
  );
}

export function DashboardUsageSummary() {
  const { user } = useDashboardAuth();

  return (
    <>
      <div className="flex items-center justify-between text-sm font-semibold">
        <span>Generations</span>
        <span className="text-[#0EA5E9]">{getUsageMeterLabel(user)}</span>
      </div>
      <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200">
        <div
          className="h-full rounded-full bg-[#0EA5E9]"
          style={{ width: getUsageProgressWidth(user) }}
        />
      </div>
    </>
  );
}

export function DashboardUsageStatValue() {
  const { user } = useDashboardAuth();

  return <>{getUsageStatValue(user)}</>;
}

export function DashboardGreeting() {
  const { displayName } = useDashboardAuth();

  return <>Welcome back, {getFirstName(displayName)}.</>;
}

function getDisplayName(user: DashboardUser | null) {
  const name = user?.name?.trim();
  const email = user?.email?.trim();

  return name || email || "User";
}

function getFirstName(displayName: string) {
  if (displayName.includes("@")) {
    return displayName.split("@")[0] || "there";
  }

  return displayName.split(/\s+/)[0] || "there";
}

function getInitials(displayName: string) {
  const cleanedName = displayName.trim();

  if (!cleanedName) {
    return "U";
  }

  const source = cleanedName.includes("@")
    ? cleanedName.split("@")[0]
    : cleanedName;

  const parts = source
    .split(/\s+/)
    .map((part) => part.replace(/[^a-zA-Z0-9]/g, ""))
    .filter(Boolean);

  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }

  return (parts[0] || "User").slice(0, 2).toUpperCase();
}

function getUsageSubtitle(user: DashboardUser) {
  if (user.hasUnlimitedGenerations) {
    return "Unlimited generations";
  }

  if (typeof user.remainingGenerations === "number") {
    return `${user.remainingGenerations} generations left`;
  }

  return "Small Business";
}

function getUsageMeterLabel(user: DashboardUser) {
  if (user.hasUnlimitedGenerations) {
    return "Unlimited";
  }

  const dailyLimit = user.dailyLimit ?? 10;
  const remainingGenerations = user.remainingGenerations ?? dailyLimit;

  return `${remainingGenerations} / ${dailyLimit} left`;
}

function getUsageStatValue(user: DashboardUser) {
  if (user.hasUnlimitedGenerations) {
    return "Unlimited";
  }

  const dailyLimit = user.dailyLimit ?? 10;
  const remainingGenerations = user.remainingGenerations ?? dailyLimit;

  return `${remainingGenerations} / ${dailyLimit}`;
}

function getUsageProgressWidth(user: DashboardUser) {
  if (user.hasUnlimitedGenerations) {
    return "100%";
  }

  const dailyLimit = user.dailyLimit ?? 10;

  if (dailyLimit <= 0) {
    return "0%";
  }

  const remainingGenerations = user.remainingGenerations ?? dailyLimit;
  const percent = Math.max(
    0,
    Math.min(100, (remainingGenerations / dailyLimit) * 100)
  );

  return `${percent}%`;
}
