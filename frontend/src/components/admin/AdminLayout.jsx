import { Outlet } from "react-router"
import AdminHeader from "./AdminHeader"
import AdminAsideBar from "./AdminAsideBar"
import { useState } from "react"
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

function AdminLayout() {

  const [openDrawer, setOpenDrawer] = useState(true);
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("lg"));

  return (
    <div className="flex w-full h-screen">
      <AdminAsideBar openDrawer={openDrawer} onCloseDrawer={() => setOpenDrawer(false)}/>

      <div 
          className="flex flex-1 flex-col overflow-y-auto transition-all duration-300 ease-in-out"
          style={{ 
          marginLeft: isDesktop && openDrawer ? "280px" : "0px" 
        }}
        >
        <AdminHeader setOpenHeader={setOpenDrawer}/>
      <main className="flex-1 flex-col flex bg-muted/40 p-4 md:p-6">
        <Outlet/>
      </main>
      </div>

    </div>

  )
}

export default AdminLayout