package com.emp.controller;

import com.emp.entity.Employee;
import com.emp.service.EmpService;
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

    @RequestMapping(value = "updateById", method = RequestMethod.POST)
    public Result updateById(@RequestBody Employee employee) throws Exception {
//        employee.setModifiedBy("sa");
//        employee.setModifyDate(new Date());
        empService.updateById(employee);
        return ResultBuilder.success().build();
    }


    @RequestMapping(value = "insert", method = RequestMethod.POST)
    public Result insert(@RequestBody Employee employee) throws Exception {
        employee.setId(IdKit.createId());
//        employee.setCreatedBy("sa");
//        employee.setCreateDate(new Date());
        empService.insert(employee);
        return ResultBuilder.success().build();
    }

    @RequestMapping(value = "deleteById")
    public Result deleteByMap(String empId) {
        empService.deleteById(empId);
        return ResultBuilder.success().build();
    }
}
