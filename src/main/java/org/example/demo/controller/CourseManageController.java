package org.example.demo.controller;


import jakarta.servlet.http.HttpServletResponse;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.example.demo.entity.Fitness_classes;
import org.example.demo.entity.User;
import org.example.demo.service.CourseManageService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.List;

@RestController
@RequestMapping("/api/courseManage")
public class CourseManageController {

    private CourseManageService courseManageService;

    public CourseManageController(CourseManageService courseManageService) {
        this.courseManageService = courseManageService;
    }

    @GetMapping("/list")
    public List<Fitness_classes> list() {
        return courseManageService.list();
    }

    @GetMapping("/export")
    public void export(@RequestParam(required = false) String keyword, HttpServletResponse response) throws IOException, IOException {
        List<Fitness_classes> users = (keyword == null || keyword.isEmpty())
                ? courseManageService.list()
                : courseManageService.searchCourses(keyword);

        response.setContentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        String encodedFileName = URLEncoder.encode("课程表.xlsx", StandardCharsets.UTF_8).replace("+", "%20");
        response.setHeader("Content-Disposition", "attachment; filename*=UTF-8''" + encodedFileName);

        Workbook wb = new XSSFWorkbook();
        Sheet sheet = wb.createSheet("Courses");
        Row header = sheet.createRow(0);
        String[] titles = {"课程名", "教练名", "上课日期", "上课时间", "课程时长", "课容量", "当前选课人数"};
        for (int i = 0; i < titles.length; i++) {
            header.createCell(i).setCellValue(titles[i]);
        }

        String[] weekDays = {"", "周一", "周二", "周三", "周四", "周五", "周六", "周日"};
        for (int i = 0; i < users.size(); i++) {
            Fitness_classes u = users.get(i);
            Row row = sheet.createRow(i + 1);
            row.createCell(0).setCellValue(u.getClassName());
            // 教练名
            String coachNameStr = (u.getCoachName() != null && !u.getCoachName().isEmpty()) 
                    ? u.getCoachName() : (u.getCoachId() != null ? u.getCoachId() : "");
            row.createCell(1).setCellValue(coachNameStr);
            // 上课日期（周几）
            String dayOfWeekStr = (u.getDayOfWeek() != null && u.getDayOfWeek() >= 1 && u.getDayOfWeek() <= 7) 
                    ? weekDays[u.getDayOfWeek()] : String.valueOf(u.getDayOfWeek());
            row.createCell(2).setCellValue(dayOfWeekStr);
            // 上课时间
            String classTimeStr = (u.getClassTime() != null) ? u.getClassTime().toString() : "";
            row.createCell(3).setCellValue(classTimeStr);
            row.createCell(4).setCellValue(u.getDurationMinutes());
            row.createCell(5).setCellValue(u.getMaxCapacity());
            row.createCell(6).setCellValue(u.getCurrentEnrollment());
        }

        //  自动列宽（重点）
        for (int i = 0; i < titles.length; i++) {
            sheet.autoSizeColumn(i);

            // 防止中文 / 表头过窄，设置一个最小宽度
            int currentWidth = sheet.getColumnWidth(i);
            int minWidth = 20 * 256; // 20 个字符宽

            if (currentWidth < minWidth) {
                sheet.setColumnWidth(i, minWidth);
            }
        }


        wb.write(response.getOutputStream());
        wb.close();
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable("id") String courseId) {
        courseManageService.deleteById(courseId);
    }

    @PutMapping("/update")
    public ResponseEntity<?> update(@RequestBody Fitness_classes course) {
        try {
            courseManageService.updateCourse(course);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("修改失败");
        }
    }

    //  单个用户接口
    @GetMapping("/{memberId}")
    public Fitness_classes getUser(@PathVariable("memberId") String memberId) {
        return courseManageService.getCourseById(memberId);
    }

    @GetMapping("/search")
    public List<Fitness_classes> search(@RequestParam("keyword") String keyword) {
        return courseManageService.searchCourses(keyword);
    }

    @PostMapping("/add")
    public ResponseEntity<?> add(@RequestBody Fitness_classes course) {
        try {
            courseManageService.addCourse(course);
            return ResponseEntity.ok("添加成功");
        } catch (RuntimeException e) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(e.getMessage());
        }
    }

}
