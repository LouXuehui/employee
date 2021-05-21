package com.emp.service;

import com.baomidou.mybatisplus.service.impl.ServiceImpl;
import com.emp.entity.Dept;
import com.emp.mapper.DeptMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DeptService extends ServiceImpl<DeptMapper, Dept> {

    private static final Logger LOG = LoggerFactory.getLogger(DeptService.class);

    @Autowired
    DeptMapper deptMapper;

    /**
     * 查询
     *
     * @return
     */
    public List<Dept> selectList() {
        List<Dept> list = deptMapper.selectList();
        return list;
    }

    public Dept selectById(String id) {
        return deptMapper.selectById(id);
    }

}
