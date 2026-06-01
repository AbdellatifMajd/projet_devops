package myapp.gestion_reservation.services;

import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import com.stripe.param.PaymentIntentCreateParams;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import myapp.gestion_reservation.entities.BookingStatus;
import myapp.gestion_reservation.repositories.BookingRepository;
import org.springframework.stereotype.Service;

import java.util.List;

// src/main/java/com/yourapp/payment/PaymentService.java
@Service
@RequiredArgsConstructor
public class PaymentService {

    private final BookingRepository bookingRepository;

    public String createPaymentIntent(long amountInCentimes, String currency, List<Long> bookingIds) throws StripeException {
        try {
            PaymentIntentCreateParams params = PaymentIntentCreateParams.builder()
                    .setAmount(amountInCentimes)
                    .setCurrency(currency)
                    .putMetadata("bookingIds", bookingIds.toString())
                    .addPaymentMethodType("card")
                    .build();

            return PaymentIntent.create(params).getClientSecret();

        } catch (StripeException e) {
            // Log l'erreur exacte Stripe
            System.err.println("Stripe error code: " + e.getCode());
            System.err.println("Stripe error message: " + e.getMessage());
            throw e;
        }
    }
    @Transactional
    public void confirmBookingsPaid(String paymentIntentId, List<Long> bookingIds) throws StripeException {
        PaymentIntent intent = PaymentIntent.retrieve(paymentIntentId);

        if (!"succeeded".equals(intent.getStatus())) {
            throw new IllegalStateException("Payment not confirmed by Stripe");
        }

        bookingRepository.updateStatusByIds(bookingIds, BookingStatus.PAID);
    }
}