import React,{ Suspense, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { LoadingSpinner } from './components/LoadingSpinner';
import { Home } from './pages/Home';
import { URLEncodePage } from './pages/URLEncodePage';
import { Base64Page } from './pages/Base64Page';
import { JSONPage } from './pages/JSONPage';
import { HashPage } from './pages/HashPage';
import { ClipboardPage } from './pages/ClipboardPage';
import { FileHashPage } from './pages/FileHashPage';
import { FileSharingPage } from './pages/FileSharingPage';
import { EscapeToolkitPage } from './pages/EscapeToolkitPage';
import { QRCodePage } from './pages/QRCodePage';
import { SchedulerPage } from './pages/SchedulerPage';
import { NotFound } from './pages/NotFound';
import { ClipboardDetector } from './components/ClipboardDetector';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from './store/store';
import { fetchCurrentUser, logout, refreshToken } from './store/slices/userSlice';

function App() {
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated,user,token } = useSelector((state: RootState) => state.user);

  
  useEffect(() => {
    if (token && !user && !isAuthenticated) {
      // Only if we have a token but Redux has no user yet
      dispatch(refreshToken())
        .unwrap()
        .then(() => {
          dispatch(fetchCurrentUser());
        })
        .catch(() => {
          dispatch(logout());
        });
    }
  }, [dispatch, token, user, isAuthenticated]);
  return (
    <Layout>
      <ClipboardDetector />
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/url-encode" element={<URLEncodePage />} />
          <Route path="/base64" element={<Base64Page />} />
          <Route path="/json" element={<JSONPage />} />
          <Route path="/hash" element={<HashPage />} />
          <Route path="/file-hash" element={<FileHashPage />} />
          <Route path="/file-sharing" element={<FileSharingPage />} />
          <Route path="/escape-toolkit" element={<EscapeToolkitPage />} />
          <Route path="/qr-code" element={<QRCodePage />} />
          <Route path="/scheduler" element={<SchedulerPage />} />
          <Route path="/clipboard" element={<ClipboardPage />} />
          <Route path="/404" element={<NotFound />} />
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>
      </Suspense>
    </Layout>
  );
}

export default App;