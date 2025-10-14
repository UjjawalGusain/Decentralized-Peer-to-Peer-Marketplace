import { useAuth } from "../context/AuthContext"

function SellerDashboard() {

    const {user, token} = useAuth()


  return (
    <div>SellerDashboard</div>
  )
}

export default SellerDashboard