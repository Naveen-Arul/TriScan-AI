import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Sidebar from "@/components/dashboard/Sidebar";
import ModeSelector from "@/components/dashboard/ModeSelector";
import WelcomeScreen from "@/components/dashboard/WelcomeScreen";
import OCRWorkspace from "@/components/dashboard/OCRWorkspace";
import CompareWorkspace from "@/components/dashboard/CompareWorkspace";
import ScrapeWorkspace from "@/components/dashboard/ScrapeWorkspace";

type Mode = "ocr" | "compare" | "scrape";

interface ChatSession {
  id: string;
  title: string;
  mode: Mode;
  timestamp: string;
}

const Dashboard = () => {
  const [showModeSelector, setShowModeSelector] = useState(false);
  const [activeSession, setActiveSession] = useState<string | null>(null);
  const [currentMode, setCurrentMode] = useState<Mode | null>(null);
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const navigate = useNavigate();

  // Load sessions from localStorage on component mount
  useEffect(() => {
    const savedSessions = localStorage.getItem("chatSessions");
    if (savedSessions) {
      try {
        setSessions(JSON.parse(savedSessions));
      } catch (e) {
        console.error("Failed to parse saved sessions", e);
        setSessions([]);
      }
    }
  }, []);

  // Save sessions to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("chatSessions", JSON.stringify(sessions));
  }, [sessions]);

  const handleNewChat = () => {
    setShowModeSelector(true);
  };

  const handleSelectMode = (mode: Mode) => {
    const newSession: ChatSession = {
      id: Date.now().toString(),
      title: `New ${mode.toUpperCase()} Session`,
      mode,
      timestamp: new Date().toLocaleString(),
    };
    setSessions(prev => [newSession, ...prev]);
    setActiveSession(newSession.id);
    setCurrentMode(mode);
    setShowModeSelector(false);
  };

  const handleSelectSession = (id: string) => {
    const session = sessions.find(s => s.id === id);
    if (session) {
      setActiveSession(id);
      setCurrentMode(session.mode);
    }
  };

  const handleDeleteSession = (id: string) => {
    setSessions(prev => prev.filter(session => session.id !== id));
    if (activeSession === id) {
      setActiveSession(null);
      setCurrentMode(null);
    }
  };

  const handleWelcomeSelect = (mode: Mode) => {
    handleSelectMode(mode);
  };

  const handleReturnHome = () => {
    navigate("/");
  };

  const renderWorkspace = () => {
    if (!currentMode) {
      return <WelcomeScreen onSelectMode={handleWelcomeSelect} />;
    }

    switch (currentMode) {
      case "ocr":
        return <OCRWorkspace />;
      case "compare":
        return <CompareWorkspace />;
      case "scrape":
        return <ScrapeWorkspace />;
      default:
        return <WelcomeScreen onSelectMode={handleWelcomeSelect} />;
    }
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar
        sessions={sessions}
        activeSession={activeSession}
        onSelectSession={handleSelectSession}
        onNewChat={handleNewChat}
        onDeleteSession={handleDeleteSession}
      />
      
      <main className="flex-1 overflow-y-auto flex flex-col">
        {/* Header with Return to Home button */}
        <header className="border-b border-border p-4 flex justify-between items-center">
          <h1 className="text-xl font-semibold">Dashboard</h1>
          <Button 
            variant="outline" 
            onClick={handleReturnHome}
            className="flex items-center gap-2"
          >
            <Home className="w-4 h-4" />
            Return to Home Page
          </Button>
        </header>
        
        <div className="flex-1 overflow-y-auto">
          {renderWorkspace()}
        </div>
      </main>

      <ModeSelector
        isOpen={showModeSelector}
        onClose={() => setShowModeSelector(false)}
        onSelectMode={handleSelectMode}
      />
    </div>
  );
};

export default Dashboard;