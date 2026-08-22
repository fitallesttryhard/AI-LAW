import { Database, FileText, Gavel, ShieldAlert, ArrowLeft } from 'lucide-react';
import { Screen } from '../types';

interface SidebarProps {
  currentScreen: Screen;
  onNavigate: (screen: Screen) => void;
  onBackToDashboard: () => void;
}

export function Sidebar({ currentScreen, onNavigate, onBackToDashboard }: SidebarProps) {
  const navItems = [
    { id: 'input', label: 'Tiếp nhận & Hiệu chỉnh', icon: Database },
    { id: 'logic', label: 'Đối chiếu Xung đột', icon: Gavel },
    { id: 'editor', label: 'Trình soạn thảo AI', icon: FileText },
  ] as const;

  return (
    <div className="w-64 bg-white shadow-lg border-r border-slate-200 text-slate-900 flex flex-col shrink-0 z-10">
      <div className="p-6 pb-2 border-b border-slate-200/50">
        <button 
          onClick={onBackToDashboard}
          className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-slate-400 hover:text-slate-900 transition-colors mb-4 group"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
          Quay lại Danh sách
        </button>
        <div className="flex items-center gap-3">

          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white text-xl shadow-lg shadow-blue-900/20">AT</div>
          <div>
            <h1 className="text-lg font-semibold tracking-tight leading-none text-slate-900">ANH THẢO</h1>
            <p className="text-[10px] text-slate-400 uppercase tracking-widest mt-1 italic">AI Pháp Lý Nội Bộ</p>
          </div>
        </div>
      </div>
      <nav className="flex-1 px-4 space-y-2 mt-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentScreen === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id as Screen)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors cursor-pointer border ${
                isActive ? 'bg-blue-600/20 text-blue-400 border-blue-600/30 shadow-sm' : 'border-transparent hover:bg-slate-100 hover:text-slate-900 text-slate-400'
              }`}
            >
              <Icon size={18} />
              <span className="font-medium text-[11px] uppercase tracking-wider">{item.label}</span>
            </button>
          );
        })}
      </nav>
      <div className="p-4 border-t border-slate-200">
        <div className="flex items-center space-x-3 px-4 py-2">
          <div className="w-8 h-8 rounded-full bg-slate-200 border border-slate-300 flex items-center justify-center">
            <span className="text-sm font-bold text-slate-700">LS</span>
          </div>
          <div className="text-left">
            <p className="text-xs font-medium text-slate-700">Luật sư Admin</p>
            <p className="text-[10px] text-slate-500">Workspace 1</p>
          </div>
        </div>
      </div>
    </div>
  );
}
