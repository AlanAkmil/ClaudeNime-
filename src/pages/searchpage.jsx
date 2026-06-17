import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import AnimeCard from '../components/AnimeCard';
import { fetchSearch } from '../utils/api';

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [inputVal, setInputVal] = useState(searchParams.get('q') || '');
  const debounceRef = useRef(null);

  const q = searchParams.get('q') || '';

  useEffect(() => {
    setInputVal(q);
    if (!q) { setResults(null); return; }
    setLoading(true);
    fetchSearch(q)
      .then(setResults)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [q]);

  const handleInput = (val) => {
    setInputVal(val);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      const next = new URLSearchParams(searchParams);
      if (val.trim()) next.set('q', val.trim()); else next.delete('q');
      setSearchParams(next);
    }, 400);
  };

  return (
    <div className="page-enter">
      <div className="container">
        <div className="search-header">
          <div className="search-hero-wrap">
            <svg className="search-hero-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
            </svg>
            <input
              className="search-hero-input"
              placeholder="Cari judul anime..."
              value={inputVal}
              onChange={e => handleInput(e.target.value)}
              autoFocus
            />
          </div>
          {results && (
            <p style={{ marginTop: 12, fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              {results.total} hasil untuk "<span style={{ color: 'var(--purple-glow)' }}>{q}</span>"
            </p>
          )}
        </div>

        {loading && (
          <div className="loading-center">
            <div className="spinner" />
            <span>Mencari...</span>
          </div>
        )}

        {!loading && results?.items?.length > 0 && (
          <div className="anime-grid" style={{ paddingBottom: 60 }}>
            {results.items.map((anime, i) => (
              <AnimeCard key={anime.slug || i} anime={anime} delay={i * 30} />
            ))}
          </div>
        )}

        {!loading && results?.items?.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">🔍</div>
            <div className="empty-title">Tidak ditemukan</div>
            <div className="empty-desc">Coba kata kunci lain</div>
          </div>
        )}

        {!q && (
          <div className="empty-state">
            <div className="empty-icon">🎌</div>
            <div className="empty-title">Mau nonton apa hari ini?</div>
            <div className="empty-desc">Ketik judul anime di atas</div>
          </div>
        )}
      </div>
    </div>
  );
}
