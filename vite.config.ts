import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig(() => {
  return {
    // THÊM DÒNG NÀY VÀO: Đặt tên base path trùng với tên repository của bạn
    base: '/AI-LAW/', 
    
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    // ... các cấu hình server khác giữ nguyên
  };
});
