import { ScanText, Plus, User, LogOut, History, ChevronLeft, ChevronRight, FileText, Globe, GitCompare, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { useChatStore } from "@/store/chatStore";
import { NewChatModal } from "@/components/NewChatModal";
import { LogoutConfirmModal } from "@/components/LogoutConfirmModal";
import { chatApi } from "@/api";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const modeIcons = {
  ocr: FileText,
  web: Globe,
  compare: GitCompare,
};

const modeColors = {
  ocr: "text-blue-500",
  web: "text-purple-500",
  compare: "text-orange-500",
};

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [deleteChatId, setDeleteChatId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { toast } = useToast();
  
  const { history, currentChatId, refreshHistory, setCurrentChatId } = useChatStore();

  // Load chat history on mount
  useEffect(() => {
    refreshHistory();
  }, [refreshHistory]);

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    logout();
    navigate("/");
  };

  const handleSelectChat = (chatId: string, mode: string) => {
    setCurrentChatId(chatId);
    navigate(`/chat/${chatId}/${mode}`);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  const handleDeleteChat = async () => {
    if (!deleteChatId) return;

    setIsDeleting(true);
    try {
      await chatApi.deleteChat(deleteChatId);
      
      toast({
        title: "Chat deleted",
        description: "Chat has been successfully removed",
      });

      // If deleted chat was active, navigate to dashboard
      if (currentChatId === deleteChatId) {
        setCurrentChatId(null);
        navigate('/dashboard');
      }

      // Refresh history
      await refreshHistory();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete chat",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
      setDeleteChatId(null);
    }
  };

  // Group chats by mode and sort by updatedAt (most recent first)
  const groupedChats = {
    ocr: history.filter(c => c.mode === 'ocr').sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()),
    web: history.filter(c => c.mode === 'web').sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()),
    compare: history.filter(c => c.mode === 'compare').sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()),
  };

  const modeLabels = {
    ocr: 'OCR Chats',
    web: 'Web Scraping',
    compare: 'Comparisons',
  };

  return (
    <aside
      className={cn(
        "h-screen bg-sidebar border-r border-sidebar-border flex flex-col transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Header */}
      <div className="p-4 border-b border-sidebar-border flex items-center justify-between">
        {!collapsed && (
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
              <ScanText className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-bold text-sidebar-foreground">
              <span className="gradient-text">TriScan</span>
            </span>
          </Link>
        )}
        <Button
          variant="ghost"
          size="icon"
          className={cn("text-sidebar-foreground hover:bg-sidebar-accent", collapsed && "mx-auto")}
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </Button>
      </div>

      {/* New Chat Button */}
      <div className="p-3">
        <Button
          onClick={() => setShowNewChatModal(true)}
          className={cn(
            "w-full justify-start gap-2"
          )}
          variant="default"
        >
          <Plus className="w-4 h-4" />
          {!collapsed && "New Chat"}
        </Button>
      </div>

      {/* History */}
      <div className="flex-1 overflow-y-auto px-3">
        {!collapsed && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2 px-2">
            <History className="w-3 h-3" />
            History
          </div>
        )}
        <div className="space-y-4">
          {history.length === 0 && !collapsed && (
            <p className="text-xs text-muted-foreground px-2 py-4 text-center">
              No chats yet. Start a new chat to begin!
            </p>
          )}
          {(['ocr', 'web', 'compare'] as const).map((mode) => {
            const chats = groupedChats[mode];
            if (chats.length === 0) return null;

            return (
              <div key={mode}>
                {!collapsed && (
                  <div className="text-xs font-semibold text-muted-foreground mb-2 px-2">
                    {modeLabels[mode]}
                  </div>
                )}
                <div className="space-y-1">
                  {chats.map((chat) => {
                    const ModeIcon = modeIcons[chat.mode];
                    const isActive = currentChatId === chat.chatId;
                    
                    return (
                      <div
                        key={chat.chatId}
                        className={cn(
                          "group relative flex items-start gap-2 px-3 py-2 rounded-lg text-sm transition-colors",
                          isActive
                            ? "bg-sidebar-accent text-sidebar-accent-foreground"
                            : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                        )}
                      >
                        <button
                          onClick={() => handleSelectChat(chat.chatId, chat.mode)}
                          className="flex items-start gap-2 flex-1 min-w-0 text-left"
                          title={chat.title || chat.preview || `${chat.mode.toUpperCase()} Chat`}
                        >
                          <ModeIcon className={cn("w-4 h-4 mt-0.5 flex-shrink-0", modeColors[chat.mode])} />
                          {!collapsed && (
                            <div className="flex-1 min-w-0">
                              <p className="truncate text-sm font-medium">
                                {chat.title || chat.preview || `${chat.mode.toUpperCase()} Chat`}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {formatDate(chat.updatedAt)}
                              </p>
                            </div>
                          )}
                        </button>
                        {!collapsed && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setDeleteChatId(chat.chatId);
                            }}
                            className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-destructive/10 rounded"
                            title="Delete chat"
                          >
                            <Trash2 className="w-3 h-3 text-destructive" />
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-sidebar-border space-y-1">
        <Link to="/profile">
          <Button
            variant="ghost"
            className={cn(
              "w-full justify-start gap-2 text-sidebar-foreground hover:bg-sidebar-accent"
            )}
          >
            <User className="w-4 h-4" />
            {!collapsed && "Profile"}
          </Button>
        </Link>
        <Button
          variant="ghost"
          onClick={handleLogout}
          className={cn(
            "w-full justify-start gap-2 text-sidebar-foreground hover:bg-sidebar-accent"
          )}
        >
          <LogOut className="w-4 h-4" />
          {!collapsed && "Logout"}
        </Button>
      </div>

      {/* New Chat Modal */}
      <NewChatModal 
        open={showNewChatModal} 
        onOpenChange={setShowNewChatModal} 
      />

      {/* Logout Confirmation Modal */}
      <LogoutConfirmModal
        open={showLogoutModal}
        onOpenChange={setShowLogoutModal}
        onConfirm={confirmLogout}
      />

      {/* Delete Chat Confirmation */}
      <AlertDialog open={!!deleteChatId} onOpenChange={(open) => !open && setDeleteChatId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Chat?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the chat and all its data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteChat}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </aside>
  );
};

export default Sidebar;