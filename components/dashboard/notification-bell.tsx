"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { Bell, Check } from "lucide-react";

type DashboardNotification = {
  id: string;
  title: string;
  message: string;
  type: "success" | "info" | "warning";
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
};

type NotificationsResponse = {
  success?: boolean;
  notifications?: DashboardNotification[];
  unreadCount?: number;
  message?: string;
};

export function NotificationBell() {
  const [notifications, setNotifications] = useState<DashboardNotification[]>(
    []
  );
  const [unreadCount, setUnreadCount] = useState(0);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [markingRead, setMarkingRead] = useState(false);
  const [error, setError] = useState("");
  const rootRef = useRef<HTMLDivElement>(null);

  const loadNotifications = useCallback(async () => {
    try {
      const response = await fetch("/api/notifications", {
        cache: "no-store",
      });
      const data = (await response.json()) as NotificationsResponse;

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Could not load notifications.");
      }

      setNotifications(data.notifications ?? []);
      setUnreadCount(data.unreadCount ?? 0);
    } catch (error) {
      console.log(error);
      setError("Could not load notifications.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void loadNotifications();
    }, 0);

    const refreshNotifications = () => {
      void loadNotifications();
    };

    window.addEventListener("aiflow:generation-saved", refreshNotifications);

    return () => {
      window.clearTimeout(timeoutId);
      window.removeEventListener(
        "aiflow:generation-saved",
        refreshNotifications
      );
    };
  }, [loadNotifications]);

  useEffect(() => {
    if (!open) return;

    const closeOnOutsideClick = (event: MouseEvent | TouchEvent) => {
      if (
        rootRef.current &&
        event.target instanceof Node &&
        !rootRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", closeOnOutsideClick);
    document.addEventListener("touchstart", closeOnOutsideClick);

    return () => {
      document.removeEventListener("mousedown", closeOnOutsideClick);
      document.removeEventListener("touchstart", closeOnOutsideClick);
    };
  }, [open]);

  const toggleNotifications = () => {
    const nextOpen = !open;

    setOpen(nextOpen);

    if (nextOpen) {
      setLoading(true);
      setError("");
      void loadNotifications();
    }
  };

  const markAllAsRead = async () => {
    if (markingRead || unreadCount === 0) return;

    setMarkingRead(true);
    setError("");

    try {
      const response = await fetch("/api/notifications", {
        method: "PATCH",
      });
      const data = (await response.json()) as NotificationsResponse;

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Could not update notifications.");
      }

      setNotifications((currentNotifications) =>
        currentNotifications.map((notification) => ({
          ...notification,
          isRead: true,
        }))
      );
      setUnreadCount(0);
    } catch (error) {
      console.log(error);
      setError("Could not mark notifications as read.");
    } finally {
      setMarkingRead(false);
    }
  };

  const badgeLabel = unreadCount > 99 ? "99+" : String(unreadCount);

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        aria-label="Open notifications"
        aria-expanded={open}
        onClick={toggleNotifications}
        className="relative flex h-12 w-12 items-center justify-center rounded-full border border-[#E2E8F0] bg-white shadow-sm transition hover:border-[#0EA5E9]"
      >
        <Bell size={20} className="text-[#0F172A]" />
        {unreadCount > 0 ? (
          <span className="absolute right-0 top-0 flex h-5 min-w-5 items-center justify-center rounded-full border-2 border-white bg-[#0EA5E9] px-1 text-[10px] font-bold leading-none text-white">
            {badgeLabel}
          </span>
        ) : null}
      </button>

      {open ? (
        <div className="absolute right-0 top-[calc(100%+0.75rem)] z-50 w-[min(92vw,380px)] overflow-hidden rounded-[20px] border border-[#E2E8F0] bg-white shadow-[0_24px_70px_rgba(15,23,42,0.16)] sm:w-[380px]">
          <div className="flex items-center justify-between gap-3 border-b border-[#E2E8F0] px-4 py-4">
            <div>
              <p className="text-sm font-black text-[#0F172A]">
                Notifications
              </p>
              <p className="mt-1 text-xs font-semibold text-slate-500">
                {unreadCount} unread
              </p>
            </div>
            <button
              type="button"
              onClick={markAllAsRead}
              disabled={markingRead || unreadCount === 0}
              className="inline-flex h-9 items-center justify-center gap-2 rounded-[12px] border border-[#BAE6FD] bg-[#F0F9FF] px-3 text-xs font-bold text-[#0369A1] transition hover:border-[#0EA5E9] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Check size={14} />
              {markingRead ? "Marking..." : "Mark all as read"}
            </button>
          </div>

          <div className="max-h-[min(70vh,440px)] overflow-y-auto">
            {loading ? (
              <div className="px-4 py-8 text-center text-sm font-semibold text-slate-500">
                Loading notifications...
              </div>
            ) : error ? (
              <div className="px-4 py-8 text-center text-sm font-semibold text-red-600">
                {error}
              </div>
            ) : notifications.length === 0 ? (
              <div className="px-4 py-8 text-center text-sm font-semibold text-slate-500">
                No notifications yet.
              </div>
            ) : (
              <div className="divide-y divide-[#E2E8F0]">
                {notifications.map((notification) => (
                  <article
                    key={notification.id}
                    className={[
                      "flex min-w-0 gap-3 px-4 py-4",
                      notification.isRead ? "bg-white" : "bg-[#F0F9FF]",
                    ].join(" ")}
                  >
                    <span
                      className={[
                        "mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full",
                        notification.isRead ? "bg-slate-200" : "bg-[#0EA5E9]",
                      ].join(" ")}
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex min-w-0 items-start justify-between gap-3">
                        <p className="min-w-0 break-words text-sm font-black leading-5 text-[#0F172A]">
                          {notification.title}
                        </p>
                        <span className="shrink-0 text-xs font-semibold text-slate-400">
                          {formatTimeAgo(notification.createdAt)}
                        </span>
                      </div>
                      <p className="mt-1 break-words text-sm leading-5 text-slate-500">
                        {notification.message}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function formatTimeAgo(value: string) {
  const timestamp = new Date(value).getTime();

  if (!value || Number.isNaN(timestamp)) {
    return "Just now";
  }

  const seconds = Math.max(0, Math.floor((Date.now() - timestamp) / 1000));

  if (seconds < 60) {
    return "Just now";
  }

  const minutes = Math.floor(seconds / 60);

  if (minutes < 60) {
    return `${minutes}m ago`;
  }

  const hours = Math.floor(minutes / 60);

  if (hours < 24) {
    return `${hours}h ago`;
  }

  const days = Math.floor(hours / 24);

  if (days < 7) {
    return `${days}d ago`;
  }

  const weeks = Math.floor(days / 7);

  if (weeks < 5) {
    return `${weeks}w ago`;
  }

  const months = Math.floor(days / 30);

  if (months < 12) {
    return `${months}mo ago`;
  }

  const years = Math.floor(days / 365);

  return `${years}y ago`;
}
