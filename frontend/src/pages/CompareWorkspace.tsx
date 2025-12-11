import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useChatStore } from "@/store/chatStore";
import { GitCompare, Loader2, Copy, CheckCheck, Sparkles, RefreshCw, FileText, FileDiff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { CompareFileUploader } from "@/components/CompareFileUploader";
import { cn } from "@/lib/utils";

interface CompareResult {
  differences: string[];
  common: string[];
  unique: Record<string, string[]>;
  similarity: number;
  summary: string;
  fileNames?: string[];
}

const CompareWorkspace = () => {
  const { chatId } = useParams<{ chatId: string }>();
  const navigate = useNavigate();
  const { getChatById, setCurrentChatId, refreshHistory } = useChatStore();
  const [chat, setChat] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [compareResult, setCompareResult] = useState<CompareResult | null>(null);
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

    // Check if chat mode matches workspace
    if (chatData.mode !== 'compare') {
      navigate(`/chat/${chatId}/${chatData.mode}`);
      return;
    }

    setChat(chatData);
    setCurrentChatId(chatId);
    setIsLoading(false);
  }, [chatId, getChatById, navigate, setCurrentChatId]);

  const handleCompareSuccess = async (result: any) => {
    if (result.success && result.analysis) {
      setCompareResult({
        differences: result.analysis.differences || [],
        common: result.analysis.common || [],
        unique: result.analysis.unique || {},
        similarity: result.analysis.similarity || 0,
        summary: result.summary || '',
        fileNames: result.analysis.fileNames || []
      });
      
      // Refresh chat history to update preview in sidebar
      await refreshHistory();
      
      toast({
        title: "Success!",
        description: "Files compared successfully",
      });
    }
  };

  const handleCompareError = (error: string) => {
    toast({
      title: "Comparison failed",
      description: error,
      variant: "destructive",
    });
  };

  const handleCopySummary = async () => {
    if (compareResult?.summary) {
      try {
        await navigator.clipboard.writeText(compareResult.summary);
        setIsCopied(true);
        toast({
          title: "Copied!",
          description: "Summary copied to clipboard",
        });
        setTimeout(() => setIsCopied(false), 2000);
      } catch (error) {
        toast({
          title: "Copy failed",
          description: "Failed to copy summary to clipboard",
          variant: "destructive",
        });
      }
    }
  };

  const handleRetry = () => {
    setCompareResult(null);
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
      {/* Header */}
      <div className="border-b border-border p-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gradient-to-br from-orange-500/10 to-red-500/10">
            <GitCompare className="w-5 h-5 text-orange-500" />
          </div>
          <div>
            <h1 className="text-lg font-semibold">Compare Mode</h1>
            <p className="text-sm text-muted-foreground">
              Compare multiple files and analyze differences
            </p>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* File Uploader */}
          {chatId && !compareResult && (
            <CompareFileUploader
              chatId={chatId}
              onCompareSuccess={handleCompareSuccess}
              onCompareError={handleCompareError}
            />
          )}

          {/* Comparison Results */}
          {compareResult && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {/* Header with Retry Button */}
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <FileDiff className="w-6 h-6 text-orange-500" />
                  Comparison Results
                </h2>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRetry}
                  className="gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  New Comparison
                </Button>
              </div>

              {/* Similarity Score */}
              <Card className="p-6 bg-gradient-to-br from-orange-500/5 to-red-500/5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold flex items-center gap-2">
                    <GitCompare className="w-5 h-5 text-orange-500" />
                    Similarity Score
                  </h3>
                  <span className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                    {Math.round(compareResult.similarity)}%
                  </span>
                </div>
                <Progress value={compareResult.similarity} className="h-3" />
                <p className="text-xs text-muted-foreground mt-2">
                  {compareResult.similarity >= 80 ? "Files are very similar" : 
                   compareResult.similarity >= 50 ? "Files have moderate similarity" : 
                   "Files are quite different"}
                </p>
              </Card>

              {/* Results Grid */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* Differences Card */}
                <Card className="p-6 space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center">
                      <FileDiff className="w-5 h-5 text-red-500" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Differences</h3>
                      <p className="text-xs text-muted-foreground">
                        {compareResult.differences.length} found
                      </p>
                    </div>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {compareResult.differences.length > 0 ? (
                      <ul className="space-y-2 text-sm">
                        {compareResult.differences.map((diff, index) => (
                          <li key={index} className="flex gap-2">
                            <span className="text-red-500 flex-shrink-0">•</span>
                            <span>{diff}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-muted-foreground italic">
                        No differences found.
                      </p>
                    )}
                  </div>
                </Card>

                {/* Common Content Card */}
                <Card className="p-6 space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                      <FileText className="w-5 h-5 text-green-500" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Common Content</h3>
                      <p className="text-xs text-muted-foreground">
                        {compareResult.common.length} items
                      </p>
                    </div>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {compareResult.common.length > 0 ? (
                      <ul className="space-y-2 text-sm">
                        {compareResult.common.map((item, index) => (
                          <li key={index} className="flex gap-2">
                            <span className="text-green-500 flex-shrink-0">✓</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-muted-foreground italic">
                        No common content found.
                      </p>
                    )}
                  </div>
                </Card>
              </div>

              {/* Unique Content Per File */}
              {Object.keys(compareResult.unique).length > 0 && (
                <Card className="p-6 space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                      <FileText className="w-5 h-5 text-blue-500" />
                    </div>
                    <h3 className="font-semibold">Unique Content Per File</h3>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    {Object.entries(compareResult.unique).map(([fileName, content]) => (
                      <div key={fileName} className="p-4 rounded-lg bg-secondary/50">
                        <h4 className="font-medium text-sm mb-3 truncate" title={fileName}>
                          {fileName}
                        </h4>
                        <div className="max-h-48 overflow-y-auto">
                          {Array.isArray(content) && content.length > 0 ? (
                            <ul className="space-y-1 text-sm">
                              {content.map((item, index) => (
                                <li key={index} className="flex gap-2">
                                  <span className="text-blue-500 flex-shrink-0">-</span>
                                  <span className="text-muted-foreground">{item}</span>
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <p className="text-xs text-muted-foreground italic">
                              No unique content
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              {/* AI Summary Card */}
              {compareResult.summary && (
                <Card className="p-6 space-y-4 bg-gradient-to-br from-purple-500/5 to-pink-500/5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-purple-500" />
                      <h3 className="font-semibold">AI Summary</h3>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCopySummary}
                      className="gap-2"
                    >
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

                  <div className={cn(
                    "p-4 rounded-lg bg-secondary/50 border border-border",
                    "max-h-64 overflow-y-auto",
                    "prose prose-sm dark:prose-invert max-w-none"
                  )}>
                    <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">
                      {compareResult.summary}
                    </pre>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
                    <span>Generated by AI</span>
                  </div>
                </Card>
              )}
            </div>
          )}

          {/* Previous Preview */}
          {!compareResult && chat?.preview && (
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-3">
                <GitCompare className="w-4 h-4 text-muted-foreground" />
                <h3 className="text-sm font-medium text-muted-foreground">
                  Previous Comparison
                </h3>
              </div>
              <p className="text-sm text-muted-foreground italic">
                {chat.preview}
              </p>
            </Card>
          )}

          {/* Empty State Helper */}
          {!compareResult && !chat?.preview && (
            <Card className="p-8 text-center border-dashed">
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                <GitCompare className="w-6 h-6 text-muted-foreground" />
              </div>
              <h3 className="font-semibold mb-2">No comparison yet</h3>
              <p className="text-sm text-muted-foreground">
                Upload at least two files above to compare and analyze differences
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default CompareWorkspace;
