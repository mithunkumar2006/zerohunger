import { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const AppContext = createContext(null);

const INITIAL_NOTIFICATIONS = [
  {
    id: 'n1',
    type: 'alert',
    title: 'Surplus Food Match',
    message: 'Democracy Kitchen has matched 12kg of cooked rice and curry near you.',
    time: '5m ago',
    read: false,
    category: 'donation'
  },
  {
    id: 'n2',
    type: 'info',
    title: 'New Volunteer Active',
    message: 'Volunteer Sarah Chen is en route to pick up donation #4021.',
    time: '25m ago',
    read: false,
    category: 'delivery'
  },
  {
    id: 'n3',
    type: 'success',
    title: 'Milestone Achieved!',
    message: 'Your region has saved over 500kg of CO2 today!',
    time: '2h ago',
    read: true,
    category: 'impact'
  }
];

const INITIAL_BOT_MESSAGES = [
  {
    sender: 'bot',
    text: 'Hello! I am Gaia, your AI Hunger Intelligence Assistant. How can I help you optimize food rescue operations today?',
    time: new Date()
  }
];

export function AppProvider({ children }) {
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState(INITIAL_BOT_MESSAGES);
  const [isBotThinking, setIsBotThinking] = useState(false);
  const [preferences, setPreferences] = useState({
    enableRealtimeAlerts: true,
    highUrgencyOnly: false,
    theme: 'dark'
  });

  // Mock dynamic incoming real-time notifications
  useEffect(() => {
    if (!preferences.enableRealtimeAlerts) return;

    const messages = [
      { title: 'Surplus Pastries Alert', message: 'Vercel Bakery added 8 bags of fresh croissants.', category: 'donation' },
      { title: 'Urgent Cargo', message: 'Shelter Hope requires cooked meals for 30 beneficiaries.', category: 'ngo' },
      { title: 'Carbon Milestone', message: 'We saved another 50kg of organic waste from landfills!', category: 'impact' },
      { title: 'Volunteer Dispatch', message: 'Alex Rivera accepted pick-up route for Star Supermarket.', category: 'delivery' }
    ];

    const interval = setInterval(() => {
      const chance = Math.random();
      if (chance > 0.3) return; // 30% chance every 40s

      const template = messages[Math.floor(Math.random() * messages.length)];
      const newNotif = {
        id: `dyn_${Date.now()}`,
        type: 'alert',
        title: template.title,
        message: template.message,
        time: 'Just now',
        read: false,
        category: template.category
      };

      setNotifications(prev => [newNotif, ...prev]);
      toast.success(`🔔 ${template.title}: ${template.message}`, {
        duration: 5000,
        style: {
          background: '#0f172a',
          color: '#ffffff',
          border: '1px solid rgba(16, 185, 129, 0.2)',
          borderRadius: '16px',
        }
      });
    }, 40000);

    return () => clearInterval(interval);
  }, [preferences.enableRealtimeAlerts]);

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const markAsRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const addNotification = (title, message, category = 'info', type = 'info') => {
    const newNotif = {
      id: `man_${Date.now()}`,
      type,
      title,
      message,
      time: 'Just now',
      read: false,
      category
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const sendBotMessage = async (text) => {
    if (!text.trim()) return;

    const userMsg = { sender: 'user', text, time: new Date() };
    setChatMessages(prev => [...prev, userMsg]);
    setIsBotThinking(true);

    // Simulate AI response delay
    setTimeout(() => {
      let botResponse = '';
      const query = text.toLowerCase();

      if (query.includes('hello') || query.includes('hi') || query.includes('hey')) {
        botResponse = 'Greetings! How can I assist you in routing, freshness calculations, or donor-recipient matches?';
      } else if (query.includes('fresh') || query.includes('scanner') || query.includes('expiry')) {
        botResponse = 'Our AI Scanner analyzes cellular hydration levels and surface color patterns to forecast safe consumption boundaries within a 96.4% confidence rating.';
      } else if (query.includes('carbon') || query.includes('co2') || query.includes('saving')) {
        botResponse = 'Every kilogram of rescued cooked food prevents approximately 2.5kg of CO2 equivalent emissions. Households and restaurants earn Rescue Points matching this index!';
      } else if (query.includes('ngo') || query.includes('recommend') || query.includes('match')) {
        botResponse = 'The routing grid calculates NGO proximity, target meal requirements, and refrigeration capability to align donation batches with the most appropriate location.';
      } else if (query.includes('route') || query.includes('deliver') || query.includes('map')) {
        botResponse = 'We use Dijkstra route enhancements layered over current traffic metrics to deliver route plans that decrease volunteer delivery time by up to 22%.';
      } else {
        botResponse = "I have flagged your inquiry for our core support nodes. In the meantime, you can use the interactive charts on your dashboard to monitor system performance in real-time.";
      }

      setChatMessages(prev => [...prev, { sender: 'bot', text: botResponse, time: new Date() }]);
      setIsBotThinking(false);
    }, 1200);
  };

  const clearChat = () => {
    setChatMessages(INITIAL_BOT_MESSAGES);
  };

  return (
    <AppContext.Provider
      value={{
        notifications,
        unreadCount: notifications.filter(n => !n.read).length,
        markAllAsRead,
        markAsRead,
        addNotification,
        isChatOpen,
        setIsChatOpen,
        chatMessages,
        sendBotMessage,
        isBotThinking,
        clearChat,
        preferences,
        setPreferences
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used inside an AppProvider');
  }
  return context;
}
