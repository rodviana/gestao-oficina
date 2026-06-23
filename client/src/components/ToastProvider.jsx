import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';

const ToastContext = createContext(null);

let pushToast = null;

export function notifyToast(toast) {
  pushToast?.(toast);
}

function ToastItem({ toast, onDismiss }) {
  const timerRef = useRef(null);

  useEffect(() => {
    timerRef.current = setTimeout(() => onDismiss(toast.id), toast.duration);
    return () => clearTimeout(timerRef.current);
  }, [toast.id, toast.duration, onDismiss]);

  const isError = toast.type === 'error';
  const title = toast.title || (isError ? 'Atenção' : 'Sucesso');

  return (
    <div
      role="alert"
      className={`pointer-events-auto w-full max-w-sm rounded-lg border px-4 py-3 shadow-lg ${
        isError
          ? 'border-red-200 bg-red-50 text-red-900'
          : 'border-emerald-200 bg-emerald-50 text-emerald-900'
      }`}
    >
      <div className="flex items-start gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold">{title}</p>
          {toast.errors?.length ? (
            <ul className="mt-1 list-disc space-y-0.5 pl-4 text-sm">
              {toast.errors.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          ) : (
            <p className="mt-0.5 text-sm">{toast.message}</p>
          )}
        </div>
        <button
          type="button"
          onClick={() => onDismiss(toast.id)}
          className={`shrink-0 rounded p-1 text-xs font-semibold transition ${
            isError ? 'hover:bg-red-100' : 'hover:bg-emerald-100'
          }`}
          aria-label="Fechar notificação"
        >
          ✕
        </button>
      </div>
    </div>
  );
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const dismissToast = useCallback((id) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const addToast = useCallback((toast) => {
    const id = crypto.randomUUID();
    setToasts((current) => [...current, { ...toast, id }]);
    return id;
  }, []);

  useEffect(() => {
    pushToast = addToast;
    return () => {
      pushToast = null;
    };
  }, [addToast]);

  return (
    <ToastContext.Provider value={{ addToast, dismissToast }}>
      {children}
      <div
        aria-live="polite"
        className="pointer-events-none fixed bottom-4 right-4 z-50 flex w-[calc(100%-2rem)] max-w-sm flex-col gap-2 sm:w-auto"
      >
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onDismiss={dismissToast} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
}
