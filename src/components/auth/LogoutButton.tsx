import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { logout } from "@/service/AuthService"
import { useAuth } from "@/context/auth-context"

export const LogoutButton = () => {
  const navigate = useNavigate()
  const { setAuthenticated } = useAuth()

  const handleLogout = async () => {
    try {
      await logout()
    } finally {
      setAuthenticated(false)
      navigate("/login")
    }

  }


  return (
    <Button variant="outline" onClick={handleLogout}>
      Logout
    </Button>
  )

}
