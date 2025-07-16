import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"

interface CustomTabsProps<T extends string> {
  value: T
  onValueChange: (value: T) => void
  children: React.ReactNode
  className?: string
}

export function CustomTabs<T extends string>({ 
  value, 
  onValueChange, 
  children, 
  className 
}: CustomTabsProps<T>) {
  return (
    <TabsPrimitive.Root
      value={value}
      onValueChange={(newValue: string) => {
        onValueChange(newValue as T)
      }}
      className={className}
    >
      {children}
    </TabsPrimitive.Root>
  )
}

export { TabsList, TabsTrigger, TabsContent } from "./tabs"