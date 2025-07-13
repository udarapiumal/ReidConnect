package reidConnect.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reidConnect.backend.dto.LostandFoundDto;
import reidConnect.backend.service.LostandFoundService;

import java.util.List;

@RequestMapping("/")
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
}
