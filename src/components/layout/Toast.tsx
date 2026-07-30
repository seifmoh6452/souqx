import { useState, useCallback, createContext, useContext, type ReactNode } from 'react'

interface Toast {
  id: number
  message: string
}

interface ToastCtx {
  show: (msg: string) => void
}

const Ctx = createContext<ToastCtx>({ show: () => {} })
export const useToast = () => useContext(Ctx)

let nextId = 0

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const show = useCallback((message: string) => {
    const id = ++nextId
    setToasts(prev => [...prev, { id, message }])
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 2500)
  }, [])

  return (
    <Ctx.Provider value={{ show }}>
      {children}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[999] flex flex-col gap-2 items-center pointer-events-none">
        {toasts.map(t => (
          <div
            key={t.id}
            className="px-5 py-3 bg-accent text-bg font-bold rounded-2xl text-sm shadow-lg animate-[fadeInUp_0.3s_ease-out] pointer-events-auto"
          >
            {t.message}
          </div>
        ))}
      </div>
    </Ctx.Provider>
  )
}
