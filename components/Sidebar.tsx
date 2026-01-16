
import React, { useState } from 'react';
import { Plus, MessageSquare, Trash2, X, Search, Settings as SettingsIcon, Zap, Home } from 'lucide-react';
import { Chat } from '../types';
import { clsx } from '../lib/utils';

interface SidebarProps {
  chats: Chat[];
  activeChatId: string | null;
  onSelectChat: (id: string) => void;
  onNewChat: () => void;
  onDeleteChat: (id: string) => void;
  onOpenSettings: () => void;
  onGoHome: () => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  chats,
  activeChatId,
  onSelectChat,
  onNewChat,
  onDeleteChat,
  onOpenSettings,
  onGoHome,
  isOpen,
  setIsOpen,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredChats = chats.filter(chat => 
    chat.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <div 
        className={clsx(
          "fixed inset-0 bg-black/60 backdrop-blur-sm z-[45] transition-opacity duration-300 md:hidden",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={() => setIsOpen(false)}
      />

      <div className={clsx(
        "fixed inset-y-0 left-0 z-50 flex flex-col bg-white dark:bg-[#0a0a0a] border-r border-slate-200 dark:border-white/5 transition-transform duration-300 w-72 h-full",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={onGoHome}>
            <Zap size={20} className="text-blue-600 fill-blue-600" />
            <h1 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white uppercase">
              Abhiyan AI
            </h1>
          </div>
          <button 
            onClick={() => setIsOpen(false)}
            className="p-2 hover:bg-slate-100 dark:hover:bg-white/5 rounded-lg text-slate-500 dark:text-slate-400 md:hidden"
          >
            <X size={20} />
          </button>
        </div>

        <div className="px-4 pb-2 space-y-2">
          <button
            onClick={onNewChat}
            className="flex items-center justify-center gap-2 w-full p-3 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-black hover:opacity-90 transition-all font-bold text-sm shadow-xl shadow-black/5"
          >
            <Plus size={18} />
            <span>New Session</span>
          </button>

          <button
            onClick={onGoHome}
            className="flex items-center gap-3 w-full p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 text-slate-600 dark:text-white/40 transition-colors text-xs font-bold uppercase tracking-widest"
          >
            <Home size={16} />
            <span>Home Page</span>
          </button>

          <div className="relative pt-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
            <input 
              type="text"
              placeholder="Search history..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-100 dark:bg-white/5 border border-transparent rounded-xl text-xs focus:outline-none text-slate-900 dark:text-slate-200 transition-all"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-2 space-y-1 py-4">
          {filteredChats.length > 0 && (
            <p className="px-4 py-2 text-[10px] font-bold text-slate-400 dark:text-white/20 uppercase tracking-[0.2em]">
              Recent Activity
            </p>
          )}
          {filteredChats.map((chat) => (
            <div
              key={chat.id}
              className={clsx(
                "group relative flex items-center gap-3 px-3 py-3 rounded-xl cursor-pointer transition-all",
                activeChatId === chat.id 
                  ? "bg-slate-100 dark:bg-white/10 text-slate-900 dark:text-white" 
                  : "text-slate-500 dark:text-white/40 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white"
              )}
              onClick={() => onSelectChat(chat.id)}
            >
              <MessageSquare size={16} className={activeChatId === chat.id ? "text-blue-500" : "opacity-40"} />
              <span className="flex-1 truncate text-[13px] font-medium">
                {chat.title}
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteChat(chat.id);
                }}
                className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-red-500 transition-all"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>

        <div className="p-4 border-t border-slate-100 dark:border-white/5">
          <button 
            onClick={onOpenSettings}
            className="flex items-center gap-3 w-full p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 text-slate-600 dark:text-white/60 transition-colors"
          >
            <SettingsIcon size={18} />
            <span className="text-sm font-bold uppercase tracking-widest text-[11px]">Preferences</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
