package com.emp.service;

import com.baomidou.mybatisplus.service.impl.ServiceImpl;
import com.emp.entity.Employee;
import com.emp.entity.User;
import com.emp.mapper.EmpMapper;
import com.emp.mapper.UserMapper;
import com.emp.util.Result;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class UserService extends ServiceImpl<UserMapper, User> {

    private static final Logger LOG = LoggerFactory.getLogger(UserService.class);

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
}
