// Unified single-page Owner Dashboard is a product requirement. 
// DO NOT create separate pages for Orders/Menu/Tables/Settings/Analytics. 
// All changes must preserve in-page sections.

export default function OwnerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      {children}
    </div>
  );
}
