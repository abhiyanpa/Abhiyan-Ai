
import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Role, Message } from '../types';
import { clsx } from '../lib/utils';
import { User, Copy, Check, Zap } from 'lucide-react';

interface MessageBubbleProps {
  message: Message;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isUser = message.role === Role.USER;
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={clsx(
      "flex w-full mb-6 md:mb-10 animate-in-msg",
      isUser ? "justify-end" : "justify-start"
    )}>
      <div className={clsx(
        "flex max-w-[92%] md:max-w-[85%] gap-3 md:gap-5",
        isUser ? "flex-row-reverse" : "flex-row"
      )}>
        {/* Avatar */}
        <div className={clsx(
          "w-8 h-8 md:w-10 md:h-10 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm border transition-all duration-300",
          isUser 
            ? "bg-slate-900 dark:bg-white text-white dark:text-black border-slate-800 dark:border-white" 
            : "bg-blue-600 text-white border-blue-500 shadow-lg shadow-blue-500/20"
        )}>
          {isUser ? <User size={16} /> : <Zap size={18} className="fill-white" />}
        </div>

        {/* Content Box */}
        <div className="flex flex-col gap-2 flex-1 min-w-0">
          <div className={clsx(
            "p-4 md:p-5 rounded-2xl md:rounded-[1.5rem] relative group transition-all duration-300",
            isUser 
              ? "bg-slate-100 dark:bg-white/5 text-slate-900 dark:text-slate-100" 
              : "bg-transparent text-slate-800 dark:text-slate-200"
          )}>
            <div className="markdown-content text-[15px] md:text-[16px] leading-[1.6] break-words">
              {message.content ? (
                <ReactMarkdown 
                  remarkPlugins={[remarkGfm]}
                  components={{
                    // Explicitly styling code blocks if global CSS wasn't enough
                    code({node, inline, className, children, ...props}) {
                      return (
                        <code className={clsx(className, "font-mono")} {...props}>
                          {children}
                        </code>
                      )
                    }
                  }}
                >
                  {message.content}
                </ReactMarkdown>
              ) : (
                <div className="flex gap-1.5 py-3 items-center">
                  <div className="w-1.5 h-1.5 bg-blue-600 rounded-full typing-dot" />
                  <div className="w-1.5 h-1.5 bg-blue-600 rounded-full typing-dot" />
                  <div className="w-1.5 h-1.5 bg-blue-600 rounded-full typing-dot" />
                </div>
              )}
            </div>

            {/* Actions */}
            {!isUser && message.content && (
              <div className="absolute -bottom-8 left-0 flex items-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                 <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 text-slate-400 hover:text-blue-500 transition-colors py-1 group/copy"
                >
                  {copied ? <Check size={13} className="text-green-500" /> : <Copy size={13} className="group-hover/copy:scale-110 transition-transform" />}
                  <span className="text-[10px] font-bold uppercase tracking-widest">Copy</span>
                </button>
              </div>
            )}
          </div>
          
          <div className={clsx(
            "flex items-center px-1",
            isUser ? "justify-end" : "justify-start"
          )}>
            <span className="text-[10px] text-slate-400 dark:text-white/20 font-bold uppercase tracking-wider select-none">
              {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
