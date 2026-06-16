import { Component, type ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-white px-4 dark:bg-gray-950">
          <div className="text-center">
            <div className="mx-auto mb-3 rounded-lg bg-gray-100 p-2.5 dark:bg-gray-800">
              <AlertTriangle className="h-5 w-5 text-gray-500 dark:text-gray-400" />
            </div>
            <h1 className="text-sm font-semibold text-gray-900 dark:text-white">Something went wrong</h1>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-500">Try refreshing the page.</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 rounded-lg bg-gray-900 px-4 py-2 text-xs font-medium text-white transition hover:bg-gray-800 dark:bg-white dark:text-gray-900"
            >
              Reload
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
