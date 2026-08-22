export type Screen = 'input' | 'logic' | 'editor' | 'admin';

export type CaseCategory = 'Dân sự' | 'Hình sự' | 'Hành chính' | 'Đất đai' | 'Thương mại';

export type AIStatus = 'Hoàn tất trích xuất' | 'Đang chờ OCR' | 'Đang tổng hợp logic' | 'Đã khởi tạo';

export interface CaseData {
  id: string;
  code: string;
  clientName: string;
  category: CaseCategory;
  aiStatus: AIStatus;
  lastUpdated: string;
  progress: number;
  isActive: boolean;
  filingStatus: 'Pending' | 'Filed' | 'N/A';
  courtDate: string | null;
}

export type FileType = 'pdf' | 'video' | 'audio' | 'image' | 'handwritten';
export type FileStatus = 'uploading' | 'preprocessing' | 'htr_processing' | 'needs_correction' | 'verified' | 'pushed_d1';

export interface UploadedFile {
  id: string;
  name: string;
  type: FileType;
  status: FileStatus;
  progress: number;
  content?: string | null;
  fileDataUrl?: string | null;
}
