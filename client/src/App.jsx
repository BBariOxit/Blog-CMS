/**
 * App.jsx
 * Main app component với routing
 */

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header.jsx';
import Home from './pages/Home.jsx';
import PostDetail from './pages/PostDetail.jsx';
import Editor from './pages/Editor.jsx';
import AdminPosts from './pages/AdminPosts.jsx';
import Login from './pages/Login.jsx';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/post/:slug" element={<PostDetail />} />
            <Route path="/editor" element={<Editor />} />
            <Route path="/editor/:id" element={<Editor />} />
            <Route path="/admin" element={<AdminPosts />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </main>
        <footer className="bg-white border-t border-gray-200 mt-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <p className="text-center text-gray-600">
              © 2025 PaperPress - Built with{' '}
              <span className="text-red-500">❤️</span> using React, Node.js &
              Design Patterns
            </p>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
