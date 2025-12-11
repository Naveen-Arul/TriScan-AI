import { ScanText, Plus, User, LogOut, History, ChevronLeft, ChevronRight, FileText, Globe, GitCompare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { useChatStore } from "@/store/chatStore";
import { NewChatModal } from "@/components/NewChatModal";
import { LogoutConfirmModal } from "@/components/LogoutConfirmModal";
import { LogoutConfirmModal } from "@/components/LogoutConfirmModal";

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
  const navigate = useNavigate();
  const { logout } = useAuth();
  
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
        <div className="space-y-1">
          {history.length === 0 && !collapsed && (
            <p className="text-xs text-muted-foreground px-2 py-4 text-center">
              No chats yet. Start a new chat to begin!
            </p>
          )}
          {history.map((chat) => {
            const ModeIcon = modeIcons[chat.mode];
            const isActive = currentChatId === chat.chatId;
            
            return (
              <button
                key={chat.chatId}
                onClick={() => handleSelectChat(chat.chatId, chat.mode)}
                className={cn(
                  "w-full flex items-start gap-2 px-3 py-2 rounded-lg text-sm transition-colors text-left",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                )}
              >
                <ModeIcon className={cn("w-4 h-4 mt-0.5 flex-shrink-0", modeColors[chat.mode])} />
                {!collapsed && (
                  <div className="flex-1 min-w-0">
                    <p className="truncate text-sm font-medium">
                      {chat.preview || `${chat.mode.toUpperCase()} Chat`}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(chat.createdAt)}
                    </p>
                  </div>
                )}
              </button>
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
    </aside>
  );
};

export default Sidebar;