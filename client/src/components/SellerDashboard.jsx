import { useAuth } from "../context/AuthContext"
import APIS from "../../api/api"

function SellerDashboard() {

    const {user, token} = useAuth()
    

  return (
    <div>SellerDashboard</div>
  )
}

export default SellerDashboard