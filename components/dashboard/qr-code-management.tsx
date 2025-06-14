"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { QRCodeSVG } from "qrcode.react";
import { Download, CopyPlus, Printer, Share2, Trash2, QrCode, Plus, Edit, Settings, Table } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface QRCode {
  id: string;
  name: string;
  tableNumber?: string;
  type: "table" | "menu" | "payment" | "feedback" | "custom";
  url: string;
  description?: string;
  createdAt: string;
  color: string;
  size: number;
  logo?: string;
  active: boolean;
}

export function QRCodeManagement() {
  const [qrCodes, setQrCodes] = useState<QRCode[]>([
    {
      id: "1",
      name: "Table 1 QR",
      tableNumber: "1",
      type: "table",
      url: "https://example.com/restaurant/table/1",
      createdAt: new Date().toISOString(),
      color: "#000000",
      size: 200,
      active: true,
    },
    {
      id: "2",
      name: "Table 2 QR",
      tableNumber: "2",
      type: "table",
      url: "https://example.com/restaurant/table/2",
      createdAt: new Date().toISOString(),
      color: "#000000",
      size: 200,
      active: true,
    },
    {
      id: "3",
      name: "Main Menu",
      type: "menu",
      url: "https://example.com/restaurant/menu",
      description: "General menu QR code for printed materials",
      createdAt: new Date().toISOString(),
      color: "#1E40AF",
      size: 250,
      active: true,
    },
    {
      id: "4",
      name: "Payment QR",
      type: "payment",
      url: "https://example.com/restaurant/pay",
      createdAt: new Date().toISOString(),
      color: "#047857",
      size: 200,
      active: true,
    },
    {
      id: "5",
      name: "Feedback Form",
      type: "feedback",
      url: "https://example.com/restaurant/feedback",
      description: "Customer satisfaction survey",
      createdAt: new Date().toISOString(),
      color: "#7C3AED",
      size: 200,
      active: true,
    },
  ]);

  const [editingQR, setEditingQR] = useState<QRCode | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentTab, setCurrentTab] = useState("all");
  const [downloadQRId, setDownloadQRId] = useState<string | null>(null);

  // New QR code form state
  const [newQR, setNewQR] = useState<Omit<QRCode, "id" | "createdAt">>({
    name: "",
    type: "table",
    tableNumber: "",
    url: "",
    description: "",
    color: "#000000",
    size: 200,
    active: true,
  });

  // Filter QR codes based on tab selection
  const filteredCodes = qrCodes.filter(code => {
    if (currentTab === "all") return true;
    return code.type === currentTab;
  });

  // Handle adding a new QR code
  const handleAdd = () => {
    const newQRCode: QRCode = {
      id: Date.now().toString(),
      ...newQR,
      createdAt: new Date().toISOString(),
    };

    setQrCodes([...qrCodes, newQRCode]);
    setIsDialogOpen(false);
    
    // Reset form
    setNewQR({
      name: "",
      type: "table",
      tableNumber: "",
      url: "",
      description: "",
      color: "#000000",
      size: 200,
      active: true,
    });
  };

  // Handle editing a QR code
  const handleEdit = (code: QRCode) => {
    setEditingQR(code);
    setIsDialogOpen(true);
  };

  // Handle saving an edited QR code
  const handleSave = () => {
    if (editingQR) {
      setQrCodes(qrCodes.map(code => 
        code.id === editingQR.id ? editingQR : code
      ));
      setEditingQR(null);
      setIsDialogOpen(false);
    }
  };

  // Handle deleting a QR code
  const handleDelete = (id: string) => {
    setQrCodes(qrCodes.filter(code => code.id !== id));
  };

  // Handle toggling QR code active status
  const toggleActive = (id: string) => {
    setQrCodes(qrCodes.map(code => 
      code.id === id ? {...code, active: !code.active} : code
    ));
  };

  // Generate a download link for the QR code
  const handleDownload = (id: string) => {
    setDownloadQRId(id);
    // In a real app, would trigger download of the SVG/PNG
    setTimeout(() => {
      setDownloadQRId(null);
    }, 2000);
  };

  // Get type icon based on QR code type
  const getTypeIcon = (type: QRCode["type"]) => {
    switch (type) {
      case "table":
        return <Table className="h-4 w-4" />;
      case "menu":
        return <QrCode className="h-4 w-4" />;
      case "payment":
        return <CopyPlus className="h-4 w-4" />;
      case "feedback":
        return <Edit className="h-4 w-4" />;
      case "custom":
        return <Settings className="h-4 w-4" />;
      default:
        return <QrCode className="h-4 w-4" />;
    }
  };

  // Get badge color based on QR code type
  const getTypeBadge = (type: QRCode["type"]) => {
    switch (type) {
      case "table":
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Table</Badge>;
      case "menu":
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Menu</Badge>;
      case "payment":
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Payment</Badge>;
      case "feedback":
        return <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">Feedback</Badge>;
      case "custom":
        return <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">Custom</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold">QR Code Management</h2>
          <p className="text-muted-foreground">Generate and manage QR codes for tables and menus</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create QR Code
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingQR ? "Edit QR Code" : "Create New QR Code"}</DialogTitle>
              <DialogDescription>
                Customize your QR code and choose where it will be used.
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    placeholder="QR Code Name"
                    value={editingQR ? editingQR.name : newQR.name}
                    onChange={(e) => editingQR 
                      ? setEditingQR({...editingQR, name: e.target.value})
                      : setNewQR({...newQR, name: e.target.value})
                    }
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="type">Type</Label>
                  <Select
                    value={editingQR ? editingQR.type : newQR.type}
                    onValueChange={(value: QRCode["type"]) => editingQR
                      ? setEditingQR({...editingQR, type: value})
                      : setNewQR({...newQR, type: value})
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="table">Table</SelectItem>
                        <SelectItem value="menu">Menu</SelectItem>
                        <SelectItem value="payment">Payment</SelectItem>
                        <SelectItem value="feedback">Feedback</SelectItem>
                        <SelectItem value="custom">Custom</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                
                {(editingQR?.type === "table" || newQR.type === "table") && (
                  <div className="space-y-2">
                    <Label htmlFor="tableNumber">Table Number</Label>
                    <Input
                      id="tableNumber"
                      placeholder="1"
                      value={editingQR ? editingQR.tableNumber : newQR.tableNumber}
                      onChange={(e) => editingQR
                        ? setEditingQR({...editingQR, tableNumber: e.target.value})
                        : setNewQR({...newQR, tableNumber: e.target.value})
                      }
                    />
                  </div>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="url">URL</Label>
                  <Input
                    id="url"
                    placeholder="https://example.com"
                    value={editingQR ? editingQR.url : newQR.url}
                    onChange={(e) => editingQR
                      ? setEditingQR({...editingQR, url: e.target.value})
                      : setNewQR({...newQR, url: e.target.value})
                    }
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Description (Optional)</Label>
                  <Textarea
                    id="description"
                    placeholder="What this QR code is used for"
                    value={editingQR ? editingQR.description : newQR.description}
                    onChange={(e) => editingQR
                      ? setEditingQR({...editingQR, description: e.target.value})
                      : setNewQR({...newQR, description: e.target.value})
                    }
                  />
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="color">QR Code Color</Label>
                  <div className="flex gap-2">
                    <Input
                      type="color"
                      id="color"
                      className="w-12 h-10 p-1"
                      value={editingQR ? editingQR.color : newQR.color}
                      onChange={(e) => editingQR
                        ? setEditingQR({...editingQR, color: e.target.value})
                        : setNewQR({...newQR, color: e.target.value})
                      }
                    />
                    <Input
                      type="text"
                      value={editingQR ? editingQR.color : newQR.color}
                      onChange={(e) => editingQR
                        ? setEditingQR({...editingQR, color: e.target.value})
                        : setNewQR({...newQR, color: e.target.value})
                      }
                      className="flex-1"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="size">Size (px)</Label>
                  <Input
                    id="size"
                    type="number"
                    min="100"
                    max="500"
                    placeholder="200"
                    value={editingQR ? editingQR.size : newQR.size}
                    onChange={(e) => {
                      const value = parseInt(e.target.value) || 200;
                      if (editingQR) {
                        setEditingQR({...editingQR, size: value});
                      } else {
                        setNewQR({...newQR, size: value});
                      }
                    }}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Status</Label>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="active"
                      checked={editingQR ? editingQR.active : newQR.active}
                      onCheckedChange={(checked) => editingQR
                        ? setEditingQR({...editingQR, active: checked})
                        : setNewQR({...newQR, active: checked})
                      }
                    />
                    <Label htmlFor="active">Active</Label>
                  </div>
                </div>
                
                <div className="mt-4 flex justify-center p-4 border rounded-md bg-slate-50">
                  <QRCodeSVG
                    value={editingQR ? editingQR.url : newQR.url || "https://example.com"}
                    size={(editingQR ? editingQR.size : newQR.size) || 200}
                    fgColor={editingQR ? editingQR.color : newQR.color}
                    level="M"
                  />
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={editingQR ? handleSave : handleAdd}>
                {editingQR ? "Save Changes" : "Create QR Code"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <Tabs defaultValue="all" value={currentTab} onValueChange={setCurrentTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="all">All QR Codes</TabsTrigger>
          <TabsTrigger value="table">Tables</TabsTrigger>
          <TabsTrigger value="menu">Menu</TabsTrigger>
          <TabsTrigger value="payment">Payment</TabsTrigger>
          <TabsTrigger value="feedback">Feedback</TabsTrigger>
        </TabsList>
        
        <TabsContent value={currentTab} className="mt-0">
          {filteredCodes.length === 0 ? (
            <div className="text-center py-12">
              <QrCode className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-20" />
              <p className="text-muted-foreground">No QR codes found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCodes.map(code => (
                <Card key={code.id} className={!code.active ? "opacity-60" : ""}>
                  <CardHeader className="p-4 pb-2 flex flex-row justify-between items-start">
                    <div>
                      <CardTitle className="flex items-center gap-2 text-base">
                        {getTypeIcon(code.type)}
                        {code.name}
                        {!code.active && <Badge variant="secondary">Inactive</Badge>}
                      </CardTitle>
                      <CardDescription>
                        {code.type === "table" && `Table ${code.tableNumber}`}
                        {code.description}
                      </CardDescription>
                    </div>
                    {getTypeBadge(code.type)}
                  </CardHeader>
                  
                  <CardContent className="p-4 pt-2">
                    <div className="flex justify-center my-4">
                      <div className="relative">
                        <QRCodeSVG
                          value={code.url}
                          size={code.size || 200}
                          fgColor={code.color}
                          level="M"
                          className="mx-auto"
                        />
                        {downloadQRId === code.id && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded">
                            <span className="text-white text-sm animate-pulse">Downloading...</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="text-xs text-muted-foreground mb-4 truncate">
                      URL: {code.url}
                    </div>
                    
                    <div className="grid grid-cols-5 gap-2">
                      <Button variant="outline" size="icon" className="h-9 w-9" onClick={() => handleDownload(code.id)}>
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon" className="h-9 w-9">
                        <Printer className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon" className="h-9 w-9">
                        <Share2 className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon" className="h-9 w-9" onClick={() => handleEdit(code)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon" className="h-9 w-9" onClick={() => handleDelete(code.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="flex items-center justify-between mt-3 pt-3 border-t">
                      <div className="text-xs text-muted-foreground">
                        Created: {new Date(code.createdAt).toLocaleDateString()}
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          id={`active-${code.id}`}
                          checked={code.active}
                          onCheckedChange={() => toggleActive(code.id)}
                        />
                        <Label htmlFor={`active-${code.id}`} className="text-xs">
                          {code.active ? "Active" : "Inactive"}
                        </Label>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
} 