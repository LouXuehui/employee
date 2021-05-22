package com.emp.entity;

import com.baomidou.mybatisplus.annotations.TableField;
import com.baomidou.mybatisplus.annotations.TableId;
import com.baomidou.mybatisplus.annotations.TableName;

import java.io.Serializable;
import java.util.Date;

@TableName("user")
public class User implements Serializable {
    private static final long serialVersionUID = 1L;
    @TableId("ID")
    private String id;
    @TableField("EMP_ID")
    private String empId;
    @TableField("PASSWORD")
    private String password;
    @TableField("ROLE_ID")
    private String roleId;
    @TableField("IS_USE")
    private String isUse;
    @TableField("CREATED_BY")
    private String createdBy;
    @TableField("CREATE_DATE")
    private Date createDate;
    @TableField("MODIFY_BY")
    private String modifiedBy;
    @TableField("MODIFY_DATE")
    private Date modifyDate;

    //名称
    @TableField(exist = false)
    private String name;

    //头像
    @TableField(exist = false)
    private String photoUrl;

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

    public String getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(String createdBy) {
        this.createdBy = createdBy;
    }

    public Date getCreateDate() {
        return createDate;
    }

    public void setCreateDate(Date createDate) {
        this.createDate = createDate;
    }

    public String getModifiedBy() {
        return modifiedBy;
    }

    public void setModifiedBy(String modifiedBy) {
        this.modifiedBy = modifiedBy;
    }

    public Date getModifyDate() {
        return modifyDate;
    }

    public void setModifyDate(Date modifyDate) {
        this.modifyDate = modifyDate;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getIsUse() {
        return isUse;
    }

    public void setIsUse(String isUse) {
        this.isUse = isUse;
    }


    public String getPhotoUrl() {
        return photoUrl;
    }

    public void setPhotoUrl(String photoUrl) {
        this.photoUrl = photoUrl;
    }

    @Override
    public String toString() {
        return "User{" +
                "id='" + id + '\'' +
                ", empId='" + empId + '\'' +
                ", password='" + password + '\'' +
                ", roleId='" + roleId + '\'' +
                ", isUse='" + isUse + '\'' +
                ", createdBy='" + createdBy + '\'' +
                ", createDate=" + createDate +
                ", modifiedBy='" + modifiedBy + '\'' +
                ", modifyDate=" + modifyDate +
                ", name='" + name + '\'' +
                ", photoUrl='" + photoUrl + '\'' +
                '}';
    }
}
