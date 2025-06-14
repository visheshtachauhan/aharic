"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  ImagePlus, 
  Star, 
  Flame,
  ChevronDown,
  Utensils,
  Tag,
  ArrowUpDown,
  Settings,
  Check,
  Cookie,
  Soup,
  Salad,
  CircleDot,
  Coffee,
  UtensilsCrossed
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
  DialogDescription
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { ImageUpload } from '@/components/ui/image-upload';
import { useToast } from "@/components/ui/use-toast";
import { MenuItemCard } from '@/components/menu/menu-item-card';
import type { MenuItem } from '@/types/menu';
import { supabase } from '@/lib/supabase';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const categories = [
  "Appetizers",
  "Main Course",
  "Pizza & Pasta",
  "Indian Breads",
  "Rice & Biryani",
  "Chinese",
  "Beverages",
  "Desserts",
  "Soups",
  "Salads",
  "Sides",
  "Specials",
  "Combos"
];

const categoryIcons = {
  'Appetizers': Cookie,
  'Main Course': UtensilsCrossed,
  'Pizza & Pasta': CircleDot,
  'Indian Breads': Cookie,
  'Rice & Biryani': Utensils,
  'Chinese': Utensils,
  'Beverages': Coffee,
  'Desserts': Cookie,
  'Soups': Soup,
  'Salads': Salad,
  'Sides': Utensils,
  'Specials': Star,
  'Combos': Tag
} as const;

