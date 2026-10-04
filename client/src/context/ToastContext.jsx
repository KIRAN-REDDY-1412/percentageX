import { createContext, useContext, useState, useCallback } from "react";
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from "lucide-react";

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback((message, type = "success", duration = 3500) => {
    const id = Date.now() + Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  }, [removeToast]);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="toast-container" aria-live="polite">
        {toasts.map((t) => {
          let Icon = CheckCircle2;
          let iconClass = "toast-icon-success";
          if (t.type === "error") {
            Icon = AlertCircle;
            iconClass = "toast-icon-error";
          } else if (t.type === "warning") {
            Icon = AlertTriangle;
            iconClass = "toast-icon-warning";
          } else if (t.type === "info") {
            Icon = Info;
            iconClass = "toast-icon-info";
          }

          return (
            <div key={t.id} className={`toast-card toast-${t.type}`} role="alert">
              <div className={`toast-icon-wrap ${iconClass}`}>
                <Icon size={18} />
              </div>
              <div className="toast-message">{t.message}</div>
              <button
                type="button"
                className="toast-close-btn"
                onClick={() => removeToast(t.id)}
                aria-label="Close notification"
              >
                <X size={15} />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    return {
      showToast: (msg) => console.log("[Toast]", msg),
    };
  }
  return context;
}
