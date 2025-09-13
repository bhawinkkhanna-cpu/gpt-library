'use client'
import * as React from "react"

export function Dialog({ open, onOpenChange, children }: any) {
  const [isOpen, setIsOpen] = React.useState(!!open)
  React.useEffect(()=>{ setIsOpen(!!open) }, [open])
  const api = {
    open: isOpen,
    setOpen: (v: boolean) => { onOpenChange?.(v); setIsOpen(v) }
  }
  return <div data-open={isOpen}>{React.Children.map(children,(c:any)=>React.cloneElement(c,{api}))}</div>
}
export function DialogTrigger({ asChild, api, children }: any) {
  const child = React.Children.only(children)
  const props = { onClick: ()=>api.setOpen(true) }
  return asChild ? React.cloneElement(child, props) : <button onClick={()=>api.setOpen(true)}>{children}</button>
}
export function DialogContent({ api, children }: any) {
  if (!api.open) return null
  return <div className="fixed inset-0 z-50 flex items-center justify-center">
    <div className="absolute inset-0 bg-black/40" onClick={()=>api.setOpen(false)}></div>
    <div className="relative z-10 bg-white rounded-2xl p-4 w-[90%] max-w-lg shadow-lg">{children}</div>
  </div>
}
export const DialogHeader = ({ children }: any) => <div className="mb-2">{children}</div>
export const DialogTitle = ({ children }: any) => <h3 className="text-lg font-semibold">{children}</h3>
export const DialogFooter = ({ children }: any) => <div className="mt-4 flex justify-end gap-2">{children}</div>
