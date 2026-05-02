// src/features/notifications/hooks/useNotifications.js

import { useState, useEffect, useCallback } from "react";
import { notificationService } from "../services/notificationService";

export const useNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // دالة لجلب البيانات والعدد في نفس الوقت
  const fetchNotifications = useCallback(async () => {
    setIsLoading(true);
    try {
      const [notifsData, countData] = await Promise.all([
        notificationService.getNotifications(),
        notificationService.getUnreadCount(),
      ]);

      setNotifications(
        Array.isArray(notifsData) ? notifsData : notifsData?.data || [],
      );
      // بافتراض أن السيرفر يرجع الرقم مباشرة أو كائن { count: X }
      setUnreadCount(
        typeof countData === "number"
          ? countData
          : countData?.count || countData || 0,
      );
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // تحديث حالة إشعار واحد
  const markAsRead = async (id) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (err) {
      console.error("Failed to mark notification as read", err);
    }
  };

  // تحديث كل الإشعارات
  const markAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error("Failed to mark all as read", err);
    }
  };

  return {
    notifications,
    unreadCount,
    isLoading,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
  };
};
