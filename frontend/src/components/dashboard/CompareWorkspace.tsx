import { Upload, FileText, Loader2, Plus, Minus, Equal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useCallback } from "react";
import { cn } from "@/lib/utils";

const CompareWorkspace = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<{
    differences: string[];
    common: string[];
    missing: string[];
    summary: string;
  } | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    setFiles(prev => [...prev, ...droppedFiles].slice(0, 5));
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(prev => [...prev, ...Array.from(e.target.files!)].slice(0, 5));
    }
  };

  const processFiles = async () => {
    setIsProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 2500));
    setResult({
      differences: [
        "Section 2.3: Different date format used",
        "Paragraph 4: Additional clause in File B",
        "Footer: Contact information varies",
      ],
      common: [
        "Title and header structure identical",
        "Core terms and conditions match",
        "Formatting and layout consistent",
        "Legal disclaimers are the same",
      ],
      missing: [
        "File A missing: Appendix B reference",
        "File B missing: Revision history",
      ],
      summary: "Files are 87% similar with minor differences in formatting and one additional clause.",
    });
    setIsProcessing(false);
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="h-full flex flex-col p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1">Smart File Comparison</h1>
        <p className="text-muted-foreground">Compare multiple documents side by side</p>
      </div>

      <div className="flex-1 flex flex-col gap-6 overflow-y-auto">
        {/* Upload Area */}
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={cn(
            "border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300",
            isDragging
              ? "border-primary bg-primary/10"
              : "border-border hover:border-primary/50",
          )}
        >
          <input
            type="file"
            id="compare-upload"
            multiple
            accept="image/*,.pdf,.doc,.docx,.txt"
            onChange={handleFileChange}
            className="hidden"
          />
          <label htmlFor="compare-upload" className="cursor-pointer">
            <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-lg font-medium mb-1">Upload 2+ files to compare</p>
            <p className="text-sm text-muted-foreground">Maximum 5 files</p>
          </label>
        </div>

        {/* File Cards */}
        {files.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {files.map((file, i) => (
              <div key={i} className="glass-card p-4 relative group">
                <button
                  onClick={() => removeFile(i)}
                  className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  ×
                </button>
                <FileText className="w-8 h-8 mx-auto mb-2 text-primary" />
                <p className="text-xs text-center truncate">{file.name}</p>
              </div>
            ))}
          </div>
        )}

        {files.length >= 2 && (
          <Button
            onClick={processFiles}
            disabled={isProcessing}
            variant="hero"
            className="w-full"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Comparing...
              </>
            ) : (
              "Compare Files"
            )}
          </Button>
        )}

        {/* Results */}
        {result && (
          <div className="grid md:grid-cols-3 gap-4 animate-fade-in">
            {/* Differences */}
            <div className="glass-card p-5">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-destructive/20 flex items-center justify-center">
                  <Minus className="w-4 h-4 text-destructive" />
                </div>
                <h3 className="font-semibold">Differences</h3>
              </div>
              <ul className="space-y-2">
                {result.differences.map((item, i) => (
                  <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                    <span className="text-destructive mt-1">•</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Common */}
            <div className="glass-card p-5">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                  <Equal className="w-4 h-4 text-primary" />
                </div>
                <h3 className="font-semibold">Common Points</h3>
              </div>
              <ul className="space-y-2">
                {result.common.map((item, i) => (
                  <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Missing */}
            <div className="glass-card p-5">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center">
                  <Plus className="w-4 h-4 text-accent" />
                </div>
                <h3 className="font-semibold">Missing Items</h3>
              </div>
              <ul className="space-y-2">
                {result.missing.map((item, i) => (
                  <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                    <span className="text-accent mt-1">•</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Summary */}
        {result && (
          <div className="glass-card p-5 animate-fade-in">
            <h3 className="font-semibold mb-2">Summary</h3>
            <p className="text-muted-foreground">{result.summary}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompareWorkspace;
