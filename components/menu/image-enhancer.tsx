import { useState } from 'react'
import Image from 'next/image'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { 
  SunMedium, 
  Crop, 
  Wand2, 
  Grid, 
  Sparkles,
  Image as ImagePlus,
  LucideIcon
} from "lucide-react"
import { cn } from "@/lib/utils"
import { createLogger } from '@/lib/logger'

const logger = createLogger('image-enhancer')

interface ImageEnhancerProps {
  imageUrl: string
  onSave: (enhancedImage: string) => void
  trigger?: React.ReactNode
}

interface Enhancement {
  id: string
  label: string
  icon: LucideIcon
  value: number
}

export function ImageEnhancer({ imageUrl, onSave, trigger }: ImageEnhancerProps) {
  const [isEnhancing, setIsEnhancing] = useState(false)
  const [previewUrl, setPreviewUrl] = useState(imageUrl)
  const [useAiBackground, setUseAiBackground] = useState(false)
  const [enhancements, setEnhancements] = useState<Enhancement[]>([
    { id: 'brightness', label: 'Brightness', icon: SunMedium, value: 100 },
    { id: 'contrast', label: 'Contrast', icon: Grid, value: 100 },
  ])

  const handleEnhancementChange = (id: string, newValue: number) => {
    setEnhancements(prev => 
      prev.map(e => e.id === id ? { ...e, value: newValue } : e)
    )
    // In a real app, apply the enhancement in real-time
    applyEnhancements()
  }

  const applyEnhancements = async () => {
    // In a real app, this would use a proper image processing library or API
    // For now, we'll just simulate the changes
    logger.debug('Applying image enhancements', { enhancements });
  }

  const handleAiEnhance = async () => {
    setIsEnhancing(true)
    try {
      // In a real app, call your AI image enhancement API here
      await new Promise(resolve => setTimeout(resolve, 1500)) // Simulate API call
      setPreviewUrl(imageUrl) // Replace with enhanced image URL
    } finally {
      setIsEnhancing(false)
    }
  }

  const handleSave = () => {
    onSave(previewUrl)
  }

  const renderSuggestions = () => (
    <div className="grid grid-cols-2 gap-3 mb-6">
      <Button 
        variant="outline" 
        className="flex flex-col items-center justify-center h-24 gap-2"
        onClick={() => {/* Apply crop suggestion */}}
      >
        <Crop className="h-8 w-8 text-muted-foreground" />
        <span className="text-sm">Crop to center</span>
      </Button>
      <Button 
        variant="outline"
        className="flex flex-col items-center justify-center h-24 gap-2"
        onClick={() => handleEnhancementChange('brightness', 120)}
      >
        <SunMedium className="h-8 w-8 text-muted-foreground" />
        <span className="text-sm">Auto-brighten</span>
      </Button>
      <Button 
        variant="outline"
        className={cn(
          "flex flex-col items-center justify-center h-24 gap-2",
          useAiBackground && "border-orange-500 bg-orange-50"
        )}
        onClick={() => setUseAiBackground(!useAiBackground)}
      >
        <Wand2 className="h-8 w-8 text-muted-foreground" />
        <span className="text-sm">Use AI background</span>
      </Button>
      <Button 
        variant="outline"
        className="flex flex-col items-center justify-center h-24 gap-2 relative"
        onClick={handleAiEnhance}
        disabled={isEnhancing}
      >
        <Sparkles className="h-8 w-8 text-muted-foreground" />
        <span className="text-sm">AI-enhance image</span>
        {isEnhancing && (
          <div className="absolute inset-0 bg-white/50 flex items-center justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-500" />
          </div>
        )}
      </Button>
    </div>
  )

  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="ghost" size="sm" className="absolute top-2 right-2">
            <ImagePlus className="h-4 w-4" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Enhance Image</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Image preview */}
          <div className="relative aspect-video rounded-lg overflow-hidden bg-black/5">
            <Image
              src={previewUrl}
              alt="Preview"
              fill
              className="object-contain"
            />
            {isEnhancing && (
              <div className="absolute inset-0 bg-white/50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500" />
              </div>
            )}
          </div>

          {/* AI Suggestions */}
          {renderSuggestions()}

          {/* Manual adjustments */}
          <div className="space-y-4">
            <h4 className="font-medium text-sm">Fine-tune</h4>
            {enhancements.map(({ id, label, icon: Icon, value }) => (
              <div key={id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{label}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">{value}%</span>
                </div>
                <Slider
                  value={[value]}
                  min={0}
                  max={200}
                  step={1}
                  onValueChange={(values: number[]) => handleEnhancementChange(id, values[0])}
                />
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => {
              setPreviewUrl(imageUrl)
              setEnhancements(prev => prev.map(e => ({ ...e, value: 100 })))
              setUseAiBackground(false)
            }}>
              Reset
            </Button>
            <Button onClick={handleSave}>
              Save Changes
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 