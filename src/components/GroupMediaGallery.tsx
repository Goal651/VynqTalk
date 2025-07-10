import { GroupMessage } from '@/types';
import { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { CustomVideoPlayer } from './CustomVideoPlayer';

interface GroupMediaGalleryProps {
    mediaMessages: GroupMessage[];
    onMediaClick?: (index: number) => void;
}

export const GroupMediaGallery = ({ mediaMessages, onMediaClick }: GroupMediaGalleryProps) => {
    // Only show if there are media messages
    if (mediaMessages.length === 0) return null;

    const handleThumbnailClick = (idx: number) => {
        onMediaClick?.(idx);
    };

    return (
        <div className="w-full flex justify-center items-center mt-2 mb-4">
            <div className="w-full max-w-3xl">
                <div className="flex items-center gap-2 mb-2 justify-center">
                    <div className="h-4 w-4 rounded-full bg-primary/20 flex items-center justify-center">
                        <div className="h-2 w-2 rounded-full bg-primary"></div>
                    </div>
                    <span className="text-sm font-medium text-muted-foreground">Media Gallery</span>
                    <span className="text-xs text-muted-foreground">({mediaMessages.length})</span>
                </div>
                <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2 justify-center">
                    {mediaMessages.map((msg, idx) => (
                        <div
                            key={msg.id}
                            className="relative cursor-pointer group aspect-square"
                            onClick={() => handleThumbnailClick(idx)}
                        >
                            {msg.type === 'IMAGE' ? (
                                <img
                                    src={msg.content}
                                    alt={msg.fileName || 'Image'}
                                    className="object-cover w-full h-full rounded-lg border shadow-sm group-hover:opacity-80 transition-all duration-200 group-hover:scale-105"
                                />
                            ) : msg.type === 'VIDEO' ? (
                                <div className="relative w-full h-full bg-black rounded-lg flex items-center justify-center border shadow-sm group-hover:opacity-80 transition-all duration-200 group-hover:scale-105">
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center">
                                            <div className="h-4 w-4 bg-white rounded-full"></div>
                                        </div>
                                    </div>
                                    <span className="absolute bottom-1 right-1 bg-black/60 text-white text-xs px-1 py-0.5 rounded text-[10px]">VID</span>
                                </div>
                            ) : null}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default GroupMediaGallery; 