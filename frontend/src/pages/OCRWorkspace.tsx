import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useChatStore } from "@/store/chatStore";
import { FileText, Loader2, Copy, CheckCheck, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { OCRFileUploader } from "@/components/OCRFileUploader";
import { cn } from "@/lib/utils";

const OCRWorkspace = () => {
  const { chatId } = useParams<{ chatId: string }>();
  const navigate = useNavigate();
  const { getChatById, setCurrentChatId, refreshHistory } = useChatStore();
  const [chat, setChat] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [ocrResult, setOcrResult] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (!chatId) {
      navigate('/dashboard');
      return;
    }

    const chatData = getChatById(chatId);
    
    if (!chatData) {
      // Chat not found, redirect to dashboard
      navigate('/dashboard');
      return;
    }

    // Check if chat mode matches workspace
    if (chatData.mode !== 'ocr') {
      // Redirect to correct workspace
      navigate(`/chat/${chatId}/${chatData.mode}`);
      return;
    }

    setChat(chatData);
    setCurrentChatId(chatId);
    setIsLoading(false);
  }, [chatId, getChatById, navigate, setCurrentChatId]);

  const handleUploadSuccess = async (result: any) => {
    if (result.success && result.clean_text) {
      setOcrResult(result.clean_text);
      
      // Refresh chat history to update preview in sidebar
      await refreshHistory();
      
      toast({
        title: "Success!",
        description: "Text extracted and cleaned successfully",
      });
    }
  };

  const handleUploadError = (error: string) => {
    toast({
      title: "Upload failed",
      description: error,
      variant: "destructive",
    });
  };

  const handleCopyText = async () => {
    if (ocrResult) {
      try {
        await navigator.clipboard.writeText(ocrResult);
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
          <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500/10 to-cyan-500/10">
            <FileText className="w-5 h-5 text-blue-500" />
          </div>
          <div>
            <h1 className="text-lg font-semibold">OCR Mode</h1>
            <p className="text-sm text-muted-foreground">
              Extract text from images, PDFs, and documents
            </p>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* File Uploader */}
          {chatId && (
            <OCRFileUploader
              chatId={chatId}
              onUploadSuccess={handleUploadSuccess}
              onUploadError={handleUploadError}
            />
          )}

          {/* OCR Results */}
          {ocrResult && (
            <Card className="p-6 space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  <h3 className="font-semibold">Extracted Text</h3>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopyText}
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
                "max-h-96 overflow-y-auto",
                "prose prose-sm dark:prose-invert max-w-none"
              )}>
                <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">
                  {ocrResult}
                </pre>
              </div>

              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span>Processed by AI • {ocrResult.length} characters</span>
              </div>
            </Card>
          )}

          {/* Previous Preview */}
          {!ocrResult && chat.preview && (
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-3">
                <FileText className="w-4 h-4 text-muted-foreground" />
                <h3 className="text-sm font-medium text-muted-foreground">
                  Previous Extraction
                </h3>
              </div>
              <p className="text-sm text-muted-foreground italic">
                {chat.preview}
              </p>
            </Card>
          )}

          {/* Empty State Helper */}
          {!ocrResult && !chat.preview && (
            <Card className="p-8 text-center border-dashed">
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                <FileText className="w-6 h-6 text-muted-foreground" />
              </div>
              <h3 className="font-semibold mb-2">No files uploaded yet</h3>
              <p className="text-sm text-muted-foreground">
                Upload files above to extract text using AI-powered OCR
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default OCRWorkspace;
