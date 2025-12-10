import { Upload, FileText, Loader2, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useCallback } from "react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

const OCRWorkspace = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    setFiles(prev => [...prev, ...droppedFiles]);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(prev => [...prev, ...Array.from(e.target.files!)]);
    }
  };

  const processFiles = async () => {
    setIsProcessing(true);
    // Simulate OCR processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    setResult(`Extracted Text from ${files.length} file(s):

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.

• Key Point 1: Document analysis complete
• Key Point 2: Text formatting preserved  
• Key Point 3: Multi-language detection enabled

This is a sample output demonstrating the OCR capabilities of TriScan AI. In production, this would contain the actual extracted text from your uploaded documents.`);
    setIsProcessing(false);
  };

  const copyToClipboard = async () => {
    if (result) {
      await navigator.clipboard.writeText(result);
      setCopied(true);
      toast({ title: "Copied to clipboard!" });
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="h-full flex flex-col p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1">Intelligent OCR</h1>
        <p className="text-muted-foreground">Extract text from images and documents</p>
      </div>

      <div className="flex-1 flex flex-col gap-6">
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
            id="file-upload"
            multiple
            accept="image/*,.pdf,.doc,.docx"
            onChange={handleFileChange}
            className="hidden"
          />
          <label htmlFor="file-upload" className="cursor-pointer">
            <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-lg font-medium mb-1">Drop files here or click to upload</p>
            <p className="text-sm text-muted-foreground">Supports images, PDFs, and documents</p>
          </label>
        </div>

        {/* File List */}
        {files.length > 0 && (
          <div className="glass-card p-4">
            <h3 className="font-medium mb-3">Uploaded Files ({files.length})</h3>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {files.map((file, i) => (
                <div key={i} className="flex items-center gap-3 p-2 rounded-lg bg-secondary/30">
                  <FileText className="w-4 h-4 text-primary" />
                  <span className="text-sm truncate flex-1">{file.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {(file.size / 1024).toFixed(1)} KB
                  </span>
                </div>
              ))}
            </div>
            <Button
              onClick={processFiles}
              disabled={isProcessing}
              className="w-full mt-4"
              variant="hero"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Processing...
                </>
              ) : (
                "Extract Text"
              )}
            </Button>
          </div>
        )}

        {/* Result */}
        {result && (
          <div className="glass-card p-6 flex-1 animate-fade-in">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium">Extracted Text</h3>
              <Button variant="ghost" size="sm" onClick={copyToClipboard}>
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </Button>
            </div>
            <div className="bg-secondary/30 rounded-lg p-4 h-64 overflow-y-auto">
              <pre className="whitespace-pre-wrap text-sm text-foreground/90 font-mono">
                {result}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OCRWorkspace;
