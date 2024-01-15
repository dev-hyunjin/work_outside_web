package com.app.work.domain.vo;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class MemberVO {
    private Integer memberNumber;
    private String memberId;
    private String memberPassword;
    private String memberName;
    private String memberRank;
    private String memberUse;
    private Integer deptNumber;
    private Integer teamNumber;
    private String deptName;
    private String teamName;
    private Integer sessionNumber;
}
