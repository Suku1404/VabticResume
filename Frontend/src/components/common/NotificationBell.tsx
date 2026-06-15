import { useState, useRef, useEffect } from "react";
import { Bell, X, CheckCircle, Sparkles, FileText, Target, Trash2 } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

type NotifType = "ai" | "resume" | "ats" | "system";

type Notification = {
  id: string;
  type: NotifType;
  title: string;
  message: string;
  time: string;
  read: boolean;
};

const TYPE_META: Record<NotifType, { icon: React.ElementType; color: string; bg: string }> = {
  ai: { icon: Sparkles, color: "text-violet-500 dark:text-violet-400", bg: "bg-violet-100 dark:bg-violet-500/20" },
  resume: { icon: FileText, color: "text-indigo-500 dark:text-indigo-400", bg: "bg-indigo-100 dark:bg-indigo-500/20" },
  ats: { icon: Target, color: "text-emerald-500 dark:text-emerald-400", bg: "bg-emerald-100 dark:bg-emerald-500/20" },
  system: { icon: CheckCircle, color: "text-blue-500 dark:text-blue-400", bg: "bg-blue-100 dark:bg-blue-500/20" },
};

const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: "1",
    type: "ai",
    title: "AI Resume Improved",
    message: "Your resume has been enhanced with AI suggestions. Download the updated PDF.",
    time: "Just now",
    read: false,
  },
  {
    id: "2",
    type: "ats",
    title: "ATS Score Updated",
    message: "Your latest resume scored 91% on ATS compatibility. Great job!",
    time: "2 min ago",
    read: false,
  },
  {
    id: "3",
    type: "resume",
    title: "Resume Saved",
    message: "Your resume \"MERN Stack Developer\" was saved successfully.",
    time: "10 min ago",
    read: true,
  },
  {
    id: "4",
    type: "system",
    title: "Welcome to VabticResume",
    message: "Start by choosing a template or uploading your existing resume for AI improvement.",
    time: "1 hr ago",
    read: true,
  },
];

const NotificationBell = () => {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>(INITIAL_NOTIFICATIONS);
  const panelRef = useRef<HTMLDivElement>(null);

  const unread = notifications.filter((n) => !n.read).length;

  // Close panel on click outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const clearAll = () => {
    setNotifications([]);
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen((v) => !v);
    // Mark all as read when opening
    if (!open) markAllRead();
  };

  return (
    <div className="relative" ref={panelRef}>
      {/* Bell Button */}
      <button
        onClick={handleOpen}
        className="relative rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/10 p-3 text-slate-600 dark:text-gray-300 transition-all duration-200 hover:bg-gray-100 dark:hover:bg-white/15 hover:scale-105"
        title="Notifications"
        aria-label={`Notifications${unread > 0 ? `, ${unread} unread` : ""}`}
      >
        <Bell size={20} className={open ? "text-indigo-600 dark:text-indigo-400" : ""} />
        {/* Unread badge */}
        <AnimatePresence>
          {unread > 0 && (
            <motion.span
              key="badge"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-violet-500 text-[10px] font-black text-white shadow-md"
            >
              {unread > 9 ? "9+" : unread}
            </motion.span>
          )}
        </AnimatePresence>
      </button>

      {/* Dropdown Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="panel"
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="absolute right-0 top-14 z-50 w-[360px] max-w-[calc(100vw-24px)] overflow-hidden rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-slate-900 shadow-2xl shadow-black/10 dark:shadow-black/40"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-white/10 px-5 py-4">
              <div className="flex items-center gap-2">
                <Bell size={18} className="text-indigo-600 dark:text-indigo-400" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Notifications</h3>
                {notifications.length > 0 && (
                  <span className="rounded-full bg-indigo-100 dark:bg-indigo-500/20 px-2 py-0.5 text-[11px] font-bold text-indigo-600 dark:text-indigo-300">
                    {notifications.length}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                {notifications.length > 0 && (
                  <button
                    onClick={clearAll}
                    className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-semibold text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition"
                    title="Clear all notifications"
                  >
                    <Trash2 size={13} />
                    Clear all
                  </button>
                )}
                <button
                  onClick={() => setOpen(false)}
                  className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10 hover:text-slate-800 dark:hover:text-white transition"
                  title="Close"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Notification list */}
            <div className="max-h-[380px] overflow-y-auto">
              <AnimatePresence initial={false}>
                {notifications.length === 0 ? (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center justify-center gap-3 py-12 text-center"
                  >
                    <div className="rounded-2xl bg-gray-100 dark:bg-white/10 p-4">
                      <Bell size={28} className="text-gray-400 dark:text-gray-500" />
                    </div>
                    <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">No notifications</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500">You're all caught up!</p>
                  </motion.div>
                ) : (
                  notifications.map((notif) => {
                    const meta = TYPE_META[notif.type];
                    const Icon = meta.icon;
                    return (
                      <motion.div
                        key={notif.id}
                        layout
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20, height: 0, marginBottom: 0, paddingTop: 0, paddingBottom: 0 }}
                        transition={{ duration: 0.22, ease: "easeInOut" }}
                        className="group relative flex items-start gap-3 border-b border-gray-50 dark:border-white/5 px-5 py-4 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                      >
                        {/* Icon */}
                        <div className={`mt-0.5 flex-none rounded-xl p-2 ${meta.bg}`}>
                          <Icon size={16} className={meta.color} />
                        </div>

                        {/* Content */}
                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-2">
                            <p className="text-sm font-bold text-slate-900 dark:text-white leading-tight">
                              {notif.title}
                            </p>
                            <span className="flex-none text-[11px] text-gray-400 dark:text-gray-500 mt-0.5">
                              {notif.time}
                            </span>
                          </div>
                          <p className="mt-1 text-xs leading-5 text-gray-500 dark:text-gray-400">
                            {notif.message}
                          </p>
                        </div>

                        {/* Delete Button */}
                        <button
                          onClick={() => deleteNotification(notif.id)}
                          className="absolute right-3 top-3 flex-none rounded-lg p-1 text-gray-300 dark:text-gray-600 opacity-0 group-hover:opacity-100 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-500 dark:hover:text-red-400 transition-all duration-150"
                          title="Dismiss notification"
                        >
                          <X size={14} />
                        </button>

                        {/* Unread dot */}
                        {!notif.read && (
                          <span className="absolute left-2 top-5 h-1.5 w-1.5 rounded-full bg-violet-500" />
                        )}
                      </motion.div>
                    );
                  })
                )}
              </AnimatePresence>
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
              <div className="border-t border-gray-100 dark:border-white/10 px-5 py-3">
                <p className="text-center text-xs text-gray-400 dark:text-gray-500">
                  Click <span className="font-semibold">✕</span> on any notification to dismiss it
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationBell;
