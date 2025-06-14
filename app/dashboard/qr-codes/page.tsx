import { QRCodeManagement } from "@/components/dashboard/qr-code-management";

export default function QRCodesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-3xl">QR Code Management</h1>
        <p className="text-text-secondary mt-2">
          Create and manage QR codes for your restaurant tables, menu, and more.
        </p>
      </div>
      
      <QRCodeManagement />
    </div>
  );
} 