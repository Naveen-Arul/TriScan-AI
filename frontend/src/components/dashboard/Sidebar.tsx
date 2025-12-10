import { ScanText, Plus, User, LogOut, History, ChevronLeft, ChevronRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";

interface ChatSession {
  id: string;
  title: string;
  mode: "ocr" | "compare" | "scrape";
  timestamp: string;
}

interface SidebarProps {
  sessions: ChatSession[];
  activeSession: string | null;
  onSelectSession: (id: string) => void;
  onNewChat: () => void;
  onDeleteSession?: (id: string) => void;
}

const modeIcons = {
  ocr: "📄",
  compare: "🔄",
  scrape: "🌐",
};

const Sidebar = ({ sessions, activeSession, onSelectSession, onNewChat, onDeleteSession }: SidebarProps) => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/");
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
          onClick={onNewChat}
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
          {sessions.map((session) => (
            <div 
              key={session.id} 
              className="flex items-center group"
            >
              <button
                onClick={() => onSelectSession(session.id)}
                className={cn(
                  "flex-1 flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors text-left",
                  activeSession === session.id
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                )}
              >
                <span className="text-base">{modeIcons[session.mode]}</span>
                {!collapsed && (
                  <div className="flex-1 truncate">
                    <p className="truncate">{session.title}</p>
                    <p className="text-xs text-muted-foreground">{session.timestamp}</p>
                  </div>
                )}
              </button>
              {!collapsed && onDeleteSession && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="opacity-0 group-hover:opacity-100 h-6 w-6 ml-1 text-muted-foreground hover:text-foreground hover:bg-sidebar-accent"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteSession(session.id);
                  }}
                >
                  <X className="w-3 h-3" />
                </Button>
              )}
            </div>
          ))}
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
    </aside>
  );
};

export default Sidebar;