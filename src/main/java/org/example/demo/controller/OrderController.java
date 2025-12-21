package org.example.demo.controller;

import jakarta.servlet.http.HttpSession;
import org.example.demo.entity.Account;
import org.example.demo.entity.Booking_records;
import org.example.demo.entity.Fitness_classes;
import org.example.demo.entity.Member;
import org.example.demo.mapper.MemberMapper;
import org.example.demo.service.BookingService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/order")
public class OrderController {

    private final BookingService bookingService;
    private final MemberMapper memberMapper;

    public OrderController(BookingService bookingService, MemberMapper memberMapper) {
        this.bookingService = bookingService;
        this.memberMapper = memberMapper;
    }
    
    /**
     * 通过accountId获取memberId
     */
    private String getMemberIdByAccountId(String accountId) {
        Member member = memberMapper.selectByAccountId(accountId);
        return member != null ? member.getMemberId() : null;
    }

    /**
     * 获取可预约的课程列表（支持分类筛选）
     */
    @GetMapping("/courses")
    public ResponseEntity<List<Fitness_classes>> getCourses(@RequestParam(required = false) String category) {
        List<Fitness_classes> courses = bookingService.getAvailableCourses(category);
        return ResponseEntity.ok(courses);
    }

    /**
     * 获取课程详情
     */
    @GetMapping("/course/{classId}")
    public ResponseEntity<Fitness_classes> getCourseDetail(@PathVariable String classId) {
        Fitness_classes course = bookingService.getCourseDetail(classId);
        if (course == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(course);
    }

    /**
     * 检查是否可以预约
     */
    @GetMapping("/check/{classId}")
    public ResponseEntity<Map<String, Object>> checkBooking(@PathVariable String classId, HttpSession session) {
        Account loginUser = (Account) session.getAttribute("loginUser");
        if (loginUser == null || !"member".equals(loginUser.getRole())) {
            Map<String, Object> result = new HashMap<>();
            result.put("canBook", false);
            result.put("message", "请先登录");
            return ResponseEntity.ok(result);
        }
        
        // 通过accountId获取memberId
        String memberId = getMemberIdByAccountId(loginUser.getAccountId());
        if (memberId == null) {
            Map<String, Object> result = new HashMap<>();
            result.put("canBook", false);
            result.put("message", "会员信息不存在");
            return ResponseEntity.ok(result);
        }

        boolean canBook = bookingService.canBook(memberId, classId);
        Map<String, Object> result = new HashMap<>();
        result.put("canBook", canBook);
        if (!canBook) {
            Fitness_classes course = bookingService.getCourseDetail(classId);
            if (course != null && course.getCurrentEnrollment() >= course.getMaxCapacity()) {
                result.put("message", "课程已满员");
            } else {
                result.put("message", "您已预约过该课程或无法预约");
            }
        } else {
            result.put("message", "可以预约");
        }
        return ResponseEntity.ok(result);
    }

    /**
     * 预约课程
     */
    @PostMapping("/book/{classId}")
    public ResponseEntity<Map<String, Object>> bookCourse(@PathVariable String classId, HttpSession session) {
        Account loginUser = (Account) session.getAttribute("loginUser");
        if (loginUser == null || !"member".equals(loginUser.getRole())) {
            Map<String, Object> result = new HashMap<>();
            result.put("success", false);
            result.put("message", "请先登录");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(result);
        }
        
        String memberId = getMemberIdByAccountId(loginUser.getAccountId());
        if (memberId == null) {
            Map<String, Object> result = new HashMap<>();
            result.put("success", false);
            result.put("message", "会员信息不存在");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(result);
        }

        try {
            Booking_records booking = bookingService.bookCourse(memberId, classId);
            Map<String, Object> result = new HashMap<>();
            result.put("success", true);
            result.put("message", "预约成功");
            result.put("bookingId", booking.getBookingId());
            return ResponseEntity.ok(result);
        } catch (RuntimeException e) {
            Map<String, Object> result = new HashMap<>();
            result.put("success", false);
            result.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(result);
        }
    }

    /**
     * 获取用户的预约记录（包含课程详情）
     */
    @GetMapping("/my-bookings")
    public ResponseEntity<List<Map<String, Object>>> getMyBookings(HttpSession session) {
        Account loginUser = (Account) session.getAttribute("loginUser");
        if (loginUser == null || !"member".equals(loginUser.getRole())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        
        String memberId = getMemberIdByAccountId(loginUser.getAccountId());
        if (memberId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        List<Booking_records> bookings = bookingService.getMemberBookings(memberId);
        
        // 组合预约记录和课程信息（包含所有状态的记录，包括"已取消"）
        List<Map<String, Object>> bookingDetails = bookings.stream().map(booking -> {
            Map<String, Object> detail = new HashMap<>();
            detail.put("bookingId", booking.getBookingId());
            detail.put("memberId", booking.getMemberId());
            detail.put("classId", booking.getClassId());
            detail.put("bookingDate", booking.getBookingDate());
            detail.put("status", booking.getStatus());
            detail.put("attended", booking.getAttended());
            detail.put("attendedTime", booking.getAttendedTime());
            
            // 获取课程信息（即使课程不存在也要返回记录）
            Fitness_classes course = bookingService.getCourseDetail(booking.getClassId());
            if (course != null) {
                detail.put("className", course.getClassName());
                detail.put("coachId", course.getCoachId());
                detail.put("dayOfWeek", course.getDayOfWeek());
                detail.put("classTime", course.getClassTime());
                detail.put("durationMinutes", course.getDurationMinutes());
                detail.put("maxCapacity", course.getMaxCapacity());
                detail.put("currentEnrollment", course.getCurrentEnrollment());
            } else {
                // 如果课程不存在，设置默认值，确保记录仍然显示
                detail.put("className", "课程已删除");
                detail.put("coachId", "-");
                detail.put("dayOfWeek", null);
                detail.put("classTime", null);
                detail.put("durationMinutes", 0);
                detail.put("maxCapacity", 0);
                detail.put("currentEnrollment", 0);
            }
            
            return detail;
        }).collect(Collectors.toList());
        
        return ResponseEntity.ok(bookingDetails);
    }

    /**
     * 取消预约
     */
    @DeleteMapping("/cancel/{bookingId}")
    public ResponseEntity<Map<String, Object>> cancelBooking(@PathVariable String bookingId, HttpSession session) {
        Account loginUser = (Account) session.getAttribute("loginUser");
        if (loginUser == null || !"member".equals(loginUser.getRole())) {
            Map<String, Object> result = new HashMap<>();
            result.put("success", false);
            result.put("message", "请先登录");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(result);
        }

        try {
            bookingService.cancelBooking(bookingId);
            Map<String, Object> result = new HashMap<>();
            result.put("success", true);
            result.put("message", "取消预约成功");
            return ResponseEntity.ok(result);
        } catch (RuntimeException e) {
            Map<String, Object> result = new HashMap<>();
            result.put("success", false);
            result.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(result);
        }
    }

    /**
     * 标记课程已上课（扣减次数）
     */
    @PostMapping("/attend/{bookingId}")
    public ResponseEntity<Map<String, Object>> markAsAttended(@PathVariable String bookingId, HttpSession session) {
        Account loginUser = (Account) session.getAttribute("loginUser");
        if (loginUser == null || !"member".equals(loginUser.getRole())) {
            Map<String, Object> result = new HashMap<>();
            result.put("success", false);
            result.put("message", "请先登录");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(result);
        }

        try {
            bookingService.markAsAttended(bookingId);
            Map<String, Object> result = new HashMap<>();
            result.put("success", true);
            result.put("message", "已标记为已上课");
            return ResponseEntity.ok(result);
        } catch (RuntimeException e) {
            Map<String, Object> result = new HashMap<>();
            result.put("success", false);
            result.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(result);
        }
    }
}
