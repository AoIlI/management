package org.example.demo.service;

import org.example.demo.entity.Fitness_classes;
import org.example.demo.entity.User;

import java.util.List;

public interface CourseManageService {
    List<Fitness_classes> list();

    List<Fitness_classes> searchCourses(String keyword);

    Fitness_classes getCourseById(String courseId);

    void deleteById(String courseId);

    void updateCourse(Fitness_classes course);

    void addCourse(Fitness_classes course);
}
