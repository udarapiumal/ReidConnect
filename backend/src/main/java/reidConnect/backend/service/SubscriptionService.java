package reidConnect.backend.service;

import reidConnect.backend.dto.SubscriptionDto;
import reidConnect.backend.entity.Club;

import java.util.List;

public interface SubscriptionService {
    void subscribe(SubscriptionDto dto);
    void unsubscribe(SubscriptionDto dto);
    List<Club> getSubscribedClubs(Long userId);
    long countSubscriptionsForClub(Long clubId);
    boolean isUserSubscribedToClub(Long userId, Long clubId);

}
