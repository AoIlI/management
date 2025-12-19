package org.example.demo.controller;


import org.example.demo.entity.Fitness_classes;
import org.example.demo.service.CourseManageService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/courseManage")
public class CourseManageController {

    private CourseManageService courseManageService;

    public CourseManageController(CourseManageService courseManageService) {
        this.courseManageService = courseManageService;
    }

    @GetMapping("/list")
    public List<Fitness_classes> list() {
        return courseManageService.list();
    }
}
