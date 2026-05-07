import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Package, Receipt, Settings, LogOut, Boxes } from 'lucide-react';
import { motion } from 'framer-motion';

function Sidebar({ onLogout }) {
  const navItems = [
    { to: "/", icon: <LayoutDashboard size={22} />, label: "Dashboard" },
    { to: "/inventory", icon: <Package size={22} />, label: "Inventory" },
    { to: "/billing", icon: <Receipt size={22} />, label: "Billing" },
  ];

  return (
    <aside className="sidebar">
      <div className="logo-container" style={{ marginBottom: '4rem' }}>
        <div className="logo-icon" style={{ width: '44px', height: '44px' }}>
          <Boxes color="white" size={28} />
        </div>
        <span className="logo-text" style={{ fontSize: '1.6rem' }}>SmartStock</span>
      </div>

      <nav className="space-y-4">
        {navItems.map((item) => (
          <NavLink 
            key={item.to}
            to={item.to} 
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            {item.icon}
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div style={{ marginTop: 'auto' }}>
        <NavLink to="/settings" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <Settings size={22} />
          <span>Settings</span>
        </NavLink>
        <button 
          onClick={onLogout}
          className="nav-item"
          style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer', marginTop: '0.5rem' }}
        >
          <LogOut size={22} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
