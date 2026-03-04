import { Navigate, Outlet } from "react-router-dom"

type Props = {
  allowedRoles: string[]
}

const RoleGuard = ({ allowedRoles }: Props) => {
  const token = localStorage.getItem("token")
  const role = localStorage.getItem("role")

  if (!token) {
    return <Navigate to="/auth/login" replace />
  }

  if (!role || !allowedRoles.includes(role)) {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}

export default RoleGuard
