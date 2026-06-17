import { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { fetchDetail, formatDate } from '../utils/api';

export default function DetailPage() {
  const { slug } = useParams();
  const [searchParams] = useSearchParams();
  const source = searchParams.get('source') || '';
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    fetchDetail(slug, source)
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [slug, source]);

  if (loading) return (
    <div className="loading-center" style={{ paddingTop: 120 }}>
      <div className="spinner" />
      <span>Memuat...</span>
    </div>
  );

  if (!data) return (
    <div className="empty-state" style={{ paddingTop: 120 }}>
      <div className="empty-icon">⚠️</div>
      <div className="empty-title">Anime tidak ditemukan</div>
    </div>
  );

  return (
    <div className="page-enter">
      {/* Hero */}
      <div className="detail-hero">
        <div className="detail-hero-bg" style={{ backgroundImage: `url(${data.poster})` }} />
        <div className="detail-hero-content">
          <div className="detail-poster">
            {data.poster && <img src={data.poster} alt={data.title} />}
          </div>
          <div className="detail-info">
            {data.japaneseTitle && <div className="detail-jp-title">{data.japaneseTitle}</div>}
            <h1 className="detail-title">{data.title}</h1>
            <div className="detail-tags">
              {data.genres?.map(g => <span key={g} className="detail-tag">{g}</span>)}
            </div>
            <div className="detail-stats">
              {data.score && (
                <div className="stat-item">
                  <span className="stat-label">Score</span>
                  <span className="stat-value score">★ {data.score}</span>
                </div>
              )}
              {data.status && (
                <div className="stat-item">
                  <span className="stat-label">Status</span>
                  <span className="stat-value">{data.status}</span>
                </div>
              )}
              {data.totalEpisodes && (
                <div className="stat-item">
                  <span className="stat-label">Episode</span>
                  <span className="stat-value">{data.totalEpisodes}</span>
                </div>
              )}
              {data.studio && (
                <div className="stat-item">
                  <span className="stat-label">Studio</span>
                  <span className="stat-value">{data.studio}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container" style={{ paddingTop: 32, paddingBottom: 60 }}>
        {data.description && (
          <div style={{ marginBottom: 40 }}>
            <h2 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12, fontFamily: 'var(--font-mono)' }}>
              Sinopsis
            </h2>
            <p className={`detail-desc ${expanded ? 'expanded' : ''}`}>
              {data.description}
            </p>
            {data.description.length > 200 && (
              <button
                style={{ background: 'none', border: 'none', color: 'var(--purple-bright)', fontSize: '0.82rem', cursor: 'pointer', marginTop: 8 }}
                onClick={() => setExpanded(e => !e)}
              >
                {expanded ? 'Tutup ↑' : 'Baca selengkapnya ↓'}
              </button>
            )}
          </div>
        )}

        {/* Episode List */}
        <div>
          <h2 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 16, fontFamily: 'var(--font-mono)' }}>
            Daftar Episode ({data.episodes?.length || 0})
          </h2>
          <div className="ep-list">
            {data.episodes?.length > 0 ? data.episodes.map((ep, i) => (
              <div
                key={ep.episodeNumber || i}
                className="ep-list-item"
                onClick={() => navigate(`/watch/${slug}/${ep.episodeNumber}${source ? `?source=${source}` : ''}`)}
              >
                <span className="ep-num">EP {ep.episodeNumber}</span>
                <span className="ep-title">{ep.title || `Episode ${ep.episodeNumber}`}</span>
                {ep.releasedAt && <span className="ep-date">{formatDate(ep.releasedAt)}</span>}
              </div>
            )) : (
              <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem', padding: 16 }}>
                Belum ada episode
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
