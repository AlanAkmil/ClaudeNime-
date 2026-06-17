import { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { fetchWatch, fetchDetail, formatDate } from '../utils/api';

export default function WatchPage() {
  const { slug, ep } = useParams();
  const [searchParams] = useSearchParams();
  const source = searchParams.get('source') || '';
  const [watchData, setWatchData] = useState(null);
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeStream, setActiveStream] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    setActiveStream(0);
    Promise.all([
      fetchWatch(slug, ep, source),
      fetchDetail(slug, source),
    ])
      .then(([w, d]) => { setWatchData(w); setDetail(d); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [slug, ep, source]);

  const episodes = watchData?.allEpisodes || detail?.episodes || [];
  const streams = watchData?.streamUrls || [];
  const downloads = watchData?.downloadUrls || [];

  if (loading) return (
    <div className="loading-center" style={{ paddingTop: 120 }}>
      <div className="spinner" />
      <span>Memuat player...</span>
    </div>
  );

  return (
    <div className="page-enter" style={{ paddingBottom: 60 }}>
      <div className="watch-layout">
        {/* Player section */}
        <div>
          <div style={{ marginBottom: 12 }}>
            <button
              onClick={() => navigate(`/anime/${slug}${source ? `?source=${source}` : ''}`)}
              style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '0.82rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}
            >
              ← {watchData?.seriesTitle || detail?.title}
            </button>
          </div>

          <h1 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: 16, color: 'var(--text-primary)' }}>
            Episode {ep}
            {watchData?.subbed && <span style={{ marginLeft: 8, fontSize: '0.75rem', color: 'var(--purple-glow)', background: 'rgba(124,58,237,0.15)', padding: '2px 8px', borderRadius: 4 }}>{watchData.subbed}</span>}
          </h1>

          {/* Player */}
          <div className="player-wrap glow-purple">
            {streams[activeStream]?.url ? (
              <iframe
                src={streams[activeStream].url}
                allowFullScreen
                allow="autoplay; encrypted-media"
                title={`Episode ${ep}`}
              />
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-muted)', fontSize: '0.9rem', background: 'var(--bg-card)', aspectRatio: '16/9' }}>
                Tidak ada stream tersedia
              </div>
            )}
          </div>

          {/* Stream selector */}
          {streams.length > 1 && (
            <div className="player-selector">
              {streams.map((s, i) => (
                <button
                  key={i}
                  className={`player-btn ${activeStream === i ? 'active' : ''}`}
                  onClick={() => setActiveStream(i)}
                >
                  {s.label || `Server ${i + 1}`}
                </button>
              ))}
            </div>
          )}

          {/* Downloads */}
          {downloads.length > 0 && (
            <div className="download-section">
              <div className="download-title">Download</div>
              <div className="download-grid">
                {downloads.map((d, i) => (
                  <a key={i} href={d.url} target="_blank" rel="noopener noreferrer" className="download-btn">
                    ↓ {d.quality} {d.format?.toUpperCase()} {d.host && `· ${d.host}`}
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Nav between episodes */}
          <div style={{ display: 'flex', gap: 8, marginTop: 24 }}>
            {parseInt(ep) > 1 && (
              <button
                className="btn-ghost"
                onClick={() => navigate(`/watch/${slug}/${parseInt(ep) - 1}${source ? `?source=${source}` : ''}`)}
              >
                ← Ep {parseInt(ep) - 1}
              </button>
            )}
            {episodes.find(e => parseInt(e.episodeNumber) === parseInt(ep) + 1) && (
              <button
                className="btn-primary"
                onClick={() => navigate(`/watch/${slug}/${parseInt(ep) + 1}${source ? `?source=${source}` : ''}`)}
              >
                Ep {parseInt(ep) + 1} →
              </button>
            )}
          </div>
        </div>

        {/* Episode sidebar */}
        <div className="ep-sidebar">
          <div className="ep-sidebar-title">
            Daftar Episode
            <span style={{ marginLeft: 8, color: 'var(--text-muted)', fontWeight: 400 }}>({episodes.length})</span>
          </div>
          <div className="ep-sidebar-list">
            {episodes.map((e) => (
              <div
                key={e.episodeNumber}
                className={`ep-list-item ${e.episodeNumber == ep ? 'active' : ''}`}
                onClick={() => navigate(`/watch/${slug}/${e.episodeNumber}${source ? `?source=${source}` : ''}`)}
              >
                <span className="ep-num">EP {e.episodeNumber}</span>
                <span className="ep-title" style={{ fontSize: '0.8rem' }}>Episode {e.episodeNumber}</span>
                {e.releasedAt && <span className="ep-date">{formatDate(e.releasedAt)}</span>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
