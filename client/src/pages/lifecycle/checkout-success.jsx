import { Link } from "wouter";
import { CheckCircle2, ArrowRight, Download, Zap } from "lucide-react";
import { AuthLayout } from "@/components/layout/AuthLayout";

export default function CheckoutSuccessPage() {
  const invoiceId = `INV-PACE-${Math.floor(100000 + Math.random() * 900000)}`;

  return (
    <AuthLayout
      title="Payment Successful"
      subtitle="Welcome to pace. Pro. Your cognitive workspace is upgraded."
      backTo="/pomodoro"
    >
      <div className="space-y-6 text-center font-sans">
        <div className="w-16 h-16 rounded-full bg-greptile-green/20 text-greptile-green flex items-center justify-center mx-auto shadow-[0_0_25px_rgba(40,233,159,0.3)] animate-in zoom-in duration-300">
          <CheckCircle2 className="w-9 h-9" />
        </div>

        {/* Receipt Box */}
        <div className="p-4 rounded-[6px] border border-border bg-surface text-left text-xs font-mono space-y-2">
          <div className="flex items-center justify-between text-muted-foreground pb-2 border-b border-border/40">
            <span>TRANSACTION CONFIRMATION</span>
            <span className="text-greptile-green font-bold">PAID</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Invoice Reference:</span>
            <span className="text-foreground">{invoiceId}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Product Tier:</span>
            <span className="text-foreground">Pace Pro (Annual)</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Amount:</span>
            <span className="text-foreground font-bold">$120.00 USD</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Next Renewal:</span>
            <span className="text-foreground">October 13, 2027</span>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <Link
            href="/pomodoro"
            className="w-full py-3 rounded-[4px] bg-greptile-green hover:bg-[#34f5ab] text-black font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(40,233,159,0.3)]"
          >
            Launch pace. Console <ArrowRight className="w-3.5 h-3.5" />
          </Link>

          <button
            onClick={() => alert("Downloading PDF Invoice...")}
            className="w-full py-2 rounded-[4px] border border-border text-xs font-mono text-muted-foreground hover:text-foreground flex items-center justify-center gap-2 transition-colors"
          >
            <Download className="w-3.5 h-3.5" /> Download Tax Invoice PDF
          </button>
        </div>
      </div>
    </AuthLayout>
  );
}
