"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner, ToasterProps } from "sonner"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          success: "!bg-green-50 !border-none !outline-none !ring-0 !shadow-none !text-green-600",
          error: "!bg-red-50 !border-none !outline-none !ring-0 !shadow-none !text-red-600", 
          warning: "!bg-yellow-50 !border-none !outline-none !ring-0 !shadow-none !text-yellow-600",
          info: "!bg-blue-50 !border-none !outline-none !ring-0 !shadow-none !text-blue-600",
          toast: "!bg-background !border-border !text-foreground",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
