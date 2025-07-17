package reidConnect.backend.service;

import reidConnect.backend.entity.User;
import reidConnect.backend.repository.UserRepository;
import reidConnect.backend.service.EmailService;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class UserService {
    private final UserRepository userRepository;
    public UserService(UserRepository userRepository, EmailService emailService) {
        this.userRepository = userRepository;
    }

    public List<User> allUsers() {
        List<User> users = new ArrayList<>();
        userRepository.findAll().forEach(users::add);
        return users;
    }
    public User getUserByRegNumber(String regNumber) {
        return userRepository.findByRegNumberPrefix(regNumber)
                .orElseThrow(()->new RuntimeException("user not found :" + regNumber));
    }
}