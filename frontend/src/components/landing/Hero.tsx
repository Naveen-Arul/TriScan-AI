import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, Sparkles, Code2, Heart, Github, Linkedin, Mail } from "lucide-react";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 hero-gradient" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px] animate-pulse-glow" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/20 rounded-full blur-[100px] animate-pulse-glow" style={{ animationDelay: "1s" }} />
      
      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(222_30%_15%_/_0.1)_1px,transparent_1px),linear-gradient(to_bottom,hsl(222_30%_15%_/_0.1)_1px,transparent_1px)] bg-[size:60px_60px]" />

      <div className="container relative z-10 px-4 py-20">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
          {/* Badge */}
          <div className="animate-fade-up" style={{ animationDelay: "0.1s" }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/50 border border-border backdrop-blur-sm mb-8">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm text-muted-foreground">AI-Powered Document Intelligence</span>
            </div>
          </div>

          {/* Heading */}
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 animate-fade-up" style={{ animationDelay: "0.2s" }}>
            <span className="gradient-text">TriScan</span>
            <span className="text-foreground"> AI</span>
          </h1>

          {/* Subheading */}
          <p className="text-xl md:text-2xl text-muted-foreground mb-4 animate-fade-up" style={{ animationDelay: "0.3s" }}>
            Read. Compare. Extract. All in One.
          </p>

          {/* Description */}
          <p className="text-lg text-muted-foreground/80 max-w-2xl mb-10 animate-fade-up" style={{ animationDelay: "0.4s" }}>
            Transform any document with intelligent OCR, compare multiple files instantly, 
            and extract clean content from any website. Three powerful tools in one unified platform.
          </p>

          {/* Developer Card */}
          <div className="w-full max-w-2xl mb-10 animate-fade-up" style={{ animationDelay: "0.45s" }}>
            <Card className="glass-card p-6 border-2 hover:border-primary/50 transition-all duration-500 group">
              <div className="flex items-center gap-6">
                {/* Avatar */}
                <div className="relative flex-shrink-0">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary via-purple-500 to-pink-500 p-1 animate-pulse-glow">
                    <div className="w-full h-full rounded-full bg-background flex items-center justify-center">
                      <Code2 className="w-10 h-10 text-primary" />
                    </div>
                  </div>
                  <div className="absolute -bottom-1 -right-1 bg-primary text-primary-foreground rounded-full p-1.5">
                    <Heart className="w-3 h-3 fill-current" />
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 text-left">
                  <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-primary/10 border border-primary/20 mb-2">
                    <span className="text-xs font-semibold text-primary">Developer</span>
                  </div>
                  
                  <h3 className="text-xl font-bold mb-2">
                    Developed by <span className="gradient-text">Naveen Arul</span>
                  </h3>
                  
                  <p className="text-sm text-muted-foreground mb-3">
                    Full-stack developer passionate about building AI-powered applications 
                    that solve real-world problems.
                  </p>

                  {/* Social Links */}
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2 h-8 text-xs hover:border-primary/50 hover:bg-primary/10"
                      asChild
                    >
                      <a href="https://github.com/Naveen-Arul" target="_blank" rel="noopener noreferrer">
                        <Github className="w-3 h-3" />
                        GitHub
                      </a>
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2 h-8 text-xs hover:border-primary/50 hover:bg-primary/10"
                      asChild
                    >
                      <a href="https://www.linkedin.com/in/naveen2408/" target="_blank" rel="noopener noreferrer">
                        <Linkedin className="w-3 h-3" />
                        LinkedIn
                      </a>
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2 h-8 text-xs hover:border-primary/50 hover:bg-primary/10"
                      asChild
                    >
                      <a href="mailto:naveenarul111@gmail.com">
                        <Mail className="w-3 h-3" />
                        Email
                      </a>
                    </Button>
                  </div>
                </div>
              </div>

              {/* Tech Stack Pills */}
              <div className="mt-4 pt-4 border-t border-border/50 flex flex-wrap gap-2 justify-center">
                {["React", "TypeScript", "Node.js", "MongoDB", "Groq AI", "Tailwind CSS"].map((tech) => (
                  <div
                    key={tech}
                    className="px-3 py-1 rounded-full bg-secondary/50 border border-border text-xs font-medium text-muted-foreground hover:border-primary/50 hover:text-primary transition-all cursor-default"
                  >
                    {tech}
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 animate-fade-up" style={{ animationDelay: "0.5s" }}>
            <Link to="/signup">
              <Button variant="hero" size="xl">
                Get Started Free
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="glass" size="xl">
                Sign In
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 mt-16 animate-fade-up" style={{ animationDelay: "0.6s" }}>
            {[
              { value: "3", label: "AI Tools" },
              { value: "99%", label: "Accuracy" },
              { value: "∞", label: "Documents" },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-3xl md:text-4xl font-bold gradient-text">{stat.value}</div>
                <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
