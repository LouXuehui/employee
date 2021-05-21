package com.emp.service;

import com.baomidou.mybatisplus.service.impl.ServiceImpl;
import com.emp.entity.Employee;
import com.emp.entity.User;
import com.emp.mapper.EmpMapper;
import com.emp.mapper.UserMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService extends ServiceImpl<UserMapper, User> {

    @Autowired
    UserMapper userMapper;
    @Autowired
    EmpService empService;
    @Autowired
    EmpMapper empMapper;

    /**
     * 查询
     *
     * @return
     */
    public List<User> selectList() {
        List<User> list = userMapper.selectList();
        if (list != null && list.size() > 0) {
            for (User user : list) {
                Employee employee = empService.selectById(user.getEmpId());
                user.setName(employee.getName());
            }
        }
        return list;
    }

    public User selectUserByEmpId(String id) {
        return userMapper.selectUserByEmpId(id);
    }

    public User selectUserByEmpIdAndRoleId(String empId, String roleId) {
        return userMapper.selectUserByEmpIdAndRoleId(empId, roleId);
    }
}
