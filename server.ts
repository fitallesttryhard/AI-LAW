import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import fs from "fs";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // API Middleware
  app.use(express.json());

  // Mock/Proxy endpoint for HCM LGSP Sync
  app.post("/api/lgsp/sync", async (req, res) => {
    try {
      // In a real scenario, this is where you'd use the provided AccessKey & SecretKey.
      // const accessKey = process.env.HCM_LGSP_ACCESS_KEY;
      // const secretKey = process.env.HCM_LGSP_SECRET_KEY;
      
      // We will proxy a call to the actual public portal API you provided
      const targetUrl = "https://api.tphcm.gov.vn/ChiTietLgsp/moduleId/1590/id/392/controller/LGSP/action/ChiTietLoaiDichVu";
      
      const response = await fetch(targetUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "User-Agent": "Mozilla/5.0",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Read a bit of the text to simulate metadata fetching
      const text = await response.text();
      
      // Simulate processing the response
      const timestamp = new Date().toISOString();
      
      // Send a successful JSON response back to the frontend
      res.json({
        success: true,
        message: "Đồng bộ thành công từ CSDL Quốc gia",
        timestamp: timestamp,
        data: {
          syncedCount: 15420, // Mock count
          connectionUrl: targetUrl,
          // Sending a snippet just to show it reached the server
          snippet: text.substring(0, 100).replace(/<[^>]*>?/gm, "").trim(),
        }
      });

    } catch (error) {
      console.error("API Sync Error:", error);
      res.status(500).json({ 
        success: false, 
        message: "Lỗi kết nối đến Nền tảng HCM LGSP",
        error: String(error)
      });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Production serving
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
