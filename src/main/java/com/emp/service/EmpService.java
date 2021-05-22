package com.emp.service;

import com.baomidou.mybatisplus.service.impl.ServiceImpl;
import com.emp.entity.Dept;
import com.emp.entity.Employee;
import com.emp.entity.Position;
import com.emp.mapper.EmpMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EmpService extends ServiceImpl<EmpMapper, Employee> {

    private static final Logger LOG = LoggerFactory.getLogger(EmpService.class);

    @Autowired
    EmpMapper empMapper;
    @Autowired
    DeptService deptService;
    @Autowired
    PositionService positionService;

    /**
     * 查询
     *
     * @return
     */
    public List<Employee> selectList() {
        List<Employee> list = empMapper.selectList();
        if(list.size()>0){
            for(Employee emp :list){
                Dept dept = deptService.selectById(emp.getDeptId());
                Position position = positionService.selectById(emp.getPositionId());
                emp.setPositionName(position.getName());
                emp.setDeptName(dept.getName());
            }
        }
        return list;
    }

    public Employee selectById(String empId) {
        return empMapper.selectById(empId);
    }

}
