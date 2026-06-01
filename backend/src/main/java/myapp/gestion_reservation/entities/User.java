package myapp.gestion_reservation.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

@Data
@Entity
@Table(name = "users")

/**
 * LE PONT ENTRE LA BDD ET LA SÉCURITÉ
 * 1. CÔTÉ BDD (User) : Cette classe représente vos données réelles
 * stockées en base (email, nom, téléphone).
 * 2. CÔTÉ SPRING (UserDetails) : C'est une interface intégrée à Spring Security.
 * * => FAIT MARQUANT : 'implements UserDetails' sert de connecteur.
 * On dit à Spring : "Utilise mes données de la BDD pour remplir ton
 * propre système de sécurité standard."
 */

public class User implements UserDetails{

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String email;

    private String name;

    private String phoneNumber;

    private String password;

    private String role;

    @OneToMany(mappedBy = "user", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JsonIgnore
    private List<Booking> bookings = new ArrayList<>();


    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority(role));
    }

    /**
     * LA PERSONNALISATION DU CONTRAT (@Override)
     * * - Le Concept : Spring Security (via UserDetails) impose des questions
     * standard, et @Override est votre réponse personnalisée.
     * * - Concrètement :
     * 1. Spring demande : "C'est quoi le login ?" (getUsername).
     * 2. Vous répondez : "Dans ma BDD, c'est le champ 'email' !" (@Override).
     * * - Pourquoi ? Sans @Override, Spring utiliserait ses réglages par défaut.
     * Ici, vous forcez Spring à utiliser vos colonnes spécifiques de la BDD.
     */
    @Override
    @Transient // <-- Add this! Tells Hibernate: "Do NOT map this to a DB column"
    public String getUsername() {
        return email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}