import Drawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import { useNavigate, useLocation } from "react-router-dom";
import { 
  BedDouble, 
  X
} from "lucide-react";

const adminSidebarMenuItems = [
    {
    id: "chambres",
    label: "Chambres",
    path: "/admin/chambres",
    icon: <BedDouble size={22} />,
  }
];

function AdminAsideBar({ openDrawer, onCloseDrawer }) {
  const navigate = useNavigate();
  const location = useLocation(); 


  return (
    <Drawer
      anchor="left"
      open={openDrawer} 
      onClose={onCloseDrawer}
      sx={{
        "& .MuiDrawer-paper": {
          width: 280,
          boxSizing: "border-box",
        },
      }}
    >
      <Box 
        sx={{ width: "100%", height: "100%", display: "flex", flexDirection: "column" }} 
        role="presentation"
      >
        {/* En-tête de la Sidebar */}
        <div className="flex items-center justify-between px-4 h-20 border-b border-gray-200 mb-4">
          <span className="font-bold tracking-wider text-gray-800 uppercase">
            Riad Le Petit Joyau
          </span>

          {/* CHANGEMENT ICI : On a retiré le {!isDesktop && ...}, le bouton s'affiche tout le temps */}
          <button 
            onClick={onCloseDrawer}
            className="p-1 rounded-md text-gray-500 hover:text-gray-800 hover:bg-gray-100 transition-colors"
            aria-label="Fermer le menu"
          >
            <X size={24} />
          </button>
        </div>

        {/* Menu de navigation */}
        <nav className="flex flex-col gap-2 px-4">
          {adminSidebarMenuItems.map((menuItem) => {
            const isActive = location.pathname.includes(menuItem.path);

            return (
              <div
                key={menuItem.id}
                onClick={() => {
                  navigate(menuItem.path);
                  if (onCloseDrawer) {
                    onCloseDrawer();
                  }
                }}
                className={`flex cursor-pointer text-lg items-center gap-3 rounded-md px-4 py-3 transition-all duration-200 ${
                  isActive
                    ? "bg-blue-50 text-blue-600 font-semibold shadow-sm" 
                    : "text-gray-500 hover:bg-gray-100 hover:text-gray-900" 
                }`}
              >
                {menuItem.icon}
                <span>{menuItem.label}</span>
              </div>
            );
          })}
        </nav>
      </Box>
    </Drawer>
  );
}

export default AdminAsideBar;