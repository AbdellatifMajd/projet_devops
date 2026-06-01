package myapp.gestion_reservation.controllers;

import myapp.gestion_reservation.services.FileUploadService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequestMapping("/api/images")
public class ImageController {

    private final FileUploadService fileUploadService;

    public ImageController(FileUploadService fileUploadService) {
        this.fileUploadService = fileUploadService;
    }

    // Le paramètre MultipartFile remplace le middleware d'upload de multer
    @PostMapping("/upload")
    public ResponseEntity<Map> uploadImage(@RequestParam("my_file") MultipartFile file) {
        try {
            Map result = fileUploadService.uploadImage(file);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", e.getMessage()));
        }
    }
}