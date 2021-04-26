package com.emp.service;

import com.emp.entity.User;
import com.emp.exception.UserException;
import com.emp.mapper.UserMapper;
import com.emp.util.Result;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.Map;

@Service
public class LoginService {

    private static final Logger LOG = LoggerFactory.getLogger(LoginService.class);

    @Autowired
    UserMapper userMapper;

    @Autowired
    UserService userService;

    /**
     * 登录验证
     *
     * @param userId
     * @param password
     * @return
     */
    public Result verify(String userId, String password) {
        return verifyUser(userId, password);
    }

    private Result verifyUser(String userId, String password) {
        LOG.debug("用户尝试登录", userId);
        User user = userService.selectUserByEmpId(userId);
        Result result = new Result();
        if (user == null) {
            result.setCode(0);
            result.setTips("该用户不存在");
            result.setException("登录失败");
        } else {
            String pwd = user.getPassword();
            if (password == pwd) {
                result.setCode(0);
                result.setTips("密码不正确");
                result.setException("登录失败");
            } else {
                LOG.debug("用户登录成功", userId);
                result.setCode(1);
                result.setPayload(user);
            }
        }
        return result;
    }

    public String queryNameById(String username) {
        User user = userMapper.selectById(username);
        if (user != null)
            return user.getEmpId();
        return "不存在该用户";
    }

    public Boolean confirmPassword(Map<String, Object> map) {
        String id = (String) map.get("username");
        String password = (String) map.get("password");
        User user = new User();
        user.setId(id);
        User sieUser = userMapper.selectOne(user);
        // if (permissionService.md5Password(password).equals(sieUser.getPassword()) &&
        // sieUser.getTypeCode().equals("1")&& sieUser.getStatusCode().equals("1")) {
        // return true;
        // } else {
        // return false;
        // }
        return true;
    }

}
