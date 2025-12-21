package org.example.demo.service;

import org.example.demo.entity.Staff;

import java.util.List;

public interface StaffService {
    List<Staff> list();

    List<Staff> searchStaffs(String keyword);

    Staff getStaffById(String staffId);

    void deleteById(String staffId);

    void updateStaff(Staff staff);

    void addStaff(Staff staff);
}

