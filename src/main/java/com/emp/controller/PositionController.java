package com.emp.controller;

import com.emp.entity.Position;
import com.emp.service.PositionService;
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
@RequestMapping("position")
public class PositionController {

    protected final Log logger = LogFactory.getLog(getClass());

    @Autowired
    PositionService positionService;

    @RequestMapping(value = "/selectList")
    public Result selectList() {
        return ResultBuilder.withPayload(positionService.selectList()).build();
    }

    @RequestMapping(value = "/updateById", method = RequestMethod.POST)
    public Result updateById(@RequestBody Position position) throws Exception {
        position.setModifiedBy("sa");
        position.setModifyDate(new Date());
        positionService.updateById(position);
        return ResultBuilder.success().build();
    }


    @RequestMapping(value = "/insert", method = RequestMethod.POST)
    public Result insert(@RequestBody Position position) throws Exception {
        position.setId(IdKit.createId());
        position.setCreatedBy("sa");
        position.setCreateDate(new Date());
        positionService.insert(position);
        return ResultBuilder.success().build();
    }

    @RequestMapping(value = "/deleteById")
    public Result deleteById(String id) {
        positionService.deleteById(id);
        return ResultBuilder.success().build();
    }
}
