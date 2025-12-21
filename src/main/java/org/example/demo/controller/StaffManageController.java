package org.example.demo.controller;

import jakarta.servlet.http.HttpServletResponse;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.example.demo.entity.Staff;
import org.example.demo.service.StaffService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/staffManage")
public class StaffManageController {

    private final StaffService staffService;

    public StaffManageController(StaffService staffService) {
        this.staffService = staffService;
    }

    @GetMapping("/list")
    public List<Staff> list() {
        return staffService.list();
    }

    @GetMapping("/export")
    public void export(@RequestParam(required = false) String keyword, HttpServletResponse response) throws IOException {
        List<Staff> staffs = (keyword == null || keyword.isEmpty())
                ? staffService.list()
                : staffService.searchStaffs(keyword);

        response.setContentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        response.setHeader("Content-Disposition", "attachment; filename=员工表.xlsx");

        Workbook wb = new XSSFWorkbook();
        Sheet sheet = wb.createSheet("Staffs");

        Row header = sheet.createRow(0);
        String[] titles = {"员工ID", "账号ID", "姓名", "职位", "手机号", "邮箱", "专长", "入职日期", "状态", "部门"};
        for (int i = 0; i < titles.length; i++) {
            header.createCell(i).setCellValue(titles[i]);
        }

        for (int i = 0; i < staffs.size(); i++) {
            Staff s = staffs.get(i);
            Row row = sheet.createRow(i + 1);
            row.createCell(0).setCellValue(s.getStaffId());
            row.createCell(1).setCellValue(s.getAccountId());
            row.createCell(2).setCellValue(s.getName());
            row.createCell(3).setCellValue(s.getRole());
            row.createCell(4).setCellValue(s.getPhone());
            row.createCell(5).setCellValue(s.getEmail() != null ? s.getEmail() : "");
            row.createCell(6).setCellValue(s.getSpecialty() != null ? s.getSpecialty() : "");
            row.createCell(7).setCellValue(s.getHireDate() != null ? s.getHireDate().toString() : "");
            row.createCell(8).setCellValue(s.getStatus());
            row.createCell(9).setCellValue(s.getDepartment() != null ? s.getDepartment() : "");
        }

        // 自动列宽
        for (int i = 0; i < titles.length; i++) {
            sheet.autoSizeColumn(i);
            int currentWidth = sheet.getColumnWidth(i);
            int minWidth = 20 * 256;
            if (currentWidth < minWidth) {
                sheet.setColumnWidth(i, minWidth);
            }
        }

        wb.write(response.getOutputStream());
        wb.close();
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable("id") String staffId) {
        staffService.deleteById(staffId);
    }

    @PutMapping("/update")
    public ResponseEntity<?> update(@RequestBody Staff staff) {
        try {
            staffService.updateStaff(staff);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("修改失败");
        }
    }

    @GetMapping("/{staffId}")
    public Staff getStaff(@PathVariable("staffId") String staffId) {
        return staffService.getStaffById(staffId);
    }

    @GetMapping("/search")
    public List<Staff> search(@RequestParam("keyword") String keyword) {
        return staffService.searchStaffs(keyword);
    }

    @PostMapping("/add")
    public ResponseEntity<?> add(@RequestBody Staff staff) {
        try {
            staffService.addStaff(staff);
            return ResponseEntity.ok("添加成功");
        } catch (RuntimeException e) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(e.getMessage());
        }
    }
}
