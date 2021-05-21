package com.emp.service;

import com.emp.entity.Employee;
import com.emp.entity.User;
import com.emp.mapper.UserMapper;
import com.emp.util.Result;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class LoginService {

    private static final Logger LOG = LoggerFactory.getLogger(LoginService.class);

    @Autowired
    UserMapper userMapper;

    @Autowired
    UserService userService;

    @Autowired
    EmpService empService;

    /**
     * 登录验证
     *
     * @param userId
     * @param password
     * @return
     */
    public Result verify(String username, String password, String roleId) {
        return verifyUser(username, password, roleId);
    }

    private Result verifyUser(String username, String password, String roleId) {
        LOG.debug("用户尝试登录", username);
        User user = userService.selectUserByEmpId(username);
        User userOne = userService.selectUserByEmpIdAndRoleId(username, roleId);
        Result result = new Result();
        Map<String, Object> resultMap = new HashMap<>();
        if (user == null || userOne == null) {
            result.setCode(0);
            result.setTips("该用户不存在");
            result.setException("登录失败");
        } else {
            Employee employee = empService.selectById(user.getEmpId());
            resultMap.put("user", user);
            resultMap.put("employee", employee);
            String pwd = user.getPassword();
            if (!password.equals(pwd)) {
                result.setCode(0);
                result.setTips("密码不正确");
                result.setException("登录失败");
            } else {
                LOG.debug("用户登录成功", username);
                result.setCode(1);
                result.setPayload(resultMap);
            }
        }
        return result;
    }
}
