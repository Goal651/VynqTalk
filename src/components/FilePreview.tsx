
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FilePreviewProps {
  files: File[];
  onRemove: (index: number) => void;
}

export const FilePreview = ({ files, onRemove }: FilePreviewProps) => {
  const renderPreview = (file: File, index: number) => {
    const isImage = file.type.startsWith("image/");
    const isPdf = file.type === "application/pdf";
    
    return (
      <div key={index} className="relative group bg-muted rounded-md overflow-hidden border border-border">
        <div className="absolute top-1 right-1 z-10">
          <Button type="button"
            size="icon"
            variant="destructive"
            className="h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={() => onRemove(index)}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
        
        {isImage ? (
          <div className="h-24 w-24 p-1">
            <img
              src={URL.createObjectURL(file)}
              alt={file.name}
              className="h-full w-full object-cover rounded"
            />
          </div>
        ) : isPdf ? (
          <div className="h-24 w-24 flex flex-col items-center justify-center p-2">
            <div className="text-red-500 text-xl font-bold">PDF</div>
            <div className="text-xs text-center mt-1 truncate max-w-full">
              {file.name}
            </div>
          </div>
        ) : (
          <div className="h-24 w-24 flex flex-col items-center justify-center p-2">
            <div className="text-primary text-xl font-bold">File</div>
            <div className="text-xs text-center mt-1 truncate max-w-full">
              {file.name}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="mb-3">
      <div className="flex flex-wrap gap-2">
        {files.map((file, index) => renderPreview(file, index))}
      </div>
    </div>
  );
};
