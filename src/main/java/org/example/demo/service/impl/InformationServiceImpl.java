package org.example.demo.service.impl;

import org.example.demo.entity.Account;
import org.example.demo.entity.Member;
import org.example.demo.mapper.AccountMapper;
import org.example.demo.mapper.MemberMapper;
import org.example.demo.service.InformationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class InformationServiceImpl implements InformationService {

    @Autowired
    private MemberMapper memberMapper;

    @Autowired
    private AccountMapper accountMapper;


    @Override
    public Member getMemberInfo(String accountId) {
        // 通过accountId查找member（因为session中存储的是accountId）
        return memberMapper.selectByAccountId(accountId);
    }

    @Override
    public Account getAccountInfo(String accountId) {
        // 通过accountId查找account信息
        return accountMapper.selectByAccountId(accountId);
    }

    @Override
    @Transactional
    public void updateMemberBaseInfo(String accountId, String name, String phone) {

        Member self = memberMapper.selectByAccountId(accountId);
        if (self == null) {
            throw new RuntimeException("用户不存在");
        }

        String memberId = self.getMemberId();
        if (memberId == null) {
            throw new RuntimeException("会员信息不存在");
        }

        // ===== 真实姓名（name）可以重复，直接更新即可 =====
        // ===== 手机号校验（仅在真的修改时）=====
        if (phone != null && !phone.equals(self.getPhone())) {

            if (!phone.matches("^1\\d{10}$")) {
                throw new RuntimeException("手机号格式不正确");
            }

            Member phoneOwner = memberMapper.selectByField("phone", phone);
            if (phoneOwner != null && !memberId.equals(phoneOwner.getMemberId())) {
                throw new RuntimeException("手机号已存在");
            }

            Account a2 = accountMapper.selectByPhone(phone);
            if (a2 != null && !accountId.equals(a2.getAccountId())) {
                throw new RuntimeException("手机号已存在");
            }
        }
        // ===== 执行更新（使用旧值兜底）=====
        // name是真实姓名，可以重复，直接更新
        String finalName = (name != null && !name.isBlank()) ? name : self.getName();
        String finalPhone = (phone != null) ? phone : self.getPhone();

        // 更新members表的真实姓名和手机号
        memberMapper.updateBaseInfo(memberId, finalName, finalPhone);
        // 更新accounts表的手机号（username是昵称，不在这里更新）
        accountMapper.updateUsernameAndPhone(accountId, null, finalPhone);
    }


    @Override
    public boolean isUnique(String accountId, String field, String value) {
        Member self = memberMapper.selectByAccountId(accountId);
        if (self == null) {
            return true;
        }

        Member m = memberMapper.selectByField(field, value);
        if (m == null) return true;

        return self.getMemberId().equals(m.getMemberId());
    }
}
