"use client";

import { useState } from "react";
import { useBrowserNotification } from "./useBrowserNotification";
import { Bell, CheckCircle, Info } from "lucide-react";
import { useToast } from "@/components/ui/Toast";

export default function NotificationPage() {
  const { sendNotification, permission, isSupported } =
    useBrowserNotification();
  const [notifications, setNotifications] = useState<
    { id: number; title: string; body: string; time: Date }[]
  >([]);
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  const simulateStateChange = () => {
    const randomMsgs = [
      "Server upgraded successfully!",
      "New friend request from Alex.",
      "Leave application approved.",
    ];
    const msg = randomMsgs[Math.floor(Math.random() * randomMsgs.length)];

    // Add to internal app list
    setNotifications((prev) => [
      {
        id: Date.now(),
        title: "App Notification",
        body: msg,
        time: new Date(),
      },
      ...prev,
    ]);

    // Send browser notification
    sendNotification("App Notification", { body: msg });

    toast.success(msg);
  };

  const unreadCount = notifications.length;

  return (
    <div className="min-h-screen bg-neutral-50 p-6 md:p-12 flex flex-col items-center font-sans text-neutral-900">
      {/* Navbar / Header */}
      <div className="w-full max-w-4xl bg-white shadow-sm border border-neutral-200 rounded-xl p-4 md:px-6 flex justify-between items-center mb-8 relative">
        <h1 className="text-xl font-bold tracking-tight">Dashboard</h1>

        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle notifications"
            className="p-2 rounded-full hover:bg-neutral-100 transition-colors relative focus:outline-none focus:ring-2 focus:ring-neutral-200"
          >
            <Bell className="w-6 h-6 text-neutral-600" />
            {unreadCount > 0 && (
              <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center transform translate-x-1 -translate-y-1 border-2 border-white shadow-sm">
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            )}
          </button>

          {/* Popover Panel */}
          {isOpen && (
            <div className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-xl border border-neutral-100 overflow-hidden z-50">
              <div className="p-4 bg-neutral-50/50 border-b border-neutral-100 flex justify-between items-center">
                <h3 className="font-semibold text-[15px]">Notifications</h3>
                {unreadCount > 0 && (
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">
                    {unreadCount} new
                  </span>
                )}
              </div>

              <div className="max-h-96 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-8 text-center text-neutral-400 text-sm flex flex-col items-center">
                    <Bell className="w-8 h-8 mb-3 opacity-20" />
                    No new notifications
                  </div>
                ) : (
                  <div className="flex flex-col">
                    {notifications.map((n) => (
                      <div
                        key={n.id}
                        className="p-4 border-b border-neutral-50 hover:bg-neutral-50 transition-colors flex gap-3 group cursor-default"
                      >
                        <div className="mt-0.5 shrink-0">
                          <div className="bg-blue-50 p-1.5 rounded-full group-hover:bg-blue-100 transition-colors">
                            <Info className="w-4 h-4 text-blue-600" />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-[14px] font-semibold text-neutral-800">
                            {n.title}
                          </h4>
                          <p className="text-[13px] text-neutral-600 mt-0.5 leading-relaxed truncate">
                            {n.body}
                          </p>
                          <span className="text-[11px] text-neutral-400 mt-1.5 block font-medium">
                            {n.time.toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {notifications.length > 0 && (
                <button
                  onClick={() => setNotifications([])}
                  className="w-full p-3 text-[13px] font-medium text-neutral-500 hover:text-neutral-700 hover:bg-neutral-50 transition-colors border-t border-neutral-100"
                >
                  Clear all notifications
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Main Content Card */}
      <div className="max-w-4xl w-full bg-white rounded-2xl shadow-sm border border-neutral-200 p-8 md:p-12 text-center relative overflow-hidden">
        {/* Decorative background element */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-blue-50 rounded-full blur-3xl opacity-50 pointer-events-none" />

        <div className="relative z-10 max-w-lg mx-auto">
          <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm border border-blue-100">
            <Bell className="w-8 h-8 text-blue-600" />
          </div>

          <h2 className="text-2xl font-bold tracking-tight mb-3">
            Test Notifications
          </h2>
          <p className="text-[15px] text-neutral-500 mb-8 leading-relaxed">
            Trigger a manual state change to simulate receiving an event. This
            will push a new item to your notification panel and send a native
            browser alert.
          </p>

          <button
            onClick={simulateStateChange}
            disabled={!isSupported}
            className={`bg-neutral-900 hover:bg-neutral-800 text-white px-6 py-2.5 rounded-xl text-[14px] font-semibold transition-all shadow-[0_4px_14px_0_rgba(0,0,0,0.1)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.15)] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:ring-offset-2 flex items-center justify-center gap-2 mx-auto ${
              !isSupported
                ? "opacity-50 cursor-not-allowed hover:bg-neutral-900 active:scale-100 hover:shadow-[0_4px_14px_0_rgba(0,0,0,0.1)]"
                : ""
            }`}
          >
            Trigger Event
          </button>

          <div className="mt-10 pt-6 border-t border-neutral-100 flex items-center justify-center gap-2">
            <CheckCircle
              className={`w-4 h-4 ${permission === "granted" ? "text-emerald-500" : "text-neutral-300"}`}
            />
            <p className="text-[13px] text-neutral-500 font-medium">
              Native API status:{" "}
              {!isSupported ? (
                <span className="ml-1 text-rose-600">Unsupported</span>
              ) : (
                <span
                  className={`ml-1 ${
                    permission === "granted"
                      ? "text-emerald-600"
                      : permission === "denied"
                        ? "text-rose-600"
                        : "text-amber-600"
                  }`}
                >
                  {permission || "checking..."}
                </span>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
