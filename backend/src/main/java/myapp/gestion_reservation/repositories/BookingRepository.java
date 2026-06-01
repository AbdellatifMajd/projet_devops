package myapp.gestion_reservation.repositories;

import myapp.gestion_reservation.entities.Booking;
import myapp.gestion_reservation.entities.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional; // Import à ajouter

import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long> {

    List<Booking> findByUserId(Long userId);

    @Modifying
    @Transactional // INDISPENSABLE pour les modifications en base de données
    @Query("UPDATE Booking b SET b.status = :status WHERE b.id IN :ids")
    void updateStatusByIds(@Param("ids") List<Long> ids, @Param("status") BookingStatus status);
}