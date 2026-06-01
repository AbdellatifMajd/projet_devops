import { Box, Typography, Divider, IconButton, Stack } from "@mui/material";
import { X } from "lucide-react";
import ClientBookingContent from "./ClientBookingContent";
import { useNavigate } from "react-router";

function ClientBookingWrapper({ bookingList, clientRoomList, setOpenBooking }) {
  const navigate = useNavigate();
  return (
    <Box
      sx={{
        width: { xs: "100vw", sm: 400 },
        height: "100%",
        display: "flex",
        flexDirection: "column",
        p: 3,
      }}
    >
      <Box
        sx={{
          p: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          My Bookings ({bookingList?.length || 0})
        </Typography>
        <IconButton onClick={() => setOpenBooking(false)}>
          <X size={24} />
        </IconButton>
      </Box>

      <Divider />

      <Box sx={{ flexGrow: 1, overflowY: "auto", p: 2, bg: "#f9f9f9" }}>
        <Stack spacing={2}>
          {bookingList && bookingList.length > 0 ? (
            bookingList.map((booking) => {
              // Looking for the room that contains this booking in its 'bookings' array
              const roomDetails = clientRoomList?.find((room) =>
                room.bookings?.some((b) => b.id === booking.id),
              );

              return (
                <ClientBookingContent
                  key={booking.id}
                  booking={booking}
                  roomDetails={roomDetails}
                />
              );
            })
          ) : (
            <Typography
              sx={{ textAlign: "center", mt: 4, color: "text.secondary" }}
            >
              No bookings found.
            </Typography>
          )}
        </Stack>
      </Box>

      <button
        className="w-full bg-stone-800 hover:bg-stone-900 text-white py-3 rounded-xl font-bold transition-colors duration-200 cursor-pointer"
        onClick={() => {
          setOpenBooking(false);
          navigate("/booking/checkout");
        }}
      >
        Checkout
      </button>
    </Box>
  );
}

export default ClientBookingWrapper;
