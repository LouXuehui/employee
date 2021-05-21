package com.emp.mapper;

import com.baomidou.mybatisplus.mapper.BaseMapper;
import com.emp.entity.User;
import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository

public interface UserMapper extends BaseMapper<User> {

    User selectUserByEmpId(@Param("empId") String empId);

    User selectUserByEmpIdAndRoleId(@Param("empId") String empId, @Param("roleId") String roleId);

    List<User> selectList();
}
