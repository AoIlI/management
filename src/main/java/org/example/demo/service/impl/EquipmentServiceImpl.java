package org.example.demo.service.impl;

import org.example.demo.entity.Equipment;
import org.example.demo.mapper.EquipmentMapper;
import org.example.demo.service.EquipmentService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EquipmentServiceImpl implements EquipmentService {

    private final EquipmentMapper equipmentMapper;

    public EquipmentServiceImpl(EquipmentMapper equipmentMapper) {
        this.equipmentMapper = equipmentMapper;
    }


    @Override
    public List<Equipment> findAll() {
        return equipmentMapper.selectAll();
    }
}
