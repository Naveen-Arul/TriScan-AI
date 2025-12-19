import { Card } from "@/components/ui/card";
import { Github, Linkedin, Mail, Code2, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

const Developer = () => {
  return (
    <section className="py-20 px-4 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[150px]" />
      
      <div className="container relative z-10 max-w-4xl mx-auto">
        <Card className="glass-card p-8 md:p-12 border-2 hover:border-primary/50 transition-all duration-500 group">
          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* Avatar */}
            <div className="relative">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary via-purple-500 to-pink-500 p-1 animate-pulse-glow">
                <div className="w-full h-full rounded-full bg-background flex items-center justify-center">
                  <Code2 className="w-16 h-16 text-primary" />
                </div>
              </div>
              <div className="absolute -bottom-2 -right-2 bg-primary text-primary-foreground rounded-full p-2">
                <Heart className="w-5 h-5 fill-current" />
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 mb-4">
                <span className="text-xs font-semibold text-primary">Developer</span>
              </div>
              
              <h3 className="text-3xl font-bold mb-2">
                Developed by <span className="gradient-text">Naveen Arul</span>
              </h3>
              
              <p className="text-muted-foreground mb-6 max-w-xl">
                Full-stack developer passionate about building AI-powered applications 
                that solve real-world problems. TriScan AI combines cutting-edge technology 
                with intuitive design.
              </p>

              {/* Social Links */}
              <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2 hover:border-primary/50 hover:bg-primary/10"
                  asChild
                >
                  <a href="https://github.com/Naveen-Arul" target="_blank" rel="noopener noreferrer">
                    <Github className="w-4 h-4" />
                    GitHub
                  </a>
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2 hover:border-primary/50 hover:bg-primary/10"
                  asChild
                >
                  <a href="https://www.linkedin.com/in/naveen2408/" target="_blank" rel="noopener noreferrer">
                    <Linkedin className="w-4 h-4" />
                    LinkedIn
                  </a>
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2 hover:border-primary/50 hover:bg-primary/10"
                  asChild
                >
                  <a href="mailto:naveenarul111@gmail.com">
                    <Mail className="w-4 h-4" />
                    Email
                  </a>
                </Button>
              </div>
            </div>
          </div>

          {/* Decorative Elements */}
          <div className="absolute top-4 right-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Code2 className="w-32 h-32" />
          </div>
        </Card>

        {/* Tech Stack Pills */}
        <div className="mt-8 flex flex-wrap gap-2 justify-center">
          {["React", "TypeScript", "Node.js", "MongoDB", "Groq AI", "Tailwind CSS"].map((tech) => (
            <div
              key={tech}
              className="px-4 py-2 rounded-full bg-secondary/50 border border-border text-sm font-medium text-muted-foreground hover:border-primary/50 hover:text-primary transition-all cursor-default"
            >
              {tech}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Developer;
