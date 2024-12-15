export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div>
      {/* Sidebar */}
      <aside>
        <h2>Dashboard</h2>
        <nav>
          <ul>
            <li>
              <a href="/dashboard">
                Home
              </a>
            </li>
            <li>
              <a href="/dashboard/wall">
                Wall
              </a>
            </li>
            <li>
              <a href="/dashboard/drive">
                Drive
              </a>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main>{children}</main>
    </div>
  )
}
