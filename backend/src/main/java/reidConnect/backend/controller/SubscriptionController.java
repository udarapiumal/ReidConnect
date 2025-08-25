package reidConnect.backend.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reidConnect.backend.dto.SubscriptionDto;
import reidConnect.backend.entity.Club;
import reidConnect.backend.service.NotificationService;
import reidConnect.backend.service.SubscriptionService;

import java.util.List;

@RestController
@RequestMapping("/api/subscriptions")
@RequiredArgsConstructor
public class SubscriptionController {

    private final SubscriptionService subscriptionService;
    private final NotificationService notificationService;
    @PostMapping("/subscribe")
    public ResponseEntity<String> subscribe(@RequestBody SubscriptionDto dto) {
        subscriptionService.subscribe(dto);

        //notification creation
        String userId=String.valueOf(dto.getUserId());
        String title="subscription";
        String message="you have subscribed to x club";
        String type="INDIVIDUAL";
        notificationService.createIndividual(userId, title, message, type);

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

    // Check if a user is subscribed to a club
    @GetMapping("/check/{clubId}")
    public ResponseEntity<Boolean> isUserSubscribed(
            @PathVariable Long clubId,
            @RequestParam Long userId
    ) {
        boolean isSubscribed = subscriptionService.isUserSubscribedToClub(userId, clubId);
        return ResponseEntity.ok(isSubscribed);
    }


}
