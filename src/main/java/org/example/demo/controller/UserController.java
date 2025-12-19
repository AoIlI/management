package org.example.demo.controller;

import jakarta.servlet.http.HttpServletResponse;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.example.demo.entity.User;
import org.example.demo.service.Userservice;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/user")
public class UserController {

    @Autowired
    private final Userservice userService;

    public UserController(Userservice userService) {
        this.userService = userService;
    }

    @GetMapping("/list")
    public List<User> list() {
        return userService.list();
    }

    @GetMapping("/export")
    public void export(HttpServletResponse response) throws Exception {

        List<User> users = userService.list();

        // 1. 创建 Excel
        Workbook workbook = new XSSFWorkbook();
        Sheet sheet = workbook.createSheet("用户列表");

        // 2. 表头
        Row headerRow = sheet.createRow(0);
        String[] headers = {
                "ID", "姓名", "手机号", "会员卡类型",
                "生效时间", "到期时间", "状态"
        };

        for (int i = 0; i < headers.length; i++) {
            headerRow.createCell(i).setCellValue(headers[i]);
        }

        // 3. 数据行
        int rowNum = 1;
        for (User user : users) {
            Row row = sheet.createRow(rowNum++);
            row.createCell(0).setCellValue(user.getMember_id());
            row.createCell(1).setCellValue(user.getName());
            row.createCell(2).setCellValue(user.getPhone());
            row.createCell(3).setCellValue(user.getMembership_type());
            row.createCell(4).setCellValue(user.getMembership_start_date());
            row.createCell(5).setCellValue(user.getMembership_end_date());
            row.createCell(6).setCellValue(user.getStatus());
        }

        // 4. 设置响应头（关键）
        response.setContentType(
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );
        response.setHeader(
                "Content-Disposition",
                "attachment;filename=users.xlsx"
        );

        // 5. 输出
        workbook.write(response.getOutputStream());
        workbook.close();
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable("id") String memberId) {
        userService.deleteById(memberId);
    }
}

