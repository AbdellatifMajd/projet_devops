package myapp.gestion_reservation.controllers;

import lombok.RequiredArgsConstructor;
import myapp.gestion_reservation.entities.Booking;
import myapp.gestion_reservation.services.BookingService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;

    @PostMapping("/add")
    public ResponseEntity<Map<String, Object>> addBooking(@RequestBody Map<String, Object> payload) {
        // Extraction manuelle pour simuler le destructuration JS
        Long userId = Long.valueOf(payload.get("userId").toString());
        Long roomId = Long.valueOf(payload.get("roomId").toString());
        LocalDate checkIn = LocalDate.parse(payload.get("checkInDate").toString());
        LocalDate checkOut = LocalDate.parse(payload.get("checkOutDate").toString());

        Booking booking = bookingService.addOrUpdateBooking(userId, roomId, checkIn, checkOut);

        return ResponseEntity.ok(Map.of(
                "success", true,
                "data", booking
        ));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<Map<String, Object>> getUserBookings(@PathVariable Long userId) {
        List<Booking> bookings = bookingService.fetchUserBookings(userId);

        return ResponseEntity.ok(Map.of(
                "success", true,
                "data", bookings
        ));
    }

    @DeleteMapping("/delete/{userId}/{bookingId}")
    public ResponseEntity<Map<String, Object>> deleteBooking(@PathVariable Long userId, @PathVariable Long bookingId) {
        bookingService.deleteBooking(userId, bookingId);

        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Booking deleted successfully"
        ));
    }
}