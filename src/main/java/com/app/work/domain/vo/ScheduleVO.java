package com.app.work.domain.vo;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ScheduleVO {
    private String toDay;
    private Integer workNumber;
    private String workStartTime;
    private String workEndTime;
    private String workTitle;
    private String workDetail;
    private String workStatus;
    private Integer memberNumber;
    private String memberName;
    private String memberRank;
    private String workSpentTime;
    private Integer workPlaceNumber;
    private String workPlaceName;
    private String toTime;
    private String workStartTime2;
    private String workStartTime3;
    private String workEndTime2;
    private String memberUse;
    private String workPredictTime;
    private String realWorkPredictTime;
    private String workRealStartTime;
    private String workRealStartTime2;
    private String workRealStartTime3;
    private String workOff;
}
