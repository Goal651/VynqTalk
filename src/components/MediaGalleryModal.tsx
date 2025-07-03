import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Message } from "@/types/message";
import { Button } from "@/components/ui/button";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

interface MediaGalleryModalProps {
    open: boolean;
    mediaMessages: Message[];
    currentIndex: number;
    onClose: () => void;
    onNavigate: (index: number) => void;
}

export const MediaGalleryModal = ({
    open,
    mediaMessages,
    currentIndex,
    onClose,
    onNavigate,
}: MediaGalleryModalProps) => {
    const current = mediaMessages[currentIndex];
    if (!current) return null;

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="flex flex-col items-center justify-center bg-black p-4 max-w-3xl">
                <div className="flex w-full justify-between items-center mb-2">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onNavigate(currentIndex - 1)}
                        disabled={currentIndex === 0}
                        className="text-white"
                    >
                        <ChevronLeft className="h-6 w-6" />
                    </Button>
                    <span className="text-white text-sm">
                        {currentIndex + 1} / {mediaMessages.length}
                    </span>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onNavigate(currentIndex + 1)}
                        disabled={currentIndex === mediaMessages.length - 1}
                        className="text-white"
                    >
                        <ChevronRight className="h-6 w-6" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onClose}
                        className="absolute top-2 right-2 text-white"
                    >
                        <X className="h-5 w-5" />
                    </Button>
                </div>
                <div className="flex items-center justify-center w-full h-full">
                    {current.type === "IMAGE" && (
                        <img
                            src={current.content}
                            alt={current.fileName || "Image"}
                            className="max-h-[80vh] max-w-[90vw] rounded-lg"
                        />
                    )}
                    {current.type === "VIDEO" && (
                        <video
                            src={current.content}
                            controls
                            autoPlay
                            className="max-h-[80vh] max-w-[90vw] rounded-lg"
                            style={{ background: "#000" }}
                        />
                    )}
                </div>
                {current.fileName && (
                    <div className="text-white text-xs mt-2 truncate max-w-full text-center">{current.fileName}</div>
                )}
            </DialogContent>
        </Dialog>
    );
}; 