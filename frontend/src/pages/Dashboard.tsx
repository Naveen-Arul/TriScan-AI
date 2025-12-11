import { useEffect } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import WelcomeScreen from "@/components/dashboard/WelcomeScreen";
import { useChatStore } from "@/store/chatStore";

const Dashboard = () => {
  const refreshHistory = useChatStore(state => state.refreshHistory);

  useEffect(() => {
    refreshHistory();
  }, [refreshHistory]);

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex items-center justify-center">
        <WelcomeScreen />
      </div>
    </div>
  );
};

export default Dashboard;