export function MenuManagement() {
  const { toast } = useToast();
  const [items, setItems] = useState<MenuItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [currentTab, setCurrentTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [view, setView] = useState<'grid' | 'list' | 'category'>('grid');

  // New menu item form state
  const [newItem, setNewItem] = useState<Partial<MenuItem>>({
    name: "",
    description: "",
    price: 0,
    category: "Appetizers",
    image: "",
    isVeg: false,
    popular: false,
    spicyLevel: 1,
    rating: 0,
    reviews: 0,
    available: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });

  useEffect(() => {
    checkAuth();
    fetchItems();
  }, []);

  const checkAuth = async () => {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) throw error;
      setIsAuthenticated(!!user);
      setUser(user);
    } catch (error) {
      console.error('Error checking auth:', error);
      setIsAuthenticated(false);
      setUser(null);
    }
  };

  const fetchItems = async () => {
    try {
      console.log("Fetching menu items...");
      const response = await fetch("/api/menu");
      if (!response.ok) {
        throw new Error("Failed to fetch menu items");
      }
      const data = await response.json();
      console.log("Fetched data:", data);
      setItems(data);
      setFilteredItems(data);
    } catch (error) {
      console.error("Error fetching menu items:", error);
      toast({
        title: "Error",
        description: "Failed to load menu items",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Apply filters to items
  const handleFilter = () => {
    const filtered = items.filter((item) => {
      // Add a check to ensure item is a valid object before accessing properties
      if (!item || typeof item !== 'object') {
        console.warn('Invalid item found in items array:', item);
        return false; // Exclude invalid items
      }
      
      const matchesSearch = searchQuery.trim() === '' || 
        (item.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
        item.description?.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesCategory = !selectedCategory || item.category === selectedCategory;
      
      const matchesTab = 
        (currentTab === "all") || 
        (currentTab === "vegetarian" && item.isVeg) ||
        (currentTab === "popular" && item.popular) ||
        (currentTab === "spicy" && item.spicyLevel && item.spicyLevel > 1);
      
      return matchesSearch && matchesCategory && matchesTab;
    });

    setFilteredItems(filtered);
  };

  // Update filtered items when search query or filters change
  useEffect(() => {
    handleFilter();
  }, [searchQuery, selectedCategory, currentTab, items]);

  // Group items by category
  const groupedItems = filteredItems.reduce<Record<string, MenuItem[]>>((acc, item) => {
    if (!item || typeof item !== 'object') return acc;
    
    const category = item.category || 'Uncategorized';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(item);
    return acc;
  }, {});

  // Sort categories alphabetically
  const sortedCategories = Object.keys(groupedItems).sort();

  // Handle editing an item
  const handleEdit = (item: MenuItem) => {
    setEditingItem({...item});
  };

  // Handle saving an edited item
  const handleSave = async () => {
    if (!editingItem) return;

    try {
      // Validate required fields
      if (!editingItem.name?.trim()) {
        toast({
          title: "Error",
          description: "Name is required",
          variant: "destructive"
        });
        return;
      }

      if (!editingItem.category) {
        toast({
          title: "Error",
          description: "Category is required",
          variant: "destructive"
        });
        return;
      }

      if (typeof editingItem.price !== 'number' || isNaN(editingItem.price) || editingItem.price < 0) {
        toast({
          title: "Error",
          description: "Valid price is required",
          variant: "destructive"
        });
        return;
      }

      const response = await fetch(`/api/menu/${editingItem._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...editingItem,
          updatedAt: new Date().toISOString()
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to update menu item");
      }

      const updatedItem = await response.json();
      setItems(items.map((item) => (item._id === updatedItem._id ? updatedItem : item)));
      setFilteredItems(filteredItems.map((item) => (item._id === updatedItem._id ? updatedItem : item)));
      setEditingItem(null);
      toast({
        title: "Success",
        description: "Menu item updated successfully"
      });
    } catch (error) {
      console.error("Error updating menu item:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update menu item",
        variant: "destructive"
      });
    }
  };

  // Handle deleting an item
  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/menu/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete menu item");
      }

      setItems(items.filter((item) => item._id !== id));
      setFilteredItems(filteredItems.filter((item) => item._id !== id));
      toast({
        title: "Success",
        description: "Menu item deleted successfully"
      });
    } catch (error) {
      console.error("Error deleting menu item:", error);
      toast({
        title: "Error",
        description: "Failed to delete menu item",
        variant: "destructive"
      });
    }
  };

  // Handle adding a new item
  const handleAdd = async (newItem: Partial<MenuItem>) => {
    try {
      // Validate required fields
      if (!newItem.name?.trim()) {
        toast({
          title: "Error",
          description: "Name is required",
          variant: "destructive"
        });
        return;
      }

      if (!newItem.category) {
        toast({
          title: "Error",
          description: "Category is required",
          variant: "destructive"
        });
        return;
      }

      if (typeof newItem.price !== 'number' || isNaN(newItem.price) || newItem.price < 0) {
        toast({
          title: "Error",
          description: "Valid price is required",
          variant: "destructive"
        });
        return;
      }

      const response = await fetch("/api/menu", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...newItem,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to add menu item");
      }

      const addedItem = await response.json();
      setItems([...items, addedItem]);
      setFilteredItems([...filteredItems, addedItem]);
      setNewItem({
        name: "",
        description: "",
        price: 0,
        category: "Appetizers",
        image: "",
        isVeg: false,
        popular: false,
        spicyLevel: 1,
        rating: 0,
        reviews: 0,
        available: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      toast({
        title: "Success",
        description: "Menu item added successfully"
      });
    } catch (error) {
      console.error("Error adding menu item:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to add menu item",
        variant: "destructive"
      });
    }
  };

  // Handle drag and drop reordering
  const handleReorder = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(filteredItems);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setItems(items);
    setFilteredItems(items);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <div className="flex-1 w-full md:w-auto">
              <Input
                type="search"
                placeholder="Search items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
            </div>
            
            <div className="flex items-center gap-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-2 min-w-[200px] justify-between">
                    <div className="flex items-center gap-2">
                      {(() => {
                        const Icon = categoryIcons[selectedCategory as keyof typeof categoryIcons];
                        return Icon ? <Icon className="w-4 h-4" /> : null;
                      })()}
                      {selectedCategory || "All Categories"}
                    </div>
                    <ChevronDown className="w-4 h-4 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[200px] max-h-[400px] overflow-y-auto">
                  <DropdownMenuItem onClick={() => setSelectedCategory(null)}>
                    All Categories
                  </DropdownMenuItem>
                  {categories.map((category) => {
                    const Icon = categoryIcons[category as keyof typeof categoryIcons];
                    return (
                      <DropdownMenuItem 
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className="flex items-center justify-between py-2"
                      >
                        <div className="flex items-center gap-2">
                          {Icon && <Icon className="w-4 h-4" />}
                          <span>{category}</span>
                        </div>
                        {selectedCategory === category && (
                          <Check className="w-4 h-4" />
                        )}
                      </DropdownMenuItem>
                    );
                  })}
                </DropdownMenuContent>
              </DropdownMenu>

              <Tabs value={currentTab} onValueChange={setCurrentTab}>
                <TabsList>
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="vegetarian">Vegetarian</TabsTrigger>
                  <TabsTrigger value="popular">Popular</TabsTrigger>
                  <TabsTrigger value="spicy">Spicy</TabsTrigger>
                </TabsList>
              </Tabs>

              <Dialog open={!!editingItem} onOpenChange={() => setEditingItem(null)}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    {editingItem ? "Edit Item" : "Add New Item"}
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader className="sticky top-0 bg-background z-10 pb-4">
                    <DialogTitle>
                      {editingItem ? "Edit Menu Item" : "Add Menu Item"}
                    </DialogTitle>
                    <DialogDescription>
                      {editingItem ? "Edit the details of the menu item." : "Add a new menu item to your menu."}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input
                          id="name"
                          value={editingItem?.name || newItem.name}
                          onChange={(e) => {
                            if (editingItem) {
                              setEditingItem({ ...editingItem, name: e.target.value });
                            } else {
                              setNewItem({ ...newItem, name: e.target.value });
                            }
                          }}
                          placeholder="Enter item name"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="price">Price</Label>
                        <Input
                          id="price"
                          type="number"
                          step="0.01"
                          value={editingItem?.price || newItem.price}
                          onChange={(e) => {
                            const value = parseFloat(e.target.value);
                            if (editingItem) {
                              setEditingItem({ ...editingItem, price: value });
                            } else {
                              setNewItem({ ...newItem, price: value });
                            }
                          }}
                          placeholder="Enter price"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={editingItem?.description || newItem.description}
                        onChange={(e) => {
                          if (editingItem) {
                            setEditingItem({ ...editingItem, description: e.target.value });
                          } else {
                            setNewItem({ ...newItem, description: e.target.value });
                          }
                        }}
                        placeholder="Enter item description"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="category">Category</Label>
                        <Select
                          value={editingItem?.category || newItem.category}
                          onValueChange={(value) => {
                            if (editingItem) {
                              setEditingItem({ ...editingItem, category: value });
                            } else {
                              setNewItem({ ...newItem, category: value });
                            }
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map((category) => (
                              <SelectItem key={category} value={category}>
                                {category}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="spicyLevel">Spicy Level</Label>
                        <select
                          id="spicyLevel"
                          className="w-full rounded-md border border-input bg-background px-3 py-2"
                          value={editingItem?.spicyLevel || newItem.spicyLevel}
                          onChange={(e) => {
                            const value = parseInt(e.target.value);
                            if (editingItem) {
                              setEditingItem({ ...editingItem, spicyLevel: value });
                            } else {
                              setNewItem({ ...newItem, spicyLevel: value });
                            }
                          }}
                        >
                          <option value="0">Not Spicy</option>
                          <option value="1">Mild</option>
                          <option value="2">Medium</option>
                          <option value="3">Hot</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Type</Label>
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-2">
                            <input
                              type="radio"
                              id="veg"
                              name="type"
                              checked={editingItem?.isVeg || newItem.isVeg}
                              onChange={(e) => {
                                if (editingItem) {
                                  setEditingItem({ ...editingItem, isVeg: true });
                                } else {
                                  setNewItem({ ...newItem, isVeg: true });
                                }
                              }}
                              className="h-4 w-4 text-green-600"
                            />
                            <Label htmlFor="veg" className="text-green-600">Vegetarian</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <input
                              type="radio"
                              id="non-veg"
                              name="type"
                              checked={!(editingItem?.isVeg || newItem.isVeg)}
                              onChange={(e) => {
                                if (editingItem) {
                                  setEditingItem({ ...editingItem, isVeg: false });
                                } else {
                                  setNewItem({ ...newItem, isVeg: false });
                                }
                              }}
                              className="h-4 w-4 text-red-600"
                            />
                            <Label htmlFor="non-veg" className="text-red-600">Non-Vegetarian</Label>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Options</Label>
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-2">
                            <Switch
                              id="popular"
                              checked={editingItem?.popular || newItem.popular}
                              onCheckedChange={(checked) => {
                                if (editingItem) {
                                  setEditingItem({ ...editingItem, popular: checked });
                                } else {
                                  setNewItem({ ...newItem, popular: checked });
                                }
                              }}
                            />
                            <Label htmlFor="popular">Popular</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Switch
                              id="available"
                              checked={editingItem?.available || newItem.available}
                              onCheckedChange={(checked) => {
                                if (editingItem) {
                                  setEditingItem({ ...editingItem, available: checked });
                                } else {
                                  setNewItem({ ...newItem, available: checked });
                                }
                              }}
                            />
                            <Label htmlFor="available">Available</Label>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Image</Label>
                      <ImageUpload
                        value={editingItem?.image || newItem.image}
                        onChange={(url) => {
                          if (editingItem) {
                            setEditingItem({ ...editingItem, image: url });
                          } else {
                            setNewItem({ ...newItem, image: url });
                          }
                        }}
                        onError={(error) => {
                          toast({
                            title: "Error",
                            description: error.message,
                            variant: "destructive"
                          });
                        }}
                      />
                    </div>
                  </div>
                  <DialogFooter className="sticky bottom-0 bg-background pt-4 border-t">
                    <Button
                      type="submit"
                      onClick={editingItem ? () => handleSave() : () => handleAdd(newItem)}
                      disabled={
                        (editingItem ? !editingItem.name || typeof editingItem.price !== 'number' || isNaN(editingItem.price) : !newItem.name || typeof newItem.price !== 'number' || isNaN(newItem.price) || !newItem.category)
                      }
                    >
                      {editingItem ? "Save Changes" : "Add Item"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </div>
                
      <div className="flex-1 overflow-y-auto">
        <div className="container mx-auto px-4 py-6">
          <DragDropContext onDragEnd={handleReorder}>
            {sortedCategories.length > 0 ? (
              sortedCategories.map((category) => (
                <div key={category} className="space-y-4 mb-8">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    {(() => {
                      const Icon = categoryIcons[category as keyof typeof categoryIcons];
                      return Icon ? <Icon className="w-5 h-5" /> : null;
                    })()}
                    {category}
                  </h3>
                  <Droppable droppableId={category}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-6 justify-items-center"
                      >
                        <AnimatePresence>
                          {groupedItems[category].map((item, index) => (
                            <Draggable
                              key={item._id}
                              draggableId={item._id}
                              index={index}
                            >
                              {(provided) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  className="h-full"
                                >
                                  <MenuItemCard
                                    item={item}
                                    onEdit={() => handleEdit(item)}
                                    onDelete={() => handleDelete(item._id)}
                                  />
                                </div>
                              )}
                            </Draggable>
                          ))}
                        </AnimatePresence>
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No menu items found</p>
              </div>
            )}
          </DragDropContext>
        </div>
      </div>
    </div>
  );
} 