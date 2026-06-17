import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import SeriesPage from './pages/SeriesPage';
import SearchPage from './pages/SearchPage';
import DetailPage from './pages/DetailPage';
import WatchPage from './pages/WatchPage';

export default function App() {
  return (
    <BrowserRouter>
      {/* Ambient orbs */}
      <div className="ambient-orb orb-1" />
      <div className="ambient-orb orb-2" />

      <div className="page-root">
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/series" element={<SeriesPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/anime/:slug" element={<DetailPage />} />
          <Route path="/watch/:slug/:ep" element={<WatchPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
