import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import CardRow from '../components/CardRow';
import { fetchHome } from '../utils/api';

function HeroBanner({ items }) {
  const [current, setCurrent] = useState(0);
  const navigate = useNavigate();
  const timerRef = useRef(null);

  useEffect(() => {
    if (!items?.length) return;
    timerRef.current = setInterval(() => {
      setCurrent(c => (c + 1) % items.length);
    }, 5000);
    return () => clearInterval(timerRef.current);
  }, [items]);

  if (!items?.length) return null;
  const item = items[current];

  return (
    <div className="hero-banner">
      <div
        className="hero-bg"
        style={{ backgroundImage: `url(${item.poster})` }}
      />
      <div className="hero-gradient" />
      <div className="hero-content">
        <div className="hero-inner">
          <div className="hero-badge">
            <span>★</span>
            {item.score ? `${item.score} · ` : ''}{item.status || 'Trending'}
          </div>
          <h1 className="hero-title">{item.title}</h1>
          {item.description && (
            <p className="hero-desc">{item.description}</p>
          )}
          <div className="hero-actions">
            <button
              className="btn-primary"
              onClick={() => {
                const slug = item.slug || item.url?.split('/').pop();
                navigate(`/anime/${slug}${item.source === 'gomunime' ? '?source=gomunime' : ''}`);
              }}
            >
              ▶ Tonton Sekarang
            </button>
            <button
              className="btn-ghost"
              onClick={() => {
                const slug = item.slug || item.url?.split('/').pop();
                navigate(`/anime/${slug}${item.source === 'gomunime' ? '?source=gomunime' : ''}`);
              }}
            >
              Info
            </button>
          </div>
        </div>
      </div>

      <div className="hero-dots">
        {items.map((_, i) => (
          <div
            key={i}
            className={`hero-dot ${i === current ? 'active' : ''}`}
            onClick={() => setCurrent(i)}
          />
        ))}
      </div>
    </div>
  );
}

function EpisodeRow({ title, items, loading }) {
  const navigate = useNavigate();
  return (
    <div className="section">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">{title}</h2>
        </div>
        <div className="card-row">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="skeleton-card" style={{ flex: '0 0 200px' }}>
                  <div className="skeleton" style={{ width: 200, height: 112, borderRadius: 8 }} />
                  <div className="skeleton skeleton-line" style={{ width: '80%' }} />
                </div>
              ))
            : items?.map((ep, i) => (
                <div
                  key={i}
                  className={`ep-card ${true ? 'visible' : ''}`}
                  style={{ transitionDelay: `${i * 40}ms`, opacity: 1, transform: 'none' }}
                  onClick={() => {
                    const slug = ep.seriesSlug;
                    const epNum = ep.episodeNumber;
                    if (slug && epNum && epNum !== '?') {
                      navigate(`/watch/${slug}/${epNum}${ep.source === 'gomunime' ? '?source=gomunime' : ''}`);
                    } else if (slug) {
                      navigate(`/anime/${slug}`);
                    }
                  }}
                >
                  <div className="ep-card-thumb">
                    {ep.poster && <img src={ep.poster} alt={ep.seriesTitle} loading="lazy" />}
                    <div className="ep-num-badge">EP {ep.episodeNumber}</div>
                  </div>
                  <div className="ep-card-title">{ep.seriesTitle}</div>
                </div>
              ))
          }
        </div>
      </div>
    </div>
  );
}

export default function HomePage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchHome()
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const heroItems = data?.trending?.slice(0, 5) || [];

  return (
    <div className="page-enter">
      <HeroBanner items={heroItems} />

      <EpisodeRow
        title="Episode Terbaru"
        items={data?.latestEpisodes}
        loading={loading}
      />

      <CardRow
        title="Trending"
        items={data?.trending}
        loading={loading}
        onMore={() => navigate('/series?sort=popular')}
      />

      <CardRow
        title="Baru Ditambah"
        items={data?.recently}
        loading={loading}
        onMore={() => navigate('/series?sort=recently')}
      />
    </div>
  );
}
