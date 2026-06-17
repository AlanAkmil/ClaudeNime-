import { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AnimeCard({ anime, delay = 0 }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.1, rootMargin: '40px' }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const handleClick = () => {
    const slug = anime.slug || anime.url?.split('/').pop();
    if (!slug) return;
    navigate(`/anime/${slug}${anime.source === 'gomunime' ? '?source=gomunime' : ''}`);
  };

  return (
    <div
      ref={ref}
      className={`anime-card ${visible ? 'visible' : ''}`}
      style={{ transitionDelay: `${delay}ms` }}
      onClick={handleClick}
    >
      <div className="anime-card-img">
        {anime.poster && (
          <img
            src={anime.poster}
            alt={anime.title}
            className={imgLoaded ? 'loaded' : 'loading'}
            onLoad={() => setImgLoaded(true)}
            loading="lazy"
          />
        )}
        {!imgLoaded && <div className="skeleton" style={{ position: 'absolute', inset: 0, borderRadius: 0 }} />}

        {anime.status && (
          <div className="card-badge">{anime.status}</div>
        )}
        {anime.score && (
          <div className="card-score">★ {anime.score}</div>
        )}

        <div className="anime-card-overlay">
          <div className="card-play-btn">▶</div>
        </div>
      </div>

      <div className="anime-card-info">
        <div className="anime-card-title">{anime.title}</div>
        <div className="anime-card-meta">
          {anime.totalEpisodes && (
            <span className="meta-tag">{anime.totalEpisodes} eps</span>
          )}
          {anime.releaseType && (
            <><span className="meta-dot" /><span className="meta-tag">{anime.releaseType}</span></>
          )}
          <span className={`source-badge source-${anime.source || 'oploverz'}`}>
            {anime.source === 'gomunime' ? 'GMN' : 'OPL'}
          </span>
        </div>
      </div>
    </div>
  );
}
