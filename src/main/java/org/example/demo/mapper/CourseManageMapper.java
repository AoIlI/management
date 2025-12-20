package org.example.demo.mapper;

import org.apache.ibatis.annotations.Mapper;
import org.example.demo.entity.Fitness_classes;

import java.util.List;

@Mapper
public interface CourseManageMapper {
    List<Fitness_classes> selectAll();

    List<Fitness_classes> searchCourses(String keyword);

    Fitness_classes getCourseById(String courseId);

    void deleteById(String courseId);

    void updateCourse(Fitness_classes course);

    void addCourse(Fitness_classes course);
}
