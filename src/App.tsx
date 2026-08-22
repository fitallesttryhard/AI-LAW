/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { DataInputScreen } from './screens/DataInputScreen';
import { LogicEngineScreen } from './screens/LogicEngineScreen';
import { AIEditorScreen } from './screens/AIEditorScreen';
import { AdminDashboardScreen } from './screens/AdminDashboardScreen';
import { CaseDashboardScreen } from './screens/CaseDashboardScreen';
import { Screen, CaseData, UploadedFile } from './types';
import { mockCases } from './data/mockCases';

export default function App() {
  const [cases, setCases] = useState<CaseData[]>(mockCases);
  const [globalView, setGlobalView] = useState<'dashboard' | 'case' | 'admin'>('dashboard');
  const [currentScreen, setCurrentScreen] = useState<Screen>('input');
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null);

  const [caseFiles, setCaseFiles] = useState<Record<string, UploadedFile[]>>({
    'CASE-001': [
      { id: '1', name: 'DiChuc_VietTay_1993.jpg', type: 'handwritten', status: 'needs_correction', progress: 100, content: '[Nội dung trích xuất từ PDF...]\nCỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM\nĐộc lập - Tự do - Hạnh phúc\n\nĐƠN KHỞI KIỆN\n\n...để lại toàn bộ thủa đát sổ 4S, tờ bản đồ 02 cho con trai là Nguyễn Văn Ánh...' },
      { id: '2', name: 'Video_HienTruong.mp4', type: 'video', status: 'verified', progress: 100 },
      { id: '3', name: 'Audio_GhiAm_02.mp3', type: 'audio', status: 'verified', progress: 100 },
    ],
  });

  const handleSelectCase = (caseId: string) => {
    setSelectedCaseId(caseId);
    setGlobalView('case');
  };

  const handleBackToDashboard = () => {
    setSelectedCaseId(null);
    setGlobalView('dashboard');
  };

  if (globalView === 'admin') {
    return (
      <div className="h-screen w-full relative flex flex-col bg-slate-50">
        <div className="absolute top-4 right-4 z-50">
          <button 
            onClick={() => setGlobalView('dashboard')}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-900 text-xs font-bold uppercase tracking-wider rounded-lg border border-slate-300 transition"
          >
            ĐÓNG QUẢN TRỊ
          </button>
        </div>
        <AdminDashboardScreen />
      </div>
    );
  }

  if (globalView === 'dashboard') {
    return (
      <CaseDashboardScreen 
        cases={cases} 
        setCases={setCases}
        onSelectCase={handleSelectCase} 
        onOpenAdmin={() => setGlobalView('admin')} 
      />
    );
  }

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 font-sans overflow-hidden">
      <Sidebar 
        currentScreen={currentScreen} 
        onNavigate={setCurrentScreen} 
        onBackToDashboard={handleBackToDashboard}
      />
      <main className="flex-1 overflow-hidden p-4">
        {currentScreen === 'input' && <DataInputScreen selectedCaseId={selectedCaseId} cases={cases} onCaseChange={setSelectedCaseId} caseFiles={caseFiles} setCaseFiles={setCaseFiles} />}
        {currentScreen === 'logic' && <LogicEngineScreen selectedCaseId={selectedCaseId} caseFiles={caseFiles} />}
        {currentScreen === 'editor' && <AIEditorScreen selectedCaseId={selectedCaseId} caseFiles={caseFiles} />}
      </main>
    </div>
  );
}
