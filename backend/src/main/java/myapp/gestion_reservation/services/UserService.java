package myapp.gestion_reservation.services;

import myapp.gestion_reservation.entities.User;
import myapp.gestion_reservation.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;

@Service
public class UserService implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public User registerUser(User user) {
        // 1. On hache le mot de passe reçu du frontend en BCrypt
        String hashedPassword = passwordEncoder.encode(user.getPassword());
        user.setPassword(hashedPassword);

        // 2. On force le rôle "CLIENT" pour les inscriptions publiques
        if (user.getRole() == null || user.getRole().isEmpty()) {
            user.setRole("CLIENT");
        }

        // 3. On sauvegarde le nouvel utilisateur dans la base de données
        return userRepository.save(user);
    }

    // Retourne null si non trouvé au lieu de crash, pour laisser le register s'exécuter
    public User getUserByEmail(String email){
        return userRepository.findByEmail(email).orElse(null);
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Utilisateur non trouvé avec l'email : " + email));

        return new org.springframework.security.core.userdetails.User(
                user.getEmail(),
                user.getPassword(),
                new ArrayList<>()
        );
    }
}