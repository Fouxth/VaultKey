// Interface สำหรับ Parameters ที่จะส่งไปยัง Ethereum Provider
interface RequestArguments {
  method: string                // ชื่อ Method ที่จะเรียกใช้
  params?: unknown[] | object   // Parameters ที่จะส่งไป
}

// Interface สำหรับ Ethereum Provider (เช่น MetaMask)
interface EthereumProvider {
  isMetaMask?: boolean         // ตัวบ่งชี้ว่าเป็น MetaMask หรือไม่
  request: (args: RequestArguments) => Promise<any>  // ฟังก์ชันสำหรับส่ง Request
  on(event: string, listener: (...args: any[]) => void): void  // ฟังก์ชันสำหรับ Listen Events
  removeListener(event: string, listener: (...args: any[]) => void): void  // ฟังก์ชันลบ Listener
}

// เพิ่ม Type ethereum ใน Window Object
interface Window {
  ethereum?: EthereumProvider  // Provider จะถูกติดตั้งที่ window.ethereum
}