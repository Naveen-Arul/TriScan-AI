import { ScanText, GitCompare, Globe, Sparkles } from "lucide-react";

interface WelcomeScreenProps {
  onSelectMode: (mode: "ocr" | "compare" | "scrape") => void;
}

const tools = [
  {
    id: "ocr" as const,
    icon: ScanText,
    title: "Intelligent OCR",
    description: "Extract text from images and PDFs with AI-powered accuracy",
    gradient: "from-cyan-500 to-blue-500",
  },
  {
    id: "compare" as const,
    icon: GitCompare,
    title: "Smart Comparison",
    description: "Compare documents and find differences instantly",
    gradient: "from-purple-500 to-pink-500",
  },
  {
    id: "scrape" as const,
    icon: Globe,
    title: "Web Scraping",
    description: "Extract clean content from any website",
    gradient: "from-green-500 to-emerald-500",
  },
];

const WelcomeScreen = ({ onSelectMode }: WelcomeScreenProps) => {
  return (
    <div className="h-full flex flex-col items-center justify-center p-8">
      <div className="text-center mb-12 max-w-2xl">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/50 border border-border mb-6">
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="text-sm text-muted-foreground">Welcome to TriScan AI</span>
        </div>
        
        <h1 className="text-4xl font-bold mb-4">
          What would you like to <span className="gradient-text">do today</span>?
        </h1>
        <p className="text-muted-foreground text-lg">
          Select a tool below to get started with your document intelligence workflow.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 max-w-4xl w-full">
        {tools.map((tool) => (
          <button
            key={tool.id}
            onClick={() => onSelectMode(tool.id)}
            className="group glass-card p-8 text-left hover:border-primary/50 transition-all duration-500 hover:shadow-glow"
          >
            <div
              className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${tool.gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
            >
              <tool.icon className="w-8 h-8 text-primary-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">{tool.title}</h3>
            <p className="text-muted-foreground">{tool.description}</p>
          </button>
        ))}
      </div>
    </div>
  );
};

export default WelcomeScreen;
