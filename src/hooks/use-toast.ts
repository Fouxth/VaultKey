// Custom hook สำหรับระบบ Toast notifications

import * as React from "react"
import type { ToastActionElement, ToastProps } from "@/components/ui/toast"

// ค่า constants
const TOAST_LIMIT = 1                    // จำนวน toast สูงสุดที่แสดงได้
const TOAST_REMOVE_DELAY = 1000000       // delay ก่อนลบ toast (in ms)

// Type สำหรับ Toast ที่มีข้อมูลเพิ่มเติม
type ToasterToast = ToastProps & {
    id: string                  // ID ของ toast
    title?: React.ReactNode     // หัวข้อ
    description?: React.ReactNode   // รายละเอียด
    action?: ToastActionElement     // action component
}

// Action types สำหรับ reducer
const actionTypes = {
    ADD_TOAST: "ADD_TOAST",
    UPDATE_TOAST: "UPDATE_TOAST",
    DISMISS_TOAST: "DISMISS_TOAST",
    REMOVE_TOAST: "REMOVE_TOAST",
} as const

// ตัวนับสำหรับสร้าง ID
let count = 0

// ฟังก์ชันสร้าง unique ID
function genId() {
    count = (count + 1) % Number.MAX_SAFE_INTEGER
    return count.toString()
}

// Types สำหรับ actions
type ActionType = typeof actionTypes

type Action =
    | {
          type: ActionType["ADD_TOAST"]
          toast: ToasterToast
      }
    | {
          type: ActionType["UPDATE_TOAST"]
          toast: Partial<ToasterToast>
      }
    | {
          type: ActionType["DISMISS_TOAST"]
          toastId?: ToasterToast["id"]
      }
    | {
          type: ActionType["REMOVE_TOAST"]
          toastId?: ToasterToast["id"]
      }

// Interface สำหรับ state
interface State {
    toasts: ToasterToast[]
}

// Map เก็บ timeouts ของ toasts
const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>()

// ฟังก์ชันเพิ่ม toast เข้า remove queue
const addToRemoveQueue = (toastId: string) => {
    if (toastTimeouts.has(toastId)) {
        return
    }

    const timeout = setTimeout(() => {
        toastTimeouts.delete(toastId)
        dispatch({
            type: "REMOVE_TOAST",
            toastId: toastId,
        })
    }, TOAST_REMOVE_DELAY)

    toastTimeouts.set(toastId, timeout)
}

// Reducer function สำหรับจัดการ state
export const reducer = (state: State, action: Action): State => {
    switch (action.type) {
        case "ADD_TOAST":
            return {
                ...state,
                toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
            }

        case "UPDATE_TOAST":
            return {
                ...state,
                toasts: state.toasts.map((t) =>
                    t.id === action.toast.id ? { ...t, ...action.toast } : t
                ),
            }

        case "DISMISS_TOAST": {
            const { toastId } = action

            // จัดการ side effects
            if (toastId) {
                addToRemoveQueue(toastId)
            } else {
                state.toasts.forEach((toast) => {
                    addToRemoveQueue(toast.id)
                })
            }

            return {
                ...state,
                toasts: state.toasts.map((t) =>
                    t.id === toastId || toastId === undefined
                        ? {
                              ...t,
                              open: false,
                          }
                        : t
                ),
            }
        }
        case "REMOVE_TOAST":
            if (action.toastId === undefined) {
                return {
                    ...state,
                    toasts: [],
                }
            }
            return {
                ...state,
                toasts: state.toasts.filter((t) => t.id !== action.toastId),
            }
    }
}

// Array เก็บ listeners
const listeners: Array<(state: State) => void> = []

// State ในหน่วยความจำ
let memoryState: State = { toasts: [] }

// ฟังก์ชัน dispatch สำหรับ update state
function dispatch(action: Action) {
    memoryState = reducer(memoryState, action)
    listeners.forEach((listener) => {
        listener(memoryState)
    })
}

type Toast = Omit<ToasterToast, "id">

function toast({ ...props }: Toast) {
  const id = genId()

  const update = (props: ToasterToast) =>
    dispatch({
      type: "UPDATE_TOAST",
      toast: { ...props, id },
    })
  const dismiss = () => dispatch({ type: "DISMISS_TOAST", toastId: id })

  dispatch({
    type: "ADD_TOAST",
    toast: {
      ...props,
      id,
      open: true,
      onOpenChange: (open) => {
        if (!open) dismiss()
      },
    },
  })

  return {
    id: id,
    dismiss,
    update,
  }
}

function useToast() {
  const [state, setState] = React.useState<State>(memoryState)

  React.useEffect(() => {
    listeners.push(setState)
    return () => {
      const index = listeners.indexOf(setState)
      if (index > -1) {
        listeners.splice(index, 1)
      }
    }
  }, [state])

  return {
    ...state,
    toast,
    dismiss: (toastId?: string) => dispatch({ type: "DISMISS_TOAST", toastId }),
  }
}

export { useToast, toast }
