import { motion } from 'framer-motion';
import { Package, TrendingDown, IndianRupee, Plus, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const StatCard = ({ title, value, icon, color, delay }) => (
  <motion.div
    className="glass-panel modern-card"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.5 }}
  >
    <div className="flex-row">
      <div style={{
        padding: '12px',
        borderRadius: '12px',
        background: `rgba(${color}, 0.1)`,
        color: `rgb(${color})`
      }}>
        {icon}
      </div>
      <h3 style={{ fontSize: '0.9rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '1px' }}>{title}</h3>
    </div>
    <div className="stat-value">{value}</div>
  </motion.div>
);

function Dashboard({ inventory, transactions, user }) {
  const navigate = useNavigate();
  const lowStockItems = inventory.filter(p => p.quantity <= 10);
  const totalRevenue = transactions.reduce((sum, t) => sum + t.total, 0);

  return (
    <div className="space-y-4">
      {lowStockItems.length > 0 && (
        <motion.div
          className="glass-panel"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            borderRadius: '16px',
            background: 'rgba(244, 63, 94, 0.08)',
            color: '#fca5a5',
            padding: '1.25rem 2rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            marginBottom: '3rem',
            border: '1px solid rgba(244, 63, 94, 0.2)',
            boxShadow: '0 10px 30px -10px rgba(244, 63, 94, 0.2)'
          }}
        >
          <div className="flex-row">
            <div style={{ padding: '8px', background: 'rgba(244, 63, 94, 0.2)', borderRadius: '50%' }}>
              <AlertCircle size={20} />
            </div>
            <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>Inventory Alert: {lowStockItems.length} products require your attention.</span>
          </div>
          <button
            className="action-btn"
            style={{ background: '#f43f5e', color: 'white', padding: '0.6rem 1.2rem', borderRadius: '10px', fontSize: '0.75rem' }}
            onClick={() => navigate('/inventory')}
          >
            RESTOCK NOW
          </button>
        </motion.div>
      )}

      <header className="flex-between" style={{ marginBottom: '3rem' }}>
        <div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 800, letterSpacing: '-1px', marginBottom: '0.25rem' }}>Dashboard Overview</h1>
          <p style={{ color: 'var(--text-dim)', fontSize: '1rem' }}>
            Welcome back, <span style={{ color: 'var(--primary)', fontWeight: 600 }}>{user}</span>
          </p>
        </div>
        <button className="action-btn btn-glow" onClick={() => navigate('/billing')} style={{ padding: '0.9rem 1.8rem', borderRadius: '12px', marginTop: '10px' }}>
          <Plus size={20} /> NEW SALE
        </button>
      </header>

      <div className="stats-grid">
        <StatCard title="Total Products" value={inventory.length} icon={<Package />} color="6, 182, 212" delay={0.1} />
        <StatCard title="Low Stock" value={lowStockItems.length} icon={<TrendingDown />} color="244, 63, 94" delay={0.2} />
        <StatCard title="Total Revenue" value={`₹${totalRevenue.toLocaleString()}`} icon={<IndianRupee />} color="34, 197, 94" delay={0.3} />
      </div>

      <div className="glass-panel modern-card" style={{ marginTop: '2rem' }}>
        <h2 style={{ fontSize: '1.2rem', marginBottom: '1.5rem' }}>Recent Transaction History</h2>
        <div className="table-container">
          <table className="modern-table">
            <thead>
              <tr>
                <th>Transaction</th>
                <th>Product</th>
                <th>Qty</th>
                <th>Total</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {transactions.slice().reverse().map((trx, i) => (
                <motion.tr
                  key={trx.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + (i * 0.05) }}
                >
                  <td style={{ fontWeight: 600 }}>#{trx.id}</td>
                  <td>{trx.product}</td>
                  <td>{trx.quantity}</td>
                  <td style={{ color: 'var(--primary)', fontWeight: 700 }}>₹{trx.total.toFixed(2)}</td>
                  <td><span className="badge-neon" style={{ background: 'rgba(34, 197, 94, 0.1)', color: '#4ade80' }}>{trx.status}</span></td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
