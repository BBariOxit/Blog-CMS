import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, info: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    // You can log error to monitoring here
    this.setState({ info });
    console.error('Uncaught error:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-red-50">
          <div className="max-w-3xl w-full bg-white rounded-xl shadow-lg p-6 border border-red-100">
            <h2 className="text-2xl font-bold text-red-700 mb-4">Something went wrong</h2>
            <p className="text-sm text-red-600 mb-4">The application encountered an unexpected error. The details are shown below — you can copy them and share with the developer.</p>

            <details className="text-xs text-gray-700 bg-gray-50 p-3 rounded overflow-auto" style={{whiteSpace: 'pre-wrap'}}>
              {String(this.state.error)}
              {this.state.info?.componentStack && '\n\n' + this.state.info.componentStack}
            </details>

            <div className="mt-6 flex items-center justify-end">
              <button onClick={() => window.location.reload()} className="px-4 py-2 bg-red-600 text-white rounded-lg">Reload</button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
