package org.example.demo.mapper;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.example.demo.entity.Staff;

import java.util.List;

@Mapper
public interface StaffMapper {
    
    List<Staff> selectAll();
    
    Staff selectByStaffId(@Param("staffId") String staffId);
    
    Staff selectByAccountId(@Param("accountId") String accountId);
    
    List<Staff> searchStaffs(@Param("keyword") String keyword);
    
    int insert(Staff staff);
    
    int updateStaff(Staff staff);
    
    int deleteById(@Param("staffId") String staffId);
    
    String selectMaxStaffId();
}

