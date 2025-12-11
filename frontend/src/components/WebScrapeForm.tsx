import { useState } from "react";
import { Globe, Link, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { webApi } from "@/api";

interface WebScrapeFormProps {
  chatId: string;
  onScrapeSuccess: (result: any) => void;
  onScrapeError: (error: string) => void;
}

export const WebScrapeForm = ({ chatId, onScrapeSuccess, onScrapeError }: WebScrapeFormProps) => {
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [urlError, setUrlError] = useState("");

  const validateUrl = (urlString: string): boolean => {
    setUrlError("");
    
    if (!urlString.trim()) {
      setUrlError("URL is required");
      return false;
    }

    if (!webApi.isValidUrl(urlString)) {
      setUrlError("Please enter a valid URL (e.g., https://example.com)");
      return false;
    }

    return true;
  };

  const handleScrape = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateUrl(url)) {
      return;
    }

    setIsLoading(true);
    try {
      const result = await webApi.scrape(chatId, url);
      onScrapeSuccess(result);
      // Don't clear URL - allow re-scraping
    } catch (error: any) {
      onScrapeError(error.message || 'Failed to scrape webpage');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value);
    if (urlError) {
      setUrlError("");
    }
  };

  const extractDomain = (urlString: string): string => {
    try {
      const urlObj = new URL(urlString);
      return urlObj.hostname;
    } catch {
      return "";
    }
  };

  const domain = url && webApi.isValidUrl(url) ? extractDomain(url) : "";

  return (
    <Card className="p-6 bg-gradient-to-br from-background via-background to-purple-500/5 border-2">
      <form onSubmit={handleScrape} className="space-y-4">
        {/* Header */}
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-500/20">
            <Globe className="w-5 h-5 text-purple-500" />
          </div>
          <div>
            <h3 className="font-semibold">Web Scraper</h3>
            <p className="text-xs text-muted-foreground">
              Extract readable content from any webpage
            </p>
          </div>
        </div>

        {/* URL Input */}
        <div className="space-y-2">
          <div className="relative">
            <Link className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            <Input
              type="text"
              placeholder="https://example.com/article"
              value={url}
              onChange={handleUrlChange}
              disabled={isLoading}
              className={cn(
                "pl-10 h-12 text-base",
                "transition-all duration-200",
                "focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500",
                urlError && "border-destructive focus:ring-destructive/20 focus:border-destructive"
              )}
            />
            {domain && !urlError && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                <img 
                  src={`https://www.google.com/s2/favicons?domain=${domain}&sz=32`}
                  alt={domain}
                  className="w-4 h-4 rounded"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
                <span className="text-xs text-muted-foreground font-medium">
                  {domain}
                </span>
              </div>
            )}
          </div>
          
          {urlError ? (
            <p className="text-xs text-destructive flex items-center gap-1">
              <span className="w-1 h-1 rounded-full bg-destructive"></span>
              {urlError}
            </p>
          ) : (
            <p className="text-xs text-muted-foreground">
              Enter any webpage URL to extract its content
            </p>
          )}
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={isLoading || !url.trim()}
          className={cn(
            "w-full h-11 text-base font-semibold",
            "bg-gradient-to-r from-purple-500 to-pink-500",
            "hover:from-purple-600 hover:to-pink-600",
            "transition-all duration-200",
            "shadow-lg shadow-purple-500/25 hover:shadow-xl hover:shadow-purple-500/30"
          )}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Extracting Content...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 mr-2" />
              Scrape & Clean with AI
            </>
          )}
        </Button>
      </form>
    </Card>
  );
};
