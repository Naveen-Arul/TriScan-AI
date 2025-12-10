import { ScanText, GitCompare, Globe, Zap, Shield, Sparkles } from "lucide-react";

const features = [
  {
    icon: ScanText,
    title: "Intelligent OCR",
    description: "Transform any image or PDF into clean, editable text. Supports typed & handwritten text with multi-language recognition.",
    highlights: ["Multi-language support", "Handwriting recognition", "Auto formatting"],
  },
  {
    icon: GitCompare,
    title: "Smart File Comparison",
    description: "Compare two or more files side-by-side. Detect additions, deletions, and modifications instantly.",
    highlights: ["Side-by-side view", "Difference detection", "Common points analysis"],
  },
  {
    icon: Globe,
    title: "Web Scraping",
    description: "Extract readable text from any website. Removes ads, noise, and irrelevant sections automatically.",
    highlights: ["Clean extraction", "Noise removal", "Structured output"],
  },
];

const benefits = [
  { icon: Zap, title: "Lightning Fast", description: "AI-powered processing in seconds" },
  { icon: Shield, title: "Privacy First", description: "Your data stays secure and private" },
  { icon: Sparkles, title: "AI Accuracy", description: "99%+ accuracy with smart formatting" },
];

const Features = () => {
  return (
    <section className="py-24 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-secondary/20 to-transparent" />
      
      <div className="container relative z-10 px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="gradient-text">Three Smart Tools.</span>
            <span className="text-foreground"> One Powerful AI.</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Everything you need to work with documents, powered by cutting-edge AI technology.
          </p>
        </div>

        {/* Main Features */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group glass-card p-8 hover:border-primary/50 transition-all duration-500 hover:shadow-glow"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="w-14 h-14 rounded-xl bg-gradient-primary flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <feature.icon className="w-7 h-7 text-primary-foreground" />
              </div>
              
              <h3 className="text-xl font-semibold mb-3 text-foreground">{feature.title}</h3>
              <p className="text-muted-foreground mb-6">{feature.description}</p>
              
              <ul className="space-y-2">
                {feature.highlights.map((highlight, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                    {highlight}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Benefits */}
        <div className="grid md:grid-cols-3 gap-6">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="flex items-center gap-4 p-6 rounded-xl bg-secondary/30 border border-border hover:border-primary/30 transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <benefit.icon className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h4 className="font-semibold text-foreground">{benefit.title}</h4>
                <p className="text-sm text-muted-foreground">{benefit.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
