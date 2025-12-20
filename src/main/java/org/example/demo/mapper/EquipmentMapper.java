package org.example.demo.mapper;

import org.apache.ibatis.annotations.Mapper;
import org.example.demo.entity.Equipment;

import java.util.List;

@Mapper
public interface EquipmentMapper {
    List<Equipment> selectAll();
}
