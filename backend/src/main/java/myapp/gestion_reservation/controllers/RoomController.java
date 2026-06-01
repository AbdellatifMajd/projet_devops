package myapp.gestion_reservation.controllers;

import myapp.gestion_reservation.entities.Room;
import myapp.gestion_reservation.services.RoomService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/rooms") // Adaptez la route selon vos besoins
public class RoomController {

    @Autowired
    private RoomService roomService;

    // Utilitaires pour formater les réponses JSON comme dans Node.js
    private Map<String, Object> createSuccessResponse(Object data, String message) {
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        if (data != null) response.put("data", data);
        if (message != null) response.put("message", message);
        return response;
    }

    private Map<String, Object> createErrorResponse(String message) {
        Map<String, Object> response = new HashMap<>();
        response.put("success", false);
        response.put("message", message);
        return response;
    }

    // ==========================================
    // 1. ADD A NEW ROOM
    // ==========================================
    @PostMapping("/add")
    public ResponseEntity<Map<String, Object>> addRoom(@RequestBody Room room) {
        try {
            Room newlyCreatedRoom = roomService.addRoom(room);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(createSuccessResponse(newlyCreatedRoom, null));
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse("Error occurred"));
        }
    }

    // ==========================================
    // 2. FETCH ALL ROOMS
    // ==========================================
    @GetMapping("/get")
    public ResponseEntity<Map<String, Object>> fetchAllRooms() {
        try {
            List<Room> listOfRooms = roomService.fetchAllRooms();
            return ResponseEntity.status(HttpStatus.OK)
                    .body(createSuccessResponse(listOfRooms, null));
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse("Error occurred"));
        }
    }

    // ==========================================
    // 3. EDIT A ROOM
    // ==========================================
    @PutMapping("/edit/{id}")
    public ResponseEntity<Map<String, Object>> editRoom(
            @PathVariable Long id,
            @RequestBody Room updatedRoomData) {
        try {
            Room editedRoom = roomService.editRoom(id, updatedRoomData);
            return ResponseEntity.status(HttpStatus.OK)
                    .body(createSuccessResponse(editedRoom, null));
        } catch (Exception e) {
            if (e.getMessage().equals("Room not found")) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(createErrorResponse("Room not found"));
            }
            System.out.println(e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse("Error occurred"));
        }
    }

    // ==========================================
    // 4. DELETE A ROOM
    // ==========================================
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Map<String, Object>> deleteRoom(@PathVariable Long id) {
        try {
            boolean isDeleted = roomService.deleteRoom(id);
            if (!isDeleted) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(createErrorResponse("Room not found"));
            }
            return ResponseEntity.status(HttpStatus.OK)
                    .body(createSuccessResponse(null, "Room deleted successfully"));
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse("Error occurred"));
        }
    }


    // ==========================================
// 5. FETCH FILTERED ROOMS (Client Side)
// ==========================================
    @GetMapping("/get-filteredRooms")
    public ResponseEntity<Map<String, Object>> getFilteredRooms(
            @RequestParam(required = false) List<String> category,
            @RequestParam(required = false) List<String> bedType,
            @RequestParam(defaultValue = "price-lowtohigh") String sortBy) {
        try {
            List<Room> filteredRooms = roomService.getFilteredRooms(category, bedType, sortBy);
            return ResponseEntity.status(HttpStatus.OK)
                    .body(createSuccessResponse(filteredRooms, null));
        } catch (Exception e) {
            System.out.println(e.getLocalizedMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse("Error occurred while filtering rooms"));
        }
    }
}
