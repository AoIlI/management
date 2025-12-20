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
     * 注册会员（你已经验证成功的主流程，不动）
     */
    @Transactional
    public void registerMember(String username, String password, String phone) {

        // 1. 用户名不能重复
        if (accountMapper.selectByUsername(username) != null) {
            throw new RuntimeException("用户名已存在");
        }

        // 2. 手机号不能重复
        if (accountMapper.selectByPhone(phone) != null) {
            throw new RuntimeException("手机号已存在");
        }

        // 3. 生成新的 member_id
        String maxId = memberMapper.selectMaxMemberId(); // M010
        int next = Integer.parseInt(maxId.substring(1)) + 1;
        String newMemberId = String.format("M%03d", next);

        // 4. 插入 members 表
        Member member = new Member();
        member.setMemberId(newMemberId);
        member.setName(username);          // 简化：用户名即姓名
        member.setPhone(phone);
        member.setMembershipType("普通会员");
        member.setStatus("正常");

        memberMapper.insert(member);

        // 5. 插入 accounts 表
        Account account = new Account();
        account.setAccountId(newMemberId);
        account.setUsername(username);
        account.setPassword(password);     // 当前未加密（后续可加）
        account.setPhone(phone);
        account.setRole("member");

        accountMapper.insert(account);
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
