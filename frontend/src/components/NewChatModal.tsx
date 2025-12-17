import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FileText, Globe, GitCompare, Sparkles } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useChatStore } from "@/store/chatStore";
import { useToast } from "@/hooks/use-toast";

interface NewChatModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const modes = [
  {
    id: 'ocr' as const,
    name: 'OCR Mode',
    description: 'Extract text from images, PDFs, and documents',
    icon: FileText,
    gradient: 'from-blue-500 to-cyan-500',
    bgGradient: 'from-blue-500/10 to-cyan-500/10'
  },
  {
    id: 'web' as const,
    name: 'Web Scraping',
    description: 'Extract and analyze content from websites',
    icon: Globe,
    gradient: 'from-purple-500 to-pink-500',
    bgGradient: 'from-purple-500/10 to-pink-500/10'
  },
  {
    id: 'compare' as const,
    name: 'Compare Files',
    description: 'Find differences and similarities between documents',
    icon: GitCompare,
    gradient: 'from-orange-500 to-red-500',
    bgGradient: 'from-orange-500/10 to-red-500/10'
  }
];

export const NewChatModal = ({ open, onOpenChange }: NewChatModalProps) => {
  const [selectedMode, setSelectedMode] = useState<'ocr' | 'web' | 'compare' | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const navigate = useNavigate();
  const createNewChat = useChatStore(state => state.createNewChat);
  const { toast } = useToast();

  const handleCreateChat = async () => {
    if (!selectedMode) return;

    setIsCreating(true);
    try {
      const chat = await createNewChat(selectedMode);
      
      toast({
        title: "Chat created!",
        description: `New ${modes.find(m => m.id === selectedMode)?.name} session started.`,
      });

      // Close modal
      onOpenChange(false);
      
      // Navigate to the appropriate workspace
      navigate(`/chat/${chat.chatId}/${selectedMode}`);
      
      // Reset selection
      setSelectedMode(null);
    } catch (error: any) {
      toast({
        title: "Failed to create chat",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] glass-card border-border">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Sparkles className="w-6 h-6 text-primary" />
            Start a New Chat
          </DialogTitle>
          <DialogDescription>
            Choose a mode to begin your analysis
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-6">
          {modes.map((mode) => {
            const Icon = mode.icon;
            const isSelected = selectedMode === mode.id;
            
            return (
              <button
                key={mode.id}
                onClick={() => setSelectedMode(mode.id)}
                className={`
                  relative p-6 rounded-xl border-2 transition-all duration-200 text-left
                  hover:scale-[1.02] hover:shadow-lg
                  ${isSelected 
                    ? 'border-primary bg-primary/5 shadow-md' 
                    : 'border-border hover:border-primary/50'
                  }
                `}
              >
                <div className="flex items-start gap-4">
                  <div className={`
                    p-3 rounded-lg bg-gradient-to-br ${mode.bgGradient}
                    ${isSelected ? 'ring-2 ring-primary ring-offset-2 ring-offset-background' : ''}
                  `}>
                    <Icon className="w-6 h-6" style={{ 
                      color: mode.id === 'ocr' ? '#3b82f6' : mode.id === 'web' ? '#a855f7' : '#f97316' 
                    }} />
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-1">
                      {mode.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {mode.description}
                    </p>
                  </div>

                  {isSelected && (
                    <div className="absolute top-4 right-4">
                      <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                        <svg className="w-4 h-4 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        <div className="flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isCreating}
          >
            Cancel
          </Button>
          <Button
            variant="hero"
            onClick={handleCreateChat}
            disabled={!selectedMode || isCreating}
          >
            {isCreating ? "Creating..." : "Start Chat"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
