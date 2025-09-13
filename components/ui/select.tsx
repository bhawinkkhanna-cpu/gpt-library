'use client'
import * as React from "react"
export function Select({ value, onValueChange, children }: any) {
  // children contains SelectTrigger + SelectContent; we'll render a native select instead for simplicity
  const items: any[] = []
  React.Children.forEach(children, (c:any) => {
    if (c?.type?.displayName === 'SelectContent') {
      React.Children.forEach(c.props.children, (it:any) => {
        if (it?.type?.displayName === 'SelectItem') items.push(it.props)
      })
    }
  })
  return <select className="select" value={value} onChange={(e)=>onValueChange?.(e.target.value)}>
    {items.map((it, i) => <option key={i} value={it.value}>{it.children}</option>)}
  </select>
}
export const SelectTrigger = ({ children, className }: any) => <div className={className}>{children}</div>
export const SelectContent = ({ children }: any) => <>{children}</>
SelectContent.displayName = "SelectContent"
export const SelectItem = ({ value, children }: any) => <option value={value}>{children}</option>
SelectItem.displayName = "SelectItem"
export const SelectValue = () => null
