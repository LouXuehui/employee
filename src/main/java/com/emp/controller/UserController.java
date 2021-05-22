package com.emp.controller;

import com.emp.entity.Employee;
import com.emp.entity.User;
import com.emp.service.EmpService;
import com.emp.service.UserService;
import com.emp.util.Result;
import com.emp.util.ResultBuilder;
import com.joinforwin.toolkit.kit.IdKit;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("user")
public class UserController {

    protected final Log logger = LogFactory.getLog(getClass());

    @Autowired
    UserService userService;

    @Autowired
    EmpService empService;

    @RequestMapping(value = "/selectList")
    public Result selectList() {
        return ResultBuilder.withPayload(userService.selectList()).build();
    }

    @RequestMapping(value = "/updateById", method = RequestMethod.POST)
    public Result updateById(@RequestBody User user) throws Exception {
        user.setModifiedBy("sa");
        user.setModifyDate(new Date());
        userService.updateById(user);
        return ResultBuilder.success().build();
    }


    @RequestMapping(value = "/insert", method = RequestMethod.POST)
    public Result insert(@RequestBody Map param) throws Exception {
        List<String> list = (List<String>) param.get("list");
        if (list.size() > 0) {
            for (int i = 0; i < list.size(); i++) {
                User user = new User();
                user.setId(IdKit.createId());
                user.setCreatedBy("sa");
                user.setCreateDate(new Date());
                user.setPassword("123456");
                user.setEmpId(list.get(i));
                user.setRoleId((String) param.get("roleId"));
                userService.insert(user);
            }
        }
        return ResultBuilder.success().build();
    }

    @RequestMapping(value = "/deleteById")
    public Result deleteById(String id) {
        userService.deleteById(id);
        return ResultBuilder.success().build();
    }

    @RequestMapping(value = "/updatePassWord", method = RequestMethod.POST)
    public Result updatePassWord(@RequestBody Map params) {
        return userService.updatePassWord(params);
    }
}
