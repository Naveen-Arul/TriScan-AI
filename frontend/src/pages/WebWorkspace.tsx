import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useChatStore } from "@/store/chatStore";
import { Globe, Loader2, Copy, CheckCheck, Sparkles, RefreshCw, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { WebScrapeForm } from "@/components/WebScrapeForm";
import { cn } from "@/lib/utils";

const WebWorkspace = () => {
  const { chatId } = useParams<{ chatId: string }>();
  const navigate = useNavigate();
  const { getChatById, setCurrentChatId, refreshHistory } = useChatStore();
  const [chat, setChat] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [scrapeResult, setScrapeResult] = useState<string | null>(null);
  const [currentUrl, setCurrentUrl] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (!chatId) {
      navigate('/dashboard');
      return;
    }

    const chatData = getChatById(chatId);
    
    if (!chatData) {
      navigate('/dashboard');
      return;
    }

    if (chatData.mode !== 'web') {
      navigate(`/chat/${chatId}/${chatData.mode}`);
      return;
    }

    setChat(chatData);
    setCurrentChatId(chatId);
    setIsLoading(false);
  }, [chatId, getChatById, navigate, setCurrentChatId]);

  const handleScrapeSuccess = async (result: any) => {
    if (result.success && result.clean_text) {
      setScrapeResult(result.clean_text);
      setCurrentUrl(result.url || null);
      
      await refreshHistory();
      
      toast({
        title: "Success!",
        description: "Webpage content extracted and cleaned successfully",
      });
    }
  };

  const handleScrapeError = (error: string) => {
    toast({
      title: "Scraping failed",
      description: error,
      variant: "destructive",
    });
  };

  const handleCopyText = async () => {
    if (scrapeResult) {
      try {
        await navigator.clipboard.writeText(scrapeResult);
        setIsCopied(true);
        toast({
          title: "Copied!",
          description: "Text copied to clipboard",
        });
        setTimeout(() => setIsCopied(false), 2000);
      } catch (error) {
        toast({
          title: "Copy failed",
          description: "Failed to copy text to clipboard",
          variant: "destructive",
        });
      }
    }
  };

  const handleRefresh = () => {
    setScrapeResult(null);
    setCurrentUrl(null);
  };

  const extractDomain = (url: string): string => {
    try {
      const urlObj = new URL(url);
      return urlObj.hostname;
    } catch {
      return url;
    }
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!chat) {
    return null;
  }

  return (
    <div className="flex-1 flex flex-col h-screen bg-background">
      <div className="border-b border-border p-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500/10 to-pink-500/10">
            <Globe className="w-5 h-5 text-purple-500" />
          </div>
          <div>
            <h1 className="text-lg font-semibold">Web Scraping Mode</h1>
            <p className="text-sm text-muted-foreground">
              Extract clean, readable text from any webpage
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {chatId && (
            <WebScrapeForm
              chatId={chatId}
              onScrapeSuccess={handleScrapeSuccess}
              onScrapeError={handleScrapeError}
            />
          )}

          {scrapeResult && (
            <Card className="p-6 space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <Sparkles className="w-5 h-5 text-primary flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold">Extracted Web Content</h3>
                    {currentUrl && (
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                        <img 
                          src={`https://www.google.com/s2/favicons?domain=${extractDomain(currentUrl)}&sz=32`}
                          alt=""
                          className="w-3 h-3 rounded"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                          }}
                        />
                        <span className="truncate">{extractDomain(currentUrl)}</span>
                        <a 
                          href={currentUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-primary transition-colors"
                        >
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={handleRefresh} className="gap-2">
                    <RefreshCw className="w-4 h-4" />
                    New
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleCopyText} className="gap-2">
                    {isCopied ? (
                      <>
                        <CheckCheck className="w-4 h-4" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        Copy
                      </>
                    )}
                  </Button>
                </div>
              </div>

              <div className={cn("p-4 rounded-lg bg-secondary/50 border border-border", "max-h-96 overflow-y-auto", "prose prose-sm dark:prose-invert max-w-none")}>
                <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">
                  {scrapeResult}
                </pre>
              </div>

              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span>Processed by AI  {scrapeResult.length} characters</span>
              </div>
            </Card>
          )}

          {!scrapeResult && chat.preview && (
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-3">
                <Globe className="w-4 h-4 text-muted-foreground" />
                <h3 className="text-sm font-medium text-muted-foreground">
                  Previous Scrape
                </h3>
              </div>
              <p className="text-sm text-muted-foreground italic">
                {chat.preview}
              </p>
            </Card>
          )}

          {!scrapeResult && !chat.preview && (
            <Card className="p-8 text-center border-dashed">
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                <Globe className="w-6 h-6 text-muted-foreground" />
              </div>
              <h3 className="font-semibold mb-2">No webpage scraped yet</h3>
              <p className="text-sm text-muted-foreground">
                Enter a URL above to extract readable content from any webpage
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default WebWorkspace;
