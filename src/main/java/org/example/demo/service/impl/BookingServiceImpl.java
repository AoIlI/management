package org.example.demo.service.impl;

import org.example.demo.entity.Booking_records;
import org.example.demo.entity.Fitness_classes;
import org.example.demo.entity.Member;
import org.example.demo.mapper.BookingMapper;
import org.example.demo.mapper.CourseManageMapper;
import org.example.demo.mapper.MemberMapper;
import org.example.demo.service.BookingService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class BookingServiceImpl implements BookingService {

    private final CourseManageMapper courseManageMapper;
    private final BookingMapper bookingMapper;
    private final MemberMapper memberMapper;

    public BookingServiceImpl(CourseManageMapper courseManageMapper, BookingMapper bookingMapper,
                              MemberMapper memberMapper) {
        this.courseManageMapper = courseManageMapper;
        this.bookingMapper = bookingMapper;
        this.memberMapper = memberMapper;
    }

    @Override
    public List<Fitness_classes> getAvailableCourses(String category) {
        List<Fitness_classes> allCourses = courseManageMapper.selectAll();
        
        // 如果指定了类别，进行筛选
        if (category != null && !category.isEmpty() && !"全部".equals(category)) {
            // 根据课程名称判断类别（可以根据实际需求调整）
            allCourses = allCourses.stream()
                    .filter(course -> {
                        String className = course.getClassName().toLowerCase();
                        switch (category) {
                            case "力量训练":
                                return className.contains("力量") || className.contains("增肌") || className.contains("核心");
                            case "有氧运动":
                                return className.contains("有氧") || className.contains("燃脂") || className.contains("hiit") || className.contains("舞蹈");
                            case "瑜伽普拉提":
                                return className.contains("瑜伽") || className.contains("普拉提") || className.contains("拉伸");
                            default:
                                return true;
                        }
                    })
                    .collect(Collectors.toList());
        }
        
        return allCourses;
    }

    @Override
    public Fitness_classes getCourseDetail(String classId) {
        return courseManageMapper.getCourseById(classId);
    }

    @Override
    public boolean canBook(String memberId, String classId) {
        // 1. 检查课程是否存在
        Fitness_classes course = courseManageMapper.getCourseById(classId);
        if (course == null) {
            return false;
        }
        
        // 2. 检查是否已满员
        if (course.getCurrentEnrollment() >= course.getMaxCapacity()) {
            return false;
        }
        
        // 3. 检查是否已经预约过该课程
        Booking_records existing = bookingMapper.selectByMemberIdAndClassId(memberId, classId);
        if (existing != null && "已确认".equals(existing.getStatus())) {
            return false; // 已经预约过了
        }
        
        // 4. 检查会员可用次数
        Member member = memberMapper.selectByMemberId(memberId);
        if (member == null) {
            return false;
        }
        
        // 检查并重置月度次数（如果需要）
        resetMonthlyClassesIfNeeded(member);
        
        // 重新获取会员信息（可能已更新）
        member = memberMapper.selectByMemberId(memberId);
        if (member.getAvailableClasses() == null || member.getAvailableClasses() <= 0) {
            return false; // 没有可用次数
        }
        
        return true;
    }
    
    /**
     * 检查并重置月度次数（如果需要）
     */
    private void resetMonthlyClassesIfNeeded(Member member) {
        if (member.getLastResetDate() == null) {
            return;
        }

        java.time.LocalDate now = java.time.LocalDate.now();
        java.time.LocalDate lastReset = member.getLastResetDate();

        // 如果已经跨月，需要重置次数
        if (now.getYear() > lastReset.getYear() || 
            (now.getYear() == lastReset.getYear() && now.getMonthValue() > lastReset.getMonthValue())) {
            
            // 根据会员类型设置次数
            Integer classesPerMonth = null;
            if ("年卡".equals(member.getMembershipType())) {
                classesPerMonth = 30;
            } else if ("季卡".equals(member.getMembershipType())) {
                classesPerMonth = 20;
            } else if ("月卡".equals(member.getMembershipType())) {
                classesPerMonth = 10;
            }

            if (classesPerMonth != null) {
                memberMapper.updateAvailableClasses(member.getMemberId(), classesPerMonth);
                // 更新重置日期
                memberMapper.updateMembershipAndClasses(
                    member.getMemberId(),
                    member.getMembershipType(),
                    member.getMembershipStartDate(),
                    member.getMembershipEndDate(),
                    classesPerMonth,
                    now
                );
            }
        }
    }

    @Override
    @Transactional
    public Booking_records bookCourse(String memberId, String classId) {
        // 再次检查是否可以预约
        if (!canBook(memberId, classId)) {
            throw new RuntimeException("无法预约该课程，可能已满员、已预约或次数不足");
        }
        
        // 获取会员信息并检查次数
        Member member = memberMapper.selectByMemberId(memberId);
        if (member.getAvailableClasses() == null || member.getAvailableClasses() <= 0) {
            throw new RuntimeException("可用课程次数不足");
        }
        
        // 生成booking_id
        String maxBookingId = bookingMapper.selectMaxBookingId();
        String newBookingId;
        if (maxBookingId == null || maxBookingId.isEmpty()) {
            newBookingId = "BOOK000001";
        } else {
            String numPart = maxBookingId.substring(4); // BOOK000001 -> 00001
            int next = Integer.parseInt(numPart) + 1;
            newBookingId = String.format("BOOK%06d", next);
        }
        
        // 创建预约记录（注意：预约时不扣减次数，上课时才扣减）
        Booking_records booking = new Booking_records();
        booking.setBookingId(newBookingId);
        booking.setMemberId(memberId);
        booking.setClassId(classId);
        booking.setStatus("已确认");
        
        bookingMapper.insert(booking);
        
        // 更新课程的当前报名人数
        Fitness_classes course = courseManageMapper.getCourseById(classId);
        course.setCurrentEnrollment(course.getCurrentEnrollment() + 1);
        courseManageMapper.updateCourse(course);
        
        return booking;
    }

    @Override
    public List<Booking_records> getMemberBookings(String memberId) {
        return bookingMapper.selectByMemberId(memberId);
    }

    @Override
    @Transactional
    public void cancelBooking(String bookingId) {
        // 获取预约记录
        Booking_records booking = bookingMapper.selectByBookingId(bookingId);
        if (booking == null) {
            throw new RuntimeException("预约记录不存在");
        }
        
        // 检查状态，如果已经是已取消，则不允许重复取消
        if ("已取消".equals(booking.getStatus())) {
            throw new RuntimeException("该预约已经取消");
        }
        
        // 检查是否已上课，如果已上课则不允许取消
        if (Boolean.TRUE.equals(booking.getAttended())) {
            throw new RuntimeException("该课程已上课，无法取消");
        }
        
        // 更新预约记录状态为"已取消"（而不是删除记录）
        bookingMapper.updateStatus(bookingId, "已取消");
        
        // 更新课程的当前报名人数（减少1）
        Fitness_classes course = courseManageMapper.getCourseById(booking.getClassId());
        if (course != null && course.getCurrentEnrollment() > 0) {
            course.setCurrentEnrollment(course.getCurrentEnrollment() - 1);
            courseManageMapper.updateCourse(course);
        }
    }

    @Override
    @Transactional
    public void markAsAttended(String bookingId) {
        // 获取预约记录
        Booking_records booking = bookingMapper.selectByBookingId(bookingId);
        if (booking == null) {
            throw new RuntimeException("预约记录不存在");
        }

        if (Boolean.TRUE.equals(booking.getAttended())) {
            throw new RuntimeException("该课程已标记为已上课");
        }

        // 标记为已上课
        bookingMapper.markAsAttended(bookingId);

        // 扣减会员可用次数
        Member member = memberMapper.selectByMemberId(booking.getMemberId());
        if (member != null && member.getAvailableClasses() != null && member.getAvailableClasses() > 0) {
            memberMapper.updateAvailableClasses(member.getMemberId(), member.getAvailableClasses() - 1);
        }
    }
}

