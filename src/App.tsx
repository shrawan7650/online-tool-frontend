import { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { LoadingSpinner } from './components/LoadingSpinner';
import { Home } from './pages/Home';
import { URLEncodePage } from './pages/URLEncodePage';
import { Base64Page } from './pages/Base64Page';
import { JSONPage } from './pages/JSONPage';
import { HashPage } from './pages/HashPage';
import { ClipboardPage } from './pages/ClipboardPage';
import { NotFound } from './pages/NotFound';

function App() {
  return (
    <Layout>
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/url-encode" element={<URLEncodePage />} />
          <Route path="/base64" element={<Base64Page />} />
          <Route path="/json" element={<JSONPage />} />
          <Route path="/hash" element={<HashPage />} />
          <Route path="/clipboard" element={<ClipboardPage />} />
          <Route path="/404" element={<NotFound />} />
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>
      </Suspense>
    </Layout>
  );
}

export default App;