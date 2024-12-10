package com.app.work.mapper.member;

import com.app.work.domain.dto.WorkplaceDTO;
import com.app.work.domain.vo.ScheduleVO;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface ScheduleMapper {
//    당일 날짜
    public String toDay(String toDay);

//    현재 시간
    public String toTime(String toTime);

//    종료 시간
    public String endTime(String endTime);

//    등록된 일정 리스트
    public List<ScheduleVO> scheduleList(Integer memberNumber);

//  일정 시작 시간
    public ScheduleVO scheduleTime(Integer workNumber);

//    현재 진행중인 일정 완료하기
    public void scheduleStatus(Integer workNumber, Integer memberNumber, String workStatus, String updateEndTime, String workRealStartTime);

//    일정 등록/수정 근무지 리스트 불러오기
    public List<WorkplaceDTO> workList();

//
    public ScheduleVO getData(Integer workNumber);

//    일정 등록
    public void workInsert(ScheduleVO scheduleVO);

//    일정 수정
    public void scheduleUpdate(ScheduleVO scheduleVO);
    public void scheduleUpdate2(ScheduleVO scheduleVO);

//    소요 시간 수정
    public void spentTime(Integer workNumber, String workSpentTime);

//    일정 삭제
    public void scheduleDelete(Integer workNumber);

    //    휴가 업데이트
    public void vacationUpdate(Integer memberNumber, String memberUse);

    //스케줄 처리
    public List<ScheduleVO> schedule();

    //상태만 변경
    public void status(Integer workNumber, Integer memberNumber, String workStatus);

    // 휴가 등록
    public void vacationInsert(Integer memberNumber, String vacationStDate, String vacationEndDate, String vacationCheck);

    // 휴가 삭제
    public void vacationDelete(Integer memberNumber);

    // 휴가 스케줄 처리
    public List<ScheduleVO> selectVacationList();

    // 휴가 수정 또는 삭제?
    public ScheduleVO selectVacation(Integer memberNumber);

    public Integer vacationCnt(Integer memberNumber);

    public void vacationEdit(Integer memberNumber, String vacationStDate, String vacationEndDate, String vacationCheck);
}
