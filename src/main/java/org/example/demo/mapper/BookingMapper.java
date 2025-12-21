package org.example.demo.mapper;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.example.demo.entity.Booking_records;

import java.util.List;

@Mapper
public interface BookingMapper {
    
    String selectMaxBookingId();
    
    int insert(Booking_records booking);
    
    List<Booking_records> selectByMemberId(@Param("memberId") String memberId);
    
    Booking_records selectByMemberIdAndClassId(@Param("memberId") String memberId, 
                                                @Param("classId") String classId);
    
    List<Booking_records> selectByClassId(@Param("classId") String classId);
    
    int updateStatus(@Param("bookingId") String bookingId, @Param("status") String status);
    
    int deleteById(@Param("bookingId") String bookingId);
    
    Booking_records selectByBookingId(@Param("bookingId") String bookingId);
    
    int markAsAttended(@Param("bookingId") String bookingId);
}

