import { FileSignature, Wand2, Plus, Type, Bookmark, Upload, Send, MessageSquare, Download, AlertCircle } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

interface ChatMessage {
  id: string;
  role: 'user' | 'ai';
  content: string;
  isSuggestion?: boolean;
  suggestionText?: string;
}

import { UploadedFile } from "../types";

interface AIEditorProps {
  selectedCaseId?: string | null;
  caseFiles: Record<string, UploadedFile[]>;
}

export function AIEditorScreen({ selectedCaseId, caseFiles }: AIEditorProps) {
  const [docContent, setDocContent] = useState('');
  
  useEffect(() => {
    let extractedText = "";
    if (selectedCaseId && caseFiles && caseFiles[selectedCaseId]) {
      const handwrittenFile = caseFiles[selectedCaseId].find(f => f.type === 'handwritten');
      if (handwrittenFile && handwrittenFile.content) {
        extractedText = handwrittenFile.content;
      }
    }
    
    if (extractedText) {
      setDocContent(`[Dữ liệu tự động điền từ kết quả quét bản án D1]:\n\n` + extractedText + `\n\nCăn cứ theo sự phân tích tại Hệ thống, tôi xin trình bày sự việc như sau:\n\nKhởi nguồn sự việc bắt đầu từ năm 2000...`);
    } else {
      setDocContent("Căn cứ theo sự phân tích tại Hệ thống, tôi xin trình bày sự việc như sau:\n\nKhởi nguồn sự việc bắt đầu từ năm 2000, gia đình tôi có hành vi cơi nới diện tích đất do ranh giới không rõ ràng. Suốt từ đó đến nay, chúng tôi sử dụng ổn định và không có tranh chấp với bất kỳ hộ liền kề nào.\n\nĐến năm 2024, do nhu cầu chuyển nhượng, tôi phát hiện phần diện tích này chưa được cấp Giấy chứng nhận QSDĐ.");
    }
  }, [selectedCaseId, caseFiles]);

  const [chatInput, setChatInput] = useState('');
  const [isAiTyping, setIsAiTyping] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'ai',
      content: 'Chào bạn, tôi là Trợ lý AI Pháp lý. Dựa trên phân tích từ Temporal Law Engine (xung đột năm 2000 và 2024), tôi thấy bạn đang viết đơn yêu cầu cấp GCNQSDĐ cho phần đất cơi nới.',
    }
  ]);
  
  const [activeTab, setActiveTab] = useState('dan-su');
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isAiTyping]);

  const handleSendMessage = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!chatInput.trim()) return;

    const newUserMsg: ChatMessage = { id: Date.now().toString(), role: 'user', content: chatInput };
    setMessages(prev => [...prev, newUserMsg]);
    setChatInput('');
    setIsAiTyping(true);

    // Simulate AI thinking and responding
    setTimeout(() => {
      setIsAiTyping(false);
      const aiResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        content: 'Tôi hiểu. Để tăng tính thuyết phục, bạn nên áp dụng Khoản 2 Điều 138 Luật Đất đai 2024 (quy định có lợi hơn đối với hành vi trước 01/07/2014). Đây là đoạn văn bản tôi đề xuất:',
        isSuggestion: true,
        suggestionText: "Căn cứ theo Khoản 2 Điều 138 Luật Đất đai 2024 (Quy định chuyển tiếp), hành vi sử dụng đất này xảy ra trước ngày 01/07/2014 và hiện tại không có tranh chấp với các hộ liền kề. Do đó, gia đình tôi hoàn toàn đủ điều kiện pháp lý để được xem xét cấp GCNQSDĐ đối với phần diện tích trên mà không vi phạm điều cấm của pháp luật."
      };
      setMessages(prev => [...prev, aiResponse]);
    }, 1500);
  };

  const handleInsertSuggestion = (text: string) => {
    setDocContent(prev => prev + '\n\n' + text);
    // Optional alert or toast
  };

  const [isExporting, setIsExporting] = useState(false);
  const handleExportWord = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
    }, 2000);
  };

  const [isReversing, setIsReversing] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);
  
  const handleReverseStorage = () => {
    setIsReversing(true);
    setTimeout(() => {
      setIsReversing(false);
    }, 2000);
  };

  const handleReject = () => {
    setIsRejecting(true);
    setTimeout(() => {
      setIsRejecting(false);
    }, 2000);
  };

  return (
    <div className="h-full flex flex-col bg-slate-50 p-4 gap-4 relative">
      <header className="h-16 border border-slate-200 rounded-xl bg-white shadow-lg px-6 flex justify-between items-center shrink-0 z-10">
        <div>
          <h2 className="text-lg font-semibold tracking-tight text-slate-900 leading-none mb-1">Trình Soạn thảo Thông minh & Trí tuệ Khép kín</h2>
          <p className="text-[10px] text-slate-400 uppercase tracking-widest italic">AI Editor & Winning Logic</p>
        </div>
      </header>
      
      <div className="bg-white shadow-lg border border-slate-200 rounded-xl px-6 py-3 flex justify-between items-center shrink-0">
        <div className="flex space-x-2 overflow-x-auto">
          <div className="flex items-center px-3 py-1 bg-slate-100 border border-slate-300 rounded mr-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">KHO D3</span>
          </div>
          <button 
            onClick={() => setActiveTab('dan-su')}
            className={`px-4 py-1.5 text-xs rounded-md transition cursor-pointer ${activeTab === 'dan-su' ? 'bg-blue-600/20 text-blue-400 font-bold border border-blue-600/30' : 'bg-transparent text-slate-400 font-medium hover:text-slate-900'}`}
          >
            Tố tụng Dân sự
          </button>
          <button 
            onClick={() => setActiveTab('hinh-su')}
            className={`px-4 py-1.5 text-xs rounded-md transition cursor-pointer ${activeTab === 'hinh-su' ? 'bg-blue-600/20 text-blue-400 font-bold border border-blue-600/30' : 'bg-transparent text-slate-400 font-medium hover:text-slate-900'}`}
          >
            Tố tụng Hình sự
          </button>
          <button 
            onClick={() => setActiveTab('hanh-chinh')}
            className={`px-4 py-1.5 text-xs rounded-md transition cursor-pointer ${activeTab === 'hanh-chinh' ? 'bg-blue-600/20 text-blue-400 font-bold border border-blue-600/30' : 'bg-transparent text-slate-400 font-medium hover:text-slate-900'}`}
          >
            Hành chính - UBND
          </button>
        </div>
        <button 
          onClick={handleExportWord}
          className={`px-4 py-1.5 text-white font-bold flex items-center space-x-2 text-xs rounded-md transition cursor-pointer shadow-sm border ${isExporting ? 'bg-emerald-600 border-emerald-500' : 'bg-blue-600 hover:bg-blue-500 border-blue-500'}`}
        >
          <Download size={14} className={isExporting ? 'animate-bounce' : ''} />
          <span>{isExporting ? 'ĐÃ XUẤT FILE' : 'XUẤT MS WORD'}</span>
        </button>
      </div>

      <div className="flex-1 flex gap-4 overflow-hidden relative">
        {/* Left: Rich Text Editor */}
        <div className="w-3/5 bg-white shadow-lg border border-slate-200 rounded-xl flex flex-col overflow-hidden">
          <div className="border-b border-slate-200 p-2 flex space-x-2 bg-white/80 shrink-0">
            <button className="p-2 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-900 cursor-pointer"><Type size={16} /></button>
            <button className="p-2 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-900 font-bold cursor-pointer">B</button>
            <button className="p-2 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-900 italic cursor-pointer">I</button>
            <button className="p-2 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-900 underline cursor-pointer">U</button>
          </div>
          <div className="flex-1 overflow-y-auto bg-slate-50 p-8">
            <div className="max-w-2xl mx-auto space-y-6 text-slate-700 font-serif text-sm bg-white p-8 rounded border border-slate-200 shadow-2xl min-h-[800px]">
              <div className="text-center font-bold text-base mb-8 uppercase text-slate-900">
                CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM<br/>
                Độc lập - Tự do - Hạnh phúc
              </div>
              
              <h1 className="text-lg font-bold text-center uppercase my-6 text-slate-900">Đơn Khởi Kiện</h1>
              
              <p className="flex items-start">
                <span className="w-24 font-bold text-slate-400">Kính gửi:</span>
                <span className="flex-1 border-b border-dotted border-slate-300 font-medium text-slate-700">Tòa án nhân dân huyện ABC, tỉnh XYZ</span>
              </p>
              
              <p><strong className="text-slate-400">Người khởi kiện:</strong> Nguyễn Văn A, sinh năm 1970</p>
              <p><strong className="text-slate-400">Địa chỉ:</strong> Xã DEF, Huyện ABC, Tỉnh XYZ</p>
              
              <div className="mt-6 flex flex-col">
                <p className="font-bold mb-2 text-slate-400">Nội dung khởi kiện:</p>
                <textarea 
                  value={docContent}
                  onChange={(e) => setDocContent(e.target.value)}
                  className="w-full min-h-[300px] bg-transparent resize-none outline-none text-slate-700 font-serif leading-relaxed border border-transparent hover:border-slate-200 focus:border-blue-500/50 p-2 rounded transition-colors"
                  placeholder="Nhập nội dung đơn..."
                />
              </div>
              
              <div className="flex justify-end mt-16 pt-8">
                <div className="text-center text-slate-400">
                  <p className="mb-16">Người làm đơn</p>
                  <p className="font-bold text-slate-700">(Ký tên)</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: AI Assistant & Winning Logic Tagging */}
        <div className="w-2/5 flex flex-col gap-4">
          <div className="bg-white shadow-lg border border-slate-200 rounded-xl overflow-hidden flex flex-col flex-1">
            <div className="p-3 border-b border-slate-200 bg-white/80 flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-2">
                <MessageSquare className="text-blue-400" size={14} />
                <span>AI ASSISTANT</span>
              </h3>
              <div className="flex items-center space-x-1">
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                <span className="text-[9px] text-emerald-500 font-bold uppercase">Online</span>
              </div>
            </div>
            
            <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-white/70 flex flex-col">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] rounded-lg p-3 ${
                    msg.role === 'user' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-slate-100 border border-slate-300 text-slate-700'
                  }`}>
                    <p className="text-xs leading-relaxed">{msg.content}</p>
                    
                    {msg.isSuggestion && msg.suggestionText && (
                      <div className="mt-3 pt-3 border-t border-slate-300 space-y-3">
                        <div className="p-3 bg-blue-900/20 border border-blue-500/30 rounded text-xs text-blue-200 italic font-serif">
                          "{msg.suggestionText}"
                        </div>
                        <div className="bg-amber-500/10 p-2 rounded text-[10px] text-amber-200 flex items-start space-x-2 border border-amber-500/20">
                          <Bookmark size={12} className="mt-0.5 shrink-0 text-amber-400" />
                          <span>Luận điểm này có độ khớp 92% với Án lệ số 04/2020. Tòa thường chấp thuận.</span>
                        </div>
                        <button 
                          onClick={() => handleInsertSuggestion(msg.suggestionText!)}
                          className="w-full py-1.5 bg-blue-600 text-white text-[10px] font-bold rounded hover:bg-blue-500 transition shadow-sm cursor-pointer border border-blue-500 uppercase flex items-center justify-center space-x-2"
                        >
                          <FileSignature size={12} />
                          <span>CHÈN VÀO ĐƠN</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {isAiTyping && (
                <div className="flex justify-start">
                  <div className="bg-slate-100 border border-slate-300 rounded-lg p-3 flex space-x-1">
                    <div className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce"></div>
                    <div className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-200 bg-white/80">
              <div className="relative">
                <input 
                  type="text" 
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Nhắn tin cho AI để xin luận điểm..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 pl-3 pr-10 text-xs text-slate-700 focus:outline-none focus:border-blue-500 transition-colors"
                />
                <button 
                  type="submit"
                  disabled={!chatInput.trim() || isAiTyping}
                  className="absolute right-1 top-1 bottom-1 px-2 text-blue-500 hover:text-blue-400 disabled:opacity-50 disabled:cursor-not-allowed transition cursor-pointer"
                >
                  <Send size={16} />
                </button>
              </div>
            </form>
          </div>
          
          {/* Reverse Storage */}
          <div className="bg-white shadow-lg border border-slate-200 rounded-xl overflow-hidden shrink-0">
             <div className="p-3 border-b border-slate-200 bg-white/80 flex justify-between items-center">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">REVERSE STORAGE (LƯU TRỮ NGƯỢC)</span>
                <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded text-[10px] font-bold uppercase">Feedback Loop</span>
             </div>
             <div className="p-4 bg-slate-100/20 relative overflow-hidden flex flex-col gap-3">
                <div className="absolute -right-4 -top-4 w-24 h-24 bg-blue-900/20 rounded-full blur-xl"></div>
                <p className="text-[11px] text-slate-400">
                  Tự động lưu trữ ngược Bản án/Quyết định vào Kho D1. Cơ chế học hỏi thực tế ghi nhận kết quả giải quyết vụ việc để tối ưu biểu mẫu tương lai.
                </p>
                <div className="flex flex-col gap-2 relative z-10 mt-2">
                  <button 
                    onClick={handleReverseStorage}
                    className={`w-full py-2 text-white rounded text-[10px] font-bold flex items-center justify-center space-x-2 transition cursor-pointer uppercase border ${isReversing ? 'bg-emerald-600 hover:bg-emerald-500 border-emerald-500' : 'bg-blue-600 hover:bg-blue-500 border-blue-500'}`}
                  >
                    <Upload size={14} className={isReversing ? 'animate-bounce' : ''} />
                    <span>{isReversing ? 'ĐÃ NẠP BẢN ÁN VÀO D1' : 'QUÉT & NẠP BẢN ÁN VÀO D1'}</span>
                  </button>
                  <button 
                    onClick={handleReject}
                    className={`w-full py-2 text-slate-700 rounded text-[10px] font-bold flex items-center justify-center space-x-2 transition cursor-pointer uppercase border ${isRejecting ? 'bg-amber-600/20 border-amber-500/50 text-amber-400' : 'bg-slate-100 hover:bg-slate-200 border-slate-300'}`}
                  >
                    <AlertCircle size={14} className={isRejecting ? 'animate-pulse' : ''} />
                    <span>{isRejecting ? 'ĐÃ GHI NHẬN LÝ DO' : 'GHI NHẬN LÝ DO BÁC ĐƠN'}</span>
                  </button>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}

