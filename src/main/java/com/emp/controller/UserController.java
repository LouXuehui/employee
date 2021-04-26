package com.emp.controller;

import com.emp.entity.User;
import com.emp.service.UserService;
import com.emp.util.Result;
import com.emp.util.ResultBuilder;
import com.joinforwin.toolkit.kit.IdKit;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("user")
public class UserController {

    protected final Log logger = LogFactory.getLog(getClass());

    @Autowired
    UserService userService;

    @RequestMapping(value = "/selectList")
    public Result selectList() {
        return ResultBuilder.withPayload(userService.selectList()).build();
    }

    @RequestMapping(value = "/updateById", method = RequestMethod.POST)
    public Result updateById(@RequestBody User user) throws Exception {
//        employee.setModifiedBy("sa");
//        employee.setModifyDate(new Date());
        userService.updateById(user);
        return ResultBuilder.success().build();
    }


    @RequestMapping(value = "/insert", method = RequestMethod.POST)
    public Result insert(@RequestBody User user) throws Exception {
        user.setId(IdKit.createId());
//        employee.setCreatedBy("sa");
//        employee.setCreateDate(new Date());
        userService.insert(user);
        return ResultBuilder.success().build();
    }

    @RequestMapping(value = "/deleteById")
    public Result deleteByMap(String userId) {
        userService.deleteById(userId);
        return ResultBuilder.success().build();
    }
}
