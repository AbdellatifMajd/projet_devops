import { Box, Typography, Paper, CardMedia, Chip, Stack, Divider } from "@mui/material";
import { CalendarDays, Hotel } from "lucide-react";

function ClientBookingContent({ booking, roomDetails }) {
  return (
    <Paper 
      elevation={0} 
      sx={{ 
        borderRadius: 2, 
        overflow: "hidden", 
        border: "1px solid #eaeaea",
        display: "flex", // On passe en horizontal
        transition: "0.2s",
        "&:hover": { boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }
      }}
    >
      {/* Image réduite et cadrée à gauche */}
      {roomDetails?.imageUrl && (
        <CardMedia
          component="img"
          sx={{ 
            width: 120, // Largeur fixe pour l'image
            height: "auto",
            objectFit: "cover"
          }}
          image={roomDetails.imageUrl}
          alt={roomDetails.title}
        />
      )}

      <Box sx={{ p: 1.5, flexGrow: 1 }}>
        <Stack spacing={0.5}>
          {/* Header: Title & Category */}
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
            <Typography variant="body1" sx={{ fontWeight: "bold", fontSize: "0.95rem" }}>
              {roomDetails?.title || "Booked Room"}
            </Typography>
            <Chip 
              label={roomDetails?.category || "Standard"} 
              size="small" 
              sx={{ fontSize: "0.65rem", height: 18 }}
            />
          </Box>

          {/* Stay Dates */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <CalendarDays size={14} color="#1976d2" />
            <Typography variant="caption" sx={{ color: "text.primary" }}>
              {booking.checkInDate} - {booking.checkOutDate}
            </Typography>
          </Box>

          {/* Bed Info */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Hotel size={14} color="#666" />
            <Typography variant="caption" color="text.secondary">
              {roomDetails?.bedType?.replace('_', ' ')}
            </Typography>
          </Box>

          <Divider sx={{ my: 0.5, borderStyle: "dotted" }} />

          {/* Footer: Price */}
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Typography variant="caption" sx={{ color: "text.secondary", fontSize: "0.7rem" }}>
              ID: #{booking.id}
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: "bold", color: "success.main" }}>
              {roomDetails?.pricePerNight} MAD
            </Typography>
          </Box>
        </Stack>
      </Box>
    </Paper>
  );
}

export default ClientBookingContent;