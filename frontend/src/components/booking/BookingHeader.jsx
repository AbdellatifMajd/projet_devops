import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Box,
  Tooltip,
  Divider,
  ListItemIcon,
  Drawer,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import {
  Bed,
  CalendarMonth,
  Logout,
  AccountCircle,
  Menu as MenuIcon,
} from "@mui/icons-material";
import { logoutUser } from "../../store/AuthSlice";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import ClientBookingWrapper from "./ClientBookingWrapper";
import { Sheet } from "lucide-react";
import { fetchUserBookings } from "../../store/BookingSlice";

function BookingHeader() {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [anchorElUser, setAnchorElUser] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const [openBooking, setOpenBooking] = useState(false);
  const {bookingList} = useSelector((state) => state.bookingRooms)
  const {clientRoomList} = useSelector((state) => state.clientRooms)

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };
  const handleCloseUserMenu = () => setAnchorElUser(null);
  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/auth/login");
  };

  useEffect(()=>{
    dispatch(fetchUserBookings(user?.id))  
  }, [dispatch])



  const menuItems = [
    { label: "Our Rooms", path: "/booking/listing" },
    { label: "Services", path: "/booking/services" },
  ];

  return (
    <AppBar position="sticky" color="default" elevation={1}>
      <Toolbar sx={{ justifyContent: "space-between" }}>
        {/* LOGO & NOM */}
        <Box
          sx={{ display: "flex", alignItems: "center", cursor: "pointer" }}
          onClick={() => navigate("/")}
        >
          <Bed sx={{ mr: 1, color: "primary.main" }} />
          <Typography
            variant="h6"
            sx={{ fontWeight: 700, letterSpacing: ".1rem", color: "inherit" }}
          >
            Riad Le Petit Joyau
          </Typography>
        </Box>

        {/* MENU DESKTOP */}
        <Box sx={{ display: { xs: "none", md: "flex" }, gap: 2 }}>
          {menuItems.map((item) => {
            const isActive = location.pathname.includes(item.path);

            return (
              <Button
                key={item.label}
                onClick={() => navigate(item.path)}
                sx={{
                  fontWeight: "bold",
                  color: isActive ? "primary.main" : "text.secondary",
                }}
              >
                {item.label}
              </Button>
            );
          })}
        </Box>

        {/* ACTIONS DROITE */}
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Tooltip title="my bookings">
            <IconButton onClick={() => setOpenBooking(true)}>
              <CalendarMonth sx={{ width: 30, height: 30 }} />
            </IconButton>
          </Tooltip>

          <Drawer
            open={openBooking}
            onClose={()=>setOpenBooking(false)}
            anchor="right"
          >
            <ClientBookingWrapper bookingList={bookingList} clientRoomList={clientRoomList} setOpenBooking={setOpenBooking}/>
          </Drawer>

          {/* Avatar & Dropdown */}
          <Tooltip title="Settings">
            <IconButton onClick={handleOpenUserMenu}>
              <Avatar sx={{ bgcolor: "secondary.main" }}>
                {user?.email?.[0].toUpperCase()}
              </Avatar>
            </IconButton>
          </Tooltip>

          <Menu
            open={Boolean(anchorElUser)}
            onClose={handleCloseUserMenu}
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
          >
            <Box sx={{ px: 2, py: 1 }}>
              <Typography variant="subtitle2">{user?.name}</Typography>
              <Typography variant="body2" color="text.secondary">
                {user?.email}
              </Typography>
            </Box>
            <Divider />

            <MenuItem
              sx={{ mt: 1 }}
              onClick={() => {
                navigate("/booking/profile");
                handleCloseUserMenu();
              }}
            >
              <ListItemIcon>
                <AccountCircle fontSize="small" />
              </ListItemIcon>
              My Profil
            </MenuItem>

            <Divider />
            <MenuItem onClick={handleLogout}>
              <ListItemIcon>
                <Logout fontSize="small" color="error" />
              </ListItemIcon>
              <Typography color="error">Logout</Typography>
            </MenuItem>
          </Menu>

          {/* Menu Burger Mobile */}
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ display: { md: "none" }, ml: 1 }}
          >
            <MenuIcon />
          </IconButton>
        </Box>
      </Toolbar>

      {/* DRAWER MOBILE */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": { width: 240 },
        }}
      >
        <Box onClick={handleDrawerToggle} sx={{ textAlign: "center", pt: 2 }}>
          <List>
            {menuItems.map((item) => (
              <ListItem key={item.label} onClick={() => navigate(item.path)}>
                <ListItemText primary={item.label} />
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
    </AppBar>
  );
}

export default BookingHeader;
