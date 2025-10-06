import React, { useState } from 'react';
import {
  BookOpen,
  ExternalLink,
  Clock,
  User,
  Calendar,
  Loader2,
  Share2,
} from 'lucide-react';
import axios from 'axios';

interface MediumArticle {
  title: string;
  subtitle?: string;
  author: string;
  publishedTime?: string;
  readingTime?: string;
  featuredImage?: string;
  content: string;
}

const MediumExtractor = () => {
  const [url, setUrl] = useState('');
  const [article, setArticle] = useState<MediumArticle | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const apiBaseUrl =
    import.meta.env.VITE_API_BASE_URL_PRODUCTION || 'http://localhost:8080';

  const extractArticle = async () => {
    if (!url.trim()) {
      setError('Please enter a Medium URL');
      return;
    }

    if (!url.includes('medium.com')) {
      setError('Please enter a valid Medium URL');
      return;
    }

    setLoading(true);
    setError('');
    setArticle(null);

    try {
      const { data } = await axios.post(`${apiBaseUrl}/api/extract-medium/`, {
        url,
      });
      setArticle(data);
    } catch (err: any) {
      console.error(err);
      setError(
        err.response?.data?.message ||
          err.message ||
          'Failed to extract article'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') extractArticle();
  };

  const copyToClipboard = () => {
    if (article) {
      const text = `${article.title}\n\n${article.subtitle ?? ''}\n\nBy ${
        article.author
      }\n\n${article.content.replace(/<[^>]*>/g, '')}`;
      navigator.clipboard.writeText(text);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">

      {/* Main */}
      <main className="max-w-6xl px-4 py-10 mx-auto sm:px-6 lg:px-8">
        {/* URL Input */}
        <div className="p-8 mb-10 bg-white border border-gray-200 shadow-lg rounded-2xl">
          <label className="block mb-3 text-sm font-medium text-gray-700">
            Enter Medium Article URL
          </label>
          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="https://medium.com/@username/article-title"
              className="flex-1 px-4 py-3 text-gray-900 transition-all border border-gray-300 outline-none rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            <button
              onClick={extractArticle}
              disabled={loading}
              className="flex items-center justify-center gap-2 px-6 py-3 font-medium text-white transition-all shadow-md bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl hover:from-green-600 hover:to-emerald-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Extracting...
                </>
              ) : (
                <>
                  <ExternalLink className="w-5 h-5" />
                  Extract
                </>
              )}
            </button>
          </div>

          {error && (
            <div className="flex items-start gap-3 p-4 mt-4 border border-red-200 bg-red-50 rounded-xl">
              <span className="text-red-600">⚠️</span>
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-gray-200 rounded-full"></div>
              <div className="absolute top-0 left-0 w-16 h-16 border-4 border-green-500 rounded-full animate-spin border-t-transparent"></div>
            </div>
            <p className="mt-4 text-lg font-medium text-gray-700">
              Extracting article...
            </p>
            <p className="mt-1 text-sm text-gray-500">
              This may take a few seconds
            </p>
          </div>
        )}

        {/* Article */}
        {article && !loading && (
          <div className="overflow-hidden bg-white border border-gray-200 shadow-lg rounded-2xl">
            {/* Top Bar */}
            <div className="flex flex-wrap items-center justify-end gap-2 px-6 py-4 border-b border-gray-100 bg-gray-50">
              <button
                onClick={copyToClipboard}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 transition-colors border border-gray-300 rounded-lg hover:bg-gray-100"
              >
                <Share2 className="w-4 h-4" />
                Copy
              </button>
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 transition-colors border border-gray-300 rounded-lg hover:bg-gray-100"
              >
                <ExternalLink className="w-4 h-4" />
                Original
              </a>
            </div>

            {/* Article Body */}
            <div className="px-6 py-10 sm:px-10 lg:px-16">
              {/* Header */}
              <header className="mb-10">
                <h1 className="mb-6 text-3xl font-bold leading-tight text-gray-900 sm:text-4xl lg:text-5xl">
                  {article.title}
                </h1>

                {article.subtitle && (
                  <h2 className="mb-8 text-lg leading-relaxed text-gray-600 sm:text-xl">
                    {article.subtitle}
                  </h2>
                )}

                <div className="flex flex-wrap items-center gap-4 pt-4 text-sm text-gray-600 border-t border-gray-200">
                  <div className="flex items-center gap-2">
                    <User className="w-5 h-5 text-green-600" />
                    <span className="font-medium text-gray-900">
                      {article.author}
                    </span>
                  </div>

                  {article.publishedTime && (
                    <div className="flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-green-600" />
                      <span>
                        {new Date(article.publishedTime).toLocaleDateString(
                          'en-US',
                          { month: 'long', day: 'numeric', year: 'numeric' }
                        )}
                      </span>
                    </div>
                  )}

                  {article.readingTime && (
                    <div className="flex items-center gap-2">
                      <Clock className="w-5 h-5 text-green-600" />
                      <span>{article.readingTime}</span>
                    </div>
                  )}
                </div>
              </header>

              {/* Image */}
              {article.featuredImage && (
                <div className="mb-12 overflow-hidden rounded-2xl">
                  <img
                    src={article.featuredImage}
                    alt="Featured"
                    className="object-cover w-full h-auto"
                  />
                </div>
              )}

              {/* Content */}
              <article className="max-w-3xl mx-auto article-content">
                <div dangerouslySetInnerHTML={{ __html: article.content }} />
              </article>
            </div>
          </div>
        )}

        {/* Empty */}
        {!article && !loading && !error && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="flex items-center justify-center w-20 h-20 mb-6 bg-gray-100 rounded-full">
              <BookOpen className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="mb-2 text-xl font-semibold text-gray-900">
              No article loaded
            </h3>
            <p className="text-gray-600">
              Enter a Medium URL above to start reading
            </p>
          </div>
        )}
      </main>

      {/* Enhanced Reader Styles */}
      <style>{`
        .article-content {
          font-family: 'Georgia', 'Cambria', 'Times New Roman', serif;
          font-size: 1.15rem;
          line-height: 1.8;
          color: #242424;
          word-wrap: break-word;
        }

        .article-content h2 {
          font-size: 1.8rem;
          font-weight: 700;
          margin-top: 2.5rem;
          margin-bottom: 1rem;
          line-height: 1.4;
        }

        .article-content h3 {
          font-size: 1.5rem;
          font-weight: 600;
          margin-top: 2rem;
          margin-bottom: 0.75rem;
        }

        .article-content p {
          margin-bottom: 1.75rem;
          letter-spacing: -0.003em;
        }

        .article-content ul,
        .article-content ol {
          margin: 1.25rem 0;
          padding-left: 2rem;
        }

        .article-content li {
          margin-bottom: 0.75rem;
        }

        .article-content blockquote {
          border-left: 4px solid #059669;
          padding-left: 1.25rem;
          margin: 2rem 0;
          font-style: italic;
          font-size: 1.25rem;
          color: #6B7280;
        }

        .article-content img {
          max-width: 100%;
          border-radius: 1rem;
          margin: 2rem 0;
        }

        .article-content a {
          color: #059669;
          text-decoration: underline;
          text-underline-offset: 3px;
        }

        .article-content a:hover {
          color: #047857;
        }

        .article-content code {
          background: #F3F4F6;
          padding: 2px 6px;
          border-radius: 4px;
          font-size: 0.95rem;
          font-family: monospace;
        }

        .article-content pre {
          background: #1F2937;
          color: #F9FAFB;
          padding: 1rem;
          border-radius: 0.75rem;
          overflow-x: auto;
        }

        table {
          width: 100%;
          border-collapse: collapse;
          margin: 2rem 0;
        }

        table th, table td {
          border: 1px solid #e5e7eb;
          padding: 0.75rem;
          text-align: left;
        }

        table th {
          background: #f9fafb;
          font-weight: 600;
        }

        @media (max-width: 640px) {
          .article-content {
            font-size: 1rem;
            line-height: 1.7;
          }
        }
      `}</style>
    </div>
  );
};

export default MediumExtractor;
