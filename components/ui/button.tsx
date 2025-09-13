import * as React from "react"
import clsx from "clsx"

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "outline" | "destructive"
  size?: "default" | "sm"
}
export function Button({ className, variant="default", size="default", ...props }: Props) {
  return (
    <button
      className={clsx("btn",
        variant==="default" && "btn-default",
        variant==="outline" && "btn-outline",
        variant==="destructive" && "btn-destructive",
        size==="sm" && "px-2 py-1 text-xs rounded-lg",
        className
      )}
      {...props}
    />
  )
}
