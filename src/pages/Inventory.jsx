import { useState } from 'react';
import { Search, Plus, Edit2, Trash2, Download } from 'lucide-react';
import { motion } from 'framer-motion';

function Inventory({ inventory, setInventory }) {
  const [searchTerm, setSearchTerm] = useState('');

  const deleteProduct = (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      setInventory(inventory.filter(p => p.id !== id));
    }
  };

  const editProduct = (id) => {
    const product = inventory.find(p => p.id === id);
    if (!product) return;

    const newName = window.prompt('Enter new product name:', product.name);
    const newPrice = window.prompt('Enter new price:', product.price);
    const newQty = window.prompt('Enter new quantity:', product.quantity);

    if (newName && newPrice && newQty) {
      setInventory(inventory.map(p =>
        p.id === id ? {
          ...p,
          name: newName,
          price: parseFloat(newPrice),
          quantity: parseInt(newQty),
          status: parseInt(newQty) <= 0 ? 'Out of Stock' : parseInt(newQty) <= 10 ? 'Low Stock' : 'In Stock'
        } : p
      ));
    }
  };

  const addProduct = () => {
    const name = window.prompt('Product Name:');
    const category = window.prompt('Category:');
    const price = window.prompt('Price:');
    const qty = window.prompt('Quantity:');

    if (name && category && price && qty) {
      const newProd = {
        id: 'PROD-00' + (inventory.length + 1),
        name,
        category,
        price: parseFloat(price),
        quantity: parseInt(qty),
        status: parseInt(qty) <= 0 ? 'Out of Stock' : parseInt(qty) <= 10 ? 'Low Stock' : 'In Stock'
      };
      setInventory([...inventory, newProd]);
    }
  };

  const exportToCSV = () => {
    if (inventory.length === 0) return alert('No inventory to export!');

    const headers = ['ID', 'Name', 'Category', 'Price', 'Quantity', 'Status'];
    const rows = inventory.map(item => [
      `#${item.id}`,
      item.name,
      item.category,
      item.price.toFixed(2),
      item.quantity,
      item.status
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', `smartstock_inventory_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredInventory = inventory.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <header className="flex-between" style={{ marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800 }}>Inventory Catalog</h1>
          <p style={{ color: 'var(--text-muted)' }}>Real-time stock management & tracking</p>
        </div>
        <div style={{ display: 'flex', gap: '15px' }}>
          <button className="action-btn" style={{ background: 'rgba(255,255,255,0.05)', color: 'white' }} onClick={exportToCSV}>
            <Download size={18} /> Export
          </button>
          <button className="action-btn btn-glow" onClick={addProduct}>
            <Plus size={18} /> Add Product
          </button>
        </div>
      </header>

      <div className="glass-panel modern-card" style={{ padding: '1.25rem' }}>
        <div style={{ position: 'relative' }}>
          <Search size={20} style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
          <input
            type="text"
            className="form-input"
            placeholder="Search by product name or SKU ID..."
            style={{ paddingLeft: '50px', background: 'transparent', border: 'none', fontSize: '1.1rem' }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="glass-panel modern-card">
        <div className="table-container">
          <table className="modern-table">
            <thead>
              <tr>
                <th>Product ID</th>
                <th>Name</th>
                <th>Category</th>
                <th>Unit Price</th>
                <th>Qty</th>
                <th>Stock Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredInventory.map((item, i) => (
                <motion.tr
                  key={item.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  style={{ opacity: item.quantity === 0 ? 0.5 : 1 }}
                >
                  <td style={{ color: 'var(--text-dim)', fontSize: '0.8rem' }}>#{item.id}</td>
                  <td style={{ fontWeight: 600 }}>{item.name}</td>
                  <td>{item.category}</td>
                  <td style={{ fontWeight: 700 }}>₹{item.price.toFixed(2)}</td>
                  <td>{item.quantity}</td>
                  <td>
                    <span className="badge-neon" style={{
                      background: item.status === 'In Stock' ? 'rgba(34, 197, 94, 0.1)' : item.status === 'Low Stock' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                      color: item.status === 'In Stock' ? '#4ade80' : item.status === 'Low Stock' ? '#fbbf24' : '#f87171'
                    }}>
                      {item.status}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <button className="action-btn" onClick={() => editProduct(item.id)} style={{ padding: '8px', background: 'rgba(255,255,255,0.05)', color: 'var(--primary)' }}><Edit2 size={16} /></button>
                      <button className="action-btn" onClick={() => deleteProduct(item.id)} style={{ padding: '8px', background: 'rgba(255,255,255,0.05)', color: 'var(--accent)' }}><Trash2 size={16} /></button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Inventory;
