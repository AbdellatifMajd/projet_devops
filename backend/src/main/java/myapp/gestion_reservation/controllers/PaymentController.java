package myapp.gestion_reservation.controllers;

import lombok.RequiredArgsConstructor;
import myapp.gestion_reservation.services.PaymentService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/payment")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    @Value("${stripe.currency}")
    private String currency;

    @PostMapping("/intent")
    public ResponseEntity<Map<String, Object>> createIntent(@RequestBody Map<String, Object> body) {
        try {
            long amount = Long.parseLong(body.get("amountInCentimes").toString());
            List<Long> bookingIds = ((List<?>) body.get("bookingIds"))
                    .stream()
                    .map(id -> Long.parseLong(id.toString()))
                    .toList();

            String clientSecret = paymentService.createPaymentIntent(amount, currency, bookingIds);
            return ResponseEntity.ok(Map.of("clientSecret", clientSecret));

        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", "Payment initialization failed"));
        }
    }

    @PostMapping("/confirm")
    public ResponseEntity<Map<String, Object>> confirmPayment(@RequestBody Map<String, Object> body) {
        try {
            String paymentIntentId = body.get("paymentIntentId").toString();
            List<Long> bookingIds = ((List<?>) body.get("bookingIds"))
                    .stream()
                    .map(id -> Long.parseLong(id.toString()))
                    .toList();

            paymentService.confirmBookingsPaid(paymentIntentId, bookingIds);
            return ResponseEntity.ok(Map.of("status", "PAID"));

        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", "Confirmation failed"));
        }
    }
}