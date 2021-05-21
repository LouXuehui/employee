package com.emp.mapper;

import com.baomidou.mybatisplus.mapper.BaseMapper;
import com.emp.entity.Position;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository

public interface PositionMapper extends BaseMapper<Position> {
    List<Position> selectList();
}
