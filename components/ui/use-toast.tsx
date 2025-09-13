'use client'
import * as React from "react"

type Toast = { title?: string; description?: string; variant?: 'default'|'destructive' }
const Ctx = React.createContext<{ push: (t:Toast)=>void } | null>(null)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [list, setList] = React.useState<Toast[]>([])
  const push = (t: Toast) => {
    setList(prev => [...prev, t])
    setTimeout(()=> setList(prev => prev.slice(1)), 2200)
  }
  return <Ctx.Provider value={{ push }}>
    {children}
    <div className="toast-wrap">
      {list.map((t,i)=>(
        <div key={i} className="toast" data-variant={t.variant||'default'}>
          {t.title && <div className="font-semibold">{t.title}</div>}
          {t.description && <div>{t.description}</div>}
        </div>
      ))}
    </div>
  </Ctx.Provider>
}

export function useToast() {
  const ctx = React.useContext(Ctx)
  return { toast: ({ title, description, variant }: Toast) => ctx?.push({ title, description, variant }) }
}
