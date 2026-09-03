import { Component, type ReactNode } from "react";

interface Props { children: ReactNode; }
interface State { err: Error | null; }

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { err: null };

  static getDerivedStateFromError(err: Error): State { return { err }; }

  componentDidCatch(err: Error, info: React.ErrorInfo) {
    console.error("Type to Survive crashed:", err, info);
  }

  render() {
    if (!this.state.err) return this.props.children;
    return (
      <div style={{
        minHeight: "100vh",
        background: "radial-gradient(ellipse at center, #1a1a2e 0%, #0f0f1a 100%)",
        color: "#e2e8f0", fontFamily: "'Courier New', monospace",
        display: "flex", alignItems: "center", justifyContent: "center", padding: 24,
      }}>
        <div style={{
          background: "rgba(12,12,28,0.92)",
          border: "1px solid rgba(239,68,68,0.35)",
          borderRadius: 12, padding: "32px 40px", maxWidth: 460, textAlign: "center",
        }}>
          <div style={{ fontSize: 44 }}>💥</div>
          <h2 style={{ color: "#ef4444", margin: "8px 0 4px", fontSize: 22, letterSpacing: 2 }}>
            Something Broke
          </h2>
          <p style={{ color: "#94a3b8", fontSize: 12, margin: "0 0 20px", lineHeight: 1.6 }}>
            The game hit an unexpected error. Refreshing usually fixes it.
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{
              background: "linear-gradient(135deg, rgba(74,222,128,0.22) 0%, rgba(34,211,238,0.18) 100%)",
              border: "1px solid rgba(74,222,128,0.55)",
              color: "#dcfce7", fontWeight: 800, letterSpacing: 2,
              padding: "12px 28px", borderRadius: 8, cursor: "pointer",
              fontFamily: "inherit", fontSize: 14,
            }}
          >
            ↻ REFRESH
          </button>
        </div>
      </div>
    );
  }
}
