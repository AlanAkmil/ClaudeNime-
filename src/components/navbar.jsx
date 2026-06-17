import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function Navbar() {
  const [q, setQ] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const handleSearch = (e) => {
    e.preventDefault();
    if (q.trim()) navigate(`/search?q=${encodeURIComponent(q.trim())}`);
  };

  const isActive = (path) => location.pathname === path ? 'nav-link active' : 'nav-link';

  return (
    <nav className="navbar">
      <a className="navbar-logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
        Ani<span>Vault</span>
      </a>

      <div className="navbar-nav">
        <button className={isActive('/')} onClick={() => navigate('/')}>Beranda</button>
        <button className={isActive('/series')} onClick={() => navigate('/series')}>Series</button>
        <button className={isActive('/series?status=ongoing')} onClick={() => navigate('/series?status=ongoing')}>Ongoing</button>
        <button className={isActive('/series?status=completed')} onClick={() => navigate('/series?status=completed')}>Completed</button>
      </div>

      <div className="navbar-search">
        <form onSubmit={handleSearch} className="search-input-wrap">
          <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
          </svg>
          <input
            className="search-input"
            placeholder="Cari anime..."
            value={q}
            onChange={e => setQ(e.target.value)}
          />
        </form>
      </div>
    </nav>
  );
}
