import { Component, StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Uncaught application error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center p-6 text-center">
          <h1 className="text-2xl font-bold text-[#D4AF37] mb-3">Musk Capital</h1>
          <p className="text-gray-400 max-w-md mb-6 text-sm">
            Something went wrong while loading the platform.
          </p>
          <pre className="bg-[#0D0F14] border border-red-500/30 text-red-400 p-4 rounded-xl text-xs max-w-lg overflow-auto mb-6 text-left">
            {this.state.error?.toString()}
          </pre>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2.5 bg-[#D4AF37] text-black font-semibold rounded-xl hover:bg-[#F0D060] transition-colors"
          >
            Reload Platform
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
)
