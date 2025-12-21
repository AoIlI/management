package org.example.demo.service;

import org.example.demo.entity.Member;
import org.example.demo.entity.Package;
import org.example.demo.entity.PurchaseRecord;
import org.example.demo.entity.Transaction;

import java.util.List;

public interface PurchaseService {
    
    List<Package> getAllPackages();
    
    Package getPackageById(String packageId);
    
    PurchaseRecord createPurchase(String memberId, String packageId);
    
    void confirmPayment(String purchaseId);
    
    void cancelPayment(String purchaseId);
    
    List<PurchaseRecord> getMemberPurchases(String memberId);
    
    void resetMonthlyClasses(Member member);
}



