import { Link } from "wouter";
import { Zap, ArrowLeft } from "lucide-react";

export function AuthLayout({ children, title, subtitle, backTo = "/" }) {
  return (
    <div className="min-h-screen w-full bg-background bg-grid-pattern text-foreground flex flex-col justify-center items-center p-4 sm:p-6 antialiased selection:bg-greptile-green selection:text-black relative">
      {/* Background ambient radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-radial-glow pointer-events-none -z-10" />

      {/* Back Link */}
      <div className="w-full max-w-md mb-6">
        <Link
          href={backTo}
          className="inline-flex items-center gap-1.5 text-xs font-mono text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to pace.
        </Link>
      </div>

      {/* Centered Auth Card */}
      <div className="w-full max-w-md rounded-[8px] border border-border/80 bg-surface/95 backdrop-blur-xl p-6 sm:p-8 shadow-2xl relative">
        {/* Technical Corner Crosses */}
        <div className="absolute -top-1.5 -left-1.5 font-mono text-[10px] text-greptile-green pointer-events-none select-none">
          +
        </div>
        <div className="absolute -top-1.5 -right-1.5 font-mono text-[10px] text-greptile-green pointer-events-none select-none">
          +
        </div>
        <div className="absolute -bottom-1.5 -left-1.5 font-mono text-[10px] text-greptile-green pointer-events-none select-none">
          +
        </div>
        <div className="absolute -bottom-1.5 -right-1.5 font-mono text-[10px] text-greptile-green pointer-events-none select-none">
          +
        </div>

        {/* Card Header */}
        <div className="flex flex-col items-center text-center space-y-3 mb-6">
          <Link href="/" className="w-10 h-10 rounded-[6px] bg-greptile-green flex items-center justify-center shadow-[0_0_15px_rgba(40,233,159,0.3)] transition-transform hover:scale-105">
            <Zap className="w-5 h-5 text-black fill-black" />
          </Link>
          <div className="space-y-1">
            <h1 className="text-xl font-display font-bold text-foreground tracking-tight">
              {title}
            </h1>
            {subtitle && (
              <p className="text-xs font-sans text-muted-foreground">
                {subtitle}
              </p>
            )}
          </div>
        </div>

        {children}
      </div>

      {/* Security Footer */}
      <div className="mt-8 text-center text-[11px] font-mono text-muted-foreground/70">
        // SECURE TLS 1.3 ENCRYPTION • PACE ENGINE v2.0
      </div>
    </div>
  );
}
export default AuthLayout;
