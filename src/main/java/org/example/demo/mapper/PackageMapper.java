package org.example.demo.mapper;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.example.demo.entity.Package;

import java.util.List;

@Mapper
public interface PackageMapper {
    
    List<Package> selectAll();
    
    Package selectByPackageId(@Param("packageId") String packageId);
    
    List<Package> selectByType(@Param("packageType") String packageType);
    
    int insert(Package pkg);
    
    int update(Package pkg);
    
    int deleteById(@Param("packageId") String packageId);
}



