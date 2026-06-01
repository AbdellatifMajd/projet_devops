package myapp.gestion_reservation.controllers;

import jakarta.servlet.http.HttpServletResponse;
import myapp.gestion_reservation.entities.User;
import myapp.gestion_reservation.services.UserService;
import myapp.gestion_reservation.config.JwtUtil;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class UserController {

    @Autowired private UserDetailsService userDetailsService;
    @Autowired private JwtUtil jwtUtil;
    @Autowired private AuthenticationManager authenticationManager;
    @Autowired private UserService userService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User registerData) {
        try {
            // 1. Sécurité : Vérifier si l'email est déjà pris
            if (userService.getUserByEmail(registerData.getEmail()) != null) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("message", "An account with this email already exists."));
            }

            // 2. Sauvegarde en BDD via ton service (Rôle CLIENT par défaut géré à ce niveau)
            User savedUser = userService.registerUser(registerData);

            // 3. Connexion auto : Charger l'utilisateur pour générer son token de session
            final UserDetails userDetails =
                    userDetailsService.loadUserByUsername(savedUser.getEmail());

            // 4. Générer le JWT
            final String jwt = jwtUtil.generateToken(userDetails);

            // 5. Créer le cookie HttpOnly identique à celui du login
            ResponseCookie cookie = ResponseCookie.from("jwt_token", jwt)
                    .httpOnly(true)
                    .secure(false) // Mettre à true en production (HTTPS)
                    .path("/")
                    .maxAge(24 * 60 * 60) // Expire après 24h
                    .sameSite("Strict")
                    .build();

            // 6. Préparer les données pour le state Redux du Frontend
            Map<String, Object> responseBody = new HashMap<>();
            responseBody.put("message", "Registration successful");
            responseBody.put("id", savedUser.getId());
            responseBody.put("email", savedUser.getEmail());
            responseBody.put("username", savedUser.getUsername());
            responseBody.put("role", savedUser.getRole());

            // 7. Renvoyer le code 201 Created avec le Cookie injecté dans l'en-tête
            return ResponseEntity.status(HttpStatus.CREATED)
                    .header(HttpHeaders.SET_COOKIE, cookie.toString())
                    .body(responseBody);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "An error occurred during registration."));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User loginData, HttpServletResponse response) {
        try {
            // 1. Authentification (Lève une exception si email/password incorrect)
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginData.getEmail(),
                            loginData.getPassword()
                    )
            );

            // 2. Charger user
            final UserDetails userDetails =
                    userDetailsService.loadUserByUsername(loginData.getEmail());

            // 3. Générer JWT
            final String jwt = jwtUtil.generateToken(userDetails);

            // 4. Cookie shadows HttpOnly
            ResponseCookie cookie = ResponseCookie.from("jwt_token", jwt)
                    .httpOnly(true)
                    .secure(false) // true en production (HTTPS)
                    .path("/")
                    .maxAge(24 * 60 * 60)
                    .sameSite("Strict")
                    .build();

            // 5. Récupérer le User de la BDD
            User currentUser = userService.getUserByEmail(loginData.getEmail());
            if (currentUser == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("message", "Utilisateur introuvable après authentification."));
            }

            // 6. Construire un objet JSON pour la réponse
            Map<String, Object> responseBody = new HashMap<>();
            responseBody.put("message", "Authentication successful");
            responseBody.put("id", currentUser.getId());
            responseBody.put("email", currentUser.getEmail());
            responseBody.put("name", currentUser.getName());
            responseBody.put("role", currentUser.getRole());

            // 7. Retour de la réponse en cas de succès
            return ResponseEntity.ok()
                    .header(HttpHeaders.SET_COOKIE, cookie.toString())
                    .body(responseBody);

        } catch (org.springframework.security.core.AuthenticationException e) {
            // Renvoie un code 401 avec le message d'erreur au format JSON
            Map<String, String> errorBody = new HashMap<>();
            errorBody.put("message", "Invalid email or password");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorBody);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Une erreur technique interne est survenue."));
        }
    }

    // --- ROUTE POUR LE REFRESH (F5) ---
    @GetMapping("/check-auth")
    public ResponseEntity<?> checkAuth() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        // Si l'utilisateur n'est pas authentifié par le JwtFilter, on bloque
        if (authentication == null || !authentication.isAuthenticated() || "anonymousUser".equals(authentication.getPrincipal())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Non autorisé"));
        }

        // On récupère les infos depuis la BDD grâce à l'email du token
        String email = authentication.getName();
        User currentUser = userService.getUserByEmail(email);

        Map<String, Object> responseBody = new HashMap<>();
        responseBody.put("id", currentUser.getId());
        responseBody.put("email", currentUser.getEmail());
        responseBody.put("name", currentUser.getName()); // Ajouté pour être synchrone avec login/register
        responseBody.put("role", currentUser.getRole());

        return ResponseEntity.ok(responseBody);
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(){
        // On crée un cookie vide qui écrase l'ancien
        ResponseCookie cookie = ResponseCookie.from("jwt_token", "")
                .httpOnly(true)
                .secure(false) // Reste à false en dév local (http://localhost)
                .path("/")     // Cohérence obligatoire avec le path du login/register
                .maxAge(0)     // 0 seconde de durée de vie = suppression immédiate par le navigateur
                .sameSite("Strict")
                .build();

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                .body(Map.of("message", "User logged out successfully"));
    }
}