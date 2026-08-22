import { CaseData } from '../types';

export const mockCases: CaseData[] = [
  { id: 'case-1', code: '2024-TC01', clientName: 'Nguyễn Văn Ánh', category: 'Đất đai', aiStatus: 'Đang tổng hợp logic', lastUpdated: '17/08/2026', progress: 65, isActive: true, filingStatus: 'Pending', courtDate: '25/08/2026' },
  { id: 'case-2', code: '2024-HS02', clientName: 'Trần Thị B', category: 'Hình sự', aiStatus: 'Đang chờ OCR', lastUpdated: '16/08/2026', progress: 30, isActive: true, filingStatus: 'N/A', courtDate: '05/09/2026' },
  { id: 'case-3', code: '2024-DS03', clientName: 'Lê Văn C', category: 'Dân sự', aiStatus: 'Hoàn tất trích xuất', lastUpdated: '15/08/2026', progress: 95, isActive: true, filingStatus: 'Filed', courtDate: null },
  { id: 'case-4', code: '2024-HC04', clientName: 'Công ty TNHH XYZ', category: 'Hành chính', aiStatus: 'Đã khởi tạo', lastUpdated: '14/08/2026', progress: 10, isActive: false, filingStatus: 'Pending', courtDate: null },
];

