import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Boxes, Mail, Lock, ArrowRight, AlertCircle } from 'lucide-react';

function Login({ setUser, setUserEmail }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // Simulate "Online Database" logic using localStorage
    const accounts = JSON.parse(localStorage.getItem('smartstock_accounts') || '[]');
    const userAccount = accounts.find(acc => acc.email === email && acc.password === password);

    if (userAccount) {
      localStorage.setItem('smartstock_user', userAccount.name);
      localStorage.setItem('smartstock_user_email', userAccount.email);
      setUserEmail(userAccount.email);
      setUser(userAccount.name);
      navigate('/');
    } else {
      setError('Invalid email or password. Please try again.');
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="orb" style={{ width: '600px', height: '600px', top: '-200px', left: '-200px', background: 'var(--primary)' }}></div>
      <div className="orb" style={{ width: '500px', height: '500px', bottom: '-150px', right: '-150px', background: 'var(--secondary)' }}></div>
      
      <motion.div 
        className="auth-glass-card"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <div style={{ marginBottom: '2.5rem' }}>
          <motion.div 
            className="logo-icon" 
            style={{ margin: '0 auto 1.5rem', width: '60px', height: '60px' }}
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ repeat: Infinity, duration: 5 }}
          >
            <Boxes color="white" size={32} />
          </motion.div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem' }}>SmartStock Pro</h1>
          <p style={{ color: 'var(--text-dim)' }}>Precision Inventory Management</p>
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
            <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '8px', display: 'block' }}>Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input 
                type="email" 
                className="form-input" 
                placeholder="name@company.com" 
                required 
                style={{ paddingLeft: '45px', width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--glass-border)', padding: '0.8rem 0.8rem 0.8rem 45px', borderRadius: '12px', color: 'white', outline: 'none' }}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '8px', display: 'block' }}>Secure Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input 
                type="password" 
                className="form-input" 
                placeholder="••••••••" 
                required 
                style={{ paddingLeft: '45px', width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--glass-border)', padding: '0.8rem 0.8rem 0.8rem 45px', borderRadius: '12px', color: 'white', outline: 'none' }}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
          
          <button type="submit" className="action-btn btn-glow" style={{ width: '100%', padding: '1.2rem', marginTop: '1.5rem', background: 'linear-gradient(135deg, var(--primary), var(--secondary))', border: 'none', color: 'white', fontWeight: 700, borderRadius: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
            Sign In to Terminal <ArrowRight size={18} />
          </button>
        </form>

        <p style={{ marginTop: '2.5rem', fontSize: '0.9rem', color: 'var(--text-dim)' }}>
          New to the platform? <Link to="/signup" style={{ color: 'var(--primary)', fontWeight: 700, textDecoration: 'none' }}>Create Account</Link>
        </p>
      </motion.div>
    </div>
  );
}

export default Login;
