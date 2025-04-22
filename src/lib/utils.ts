// นำเข้าฟังก์ชันและ type ที่จำเป็น
import { clsx, type ClassValue } from "clsx"     // import library สำหรับจัดการ CSS Classes
import { twMerge } from "tailwind-merge"         // import library สำหรับ Merge Tailwind Classes

// ฟังก์ชัน cn สำหรับรวม class names เข้าด้วยกัน
// ใช้ clsx และ twMerge เพื่อจัดการ className ให้ไม่ซ้ำซ้อนและมีประสิทธิภาพ
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}