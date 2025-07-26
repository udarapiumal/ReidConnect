package reidConnect.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reidConnect.backend.dto.LostandFoundDto;
import reidConnect.backend.dto.LostandFoundResponseDto;
import reidConnect.backend.entity.LostandFound;
import reidConnect.backend.service.LostandFoundService;

import java.util.List;
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/lost")
@RestController
public class LostandFoundController {
    private final LostandFoundService lostandFoundService;

    public LostandFoundController(LostandFoundService lostandFoundService) {
        this.lostandFoundService = lostandFoundService;
    }
    @PostMapping("/lost-items")
    public ResponseEntity<String>createLostItemPost(@ModelAttribute LostandFoundDto lostandFoundDto) {
        lostandFoundService.saveLostItem(lostandFoundDto);
        return ResponseEntity.ok("Lost item Posted Successfully");
    }
    @GetMapping("/lost-items")
    public ResponseEntity<List<LostandFoundResponseDto>> getAllLostItems() {
        List<LostandFoundResponseDto> items = lostandFoundService.getAllLostItems();
        return ResponseEntity.ok(items);
    }
    @DeleteMapping("/lost-items/{id}")
    public ResponseEntity<String> deleteLostItem(@PathVariable Long id) {
        lostandFoundService.deleteLostItem(id);
        return ResponseEntity.ok("Lost item deleted successfully");
    }
    @PutMapping("/lost-items/{id}")
    public ResponseEntity<String> updateLostItem(@PathVariable Long id, @ModelAttribute LostandFoundDto dto) {
        lostandFoundService.updateLostItem(id, dto);
        return ResponseEntity.ok("Lost item updated successfully");
    }


}
