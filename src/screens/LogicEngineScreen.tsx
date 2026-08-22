import { useState } from 'react';
import { GitCommit, PlusCircle, AlertTriangle, ArrowRightLeft, CheckCircle, X } from 'lucide-react';

import { D3Timeline } from '../components/D3Timeline';

type Category = 'land' | 'civil';

import { UploadedFile } from "../types";

interface LogicEngineProps {
  selectedCaseId?: string | null;
  caseFiles: Record<string, UploadedFile[]>;
}

export function LogicEngineScreen({ selectedCaseId, caseFiles }: LogicEngineProps) {
  const [category, setCategory] = useState<Category>('land');
  const [selectedEventId, setSelectedEventId] = useState<string>('evt-2');
  const [showDetail, setShowDetail] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  const handleCopy = () => {
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleAdd = () => {
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  // MOCK DATA
  let scenarios = {
    land: {
      title: 'Tranh chấp thừa kế & lấn chiếm 2000-2024',
      events: [
        { id: 'evt-1', year: '1993', text: 'Giao đất cho ông A theo chính sách mới.', color: 'blue' },
        { id: 'evt-2', year: '2000', text: 'Hành vi lấn chiếm đất công do sai lệch ranh giới.', color: 'amber' },
        { id: 'evt-3', year: '2001', text: 'Ông A qua đời, không để lại di chúc.', color: 'slate' },
        { id: 'evt-4', year: '2004', text: 'Cấp GCN QSDĐ (Phát hiện sai sót diện tích).', color: 'slate' },
        { id: 'evt-5', year: '2024', text: 'Hiện trạng khởi kiện chia thừa kế.', color: 'emerald' },
      ],
      comparisons: {
        'evt-1': {
          eventName: 'Giao đất (1993)',
          old: {
            title: 'LUẬT ĐẤT ĐAI 1987',
            rights: 'Nhà nước giao đất cho hộ gia đình sử dụng ổn định.',
            obligations: 'Sử dụng đúng mục đích, không được mua bán.',
            conflict: 'Quyền thừa kế chưa được quy định rõ ràng.',
          },
          new: {
            title: 'LUẬT ĐẤT ĐAI 1993',
            rights: 'Có quyền chuyển đổi, chuyển nhượng, cho thuê, thừa kế.',
            obligations: 'Nộp thuế, sử dụng đúng ranh giới.',
            transition: 'Điều khoản chuyển tiếp: Công nhận quyền.',
          },
          strategy: 'Khẳng định quyền thừa kế phát sinh theo Luật ĐĐ 1993.'
        },
        'evt-2': {
          eventName: 'Hành vi lấn chiếm (2000)',
          old: {
            title: 'LUẬT ĐẤT ĐAI 1993',
            rights: 'Người sử dụng đất không có quyền hợp thức hóa đất lấn chiếm. (Điều 14)',
            obligations: 'Phải trả lại đất, nộp phạt vi phạm hành chính.',
            conflict: 'Xung đột pháp lý: Điều 20 - Không công nhận quyền sử dụng.',
          },
          new: {
            title: 'LUẬT ĐẤT ĐAI 2024',
            rights: 'Có thể được cấp GCN nếu sử dụng ổn định trước 01/07/2014 và không có tranh chấp (Điều 138).',
            obligations: 'Phải thực hiện nghĩa vụ tài chính theo giá đất hiện hành.',
            transition: 'Điều khoản Chuyển tiếp: Khoản 2 - Được xem xét áp dụng quy định có lợi hơn.',
          },
          strategy: 'Đề xuất: Áp dụng khoản 2 Điều 138 Luật Đất đai 2024 (quy định có lợi hơn) để xin cấp GCNQSDĐ cho phần lấn chiếm, do đã sử dụng ổn định trước 2014.'
        },
        'evt-3': {
          eventName: 'Mở thừa kế (2001)',
          old: {
            title: 'BLDS 1995',
            rights: 'Người thừa kế theo pháp luật được hưởng di sản.',
            obligations: 'Thực hiện nghĩa vụ tài sản do người chết để lại.',
            conflict: 'Hết thời hiệu khởi kiện thừa kế (10 năm).',
          },
          new: {
            title: 'BLDS 2015',
            rights: 'Thời hiệu khởi kiện thừa kế bất động sản là 30 năm.',
            obligations: 'Chia thừa kế theo pháp luật.',
            transition: 'Áp dụng BLDS 2015 về thời hiệu.',
          },
          strategy: 'Khẳng định thời hiệu khởi kiện vẫn còn theo BLDS 2015.'
        },
        'evt-4': {
          eventName: 'Cấp GCN QSDĐ (2004)',
          old: {
            title: 'LUẬT ĐẤT ĐAI 2003',
            rights: 'Quy định về cấp GCN tại thời điểm 2004.',
            obligations: 'Chịu trách nhiệm về ranh giới kê khai.',
            conflict: 'Sai sót diện tích dẫn đến GCN cấp không đúng.',
          },
          new: {
            title: 'LUẬT ĐẤT ĐAI 2024',
            rights: 'Quy định đính chính, thu hồi GCN cấp sai.',
            obligations: 'Làm thủ tục cấp lại GCN theo diện tích thực tế.',
            transition: 'Điều khoản chuyển tiếp: Xử lý GCN đã cấp sai.',
          },
          strategy: 'Đề xuất: Yêu cầu cơ quan nhà nước đính chính GCN theo hiện trạng.'
        },
        'evt-5': {
          eventName: 'Khởi kiện (2024)',
          old: {
            title: 'BLTTDS 2015',
            rights: 'Quyền khởi kiện tại Tòa án nơi có BĐS.',
            obligations: 'Cung cấp chứng cứ chứng minh.',
            conflict: 'Xác định Tòa án có thẩm quyền.',
          },
          new: {
            title: 'BLTTDS 2015 (hiện hành)',
            rights: 'Tiến hành thủ tục tố tụng.',
            obligations: 'Hòa giải tại cơ sở là thủ tục bắt buộc.',
            transition: 'Áp dụng thủ tục hiện hành.',
          },
          strategy: 'Tiến hành hòa giải tại xã trước khi nộp đơn khởi kiện.'
        }
      }
    },
    civil: {
      title: 'Tranh chấp Hợp đồng vay tài sản 2005-2024',
      events: [
        { id: 'evt-c1', year: '2005', text: 'Ký hợp đồng vay tiền, lãi suất 5%/tháng.', color: 'blue' },
        { id: 'evt-c2', year: '2008', text: 'Ngừng trả lãi do khó khăn tài chính.', color: 'amber' },
        { id: 'evt-c3', year: '2024', text: 'Khởi kiện đòi nợ gốc và lãi.', color: 'emerald' },
      ],
      comparisons: {
        'evt-c1': {
          eventName: 'Thỏa thuận lãi suất (2005)',
          old: {
            title: 'BLDS 2005',
            rights: 'Lãi suất thỏa thuận không vượt quá 150% lãi suất cơ bản.',
            obligations: 'Trả nợ đúng hạn.',
            conflict: 'Lãi suất 5%/tháng (60%/năm) vượt xa giới hạn cho phép.',
          },
          new: {
            title: 'BLDS 2015',
            rights: 'Lãi suất thỏa thuận không vượt quá 20%/năm.',
            obligations: 'Lãi suất vượt mức không có hiệu lực.',
            transition: 'Áp dụng quy định có lợi hoặc quy định tại thời điểm ký kết.',
          },
          strategy: 'Đề xuất: Phần lãi vượt quá giới hạn theo BLDS 2005 bị vô hiệu. Tính lại toàn bộ lãi theo mức trần.'
        },
        'evt-c2': {
          eventName: 'Vi phạm nghĩa vụ trả nợ (2008)',
          old: {
            title: 'BLDS 2005',
            rights: 'Đòi nợ gốc, lãi trong hạn, lãi quá hạn.',
            obligations: 'Bên vay chịu trách nhiệm bồi thường.',
            conflict: 'Tranh chấp cách tính lãi trên lãi (lãi kép).',
          },
          new: {
            title: 'Án lệ số 08/2016/AL',
            rights: 'Xác định rõ cách tính lãi quá hạn.',
            obligations: 'Thực hiện tính lãi theo Án lệ.',
            transition: 'Áp dụng đường lối xét xử hiện hành.',
          },
          strategy: 'Đề xuất: Lập bảng tính chi tiết nợ gốc, lãi trong hạn, và lãi quá hạn theo công thức của Án lệ số 08.'
        },
        'evt-c3': {
          eventName: 'Khởi kiện (2024)',
          old: {
            title: 'BLDS 2005',
            rights: 'Thời hiệu khởi kiện 2 năm.',
            obligations: '...',
            conflict: 'Hết thời hiệu khởi kiện tranh chấp hợp đồng.',
          },
          new: {
            title: 'BLDS 2015',
            rights: 'Thời hiệu khởi kiện tranh chấp hợp đồng là 3 năm.',
            obligations: '...',
            transition: 'Trường hợp vay không kỳ hạn không bị hạn chế thời hiệu khởi kiện đòi gốc.',
          },
          strategy: 'Lập luận: Đây là hợp đồng vay không kỳ hạn hoặc thuộc trường hợp không áp dụng thời hiệu đòi lại tài sản.'
        }
      }
    }
  };

  const currentScenario = scenarios[category];
  
  if (selectedCaseId && caseFiles && caseFiles[selectedCaseId]) {
    const hwFile = caseFiles[selectedCaseId].find(f => f.type === 'handwritten' || f.type === 'image');
    if (hwFile && hwFile.content) {
      if (hwFile.content.includes('45')) {
         scenarios.land.comparisons['evt-2'].strategy = "[Đã trích xuất từ Bản án D1] Đề xuất: Căn cứ tài liệu quét (có thông tin thửa đất số 45), áp dụng khoản 2 Điều 138 Luật Đất đai 2024 để xin cấp GCNQSDĐ.";
         scenarios.land.events[1].text = "Hành vi lấn chiếm / Di chúc thửa đất số 45.";
      } else {
         scenarios.land.comparisons['evt-2'].strategy = "[Dữ liệu từ Bản án D1] " + scenarios.land.comparisons['evt-2'].strategy;
      }
    }
  }

  const currentEventData = currentScenario.comparisons[selectedEventId] || Object.values(currentScenario.comparisons)[0];


  const handleCategorySwitch = (cat: Category) => {
    setCategory(cat);
    setSelectedEventId(cat === 'land' ? 'evt-2' : 'evt-c1');
    setShowDetail(false);
  };

  const getColorClasses = (color: string, isSelected: boolean) => {
    switch (color) {
      case 'blue': return isSelected ? 'bg-blue-600 shadow-[0_0_0_4px_rgba(37,99,235,0.2)]' : 'bg-blue-600';
      case 'amber': return isSelected ? 'bg-amber-500 shadow-[0_0_0_4px_rgba(245,158,11,0.2)]' : 'bg-amber-500';
      case 'emerald': return isSelected ? 'bg-emerald-500 shadow-[0_0_0_4px_rgba(16,185,129,0.2)]' : 'bg-emerald-500';
      case 'slate': 
      default: return isSelected ? 'bg-slate-500 shadow-[0_0_0_4px_rgba(100,116,139,0.2)]' : 'bg-slate-600';
    }
  };

  const getTextClasses = (color: string) => {
    switch (color) {
      case 'blue': return 'text-blue-400';
      case 'amber': return 'text-amber-500';
      case 'emerald': return 'text-emerald-500';
      case 'slate': 
      default: return 'text-slate-500';
    }
  };

  return (
    <div className="h-full flex flex-col bg-slate-50 p-4 gap-4 relative">
      <header className="h-16 border border-slate-200 rounded-xl bg-white shadow-lg px-6 flex justify-between items-center shrink-0 z-10">
        <div>
          <h2 className="text-lg font-semibold tracking-tight text-slate-900 leading-none mb-1">Động cơ Tư duy Logic & Đối chiếu</h2>
          <p className="text-[10px] text-slate-400 uppercase tracking-widest italic">Vụ án: {currentScenario.title}</p>
        </div>
        <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-300/50">
          <button className="px-4 py-1.5 bg-blue-600 shadow-sm rounded-md text-xs font-bold text-white cursor-pointer">Đối chiếu (Comparative)</button>
          <button className="px-4 py-1.5 text-xs font-medium text-slate-400 hover:text-slate-900 cursor-pointer">Dòng thời gian đơn</button>
        </div>
      </header>

      <div className="shrink-0">
        <D3Timeline 
          events={currentScenario.events.map(e => ({ ...e, year: parseInt(e.year, 10) }))} 
          selectedId={selectedEventId} 
          onSelect={(id) => currentScenario.comparisons[id] && setSelectedEventId(id)} 
        />
      </div>

      <div className="flex-1 flex gap-4 overflow-hidden relative">
        {/* Left: Timeline */}
        <div className="w-1/3 border border-slate-200 bg-white rounded-xl shadow-lg p-6 overflow-y-auto flex flex-col transition-all">
          <div className="flex justify-between items-start mb-6">
            <h3 className="font-semibold text-slate-700 flex items-center space-x-2">
              <GitCommit className="text-blue-500" size={18} />
              <span className="text-xs uppercase tracking-wider text-slate-400">ENTITY EXTRACTION</span>
            </h3>
            <span className="text-[9px] bg-blue-600/20 text-blue-400 border border-blue-600/30 px-2 py-0.5 rounded font-bold uppercase">CSDL D2</span>
          </div>
          
          <div className="relative border-l-2 border-slate-300 ml-3 space-y-8 pb-8 flex-1">
            {currentScenario.events.map((evt) => {
              const isSelected = selectedEventId === evt.id;
              const hasData = !!currentScenario.comparisons[evt.id];
              return (
                <div 
                  key={evt.id} 
                  className={`relative pl-6 ${hasData ? 'cursor-pointer group' : 'opacity-60'}`}
                  onClick={() => hasData && setSelectedEventId(evt.id)}
                >
                  <div className={`absolute w-4 h-4 rounded-full -left-[9px] top-1 border-4 border-slate-900 transition-all ${getColorClasses(evt.color, isSelected)}`}></div>
                  <div className={`text-sm font-bold flex items-center space-x-2 ${getTextClasses(evt.color)}`}>
                    <span>{evt.year}</span>
                    {isSelected && <span className={`text-[9px] px-2 py-0.5 rounded font-bold uppercase border bg-opacity-20 ${getTextClasses(evt.color).replace('text-', 'bg-')} ${getTextClasses(evt.color).replace('text-', 'border-')} ${getTextClasses(evt.color)}`}>Đang chọn</span>}
                  </div>
                  <div className={`p-3 mt-1 rounded border text-xs shadow-sm transition-all ${
                    isSelected 
                      ? `bg-${evt.color}-500/10 border-${evt.color}-500/30 text-${evt.color}-100 font-medium` 
                      : 'bg-slate-100 border-slate-300 text-slate-700 group-hover:border-slate-300'
                  }`}>
                    {evt.text}
                  </div>
                </div>
              );
            })}
          </div>
          
          <button className="w-full mt-4 flex items-center justify-center space-x-2 text-blue-400 font-bold text-[11px] uppercase p-3 border border-dashed border-blue-500/30 rounded-lg hover:bg-blue-600/10 transition cursor-pointer">
            <PlusCircle size={14} />
            <span>Thêm Giả thuyết</span>
          </button>
        </div>

        {/* Right: Comparative Conflict View */}
        <div className="w-2/3 bg-white shadow-lg border border-slate-200 rounded-xl flex flex-col overflow-hidden transition-all">
          <div className="p-3 border-b border-slate-200 bg-white/80 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">TEMPORAL LAW ENGINE</span>
              <div className="flex bg-slate-100 rounded p-0.5">
                <button 
                  onClick={() => handleCategorySwitch('land')}
                  className={`px-2 py-0.5 text-[10px] font-bold rounded shadow-sm cursor-pointer transition ${category === 'land' ? 'bg-slate-200 text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  ĐẤT ĐAI
                </button>
                <button 
                  onClick={() => handleCategorySwitch('civil')}
                  className={`px-2 py-0.5 text-[10px] font-bold rounded shadow-sm cursor-pointer transition ${category === 'civil' ? 'bg-slate-200 text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  DÂN SỰ
                </button>
              </div>
            </div>
            <div className="text-[10px] text-slate-400 bg-slate-100 px-2 py-1 rounded border border-slate-300 shadow-sm animate-pulse-once">
              Sự kiện áp dụng: <span className="font-bold text-amber-500">{currentEventData.eventName}</span>
            </div>
          </div>

          <div className="flex-1 bg-slate-50 flex flex-col overflow-hidden relative">
            <div className="flex divide-x divide-slate-200 border-b border-slate-200 bg-white/60">
              <div className="w-1/2 p-3 text-center">
                <h4 className="text-[11px] font-bold text-slate-400 uppercase">{currentEventData.old.title}</h4>
                <p className="text-[9px] text-slate-500 mt-1">Hiệu lực tại thời điểm xảy ra sự kiện</p>
              </div>
              <div className="w-1/2 p-3 text-center bg-blue-600/5">
                <h4 className="text-[11px] font-bold text-blue-400 uppercase">{currentEventData.new.title}</h4>
                <p className="text-[9px] text-blue-500 mt-1">Hiệu lực tại thời điểm xét xử</p>
              </div>
            </div>
            
            <div className="flex-1 flex divide-x divide-slate-200 relative">
              {/* Old Law Side */}
              <div className="w-1/2 p-6 space-y-6 overflow-y-auto">
                <div>
                  <h5 className="text-[10px] font-bold uppercase text-slate-500 mb-2">Quyền lợi</h5>
                  <div className="bg-slate-100 p-3 rounded border border-slate-300 text-xs text-slate-700">
                    {currentEventData.old.rights}
                  </div>
                </div>
                <div>
                  <h5 className="text-[10px] font-bold uppercase text-slate-500 mb-2">Nghĩa vụ</h5>
                  <div className="bg-slate-100 p-3 rounded border border-slate-300 text-xs text-slate-700">
                    {currentEventData.old.obligations}
                  </div>
                </div>
                <div className="mt-8 p-3 bg-red-500/10 border border-red-500/20 rounded-lg shadow-sm">
                  <div className="flex items-center space-x-2 text-red-400 font-bold mb-1 text-xs">
                    <AlertTriangle size={14} />
                    <span>Xung đột pháp lý</span>
                  </div>
                  <p className="text-[10px] text-red-300/80">{currentEventData.old.conflict}</p>
                </div>
              </div>
              
              {/* New Law Side */}
              <div className="w-1/2 p-6 space-y-6 overflow-y-auto bg-blue-600/5">
                <div>
                  <h5 className="text-[10px] font-bold uppercase text-blue-400/80 mb-2">Quyền lợi (Sửa đổi/Cập nhật)</h5>
                  <div className="bg-blue-600/10 p-3 rounded border border-blue-500/20 text-xs text-blue-100">
                    {currentEventData.new.rights}
                  </div>
                </div>
                <div>
                  <h5 className="text-[10px] font-bold uppercase text-blue-400/80 mb-2">Nghĩa vụ (Bổ sung/Thay đổi)</h5>
                  <div className="bg-blue-600/10 p-3 rounded border border-blue-500/20 text-xs text-blue-100">
                    {currentEventData.new.obligations}
                  </div>
                </div>
                <div className="mt-8 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg shadow-sm">
                  <div className="flex items-center space-x-2 text-emerald-400 font-bold mb-1 text-xs">
                    <CheckCircle size={14} />
                    <span>Điều khoản Chuyển tiếp & Giải pháp</span>
                  </div>
                  <p className="text-[10px] text-emerald-300/80">{currentEventData.new.transition}</p>
                </div>
              </div>
            </div>
            
            <div className="p-3 border-t border-slate-200 bg-white/80 flex justify-between items-center shrink-0">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded bg-blue-600 flex items-center justify-center text-white shadow-lg">
                  <ArrowRightLeft size={16} />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">Đề xuất Phương án Pháp lý Tối ưu</div>
                  <div className="text-[10px] text-slate-400">Dựa trên logic xác định & quy định chuyển tiếp</div>
                </div>
              </div>
              <button 
                onClick={() => setShowDetail(true)}
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-bold uppercase tracking-wider rounded transition cursor-pointer border border-blue-500 shadow-md"
              >
                XEM CHI TIẾT
              </button>
            </div>
            
            {/* Strategy Overlay */}
            {showDetail && (
              <div className="absolute inset-0 z-20 flex items-end p-4 bg-slate-50/40 backdrop-blur-sm">
                <div className="w-full bg-white border border-blue-500/50 rounded-xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-10 fade-in duration-200">
                  <div className="flex justify-between items-center p-3 border-b border-slate-200 bg-blue-900/20">
                    <div className="flex items-center space-x-2 text-blue-400">
                      <GitCommit size={16} />
                      <span className="text-xs font-bold uppercase">AI Strategy Insight</span>
                    </div>
                    <button 
                      onClick={() => setShowDetail(false)}
                      className="text-slate-400 hover:text-slate-900 cursor-pointer"
                    >
                      <X size={16} />
                    </button>
                  </div>
                  <div className="p-5">
                    <p className="text-sm text-slate-900 leading-relaxed font-serif">
                      {currentEventData.strategy}
                    </p>
                    <div className="mt-4 flex gap-2">
                      <button 
                        onClick={handleCopy}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-[10px] font-bold text-slate-700 rounded border border-slate-300 cursor-pointer"
                      >
                        {isCopied ? 'ĐÃ SAO CHÉP' : 'SAO CHÉP LUẬN ĐIỂM'}
                      </button>
                      <button 
                        onClick={handleAdd}
                        className={`px-3 py-1.5 text-[10px] font-bold text-white rounded cursor-pointer transition ${isAdded ? 'bg-emerald-600 hover:bg-emerald-500' : 'bg-blue-600 hover:bg-blue-500'}`}
                      >
                        {isAdded ? 'ĐÃ ĐƯA VÀO ĐƠN' : 'ĐƯA VÀO ĐƠN KIỆN'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
