package com.emp.controller;

import com.emp.entity.Dept;
import com.emp.service.DeptService;
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

import java.util.Date;

@RestController
@RequestMapping("dept")
public class DeptController {

    protected final Log logger = LogFactory.getLog(getClass());

    @Autowired
    DeptService deptService;

    @RequestMapping(value = "/selectList")
    public Result selectList() {
        return ResultBuilder.withPayload(deptService.selectList()).build();
    }

    @RequestMapping(value = "/updateById", method = RequestMethod.POST)
    public Result updateById(@RequestBody Dept dept) throws Exception {
        dept.setModifiedBy("sa");
        dept.setModifyDate(new Date());
        deptService.updateById(dept);
        return ResultBuilder.success().build();
    }


    @RequestMapping(value = "/insert", method = RequestMethod.POST)
    public Result insert(@RequestBody Dept dept) throws Exception {
        dept.setId(IdKit.createId());
        dept.setCreatedBy("sa");
        dept.setCreateDate(new Date());
        deptService.insert(dept);
        return ResultBuilder.success().build();
    }

    @RequestMapping(value = "/deleteById")
    public Result deleteById(String id) {
        deptService.deleteById(id);
        return ResultBuilder.success().build();
    }
}
