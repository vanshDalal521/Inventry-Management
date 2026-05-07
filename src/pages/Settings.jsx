import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Bell, Shield, Database, Trash2, Save, CheckCircle } from 'lucide-react';

function Settings() {
  const [user, setUser] = useState(localStorage.getItem('smartstock_user') || 'Admin');
  const [email, setEmail] = useState('admin@smartstock.com');
  const [phone, setPhone] = useState('+91 98765 43210');
  const [notifications, setNotifications] = useState(true);
  const [saved, setSaved] = useState(false);

  // Sync with current user data on mount
  React.useEffect(() => {
    const accounts = JSON.parse(localStorage.getItem('smartstock_accounts') || '[]');
    const currentUser = accounts.find(acc => acc.name === user);
    if (currentUser) {
      setEmail(currentUser.email);
      setPhone(currentUser.phone);
    }
  }, [user]);

  const handleSave = (e) => {
    e.preventDefault();
    localStorage.setItem('smartstock_user', user);
    
    // Update simulated database
    const accounts = JSON.parse(localStorage.getItem('smartstock_accounts') || '[]');
    const updatedAccounts = accounts.map(acc => {
      if (acc.email === email) {
        return { ...acc, name: user, phone: phone };
      }
      return acc;
    });
    localStorage.setItem('smartstock_accounts', JSON.stringify(updatedAccounts));

    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleClearData = () => {
    if (window.confirm('Are you sure you want to clear all inventory and transaction data? This cannot be undone.')) {
      localStorage.removeItem('smartstock_inventory');
      localStorage.removeItem('smartstock_transactions');
      window.location.reload();
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <header style={{ marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2.2rem', fontWeight: 800, letterSpacing: '-1px', marginBottom: '0.5rem' }}>System Settings</h1>
        <p style={{ color: 'var(--text-dim)' }}>Manage your profile and application preferences</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '2rem' }}>
        {/* Navigation / Info Column */}
        <div className="space-y-4">
          <div className="glass-panel modern-card" style={{ padding: '1.5rem' }}>
            <div className="flex-row" style={{ marginBottom: '1rem', color: 'var(--primary)' }}>
              <User size={20} />
              <span style={{ fontWeight: 600 }}>Account Profile</span>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Update your personal information and how it appears across the dashboard.
            </p>
          </div>

          <div className="glass-panel modern-card" style={{ padding: '1.5rem' }}>
            <div className="flex-row" style={{ marginBottom: '1rem', color: 'var(--secondary)' }}>
              <Shield size={20} />
              <span style={{ fontWeight: 600 }}>Security</span>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Change your password and manage session security settings.
            </p>
          </div>

          <div className="glass-panel modern-card" style={{ padding: '1.5rem', border: '1px solid rgba(244, 63, 94, 0.2)' }}>
            <div className="flex-row" style={{ marginBottom: '1rem', color: 'var(--accent)' }}>
              <Database size={20} />
              <span style={{ fontWeight: 600 }}>Data Management</span>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
              Wipe all local storage data and reset the application to its initial state.
            </p>
            <button 
              onClick={handleClearData}
              className="action-btn" 
              style={{ background: 'rgba(244, 63, 94, 0.1)', color: 'var(--accent)', width: '100%', justifyContent: 'center' }}
            >
              <Trash2 size={16} /> Reset All Data
            </button>
          </div>
        </div>

        {/* Form Column */}
        <div className="glass-panel modern-card" style={{ padding: '2.5rem' }}>
          <form onSubmit={handleSave} className="space-y-4">
            <div style={{ marginBottom: '2rem' }}>
              <label style={{ display: 'block', color: 'var(--text-dim)', fontSize: '0.85rem', marginBottom: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>Full Name</label>
              <input 
                type="text" 
                value={user}
                onChange={(e) => setUser(e.target.value)}
                style={{ 
                  width: '100%', 
                  background: 'rgba(255,255,255,0.03)', 
                  border: '1px solid var(--glass-border)', 
                  padding: '1rem', 
                  borderRadius: '12px', 
                  color: 'white',
                  fontSize: '1rem',
                  outline: 'none'
                }}
              />
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <label style={{ display: 'block', color: 'var(--text-dim)', fontSize: '0.85rem', marginBottom: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>Email Address</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ 
                  width: '100%', 
                  background: 'rgba(255,255,255,0.03)', 
                  border: '1px solid var(--glass-border)', 
                  padding: '1rem', 
                  borderRadius: '12px', 
                  color: 'white',
                  fontSize: '1rem',
                  outline: 'none'
                }}
              />
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <label style={{ display: 'block', color: 'var(--text-dim)', fontSize: '0.85rem', marginBottom: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>Phone Number</label>
              <input 
                type="tel" 
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                style={{ 
                  width: '100%', 
                  background: 'rgba(255,255,255,0.03)', 
                  border: '1px solid var(--glass-border)', 
                  padding: '1rem', 
                  borderRadius: '12px', 
                  color: 'white',
                  fontSize: '1rem',
                  outline: 'none'
                }}
              />
            </div>

            <div style={{ marginBottom: '2.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '12px' }}>
              <div className="flex-row">
                <Bell size={20} color="var(--primary)" />
                <div>
                  <div style={{ fontWeight: 600 }}>Stock Alerts</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Notify when items are low on stock</div>
                </div>
              </div>
              <input 
                type="checkbox" 
                checked={notifications}
                onChange={(e) => setNotifications(e.target.checked)}
                style={{ width: '20px', height: '20px', accentColor: 'var(--primary)' }}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
              <button type="submit" className="action-btn btn-glow" style={{ padding: '1rem 2.5rem' }}>
                <Save size={18} /> Save Changes
              </button>
              {saved && (
                <motion.div 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  style={{ color: '#4ade80', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600 }}
                >
                  <CheckCircle size={18} /> Settings saved!
                </motion.div>
              )}
            </div>
          </form>
        </div>
      </div>
    </motion.div>
  );
}

export default Settings;
