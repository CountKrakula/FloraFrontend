import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { logout } from "@/service/AuthService"

export const LogoutButton = () => {
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      await logout()
    } finally {
      navigate("/login")
    }

  }


  return (
    <Button variant="outline" onClick={handleLogout}>
      Logout
    </Button>
  )

}