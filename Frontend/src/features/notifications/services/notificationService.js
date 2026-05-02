// src/features/notifications/services/notificationService.js

import { apiClient } from "../../../core/network/apiClient";

export const notificationService = {
  // جلب الإشعارات مع دعم الفلاتر
  getNotifications: async (unreadOnly = false, take = 50) => {
    const response = await apiClient.get("/notifications", {
      params: { unreadOnly, take },
    });
    return response.data;
  },

  // جلب عدد الإشعارات غير المقروءة
  getUnreadCount: async () => {
    const response = await apiClient.get("/notifications/unread-count");
    return response.data;
  },

  // تحديد إشعار كمقروء
  markAsRead: async (id) => {
    const response = await apiClient.post(`/notifications/${id}/read`);
    return response.data;
  },

  // تحديد كل الإشعارات كمقروءة
  markAllAsRead: async () => {
    const response = await apiClient.post("/notifications/read-all");
    return response.data;
  },

  // إنشاء إشعار (للاستخدام الإداري إن لزم الأمر)
  createNotification: async (data) => {
    const response = await apiClient.post("/notifications", data);
    return response.data;
  },
};
