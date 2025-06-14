import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Settings, Plus, Trash, Save, Clock, Image as ImageIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { ImageEnhancer } from "./image-enhancer"
import type { MenuItem, VariantManagerProps, Variant, Addon, Availability } from "@/types/restaurant"
import { Label } from "@/components/ui/label"
import { ImagePlus } from "lucide-react"

export function VariantManager({ item, onUpdate }: VariantManagerProps) {
  const [open, setOpen] = useState(false)
  const [variants, setVariants] = useState<Variant[]>(item.variants || [])
  const [addons, setAddons] = useState<Addon[]>(item.addons || [])
  const [availability, setAvailability] = useState<Availability>(
    item.availability || {
      enabled: false,
      schedule: {
        days: [],
        startTime: "09:00",
        endTime: "17:00"
      }
    }
  )
  const [image, setImage] = useState(item.image)

  const handleSave = () => {
    onUpdate({
      variants,
      addons,
      availability,
      image
    })
    setOpen(false)
  }

  const handleAddVariant = () => {
    setVariants([
      ...variants,
      { name: "", price: 0, available: true }
    ])
  }

  const handleAddAddon = () => {
    setAddons([
      ...addons,
      { name: "", price: 0, available: true }
    ])
  }

  const handleVariantChange = (index: number, field: keyof Variant, value: string | number | boolean) => {
    setVariants(prev => prev.map((variant, i) => 
      i === index ? { ...variant, [field]: value } : variant
    ))
  }

  const handleAddonChange = (index: number, field: keyof Addon, value: string | number | boolean) => {
    setAddons(prev => prev.map((addon, i) => 
      i === index ? { ...addon, [field]: value } : addon
    ))
  }

  const renderVariantForm = (items: (Variant | Addon)[], onChange: (index: number, field: keyof (Variant | Addon), value: any) => void) => (
    <div className="space-y-4 mt-4">
      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-4">
          <Input
            placeholder="Name"
            value={item.name}
            onChange={(e) => onChange(index, "name", e.target.value)}
            className="flex-1"
          />
          <Input
            type="number"
            placeholder="Price"
            value={item.price}
            onChange={(e) => onChange(index, "price", Number(e.target.value))}
            className="w-24"
          />
          <Switch
            checked={item.available}
            onCheckedChange={(checked) => onChange(index, "available", checked)}
          />
        </div>
      ))}
    </div>
  )

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-3 top-3 bg-white/90 hover:bg-white shadow-sm z-10"
        onClick={() => setOpen(true)}
        data-variant-manager={item._id}
      >
        <Settings className="w-4 h-4" />
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Manage Item Settings</DialogTitle>
          </DialogHeader>

          <Tabs defaultValue="variants" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="variants" className="gap-2">
                <Settings className="w-4 h-4" />
                Variants
              </TabsTrigger>
              <TabsTrigger value="addons" className="gap-2">
                <Plus className="w-4 h-4" />
                Add-ons
              </TabsTrigger>
              <TabsTrigger value="availability" className="gap-2">
                <Clock className="w-4 h-4" />
                Availability
              </TabsTrigger>
              <TabsTrigger value="image" className="gap-2">
                <ImageIcon className="w-4 h-4" />
                Image
              </TabsTrigger>
            </TabsList>

            <ScrollArea className="h-[400px] mt-4 pr-4">
              <TabsContent value="variants">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Size & Price Variants</h4>
                    <p className="text-sm text-muted-foreground mb-4">
                      Add different size options with their respective prices.
                    </p>
                    <Button onClick={handleAddVariant}>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Variant
                    </Button>
                  </div>
                  {renderVariantForm(variants, handleVariantChange)}
                </div>
              </TabsContent>

              <TabsContent value="addons">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Optional Add-ons</h4>
                    <p className="text-sm text-muted-foreground mb-4">
                      Add optional toppings or extras that customers can choose.
                    </p>
                    <Button onClick={handleAddAddon}>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Add-on
                    </Button>
                  </div>
                  {renderVariantForm(addons, handleAddonChange)}
                </div>
              </TabsContent>

              <TabsContent value="availability">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Time-limited Availability</h4>
                    <p className="text-sm text-muted-foreground mb-4">
                      Set specific times when this item is available.
                    </p>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="availability">Enable time-limited availability</Label>
                        <Switch
                          id="availability"
                          checked={availability.enabled}
                          onCheckedChange={(checked) =>
                            setAvailability((prev: Availability) => ({
                              ...prev,
                              enabled: checked,
                            }))
                          }
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="image">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Item Image</h4>
                    <p className="text-sm text-muted-foreground mb-4">
                      Upload or update the item's image.
                    </p>
                    <div className="flex items-center gap-4">
                      <div className="relative aspect-[4/3] w-40 rounded-lg overflow-hidden bg-muted">
                        {image ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={image}
                            alt={item.name}
                            className="object-cover w-full h-full"
                          />
                        ) : (
                          <div className="flex items-center justify-center w-full h-full">
                            <ImagePlus className="w-8 h-8 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                      <Button
                        variant="outline"
                        onClick={() => {
                          // Handle image upload
                        }}
                      >
                        <ImagePlus className="w-4 h-4 mr-2" />
                        Upload Image
                      </Button>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </ScrollArea>
          </Tabs>

          <div className="flex justify-end gap-4 mt-4">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>Save Changes</Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
} 