import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from './Sidebar';
import { Bell, X } from 'lucide-react';

const Layout = ({ children, user, onLogout, notifications = [], removeNotification }) => {
  return (
    <div className="app-layout">
      <Sidebar onLogout={onLogout} />
      
      {/* Simulated Phone Notification Toast */}
      <div style={{ position: 'fixed', top: '1.5rem', right: '1.5rem', zIndex: 1000, display: 'flex', flexDirection: 'column', gap: '0.75rem', pointerEvents: 'none' }}>
        <AnimatePresence>
          {notifications.map((n) => (
            <motion.div
              key={n.id}
              initial={{ opacity: 0, x: 50, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8, x: 20 }}
              style={{ 
                width: '320px',
                background: 'rgba(15, 23, 42, 0.95)',
                backdropFilter: 'blur(16px)',
                border: '1px solid var(--primary)',
                borderRadius: '20px',
                padding: '1.25rem',
                boxShadow: '0 20px 40px -10px rgba(0,0,0,0.5)',
                pointerEvents: 'auto',
                display: 'flex',
                gap: '12px'
              }}
            >
              <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(6, 182, 212, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', flexShrink: 0 }}>
                <Bell size={22} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <span style={{ fontWeight: 800, fontSize: '0.85rem', color: 'white' }}>{n.title}</span>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>{n.time}</span>
                </div>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)', lineHeight: '1.4' }}>{n.message}</p>
              </div>
              <button 
                onClick={() => removeNotification(n.id)}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', alignSelf: 'flex-start', padding: '4px' }}
              >
                <X size={16} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <motion.main 
        className="main-viewport"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        {children}
      </motion.main>
    </div>
  );
};

export default Layout;
