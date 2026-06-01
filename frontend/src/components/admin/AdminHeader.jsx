import Button from "@mui/material/Button"
import { AlignJustify, LogOut } from "lucide-react"
import { useDispatch } from "react-redux"
import { logoutUser } from "../../store/authSlice";

function AdminHeader({setOpenHeader}) {
    const dispatch = useDispatch();
  return (
    <header className="flex items-center justify-between px-4 py-3 border-b">
        <Button 
            className="lg:hidden sm:block"
            onClick={()=>setOpenHeader(true)}
            >
            <div className="flex items-center gap-3">
                <AlignJustify/>
            <span className="font-extrabold">Toggle Menu</span>
            </div>
        </Button>

        <div className="flex justify-end">
        <Button 
            variant="contained"
            onClick={()=> dispatch(logoutUser())}
            >
            <LogOut />
            Logout 
        </Button>
        </div>
    </header>
  )
}

export default AdminHeader