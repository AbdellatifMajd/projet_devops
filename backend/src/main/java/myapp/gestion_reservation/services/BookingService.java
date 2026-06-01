package myapp.gestion_reservation.services;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import myapp.gestion_reservation.entities.Booking;
import myapp.gestion_reservation.entities.Room;
import myapp.gestion_reservation.entities.User;
import myapp.gestion_reservation.repositories.BookingRepository;
import myapp.gestion_reservation.repositories.RoomRepository;
import myapp.gestion_reservation.repositories.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class BookingService {

    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;
    private final RoomRepository roomRepository;

    public Booking addOrUpdateBooking(Long userId, Long roomId, LocalDate checkIn, LocalDate checkOut) {
        // 1. Validation de base
        if (userId == null || roomId == null || checkIn == null || checkOut == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid data provided");
        }

        // 2. Vérifier si la chambre existe (Product.findById)
        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Room not found"));

        // 3. Vérifier si l'utilisateur existe
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));


        // Logique métier : Est-ce que cet utilisateur a déjà réservé cette chambre ?
        // (Adaptation de la logique findIndex de votre code Node)
        List<Booking> userBookings = bookingRepository.findByUserId(userId);

        Booking existingBooking = userBookings.stream()
                .filter(b -> b.getRoom().getId().equals(roomId))
                .findFirst()
                .orElse(null);

        if (existingBooking != null) {
            // Mise à jour des dates si elle existe déjà
            existingBooking.setCheckInDate(checkIn);
            existingBooking.setCheckOutDate(checkOut);
            return bookingRepository.save(existingBooking);
        } else {
            // Création d'une nouvelle réservation
            Booking newBooking = new Booking();
            newBooking.setUser(user);
            newBooking.setRoom(room);
            newBooking.setCheckInDate(checkIn);
            newBooking.setCheckOutDate(checkOut);
            return bookingRepository.save(newBooking);
        }
    }


    public List<Booking> fetchUserBookings(Long userId) {
        if (userId == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "User id is mandatory");
        }

        List<Booking> bookings = bookingRepository.findByUserId(userId);

        if (bookings.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "No bookings found for this user");
        }

        return bookings;
    }



    public void deleteBooking(Long userId, Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Booking not found"));

        // Vérification de sécurité : est-ce bien la réservation de l'utilisateur ?
        if (!booking.getUser().getId().equals(userId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Not allowed to delete this booking");
        }

        bookingRepository.delete(booking);
    }
}