import { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Inventory from './pages/Inventory';
import Billing from './pages/Billing';
import Settings from './pages/Settings';
import Login from './pages/Login';
import Signup from './pages/Signup';

const INITIAL_INVENTORY = [
  { id: 'PROD-001', name: 'Wireless Mouse', category: 'Electronics', price: 1200.00, quantity: 45, status: 'In Stock' },
  { id: 'PROD-002', name: 'Mechanical Keyboard', category: 'Electronics', price: 4500.00, quantity: 8, status: 'Low Stock' },
  { id: 'PROD-003', name: 'USB-C Hub', category: 'Peripherals', price: 2500.00, quantity: 150, status: 'In Stock' },
  { id: 'PROD-004', name: '27" 4K Monitor', category: 'Electronics', price: 28000.00, quantity: 0, status: 'Out of Stock' },
  { id: 'PROD-005', name: 'Desk Mat (Large)', category: 'Office Supplies', price: 800.00, quantity: 4, status: 'Low Stock' }
];

const INITIAL_TRANSACTIONS = [
  { id: 'TRX-9842', product: 'Wireless Mouse', quantity: 2, total: 2400.00, status: 'Paid' },
  { id: 'TRX-9841', product: 'Mechanical Keyboard', quantity: 1, total: 4500.00, status: 'Paid' },
  { id: 'TRX-9840', product: 'USB-C Hub', quantity: 5, total: 12500.00, status: 'Paid' },
  { id: 'TRX-9839', product: 'Monitor Stand', quantity: 1, total: 3500.00, status: 'Paid' },
  { id: 'TRX-9838', product: 'HDMI Cable 2m', quantity: 10, total: 5000.00, status: 'Paid' }
];

function App() {
  const [userEmail, setUserEmail] = useState(localStorage.getItem('smartstock_user_email'));
  const [user, setUser] = useState(localStorage.getItem('smartstock_user'));

  const [inventory, setInventory] = useState(() => {
    if (!userEmail) return [];
    const data = localStorage.getItem(`smartstock_inventory_${userEmail}`);
    return data ? JSON.parse(data) : [];
  });

  const [transactions, setTransactions] = useState(() => {
    if (!userEmail) return [];
    const data = localStorage.getItem(`smartstock_transactions_${userEmail}`);
    return data ? JSON.parse(data) : [];
  });

  // Reload data when user changes
  useEffect(() => {
    if (userEmail) {
      const invData = localStorage.getItem(`smartstock_inventory_${userEmail}`);
      setInventory(invData ? JSON.parse(invData) : []);
      
      const trxData = localStorage.getItem(`smartstock_transactions_${userEmail}`);
      setTransactions(trxData ? JSON.parse(trxData) : []);
    } else {
      setInventory([]);
      setTransactions([]);
    }
  }, [userEmail]);

  useEffect(() => {
    if (userEmail) {
      localStorage.setItem(`smartstock_inventory_${userEmail}`, JSON.stringify(inventory));
    }
  }, [inventory, userEmail]);

  useEffect(() => {
    if (userEmail) {
      localStorage.setItem(`smartstock_transactions_${userEmail}`, JSON.stringify(transactions));
    }
  }, [transactions, userEmail]);

  const [notifications, setNotifications] = useState([]);
  const [dismissedIds, setDismissedIds] = useState(new Set());

  // Browser Notification Request
  useEffect(() => {
    if ("Notification" in window) {
      Notification.requestPermission();
    }
  }, []);

  const audioRef = useRef(null);

  const playAlertSound = () => {
    // Stop any currently playing audio
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    
    const audio = new Audio('/sound/soundreality-police-operation-siren-144229.mp3');
    audio.loop = true;
    audio.play().catch(err => console.log('Audio play failed:', err));
    audioRef.current = audio;
  };

  const stopAlertSound = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
  };

  const sendNativeNotification = (title, body) => {
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification(title, {
        body,
        icon: '/logo.png' 
      });
      playAlertSound();
    }
  };

  // Check for low stock and generate notifications
  useEffect(() => {
    if (userEmail) {
      const lowStock = inventory.filter(item => item.quantity > 0 && item.quantity <= 5);
      
      const newNotifications = lowStock
        .filter(item => !dismissedIds.has(`low-stock-${item.id}-${item.quantity}`))
        .map(item => ({
          id: `low-stock-${item.id}-${item.quantity}`,
          title: 'Low Stock Alert',
          message: `Your product "${item.name}" is running low (${item.quantity} left).`,
          type: 'warning',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }));
      
      // Trigger Native Device Notification & Sound
      newNotifications.forEach(n => {
        const isCurrentlyVisible = notifications.some(old => old.id === n.id);
        if (!isCurrentlyVisible) {
          sendNativeNotification(n.title, n.message);
          playAlertSound();
        }
      });

      if (newNotifications.length > 0) {
        setNotifications(prev => {
          const existingIds = prev.map(n => n.id);
          const filteredNew = newNotifications.filter(n => !existingIds.includes(n.id));
          if (filteredNew.length === 0) return prev;
          return [...filteredNew, ...prev].slice(0, 5);
        });
      }
    }
  }, [inventory, userEmail, dismissedIds]);

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    setDismissedIds(prev => new Set([...prev, id]));
    stopAlertSound();
  };

  const handleLogout = () => {
    localStorage.removeItem('smartstock_user');
    localStorage.removeItem('smartstock_user_email');
    setUser(null);
    setUserEmail(null);
  };

  return (
    <Router>
      <Routes>
        <Route path="/login" element={user ? <Navigate to="/" /> : <Login setUser={setUser} setUserEmail={setUserEmail} />} />
        <Route path="/signup" element={user ? <Navigate to="/" /> : <Signup setUser={setUser} setUserEmail={setUserEmail} />} />
        
        <Route path="/" element={
          user ? (
            <Layout user={user} onLogout={handleLogout} notifications={notifications} removeNotification={removeNotification}>
              <Dashboard inventory={inventory} transactions={transactions} user={user} />
            </Layout>
          ) : <Navigate to="/login" />
        } />
        
        <Route path="/inventory" element={
          user ? (
            <Layout user={user} onLogout={handleLogout} notifications={notifications} removeNotification={removeNotification}>
              <Inventory inventory={inventory} setInventory={setInventory} />
            </Layout>
          ) : <Navigate to="/login" />
        } />

        <Route path="/billing" element={
          user ? (
            <Layout user={user} onLogout={handleLogout} notifications={notifications} removeNotification={removeNotification}>
              <Billing inventory={inventory} setInventory={setInventory} setTransactions={setTransactions} />
            </Layout>
          ) : <Navigate to="/login" />
        } />

        <Route path="/settings" element={
          user ? (
            <Layout user={user} onLogout={handleLogout} notifications={notifications} removeNotification={removeNotification}>
              <Settings />
            </Layout>
          ) : <Navigate to="/login" />
        } />
        
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
