import { Outlet } from 'react-router-dom'
import AdminSidebar from './AdminSidebar';
import AdminNavbar from './AdminNavbar';

const AdminLayout = () => {
  return (
    <div className="flex h-screen w-full overflow-hidden">
      <AdminSidebar />
      <div className="flex-1 h-screen min-w-0 overflow-hidden">
        <AdminNavbar />
        <div className="p-4 w-full h-[calc(100vh-64px)] overflow-auto">
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default AdminLayout
