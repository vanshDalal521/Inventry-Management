import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { UserPlus, Mail, Lock, User, ArrowRight, Phone, AlertCircle } from 'lucide-react';

function Signup({ setUser, setUserEmail }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // Simulate "Online Database" logic using localStorage
    const existingAccounts = JSON.parse(localStorage.getItem('smartstock_accounts') || '[]');
    
    if (existingAccounts.find(acc => acc.email === formData.email)) {
      return setError('An account with this email already exists');
    }

    const newUser = { ...formData };
    const updatedAccounts = [...existingAccounts, newUser];
    
    localStorage.setItem('smartstock_accounts', JSON.stringify(updatedAccounts));
    localStorage.setItem('smartstock_user', newUser.name);
    localStorage.setItem('smartstock_user_email', newUser.email);
    
    setUserEmail(newUser.email);
    setUser(newUser.name);
    navigate('/');
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="auth-wrapper">
      <div className="orb" style={{ width: '600px', height: '600px', top: '-200px', right: '-200px', background: 'var(--secondary)' }}></div>
      <div className="orb" style={{ width: '500px', height: '500px', bottom: '-150px', left: '-150px', background: 'var(--primary)' }}></div>
      
      <motion.div 
        className="auth-glass-card"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <div style={{ marginBottom: '2rem' }}>
          <motion.div 
            className="logo-icon" 
            style={{ margin: '0 auto 1.5rem', width: '60px', height: '60px', background: 'linear-gradient(135deg, var(--secondary), var(--accent))' }}
          >
            <UserPlus color="white" size={32} />
          </motion.div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem' }}>Create Account</h1>
          <p style={{ color: 'var(--text-dim)' }}>Join the SmartStock professional network</p>
        </div>

        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ padding: '1rem', background: 'rgba(244, 63, 94, 0.1)', color: 'var(--accent)', borderRadius: '12px', marginBottom: '1.5rem', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <AlertCircle size={18} /> {error}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4" style={{ textAlign: 'left' }}>
          <div>
            <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '8px', display: 'block' }}>Full Name</label>
            <div style={{ position: 'relative' }}>
              <User size={18} style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input 
                name="name"
                type="text" 
                className="form-input" 
                placeholder="Alex Johnson" 
                required 
                style={{ paddingLeft: '45px', width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--glass-border)', padding: '0.8rem 0.8rem 0.8rem 45px', borderRadius: '12px', color: 'white', outline: 'none' }}
                value={formData.name}
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '8px', display: 'block' }}>Work Email</label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input 
                name="email"
                type="email" 
                className="form-input" 
                placeholder="alex@company.com" 
                required 
                style={{ paddingLeft: '45px', width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--glass-border)', padding: '0.8rem 0.8rem 0.8rem 45px', borderRadius: '12px', color: 'white', outline: 'none' }}
                value={formData.email}
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '8px', display: 'block' }}>Phone Number</label>
            <div style={{ position: 'relative' }}>
              <Phone size={18} style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input 
                name="phone"
                type="tel" 
                className="form-input" 
                placeholder="+91 98765 43210" 
                required 
                style={{ paddingLeft: '45px', width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--glass-border)', padding: '0.8rem 0.8rem 0.8rem 45px', borderRadius: '12px', color: 'white', outline: 'none' }}
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '8px', display: 'block' }}>Create Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input 
                name="password"
                type="password" 
                className="form-input" 
                placeholder="••••••••" 
                required 
                style={{ paddingLeft: '45px', width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--glass-border)', padding: '0.8rem 0.8rem 0.8rem 45px', borderRadius: '12px', color: 'white', outline: 'none' }}
                value={formData.password}
                onChange={handleChange}
              />
            </div>
          </div>
          
          <button type="submit" className="action-btn btn-glow" style={{ width: '100%', padding: '1.1rem', marginTop: '1.5rem', background: 'linear-gradient(135deg, var(--secondary), var(--accent))', border: 'none', color: 'white', fontWeight: 700, borderRadius: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
            Get Started <ArrowRight size={18} />
          </button>
        </form>

        <p style={{ marginTop: '2.5rem', fontSize: '0.9rem', color: 'var(--text-dim)' }}>
          Already have an account? <Link to="/login" style={{ color: 'var(--secondary)', fontWeight: 700, textDecoration: 'none' }}>Log In</Link>
        </p>
      </motion.div>
    </div>
  );
}

export default Signup;
