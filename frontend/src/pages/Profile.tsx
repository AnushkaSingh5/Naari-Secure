import { User, Settings, Bell, Shield, Globe, LogOut, ChevronRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import LanguageSwitch from '@/components/ui/LanguageSwitch';
import EmergencyContactsCard from '@/components/cards/EmergencyContactsCard';
import TravelHistoryCard from '@/components/cards/TravelHistoryCard';

const Profile = () => {
  const { t } = useLanguage();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    { icon: Bell, label: t('notificationSettings') },
    { icon: Shield, label: t('privacySecurity') },
    { icon: Settings, label: t('appSettings') },
  ];

  return (
    <Layout>
      <div className="container px-4 py-6 max-w-2xl mx-auto">
        {/* Profile Header */}
        <div className="elevated-card p-6 mb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <User className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">{user?.name || t('user')}</h1>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
              <span className="text-xs uppercase bg-primary/10 text-primary px-2 py-0.5 rounded mt-1 inline-block">
                {user?.role}
              </span>
            </div>
          </div>
        </div>


        {/* Cards Grid (Only for Girls) */}
        {user?.role === 'girl' && (
          <div className="mb-6">
            <EmergencyContactsCard />
          </div>
        )}


        {/* Menu Items */}
        <div className="elevated-card overflow-hidden mb-6">
          {menuItems.map((item, index) => (
            <button
              key={index}
              className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors border-b border-border last:border-b-0"
            >
              <div className="flex items-center gap-3">
                <item.icon className="w-5 h-5 text-muted-foreground" />
                <span className="font-medium text-foreground">{item.label}</span>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </button>
          ))}
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-full elevated-card p-4 flex items-center justify-center gap-2 text-sos hover:bg-sos/5 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-semibold">{t('logOut')}</span>
        </button>
      </div>
    </Layout>
  );
};

export default Profile;
