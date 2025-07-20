package reidConnect.backend.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reidConnect.backend.dto.SubscriptionDto;
import reidConnect.backend.entity.Club;
import reidConnect.backend.service.SubscriptionService;

import java.util.List;

@RestController
@RequestMapping("/api/subscriptions")
@RequiredArgsConstructor
public class SubscriptionController {

    private final SubscriptionService subscriptionService;

    @PostMapping("/subscribe")
    public ResponseEntity<String> subscribe(@RequestBody SubscriptionDto dto) {
        subscriptionService.subscribe(dto);
        return ResponseEntity.ok("Subscribed successfully");
    }

    //API for
    @PostMapping("/unsubscribe")
    public ResponseEntity<String> unsubscribe(@RequestBody SubscriptionDto dto) {
        subscriptionService.unsubscribe(dto);
        return ResponseEntity.ok("Unsubscribed successfully");
    }

    //Get subscribed clubs by userId
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Club>> getUserSubscriptions(@PathVariable Long userId) {
        return ResponseEntity.ok(subscriptionService.getSubscribedClubs(userId));
    }

    //Count subscriptions for clubId
    @GetMapping("/club/{clubId}/count")
    public ResponseEntity<Long> getClubSubscriptionCount(@PathVariable Long clubId) {
        return ResponseEntity.ok(subscriptionService.countSubscriptionsForClub(clubId));
    }
}
