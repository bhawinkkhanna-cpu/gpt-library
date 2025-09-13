'use client'
import * as React from "react"
export function Switch({ checked, onCheckedChange }: { checked?: boolean, onCheckedChange?: (v:boolean)=>void }) {
  return <button className="switch" data-checked={checked} onClick={()=>onCheckedChange?.(!checked)}>
    <span className="switch-knob" />
  </button>
}
