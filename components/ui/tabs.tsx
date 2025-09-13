'use client'
import * as React from "react"

export function Tabs({ defaultValue, children, className }: { defaultValue: string, children: React.ReactNode, className?: string }) {
  const [value, setValue] = React.useState(defaultValue)
  return <div className={className} data-value={value}>
    {React.Children.map(children, (child: any) => {
      if (child?.type?.displayName === "TabsList") return React.cloneElement(child, { value, setValue })
      if (child?.type?.displayName === "TabsContent") return React.cloneElement(child, { value })
      return child
    })}
  </div>
}
export function TabsList({ children, value, setValue }: any) {
  return <div className="tablist">
    {React.Children.map(children, (child: any) => React.cloneElement(child, { value, setValue }))}
  </div>
}
TabsList.displayName = "TabsList"
export function TabsTrigger({ value: v, value: _v2, setValue, children }: any) {
  return <button className="tabtrigger" data-active={_v2===v} onClick={()=>setValue(v)}>{children}</button>
}
export function TabsContent({ value, value: my, children, className }: any) {
  if (value !== my) return null
  return <div className={className}>{children}</div>
}
TabsContent.displayName = "TabsContent"
