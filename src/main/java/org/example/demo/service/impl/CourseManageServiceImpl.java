package org.example.demo.service.impl;

import org.example.demo.entity.Fitness_classes;
import org.example.demo.mapper.CourseManageMapper;
import org.example.demo.service.CourseManageService;
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
}
