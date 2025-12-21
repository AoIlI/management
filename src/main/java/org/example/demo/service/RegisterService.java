package org.example.demo.service;

import org.example.demo.entity.Account;
import org.example.demo.entity.Member;
import org.example.demo.mapper.AccountMapper;
import org.example.demo.mapper.MemberMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class RegisterService {

    private final MemberMapper memberMapper;
    private final AccountMapper accountMapper;

    public RegisterService(MemberMapper memberMapper,
                           AccountMapper accountMapper) {
        this.memberMapper = memberMapper;
        this.accountMapper = accountMapper;
    }
    /**
     * 注册会员
     * 注意：username是昵称（全局唯一），name是真实姓名（可以重复）
     */
    @Transactional
    public void registerMember(String username, String password, String phone, String realName) {

        // 1. 用户名（昵称）不能重复
        if (accountMapper.selectByUsername(username) != null) {
            throw new RuntimeException("用户名已存在");
        }

        // 2. 手机号不能重复
        if (accountMapper.selectByPhone(phone) != null) {
            throw new RuntimeException("手机号已存在");
        }

        // 3. 生成新的 account_id（全局唯一账号ID）
        String maxAccountId = accountMapper.selectMaxAccountId();
        String newAccountId;
        if (maxAccountId == null || maxAccountId.isEmpty()) {
            newAccountId = "ACC0000001";
        } else {
            String numPart = maxAccountId.substring(3); // 提取数字部分
            int next = Integer.parseInt(numPart) + 1;
            newAccountId = String.format("ACC%07d", next);
        }

        // 4. 生成新的 member_id
        String maxMemberId = memberMapper.selectMaxMemberId();
        String newMemberId;
        if (maxMemberId == null || maxMemberId.isEmpty()) {
            newMemberId = "MEMBER0001";
        } else {
            // 处理格式：MEMBER0001 或 M001
            String numPart;
            if (maxMemberId.startsWith("MEMBER")) {
                numPart = maxMemberId.substring(6); // MEMBER0001 -> 0001
            } else if (maxMemberId.startsWith("M")) {
                numPart = maxMemberId.substring(1); // M001 -> 001
            } else {
                numPart = maxMemberId;
            }
            int next = Integer.parseInt(numPart) + 1;
            newMemberId = String.format("MEMBER%04d", next);
        }

        // 5. 先插入 accounts 表（因为members表有外键依赖）
        Account account = new Account();
        account.setAccountId(newAccountId);
        account.setUsername(username);  // 昵称（全局唯一）
        account.setPassword(password);  // 当前未加密（后续可加）
        account.setPhone(phone);
        account.setRole("member");

        accountMapper.insert(account);

        // 6. 插入 members 表（关联account_id）
        Member member = new Member();
        member.setMemberId(newMemberId);
        member.setAccountId(newAccountId);  // 关联账号ID
        // 真实姓名可以为空，新注册用户需要自己去修改
        // 使用空字符串而不是null，因为数据库字段是NOT NULL
        member.setName(realName != null && !realName.isBlank() ? realName : "");  // 真实姓名（可以重复，可以为空）
        member.setPhone(phone);
        member.setMembershipType("普通会员");
        member.setStatus("正常");
        member.setAvailableClasses(3);  // 普通会员默认3次
        member.setLastResetDate(null);  // 普通会员不按月重置

        memberMapper.insert(member);
    }
    /* ================= 新增：供前端实时校验使用 ================= */
    /**
     * 用户名是否存在
     */
    public boolean usernameExists(String username) {
        return accountMapper.selectByUsername(username) != null;
    }
    /**
     * 手机号是否存在
     */
    public boolean phoneExists(String phone) {
        return accountMapper.selectByPhone(phone) != null;
    }
}
