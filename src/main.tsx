// นำเข้าโมดูลที่จำเป็น
import { createRoot } from "react-dom/client" // นำเข้า createRoot จาก react-dom/client
import App from "./App.tsx"                   // นำเข้า App component หลัก
import "./index.css"                          // นำเข้า global CSS styles

// สร้าง root และ render แอปพลิเคชัน
createRoot(document.getElementById("root")!).render(<App />)