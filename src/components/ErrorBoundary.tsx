import React, { ErrorInfo } from 'react';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends React.Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-stone-50 px-4">
          <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-lg text-center">
            <h2 className="text-2xl font-serif text-stone-900 mb-4">Something went wrong</h2>
            <p className="text-stone-500 mb-6">
              We're sorry, but an unexpected error occurred. Please try refreshing the page.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-emerald-800 text-white px-6 py-2 rounded-full font-medium hover:bg-emerald-900 transition-all"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return (this as any).props.children;
  }
}

export default ErrorBoundary;
