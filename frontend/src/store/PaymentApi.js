const BASE_URL = "http://localhost:8080/api/payment";

export const createPaymentIntent = async (amountInCentimes, bookingIds) => {
  const res = await fetch(`${BASE_URL}/intent`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ amountInCentimes, currency: "mad", bookingIds }),
  });
  if (!res.ok) throw new Error("Failed to create payment intent");
  return res.json(); // { clientSecret }
};

export const confirmPaymentOnServer = async (paymentIntentId, bookingIds) => {
  const res = await fetch(`${BASE_URL}/confirm`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ paymentIntentId, bookingIds }),
  });
  if (!res.ok) throw new Error("Failed to confirm payment");
  return res.json();
};