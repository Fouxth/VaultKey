import * as React from "react"  // นำเข้า React

const MOBILE_BREAKPOINT = 768  // กำหนดจุดแบ่งขนาดหน้าจอสำหรับ mobile

// Hook สำหรับตรวจสอบว่าเป็น mobile device หรือไม่
export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)  // state เก็บสถานะ mobile

  React.useEffect(() => {  // effect สำหรับตรวจจับการเปลี่ยนแปลงขนาดหน้าจอ
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)  // สร้าง media query
    
    const onChange = () => {  // ฟังก์ชันเมื่อมีการเปลี่ยนแปลง
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    
    mql.addEventListener("change", onChange)  // เพิ่ม event listener
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)  // เซ็ตค่าเริ่มต้น
    
    return () => mql.removeEventListener("change", onChange)  // cleanup
  }, [])

  return !!isMobile  // return สถานะ mobile
}