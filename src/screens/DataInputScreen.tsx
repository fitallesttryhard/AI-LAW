import { FileUp, FileText, AlertCircle, CheckCircle2, ChevronRight, UploadCloud, X, Edit3, Music, ChevronDown, Wand2, Crop, Search, Activity, BookOpen, Layers } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { CaseData, UploadedFile, FileType, FileStatus } from '../types';

interface DataInputScreenProps {
  selectedCaseId?: string | null;
  cases: CaseData[];
  onCaseChange?: (caseId: string) => void;
  caseFiles: Record<string, UploadedFile[]>;
  setCaseFiles: React.Dispatch<React.SetStateAction<Record<string, UploadedFile[]>>>;
}

export function DataInputScreen({ selectedCaseId, cases, onCaseChange, caseFiles, setCaseFiles }: DataInputScreenProps) {
  const currentCase = cases.find(c => c.id === selectedCaseId) || cases[0];
  const files = caseFiles[currentCase.id] || [];

  const [selectedFileId, setSelectedFileId] = useState<string>('1');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  // Set default selected file when case changes
  useEffect(() => {
    if (files.length > 0) {
      setSelectedFileId(files[0].id);
    } else {
      setSelectedFileId('');
    }
  }, [currentCase.id]);

  // Upload State
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Workflow State for Handwritten Document Processing
  const [currentStep, setCurrentStep] = useState<1|2|3|4>(3);

  // HITL State (Mocking for the selected file '1')
  const [isEditing, setIsEditing] = useState(false);
  const [correctedText, setCorrectedText] = useState("...để lại toàn bộ thửa đất số 45, tờ bản đồ 02 cho con trai là Nguyễn Văn Ánh...");
  const [tempText, setTempText] = useState(correctedText);

  const selectedFile = files.find(f => f.id === selectedFileId);
  const isSelectedFileCorrected = selectedFile?.status === 'verified' || selectedFile?.status === 'pushed_d1';

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const fileName = e.target.files[0].name;
      const fileType: FileType = fileName.endsWith('.jpg') || fileName.endsWith('.png') ? 'handwritten' : fileName.endsWith('.mp4') ? 'video' : fileName.endsWith('.mp3') ? 'audio' : 'pdf';
      
      const newFile: UploadedFile = {
        id: Math.random().toString(),
        name: fileName,
        type: fileType,
        status: 'preprocessing',
        progress: 0,
        content: null
      };

      // Read file content
      const reader = new FileReader();
      reader.onload = (event) => {
        const fileContent = event.target?.result as string;
        // In a real app, you would send this to the backend
        // For now, we simulate OCR/HTR output based on the file type
        let mockOCRText = '';
        if (fileType === 'handwritten') {
           mockOCRText = `[Nội dung nhận diện từ tệp ${fileName}]\n...để lại toàn bộ thủa đát sổ 4S, tờ bản đồ 02 cho con trai là Nguyễn Văn Ánh...`;
        } else if (fileType === 'pdf') {
           mockOCRText = `[Nội dung trích xuất từ PDF ${fileName}]\nCỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM\nĐộc lập - Tự do - Hạnh phúc\n\nĐƠN KHỞI KIỆN\n...`;
        }
        
        setCaseFiles(prev => {
          const caseFilesList = prev[currentCase.id] || [];
          return {
            ...prev,
            [currentCase.id]: caseFilesList.map(f => f.id === newFile.id ? { ...f, content: mockOCRText, fileDataUrl: fileContent } : f)
          };
        });
      };
      
      if (e.target.files[0]) {
         reader.readAsDataURL(e.target.files[0]);
      }
      
      setCaseFiles(prev => ({
        ...prev,
        [currentCase.id]: [newFile, ...(prev[currentCase.id] || [])]
      }));
      setSelectedFileId(newFile.id);
      setCurrentStep(1); // Start at Step 1

      // Simulate 4-step workflow progression
      let prog = 0;
      const interval = setInterval(() => {
        prog += 20;
        setCaseFiles(prev => {
          const caseFilesList = prev[currentCase.id] || [];
          return {
            ...prev,
            [currentCase.id]: caseFilesList.map(f => f.id === newFile.id ? { ...f, progress: prog } : f)
          };
        });
        
        if (prog === 40) {
           setCaseFiles(prev => {
              const caseFilesList = prev[currentCase.id] || [];
              return {
                ...prev,
                [currentCase.id]: caseFilesList.map(f => f.id === newFile.id ? { ...f, status: 'htr_processing' } : f)
              };
           });
           setCurrentStep(2);
        } else if (prog >= 100) {
          clearInterval(interval);
          setCaseFiles(prev => {
            const caseFilesList = prev[currentCase.id] || [];
            return {
              ...prev,
              [currentCase.id]: caseFilesList.map(f => f.id === newFile.id ? { ...f, status: 'needs_correction' } : f)
            };
          });
          setCurrentStep(3);
        }
      }, 800);
    }
  };

  const handleStartEdit = () => {
    setTempText(selectedFile?.content || correctedText);
    setIsEditing(true);
  };

  const handleSaveEdit = () => {
    if (selectedFile) {
        setCaseFiles(prev => {
          const caseFilesList = prev[currentCase.id] || [];
          return {
            ...prev,
            [currentCase.id]: caseFilesList.map(f => f.id === selectedFileId ? { ...f, content: tempText } : f)
          };
        });
    } else {
        setCorrectedText(tempText);
    }
    setIsEditing(false);
  };

  const handleAcceptHITL = () => {
    setCaseFiles(prev => {
      const caseFilesList = prev[currentCase.id] || [];
      return {
        ...prev,
        [currentCase.id]: caseFilesList.map(f => {
          if (f.id === selectedFileId) {
            let newContent = f.content;
            if (newContent && typeof newContent === 'string') {
               newContent = newContent.replace('thủa đát sổ 4S', 'thửa đất số 45');
            }
            return { ...f, status: 'verified', content: newContent };
          }
          return f;
        })
      };
    });
    setCurrentStep(4);
  };

  const handlePushToD1 = () => {
    setCaseFiles(prev => {
      const caseFilesList = prev[currentCase.id] || [];
      return {
        ...prev,
        [currentCase.id]: caseFilesList.map(f => f.status === 'verified' ? { ...f, status: 'pushed_d1' } : f)
      };
    });
    alert("Thành công: Đã đẩy các file đã chuẩn hóa ngữ nghĩa vào Kho D1 (Hồ sơ vụ án sạch). Sẵn sàng cho Temporal Law Engine.");
  };

  const getFileIcon = (type: FileType) => {
    switch (type) {
      case 'video': return '🎬';
      case 'audio': return '🎵';
      case 'handwritten': return '✍️';
      case 'pdf':
      default: return '📄';
    }
  };

  const renderProcessingStatus = () => {
    if (!selectedFile) return null;
    
    if (selectedFile.status === 'verified' || selectedFile.status === 'pushed_d1') {
      return (
        <div className="flex flex-col items-center justify-center h-full space-y-2 opacity-80 bg-emerald-500/10 rounded-lg p-4">
          <CheckCircle2 size={32} className="text-emerald-500" />
          <span className="text-xs text-emerald-400 uppercase tracking-widest text-center font-bold">Hoàn tất xử lý</span>
          <span className="text-[10px] text-emerald-500/70 text-center">Tệp đã được chuẩn hóa & mã hóa D1</span>
        </div>
      );
    }

    if (selectedFile.status === 'preprocessing' || selectedFile.status === 'htr_processing') {
       return (
        <div className="p-4 bg-blue-600/10 border border-blue-500/30 rounded-lg h-full flex flex-col justify-center">
          <div className="flex justify-between text-[11px] mb-3">
            <span className="font-bold text-blue-400 uppercase flex items-center gap-2">
              <Activity size={14} className="animate-spin" />
              {selectedFile.status === 'preprocessing' ? 'Bước 1: Tiền xử lý Ảnh (Denoising)' : 'Bước 2: Phân đoạn & HTR...'}
            </span>
            <span className="font-bold text-blue-400">{selectedFile.progress}%</span>
          </div>
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mb-2">
            <div className="bg-blue-500 h-full rounded-full transition-all duration-300" style={{ width: `${selectedFile.progress}%` }}></div>
          </div>
          <span className="text-[9px] text-blue-500/70 italic">
            {selectedFile.status === 'preprocessing' ? 'Đang lọc nhiễu ố vàng, xoay thẳng dòng (Deskewing)...' : 'Đang chạy mô hình Deep Learning nhận diện tiếng Việt...'}
          </span>
        </div>
      );
    }

    if (selectedFile.status === 'needs_correction') {
      return (
        <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg h-full flex flex-col justify-center">
          <div className="flex items-center gap-2 mb-2">
             <AlertCircle size={16} className="text-amber-500" />
             <span className="font-bold text-amber-500 text-xs uppercase">Bước 3: Cần hiệu chỉnh HITL</span>
          </div>
          <p className="text-[10px] text-amber-500/80 leading-relaxed">
            AI phát hiện một số từ viết tay mờ (Confidence &lt; 85%). Yêu cầu luật sư can thiệp đối chiếu mắt thường.
          </p>
        </div>
      )
    }
  };

  return (
    <div className="h-full flex flex-col bg-slate-50 p-4 gap-4">
      <header className="h-16 border border-slate-200 rounded-xl bg-white shadow-lg px-6 flex justify-between items-center shrink-0 z-10">
        <div>
          <h2 className="text-lg font-semibold tracking-tight text-slate-900 leading-none mb-1">Xử lý Dữ liệu Viết tay Pháp lý</h2>
          <div className="flex items-center gap-2 text-[10px] text-slate-400 uppercase tracking-widest font-bold">
            <span className={currentStep >= 1 ? 'text-blue-400' : ''}>1. Tiền Xử Lý</span> <ChevronRight size={10} />
            <span className={currentStep >= 2 ? 'text-blue-400' : ''}>2. HTR Deep Learning</span> <ChevronRight size={10} />
            <span className={currentStep >= 3 ? 'text-amber-400' : ''}>3. HITL Correction</span> <ChevronRight size={10} />
            <span className={currentStep >= 4 ? 'text-emerald-400' : ''}>4. Chuẩn hóa & NER</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-[11px] font-medium text-emerald-400 uppercase">Hệ thống sẵn sàng</span>
          </div>
        </div>
      </header>

      <div className="flex-1 flex gap-4 overflow-hidden">
        {/* Col 1: Directory & Processing Status */}
        <div className="w-1/4 flex flex-col gap-4 overflow-hidden">
          {/* Top Card: IDP Directory */}
          <div className="bg-white shadow-lg border border-slate-200 rounded-xl flex flex-col h-3/5 overflow-hidden">
            <div className="p-3 border-b border-slate-200 bg-white/80 flex justify-between items-center">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">IDP DIRECTORY</span>
              <div className="flex gap-2">
                <input type="file" ref={fileInputRef} onChange={handleFileSelected} className="hidden" accept=".pdf,.doc,.docx,.jpg,.png,.mp4,.mp3" />
                <button onClick={handleUploadClick} className="text-[10px] px-2 py-1 bg-blue-600 hover:bg-blue-500 rounded text-white flex items-center space-x-1 cursor-pointer transition font-bold">
                  <UploadCloud size={12} />
                  <span>UPLOAD TÀI LIỆU</span>
                </button>
              </div>
            </div>
            <div className="flex-1 p-3 overflow-y-auto space-y-3">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-[11px] font-bold text-slate-700 uppercase tracking-wider bg-slate-100/80 border border-slate-300 px-3 py-2 rounded-lg">
                  <ChevronRight size={14} className="text-slate-500" />
                  <span className="truncate" title={`${currentCase.code} - ${currentCase.clientName}`}>
                    {currentCase.code} - {currentCase.clientName}
                  </span>
                </div>
                <div className="pl-6 space-y-1">
                  {files.map(file => (
                    <div 
                      key={file.id}
                      onClick={() => {
                        setSelectedFileId(file.id);
                        if (file.status === 'needs_correction') setCurrentStep(3);
                        else if (file.status === 'verified' || file.status === 'pushed_d1') setCurrentStep(4);
                      }}
                      className={`flex items-center justify-between text-[11px] px-2 py-1.5 border rounded cursor-pointer transition ${
                        selectedFileId === file.id 
                          ? 'bg-blue-600/10 border-blue-500/50 text-blue-400' 
                          : 'bg-slate-100 border-slate-300/50 text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center space-x-2 overflow-hidden">
                        <span className="text-slate-500 shrink-0">{getFileIcon(file.type)}</span>
                        <span className="truncate">{file.name}</span>
                      </div>
                      {(file.status === 'preprocessing' || file.status === 'htr_processing') && <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse shrink-0"></span>}
                      {file.status === 'needs_correction' && <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0"></span>}
                      {file.status === 'verified' && <CheckCircle2 size={12} className="text-emerald-500 shrink-0" />}
                      {file.status === 'pushed_d1' && <span className="text-[9px] font-bold text-emerald-500 shrink-0">D1</span>}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="p-3 mt-auto bg-white/80 border-t border-slate-200 flex items-center justify-between">
               <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold uppercase">
                <Layers size={14} className="text-blue-500" />
                Kho D1 (Sạch)
              </div>
              <span className="text-[10px] text-slate-500">1.2TB</span>
            </div>
          </div>

          {/* Bottom Card: Workflow Engine Status */}
          <div className="bg-white shadow-lg border border-slate-200 rounded-xl flex flex-col flex-1 overflow-hidden shrink-0">
            <div className="p-3 border-b border-slate-200 bg-white/80 flex justify-between items-center">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Wand2 size={14} className="text-blue-500" />
                AI WORKFLOW ENGINE
              </span>
            </div>
            <div className="flex-1 p-3 overflow-y-auto bg-slate-50 flex flex-col gap-2">
              {renderProcessingStatus()}
              
              {/* Optional: NER Output preview when step 4 */}
              {currentStep === 4 && (
                <div className="mt-2 p-3 bg-slate-100 border border-slate-300/50 rounded-lg">
                   <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Bước 4: Trích xuất Thực thể (NER)</span>
                   <div className="flex flex-wrap gap-2">
                     <span className="px-2 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] rounded">Nguyễn Văn Ánh (Người nhận)</span>
                     <span className="px-2 py-1 bg-blue-500/10 border border-blue-500/30 text-blue-400 text-[10px] rounded">Thửa đất 45 (Bất động sản)</span>
                     <span className="px-2 py-1 bg-purple-500/10 border border-purple-500/30 text-purple-400 text-[10px] rounded">GCNQSDĐ (Thuật ngữ chuẩn hóa)</span>
                   </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Col 2: Image Original Viewer (Bước 3 - Auto Zoom) */}
        <div className="w-2/4 bg-white shadow-lg border border-slate-200 rounded-xl flex flex-col overflow-hidden relative">
          <div className="p-3 border-b border-slate-200 bg-white/80 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">ẢNH GỐC VIẾT TAY</span>
              <div className="flex gap-2">
                <span className="px-2 py-0.5 text-[9px] font-bold bg-blue-600 text-white rounded flex items-center gap-1">
                  <Crop size={10} /> DESKEWED
                </span>
                <span className="px-2 py-0.5 text-[9px] font-bold bg-slate-200 text-slate-700 rounded flex items-center gap-1">
                  <Search size={10} /> AUTO-ZOOM ACTIVE
                </span>
              </div>
            </div>
          </div>
          <div className="flex-1 bg-slate-100 p-4 flex items-center justify-center relative overflow-hidden">
            {/* Mocking the handwritten document zoom view */}
            {selectedFile?.type === 'handwritten' ? (
              <div className="relative w-full max-w-sm aspect-[3/4] bg-[#fdfbf7] rounded shadow-2xl overflow-hidden flex items-center justify-center border border-slate-300"
                   style={selectedFile.fileDataUrl ? { backgroundImage: `url(${selectedFile.fileDataUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
              >
                {!selectedFile.fileDataUrl && (
                   <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' viewBox=\'0 0 100 100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M0 0h100v100H0z\' fill=\'none\'/%3E%3Cpath d=\'M0 20h100M0 40h100M0 60h100M0 80h100\' stroke=\'%23000\' stroke-width=\'0.5\' opacity=\'0.5\'/%3E%3C/svg%3E")', backgroundSize: '100% 20px' }}></div>
                )}
                
                {!selectedFile.fileDataUrl && (
                  <div className={`transform scale-150 transition-all duration-500 font-serif text-[#2a2a2a] italic font-bold tracking-wide ${isEditing ? 'blur-none' : ''}`}>
                     <div className="text-sm border-b-2 border-red-500/50 pb-1 -rotate-2 relative">
                       thửa đất số 45
                       {selectedFile.status === 'needs_correction' && !isSelectedFileCorrected && (
                         <span className="absolute -inset-2 border border-red-500/50 bg-red-500/10 rounded animate-pulse pointer-events-none"></span>
                       )}
                     </div>
                  </div>
                )}

                <div className="absolute bottom-2 right-2 text-[8px] text-slate-500 uppercase tracking-widest bg-white/80 px-1 rounded">
                  Image Pre-processed: Denoised & Binarized
                </div>
              </div>
            ) : (
               <div className="w-full h-full border border-dashed border-slate-300 rounded-lg flex flex-col items-center justify-center bg-white/20">
                  <p className="text-xs text-slate-500 uppercase">Chỉ hỗ trợ xem ảnh cho tính năng HTR</p>
               </div>
            )}
          </div>
          <div className="p-3 border-t border-slate-200 bg-white/80 flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mr-2">Metadata:</span>
            <span className="px-2 py-0.5 bg-slate-100 text-slate-400 border border-slate-300 text-[10px] rounded">Di chúc viết tay</span>
            <span className="px-2 py-0.5 bg-blue-500/10 text-blue-400 border border-blue-500/20 text-[10px] rounded">HTR Confidence: 82%</span>
          </div>
        </div>

        {/* Col 3: Correction & Semantic Processing (Bước 3 & 4) */}
        <div className="w-1/4 bg-white shadow-lg border border-slate-200 rounded-xl flex flex-col overflow-hidden">
          <div className="p-3 border-b border-slate-200 bg-white/80 flex justify-between items-center">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">KẾT QUẢ TRÍCH XUẤT</span>
            {selectedFile?.status === 'needs_correction' ? (
              <div className="flex items-center gap-1 bg-amber-500/10 px-2 py-1 rounded">
                <span className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></span>
                <span className="text-[9px] text-amber-500 font-bold uppercase">Luật sư can thiệp</span>
              </div>
            ) : selectedFile?.status === 'verified' || selectedFile?.status === 'pushed_d1' ? (
              <div className="flex items-center gap-1 bg-emerald-500/10 px-2 py-1 rounded">
                <CheckCircle2 size={12} className="text-emerald-500" />
                <span className="text-[9px] text-emerald-500 font-bold uppercase">Đã chuẩn hóa</span>
              </div>
            ) : null}
          </div>
          
          <div className="flex-1 p-4 overflow-y-auto space-y-4">
            {currentStep < 3 ? (
              <div className="h-full flex items-center justify-center">
                <p className="text-xs text-slate-500 uppercase tracking-widest text-center">Đang chờ AI HTR xử lý...</p>
              </div>
            ) : (
              <>
                <div className={`space-y-2 p-3 rounded-xl border transition-colors ${isSelectedFileCorrected ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-amber-500/5 border-amber-500/30 shadow-[0_0_15px_rgba(245,158,11,0.1)]'}`}>
                  <label className={`text-[10px] font-bold uppercase flex items-center justify-between ${isSelectedFileCorrected ? 'text-emerald-500' : 'text-amber-500'}`}>
                    <div className="flex items-center gap-1.5">
                      {isSelectedFileCorrected ? <CheckCircle2 size={14} /> : <AlertCircle size={14} />}
                      <span>{isSelectedFileCorrected ? 'BẢN DỊCH HTR (HOÀN TẤT)' : 'BẢN DỊCH HTR (CẦN SỬA)'}</span>
                    </div>
                  </label>
                  
                  {isEditing ? (
                    <div className="p-2 bg-slate-50 border border-blue-500/50 rounded-lg flex flex-col gap-2">
                      <textarea 
                        value={tempText}
                        onChange={(e) => setTempText(e.target.value)}
                        className="w-full bg-transparent text-sm text-slate-900 font-serif leading-relaxed outline-none resize-none min-h-[100px]"
                        autoFocus
                      />
                      <div className="flex justify-end gap-2 mt-2">
                        <button onClick={() => setIsEditing(false)} className="px-3 py-1.5 text-[10px] font-bold text-slate-400 hover:text-slate-900 cursor-pointer transition">HỦY</button>
                        <button onClick={handleSaveEdit} className="px-3 py-1.5 text-[10px] font-bold bg-blue-600 text-white rounded hover:bg-blue-500 cursor-pointer transition shadow-lg shadow-blue-600/20 flex items-center gap-1">
                          <BookOpen size={12}/> GHI NHẬN HỌC MÁY
                        </button>
                      </div>
                      <p className="text-[9px] text-blue-500/70 italic text-right">*Hệ thống sẽ ghi nhớ nét chữ này cho các tệp sau (Active Learning).</p>
                    </div>
                  ) : (
                    <div className={`p-3 bg-slate-50 border rounded-lg text-sm font-serif leading-relaxed tracking-wide whitespace-pre-wrap ${isSelectedFileCorrected ? 'border-emerald-500/30 text-emerald-100' : 'border-amber-500/40 text-slate-900'}`}>
                      {selectedFile?.content ? (
                        (() => {
                           const match = selectedFile.content.match(/thủa đát sổ 4S|thửa đất số 45/);
                           if (match) {
                             const parts = selectedFile.content.split(/thủa đát sổ 4S|thửa đất số 45/);
                             return (
                               <>
                                 {parts[0]}
                                 <span className={`font-bold px-1 rounded ${isSelectedFileCorrected ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/30 text-red-300 border border-red-500/50 animate-pulse'}`}>
                                   {isSelectedFileCorrected ? 'thửa đất số 45' : 'thủa đát sổ 4S'}
                                 </span>
                                 {parts[1]}
                               </>
                             );
                           }
                           return selectedFile.content;
                        })()
                      ) : (
                        <>
                          ...để lại toàn bộ <span className={`font-bold px-1 rounded ${isSelectedFileCorrected ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/30 text-red-300 border border-red-500/50 animate-pulse'}`}>{isSelectedFileCorrected ? 'thửa đất số 45' : 'thủa đát sổ 4S'}</span>, tờ bản đồ 02 cho con trai là Nguyễn Văn Ánh...
                        </>
                      )}
                    </div>
                  )}

                  {!isSelectedFileCorrected && !isEditing && (
                    <div className="flex flex-col gap-3 pt-3 mt-3 border-t border-amber-500/20">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] text-amber-500 font-bold bg-amber-500/10 px-2 py-0.5 rounded">Điểm tin cậy: 65% (Nghi ngờ lỗi)</span>
                      </div>
                      <div className="flex gap-2 w-full">
                        <button onClick={handleStartEdit} className="flex-1 py-2 text-[10px] font-bold bg-slate-100 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-200 hover:text-slate-900 cursor-pointer flex items-center justify-center gap-1.5 transition">
                          <Edit3 size={12} /> SỬA LỖI (INLINE)
                        </button>
                        <button onClick={handleAcceptHITL} className="flex-1 py-2 text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-lg hover:bg-emerald-500/30 hover:text-emerald-300 flex items-center justify-center gap-1.5 cursor-pointer transition">
                          <CheckCircle2 size={12} /> ĐÚNG RỒI
                        </button>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Step 4 Representation */}
                {isSelectedFileCorrected && (
                  <div className="space-y-2 p-3 bg-white border border-slate-200 rounded-xl">
                    <label className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1">
                      <Wand2 size={12} /> BƯỚC 4: DỊCH NGỮ NGHĨA PHÁP LÝ
                    </label>
                    <div className="text-xs text-slate-400 space-y-1">
                      <p>Hệ thống tự động chuẩn hóa:</p>
                      <ul className="list-disc pl-4 text-[11px] text-slate-700 font-serif">
                        <li>"GCNQSDĐ" → Giấy chứng nhận quyền sử dụng đất</li>
                        <li>Trích xuất NER: <span className="text-blue-400">Nguyễn Văn Ánh</span>, <span className="text-emerald-400">Thửa đất 45</span></li>
                      </ul>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          <div className="p-4 bg-white/80 border-t border-slate-200">
            <button 
              onClick={handlePushToD1}
              disabled={!isSelectedFileCorrected || selectedFile?.status === 'pushed_d1'}
              className="w-full py-3 rounded-lg bg-blue-600 text-white text-[11px] font-bold tracking-wider hover:bg-blue-500 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-600 shadow-lg shadow-blue-600/20 flex justify-center items-center gap-2"
            >
              {selectedFile?.status === 'pushed_d1' ? (
                <><CheckCircle2 size={16} /> ĐÃ LƯU KHO D1</>
              ) : (
                <><Layers size={16} /> ĐẨY VÀO KHO D1 (HỒ SƠ SẠCH)</>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

