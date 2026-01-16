
import React from 'react';
import { X, Moon, Sun, Download, Trash2, AlertTriangle } from 'lucide-react';
import { clsx } from '../lib/utils';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#0a0a0a] w-full max-w-md rounded-[2rem] shadow-2xl border border-slate-200 dark:border-white/5 overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-white/5 bg-slate-50/50 dark:bg-white/[0.02]">
          <h3 className="font-extrabold uppercase tracking-widest text-xs text-slate-900 dark:text-slate-100">{title}</h3>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 dark:hover:bg-white/5 rounded-xl text-slate-500 transition-colors">
            <X size={20} />
          </button>
        </div>
        <div className="p-8">
          {children}
        </div>
      </div>
    </div>
  );
};

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  onExportAll: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen, onClose, theme, onToggleTheme, onExportAll
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Preferences">
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <label className="text-sm font-bold text-slate-900 dark:text-slate-100">Display Theme</label>
            <p className="text-[11px] text-slate-500 dark:text-white/40 font-medium">Switch between light and dark modes</p>
          </div>
          <button 
            onClick={onToggleTheme}
            className="p-3 rounded-2xl bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-white border border-slate-200 dark:border-white/10 hover:border-blue-500 transition-all flex items-center gap-3"
          >
            {theme === 'dark' ? <Moon size={18} /> : <Sun size={18} />}
            <span className="text-[10px] font-black uppercase tracking-widest">{theme}</span>
          </button>
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <label className="text-sm font-bold text-slate-900 dark:text-slate-100">Data Portability</label>
            <p className="text-[11px] text-slate-500 dark:text-white/40 font-medium">Export session history as .txt</p>
          </div>
          <button 
            onClick={onExportAll}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-blue-600 text-white hover:bg-blue-500 transition-all shadow-lg shadow-blue-500/20 font-black text-[10px] uppercase tracking-widest"
          >
            <Download size={16} />
            <span>Export</span>
          </button>
        </div>

        <div className="pt-6 border-t border-slate-100 dark:border-white/5">
           <p className="text-[9px] text-slate-400 dark:text-white/20 uppercase tracking-[0.3em] font-black mb-2">Neural Architecture</p>
           <p className="text-[11px] text-slate-500 dark:text-white/60 font-mono">Abhiyan Synapse Engine v1.5.0-L</p>
           <p className="text-[10px] text-blue-500 font-bold mt-1 uppercase tracking-widest">Latency Optimization: Enabled</p>
        </div>
      </div>
    </Modal>
  );
};

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  chatTitle?: string;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen, onClose, onConfirm, chatTitle
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Session Termination">
      <div className="space-y-8">
        <div className="flex items-start gap-4 text-amber-500 bg-amber-500/5 p-5 rounded-2xl border border-amber-500/10">
          <AlertTriangle size={24} strokeWidth={2.5} className="mt-0.5 flex-shrink-0" />
          <p className="text-xs font-semibold leading-relaxed">This operation will permanently purge the selected neural session from your account history. This action is irreversible.</p>
        </div>
        
        {chatTitle && (
          <div className="p-4 bg-slate-100 dark:bg-white/5 rounded-2xl border border-slate-200 dark:border-white/10">
            <p className="text-[11px] font-mono text-slate-500 dark:text-white/40 truncate italic">"{chatTitle}"</p>
          </div>
        )}

        <div className="flex gap-4">
          <button 
            onClick={onClose}
            className="flex-1 p-4 rounded-2xl border border-slate-200 dark:border-white/10 text-slate-600 dark:text-white/40 hover:bg-slate-50 dark:hover:bg-white/5 font-black text-[10px] uppercase tracking-widest transition-all"
          >
            Abort
          </button>
          <button 
            onClick={onConfirm}
            className="flex-1 p-4 rounded-2xl bg-red-600 text-white hover:bg-red-500 font-black text-[10px] uppercase tracking-widest transition-all shadow-lg shadow-red-600/20 flex items-center justify-center gap-3"
          >
            <Trash2 size={16} />
            Terminate
          </button>
        </div>
      </div>
    </Modal>
  );
};
