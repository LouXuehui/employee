package com.emp.entity;

import com.baomidou.mybatisplus.activerecord.Model;
import com.baomidou.mybatisplus.annotations.TableField;
import com.baomidou.mybatisplus.annotations.TableId;
import com.baomidou.mybatisplus.annotations.TableName;
import java.io.Serializable;
import java.util.Date;

@TableName("User")
public class User implements Serializable {
    private static final long serialVersionUID = 1L;
    @TableId("ID")
    private String id;
    @TableField("EMP_NO")
    private String empId;
    @TableField("PWD")
    private String password;
    @TableField("RID")
    private String roleId;
//    @TableField("CREATED_BY")
//    private String createdBy;
//    @TableField("CREATE_DATE")
//    private Date createDatetime;
//    @TableField("MODIFIED_BY")
//    private String modifiedBy;
//    @TableField("MODIFY_DATE")
//    private Date modifyDatetime;


    public static long getSerialVersionUID() {
        return serialVersionUID;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getEmpId() {
        return empId;
    }

    public void setEmpId(String empId) {
        this.empId = empId;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getRoleId() {
        return roleId;
    }

    public void setRoleId(String roleId) {
        this.roleId = roleId;
    }

    @Override
    public String toString() {
        return "User{" +
                "id='" + id + '\'' +
                ", empId='" + empId + '\'' +
                ", password='" + password + '\'' +
                ", roleId='" + roleId + '\'' +
                '}';
    }
}
