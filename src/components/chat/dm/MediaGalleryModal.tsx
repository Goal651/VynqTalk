import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Message } from "@/types";
import { Button } from "@/components/ui/button";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { CustomVideoPlayer } from "../../CustomVideoPlayer";

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
                <Dialog open={open} onOpenChange={onClose} >
                    <DialogContent className="flex flex-col items-center justify-center bg-black/95 p-0 max-w-4xl w-[95vw] h-[95vh] absolute overflow-hidden border-0">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                            className="w-full flex flex-col items-center"
                        >
                            {/* Navigation Controls */}
                            <div className="absolute top-0 left-4 right-4 flex justify-between items-center z-20  mr-10">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => onNavigate(currentIndex - 1)}
                                    disabled={currentIndex === 0}
                                    className="text-white bg-black/50 hover:bg-black/70 rounded-full shadow-lg backdrop-blur-sm"
                                >
                                    <ChevronLeft className="h-6 w-6" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => onNavigate(currentIndex + 1)}
                                    disabled={currentIndex === mediaMessages.length - 1}
                                    className="text-white2 bg-black/50 hover:bg-black/70 rounded-full shadow-lg backdrop-blur-sm"
                                >
                                    <ChevronRight className="h-6 w-6" />
                                </Button>
                            </div>
                            {/* Media Content */}
                            <div className="flex items-center justify-center w-full h-full p-4">
                                {current.type === "image" && (
                                    <motion.img
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        transition={{ duration: 0.3 }}
                                        src={current.content}
                                        alt={current.fileName || "Image"}
                                        className="max-h-[85vh] max-w-[90vw] rounded-lg shadow-2xl object-contain"
                                        style={{ 
                                            maxHeight: '85vh',
                                            maxWidth: '90vw',
                                            objectFit: 'contain'
                                        }}
                                    />
                                )}
                                {current.type === "video" && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        transition={{ duration: 0.3 }}
                                        className="w-full max-w-4xl rounded-lg overflow-hidden shadow-2xl"
                                    >
                                        <CustomVideoPlayer
                                            src={current.content}
                                        />
                                    </motion.div>
                                )}
                            </div>
                            {/* File Info */}
                            {current.fileName && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 20 }}
                                    transition={{ duration: 0.3, delay: 0.1 }}
                                    className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-sm bg-black/60 px-4 py-2 rounded-full backdrop-blur-sm shadow-lg"
                                >
                                    {current.fileName} <span className="ml-2 text-muted-foreground">[{current.type}]</span>
                                </motion.div>
                            )}
                        </motion.div>
                    </DialogContent>
                </Dialog>
            )}
        </AnimatePresence>
    );
}; 