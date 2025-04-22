// นำเข้าโมดูลที่จำเป็นสำหรับการกำหนดค่า Vite
import { defineConfig } from "vite"
import react from "@vitejs/plugin-react-swc"
import path from "path"

// กำหนดค่าการตั้งค่าของ Vite
export default defineConfig(async ({ mode }) => {
  let componentTaggerPlugin

  // ถ้าอยู่ในโหมด development ให้โหลด lovable-tagger plugin
  if (mode === "development") {
    const mod = await import("lovable-tagger")
    componentTaggerPlugin = mod.componentTagger()
  }

  // ส่งคืนการตั้งค่าทั้งหมด
  return {
    // ตั้งค่า server
    server: {
      host: "::", // รองรับการเข้าถึงจากทุก IP
      port: 8080, // กำหนดพอร์ตเป็น 8080
    },
    // กำหนด plugins ที่ใช้
    plugins: [react(), mode === "development" && componentTaggerPlugin].filter(Boolean),
    // ตั้งค่า alias path สำหรับการ import
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"), // กำหนดให้ @ แทนที่ path ไปยัง ./src
      },
    },
  }
})