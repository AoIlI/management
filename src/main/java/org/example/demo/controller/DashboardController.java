package org.example.demo.controller;

import jakarta.servlet.http.HttpSession;
import org.example.demo.entity.Account;
import org.example.demo.entity.Booking_records;
import org.example.demo.entity.Member;
import org.example.demo.mapper.BookingMapper;
import org.example.demo.mapper.CourseManageMapper;
import org.example.demo.mapper.EquipmentMapper;
import org.example.demo.mapper.MemberMapper;
import org.example.demo.mapper.StaffMapper;
import org.example.demo.mapper.UserMapper;
import org.example.demo.service.InformationService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final UserMapper userMapper;
    private final CourseManageMapper courseManageMapper;
    private final EquipmentMapper equipmentMapper;
    private final StaffMapper staffMapper;
    private final BookingMapper bookingMapper;
    private final MemberMapper memberMapper;
    private final InformationService informationService;

    public DashboardController(UserMapper userMapper,
                                CourseManageMapper courseManageMapper,
                                EquipmentMapper equipmentMapper,
                                StaffMapper staffMapper,
                                BookingMapper bookingMapper,
                                MemberMapper memberMapper,
                                InformationService informationService) {
        this.userMapper = userMapper;
        this.courseManageMapper = courseManageMapper;
        this.equipmentMapper = equipmentMapper;
        this.staffMapper = staffMapper;
        this.bookingMapper = bookingMapper;
        this.memberMapper = memberMapper;
        this.informationService = informationService;
    }

    /**
     * 获取管理员首页统计数据
     */
    @GetMapping("/stats")
    public Map<String, Object> getAdminStats() {
        Map<String, Object> result = new HashMap<>();
        
        try {
            // 总用户数
            List<org.example.demo.entity.User> users = userMapper.selectAll();
            result.put("totalUsers", users != null ? users.size() : 0);
            
            // 课程总数
            List<org.example.demo.entity.Fitness_classes> courses = courseManageMapper.selectAll();
            result.put("totalCourses", courses != null ? courses.size() : 0);
            
            // 设备总数
            List<org.example.demo.entity.Equipment> equipment = equipmentMapper.selectAll();
            result.put("totalEquipment", equipment != null ? equipment.size() : 0);
            
            // 员工总数
            List<org.example.demo.entity.Staff> staffs = staffMapper.selectAll();
            result.put("totalStaff", staffs != null ? staffs.size() : 0);
            
            // 总预约数（所有已确认的预约）
            int totalBookings = 0;
            if (users != null) {
                for (org.example.demo.entity.User user : users) {
                    List<Booking_records> bookings = bookingMapper.selectByMemberId(user.getMemberId());
                    if (bookings != null) {
                        totalBookings += bookings.stream()
                                .filter(b -> "已确认".equals(b.getStatus()))
                                .collect(Collectors.toList())
                                .size();
                    }
                }
            }
            result.put("totalBookings", totalBookings);
            
            // 活跃会员数（状态为"正常"的会员）
            long activeMembers = 0;
            if (users != null) {
                activeMembers = users.stream()
                        .filter(u -> "正常".equals(u.getStatus()))
                        .count();
            }
            result.put("activeMembers", activeMembers);
            
        } catch (Exception e) {
            // 如果出现异常，返回默认值
            result.put("totalUsers", 0);
            result.put("totalCourses", 0);
            result.put("totalEquipment", 0);
            result.put("totalStaff", 0);
            result.put("totalBookings", 0);
            result.put("activeMembers", 0);
        }
        
        return result;
    }

    /**
     * 获取普通用户首页数据
     */
    @GetMapping("/user/{accountId}")
    public Map<String, Object> getUserDashboard(@PathVariable String accountId) {
        Map<String, Object> result = new HashMap<>();
        
        try {
            // 获取会员信息
            Member member = informationService.getMemberInfo(accountId);
            
            if (member != null) {
                // 会员卡信息
                Map<String, Object> membership = new HashMap<>();
                membership.put("type", member.getMembershipType() != null ? member.getMembershipType() : "无");
                membership.put("startDate", member.getMembershipStartDate() != null ? 
                        member.getMembershipStartDate().toString() : "-");
                membership.put("endDate", member.getMembershipEndDate() != null ? 
                        member.getMembershipEndDate().toString() : "-");
                
                // 判断会员卡状态
                String status = "无";
                if (member.getMembershipEndDate() != null) {
                    LocalDate endDate = member.getMembershipEndDate();
                    LocalDate now = LocalDate.now();
                    if (now.isAfter(endDate)) {
                        status = "过期";
                    } else if (now.isBefore(endDate) || now.isEqual(endDate)) {
                        status = "正常";
                    }
                }
                membership.put("status", status);
                
                result.put("membership", membership);
                
                // 获取用户的预约数
                List<Booking_records> bookings = bookingMapper.selectByMemberId(member.getMemberId());
                int totalBookings = 0;
                if (bookings != null) {
                    totalBookings = (int) bookings.stream()
                            .filter(b -> "已确认".equals(b.getStatus()))
                            .count();
                }
                result.put("totalBookings", totalBookings);
                
                // 获取最近的预约（最多5条）
                List<Map<String, Object>> recentBookings = null;
                if (bookings != null && !bookings.isEmpty()) {
                    recentBookings = bookings.stream()
                            .filter(b -> "已确认".equals(b.getStatus()))
                            .limit(5)
                            .map(b -> {
                                Map<String, Object> bookingMap = new HashMap<>();
                                org.example.demo.entity.Fitness_classes course = 
                                        courseManageMapper.getCourseById(b.getClassId());
                                bookingMap.put("courseName", course != null ? course.getClassName() : "未知课程");
                                
                                // 将dayOfWeek转换为中文星期
                                String dayOfWeekStr = "-";
                                if (course != null && course.getDayOfWeek() != null) {
                                    String[] weekDays = {"", "周一", "周二", "周三", "周四", "周五", "周六", "周日"};
                                    int day = course.getDayOfWeek();
                                    if (day >= 1 && day <= 7) {
                                        dayOfWeekStr = weekDays[day];
                                    }
                                }
                                bookingMap.put("date", dayOfWeekStr);
                                
                                bookingMap.put("time", course != null && course.getClassTime() != null ? 
                                        course.getClassTime().toString() : "-");
                                return bookingMap;
                            })
                            .collect(Collectors.toList());
                }
                result.put("recentBookings", recentBookings != null ? recentBookings : List.of());
                
            } else {
                // 如果不是会员，返回空数据
                Map<String, Object> membership = new HashMap<>();
                membership.put("type", "无");
                membership.put("startDate", "-");
                membership.put("endDate", "-");
                membership.put("status", "-");
                result.put("membership", membership);
                result.put("totalBookings", 0);
                result.put("recentBookings", List.of());
            }
            
            // 获取可用设备数（状态为"可用"的设备）
            List<org.example.demo.entity.Equipment> equipment = equipmentMapper.selectAll();
            long availableEquipment = 0;
            if (equipment != null) {
                availableEquipment = equipment.stream()
                        .filter(e -> "可用".equals(e.getStatus()))
                        .count();
            }
            result.put("availableEquipment", availableEquipment);
            
        } catch (Exception e) {
            // 如果出现异常，返回默认值
            Map<String, Object> membership = new HashMap<>();
            membership.put("type", "-");
            membership.put("startDate", "-");
            membership.put("endDate", "-");
            membership.put("status", "-");
            result.put("membership", membership);
            result.put("totalBookings", 0);
            result.put("availableEquipment", 0);
            result.put("recentBookings", List.of());
        }
        
        return result;
    }
}

