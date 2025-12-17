import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { useChatStore } from "@/store/chatStore";
import { Globe, Loader2, Copy, CheckCheck, Sparkles, Download, FileDown, ArrowLeft, Send, User, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { WebScrapeForm } from "@/components/WebScrapeForm";
import { ChatTimeline } from "@/components/ChatTimeline";
import { cn } from "@/lib/utils";
import { downloadAsTxt, downloadAsPdf, formatFilename } from "@/lib/downloadUtils";
import { webApi } from "@/api";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
}

const WebWorkspace = () => {
  const { chatId } = useParams<{ chatId: string }>();
  const navigate = useNavigate();
  const { getChatById, setCurrentChatId, refreshHistory } = useChatStore();
  const [chat, setChat] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [question, setQuestion] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast} = useToast();

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
    loadMessages();
    setIsLoading(false);
  }, [chatId, getChatById, navigate, setCurrentChatId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadMessages = async () => {
    if (!chatId) return;
    
    try {
      const response = await webApi.getMessages(chatId);
      if (response.success && response.messages) {
        setMessages(response.messages);
      }
    } catch (error) {
      console.error('Failed to load messages:', error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleScrapeSuccess = async (result: any) => {
    if (result.success && result.messages) {
      setMessages(result.messages);
      
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

  const handleSendQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!question.trim() || !chatId || isSending) return;

    const userQuestion = question.trim();
    setQuestion('');
    setIsSending(true);

    const userMessage: Message = {
      role: 'user',
      content: userQuestion,
      timestamp: new Date().toISOString()
    };
    setMessages(prev => [...prev, userMessage]);

    try {
      const response = await webApi.askQuestion(chatId, userQuestion);
      
      if (response.success && response.messages) {
        setMessages(response.messages);
      }
      
      await refreshHistory();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to send question",
        variant: "destructive",
      });
      setMessages(prev => prev.filter(m => m !== userMessage));
    } finally {
      setIsSending(false);
    }
  };

  const handleCopyText = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
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
  };

  const handleDownloadTxt = () => {
    const firstMessage = messages.find(m => m.role === 'assistant');
    if (firstMessage) {
      try {
        downloadAsTxt(firstMessage.content, formatFilename('web-scrape', 'txt'));
        toast({
          title: "Downloaded!",
          description: "Text file saved successfully",
        });
      } catch (error) {
        toast({
          title: "Download failed",
          description: "Failed to download file",
          variant: "destructive",
        });
      }
    }
  };

  const handleDownloadPdf = async () => {
    const firstMessage = messages.find(m => m.role === 'assistant');
    if (firstMessage) {
      try {
        await downloadAsPdf(firstMessage.content, formatFilename('web-scrape', 'pdf'));
        toast({
          title: "Downloaded!",
          description: "PDF file saved successfully",
        });
      } catch (error) {
        toast({
          title: "Download failed",
          description: "Failed to generate PDF",
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
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/dashboard')}
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
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
          {messages.length > 0 && (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownloadTxt}
                className="gap-2"
              >
                <FileDown className="w-4 h-4" />
                TXT
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownloadPdf}
                className="gap-2"
              >
                <Download className="w-4 h-4" />
                PDF
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {messages.length === 0 ? (
          <div className="flex-1 overflow-y-auto p-6">
            <div className="max-w-4xl mx-auto space-y-6">
              {chatId && (
                <WebScrapeForm
                  chatId={chatId}
                  onScrapeSuccess={handleScrapeSuccess}
                  onScrapeError={handleScrapeError}
                />
              )}
              <Card className="p-8 text-center border-dashed">
                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                  <Globe className="w-6 h-6 text-muted-foreground" />
                </div>
                <h3 className="font-semibold mb-2">No content scraped yet</h3>
                <p className="text-sm text-muted-foreground">
                  Enter a URL above to extract webpage content
                </p>
              </Card>
            </div>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto p-6">
              <div className="max-w-4xl mx-auto space-y-4">
                {messages.map((message, index) => (
                  <div key={index}>
                    <div
                      className={cn(
                        "flex gap-3 animate-in fade-in slide-in-from-bottom-2",
                        message.role === 'user' ? 'justify-end' : 'justify-start'
                      )}
                    >
                      {message.role === 'assistant' && (
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                          <Bot className="w-5 h-5 text-white" />
                        </div>
                      )}
                      <div
                        className={cn(
                          "max-w-[80%] rounded-2xl px-4 py-3",
                          message.role === 'user'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-secondary border border-border'
                        )}
                      >
                        {index === 1 && message.role === 'assistant' ? (
                          <div className="space-y-3">
                            <div className="flex items-center gap-2 mb-2">
                              <Sparkles className="w-4 h-4" />
                              <span className="text-xs font-semibold">Scraped Content</span>
                            </div>
                            <div className="max-h-96 overflow-y-auto">
                              <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">
                                {message.content}
                              </pre>
                            </div>
                            <div className="flex items-center justify-between pt-2 border-t border-border/50">
                              <span className="text-xs text-muted-foreground">
                                {message.content.length} characters
                              </span>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleCopyText(message.content)}
                                className="gap-2 h-7"
                              >
                                {isCopied ? (
                                  <>
                                    <CheckCheck className="w-3 h-3" />
                                    <span className="text-xs">Copied</span>
                                  </>
                                ) : (
                                  <>
                                    <Copy className="w-3 h-3" />
                                    <span className="text-xs">Copy</span>
                                  </>
                                )}
                              </Button>
                            </div>
                          </div>
                        ) : message.role === 'assistant' ? (
                          <div className="space-y-2">
                            <div className="prose prose-sm prose-invert max-w-none">
                              <ReactMarkdown
                                remarkPlugins={[remarkGfm]}
                                rehypePlugins={[rehypeHighlight]}
                                components={{
                                  code: ({ node, inline, className, children, ...props }: any) => {
                                    return inline ? (
                                      <code className="px-1.5 py-0.5 rounded bg-muted text-primary font-mono text-xs" {...props}>
                                        {children}
                                      </code>
                                    ) : (
                                      <code className={cn("block p-3 rounded-lg bg-slate-900 overflow-x-auto", className)} {...props}>
                                        {children}
                                      </code>
                                    );
                                  },
                                }}
                              >
                                {message.content}
                              </ReactMarkdown>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleCopyText(message.content)}
                              className="gap-1 h-6 text-xs opacity-70 hover:opacity-100"
                            >
                              {isCopied ? (
                                <>
                                  <CheckCheck className="w-3 h-3" />
                                  Copied
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3 h-3" />
                                  Copy
                                </>
                              )}
                            </Button>
                          </div>
                        ) : (
                          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                        )}
                      </div>
                      {message.role === 'user' && (
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center flex-shrink-0">
                          <User className="w-5 h-5 text-white" />
                        </div>
                      )}
                    </div>
                    
                    {/* Show timeline after scraped content (index 1 - second message) */}
                    {index === 1 && chat?.timeline && (
                      <div className="mt-4">
                        <ChatTimeline timeline={chat.timeline} />
                      </div>
                    )}
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </div>

            <div className="border-t border-border p-4">
              <form onSubmit={handleSendQuestion} className="max-w-4xl mx-auto">
                <div className="flex gap-2">
                  <Input
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder="Ask questions about the scraped content..."
                    disabled={isSending}
                    className="flex-1"
                  />
                  <Button type="submit" disabled={isSending || !question.trim()} className="gap-2">
                    {isSending ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                    Send
                  </Button>
                </div>
              </form>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default WebWorkspace;
