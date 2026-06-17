import AnimeCard from './AnimeCard';

function SkeletonCard() {
  return (
    <div className="skeleton-card">
      <div className="skeleton skeleton-img" />
      <div className="skeleton skeleton-line" style={{ width: '80%' }} />
      <div className="skeleton skeleton-line" style={{ width: '50%' }} />
    </div>
  );
}

export default function CardRow({ title, items, loading, onMore }) {
  return (
    <div className="section">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">{title}</h2>
          {onMore && (
            <button className="section-more" onClick={onMore}>
              Lihat Semua →
            </button>
          )}
        </div>

        <div className="card-row">
          {loading
            ? Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
            : items?.map((anime, i) => (
                <AnimeCard key={anime.slug || i} anime={anime} delay={i * 40} />
              ))
          }
        </div>
      </div>
    </div>
  );
}
