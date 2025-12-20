package org.example.demo.service.impl;

import org.example.demo.entity.Fitness_classes;
import org.example.demo.mapper.CourseManageMapper;
import org.example.demo.service.CourseManageService;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CourseManageServiceImpl implements CourseManageService {

    private final CourseManageMapper courseManageMapper;

    public CourseManageServiceImpl(CourseManageMapper courseManageMapper) {
        this.courseManageMapper = courseManageMapper;
    }

    @Override
    public List<Fitness_classes> list() {
        return courseManageMapper.selectAll();
    }

    @Override
    public List<Fitness_classes> searchCourses(String keyword) {
        return courseManageMapper.searchCourses(keyword);
    }

    @Override
    public Fitness_classes getCourseById(String courseId) {
        return courseManageMapper.getCourseById(courseId);
    }

    @Override
    public void deleteById(String courseId) {
        courseManageMapper.deleteById(courseId);
    }

    @Override
    public void updateCourse(Fitness_classes course) {
        courseManageMapper.updateCourse(course);
    }

    @Override
    public void addCourse(Fitness_classes course) {
        try {
            courseManageMapper.addCourse(course);
        } catch (DuplicateKeyException e) {
            // class_id 重复
            throw new RuntimeException("课程ID已存在");
        }
    }
}
