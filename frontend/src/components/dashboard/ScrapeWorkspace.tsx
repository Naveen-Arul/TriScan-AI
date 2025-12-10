import { Globe, Loader2, Copy, Check, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const ScrapeWorkspace = () => {
  const [url, setUrl] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const processUrl = async () => {
    if (!url) {
      toast({ title: "Please enter a URL", variant: "destructive" });
      return;
    }

    setIsProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setResult(`# Extracted Content from ${url}

## Main Heading
This is the extracted main content from the webpage. All advertisements, navigation elements, and irrelevant sections have been removed.

## Key Information
Lorem ipsum dolor sit amet, consectetur adipiscing elit. The AI has processed the page to extract meaningful text while maintaining the document structure.

### Subsection 1
- Important point extracted from the webpage
- Another relevant piece of information
- Data points preserved in clean format

### Subsection 2
The content has been cleaned and formatted for easy reading. Special characters and formatting have been preserved where relevant.

## Metadata
- Title: Example Page Title
- Author: Page Author
- Published: December 2024
- Word Count: ~500 words

---
*Content extracted by TriScan AI Web Scraper*`);
    
    setIsProcessing(false);
  };

  const copyToClipboard = async () => {
    if (result) {
      await navigator.clipboard.writeText(result);
      setCopied(true);
      toast({ title: "Copied to clipboard!" });
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="h-full flex flex-col p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1">Web Scraping</h1>
        <p className="text-muted-foreground">Extract clean content from any website</p>
      </div>

      <div className="flex-1 flex flex-col gap-6">
        {/* URL Input */}
        <div className="glass-card p-6">
          <div className="flex items-center gap-2 mb-4">
            <Globe className="w-5 h-5 text-primary" />
            <span className="font-medium">Enter Website URL</span>
          </div>
          <div className="flex gap-3">
            <Input
              type="url"
              placeholder="https://example.com/article"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="flex-1 bg-secondary/50 border-border"
            />
            <Button
              onClick={processUrl}
              disabled={isProcessing}
              variant="hero"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Extracting...
                </>
              ) : (
                <>
                  <ExternalLink className="w-4 h-4" />
                  Extract
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Result */}
        {result && (
          <div className="glass-card p-6 flex-1 animate-fade-in">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium">Extracted Content</h3>
              <Button variant="ghost" size="sm" onClick={copyToClipboard}>
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </Button>
            </div>
            <div className="bg-secondary/30 rounded-lg p-4 h-[calc(100%-3rem)] overflow-y-auto">
              <div className="prose prose-invert prose-sm max-w-none">
                <pre className="whitespace-pre-wrap text-sm text-foreground/90 font-sans">
                  {result}
                </pre>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ScrapeWorkspace;
