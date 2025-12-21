package org.example.demo.controller;

import jakarta.servlet.http.HttpServletResponse;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.example.demo.entity.Equipment;
import org.example.demo.mapper.EquipmentMapper;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.List;

@RestController
@RequestMapping("/api/equipmentManage")
public class EquipmentManageController {

    private final EquipmentMapper equipmentMapper;

    public EquipmentManageController(EquipmentMapper equipmentMapper) {
        this.equipmentMapper = equipmentMapper;
    }

    @GetMapping("/list")
    public List<Equipment> list() {
        return equipmentMapper.selectAll();
    }

    @GetMapping("/{equipmentId}")
    public Equipment getById(@PathVariable("equipmentId") String equipmentId) {
        return equipmentMapper.getById(equipmentId);
    }

    @GetMapping("/export")
    public void export(@RequestParam(required = false) String keyword, HttpServletResponse response) throws IOException {
        List<Equipment> equipments = (keyword == null || keyword.isEmpty())
                ? equipmentMapper.selectAll()
                : equipmentMapper.selectAll().stream()
                    .filter(eq -> eq.getName() != null && eq.getName().contains(keyword))
                    .toList();

        response.setContentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        String encodedFileName = URLEncoder.encode("设备表.xlsx", StandardCharsets.UTF_8).replace("+", "%20");
        response.setHeader("Content-Disposition", "attachment; filename*=UTF-8''" + encodedFileName);

        Workbook wb = new XSSFWorkbook();
        Sheet sheet = wb.createSheet("Equipment");
        Row header = sheet.createRow(0);
        String[] titles = {"设备名称", "健康状态", "价格", "购入日期", "使用年限"};
        for (int i = 0; i < titles.length; i++) {
            header.createCell(i).setCellValue(titles[i]);
        }

        for (int i = 0; i < equipments.size(); i++) {
            Equipment eq = equipments.get(i);
            Row row = sheet.createRow(i + 1);
            row.createCell(0).setCellValue(eq.getName());
            row.createCell(1).setCellValue(eq.getHealthStatus() != null ? eq.getHealthStatus() : "");
            row.createCell(2).setCellValue(eq.getPrice());
            row.createCell(3).setCellValue(eq.getPurchaseDate() != null ? eq.getPurchaseDate().toString() : "");
            row.createCell(4).setCellValue(eq.getServiceLife() != null ? eq.getServiceLife() + "年" : "");
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
    public void delete(@PathVariable("id") String equipmentId) {
        equipmentMapper.deleteById(equipmentId);
    }

    @PutMapping("/update")
    public ResponseEntity<?> update(@RequestBody Equipment equipment) {
        try {
            equipmentMapper.updateEquipment(equipment);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("修改失败");
        }
    }

    @PostMapping("/add")
    public ResponseEntity<?> add(@RequestBody Equipment equipment) {
        try {
            equipmentMapper.addEquipment(equipment);
            return ResponseEntity.ok("添加成功");
        } catch (DuplicateKeyException e) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body("设备ID已存在");
        } catch (RuntimeException e) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(e.getMessage());
        }
    }
}
