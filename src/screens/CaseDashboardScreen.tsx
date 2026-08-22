import { FolderPlus, Search, Filter, MoreVertical, BrainCircuit, Activity, Clock, FileText, ShieldAlert, Briefcase, FileClock, CalendarRange, X } from 'lucide-react';
import { CaseData, CaseCategory } from '../types';
import { useState } from 'react';
import { D3CircularProgress } from '../components/D3CircularProgress';

interface CaseDashboardScreenProps {
  cases: CaseData[];
  setCases: React.Dispatch<React.SetStateAction<CaseData[]>>;
  onSelectCase: (caseId: string) => void;
  onOpenAdmin: () => void;
}

export function CaseDashboardScreen({ cases, setCases, onSelectCase, onOpenAdmin }: CaseDashboardScreenProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('Tất cả');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCaseCode, setNewCaseCode] = useState('');
  const [newCaseClient, setNewCaseClient] = useState('');
  const [newCaseCategory, setNewCaseCategory] = useState<CaseCategory>('Dân sự');

  const filteredCases = cases.filter(c => 
    (c.code.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.clientName.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (filterCategory === 'Tất cả' || c.category === filterCategory)
  );

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Hoàn tất trích xuất': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
      case 'Đang chờ OCR': return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
      case 'Đang tổng hợp logic': return 'text-blue-400 bg-blue-600/10 border-blue-500/20';
      case 'Đã khởi tạo': return 'text-slate-400 bg-slate-100 border-slate-300';
      default: return 'text-slate-400 bg-slate-100 border-slate-300';
    }
  };

  const getCategoryColor = (category: string) => {
    switch(category) {
      case 'Đất đai': return 'text-emerald-500';
      case 'Dân sự': return 'text-blue-500';
      case 'Hình sự': return 'text-red-500';
      case 'Hành chính': return 'text-purple-500';
      default: return 'text-slate-500';
    }
  };

  const handleCreateCase = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCaseCode || !newCaseClient) return;

    const newId = `case-${Date.now()}`;
    const newCase: CaseData = {
      id: newId,
      code: newCaseCode,
      clientName: newCaseClient,
      category: newCaseCategory,
      aiStatus: 'Đã khởi tạo',
      lastUpdated: new Date().toLocaleDateString('vi-VN'),
      progress: 0,
      isActive: true,
      filingStatus: 'Pending',
      courtDate: null
    };

    setCases([newCase, ...cases]);
    setIsModalOpen(false);
    setNewCaseCode('');
    setNewCaseClient('');
    setNewCaseCategory('Dân sự');
  };

  const totalActive = cases.filter(c => c.isActive).length;
  const pendingFilings = cases.filter(c => c.filingStatus === 'Pending').length;
  const upcomingCourtDates = cases.filter(c => c.courtDate).length;

  return (
    <div className="h-screen flex flex-col bg-slate-50 p-6 overflow-hidden">
      <header className="flex justify-between items-center mb-8 shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Case Dashboard</h1>
          <p className="text-sm text-slate-400 mt-1">Quản lý tổng quan các vụ án đang thụ lý</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={onOpenAdmin}
            className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-900 px-4 py-2.5 rounded-lg font-bold text-sm transition border border-slate-300 cursor-pointer"
          >
            <ShieldAlert size={18} className="text-amber-500" />
            QUẢN TRỊ
          </button>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-lg font-bold text-sm transition shadow-lg shadow-blue-600/20 cursor-pointer"
          >
            <FolderPlus size={18} />
            TẠO HỒ SƠ VỤ ÁN MỚI
          </button>
        </div>
      </header>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-6 mb-8 shrink-0">
        <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-lg flex items-center justify-between transition-colors hover:border-slate-300">
          <div>
            <p className="text-[11px] text-slate-500 font-bold uppercase tracking-widest mb-1">Total Active Cases</p>
            <p className="text-3xl font-bold text-slate-900">{totalActive}</p>
          </div>
          <div className="w-12 h-12 bg-blue-600/10 rounded-full flex items-center justify-center text-blue-500 shadow-inner">
            <Briefcase size={24} />
          </div>
        </div>
        <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-lg flex items-center justify-between transition-colors hover:border-slate-300">
          <div>
            <p className="text-[11px] text-slate-500 font-bold uppercase tracking-widest mb-1">Pending Filings</p>
            <p className="text-3xl font-bold text-amber-500">{pendingFilings}</p>
          </div>
          <div className="w-12 h-12 bg-amber-500/10 rounded-full flex items-center justify-center text-amber-500 shadow-inner">
            <FileClock size={24} />
          </div>
        </div>
        <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-lg flex items-center justify-between transition-colors hover:border-slate-300">
          <div>
            <p className="text-[11px] text-slate-500 font-bold uppercase tracking-widest mb-1">Upcoming Court Dates</p>
            <p className="text-3xl font-bold text-emerald-500">{upcomingCourtDates}</p>
          </div>
          <div className="w-12 h-12 bg-emerald-500/10 rounded-full flex items-center justify-center text-emerald-500 shadow-inner">
            <CalendarRange size={24} />
          </div>
        </div>
      </div>

      <div className="flex-1 bg-white border border-slate-200 rounded-xl shadow-lg flex flex-col overflow-hidden">
        {/* Table Toolbar */}
        <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-white/80">
          <div className="relative w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
            <input 
              type="text" 
              placeholder="Tìm kiếm theo mã vụ án, khách hàng..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg py-2 pl-9 pr-4 text-sm text-slate-900 focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-slate-100 border border-slate-300 rounded-lg px-3 py-2 transition-colors focus-within:border-blue-500">
              <Filter size={16} className="text-slate-400" />
              <select 
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="bg-transparent text-sm text-slate-900 focus:outline-none cursor-pointer appearance-none outline-none pr-4"
              >
                <option value="Tất cả" className="bg-slate-100 text-slate-900">Tất cả Loại hình</option>
                <option value="Dân sự" className="bg-slate-100 text-slate-900">Dân sự</option>
                <option value="Hình sự" className="bg-slate-100 text-slate-900">Hình sự</option>
                <option value="Hành chính" className="bg-slate-100 text-slate-900">Hành chính</option>
                <option value="Đất đai" className="bg-slate-100 text-slate-900">Đất đai</option>
                <option value="Thương mại" className="bg-slate-100 text-slate-900">Thương mại</option>
              </select>
            </div>
          </div>
        </div>

        {/* Data Table */}
        <div className="flex-1 overflow-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 text-slate-400 text-[10px] uppercase tracking-widest border-b border-slate-200 sticky top-0 z-10">
                <th className="p-4 font-bold">Mã vụ án</th>
                <th className="p-4 font-bold">Tên khách hàng</th>
                <th className="p-4 font-bold">Loại hình</th>
                <th className="p-4 font-bold">Trạng thái xử lý AI</th>
                <th className="p-4 font-bold text-center">Tiến độ</th>
                <th className="p-4 font-bold">Ngày cập nhật cuối</th>
                <th className="p-4 font-bold text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredCases.map((c) => (
                <tr 
                  key={c.id} 
                  onClick={() => onSelectCase(c.id)}
                  className="hover:bg-slate-100/30 transition-colors cursor-pointer group"
                >
                  <td className="p-4">
                    <span className="font-bold text-blue-400 group-hover:text-blue-300 transition-colors">{c.code}</span>
                  </td>
                  <td className="p-4">
                    <span className="text-sm text-slate-900 font-medium">{c.clientName}</span>
                  </td>
                  <td className="p-4">
                    <span className={`text-xs font-bold ${getCategoryColor(c.category)}`}>
                      {c.category}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`text-[10px] px-2.5 py-1 rounded border font-bold uppercase tracking-wider ${getStatusColor(c.aiStatus)}`}>
                      {c.aiStatus}
                    </span>
                  </td>
                  <td className="p-4 flex justify-center">
                    <D3CircularProgress progress={c.progress} size={36} strokeWidth={3.5} color={c.progress === 100 ? '#10b981' : '#3b82f6'} />
                  </td>
                  <td className="p-4 text-xs text-slate-400">
                    {c.lastUpdated}
                  </td>
                  <td className="p-4 text-right">
                    <button className="text-slate-500 hover:text-slate-700 p-1 rounded hover:bg-slate-200 transition">
                      <MoreVertical size={16} />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredCases.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-500 text-sm">
                    Không tìm thấy kết quả nào.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      {/* Create Case Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white border border-slate-300 rounded-xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
              <h2 className="text-lg font-bold text-slate-900 tracking-wide flex items-center gap-2">
                <FolderPlus className="text-blue-500" size={20} />
                Tạo Hồ sơ Mới
              </h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-900 transition p-1"
              >
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleCreateCase} className="p-6 flex flex-col gap-5">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Mã vụ án</label>
                <input 
                  type="text" 
                  required
                  value={newCaseCode}
                  onChange={e => setNewCaseCode(e.target.value)}
                  placeholder="Vd: 2026-TC01"
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 transition"
                />
              </div>
              
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Tên Khách Hàng</label>
                <input 
                  type="text" 
                  required
                  value={newCaseClient}
                  onChange={e => setNewCaseClient(e.target.value)}
                  placeholder="Vd: Nguyễn Văn A"
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Loại hình</label>
                <select 
                  value={newCaseCategory}
                  onChange={e => setNewCaseCategory(e.target.value as CaseCategory)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-3 text-sm text-slate-900 focus:outline-none focus:border-blue-500 transition appearance-none"
                >
                  <option value="Dân sự">Dân sự</option>
                  <option value="Hình sự">Hình sự</option>
                  <option value="Đất đai">Đất đai</option>
                  <option value="Hành chính">Hành chính</option>
                  <option value="Thương mại">Thương mại</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 mt-4">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-lg text-sm font-bold text-slate-700 hover:bg-slate-100 transition"
                >
                  HỦY
                </button>
                <button 
                  type="submit"
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-bold transition shadow-lg shadow-blue-600/20"
                >
                  TẠO HỒ SƠ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
