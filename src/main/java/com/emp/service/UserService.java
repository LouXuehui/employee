package com.emp.service;

import com.baomidou.mybatisplus.service.impl.ServiceImpl;
import com.emp.entity.Dept;
import com.emp.entity.Employee;
import com.emp.entity.Position;
import com.emp.entity.User;
import com.emp.mapper.EmpMapper;
import com.emp.mapper.UserMapper;
import com.emp.util.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.Serializable;
import java.util.List;
import java.util.Map;

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
                user.setPhotoUrl(employee.getPhotoUrl());
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

    public Result updatePassWord(Map params) {
        Result result = new Result();
        User user = userMapper.selectById((Serializable) params.get("id"));
        if (params.get("oldPassword").equals(user.getPassword())) {
            user.setPassword((String) params.get("password"));
            userMapper.updateById(user);
            result.setCode(1);
            result.setPayload(user);
        } else {
            result.setCode(0);
            result.setException("原密码不正确");
            result.setTips("原密码不正确");
        }
        return result;
    }
}
