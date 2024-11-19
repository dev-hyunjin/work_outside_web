package com.app.work.schedule.service;

import com.app.work.domain.dto.WorkplaceDTO;
import com.app.work.domain.vo.ScheduleVO;
import com.app.work.mapper.member.ScheduleMapper;
import com.app.work.mapper.workplace.WorkplaceMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ScheduleService {

    private final ScheduleMapper scheduleMapper;
    private final WorkplaceMapper workplaceMapper;

//  날짜
    public String findToDay(String toDay){
        return scheduleMapper.toDay(toDay);
    }

//  시간
    public String findToTime(String toTime) {return scheduleMapper.toTime(toTime);}
    public String findEndTime(String endTime) {return scheduleMapper.endTime(endTime);}

//    등록된 일정 리스트
    public List<ScheduleVO> findScheduleList(Integer memberNumber){
        List<ScheduleVO> list = scheduleMapper.scheduleList(memberNumber);

        return list;
    }

//    일정 완료하기
    public void modifySchedule(Integer workNumber, Integer memberNumber, String workStatus, String updateEndTime, String workRealStartTime){
        scheduleMapper.scheduleStatus(workNumber, memberNumber, workStatus, updateEndTime, workRealStartTime);
    }

//    근무지 리스트
    public List<WorkplaceDTO> findWorkName(){
        List<WorkplaceDTO> workList = scheduleMapper.workList();

        for(int i=0; i<workList.size(); i++){
            workList.get(i).getWorkplaceNumber();
            workList.get(i).getWorkplaceName();
        }

        return workList;
    }

    public ScheduleVO findData(Integer workNumber){
        if (workNumber == null) {
            throw new IllegalArgumentException("일정 번호 누락");
        }
        return Optional.ofNullable(scheduleMapper.getData(workNumber)).orElseThrow(() -> {
                    throw new IllegalArgumentException("존재하지 않는 외근 번호");
        });
    }

//    일정 등록하기
    public void workRegister(ScheduleVO scheduleVO){
        if (scheduleVO.getMemberNumber() == null) {
            throw new IllegalArgumentException("회원 번호 누락");
        }
        scheduleMapper.workInsert(scheduleVO);
    }

    public void scheduleModify(ScheduleVO scheduleVO){
        if (scheduleVO == null) {
            throw new IllegalArgumentException("번호 누락");
        }
        scheduleMapper.scheduleUpdate(scheduleVO);
    }

    public void scheduleModify2(ScheduleVO scheduleVO){
        if (scheduleVO == null) {
            throw new IllegalArgumentException("번호 누락");
        }
        scheduleMapper.scheduleUpdate2(scheduleVO);
    }

    public void SpentTimeModify(Integer workNumber, String workSpentTime){
        if (workNumber == null) {
            throw new IllegalArgumentException("번호 누락");
        }
        scheduleMapper.spentTime(workNumber, workSpentTime);
    }

    public ScheduleVO findScheduleTime(Integer workNumber) {
        if (workNumber == null) {
            throw new IllegalArgumentException("번호 누락");
        }
        return Optional.ofNullable(scheduleMapper.scheduleTime(workNumber)).orElseThrow(() -> {
            throw new IllegalArgumentException("존재하지 않는 외근 번호");
        });
    }

    public void scheduleRemove(Integer workNumber) {
        if (workNumber == null) {
            throw new IllegalArgumentException("번호 누락");
        }

        scheduleMapper.scheduleDelete(workNumber);
    }

    public void vacationModify(Integer memberNumber, String memberUse){
        if (memberNumber == null) {
            throw new IllegalArgumentException("멤버 번호 누락");
        }

        scheduleMapper.vacationUpdate(memberNumber, memberUse);
    }

    //스케줄 처리
    public List<ScheduleVO> findSchedule(){
        List<ScheduleVO> list = scheduleMapper.schedule();
        return list;
    }

    //스케줄 - 상태만 변경
    public void status(Integer workNumber, Integer memberNumber, String workStatus) {
        scheduleMapper.status(workNumber, memberNumber, workStatus);

    }
}
