package org.example.demo.service;

import org.example.demo.entity.Booking_records;
import org.example.demo.entity.Fitness_classes;

import java.util.List;

public interface BookingService {
    
    List<Fitness_classes> getAvailableCourses(String category);
    
    Fitness_classes getCourseDetail(String classId);
    
    boolean canBook(String memberId, String classId);
    
    Booking_records bookCourse(String memberId, String classId);
    
    List<Booking_records> getMemberBookings(String memberId);
    
    void cancelBooking(String bookingId);
    
    void markAsAttended(String bookingId);
}


