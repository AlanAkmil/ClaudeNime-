import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import AnimeCard from '../components/AnimeCard';
import { fetchSeries } from '../utils/api';

const GENRES = ['Action', 'Adventure', 'Comedy', 'Drama', 'Fantasy', 'Horror', 'Isekai', 'Mecha', 'Mystery', 'Romance', 'Sci-Fi', 'Shounen', 'Slice of Life', 'Sports', 'Supernatural', 'Thriller'];
const SORTS = [
  { value: 'recently', label: 'Terbaru' },
  { value: 'popular', label: 'Populer' },
  { value: 'score', label: 'Rating' },
];

export default function SeriesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const page = parseInt(searchParams.get('page') || '1');
  const sort = searchParams.get('sort') || 'recently';
  const genre = searchParams.get('genre') || '';
  const status = searchParams.get('status') || '';

  useEffect(() => {
    setLoading(true);
    fetchSeries(page, sort, genre, status)
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [page, sort, genre, status]);

  const setParam = (key, val) => {
    const next = new URLSearchParams(searchParams);
    if (val) next.set(key, val); else next.delete(key);
    next.set('page', '1');
    setSearchParams(next);
  };

  const setPage = (p) => {
    const next = new URLSearchParams(searchParams);
    next.set('page', p);
    setSearchParams(next);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const lastPage = data?.pagination?.lastPage || 1;

  return (
    <div className="page-enter">
      <div className="container" style={{ paddingTop: 40, paddingBottom: 60 }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: 24, letterSpacing: '-0.02em' }}>
          {status === 'ongoing' ? 'Ongoing' : status === 'completed' ? 'Completed' : 'Semua Series'}
        </h1>

        {/* Sort filter */}
        <div className="filter-bar">
          {SORTS.map(s => (
            <button
              key={s.value}
              className={`filter-chip ${sort === s.value ? 'active' : ''}`}
              onClick={() => setParam('sort', s.value)}
            >
              {s.label}
            </button>
          ))}
          <div style={{ width: 1, background: 'var(--border)', margin: '0 4px' }} />
          {['ongoing', 'completed'].map(s => (
            <button
              key={s}
              className={`filter-chip ${status === s ? 'active' : ''}`}
              onClick={() => setParam('status', status === s ? '' : s)}
            >
              {s === 'ongoing' ? 'Ongoing' : 'Completed'}
            </button>
          ))}
        </div>

        {/* Genre filter */}
        <div className="filter-bar" style={{ marginBottom: 40 }}>
          <button
            className={`filter-chip ${!genre ? 'active' : ''}`}
            onClick={() => setParam('genre', '')}
          >
            Semua Genre
          </button>
          {GENRES.map(g => (
            <button
              key={g}
              className={`filter-chip ${genre === g ? 'active' : ''}`}
              onClick={() => setParam('genre', genre === g ? '' : g)}
            >
              {g}
            </button>
          ))}
        </div>

        {/* Grid */}
        {loading ? (
          <div className="anime-grid">
            {Array.from({ length: 20 }).map((_, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div className="skeleton" style={{ width: '100%', paddingBottom: '140%', borderRadius: 10 }} />
                <div className="skeleton skeleton-line" style={{ width: '80%' }} />
              </div>
            ))}
          </div>
        ) : data?.items?.length ? (
          <div className="anime-grid">
            {data.items.map((anime, i) => (
              <AnimeCard key={anime.slug || i} anime={anime} delay={i * 30} />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-icon">🎌</div>
            <div className="empty-title">Tidak ada anime ditemukan</div>
            <div className="empty-desc">Coba ganti filter atau genre</div>
          </div>
        )}

        {/* Pagination */}
        {lastPage > 1 && (
          <div className="pagination">
            <button className="page-btn" onClick={() => setPage(page - 1)} disabled={page <= 1}>‹</button>
            {Array.from({ length: Math.min(5, lastPage) }, (_, i) => {
              let p;
              if (lastPage <= 5) p = i + 1;
              else if (page <= 3) p = i + 1;
              else if (page >= lastPage - 2) p = lastPage - 4 + i;
              else p = page - 2 + i;
              return (
                <button
                  key={p}
                  className={`page-btn ${page === p ? 'active' : ''}`}
                  onClick={() => setPage(p)}
                >
                  {p}
                </button>
              );
            })}
            <button className="page-btn" onClick={() => setPage(page + 1)} disabled={page >= lastPage}>›</button>
          </div>
        )}
      </div>
    </div>
  );
}
