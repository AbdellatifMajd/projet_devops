import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Box, Typography, Button, Paper } from "@mui/material";
import { CheckCircle, XCircle } from "lucide-react";
import { resetPayment } from "../../store/PaymentSlice";

function PaymentResult({ success }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    // Nettoyer le state payment après affichage du résultat
    return () => dispatch(resetPayment());
  }, [dispatch]);

  return (
    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
      <Paper elevation={0} sx={{ p: 6, borderRadius: 4, border: "1px solid #eee", textAlign: "center", maxWidth: 400 }}>
        {success ? (
          <>
            <CheckCircle size={64} color="#22c55e" style={{ marginBottom: 16 }} />
            <Typography variant="h5" sx={{ fontWeight: 800, mb: 1 }}>
              Payment Successful!
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 4 }}>
              Your bookings have been confirmed. You'll receive a confirmation shortly.
            </Typography>
            <Button
              variant="contained"
              fullWidth
              sx={{ borderRadius: 2, py: 1.5, bgcolor: "stone.900", fontWeight: 700 }}
              onClick={() => navigate("/my-bookings")}
            >
              View My Bookings
            </Button>
          </>
        ) : (
          <>
            <XCircle size={64} color="#ef4444" style={{ marginBottom: 16 }} />
            <Typography variant="h5" sx={{ fontWeight: 800, mb: 1 }}>
              Payment Failed
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 4 }}>
              Something went wrong. Please try again or use a different card.
            </Typography>
            <Button
              variant="outlined"
              fullWidth
              sx={{ borderRadius: 2, py: 1.5, fontWeight: 700 }}
              onClick={() => window.history.back()}
            >
              ← Try Again
            </Button>
          </>
        )}
      </Paper>
    </Box>
  );
}

export default PaymentResult;