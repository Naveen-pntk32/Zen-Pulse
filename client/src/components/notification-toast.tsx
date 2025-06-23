import { useState, useEffect } from 'react';
import { CheckCircle, X, AlertCircle, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'info';
  title: string;
  message: string;
  duration?: number;
}

interface NotificationToastProps {
  toasts: Toast[];
  onRemove: (id: string) => void;
}

export function NotificationToast({ toasts, onRemove }: NotificationToastProps) {
  useEffect(() => {
    toasts.forEach(toast => {
      if (toast.duration !== 0) {
        const timer = setTimeout(() => {
          onRemove(toast.id);
        }, toast.duration || 5000);

        return () => clearTimeout(timer);
      }
    });
  }, [toasts, onRemove]);

  const getIcon = (type: Toast['type']) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5" />;
      case 'error':
        return <AlertCircle className="w-5 h-5" />;
      case 'info':
        return <Info className="w-5 h-5" />;
      default:
        return <Info className="w-5 h-5" />;
    }
  };

  const getColorClasses = (type: Toast['type']) => {
    switch (type) {
      case 'success':
        return 'bg-green-400 text-white';
      case 'error':
        return 'bg-red-400 text-white';
      case 'info':
        return 'bg-blue-400 text-white';
      default:
        return 'bg-gray-800 text-white border border-gray-700';
    }
  };

  if (toasts.length === 0) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className={`px-6 py-3 rounded-2xl shadow-lg flex items-center space-x-3 animate-pulse-slow max-w-sm ${getColorClasses(toast.type)}`}
        >
          {getIcon(toast.type)}
          <div className="flex-1">
            <div className="font-medium">{toast.title}</div>
            {toast.message && (
              <div className="text-sm opacity-90">{toast.message}</div>
            )}
          </div>
          <Button
            onClick={() => onRemove(toast.id)}
            variant="ghost"
            size="icon"
            className="ml-2 hover:bg-white/20 p-1"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      ))}
    </div>
  );
}

// Hook for managing toasts
export function useToasts() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (toast: Omit<Toast, 'id'>) => {
    const id = crypto.randomUUID();
    setToasts(prev => [...prev, { ...toast, id }]);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const showSuccess = (title: string, message?: string, duration?: number) => {
    addToast({ type: 'success', title, message: message || '', duration });
  };

  const showError = (title: string, message?: string, duration?: number) => {
    addToast({ type: 'error', title, message: message || '', duration });
  };

  const showInfo = (title: string, message?: string, duration?: number) => {
    addToast({ type: 'info', title, message: message || '', duration });
  };

  return {
    toasts,
    addToast,
    removeToast,
    showSuccess,
    showError,
    showInfo,
  };
}
