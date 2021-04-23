package com.emp.service;

import com.emp.entity.User;
import com.emp.exception.UserException;
import com.emp.mapper.UserMapper;
import com.emp.util.EncryptUtils;
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

    /**
     * 登录验证
     *
     * @param userId
     * @param password
     * @return
     */
    public User verify(String userId, String password) throws UserException {
        return verifyUser(userId, password);
    }

    private User verifyUser(String userId, String password) throws UserException {
        LOG.debug("用户尝试登录{}", userId);
        if (StringUtils.isEmpty(password)) {
            throw new UserException("密码不能为空");
        } else {
            User user = userMapper.selectById(userId);
            if (user == null) {
                throw new UserException("该用户不存在:" + userId);
            } else {
                // if ("0".equals(user.getStatusCode())) {
                // throw new UserException("该用户已停用:" + userId);
                // } else
                // if (!EncryptUtils.md5(password).equals(user.getPassword())) {
                // throw new UserException("密码不正确:" + userId);
                // }
                String pwd = user.getPassword();
                if (password == pwd) {
                    throw new UserException("密码不正确:" + userId);
                } else {
                    LOG.debug("用户登录成功{}", userId);
                    return user;
                }
            }
        }
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
