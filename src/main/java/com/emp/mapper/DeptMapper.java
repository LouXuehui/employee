package com.emp.mapper;

import com.baomidou.mybatisplus.mapper.BaseMapper;
import com.emp.entity.Dept;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository

public interface DeptMapper extends BaseMapper<Dept> {
    List<Dept> selectList();
}
