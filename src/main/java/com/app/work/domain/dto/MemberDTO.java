package com.app.work.domain.dto;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class MemberDTO {
    private Integer memberNumber;
    private String memberId;
    private String memberPassword;
    private String memberName;
    private String memberRank;
    private String memberUse;
    private Integer deptNumber;
    private Integer teamNumber;
}
