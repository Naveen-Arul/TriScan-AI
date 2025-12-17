import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "@/components/dashboard/Sidebar";
import WelcomeScreen from "@/components/dashboard/WelcomeScreen";
import { useChatStore } from "@/store/chatStore";
import { chatApi } from "@/api";
import { useToast } from "@/hooks/use-toast";

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const refreshHistory = useChatStore(state => state.refreshHistory);

  useEffect(() => {
    refreshHistory();
  }, [refreshHistory]);

  const handleSelectMode = async (mode: "ocr" | "compare" | "scrape") => {
    try {
      // Map mode names to backend format
      const modeMap = {
        ocr: "ocr",
        compare: "compare",
        scrape: "web"
      };
      
      const backendMode = modeMap[mode];
      const response = await chatApi.createChat(backendMode);
      
      if (response.success && response.chat) {
        // Refresh chat history first
        await refreshHistory();
        
        // Then navigate to the workspace
        navigate(`/chat/${response.chat.chatId}/${backendMode}`);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create chat",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex items-center justify-center">
        <WelcomeScreen onSelectMode={handleSelectMode} />
      </div>
    </div>
  );
};

export default Dashboard;
