package org.example.demo.mapper;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.example.demo.entity.PurchaseRecord;

import java.util.List;

@Mapper
public interface PurchaseMapper {
    
    String selectMaxPurchaseId();
    
    int insert(PurchaseRecord purchase);
    
    PurchaseRecord selectByPurchaseId(@Param("purchaseId") String purchaseId);
    
    int updatePaymentStatus(@Param("purchaseId") String purchaseId, 
                           @Param("paymentStatus") String paymentStatus);
    
    List<PurchaseRecord> selectByMemberId(@Param("memberId") String memberId);
}



