// src/pages/booking/CheckoutBooking.jsx
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import ClientBookingContent from "../../components/booking/ClientBookingContent";
import {
  Box, Typography, Container, Paper,
  Divider, Stack, Button, CircularProgress, Alert
} from "@mui/material";
import { initializePayment } from "../../store/PaymentSlice";
import PaymentResult from "../../components/payment/PaymentResult";
import PaymentForm from "../../components/payment/PaymentForm";

// Initialiser Stripe une seule fois, hors du composant
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

function CheckoutBooking() {
  const dispatch = useDispatch();
  const { bookingList } = useSelector((state) => state.bookingRooms);
  const { clientRoomList } = useSelector((state) => state.clientRooms);
  const { clientSecret, status, error } = useSelector((state) => state.payment);

  const totalAmount = bookingList?.reduce((sum, booking) => {
    const room = clientRoomList?.find((r) => r.bookings?.some((b) => b.id === booking.id));
    return sum + (room ? room.pricePerNight : 0);
  }, 0);

  const bookingIds = bookingList?.map((b) => b.id) ?? [];

  // Créer le PaymentIntent dès que la page est chargée avec des réservations
  useEffect(() => {
    if (bookingIds.length > 0 && totalAmount > 0) {
      // Stripe travaille en centimes — 1 MAD = 100 centimes
      dispatch(initializePayment({ amountInCentimes: totalAmount * 100, bookingIds }));
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Afficher le résultat après paiement
  if (status === "succeeded") return <PaymentResult success={true} />;
  if (status === "failed" && !clientSecret) return <PaymentResult success={false} />;

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Box sx={{ textAlign: "center", mb: 6 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
          Checkout
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Please review your booking details before payment.
        </Typography>
      </Box>

      <Stack spacing={2} sx={{ mb: 4 }}>
        {bookingList?.length > 0 ? (
          bookingList.map((item) => {
            const roomDetails = clientRoomList?.find((room) =>
              room.bookings?.some((b) => b.id === item.id)
            );
            return (
              <ClientBookingContent key={item.id} booking={item} roomDetails={roomDetails} />
            );
          })
        ) : (
          <Typography align="center">Your cart is empty.</Typography>
        )}
      </Stack>

      <Paper elevation={0} sx={{ p: 4, borderRadius: 3, border: "1px solid #eee", bgcolor: "#fdfdfd" }}>
        <Stack spacing={2}>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography color="text.secondary">Number of rooms</Typography>
            <Typography sx={{ fontWeight: 600 }}>{bookingList?.length || 0}</Typography>
          </Box>

          <Divider />

          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>Total Amount</Typography>
            <Typography variant="h5" sx={{ fontWeight: 800, color: "primary.main" }}>
              {totalAmount} MAD
            </Typography>
          </Box>

          <Box sx={{ pt: 2 }}>
            {error && !clientSecret && (
              <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
            )}

            {/* Afficher le formulaire seulement quand clientSecret est prêt */}
            {clientSecret ? (
              <Elements stripe={stripePromise} options={{ clientSecret }}>
                <PaymentForm bookingIds={bookingIds} totalAmount={totalAmount} />
              </Elements>
            ) : (
              <Box sx={{ display: "flex", justifyContent: "center", py: 2 }}>
                <CircularProgress size={28} />
              </Box>
            )}
          </Box>
        </Stack>
      </Paper>

      <Box sx={{ textAlign: "center", mt: 4 }}>
        <Button
          variant="text"
          color="inherit"
          sx={{ textTransform: "none", fontSize: "0.8rem" }}
          onClick={() => window.history.back()}
        >
          ← Back to selection
        </Button>
      </Box>
    </Container>
  );
}

export default CheckoutBooking;