import { 
  Shield, 
  ShieldAlert, 
  WifiOff, 
  RefreshCw, 
  Upload, 
  Database, 
  Lock, 
  CheckCircle, 
  FileText, 
  ChevronRight,
  Key,
  Power,
  Fingerprint,
  Cpu,
  DollarSign,
  HardDrive,
  Code,
  Activity,
  AlertTriangle,
  EyeOff
} from 'lucide-react';
import { useState, useRef } from 'react';

export function AdminDashboardScreen() {
  // Sync State
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState('08:00 AM');
  const [autoSync, setAutoSync] = useState(true);
  
  // Upload State
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Kill Switch State
  const [killSwitchArmed, setKillSwitchArmed] = useState(false);
  const [systemLocked, setSystemLocked] = useState(false);

  // Task Priority State
  const [vipMode, setVipMode] = useState(false);

  const handleSync = async () => {
    if (isSyncing) return;
    setIsSyncing(true);
    
    try {
      const response = await fetch('/api/lgsp/sync', { method: 'POST' });
      const result = await response.json();
      
      if (result.success) {
        const now = new Date();
        setLastSyncTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }));
        // Optional: show success toast or console log with snippet
        console.log('Đồng bộ thành công:', result.data.snippet);
      } else {
        alert("Lỗi đồng bộ: " + result.message);
      }
    } catch (error) {
      console.error("Fetch error:", error);
      alert("Không thể kết nối đến máy chủ Node.js");
    } finally {
      setIsSyncing(false);
    }
  };

  const handleUploadClick = () => fileInputRef.current?.click();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setIsUploading(true);
      setUploadProgress(0);
      let prog = 0;
      const interval = setInterval(() => {
        prog += 15;
        if (prog >= 100) {
          prog = 100;
          clearInterval(interval);
          setTimeout(() => setIsUploading(false), 500);
        }
        setUploadProgress(prog);
      }, 300);
    }
  };

  const handleKillSwitch = () => {
    if (!killSwitchArmed) {
      setKillSwitchArmed(true);
      setTimeout(() => setKillSwitchArmed(false), 5000); // Disarm after 5s if not confirmed
    } else {
      setSystemLocked(true);
    }
  };

  if (systemLocked) {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-red-950 p-6">
        <AlertTriangle size={64} className="text-red-500 mb-6 animate-pulse" />
        <h1 className="text-3xl font-bold text-white tracking-widest mb-2">HỆ THỐNG ĐÃ BỊ KHÓA KHẨN CẤP</h1>
        <p className="text-red-300 text-sm mb-8">Kill-Switch đã được kích hoạt. Tất cả phiên làm việc đã bị hủy.</p>
        <button 
          onClick={() => { setSystemLocked(false); setKillSwitchArmed(false); }}
          className="px-6 py-3 bg-red-600 hover:bg-red-500 text-white font-bold uppercase tracking-wider rounded-lg shadow-lg border border-red-500"
        >
          Mở khóa hệ thống (Yêu cầu Master Key)
        </button>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-slate-50 p-4 gap-4 relative overflow-hidden">
      <header className="h-16 border border-slate-200 rounded-xl bg-white shadow-lg px-6 flex justify-between items-center shrink-0 z-10">
        <div>
          <h2 className="text-lg font-semibold tracking-tight text-slate-900 leading-none mb-1 flex items-center gap-2">
            <Shield className="text-blue-500" size={18} />
            <span className="uppercase tracking-wide">Hệ thống Quản trị Tối cao (Super Admin)</span>
          </h2>
          <p className="text-[10px] text-slate-400 uppercase tracking-widest italic mt-1">Quyền truy cập: Admin Tối Cao (Anh Thảo)</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/20 shadow-inner">
            <Fingerprint size={14} className="text-emerald-500" />
            <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">Sinh trắc học + YubiKey</span>
          </div>
          <button 
            onClick={handleKillSwitch}
            className={`flex items-center space-x-2 px-4 py-1.5 rounded-lg border shadow-lg transition-all font-bold text-[11px] uppercase tracking-wider ${
              killSwitchArmed 
                ? 'bg-red-600 border-red-500 text-white animate-pulse' 
                : 'bg-red-950/50 border-red-900/50 text-red-500 hover:bg-red-900/50'
            }`}
          >
            <Power size={14} />
            <span>{killSwitchArmed ? 'XÁC NHẬN KHÓA KHẨN CẤP!' : 'Emergency Kill-Switch'}</span>
          </button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto pr-2 pb-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl mx-auto">
          
          {/* Phân mục 1: DLP & Security */}
          <div className="bg-white shadow-xl border border-slate-200 rounded-xl overflow-hidden flex flex-col h-full transition-all hover:border-slate-300">
            <div className="p-4 border-b border-slate-200 bg-white/80 flex justify-between items-center">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-2">
                <ShieldAlert size={14} className="text-amber-500" />
                <span>PM1: BẢO MẬT & DLP</span>
              </h3>
            </div>
            <div className="p-5 flex-1 flex flex-col gap-5 bg-slate-50">
              <div className="bg-slate-100 p-4 rounded-lg border border-slate-300/50 shadow-sm">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Hàng rào IP (Whitelist)</span>
                  <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 text-[9px] font-bold rounded border border-emerald-500/20 uppercase tracking-widest">Active</span>
                </div>
                <div className="text-xs font-mono text-slate-700 bg-slate-50 p-2 rounded border border-slate-200">
                  103.153.22.1 (Văn phòng)<br/>
                  118.69.112.5 (Cá nhân)
                </div>
              </div>

              <div className="flex-1 bg-slate-100 p-4 rounded-lg border border-slate-300/50 shadow-sm flex flex-col">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Nhật ký Giám sát (Super Logs)</span>
                  <Activity size={12} className="text-blue-500" />
                </div>
                <div className="space-y-2 flex-1 text-[11px] font-medium font-mono text-slate-400">
                  <div className="flex gap-2"><span className="text-slate-500">[14:05]</span><span className="text-blue-400">Trợ lý A</span><span>mở hồ sơ 2024-TC01</span></div>
                  <div className="flex gap-2"><span className="text-slate-500">[14:12]</span><span className="text-amber-400">Trợ lý B</span><span>tải PDF Lời khai</span></div>
                  <div className="flex gap-2"><span className="text-slate-500">[14:20]</span><span className="text-emerald-400">Hệ thống</span><span>tự động lưu nháp</span></div>
                </div>
                <button className="w-full py-2 mt-4 bg-slate-100 text-slate-700 rounded text-[10px] font-bold uppercase tracking-widest hover:bg-slate-200 transition border border-slate-300 flex items-center justify-center gap-2">
                  XEM TOÀN BỘ LOGS
                </button>
              </div>
            </div>
          </div>

          {/* Phân mục 2: Master Encryption Key */}
          <div className="bg-white shadow-xl border border-slate-200 rounded-xl overflow-hidden flex flex-col h-full transition-all hover:border-slate-300">
            <div className="p-4 border-b border-slate-200 bg-white/80 flex justify-between items-center">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-2">
                <Key size={14} className="text-emerald-500" />
                <span>PM2: MASTER ENCRYPTION KEY</span>
              </h3>
            </div>
            <div className="p-5 flex-1 flex flex-col items-center justify-center text-center bg-slate-50">
              <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mb-6 border-2 border-slate-300 relative shadow-inner">
                <Key size={28} className="text-emerald-400" />
                <div className="absolute top-1 right-1 w-4 h-4 bg-emerald-500 rounded-full border-4 border-slate-900 animate-pulse"></div>
              </div>
              <h4 className="text-sm font-bold text-slate-700 mb-2 tracking-wide">MÃ HÓA ĐẦU CUỐI (E2EE)</h4>
              <p className="text-[10px] text-slate-500 mb-6 uppercase tracking-widest font-medium">Kho D1 được bảo vệ bằng Khóa Chủ</p>
              
              <div className="w-full bg-slate-100 p-4 rounded-lg border border-slate-300/50 mb-6 flex flex-col gap-4 shadow-sm text-left">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Mã Khóa (Hash ID):</span>
                  <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20 block truncate">
                    THAO-RSA4096-8F92A1B3...
                  </span>
                </div>
                <div className="border-t border-slate-300/50 pt-3">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">Quyền miễn trừ kỹ thuật:</span>
                  <div className="flex items-start gap-2">
                    <EyeOff size={14} className="text-slate-500 mt-0.5 shrink-0" />
                    <p className="text-[10px] text-slate-400 leading-relaxed">
                      Lập trình viên và Hacker KHÔNG THỂ giải mã nội dung vụ án nếu không có Khóa Chủ này. Dữ liệu trên Server chỉ là chuỗi ký tự vô nghĩa.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Phân mục 4: IP Shield */}
          <div className="bg-white shadow-xl border border-slate-200 rounded-xl overflow-hidden flex flex-col h-full transition-all hover:border-slate-300">
            <div className="p-4 border-b border-slate-200 bg-white/80 flex justify-between items-center">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-2">
                <Code size={14} className="text-purple-500" />
                <span>PM4: BẢO VỆ MÃ NGUỒN (IP SHIELD)</span>
              </h3>
            </div>
            <div className="p-5 flex-1 flex flex-col bg-slate-50 gap-5">
              <div className="bg-purple-600/10 border border-purple-500/30 p-4 rounded-lg flex flex-col items-center justify-center text-center">
                <CheckCircle size={24} className="text-purple-400 mb-2" />
                <h4 className="text-[11px] font-bold text-purple-300 uppercase tracking-wider">Mã Nguồn Toàn Vẹn</h4>
                <p className="text-[9px] text-purple-400/70 mt-1">Lần quét cuối: 5 phút trước</p>
              </div>

              <div className="flex-1 bg-slate-100 p-4 rounded-lg border border-slate-300/50 shadow-sm flex flex-col justify-center gap-4">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider w-2/3">Quét can thiệp trái phép (Integrity Check):</span>
                  <span className="px-2 py-1 bg-emerald-500/10 text-emerald-400 text-[9px] font-bold rounded border border-emerald-500/20 uppercase tracking-widest">Tự động</span>
                </div>
                <div className="flex items-center justify-between border-t border-slate-300/50 pt-4">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider w-2/3">Chữ ký số & Đóng dấu chìm (Watermarking):</span>
                  <div className="w-8 h-4 bg-purple-600 rounded-full relative shadow-inner">
                    <div className="absolute right-0.5 top-0.5 w-3 h-3 bg-white rounded-full shadow-sm"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Phân mục 3: Temporal Engine (Col-span-2) */}
          <div className="md:col-span-2 bg-white shadow-xl border border-slate-200 rounded-xl overflow-hidden flex flex-col h-full transition-all hover:border-slate-300">
            <div className="p-4 border-b border-slate-200 bg-white/80 flex justify-between items-center">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-2">
                <Database size={14} className="text-blue-400" />
                <span>PM3: ĐỘNG CƠ LUẬT THEO THỜI GIAN (TEMPORAL ENGINE) & TRI THỨC AI</span>
              </h3>
            </div>
            <div className="p-0 flex-1 grid grid-cols-2 divide-x divide-slate-200 bg-slate-50">
              
              {/* Online Sync */}
              <div className="p-6 flex flex-col">
                <h4 className="text-[11px] font-bold text-slate-700 uppercase tracking-widest mb-6 flex items-center gap-2">
                  <WifiOff size={14} className="text-blue-400" />
                  Đồng bộ API Trực tuyến (HCM LGSP)
                </h4>
                
                <div className="flex flex-col py-4 border-b border-slate-200/50 mb-6 gap-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase text-slate-400 tracking-wider">CSDL Quốc gia về VBQPPL:</span>
                    <div onClick={() => setAutoSync(!autoSync)} className={`w-10 h-5 rounded-full relative cursor-pointer shadow-inner transition-colors duration-300 ${autoSync ? 'bg-blue-600' : 'bg-slate-200'}`}>
                      <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-300 ${autoSync ? 'right-0.5 translate-x-0' : 'left-0.5 translate-x-0'}`}></div>
                    </div>
                  </div>
                  <span className="text-[9px] text-slate-500 font-mono">Nền tảng HCM LGSP (api.tphcm.gov.vn)</span>
                </div>

                <div className={`flex items-center justify-between space-x-3 p-4 rounded-lg border shadow-sm transition-all mb-6 ${isSyncing ? 'bg-blue-600/5 border-blue-500/50 text-blue-300' : 'bg-slate-100 border-slate-300 text-slate-400'}`}>
                  <div className="flex items-center gap-3">
                    {isSyncing ? <RefreshCw className="animate-spin text-blue-500" size={16} /> : <CheckCircle className="text-emerald-500" size={16} />}
                    <span className="text-[11px] font-medium">{isSyncing ? 'Đang cập nhật...' : `Lần cuối: ${lastSyncTime}`}</span>
                  </div>
                  <button onClick={handleSync} disabled={isSyncing} className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-bold rounded uppercase tracking-wider disabled:opacity-50">
                    ĐỒNG BỘ
                  </button>
                </div>
              </div>

              {/* Offline & Temporal Logic */}
              <div className="p-6 flex flex-col relative">
                <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept=".pdf,.doc,.docx" multiple />
                <h4 className="text-[11px] font-bold text-slate-700 uppercase tracking-widest mb-6 flex items-center gap-2">
                  <HardDrive size={14} className="text-amber-400" />
                  Kho Tri thức Tuyệt mật & Trọng số
                </h4>
                
                <div className="flex gap-4 mb-6">
                  <div className="flex-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">Trọng số ưu tiên (Logic):</label>
                    <select className="w-full bg-slate-50 border border-slate-300 text-slate-700 text-[11px] rounded p-2 outline-none">
                      <option>Ưu tiên Luật chuyên ngành trước</option>
                      <option>Ưu tiên Luật chung trước</option>
                    </select>
                  </div>
                  <div className="flex-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">Mốc chuyển tiếp hiệu lực:</label>
                    <select className="w-full bg-slate-50 border border-slate-300 text-slate-700 text-[11px] rounded p-2 outline-none">
                      <option>Chặt chẽ (Không áp dụng hồi tố)</option>
                      <option>Linh hoạt (Gợi ý hồi tố có lợi)</option>
                    </select>
                  </div>
                </div>

                <div 
                  onClick={!isUploading ? handleUploadClick : undefined}
                  className={`mt-auto bg-amber-500/5 border p-4 rounded-xl text-center border-dashed transition-all ${isUploading ? 'border-amber-500/50' : 'border-amber-500/30 hover:bg-amber-500/10 cursor-pointer'}`}
                >
                  {isUploading ? (
                    <div className="flex flex-col items-center justify-center gap-2">
                      <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-amber-500 h-full rounded-full transition-all duration-300" style={{ width: `${uploadProgress}%` }}></div>
                      </div>
                      <span className="text-[10px] font-bold text-amber-400">{uploadProgress}% ĐANG HUẤN LUYỆN...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-3">
                      <Upload size={18} className="text-amber-400" />
                      <div className="text-left">
                        <p className="text-[11px] font-bold text-amber-300 uppercase tracking-wide">Tải Án lệ / Chỉ thị Nội bộ</p>
                        <p className="text-[9px] text-amber-400/70 uppercase">Huấn luyện độc quyền offline</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

            </div>
          </div>

          {/* Phân mục 5: Resource Management */}
          <div className="bg-white shadow-xl border border-slate-200 rounded-xl overflow-hidden flex flex-col h-full transition-all hover:border-slate-300">
            <div className="p-4 border-b border-slate-200 bg-white/80 flex justify-between items-center">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-2">
                <Cpu size={14} className="text-rose-500" />
                <span>PM5: TÀI NGUYÊN & CÔNG SUẤT</span>
              </h3>
            </div>
            <div className="p-5 flex-1 flex flex-col bg-slate-50 gap-5">
              
              <div className={`p-4 rounded-lg border transition-all ${vipMode ? 'bg-rose-500/10 border-rose-500/30' : 'bg-slate-100 border-slate-300/50'}`}>
                <div className="flex justify-between items-center mb-2">
                  <span className={`text-[11px] font-bold uppercase tracking-wider ${vipMode ? 'text-rose-400' : 'text-slate-400'}`}>Chế độ Làm án Gấp (VIP):</span>
                  <div onClick={() => setVipMode(!vipMode)} className={`w-8 h-4 rounded-full relative cursor-pointer shadow-inner transition-colors duration-300 ${vipMode ? 'bg-rose-500' : 'bg-slate-200'}`}>
                    <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full shadow-sm transition-transform duration-300 ${vipMode ? 'right-0.5 translate-x-0' : 'left-0.5 translate-x-0'}`}></div>
                  </div>
                </div>
                <p className="text-[9px] text-slate-500 leading-relaxed">
                  Tạm dừng hàng đợi OCR của Trợ lý, dồn 100% công suất Chip AI cho tài khoản Master.
                </p>
              </div>

              <div className="flex-1 grid grid-cols-2 gap-4">
                <div className="bg-slate-100 p-3 rounded-lg border border-slate-300/50 flex flex-col justify-center items-center text-center">
                  <HardDrive size={16} className="text-slate-400 mb-2" />
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">Kho D1/D2</span>
                  <span className="text-sm font-bold text-slate-900">1.2 TB</span>
                </div>
                <div className="bg-slate-100 p-3 rounded-lg border border-slate-300/50 flex flex-col justify-center items-center text-center">
                  <DollarSign size={16} className="text-slate-400 mb-2" />
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">Chi phí API</span>
                  <span className="text-sm font-bold text-slate-900">$450.00</span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
