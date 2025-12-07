import { useState, useEffect } from 'react';
import { Check, Star, Package, Bell, Loader2 } from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Container } from '@/components/common/Container';
import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';

// Backend Logic
import { useAuth } from '@/context/AuthContext';
import { getUserNotifications, markAsRead } from '@/services/notification.service.ts';
import type { Notification } from '@/types';

const NotificationPage = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  // 1. Fetch Notifikasi
  const fetchNotifs = async () => {
    if (!user) return;
    try {
      const data = await getUserNotifications(user.uid);
      setNotifications(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifs();
  }, [user]);

  // 2. Handler Mark All Read
  const handleMarkAllRead = async () => {
    // Optimistic Update UI
    const updated = notifications.map(n => ({ ...n, isRead: true }));
    setNotifications(updated);

    // Update Backend satu per satu (Batch update lebih baik tapi ini cukup untuk pemula)
    const unreadIds = notifications.filter(n => !n.isRead).map(n => n.id);
    await Promise.all(unreadIds.map(id => markAsRead(id)));
  };

  // 3. Helper Render Icon
  const getIcon = (type: string) => {
    switch (type) {
      case 'success': return <div className="p-3 rounded-xl bg-green-50 text-green-600"><Check size={24} /></div>;
      case 'info': return <div className="p-3 rounded-xl bg-blue-50 text-blue-600"><Bell size={24} /></div>;
      case 'warning': return <div className="p-3 rounded-xl bg-yellow-50 text-yellow-600"><Star size={24} /></div>;
      case 'error': return <div className="p-3 rounded-xl bg-red-50 text-red-600"><Package size={24} /></div>;
      default: return <div className="p-3 rounded-xl bg-gray-50 text-gray-600"><Bell size={24} /></div>;
    }
  };

  // Helper Date
  const formatDate = (isoString: string) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <DashboardLayout>
      <Container>
        <div className="max-w-4xl mx-auto pb-20">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Notifikasi</h1>
              <p className="text-gray-500 text-sm mt-1">
                {unreadCount > 0 ? `${unreadCount} notifikasi belum dibaca` : 'Semua notifikasi telah dibaca'}
              </p>
            </div>
            
            {unreadCount > 0 && (
              <Button 
                variant="outline" 
                size="sm" 
                className="gap-2"
                onClick={handleMarkAllRead}
              >
                <Check size={16} /> Tandai Semua Dibaca
              </Button>
            )}
          </div>

          {loading ? (
            <div className="text-center py-20"><Loader2 className="animate-spin text-primary mx-auto" /></div>
          ) : (
            <div className="space-y-4">
              {notifications.length > 0 ? (
                notifications.map((notif) => (
                  <Card 
                    key={notif.id} 
                    className={`p-6 flex gap-4 transition-all hover:shadow-md ${!notif.isRead ? 'border-l-4 border-l-primary bg-blue-50/10' : ''}`}
                  >
                    <div className="shrink-0">{getIcon(notif.type)}</div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h3 className={`text-base mb-1 ${!notif.isRead ? 'font-bold text-gray-900' : 'font-medium text-gray-700'}`}>
                          {notif.title}
                        </h3>
                        {!notif.isRead && <span className="w-2.5 h-2.5 rounded-full bg-blue-800 mt-1.5 shrink-0"></span>}
                      </div>
                      <p className="text-gray-500 text-sm leading-relaxed mb-2">{notif.message}</p>
                      <p className="text-xs text-gray-400">{formatDate(notif.createdAt)}</p>
                    </div>
                  </Card>
                ))
              ) : (
                <div className="text-center py-20 text-gray-400">Belum ada notifikasi.</div>
              )}
            </div>
          )}

        </div>
      </Container>
    </DashboardLayout>
  );
};

export default NotificationPage;