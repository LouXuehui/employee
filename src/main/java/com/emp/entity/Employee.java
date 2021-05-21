package com.emp.entity;

import com.baomidou.mybatisplus.annotations.TableField;
import com.baomidou.mybatisplus.annotations.TableId;
import com.baomidou.mybatisplus.annotations.TableName;

import java.io.Serializable;
import java.util.Date;

@TableName("emp")
public class Employee implements Serializable {
    private static final long serialVersionUID = 1L;
    @TableId("ID")
    private String id;
    @TableField("NAME")
    private String name;
    @TableField("SEX_CODE")
    private String sexCode;
    @TableField("PHOTO_URL")
    private String photoUrl;
    @TableField("TEL")
    private String tel;
    @TableField("ID_CARD")
    private String idCard;
    @TableField("BIRTH")
    private Date birth;
    @TableField("DEPT_ID")
    private String deptId;
    @TableField("POSITION_ID")
    private String positionId;
    @TableField("DEGREE")
    private String degree;
    @TableField("LOOK")
    private String look;
    @TableField("E_MAIL")
    private String email;
    @TableField("PLACE")
    private String place;
    @TableField("IS_MARRY")
    private String isMarry;
    @TableField("SCHOOL")
    private String school;
    @TableField("STATUS_CODE")
    private String statusCode;
    @TableField("IN_DATE")
    private Date inDate;
    @TableField("OUT_DATE")
    private Date outDate;
    @TableField("REMARK")
    private String remark;
    @TableField("CREATED_BY")
    private String createdBy;
    @TableField("CREATE_DATE")
    private Date createDate;
    @TableField("MODIFY_BY")
    private String modifiedBy;
    @TableField("MODIFY_DATE")
    private Date modifyDate;

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

    public String getSexCode() {
        return sexCode;
    }

    public void setSexCode(String sexCode) {
        this.sexCode = sexCode;
    }

    public String getPhotoUrl() {
        return photoUrl;
    }

    public void setPhotoUrl(String photoUrl) {
        this.photoUrl = photoUrl;
    }

    public String getTel() {
        return tel;
    }

    public void setTel(String tel) {
        this.tel = tel;
    }

    public String getIdCard() {
        return idCard;
    }

    public void setIdCard(String idCard) {
        this.idCard = idCard;
    }

    public Date getBirth() {
        return birth;
    }

    public void setBirth(Date birth) {
        this.birth = birth;
    }

    public String getDeptId() {
        return deptId;
    }

    public void setDeptId(String deptId) {
        this.deptId = deptId;
    }

    public String getPositionId() {
        return positionId;
    }

    public void setPositionId(String positionId) {
        this.positionId = positionId;
    }

    public String getDegree() {
        return degree;
    }

    public void setDegree(String degree) {
        this.degree = degree;
    }

    public String getLook() {
        return look;
    }

    public void setLook(String look) {
        this.look = look;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPlace() {
        return place;
    }

    public void setPlace(String place) {
        this.place = place;
    }

    public String getIsMarry() {
        return isMarry;
    }

    public void setIsMarry(String isMarry) {
        this.isMarry = isMarry;
    }

    public String getSchool() {
        return school;
    }

    public void setSchool(String school) {
        this.school = school;
    }

    public String getStatusCode() {
        return statusCode;
    }

    public void setStatusCode(String statusCode) {
        this.statusCode = statusCode;
    }

    public Date getInDate() {
        return inDate;
    }

    public void setInDate(Date inDate) {
        this.inDate = inDate;
    }

    public Date getOutDate() {
        return outDate;
    }

    public void setOutDate(Date outDate) {
        this.outDate = outDate;
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

    @Override
    public String toString() {
        return "Employee{" +
                "id='" + id + '\'' +
                ", name='" + name + '\'' +
                ", sexCode='" + sexCode + '\'' +
                ", photoUrl='" + photoUrl + '\'' +
                ", tel='" + tel + '\'' +
                ", idCard='" + idCard + '\'' +
                ", birth=" + birth +
                ", deptId='" + deptId + '\'' +
                ", positionId='" + positionId + '\'' +
                ", degree='" + degree + '\'' +
                ", look='" + look + '\'' +
                ", email='" + email + '\'' +
                ", place='" + place + '\'' +
                ", isMarry='" + isMarry + '\'' +
                ", school='" + school + '\'' +
                ", statusCode='" + statusCode + '\'' +
                ", inDate=" + inDate +
                ", outDate=" + outDate +
                ", remark='" + remark + '\'' +
                ", createdBy='" + createdBy + '\'' +
                ", createDate=" + createDate +
                ", modifiedBy='" + modifiedBy + '\'' +
                ", modifyDate=" + modifyDate +
                '}';
    }
}
