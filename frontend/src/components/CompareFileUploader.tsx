import { useState, useRef } from "react";
import { Upload, X, FileText, File, Image, FileType, GitCompare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { compareApi } from "@/api";

interface CompareFileUploaderProps {
  chatId: string;
  onCompareSuccess: (result: any) => void;
  onCompareError: (error: string) => void;
}

const getFileIcon = (filename: string) => {
  const ext = filename.toLowerCase();
  if (ext.endsWith('.pdf')) return FileText;
  if (ext.endsWith('.docx')) return FileType;
  if (ext.endsWith('.pptx')) return File;
  if (ext.endsWith('.txt')) return FileType;
  return Image; // For image files
};

const getFileColor = (filename: string) => {
  const ext = filename.toLowerCase();
  if (ext.endsWith('.pdf')) return 'text-red-500';
  if (ext.endsWith('.docx')) return 'text-blue-500';
  if (ext.endsWith('.pptx')) return 'text-orange-500';
  if (ext.endsWith('.txt')) return 'text-gray-500';
  return 'text-green-500'; // For images
};

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};

export const CompareFileUploader = ({ chatId, onCompareSuccess, onCompareError }: CompareFileUploaderProps) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isComparing, setIsComparing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    addFiles(files);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      addFiles(files);
    }
  };

  const addFiles = (files: File[]) => {
    // Validate files
    const validFiles = files.filter(file => {
      const isValid = compareApi.isValidCompareFile(file);
      if (!isValid) {
        onCompareError(`Invalid file type: ${file.name}`);
      }
      return isValid;
    });

    setSelectedFiles(prev => [...prev, ...validFiles]);
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleCompare = async () => {
    if (selectedFiles.length < 2) {
      onCompareError('Please select at least 2 files to compare');
      return;
    }

    setIsComparing(true);
    try {
      const result = await compareApi.compareFiles(chatId, selectedFiles);
      onCompareSuccess(result);
      setSelectedFiles([]); // Clear files after successful comparison
    } catch (error: any) {
      onCompareError(error.message || 'Failed to compare files');
    } finally {
      setIsComparing(false);
    }
  };

  const handleBrowse = () => {
    fileInputRef.current?.click();
  };

  const minFilesReached = selectedFiles.length >= 2;

  return (
    <div className="space-y-4">
      {/* Drag & Drop Area */}
      <Card
        className={cn(
          "border-2 border-dashed transition-all duration-200 cursor-pointer",
          isDragging 
            ? "border-primary bg-primary/5 scale-[1.02]" 
            : "border-border hover:border-orange-500/50 hover:bg-accent/50"
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleBrowse}
      >
        <div className="p-8 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-orange-500/20 to-red-500/20 flex items-center justify-center">
            <Upload className={cn(
              "w-8 h-8 transition-colors",
              isDragging ? "text-primary" : "text-orange-500"
            )} />
          </div>
          
          <h3 className="text-lg font-semibold mb-2">
            {isDragging ? "Drop files here" : "Upload Files to Compare"}
          </h3>
          
          <p className="text-sm text-muted-foreground mb-2">
            Drag and drop files here or click to browse
          </p>
          
          <p className="text-xs text-orange-600 dark:text-orange-400 font-medium mb-4">
            ⚠️ Minimum 2 files required
          </p>
          
          <div className="flex flex-wrap gap-2 justify-center text-xs text-muted-foreground">
            <span className="px-2 py-1 rounded-full bg-secondary">PNG</span>
            <span className="px-2 py-1 rounded-full bg-secondary">JPG</span>
            <span className="px-2 py-1 rounded-full bg-secondary">PDF</span>
            <span className="px-2 py-1 rounded-full bg-secondary">DOCX</span>
            <span className="px-2 py-1 rounded-full bg-secondary">PPTX</span>
            <span className="px-2 py-1 rounded-full bg-secondary">TXT</span>
          </div>
        </div>
      </Card>

      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept=".png,.jpg,.jpeg,.gif,.bmp,.tiff,.pdf,.docx,.pptx,.txt"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Selected Files List */}
      {selectedFiles.length > 0 && (
        <Card className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-semibold text-sm flex items-center gap-2">
              Selected Files ({selectedFiles.length})
              {!minFilesReached && (
                <span className="text-xs text-orange-600 dark:text-orange-400">
                  (Need {2 - selectedFiles.length} more)
                </span>
              )}
            </h4>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedFiles([])}
              className="h-8 text-xs"
            >
              Clear All
            </Button>
          </div>
          
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {selectedFiles.map((file, index) => {
              const FileIcon = getFileIcon(file.name);
              const iconColor = getFileColor(file.name);
              
              return (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors group"
                >
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-background">
                    <span className="text-xs font-bold text-muted-foreground">
                      {index + 1}
                    </span>
                  </div>
                  
                  <FileIcon className={cn("w-5 h-5 flex-shrink-0", iconColor)} />
                  
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{file.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatFileSize(file.size)}
                    </p>
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFile(index);
                    }}
                    className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              );
            })}
          </div>

          <Button
            onClick={handleCompare}
            disabled={isComparing || !minFilesReached}
            className={cn(
              "w-full mt-4",
              minFilesReached 
                ? "bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600" 
                : ""
            )}
            size="lg"
          >
            {isComparing ? (
              <>
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                Comparing...
              </>
            ) : (
              <>
                <GitCompare className="w-4 h-4 mr-2" />
                Compare {selectedFiles.length} Files
              </>
            )}
          </Button>
          
          {!minFilesReached && (
            <p className="text-xs text-center text-muted-foreground mt-2">
              Add at least {2 - selectedFiles.length} more {2 - selectedFiles.length === 1 ? 'file' : 'files'} to enable comparison
            </p>
          )}
        </Card>
      )}
    </div>
  );
};
