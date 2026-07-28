import Sidebar from '@/components/Dashboard/Sidebar'
import DashboardRoleGate from '@/components/Dashboard/DashboardRoleGate'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <DashboardRoleGate>
      <div className="min-h-screen bg-primary">
        <Sidebar />
        <main className="ml-16 lg:ml-64 pt-16 transition-all duration-300">
          <div className="p-6">
            {children}
          </div>
        </main>
      </div>
    </DashboardRoleGate>
  )
}
