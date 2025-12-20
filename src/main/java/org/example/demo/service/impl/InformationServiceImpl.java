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
    public Member getMemberInfo(String memberId) {
        return memberMapper.selectByMemberId(memberId);
    }

    @Override
    @Transactional
    public void updateMemberBaseInfo(String memberId, String name, String phone) {

        Member self = memberMapper.selectByMemberId(memberId);
        if (self == null) {
            throw new RuntimeException("用户不存在");
        }

        // ===== 用户名校验（仅在真的修改时）=====
        if (name != null && !name.isBlank() && !name.equals(self.getName())) {

            Member nameOwner = memberMapper.selectByField("name", name);
            if (nameOwner != null && !memberId.equals(nameOwner.getMemberId())) {
                throw new RuntimeException("用户名已存在");
            }

            Account a1 = accountMapper.selectByUsername(name);
            if (a1 != null && !memberId.equals(a1.getAccountId())) {
                throw new RuntimeException("用户名已存在");
            }
        }
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
            if (a2 != null && !memberId.equals(a2.getAccountId())) {
                throw new RuntimeException("手机号已存在");
            }
        }
        // ===== 执行更新（使用旧值兜底）=====
        String finalName = (name != null && !name.isBlank()) ? name : self.getName();
        String finalPhone = (phone != null) ? phone : self.getPhone();

        memberMapper.updateBaseInfo(memberId, finalName, finalPhone);
        accountMapper.updateUsernameAndPhone(memberId, finalName, finalPhone);
    }


    @Override
    public boolean isUnique(String selfId, String field, String value) {

        Member m = memberMapper.selectByField(field, value);
        if (m == null) return true;

        return selfId.equals(m.getMemberId());
    }
}
