package org.example.demo.service.impl;

import org.example.demo.entity.Account;
import org.example.demo.entity.Staff;
import org.example.demo.mapper.AccountMapper;
import org.example.demo.mapper.StaffMapper;
import org.example.demo.service.StaffService;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class StaffServiceImpl implements StaffService {

    private final StaffMapper staffMapper;
    private final AccountMapper accountMapper;

    public StaffServiceImpl(StaffMapper staffMapper, AccountMapper accountMapper) {
        this.staffMapper = staffMapper;
        this.accountMapper = accountMapper;
    }

    @Override
    public List<Staff> list() {
        return staffMapper.selectAll();
    }

    @Override
    public List<Staff> searchStaffs(String keyword) {
        return staffMapper.searchStaffs(keyword);
    }

    @Override
    public Staff getStaffById(String staffId) {
        return staffMapper.selectByStaffId(staffId);
    }

    @Override
    @Transactional
    public void deleteById(String staffId) {
        // 1. 先获取员工的accountId
        Staff staff = staffMapper.selectByStaffId(staffId);
        if (staff == null) {
            throw new RuntimeException("员工不存在");
        }
        
        String accountId = staff.getAccountId();
        if (accountId == null) {
            throw new RuntimeException("员工账号信息不存在");
        }
        
        // 2. 先删除staff表记录
        staffMapper.deleteById(staffId);
        
        // 3. 删除accounts表记录（由于外键约束，staff表是子表，accounts表是父表，
        //    删除staff不会自动删除accounts，所以需要手动删除accounts）
        accountMapper.deleteByAccountId(accountId);
    }

    @Override
    public void updateStaff(Staff staff) {
        staffMapper.updateStaff(staff);
    }

    @Override
    @Transactional
    public void addStaff(Staff staff) {
        // 1. 手机号不能重复
        if (accountMapper.selectByPhone(staff.getPhone()) != null) {
            throw new RuntimeException("手机号已存在");
        }

        // 2. 生成新的 account_id（全局唯一账号ID）
        String maxAccountId = accountMapper.selectMaxAccountId();
        String newAccountId;
        if (maxAccountId == null || maxAccountId.isEmpty()) {
            newAccountId = "ACC0000001";
        } else {
            String numPart = maxAccountId.substring(3); // 提取数字部分
            int next = Integer.parseInt(numPart) + 1;
            newAccountId = String.format("ACC%07d", next);
        }

        // 3. 生成新的 staff_id
        String maxStaffId = staffMapper.selectMaxStaffId();
        String newStaffId;
        if (maxStaffId == null || maxStaffId.isEmpty()) {
            newStaffId = "STAFF00001";
        } else {
            // 处理格式：STAFF00001
            String numPart;
            if (maxStaffId.startsWith("STAFF")) {
                numPart = maxStaffId.substring(5); // STAFF00001 -> 00001
            } else {
                numPart = maxStaffId;
            }
            int next = Integer.parseInt(numPart) + 1;
            newStaffId = String.format("STAFF%05d", next);
        }

        // 4. 生成默认用户名（基于姓名和手机号后4位）
        String defaultUsername = staff.getName().toLowerCase().replaceAll("\\s+", "") + 
                                 staff.getPhone().substring(staff.getPhone().length() - 4);
        // 确保用户名唯一
        String username = defaultUsername;
        int suffix = 1;
        while (accountMapper.selectByUsername(username) != null) {
            username = defaultUsername + suffix;
            suffix++;
        }

        // 5. 确定角色（根据职位）
        String role = "coach"; // 默认教练
        if ("管理员".equals(staff.getRole())) {
            role = "admin";
        } else if ("前台".equals(staff.getRole())) {
            role = "admin"; // 前台也使用admin角色
        }

        // 6. 先插入 accounts 表（因为staff表有外键依赖）
        Account account = new Account();
        account.setAccountId(newAccountId);
        account.setUsername(username);  // 自动生成的用户名
        account.setPassword("123456");  // 默认密码（后续可要求修改）
        account.setPhone(staff.getPhone());
        account.setRole(role);

        accountMapper.insert(account);

        // 7. 插入 staff 表（关联account_id）
        staff.setStaffId(newStaffId);
        staff.setAccountId(newAccountId);  // 关联账号ID
        if (staff.getStatus() == null || staff.getStatus().isEmpty()) {
            staff.setStatus("在职");  // 默认状态
        }

        try {
            staffMapper.insert(staff);
        } catch (DuplicateKeyException e) {
            throw new RuntimeException("员工ID已存在");
        }
    }
}

