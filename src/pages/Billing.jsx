import { useState } from 'react';
import { Search, Plus, Trash2, CheckCircle, ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function Billing({ inventory, setInventory, setTransactions }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [cart, setCart] = useState([]);
  const [processing, setProcessing] = useState(false);

  const addToCart = (product) => {
    const existing = cart.find(item => item.id === product.id);
    if (existing) {
      if (existing.cartQuantity < product.quantity) {
        setCart(cart.map(item =>
          item.id === product.id ? { ...item, cartQuantity: item.cartQuantity + 1 } : item
        ));
      } else {
        alert('Cannot add more. Stock limit reached.');
      }
    } else {
      setCart([...cart, { ...product, cartQuantity: 1 }]);
    }
  };

  const removeFromCart = (id) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.cartQuantity), 0);
  const tax = subtotal * 0.05;
  const total = subtotal + tax;

  const processSale = () => {
    if (cart.length === 0) return alert('Cart is empty!');

    setProcessing(true);

    setTimeout(() => {
      const newInventory = inventory.map(p => {
        const cartItem = cart.find(c => c.id === p.id);
        if (cartItem) {
          const newQty = p.quantity - cartItem.cartQuantity;
          return {
            ...p,
            quantity: newQty,
            status: newQty <= 0 ? 'Out of Stock' : newQty <= 10 ? 'Low Stock' : 'In Stock'
          };
        }
        return p;
      });
      setInventory(newInventory);

      const newTransactions = cart.map(item => ({
        id: 'TRX-' + Math.floor(1000 + Math.random() * 9000),
        product: item.name,
        quantity: item.cartQuantity,
        total: item.price * item.cartQuantity,
        status: 'Paid'
      }));
      setTransactions(prev => [...prev, ...newTransactions]);

      alert('Sale completed successfully!');
      setCart([]);
      setProcessing(false);
    }, 1500);
  };

  const filteredProducts = inventory.filter(p =>
    p.quantity > 0 && p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <header style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800 }}>Billing Terminal</h1>
        <p style={{ color: 'var(--text-muted)' }}>Generate invoices and manage customer sales</p>
      </header>

      <div className="billing-grid">
        <div className="selection-area space-y-4">
          <div className="glass-panel modern-card" style={{ padding: '1.25rem' }}>
            <div style={{ position: 'relative' }}>
              <Search size={20} style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
              <input
                type="text"
                className="form-input"
                placeholder="Search products to add..."
                style={{ paddingLeft: '50px', background: 'transparent', border: 'none' }}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="glass-panel modern-card">
            <h2 style={{ fontSize: '0.9rem', marginBottom: '1.25rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '1.5px', fontWeight: 600 }}>Available Stock</h2>
            <div className="table-container">
              <table className="modern-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Price</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map(product => (
                    <tr key={product.id}>
                      <td style={{ fontWeight: 600 }}>{product.name} <br /><span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{product.quantity} in stock</span></td>
                      <td style={{ color: 'var(--primary)', fontWeight: 700 }}>₹{product.price.toFixed(2)}</td>
                      <td>
                        <button
                          className="action-btn"
                          style={{ padding: '6px 12px', background: 'rgba(6, 182, 212, 0.1)', color: 'var(--primary)', fontSize: '0.75rem' }}
                          onClick={() => addToCart(product)}
                        >
                          <Plus size={14} /> Add
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="cart-summary">
          <div className="glass-panel modern-card" style={{ position: 'sticky', top: '1.5rem', border: '1px solid var(--primary)' }}>
            <div className="flex-row" style={{ marginBottom: '1.5rem' }}>
              <div style={{ padding: '10px', background: 'rgba(6, 182, 212, 0.1)', borderRadius: '10px', color: 'var(--primary)' }}>
                <ShoppingBag size={20} />
              </div>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Order Summary</h2>
            </div>

            <div className="space-y-4" style={{ minHeight: '120px', maxHeight: '300px', overflowY: 'auto', paddingRight: '5px' }}>
              <AnimatePresence>
                {cart.map(item => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="flex-between"
                    style={{ padding: '10px', background: 'rgba(255,255,255,0.02)', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.05)' }}
                  >
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{item.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{item.cartQuantity} unit{item.cartQuantity > 1 ? 's' : ''}</div>
                    </div>
                    <div className="flex-row" style={{ gap: '12px' }}>
                      <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>₹{(item.price * item.cartQuantity).toFixed(2)}</span>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        style={{ background: 'none', border: 'none', color: 'var(--accent)', cursor: 'pointer', padding: '4px' }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              {cart.length === 0 && (
                <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2.5rem 0', fontSize: '0.9rem' }}>
                  Your cart is empty
                </div>
              )}
            </div>

            <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--glass-border)' }}>
              <div className="flex-between" style={{ marginBottom: '0.75rem', fontSize: '0.9rem' }}>
                <span style={{ color: 'var(--text-dim)' }}>Subtotal</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex-between" style={{ marginBottom: '1.25rem', fontSize: '0.9rem' }}>
                <span style={{ color: 'var(--text-dim)' }}>Service Tax (5%)</span>
                <span>₹{tax.toFixed(2)}</span>
              </div>
              <div className="flex-between" style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--primary)', marginBottom: '1.5rem' }}>
                <span>Total</span>
                <span>₹{total.toFixed(2)}</span>
              </div>

              <button
                className="action-btn btn-glow"
                style={{ width: '100%', padding: '1rem', borderRadius: '12px' }}
                onClick={processSale}
                disabled={processing || cart.length === 0}
              >
                {processing ? (
                  <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}>
                    <Search size={18} />
                  </motion.div>
                ) : (
                  <><CheckCircle size={18} /> Complete Transaction</>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Billing;
