import { BookOpen, Sparkles, Zap, ScanText } from "lucide-react";

const taglines = [
  {
    text: "Read. Compare. Extract. All in One.",
    icon: BookOpen,
  },
  {
    text: "Your Universal Document Intelligence Tool.",
    icon: Sparkles,
  },
  {
    text: "Three Smart Tools. One Powerful AI.",
    icon: Zap,
  },
  {
    text: "Scan Smarter with TriScan AI.",
    icon: ScanText,
  },
];

const Taglines = () => {
  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />
      
      <div className="container px-4 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Why Choose <span className="gradient-text">TriScan AI</span>?
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Experience the power of intelligent document processing
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {taglines.map((tagline, i) => (
            <div
              key={i}
              className="group relative"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              {/* Glow effect on hover */}
              <div className="absolute -inset-0.5 bg-gradient-primary rounded-2xl opacity-0 group-hover:opacity-100 blur-lg transition-opacity duration-500" />
              
              <div className="relative glass-card p-8 h-full flex flex-col items-center text-center gap-4 hover:scale-105 hover:-translate-y-2 transition-all duration-300 cursor-pointer group-hover:border-primary/50">
                {/* Icon */}
                <div className="w-14 h-14 rounded-xl bg-gradient-primary flex items-center justify-center shadow-glow group-hover:scale-110 transition-transform duration-300">
                  <tagline.icon className="w-7 h-7 text-primary-foreground" />
                </div>
                
                {/* Text */}
                <p className="text-foreground font-semibold text-lg leading-relaxed group-hover:text-primary transition-colors duration-300">
                  {tagline.text}
                </p>

                {/* Decorative line */}
                <div className="w-12 h-1 bg-gradient-primary rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Taglines;
