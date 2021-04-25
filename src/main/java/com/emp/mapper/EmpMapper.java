package com.emp.mapper;

import com.baomidou.mybatisplus.mapper.BaseMapper;
import com.emp.entity.Employee;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository

public interface EmpMapper extends BaseMapper<Employee> {
    List<Employee> selectList();
}
