package org.example.demo.service.impl;

import org.example.demo.entity.Member;
import org.example.demo.entity.Package;
import org.example.demo.entity.PurchaseRecord;
import org.example.demo.entity.Transaction;
import org.example.demo.mapper.*;
import org.example.demo.service.PurchaseService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class PurchaseServiceImpl implements PurchaseService {

    private final PackageMapper packageMapper;
    private final PurchaseMapper purchaseMapper;
    private final MemberMapper memberMapper;
    private final TransactionMapper transactionMapper;

    public PurchaseServiceImpl(PackageMapper packageMapper, PurchaseMapper purchaseMapper,
                              MemberMapper memberMapper, TransactionMapper transactionMapper) {
        this.packageMapper = packageMapper;
        this.purchaseMapper = purchaseMapper;
        this.memberMapper = memberMapper;
        this.transactionMapper = transactionMapper;
    }

    @Override
    public List<Package> getAllPackages() {
        return packageMapper.selectAll();
    }

    @Override
    public Package getPackageById(String packageId) {
        return packageMapper.selectByPackageId(packageId);
    }

    @Override
    @Transactional
    public PurchaseRecord createPurchase(String memberId, String packageId) {
        // 获取会员信息
        Member member = memberMapper.selectByMemberId(memberId);
        if (member == null) {
            throw new RuntimeException("会员不存在");
        }

        // 获取套餐信息
        Package pkg = packageMapper.selectByPackageId(packageId);
        if (pkg == null || !"启用".equals(pkg.getStatus())) {
            throw new RuntimeException("套餐不存在或已停用");
        }

        // 生成购买记录ID
        String maxPurchaseId = purchaseMapper.selectMaxPurchaseId();
        String newPurchaseId;
        if (maxPurchaseId == null || maxPurchaseId.isEmpty()) {
            newPurchaseId = "PURCH00001";
        } else {
            String numPart = maxPurchaseId.substring(5); // PURCH00001 -> 00001
            int next = Integer.parseInt(numPart) + 1;
            newPurchaseId = String.format("PURCH%05d", next);
        }

        // 创建购买记录
        PurchaseRecord purchase = new PurchaseRecord();
        purchase.setPurchaseId(newPurchaseId);
        purchase.setMemberId(memberId);
        purchase.setPackageId(packageId);
        purchase.setAmount(pkg.getPrice());
        purchase.setPaymentStatus("待支付");
        purchase.setPurchaseTime(LocalDateTime.now());

        purchaseMapper.insert(purchase);

        return purchase;
    }

    @Override
    @Transactional
    public void confirmPayment(String purchaseId) {
        // 获取购买记录
        PurchaseRecord purchase = purchaseMapper.selectByPurchaseId(purchaseId);
        if (purchase == null) {
            throw new RuntimeException("购买记录不存在");
        }

        if ("已支付".equals(purchase.getPaymentStatus())) {
            throw new RuntimeException("该订单已支付");
        }

        // 更新支付状态
        purchaseMapper.updatePaymentStatus(purchaseId, "已支付");

        // 获取会员和套餐信息
        Member member = memberMapper.selectByMemberId(purchase.getMemberId());
        Package pkg = packageMapper.selectByPackageId(purchase.getPackageId());

        LocalDate now = LocalDate.now();

        if ("membership_card".equals(pkg.getPackageType())) {
            // 会员卡类型：更新会员类型和可用次数
            LocalDate endDate = now.plusDays(pkg.getValidityDays());
            
            memberMapper.updateMembershipAndClasses(
                member.getMemberId(),
                pkg.getMembershipType(),
                now,
                endDate,
                pkg.getClassesPerMonth(),  // 设置当月可用次数
                now  // 设置重置日期为今天
            );
        } else if ("class_pack".equals(pkg.getPackageType())) {
            // 课程包类型：只增加可用次数，不改变会员类型
            memberMapper.addAvailableClasses(member.getMemberId(), pkg.getClassesCount());
        }

        // 创建交易记录
        String maxTransactionId = transactionMapper.selectMaxTransactionId();
        String newTransactionId;
        if (maxTransactionId == null || maxTransactionId.isEmpty()) {
            newTransactionId = "TXN0000001";
        } else {
            String numPart = maxTransactionId.substring(3);
            int next = Integer.parseInt(numPart) + 1;
            newTransactionId = String.format("TXN%07d", next);
        }

        Transaction transaction = new Transaction();
        transaction.setTransactionId(newTransactionId);
        transaction.setMemberId(member.getMemberId());
        transaction.setAmount(purchase.getAmount());
        transaction.setTransactionType("购买");
        transaction.setDescription("购买套餐：" + pkg.getPackageName());
        transaction.setTransactionTime(LocalDateTime.now());

        transactionMapper.insert(transaction);
    }

    @Override
    @Transactional
    public void cancelPayment(String purchaseId) {
        PurchaseRecord purchase = purchaseMapper.selectByPurchaseId(purchaseId);
        if (purchase == null) {
            throw new RuntimeException("购买记录不存在");
        }

        if ("已支付".equals(purchase.getPaymentStatus())) {
            throw new RuntimeException("已支付的订单不能取消");
        }

        purchaseMapper.updatePaymentStatus(purchaseId, "已取消");
    }

    @Override
    public List<PurchaseRecord> getMemberPurchases(String memberId) {
        return purchaseMapper.selectByMemberId(memberId);
    }

    @Override
    @Transactional
    public void resetMonthlyClasses(Member member) {
        // 检查是否需要重置次数（按月重置的会员卡）
        if (member.getLastResetDate() == null) {
            return;
        }

        LocalDate now = LocalDate.now();
        LocalDate lastReset = member.getLastResetDate();

        // 如果已经跨月，需要重置次数
        if (now.getYear() > lastReset.getYear() || 
            (now.getYear() == lastReset.getYear() && now.getMonthValue() > lastReset.getMonthValue())) {
            
            // 根据会员类型设置次数
            Integer classesPerMonth = null;
            if ("年卡".equals(member.getMembershipType())) {
                classesPerMonth = 30;
            } else if ("季卡".equals(member.getMembershipType())) {
                classesPerMonth = 20;
            } else if ("月卡".equals(member.getMembershipType())) {
                classesPerMonth = 10;
            }

            if (classesPerMonth != null) {
                memberMapper.updateAvailableClasses(member.getMemberId(), classesPerMonth);
                // 更新重置日期
                memberMapper.updateMembershipAndClasses(
                    member.getMemberId(),
                    member.getMembershipType(),
                    member.getMembershipStartDate(),
                    member.getMembershipEndDate(),
                    classesPerMonth,
                    now
                );
            }
        }
    }
}

