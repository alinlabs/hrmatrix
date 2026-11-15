import { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public props: Props;
  public state: State;

  constructor(props: Props) {
    super(props);
    this.props = props;
    this.state = {
      hasError: false,
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in component tree:', error, errorInfo);
    
    // Auto-recover from dynamic import / chunk load failures or React hook mismatch once
    const errorMsg = error?.message || '';
    const isChunkOrHookMismatch = 
      errorMsg.includes('Importing a module script failed') ||
      errorMsg.includes('Failed to fetch dynamically imported module') ||
      errorMsg.includes('error loading dynamically imported module') ||
      errorMsg.includes('ChunkLoadError') ||
      errorMsg.includes("reading 'useContext'") ||
      errorMsg.includes('Invalid hook call');

    if (isChunkOrHookMismatch) {
      const storageKey = 'boundary_auto_reload_chunk_error';
      const hasReloaded = window.sessionStorage.getItem(storageKey);
      if (!hasReloaded) {
        window.sessionStorage.setItem(storageKey, 'true');
        const doReload = () => {
          window.location.reload();
        };
        // Clear caches and reload
        if (typeof caches !== 'undefined') {
          caches.keys()
            .then(names => Promise.all(names.map(n => caches.delete(n))))
            .finally(doReload);
        } else {
          doReload();
        }
      }
    }
  }

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-2xl border border-slate-200 shadow-sm p-6 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h2 className="text-lg font-bold text-slate-900">Terjadi Kendala Memuat Halaman</h2>
              <p className="text-xs text-slate-500 leading-relaxed">
                Aplikasi mengalami kendala saat merender komponen. Silakan muat ulang halaman untuk melanjutkan.
              </p>
            </div>
            {this.state.error?.message && (
              <div className="p-3 bg-slate-50 rounded-lg text-left text-xs font-mono text-slate-600 overflow-x-auto max-h-24">
                {this.state.error.message}
              </div>
            )}
            <button
              onClick={this.handleReload}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-xs cursor-pointer w-full"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Muat Ulang Aplikasi
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
