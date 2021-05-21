package com.emp.controller;

import com.emp.entity.Employee;
import com.emp.service.EmpService;
import com.emp.util.Result;
import com.emp.util.ResultBuilder;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Date;

@RestController
@RequestMapping("emp")
public class EmpController {

    protected final Log logger = LogFactory.getLog(getClass());

    @Autowired
    EmpService empService;

    @RequestMapping(value = "/selectList")
    public Result selectList() {
        return ResultBuilder.withPayload(empService.selectList()).build();
    }

    @RequestMapping(value = "/updateById", method = RequestMethod.POST)
    public Result updateById(@RequestBody Employee employee) throws Exception {
        employee.setModifiedBy("sa");
        employee.setModifyDate(new Date());
        empService.updateById(employee);
        return ResultBuilder.success().build();
    }

    @RequestMapping(value = "/insert", method = RequestMethod.POST)
    public Result insert(@RequestBody Employee employee) {
//        employee.setId(IdKit.createId());
        employee.setCreatedBy("sa");
        employee.setCreateDate(new Date());
        empService.insert(employee);
        return ResultBuilder.success().build();
    }

    @RequestMapping(value = "/deleteById")
    public Result deleteById(String id) {
        empService.deleteById(id);
        return ResultBuilder.success().build();
    }

    @RequestMapping(value = "/selectById")
    public Result selectById(@RequestParam String empId) {
        return ResultBuilder.withPayload(empService.selectById(empId)).build();
    }
}
