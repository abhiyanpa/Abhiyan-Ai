
import React from 'react';
import { Zap, Shield, Cpu, ArrowRight, Github, Globe, CheckCircle2, Layers, BarChart3, Radio } from 'lucide-react';
import { clsx } from '../lib/utils';

interface LandingPageProps {
  onStartChat: () => void;
  isLoggedIn: boolean;
}

const LandingPage: React.FC<LandingPageProps> = ({ onStartChat, isLoggedIn }) => {
  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-blue-500/30 overflow-x-hidden scroll-smooth">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/5 glass">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap size={24} className="text-blue-500 fill-blue-500" />
            <span className="font-extrabold text-xl tracking-tighter">ABHIYAN AI</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-bold uppercase tracking-widest text-white/40">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#intelligence" className="hover:text-white transition-colors">Intelligence</a>
            <a href="#ecosystem" className="hover:text-white transition-colors">Ecosystem</a>
          </div>
          <button 
            onClick={onStartChat}
            className="px-5 py-2 bg-white text-black text-xs font-black uppercase tracking-widest rounded-full hover:scale-105 transition-all shadow-xl shadow-white/10"
          >
            {isLoggedIn ? 'Go to Dashboard' : 'Get Started'}
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative pt-40 pb-20 px-6 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-gradient-to-b from-blue-500/10 to-transparent blur-[120px] pointer-events-none" />
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-blue-500/20 bg-blue-500/5 text-blue-400 text-[10px] font-bold uppercase tracking-[0.2em] mb-8 animate-in-msg">
            <Radio size={12} className="animate-pulse" /> Neural Network Active
          </div>
          <h1 className="text-5xl md:text-8xl font-black tracking-tighter mb-8 leading-[0.9] animate-in-msg">
            INTELLIGENCE <br /> AT THE SPEED <br /> <span className="text-blue-500">OF THOUGHT.</span>
          </h1>
          <p className="max-w-2xl mx-auto text-white/40 text-lg md:text-xl font-medium mb-12 animate-in-msg" style={{ animationDelay: '0.1s' }}>
            Abhiyan AI is a high-performance neural engine designed for those who refuse to wait. Experience sub-second inference and professional-grade clarity.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in-msg" style={{ animationDelay: '0.2s' }}>
            <button 
              onClick={onStartChat}
              className="w-full sm:w-auto px-10 py-5 bg-blue-600 hover:bg-blue-500 rounded-2xl text-sm font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 transition-all shadow-2xl shadow-blue-500/40"
            >
              Start Chatting <ArrowRight size={18} />
            </button>
            <a 
              href="https://ai.abhiyanpa.in" 
              className="w-full sm:w-auto px-10 py-5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-sm font-black uppercase tracking-[0.2em] transition-all"
            >
              Explore Docs
            </a>
          </div>
        </div>

        {/* Preview Frame */}
        <div className="max-w-5xl mx-auto mt-24 relative animate-in-msg" style={{ animationDelay: '0.3s' }}>
           <div className="rounded-3xl border border-white/5 bg-[#0a0a0a] shadow-2xl overflow-hidden aspect-video relative group">
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/5 to-transparent" />
              <div className="p-4 border-b border-white/5 flex items-center gap-2">
                 <div className="w-2 h-2 rounded-full bg-red-500/50" />
                 <div className="w-2 h-2 rounded-full bg-amber-500/50" />
                 <div className="w-2 h-2 rounded-full bg-green-500/50" />
                 <div className="ml-4 px-3 py-1 bg-white/5 rounded text-[10px] text-white/20 font-mono">ai.abhiyanpa.in/terminal</div>
              </div>
              <div className="p-8 font-mono text-sm text-white/60 space-y-4">
                 <p className="text-blue-400">&gt; Initialize Abhiyan AI...</p>
                 <p>&gt; Connection established with Abhiyan Synapse 1.5</p>
                 <p>&gt; Latency: 12ms (Neural Optimized)</p>
                 <p className="text-white">&gt; How can I assist your workflow today?</p>
                 <div className="w-2 h-5 bg-blue-500 animate-pulse inline-block" />
              </div>
           </div>
        </div>
      </header>

      {/* Features Grid */}
      <section id="features" className="py-32 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { icon: <Zap className="text-blue-500" />, title: "Instantaneous", desc: "Our Synapse engine ensures responses begin streaming in milliseconds, keeping your creative flow uninterrupted." },
              { icon: <Shield className="text-green-500" />, title: "Secure Sync", desc: "End-to-end encrypted sessions synced with your account via ai.abhiyanpa.in, ensuring history remains private." },
              { icon: <Cpu className="text-purple-500" />, title: "Neural Logic", desc: "Optimized for technical reasoning, Abhiyan handles complex coding and data synthesis with extreme precision." }
            ].map((f, i) => (
              <div key={i} className="space-y-4 group">
                <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-blue-500/50 transition-all">
                  {f.icon}
                </div>
                <h3 className="text-xl font-bold">{f.title}</h3>
                <p className="text-white/40 leading-relaxed font-medium">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Intelligence Section */}
      <section id="intelligence" className="py-32 px-6 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
          <div className="space-y-8">
            <h2 className="text-4xl md:text-6xl font-black tracking-tight leading-none uppercase">
              DEEP NEURAL <br /> <span className="text-blue-500">INSIGHTS.</span>
            </h2>
            <p className="text-lg text-white/60 font-medium">
              Abhiyan utilizes a proprietary neural architecture designed for sub-second latency and high-fidelity output. We've eliminated the lag associated with traditional LLMs to provide a conversational experience that feels like local computation.
            </p>
            <ul className="space-y-4">
              {["High-fidelity Markdown rendering", "Code syntax highlighting", "Cross-device session sync", "Proprietary Synapse Engine"].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-sm font-bold uppercase tracking-widest text-white/40">
                  <CheckCircle2 size={16} className="text-blue-500" /> {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="aspect-square bg-white/5 rounded-3xl p-8 flex flex-col justify-end border border-white/10 group hover:border-blue-500/30 transition-all">
              <BarChart3 className="mb-4 text-blue-500" size={32} />
              <span className="text-4xl font-black text-blue-500">10k+</span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">Daily Tokens</span>
            </div>
            <div className="aspect-square bg-blue-600 rounded-3xl p-8 flex flex-col justify-end shadow-2xl shadow-blue-500/20">
              <Layers className="mb-4 text-white/80" size={32} />
              <span className="text-4xl font-black text-white">99.9%</span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-white/80">Uptime Rate</span>
            </div>
          </div>
        </div>
      </section>

      {/* Ecosystem Section */}
      <section id="ecosystem" className="py-32 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto text-center space-y-16">
          <div className="space-y-4">
             <h2 className="text-4xl md:text-6xl font-black tracking-tighter">THE ABHIYAN ECOSYSTEM</h2>
             <p className="text-white/40 max-w-2xl mx-auto font-medium">One account. Unified intelligence across all your professional interfaces.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
             {[
               { title: "Chat Dashboard", desc: "Main control center for high-speed neural chat.", status: "Online" },
               { title: "API Bridge", desc: "Integrate Abhiyan's Synapse engine into your apps.", status: "Early Access" },
               { title: "CLI Tool", desc: "Access Abhiyan intelligence from your terminal.", status: "Alpha" },
               { title: "Mobile Sync", desc: "Seamless history across iOS and Android.", status: "Beta" }
             ].map((item, i) => (
               <div key={i} className="p-8 rounded-3xl bg-white/[0.03] border border-white/5 text-left hover:border-blue-500/20 transition-all">
                  <div className="flex justify-between items-start mb-6">
                     <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                        <Zap size={20} className="text-blue-500" />
                     </div>
                     <span className="text-[8px] font-black uppercase tracking-[0.2em] px-2 py-1 bg-white/5 rounded-full text-white/40">{item.status}</span>
                  </div>
                  <h4 className="font-bold mb-2 uppercase tracking-tighter">{item.title}</h4>
                  <p className="text-xs text-white/40 leading-relaxed font-medium">{item.desc}</p>
               </div>
             ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
          <div className="flex items-center gap-3">
            <Zap size={24} className="text-blue-500 fill-blue-500" />
            <span className="font-extrabold text-xl tracking-tighter uppercase">Abhiyan AI</span>
          </div>
          <div className="flex items-center gap-8">
            <a href="https://github.com/abhiyanpa" target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-white transition-colors flex items-center gap-2 group">
              <Github size={20} />
              <span className="text-[10px] font-bold uppercase tracking-widest hidden group-hover:inline">GitHub</span>
            </a>
            <a href="https://abhiyanpa.in" target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-white transition-colors flex items-center gap-2 group">
              <Globe size={20} />
              <span className="text-[10px] font-bold uppercase tracking-widest hidden group-hover:inline">Portfolio</span>
            </a>
          </div>
          <p className="text-[10px] font-bold text-white/20 uppercase tracking-[0.3em] text-center md:text-right">
            © 2025 ABHIYAN PA. <br className="md:hidden"/> DESIGNED FOR THE FUTURE.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
