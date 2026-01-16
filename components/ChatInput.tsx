
import React, { useState, useRef, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';
import { clsx } from '../lib/utils';

interface ChatInputProps {
  onSendMessage: (content: string) => void;
  disabled?: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, disabled }) => {
  const [content, setContent] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const adjustHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
    }
  };

  useEffect(() => {
    adjustHeight();
  }, [content]);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (content.trim() && !disabled) {
      onSendMessage(content.trim());
      setContent('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey && window.innerWidth >= 768) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 pb-6 md:pb-10">
      <form
        onSubmit={handleSubmit}
        className="relative flex items-end gap-2 bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 rounded-[2.5rem] p-2 pr-2.5 transition-all focus-within:border-blue-500/50 shadow-sm"
      >
        <textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Neural prompt..."
          rows={1}
          disabled={disabled}
          className="flex-1 bg-transparent border-none focus:ring-0 p-4 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-white/20 resize-none min-h-[60px] max-h-[200px] text-[16px] leading-relaxed"
        />
        <button
          type="submit"
          disabled={!content.trim() || disabled}
          className={clsx(
            "p-4 rounded-full transition-all duration-300 flex-shrink-0",
            content.trim() && !disabled
              ? "bg-slate-900 dark:bg-white text-white dark:text-black scale-100 shadow-xl shadow-blue-500/10"
              : "bg-slate-200 dark:bg-white/5 text-slate-400 dark:text-white/10 scale-95"
          )}
        >
          <ArrowUp size={20} strokeWidth={3} />
        </button>
      </form>
      <div className="mt-3 flex justify-center px-4">
        <p className="text-[9px] text-slate-400 dark:text-white/10 font-black uppercase tracking-[0.3em] text-center">
          ABHIYAN INTELLIGENCE ENGINE: OPTIMIZED
        </p>
      </div>
    </div>
  );
};

export default ChatInput;
