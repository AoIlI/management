package org.example.demo.mapper;

import org.apache.ibatis.annotations.Mapper;
import org.example.demo.entity.Fitness_classes;

import java.util.List;

@Mapper
public interface CourseManageMapper {
    List<Fitness_classes> selectAll();
}
