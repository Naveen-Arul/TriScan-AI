import { Clock, Sparkles, FileText, Globe, GitCompare } from "lucide-react";
import { Card } from "@/components/ui/card";

interface TimelineEvent {
  type: string;
  message: string;
  timestamp: string;
}

interface ChatTimelineProps {
  timeline?: TimelineEvent[];
}

export function ChatTimeline({ timeline }: ChatTimelineProps) {
  if (!timeline || timeline.length === 0) {
    return null;
  }

  const getIcon = (type: string) => {
    switch (type) {
      case "ocr_upload":
        return <FileText className="w-4 h-4 text-blue-500" />;
      case "web_scrape":
        return <Globe className="w-4 h-4 text-purple-500" />;
      case "compare_upload":
        return <GitCompare className="w-4 h-4 text-orange-500" />;
      case "ai_generated":
        return <Sparkles className="w-4 h-4 text-yellow-500" />;
      default:
        return <Clock className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Card className="mt-6 p-6 space-y-4">
      <div className="flex items-center gap-2">
        <Clock className="w-4 h-4 text-muted-foreground" />
        <h3 className="text-sm font-semibold text-muted-foreground">Activity Timeline</h3>
      </div>

      <div className="space-y-3">
        {timeline.map((item, index) => (
          <div key={index} className="flex items-start gap-3 group">
            <div className="mt-0.5">{getIcon(item.type)}</div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-foreground">{item.message}</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {formatTime(item.timestamp)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
