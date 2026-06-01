package myapp.gestion_reservation.repositories;

import myapp.gestion_reservation.entities.Room;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RoomRepository extends JpaRepository<Room, Long> {

    @Query("""
        SELECT r FROM Room r
        WHERE (:categories IS NULL OR r.category IN :categories)
        AND (:bedTypes IS NULL OR r.bedType IN :bedTypes)
    """)
    List<Room> findFilteredRooms(
            @Param("categories") List<String> categories,
            @Param("bedTypes") List<String> bedTypes,
            Sort sort
    );
}