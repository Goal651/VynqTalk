import { Message, User, Reaction, GroupMessage } from '@/types';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuSeparator,
    ContextMenuTrigger
} from "@/components/ui/context-menu";
import { Edit, Trash2, Reply, Copy, File, X as CloseIcon, Globe, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect, useRef } from "react";
import { useUsers } from "@/contexts/UsersContext";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { motion, AnimatePresence } from "framer-motion";
import { CustomVideoPlayer } from "./CustomVideoPlayer";
import { CustomAudioPlayer } from "./CustomAudioPlayer";
import { Badge } from "@/components/ui/badge";

interface GroupMessageBubbleProps {
    message: GroupMessage;
    user: User;
    onUserAvatarClick?: () => void;
    onDeleteMessage?: () => void;
    onEditMessage?: () => void;
    onReplyMessage?: (message: GroupMessage) => void;
    onReactToMessage?: (messageId: number, reaction: Reaction) => void;
    currentUserId?: number;
    onMediaClick?: (messageId: number) => void;
    isGroupAdmin?: boolean;
    showUserInfo?: boolean;
}

export const GroupMessageBubble = ({
    message,
    user,
    onUserAvatarClick,
    onDeleteMessage,
    onEditMessage,
    onReplyMessage,
    onReactToMessage,
    currentUserId,
    onMediaClick,
    isGroupAdmin = false,
    showUserInfo = true
}: GroupMessageBubbleProps) => {
    const [showReactionPicker, setShowReactionPicker] = useState(false);
    const isCurrentUser = user.id === currentUserId;
    const formattedTime = new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const { getUserName, users } = useUsers();

    // --- Link Preview Logic ---
    const urlRegex = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi;
    const LINK_PREVIEW_API_KEY = "3b3f4d51fc1a85aeab5c0e15b90913fa";
    const [linkPreviews, setLinkPreviews] = useState<Record<string, { url: string; title?: string; description?: string; image: string }>>({});
    const fetchedUrls = useRef<Set<string>>(new Set());

    // Regex for image URLs
    const imageUrlRegex = /(https?:\/\/[\w\-._~:/?#[\]@!$&'()*+,;=%]+\.(?:png|jpg|jpeg|gif|webp|bmp|svg))/i;

    useEffect(() => {
        if (message.type !== "TEXT" || !message.content) return;
        const urls = message.content.match(urlRegex) || [];
        urls.forEach((url) => {
            if (!linkPreviews[url] && !fetchedUrls.current.has(url)) {
                fetchedUrls.current.add(url);
                (async () => {
                    try {
                        const apiUrl = `https://api.linkpreview.net/?key=${LINK_PREVIEW_API_KEY}&q=${encodeURIComponent(url)}`;
                        const res = await fetch(apiUrl);
                        if (!res.ok) throw new Error("API error");
                        const data = await res.json();
                        setLinkPreviews(prev => ({
                            ...prev,
                            [url]: {
                                url,
                                title: data.title,
                                description: data.description,
                                image: data.image || `https://www.google.com/s2/favicons?domain=${new URL(url).hostname}`,
                            }
                        }));
                    } catch (err) {
                        setLinkPreviews(prev => ({
                            ...prev,
                            [url]: {
                                url,
                                title: url,
                                image: `https://www.google.com/s2/favicons?domain=${new URL(url).hostname}`,
                            }
                        }));
                    }
                })();
            }
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [message.content, message.type]);

    const handleAvatarClick = () => {
        console.log("Avatar clicked:", user.name);
        if (onUserAvatarClick) {
            onUserAvatarClick();
        }
    };

    const handleDeleteClick = () => {
        console.log("Delete message clicked:", message.id);
        if (onDeleteMessage) {
            onDeleteMessage();
        }
    };

    const handleEditClick = () => {
        console.log("Edit message clicked:", message.id);
        if (onEditMessage) {
            onEditMessage();
        }
    };

    const handleReplyClick = () => {
        console.log("Reply message clicked:", message.id);
        if (onReplyMessage) {
            onReplyMessage(message);
        }
    };

    const handleCopyClick = async () => {
        console.log("Copy message clicked:", message.id);
        try {
            await navigator.clipboard.writeText(message.content);
        } catch (error) {
            console.error("Failed to copy message:", error);
        }
    };

    const handleReactClick = () => {
        console.log("React button clicked:", message.id);
        setShowReactionPicker(!showReactionPicker);
    };

    const handleEmojiSelect = (emoji: string) => {
        console.log("Emoji selected:", emoji, "for message:", message.id);
        if (onReactToMessage) {
            const newReaction: Reaction = {
                userId: currentUserId,
                emoji,
            }
            onReactToMessage(message.id, newReaction);
        }
        setShowReactionPicker(false);
    };

    const reactionEmojis = ["❤️", "😂", "😮", "😢", "😡", "👍", "👎", "🔥"];

    // Group reactions by emoji and collect userIds
    const reactionsByEmoji = message.reactions?.reduce((acc, reaction) => {
        if (!acc[reaction.emoji]) acc[reaction.emoji] = [];
        acc[reaction.emoji].push(reaction.userId);
        return acc;
    }, {} as Record<string, number[]>) || {};

    // Set of emojis the current user has reacted to
    const userReactedEmojis = new Set(
        message.reactions?.filter(r => r.userId === currentUserId).map(r => r.emoji)
    );

    const messageBubble = (
        <div className="relative">
            {message.replyTo && (
                <div className="flex flex-col mb-2">
                    <div className="flex items-center gap-2 bg-muted/70 border-l-4 border-primary rounded-md px-3 py-2 shadow-sm">
                        <span className="block text-xs font-semibold text-primary">
                            Replying to {message.replyTo.sender.name}
                        </span>
                        {(() => {
                            const r = message.replyTo;
                            switch (r.type) {
                                case "IMAGE":
                                    return (
                                        <img
                                            src={r.content}
                                            alt={r.fileName || "Image"}
                                            className="h-8 w-8 object-cover rounded-md border ml-2"
                                        />
                                    );
                                case "VIDEO":
                                    return (
                                        <span className="flex items-center gap-1 text-xs text-muted-foreground ml-2">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M4 6h12a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V8a2 2 0 012-2z" /></svg>
                                            {r.fileName || "Video"}
                                        </span>
                                    );
                                case "AUDIO":
                                    return (
                                        <span className="flex items-center gap-1 text-xs text-muted-foreground ml-2">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l-2 2H5a2 2 0 00-2 2v4a2 2 0 002 2h2l2 2zm7-2a2 2 0 100-4 2 2 0 000 4z" /></svg>
                                            {r.fileName || "Audio"}
                                        </span>
                                    );
                                case "FILE":
                                    return (
                                        <span className="flex items-center gap-1 text-xs text-muted-foreground ml-2">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" /></svg>
                                            {r.fileName || "File"}
                                        </span>
                                    );
                                default:
                                    return (
                                        <span className="block text-xs text-muted-foreground truncate max-w-[200px] ml-2">
                                            {r.content}
                                        </span>
                                    );
                            }
                        })()}
                    </div>
                    <div className="w-full h-px bg-border/60 my-1" />
                </div>
            )}

            <div
                className={`max-w-xs min-w-24 lg:max-w-md px-4 py-2 rounded-lg shadow-sm relative ${isCurrentUser
                    ? "bg-primary text-primary-foreground ml-auto"
                    : "bg-muted text-foreground mr-auto"
                    }`}
            >
                {/* User info for group messages */}
                {showUserInfo && !isCurrentUser && (
                    <div className="flex items-center gap-2 mb-2">
                        <Avatar
                            className="h-6 w-6 cursor-pointer hover:opacity-80 transition-opacity"
                            onClick={handleAvatarClick}
                        >
                            <AvatarImage src={user.avatar} alt={user.name} />
                            <AvatarFallback className="text-xs bg-primary/20 text-primary">
                                {user.name.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex items-center gap-1">
                            <span className="text-xs font-medium text-muted-foreground">{user.name}</span>
                            {isGroupAdmin && (
                                <Badge variant="secondary" className="px-1 py-0 text-xs">
                                    <Crown className="h-3 w-3 mr-1" />
                                    Admin
                                </Badge>
                            )}
                        </div>
                    </div>
                )}

                {/* Message content rendering based on type */}
                {message.type === "TEXT" && (
                    <>
                        <div className="break-words whitespace-pre-wrap mb-2">{message.content}</div>
                        {/* Link Previews and Inline Images */}
                        {message.type === "TEXT" && (message.content.match(urlRegex) || []).map((url, idx) => {
                            if (imageUrlRegex.test(url)) {
                                return (
                                    <div key={url} className="mt-3 mb-2 flex justify-center animate-fade-in">
                                        <img src={url} alt="Image" className="max-w-full max-h-64 rounded-lg border bg-muted" />
                                    </div>
                                );
                            } else if (linkPreviews[url]) {
                                return (
                                    <div key={url} className="mt-3 mb-2 p-4 rounded-2xl border-l-4 border border-border/70 bg-background/90 flex items-center gap-4 shadow-md hover:shadow-lg transition-all duration-200 relative animate-fade-in max-w-2xl sm:max-w-sm md:max-w-md w-full max-h-56 overflow-hidden group">
                                        {linkPreviews[url].image && !linkPreviews[url].image.includes('google.com/s2/favicons') ? (
                                            <img src={linkPreviews[url].image} alt="Preview" className="h-16 w-16 min-w-[4rem] max-w-[4rem] object-cover rounded-lg border flex-shrink-0 bg-muted" />
                                        ) : (
                                            <div className="h-16 w-16 min-w-[4rem] max-w-[4rem] flex items-center justify-center rounded-lg border flex-shrink-0 bg-muted">
                                                <Globe className="h-8 w-8 text-muted-foreground" />
                                            </div>
                                        )}
                                        <div className="flex-1 min-w-0 w-0">
                                            <div className="font-semibold text-base truncate w-full block mb-1 break-words">{linkPreviews[url].title || linkPreviews[url].url}</div>
                                            {linkPreviews[url].description && (
                                                <div className="text-sm text-muted-foreground line-clamp-2 break-words w-full block mb-1 overflow-hidden">{linkPreviews[url].description}</div>
                                            )}
                                            <a href={linkPreviews[url].url} target="_blank" rel="noopener noreferrer" className="text-xs text-primary underline break-all w-full block truncate">
                                                {linkPreviews[url].url}
                                            </a>
                                        </div>
                                    </div>
                                );
                            } else {
                                return (
                                    <div key={url + idx} className="mt-2 mb-1 p-3 rounded-lg border border-border bg-background flex items-center gap-3 shadow-sm relative animate-fade-in max-w-full w-full overflow-hidden opacity-60">
                                        <div className="flex-1 min-w-0 w-0">
                                            <div className="font-medium text-sm truncate w-full block">Loading preview…</div>
                                            <a href={url} target="_blank" rel="noopener noreferrer" className="text-xs text-primary underline break-all w-full block truncate">
                                                {url}
                                            </a>
                                        </div>
                                    </div>
                                );
                            }
                        })}
                    </>
                )}
                {message.type === "IMAGE" && message.content && (
                    <img
                        src={message.content}
                        alt={message.fileName || "Image"}
                        className="max-w-full rounded-md cursor-pointer mb-2"
                        style={{ maxHeight: 300 }}
                        onClick={() => onMediaClick?.(message.id)}
                    />
                )}
                {message.type === "AUDIO" && message.content && (
                    <div className="w-full my-2">
                        <CustomAudioPlayer src={message.content} />
                    </div>
                )}
                {/* Media: FILE */}
                {message.type === "FILE" && message.content && (
                    <div className="my-2 p-3 rounded-2xl border-l-4 border border-border/70 bg-background/90 flex items-center gap-4 shadow-sm hover:shadow-lg transition-all duration-200 min-h-20 max-w-[98vw] sm:max-w-sm md:max-w-md w-full group">
                        <div className="flex items-center justify-center h-12 w-12 min-w-[3rem] max-w-[3rem] rounded-lg bg-muted border">
                            <File className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <div className="flex-1 min-w-0 w-0">
                            <div className="font-medium text-base truncate w-full block mb-1 break-words">{message.fileName || "Download file"}</div>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded font-bold uppercase tracking-wide border border-primary/30">
                                    {message.fileName ? message.fileName.split('.').pop()?.toUpperCase() : 'FILE'}
                                </span>
                                <a
                                    href={message.content}
                                    download={message.fileName || undefined}
                                    className="text-xs text-primary underline truncate hover:bg-primary/10 px-2 py-0.5 rounded transition-colors"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Download
                                </a>
                            </div>
                        </div>
                    </div>
                )}
                {message.type === "VIDEO" && message.content && (
                    <div className="w-full mt-2 rounded-md overflow-hidden">
                        <CustomVideoPlayer
                            src={message.content}
                        />
                    </div>
                )}
                {/* Timestamp bottom right */}
                <span className="absolute bottom-1 right-3 text-xs opacity-80">
                    {formattedTime}
                </span>
            </div>

            {/* Reactions below the bubble */}
            {message.reactions && message.reactions.length > 0 && (
                <div className={`flex flex-wrap gap-1 mt-1 ${isCurrentUser ? "justify-end" : "justify-start"}`}>
                    {Object.entries(reactionsByEmoji).map(([emoji, userIds]) => (
                        <Tooltip key={emoji}>
                            <TooltipTrigger asChild>
                                <Button
                                    variant={userReactedEmojis.has(emoji) ? "default" : "secondary"}
                                    size="sm"
                                    className={`h-6 px-2 text-xs rounded-full shadow ${userReactedEmojis.has(emoji)
                                        ? "bg-primary text-primary-foreground"
                                        : "bg-muted/80 hover:bg-muted"
                                        }`}
                                    onClick={() => handleEmojiSelect(emoji)}
                                >
                                    {emoji} {userIds.length}
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <div className="mb-1 font-semibold text-xs">Reacted by:</div>
                                <div className="flex flex-col gap-1">
                                    {userIds.map(userId => {
                                        const user = users[userId];
                                        return (
                                            <div key={userId} className="flex items-center gap-2">
                                                <Avatar className="h-5 w-5">
                                                    <AvatarImage src={user?.avatar} alt={user?.name} />
                                                    <AvatarFallback>{user?.name?.[0] || "U"}</AvatarFallback>
                                                </Avatar>
                                                <span className="text-xs">{user?.name || `User ${userId}`}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </TooltipContent>
                        </Tooltip>
                    ))}
                </div>
            )}

            {/* Reaction picker stays above bubble */}
            {showReactionPicker && (
                <div className={`absolute top-full mt-1 z-50 bg-popover border border-border rounded-md shadow-lg p-2 ${isCurrentUser ? "right-0" : "left-0"
                    }`}>
                    <div className="flex gap-1 ">
                        {reactionEmojis.map((emoji) => (
                            <Button
                                key={emoji}
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 hover:bg-accent"
                                onClick={() => handleEmojiSelect(emoji)}
                            >
                                {emoji}
                            </Button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );

    return (
        <AnimatePresence>
            <motion.div
                className={`flex items-start gap-2 ${isCurrentUser ? "flex-row-reverse" : "flex-row"}`}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 30 }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                layout
            >
                <ContextMenu>
                    <ContextMenuTrigger className="focus:outline-none">
                        {messageBubble}
                    </ContextMenuTrigger>
                    <ContextMenuContent className="bg-background border border-border shadow-lg z-50">
                        {onReplyMessage && (
                            <ContextMenuItem
                                onClick={handleReplyClick}
                                className="cursor-pointer hover:bg-accent transition-colors"
                            >
                                <Reply className="mr-2 h-4 w-4" />
                                Reply
                            </ContextMenuItem>
                        )}

                        <ContextMenuItem
                            onClick={handleReactClick}
                            className="cursor-pointer hover:bg-accent transition-colors"
                        >
                            <span className="mr-2">😀</span>
                            React
                        </ContextMenuItem>

                        <ContextMenuItem
                            onClick={handleCopyClick}
                            className="cursor-pointer hover:bg-accent transition-colors"
                        >
                            <Copy className="mr-2 h-4 w-4" />
                            Copy
                        </ContextMenuItem>

                        {isCurrentUser && (
                            <>
                                <ContextMenuSeparator />
                                {onEditMessage && (
                                    <ContextMenuItem
                                        onClick={handleEditClick}
                                        className="cursor-pointer hover:bg-accent transition-colors"
                                    >
                                        <Edit className="mr-2 h-4 w-4" />
                                        Edit message
                                    </ContextMenuItem>
                                )}
                                {onDeleteMessage && (
                                    <ContextMenuItem
                                        onClick={handleDeleteClick}
                                        className="cursor-pointer text-destructive focus:text-destructive hover:bg-destructive/10 transition-colors"
                                    >
                                        <Trash2 className="mr-2 h-4 w-4" />
                                        Delete message
                                    </ContextMenuItem>
                                )}
                            </>
                        )}
                    </ContextMenuContent>
                </ContextMenu>
            </motion.div>
        </AnimatePresence>
    );
};

export default GroupMessageBubble; 