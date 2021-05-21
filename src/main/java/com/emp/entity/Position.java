package com.emp.entity;

import com.baomidou.mybatisplus.annotations.TableField;
import com.baomidou.mybatisplus.annotations.TableId;
import com.baomidou.mybatisplus.annotations.TableName;

import java.io.Serializable;
import java.util.Date;

@TableName("position")
public class Position implements Serializable {
    private static final long serialVersionUID = 1L;
    @TableId("ID")
    private String id;
    @TableField("NAME")
    private String name;
    @TableField("DEPT_ID")
    private String deptId;
    @TableField("LEVEL")
    private String level;
    @TableField("REMARK")
    private String remark;
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

    //部门名称
    @TableField(exist = false)
    private String deptName;

    public static long getSerialVersionUID() {
        return serialVersionUID;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getRemark() {
        return remark;
    }

    public void setRemark(String remark) {
        this.remark = remark;
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

    public String getDeptId() {
        return deptId;
    }

    public void setDeptId(String deptId) {
        this.deptId = deptId;
    }

    public String getLevel() {
        return level;
    }

    public void setLevel(String level) {
        this.level = level;
    }

    public String getIsUse() {
        return isUse;
    }

    public void setIsUse(String isUse) {
        this.isUse = isUse;
    }

    public String getDeptName() {
        return deptName;
    }

    public void setDeptName(String deptName) {
        this.deptName = deptName;
    }

    @Override
    public String toString() {
        return "Position{" +
                "id='" + id + '\'' +
                ", name='" + name + '\'' +
                ", deptId='" + deptId + '\'' +
                ", level='" + level + '\'' +
                ", remark='" + remark + '\'' +
                ", isUse='" + isUse + '\'' +
                ", createdBy='" + createdBy + '\'' +
                ", createDate=" + createDate +
                ", modifiedBy='" + modifiedBy + '\'' +
                ", modifyDate=" + modifyDate +
                ", deptName='" + deptName + '\'' +
                '}';
    }
}
