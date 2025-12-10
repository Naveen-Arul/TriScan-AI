import { ScanText, GitCompare, Globe, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ModeSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectMode: (mode: "ocr" | "compare" | "scrape") => void;
}

const modes = [
  {
    id: "ocr" as const,
    icon: ScanText,
    title: "OCR",
    description: "Extract text from images and PDFs",
    color: "from-cyan-500 to-blue-500",
  },
  {
    id: "compare" as const,
    icon: GitCompare,
    title: "Compare Files",
    description: "Compare multiple documents side by side",
    color: "from-purple-500 to-pink-500",
  },
  {
    id: "scrape" as const,
    icon: Globe,
    title: "Web Scraping",
    description: "Extract content from any website",
    color: "from-green-500 to-emerald-500",
  },
];

const ModeSelector = ({ isOpen, onClose, onSelectMode }: ModeSelectorProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm animate-fade-in">
      <div className="glass-card p-8 max-w-2xl w-full mx-4 animate-scale-in">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold">Choose Your Mode</h2>
            <p className="text-muted-foreground">Select the tool you want to use</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-secondary transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {modes.map((mode) => (
            <button
              key={mode.id}
              onClick={() => onSelectMode(mode.id)}
              className={cn(
                "group p-6 rounded-xl border border-border bg-secondary/30 hover:border-primary/50",
                "transition-all duration-300 hover:shadow-glow text-left"
              )}
            >
              <div
                className={cn(
                  "w-14 h-14 rounded-xl bg-gradient-to-br flex items-center justify-center mb-4",
                  "group-hover:scale-110 transition-transform duration-300",
                  mode.color
                )}
              >
                <mode.icon className="w-7 h-7 text-primary-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-1">{mode.title}</h3>
              <p className="text-sm text-muted-foreground">{mode.description}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ModeSelector;
