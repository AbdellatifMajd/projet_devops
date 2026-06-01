package myapp.gestion_reservation.services;

import myapp.gestion_reservation.entities.Room;
import myapp.gestion_reservation.repositories.RoomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class RoomService {
    @Autowired
    private RoomRepository roomRepository;

    // 1. Add a new room
    public Room addRoom(Room room) {
        return roomRepository.save(room);
    }

    // 2. Fetch all rooms
    public List<Room> fetchAllRooms() {
        return roomRepository.findAll();
    }

    // 3. Edit a room (Partial update)
    public Room editRoom(Long id, Room updatedRoomData) throws Exception {
        Optional<Room> optionalRoom = roomRepository.findById(id);

        if (optionalRoom.isEmpty()) {
            throw new Exception("Room not found");
        }

        Room existingRoom = optionalRoom.get();

        // Équivalent de : findProduct.title = title || findProduct.title;
        if (updatedRoomData.getTitle() != null) {
            existingRoom.setTitle(updatedRoomData.getTitle());
        }
        if (updatedRoomData.getImageUrl() != null) {
            existingRoom.setImageUrl(updatedRoomData.getImageUrl());
        }
        if (updatedRoomData.getDescription() != null) {
            existingRoom.setDescription(updatedRoomData.getDescription());
        }
        if (updatedRoomData.getCategory() != null) {
            existingRoom.setCategory(updatedRoomData.getCategory());
        }
        if (updatedRoomData.getBedType() != null) {
            existingRoom.setBedType(updatedRoomData.getBedType());
        }
        if (updatedRoomData.getPricePerNight() != null) {
            existingRoom.setPricePerNight(updatedRoomData.getPricePerNight());
        }
        if (updatedRoomData.getCapacity() != null) {
            existingRoom.setCapacity(updatedRoomData.getCapacity());
        }

        return roomRepository.save(existingRoom);
    }

    // 4. Delete a room
    public boolean deleteRoom(Long id) {
        if (!roomRepository.existsById(id)) {
            return false;
        }
        roomRepository.deleteById(id);
        return true;
    }

    public List<Room> getFilteredRooms(List<String> categories, List<String> bedTypes, String sortBy) {
        Sort sort = switch (sortBy) {
            case "price-lowtohigh" -> Sort.by(Sort.Direction.ASC, "pricePerNight");
            case "price-hightolow" -> Sort.by(Sort.Direction.DESC, "pricePerNight");
            case "title-atoz" -> Sort.by(Sort.Direction.ASC, "title");
            case "title-ztoa" -> Sort.by(Sort.Direction.DESC, "title");
            default -> Sort.by(Sort.Direction.ASC, "pricePerNight");
        };

        // Si aucun filtre n'est présent, on fait un findAll avec tri
        if ((categories == null || categories.isEmpty()) && (bedTypes == null || bedTypes.isEmpty())) {
            return roomRepository.findAll(sort);
        }

        return roomRepository.findFilteredRooms(categories, bedTypes, sort);
    }
}
