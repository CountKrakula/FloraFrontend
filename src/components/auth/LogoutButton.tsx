import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"

export const LogoutButton = () => {
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      // await logout()
      console.log("logged out");
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