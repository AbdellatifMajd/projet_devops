import { useState } from "react";
import { useStripe, useElements, PaymentElement } from "@stripe/react-stripe-js";
import { useDispatch, useSelector } from "react-redux";
import { Box, Alert, CircularProgress } from "@mui/material";
import { CreditCard } from "lucide-react";
import { confirmPayment } from "../../store/PaymentSlice";

function PaymentForm({ bookingIds, totalAmount }) {
  const stripe = useStripe();
  const elements = useElements();
  const dispatch = useDispatch();
  const { status, error } = useSelector((state) => state.payment);
  const [stripeError, setStripeError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setStripeError(null);

    // 1. Confirmer le paiement côté Stripe
    const { error: stripeErr, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: "if_required", // Pas de redirection, on gère nous-mêmes
    });

    if (stripeErr) {
      setStripeError(stripeErr.message);
      return;
    }

    // 2. Notifier le backend pour mettre à jour les réservations
    if (paymentIntent.status === "succeeded") {
      dispatch(confirmPayment({ paymentIntentId: paymentIntent.id, bookingIds }));
    }
  };

  const isLoading = status === "loading";

  return (
    <Box component="form" onSubmit={handleSubmit}>
      {/* Champ carte Stripe (géré entièrement par Stripe) */}
      <Box sx={{ mb: 3, p: 2, border: "1px solid #e0e0e0", borderRadius: 2, bgcolor: "#fff" }}>
        <PaymentElement />
      </Box>

      {/* Affichage des erreurs */}
      {(stripeError || error) && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {stripeError || error}
        </Alert>
      )}

      <button
        type="submit"
        disabled={!stripe || isLoading}
        className="w-full bg-stone-900 hover:bg-black disabled:opacity-50 disabled:cursor-not-allowed hover:cursor-pointer text-white py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
      >
        {isLoading ? (
          <CircularProgress size={20} sx={{ color: "white" }} />
        ) : (
          <>
            <CreditCard size={20} />
            Pay {totalAmount} MAD
          </>
        )}
      </button>
    </Box>
  );
}

export default PaymentForm;