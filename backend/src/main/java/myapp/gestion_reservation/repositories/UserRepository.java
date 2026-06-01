package myapp.gestion_reservation.repositories;

import myapp.gestion_reservation.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    //spring data génère automatiquement la requête sql
    Optional<User> findByEmail(String email);
}
