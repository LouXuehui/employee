package com.emp.service;

import com.baomidou.mybatisplus.service.impl.ServiceImpl;
import com.emp.entity.Dept;
import com.emp.entity.Position;
import com.emp.mapper.DeptMapper;
import com.emp.mapper.PositionMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PositionService extends ServiceImpl<PositionMapper, Position> {

    private static final Logger LOG = LoggerFactory.getLogger(PositionService.class);

    @Autowired
    PositionMapper positionMapper;

    @Autowired
    DeptMapper deptMapper;

    /**
     * 查询
     *
     * @return
     */
    public List<Position> selectList() {
        List<Position> list = positionMapper.selectList();
        for (Position position : list) {
            Dept dept = deptMapper.selectById(position.getDeptId());
            position.setDeptName(dept.getName());
        }

        return list;
    }

    public Position selectById(String id) {
        return positionMapper.selectById(id);
    }

}
