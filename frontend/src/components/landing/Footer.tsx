import { ScanText } from "lucide-react";

const Footer = () => {
  return (
    <footer className="py-12 border-t border-border">
      <div className="container px-4">
        <div className="flex flex-col items-center gap-6">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center">
              <ScanText className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">
              <span className="gradient-text">TriScan</span> AI
            </span>
          </div>

          {/* Developer Info */}
          <div className="text-center space-y-2">
            <p className="text-muted-foreground">
              Developed by <span className="text-foreground font-semibold">NAVEEN A</span>
            </p>
            <p className="text-sm text-muted-foreground">
              9360500228 • naveenarul111@gmail.com
            </p>
          </div>

          <p className="text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} TriScan AI. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
