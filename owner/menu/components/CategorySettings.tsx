import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Plus, Trash2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Category, AddOn, CATEGORY_SETTINGS } from '../constants';

interface CategorySettingsProps {
  category: Category;
  isOpen: boolean;
  onClose: () => void;
  onSave: (addOns: AddOn[]) => Promise<void>;
}

export function CategorySettings({ category, isOpen, onClose, onSave }: CategorySettingsProps) {
  const settings = CATEGORY_SETTINGS[category];
  const [addOns, setAddOns] = useState<AddOn[]>(settings.availableAddOns || []);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddAddOn = () => {
    const id = `addon-${Date.now()}`;
    setAddOns(prev => [...prev, { id, name: '', price: 0 }]);
  };

  const handleRemoveAddOn = (id: string) => {
    setAddOns(prev => prev.filter(addon => addon.id !== id));
  };

  const handleUpdateAddOn = (id: string, field: keyof AddOn, value: string | number) => {
    setAddOns(prev => prev.map(addon => {
      if (addon.id === id) {
        return { ...addon, [field]: value };
      }
      return addon;
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate add-ons
    const invalidAddOns = addOns.filter(addon => !addon.name.trim() || addon.price < 0);
    if (invalidAddOns.length > 0) {
      toast.error('Please fill in all add-on details correctly');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSave(addOns);
      toast.success(`${category} add-ons updated successfully`);
      onClose();
    } catch (error) {
      toast.error('Failed to update add-ons');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] h-[90vh] flex flex-col p-0">
        <div className="px-6 py-6 border-b">
          <DialogHeader>
            <DialogTitle>{category} Settings</DialogTitle>
            <DialogDescription>
              Manage global add-ons for {category.toLowerCase()}. These will be available as defaults for all new items in this category.
            </DialogDescription>
          </DialogHeader>
        </div>

        <ScrollArea className="flex-1 px-6">
          <div className="py-6">
            <form id="category-settings-form" onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label>Add-ons</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleAddAddOn}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add New
                  </Button>
                </div>

                <div className="space-y-4">
                  {addOns.length > 0 ? (
                    addOns.map((addon) => (
                      <div key={addon.id} className="flex items-end gap-4 group">
                        <div className="flex-1 space-y-2">
                          <Label>Name</Label>
                          <Input
                            value={addon.name}
                            onChange={(e) => handleUpdateAddOn(addon.id, 'name', e.target.value)}
                            placeholder="Add-on name"
                          />
                        </div>
                        <div className="w-32 space-y-2">
                          <Label>Price</Label>
                          <Input
                            type="number"
                            min="0"
                            step="0.01"
                            value={addon.price}
                            onChange={(e) => handleUpdateAddOn(addon.id, 'price', parseFloat(e.target.value) || 0)}
                          />
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => handleRemoveAddOn(addon.id)}
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 border-2 border-dashed rounded-lg">
                      <p className="text-sm text-muted-foreground">No add-ons configured</p>
                      <Button
                        type="button"
                        variant="link"
                        onClick={handleAddAddOn}
                      >
                        Add your first add-on
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </form>
          </div>
        </ScrollArea>

        <div className="px-6 py-4 border-t bg-background">
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              form="category-settings-form"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
} 