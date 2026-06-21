import Sidebar from '@/components/common/Navbar/Sidebar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="dashboard-wrapper">
      <Sidebar />
      <main>{children}</main>
    </div>
  );
}