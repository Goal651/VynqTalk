import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Message } from "@/types/message";
import { Button } from "@/components/ui/button";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { CustomVideoPlayer } from "./CustomVideoPlayer";

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
        <AnimatePresence>
            {open && (
                <Dialog open={open} onOpenChange={onClose}>
                    <DialogContent className="flex flex-col items-center justify-center bg-black/90 p-4 max-w-3xl relative overflow-visible">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                            className="w-full flex flex-col items-center"
                        >
                            <div className="flex w-full justify-between items-center mb-2 relative z-10">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => onNavigate(currentIndex - 1)}
                                    disabled={currentIndex === 0}
                                    className="text-white bg-black/40 hover:bg-black/60 rounded-full shadow-lg"
                                >
                                    <ChevronLeft className="h-7 w-7" />
                                </Button>
                                <span className="text-white text-sm bg-black/60 px-3 py-1 rounded-full">
                                    {currentIndex + 1} / {mediaMessages.length}
                                </span>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => onNavigate(currentIndex + 1)}
                                    disabled={currentIndex === mediaMessages.length - 1}
                                    className="text-white bg-black/40 hover:bg-black/60 rounded-full shadow-lg"
                                >
                                    <ChevronRight className="h-7 w-7" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={onClose}
                                    className="absolute top-0 right-0 text-white bg-black/40 hover:bg-black/60 rounded-full shadow-lg"
                                >
                                    <X className="h-5 w-5" />
                                </Button>
                            </div>
                            <div className="flex items-center justify-center w-full h-full min-h-[40vh] max-h-[80vh]">
                                {current.type === "IMAGE" && (
                                    <img
                                        src={current.content}
                                        alt={current.fileName || "Image"}
                                        className="max-h-[70vh] max-w-[90vw] rounded-lg shadow-xl object-contain"
                                    />
                                )}
                                {current.type === "VIDEO" && (
                                    <div className="w-full max-w-2xl rounded-lg overflow-hidden shadow-xl">
                                        <CustomVideoPlayer
                                            src={current.content}
                                            style={{ background: "#000", maxHeight: 360 }}
                                        />
                                    </div>
                                )}
                            </div>
                            {current.fileName && (
                                <div className="text-white text-xs mt-4 truncate max-w-full text-center bg-black/60 px-3 py-1 rounded shadow">
                                    {current.fileName} <span className="ml-2 text-muted-foreground">[{current.type}]</span>
                                </div>
                            )}
                        </motion.div>
                    </DialogContent>
                </Dialog>
            )}
        </AnimatePresence>
    );
}; 