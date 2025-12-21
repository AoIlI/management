package org.example.demo.controller;

import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.example.demo.entity.Account;
import org.example.demo.entity.User;
import org.example.demo.service.Userservice;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.List;

@RestController
@RequestMapping("/api/user")
public class UserController {

    private final Userservice userService;

    public UserController(Userservice userService) {
        this.userService = userService;
    }

    @GetMapping("/list")
    public List<User> list() {
        return userService.list();
    }

    @GetMapping("/export")
    public void export(@RequestParam(required = false) String keyword, HttpServletResponse response) throws IOException, IOException {
        List<User> users = (keyword == null || keyword.isEmpty())
                ? userService.list()
                : userService.searchUsers(keyword);

        response.setContentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        String encodedFileName = URLEncoder.encode("用户表.xlsx", StandardCharsets.UTF_8).replace("+", "%20");
        response.setHeader("Content-Disposition", "attachment; filename*=UTF-8''" + encodedFileName);

        Workbook wb = new XSSFWorkbook();
        Sheet sheet = wb.createSheet("Users");

        Row header = sheet.createRow(0);
        String[] titles = {"ID", "姓名", "手机号", "会员卡类型", "开始时间", "结束时间", "状态"};
        for (int i = 0; i < titles.length; i++) {
            header.createCell(i).setCellValue(titles[i]);
        }

        for (int i = 0; i < users.size(); i++) {
            User u = users.get(i);
            Row row = sheet.createRow(i + 1);
            row.createCell(0).setCellValue(u.getMemberId());
            row.createCell(1).setCellValue(u.getName());
            row.createCell(2).setCellValue(u.getPhone());
            row.createCell(3).setCellValue(u.getMembershipType());
            row.createCell(4).setCellValue(u.getMembershipStartDate());
            row.createCell(5).setCellValue(u.getMembershipEndDate());
            row.createCell(6).setCellValue(u.getStatus());
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
    public void delete(@PathVariable("id") String memberId) {
        userService.deleteById(memberId);
    }

    @PutMapping("/update")
    public ResponseEntity<?> update(@RequestBody User user) {
        try {
            userService.updateUser(user);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("修改失败");
        }
    }

    //  单个用户接口
    @GetMapping("/{memberId}")
    public User getUser(@PathVariable("memberId") String memberId) {
        return userService.getUserById(memberId);
    }

    @GetMapping("/search")
    public List<User> search(@RequestParam("keyword") String keyword) {
        return userService.searchUsers(keyword);
    }
}

