
import { useState } from "react";

interface EmojiPickerProps {
  onEmojiSelect: (emoji: string) => void;
}

export const EmojiPicker = ({ onEmojiSelect }: EmojiPickerProps) => {
  const [category, setCategory] = useState("smileys");
  
  // Common emojis by category
  const emojis = {
    smileys: ["😀", "😃", "😄", "😁", "😆", "😅", "😂", "🤣", "😊", "😇", "🙂", "🙃", "😉", "😌", "😍", "🥰", "😘"],
    gestures: ["👋", "🤚", "🖐️", "✋", "🖖", "👌", "🤌", "🤏", "✌️", "🤞", "🤟", "🤘", "🤙", "👈", "👉", "👆", "👇"],
    animals: ["🐶", "🐱", "🐭", "🐹", "🐰", "🦊", "🐻", "🐼", "🐻‍❄️", "🐨", "🐯", "🦁", "🐮", "🐷", "🐸", "🐵", "🐔"],
    food: ["🍏", "🍎", "🍐", "🍊", "🍋", "🍌", "🍉", "🍇", "🍓", "🫐", "🍈", "🍒", "🍑", "🥭", "🍍", "🥥", "🥝"],
    activities: ["⚽", "🏀", "🏈", "⚾", "🥎", "🎾", "🏐", "🏉", "🥏", "🎱", "🪀", "🏓", "🏸", "🏒", "🏑", "🥍", "🏏"],
    objects: ["⌚", "📱", "💻", "⌨️", "🖥️", "🖱️", "🖨️", "🕹️", "🗜️", "💽", "💾", "💿", "📀", "📼", "📷", "📸", "📹"],
  };
  
  const categories = [
    { id: "smileys", label: "😀" },
    { id: "gestures", label: "👋" },
    { id: "animals", label: "🐶" },
    { id: "food", label: "🍏" },
    { id: "activities", label: "⚽" },
    { id: "objects", label: "📱" },
  ];
  
  return (
    <div className="bg-popover border border-border rounded-md shadow-lg p-2 w-64">
      <div className="flex justify-between border-b border-border pb-2 mb-2">
        {categories.map((cat) => (
          <button
            key={cat.id}
            className={`p-1 rounded-md ${
              category === cat.id ? "bg-primary/20" : "hover:bg-secondary"
            }`}
            onClick={() => setCategory(cat.id)}
          >
            {cat.label}
          </button>
        ))}
      </div>
      
      <div className="grid grid-cols-7 gap-1">
        {emojis[category as keyof typeof emojis].map((emoji, index) => (
          <button
            key={index}
            className="h-8 w-8 flex items-center justify-center rounded hover:bg-secondary"
            onClick={() => onEmojiSelect(emoji)}
          >
            {emoji}
          </button>
        ))}
      </div>
    </div>
  );
};
