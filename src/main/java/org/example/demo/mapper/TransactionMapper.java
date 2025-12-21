package org.example.demo.mapper;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.example.demo.entity.Transaction;

import java.util.List;

@Mapper
public interface TransactionMapper {
    
    String selectMaxTransactionId();
    
    int insert(Transaction transaction);
    
    List<Transaction> selectByMemberId(@Param("memberId") String memberId);
}



