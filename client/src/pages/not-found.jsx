import { Link } from "wouter";
import { AlertCircle, ArrowLeft, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

function NotFound() {
  return (
    <div className="min-h-[70vh] w-full flex items-center justify-center p-4">
      <div className="w-full max-w-md p-8 rounded-[8px] bg-surface-raised border border-border text-center space-y-6 shadow-2xl">
        <div className="w-14 h-14 rounded-[6px] bg-bloom/15 border border-bloom/40 text-bloom flex items-center justify-center mx-auto shadow-[0_0_20px_rgba(255,109,109,0.2)]">
          <AlertCircle className="w-8 h-8" />
        </div>

        <div>
          <span className="badge-tech badge-tech-coral text-[10px] mb-2 inline-block">
            ERROR 404 // ROUTE NOT FOUND
          </span>
          <h1 className="text-2xl font-bold font-display text-foreground">
            Target Page Unreachable
          </h1>
          <p className="text-xs font-mono uppercase tracking-wider text-muted-foreground mt-2">
            The requested workspace route does not exist or has been relocated.
          </p>
        </div>

        <div className="pt-2">
          <Link href="/pomodoro">
            <Button variant="default" size="lg" className="w-full">
              <ArrowLeft className="w-4 h-4 mr-2" />
              <span>RETURN TO FOCUS STATION</span>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export { NotFound as default };
