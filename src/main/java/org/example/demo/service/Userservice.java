package org.example.demo.service;

import org.example.demo.entity.User;

import java.util.List;

public interface Userservice {
    List<User> list();

    void deleteById(String memberId);

    void updateUser(User user);

    User getUserById(String memberId);

    List<User> searchUsers(String keyword);
}
