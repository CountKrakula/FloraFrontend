import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"

export const LogoutButton = () => {
  const navigate = useNavigate()

  const handleLogout = () => {
    // clear token / call signOut
    navigate("/login")
  }


  return (
    <Button variant="outline" onClick={handleLogout}>
      Logout
    </Button>
  )

}