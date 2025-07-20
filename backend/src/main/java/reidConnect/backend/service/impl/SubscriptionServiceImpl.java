package reidConnect.backend.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import reidConnect.backend.dto.SubscriptionDto;
import reidConnect.backend.entity.Club;
import reidConnect.backend.entity.Subscription;
import reidConnect.backend.entity.User;
import reidConnect.backend.repository.ClubRepository;
import reidConnect.backend.repository.SubscriptionRepository;
import reidConnect.backend.repository.UserRepository;
import reidConnect.backend.service.SubscriptionService;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SubscriptionServiceImpl implements SubscriptionService {

    private final SubscriptionRepository subscriptionRepository;
    private final UserRepository userRepository;
    private final ClubRepository clubRepository;

    @Override
    @Transactional
    public void subscribe(SubscriptionDto dto) {
        User user = userRepository.findById(dto.getUserId())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        Club club = clubRepository.findById(dto.getClubId())
                .orElseThrow(() -> new IllegalArgumentException("Club not found"));

        boolean alreadySubscribed = subscriptionRepository.findByUserAndClub(user, club).isPresent();
        if (!alreadySubscribed) {
            Subscription subscription = new Subscription();
            subscription.setUser(user);
            subscription.setClub(club);
            subscriptionRepository.save(subscription);
        }
    }

    @Override
    @Transactional
    public void unsubscribe(SubscriptionDto dto) {
        User user = userRepository.findById(dto.getUserId())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        Club club = clubRepository.findById(dto.getClubId())
                .orElseThrow(() -> new IllegalArgumentException("Club not found"));

        subscriptionRepository.deleteByUserAndClub(user, club);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Club> getSubscribedClubs(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        return subscriptionRepository.findAllByUser(user)
                .stream()
                .map(Subscription::getClub)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public long countSubscriptionsForClub(Long clubId) {
        Club club = clubRepository.findById(clubId)
                .orElseThrow(() -> new IllegalArgumentException("Club not found"));
        return subscriptionRepository.countByClub(club);
    }
}
