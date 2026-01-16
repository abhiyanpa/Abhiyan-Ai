
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Chat, Message, Role } from './types';
import Sidebar from './components/Sidebar';
import MessageBubble from './components/MessageBubble';
import ChatInput from './components/ChatInput';
import Login from './components/Login';
import LandingPage from './components/LandingPage';
import { SettingsModal, DeleteConfirmModal } from './components/Modals';
import { sendMessage } from './services/geminiService';
import { auth, signOut, onAuthStateChanged } from './services/firebase';
import { 
  fetchUserChats, 
  saveChat, 
  updateChatMessages, 
  deleteChatFromDb,
  updateChatTitle 
} from './services/firestore';
import { generateId, clsx } from './lib/utils';
import { Menu, Zap, Plus, AlertCircle, X, LogOut, RefreshCcw, ExternalLink } from 'lucide-react';

const App: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [view, setView] = useState<'landing' | 'app'>('landing');

  const [isLoading, setIsLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [chatToDelete, setChatToDelete] = useState<string | null>(null);
  const [errorToast, setErrorToast] = useState<string | null>(null);
  const [isPermissionError, setIsPermissionError] = useState(false);
  
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('cruze_theme');
      return (saved as 'light' | 'dark') || 'dark';
    }
    return 'dark';
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const loadData = useCallback(async (userId: string) => {
    try {
      setIsPermissionError(false);
      const userChats = await fetchUserChats(userId);
      setChats(userChats);
      if (userChats.length > 0 && !activeChatId) {
        setActiveChatId(userChats[0].id);
      }
    } catch (err: any) {
      console.error("Error fetching chats:", err);
      const isPerm = err.message?.toLowerCase().includes('permission') || err.code === 'permission-denied';
      if (isPerm) {
        setIsPermissionError(true);
        showError("Permission Denied: Check Firestore Security Rules.");
      } else {
        showError("Failed to sync with cloud. Check your connection.");
      }
    }
  }, [activeChatId]);

  // Auth State Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        setView('app'); // Redirect to app if logged in
        await loadData(currentUser.uid);
      } else {
        setChats([]);
        setActiveChatId(null);
        setView('landing');
      }
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, [loadData]);

  useEffect(() => {
    localStorage.setItem('cruze_theme', theme);
    const html = document.documentElement;
    if (theme === 'light') {
      html.classList.add('light');
      html.classList.remove('dark');
    } else {
      html.classList.add('dark');
      html.classList.remove('light');
    }
  }, [theme]);

  // Mobile sidebar handling
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setSidebarOpen(view === 'app');
      } else {
        setSidebarOpen(false);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [view]);

  // Scroll handling
  const scrollToBottom = useCallback((instant = false) => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ 
        behavior: instant ? 'auto' : 'smooth',
        block: 'end'
      });
    }
  }, []);

  // Scroll on new chat/message count change
  useEffect(() => {
    const timer = setTimeout(() => scrollToBottom(), 100);
    return () => clearTimeout(timer);
  }, [activeChatId, chats.find(c => c.id === activeChatId)?.messages.length, scrollToBottom]);

  // Auto-scroll during AI generation (streaming)
  useEffect(() => {
    if (isLoading) {
      // Faster interval for smoother scrolling during generation
      const interval = setInterval(() => scrollToBottom(), 100);
      return () => clearInterval(interval);
    }
  }, [isLoading, scrollToBottom]);

  const activeChat = chats.find(c => c.id === activeChatId) || null;

  const handleNewChat = async () => {
    if (!user) {
      setView('landing');
      return;
    }
    const newChat: Chat = {
      id: generateId(),
      title: 'New Session',
      messages: [],
      createdAt: Date.now(),
    };
    
    setChats([newChat, ...chats]);
    setActiveChatId(newChat.id);
    setView('app');
    if (window.innerWidth < 768) setSidebarOpen(false);

    try {
      await saveChat(user.uid, newChat);
    } catch (err: any) {
      console.error("Error saving new chat:", err);
      showError("Cloud sync failed.");
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setView('landing');
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  const confirmDeleteChat = (id: string) => {
    setChatToDelete(id);
  };

  const executeDeleteChat = async () => {
    if (!chatToDelete || !user) return;
    
    const updatedChats = chats.filter(c => c.id !== chatToDelete);
    setChats(updatedChats);
    if (activeChatId === chatToDelete) {
      setActiveChatId(updatedChats.length > 0 ? updatedChats[0].id : null);
    }
    setChatToDelete(null);

    try {
      await deleteChatFromDb(user.uid, chatToDelete);
    } catch (err) {
      console.error("Error deleting chat from DB:", err);
      showError("Failed to delete chat.");
    }
  };

  const showError = (msg: string) => {
    setErrorToast(msg);
    setTimeout(() => setErrorToast(null), 10000);
  };

  const handleSendMessage = async (content: string) => {
    if (!user) return;
    let currentChatId = activeChatId;
    
    if (!currentChatId) {
      currentChatId = generateId();
      const newChat: Chat = {
        id: currentChatId,
        title: content.slice(0, 40) + (content.length > 40 ? '...' : ''),
        messages: [],
        createdAt: Date.now(),
      };
      setChats([newChat, ...chats]);
      setActiveChatId(currentChatId);
      await saveChat(user.uid, newChat);
    }

    const userMessage: Message = { 
      id: generateId(), 
      role: Role.USER, 
      content, 
      timestamp: Date.now() 
    };

    const currentMessages = [...(chats.find(c => c.id === currentChatId)?.messages || []), userMessage];

    setChats(prev => prev.map(c => 
      c.id === currentChatId ? { ...c, messages: currentMessages } : c
    ));
    
    // Initial scroll after user sends message
    setTimeout(() => scrollToBottom(), 50);
    
    processAIResponse(currentChatId, currentMessages);
  };

  const processAIResponse = async (chatId: string, messageHistory: Message[]) => {
    if (!user) return;
    setIsLoading(true);
    const aiMessageId = generateId();
    
    setChats(prev => prev.map(c => c.id === chatId ? {
      ...c,
      messages: [...c.messages, { id: aiMessageId, role: Role.MODEL, content: '', timestamp: Date.now() }]
    } : c));

    try {
      let fullResponse = "";
      await sendMessage(messageHistory, (chunk) => {
        fullResponse += chunk;
        setChats(prev => prev.map(c => c.id === chatId ? {
          ...c,
          messages: c.messages.map(m => m.id === aiMessageId ? { ...m, content: fullResponse } : m)
        } : c));
      });

      const updatedChat = chats.find(c => c.id === chatId);
      const isInitialSession = updatedChat?.title === 'New Session' || updatedChat?.title === 'New Conversation';
      let newTitle = updatedChat?.title || 'New Session';

      if (isInitialSession) {
        newTitle = messageHistory[0].content.slice(0, 40) + (messageHistory[0].content.length > 40 ? '...' : '');
        await updateChatTitle(user.uid, chatId, newTitle);
      }

      const finalMessages = [...messageHistory, { id: aiMessageId, role: Role.MODEL, content: fullResponse, timestamp: Date.now() }];
      
      setChats(prev => prev.map(c => c.id === chatId ? {
        ...c,
        title: newTitle,
        messages: finalMessages
      } : c));

      await updateChatMessages(user.uid, chatId, finalMessages);

    } catch (error: any) {
      console.error(error);
      const isPerm = error.message?.toLowerCase().includes('permission') || error.code === 'permission-denied';
      if (isPerm) setIsPermissionError(true);
      
      showError(isPerm ? "Permission Denied: Update Firestore Rules." : "Abhiyan encountered an error.");
      
      const errorContent = isPerm 
        ? "⚠️ **Security Error**: Access denied. Please ensure Firestore Security Rules are updated in your Firebase Console."
        : "⚠️ **System Error**: Request failed. Please try again in a moment.";
        
      const errorMessages = [...messageHistory, { id: aiMessageId, role: Role.MODEL, content: errorContent, timestamp: Date.now() }];
      
      setChats(prev => prev.map(c => c.id === chatId ? {
        ...c,
        messages: errorMessages
      } : c));
    } finally {
      setIsLoading(false);
      // Ensure final scroll to bottom after response is complete
      setTimeout(() => scrollToBottom(), 100);
    }
  };

  const exportAllChats = () => {
    if (chats.length === 0) return;
    const content = chats.map(chat => {
      const messages = chat.messages.map(m => 
        `[${new Date(m.timestamp).toLocaleString()}] ${m.role.toUpperCase()}: ${m.content}`
      ).join('\n');
      return `--- SESSION: ${chat.title} ---\nCreated: ${new Date(chat.createdAt).toLocaleString()}\n\n${messages}\n\n`;
    }).join('\n' + '='.repeat(50) + '\n\n');
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `abhiyan-ai-export-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (authLoading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-[#050505]">
        <div className="flex flex-col items-center gap-4">
          <Zap size={40} className="text-blue-600 animate-pulse fill-blue-600" />
          <div className="w-8 h-8 border-2 border-blue-600/20 border-t-blue-600 rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  // View: Landing Page
  if (view === 'landing') {
    return <LandingPage 
      isLoggedIn={!!user} 
      onStartChat={() => user ? setView('app') : setView('app')} // Login will catch if needed
    />;
  }

  // View: Auth/Login (if app requested but no user)
  if (!user) {
    return <Login />;
  }

  // View: Main Chat Application
  return (
    <div className="flex h-full bg-white dark:bg-[#050505] text-slate-900 dark:text-slate-200 overflow-hidden transition-colors duration-500">
      <Sidebar
        chats={chats}
        activeChatId={activeChatId}
        onSelectChat={(id) => {
          setActiveChatId(id);
          if (window.innerWidth < 768) setSidebarOpen(false);
        }}
        onNewChat={handleNewChat}
        onDeleteChat={confirmDeleteChat}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onGoHome={() => setView('landing')}
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
      />

      <main className={clsx(
        "flex-1 flex flex-col transition-all duration-300 relative h-full",
        sidebarOpen && "md:ml-72"
      )}>
        {/* Error Notification */}
        {errorToast && (
          <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] animate-in slide-in-from-top-4 duration-300 w-full max-w-sm px-4">
            <div className={clsx(
              "text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border backdrop-blur-xl",
              isPermissionError ? "bg-amber-600 border-amber-400" : "bg-red-500 border-red-400"
            )}>
              <AlertCircle size={20} className="flex-shrink-0" />
              <div className="flex flex-col flex-1">
                <span className="text-sm font-semibold leading-snug">{errorToast}</span>
                {isPermissionError && (
                  <div className="flex items-center gap-3 mt-1.5">
                    <button onClick={() => loadData(user.uid)} className="text-[10px] font-bold uppercase tracking-widest flex items-center gap-1 hover:underline">
                      <RefreshCcw size={10} /> Sync
                    </button>
                    <a href="https://console.firebase.google.com/" target="_blank" className="text-[10px] font-bold uppercase tracking-widest flex items-center gap-1 hover:underline text-white/90">
                      <ExternalLink size={10} /> Console
                    </a>
                  </div>
                )}
              </div>
              <button onClick={() => { setErrorToast(null); setIsPermissionError(false); }} className="p-1 hover:bg-white/20 rounded-lg transition-colors ml-auto">
                <X size={16} />
              </button>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="flex items-center justify-between p-4 md:p-6 border-b border-slate-100 dark:border-white/5 bg-white/60 dark:bg-[#050505]/60 backdrop-blur-xl z-30 sticky top-0">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(true)} className={clsx("p-2 -ml-2 text-slate-500 rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 transition-all", sidebarOpen && "md:hidden")}>
              <Menu size={20} />
            </button>
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => setView('landing')}>
              <Zap size={18} className="text-blue-500 fill-blue-500" />
              <span className="font-bold text-sm md:text-base tracking-tight hidden sm:inline">Abhiyan AI</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button onClick={handleLogout} className="p-2 md:px-4 md:py-2 bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-white/60 rounded-xl hover:bg-slate-200 dark:hover:bg-white/10 transition-all flex items-center gap-2" title="Logout">
              <LogOut size={18} />
              <span className="hidden md:inline text-xs font-bold uppercase tracking-wider">Logout</span>
            </button>
            <button onClick={handleNewChat} className="p-2 md:px-4 md:py-2 bg-blue-600 text-white rounded-xl md:rounded-2xl shadow-lg shadow-blue-500/20 hover:bg-blue-500 transition-all flex items-center gap-2">
              <Plus size={18} />
              <span className="hidden md:inline text-xs font-bold uppercase tracking-wider">New</span>
            </button>
          </div>
        </div>

        {/* Chat Content */}
        <div className="flex-1 overflow-y-auto px-4 md:px-6 pt-2 pb-32 scroll-smooth">
          {activeChat && activeChat.messages.length > 0 ? (
            <div className="max-w-3xl mx-auto space-y-2">
              {activeChat.messages.map(msg => (
                <MessageBubble key={msg.id} message={msg} />
              ))}
              {isLoading && activeChat.messages[activeChat.messages.length - 1]?.role === Role.USER && (
                <div className="flex items-center gap-2 text-slate-400 dark:text-white/20 py-4 px-1">
                   <Zap size={14} className="animate-pulse" />
                   <span className="text-[10px] font-bold uppercase tracking-widest animate-pulse">Abhiyan is processing...</span>
                </div>
              )}
              <div ref={messagesEndRef} className="h-2" />
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center max-w-xl mx-auto p-6 space-y-12">
              <div className="flex flex-col items-center gap-4">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-blue-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-blue-500/20">
                  <Zap size={32} className="text-white fill-white md:w-10 md:h-10" />
                </div>
                {user?.displayName && (
                  <p className="text-blue-500 font-bold uppercase tracking-widest text-[10px]">Welcome back, {user.displayName.split(' ')[0]}</p>
                )}
              </div>
              <div className="space-y-4">
                <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight dark:text-white leading-tight">
                  Neural Clarity. <br className="hidden md:block"/> Real-time Flow.
                </h1>
                <p className="text-slate-500 dark:text-white/40 text-sm md:text-base font-medium max-w-[280px] md:max-w-sm mx-auto">
                  Access advanced intelligence directly on ai.abhiyanpa.in. Faster, smarter, more precise.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="absolute bottom-0 w-full bg-gradient-to-t from-white dark:from-[#050505] via-white dark:via-[#050505]/95 to-transparent pt-12 z-20">
           <ChatInput onSendMessage={handleSendMessage} disabled={isLoading} />
        </div>
      </main>

      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
        theme={theme}
        onToggleTheme={() => setTheme(prev => prev === 'dark' ? 'light' : 'dark')}
        onExportAll={exportAllChats}
      />
      <DeleteConfirmModal 
        isOpen={chatToDelete !== null}
        onClose={() => setChatToDelete(null)}
        onConfirm={executeDeleteChat}
        chatTitle={chats.find(c => c.id === chatToDelete)?.title}
      />
    </div>
  );
};

export default App;
