package com.app.work.schedule.controller;

import com.app.work.domain.dto.WorkplaceDTO;
import com.app.work.domain.vo.ScheduleVO;
import com.app.work.schedule.service.ScheduleService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

@RestController
@RequestMapping("/schedules/*")
@RequiredArgsConstructor
public class ScheduleRestController {

    private final ScheduleService scheduleService;

    @PostMapping("/status")
    public String scheduleStatus(HttpServletRequest req, ScheduleVO scheduleVO, Integer workNumber, String workSpentTime, String workRealStartTime){
        Integer memberNumber  = (Integer) req.getSession().getAttribute("sessionNumber");
        scheduleVO.setMemberNumber(memberNumber);

        String workStatus = scheduleVO.getWorkStatus().equals("업무시작") ? "진행중" : "종료";
        String updateEndTime = scheduleVO.getWorkStatus().equals("업무시작") ? null : "Y";

        scheduleService.modifySchedule(workNumber, memberNumber, workStatus, updateEndTime, workRealStartTime);
        if(scheduleVO.getWorkStatus().equals("완료")) {
            scheduleService.SpentTimeModify(workNumber, workSpentTime);
        }
        return "진행완료 업데이트 성공";
    }

    @PostMapping("/sdAdd")
    public String scheduleAdd(ScheduleVO scheduleVO, HttpServletRequest req){
        int memberNumber = (Integer) req.getSession().getAttribute("sessionNumber");
        scheduleVO.setMemberNumber(memberNumber);
        scheduleService.workRegister(scheduleVO);

        return  "등록 성공";
    }

    @PatchMapping("/update")
    public String scheduleUpdate(ScheduleVO scheduleVO , Integer workNumber , HttpServletRequest req){
        System.out.println(scheduleVO.getWorkPlaceNumber());
        scheduleVO.setWorkNumber(workNumber);
        scheduleService.scheduleModify(scheduleVO);

        return "업데이트 성공";
    }

    @PatchMapping("/update2")
    public String scheduleUpdate2(ScheduleVO scheduleVO , Integer workNumber , HttpServletRequest req){

        scheduleVO.setWorkNumber(workNumber);
        scheduleService.scheduleModify2(scheduleVO);

        return "업데이트 성공";
    }

    @GetMapping("/time")
    public String scheduleTime(Integer workNumber, ScheduleVO scheduleVO,HttpServletRequest req){
        int memberNumber = (Integer) req.getSession().getAttribute("sessionNumber");
        scheduleVO.setMemberNumber(memberNumber);
        scheduleService.findScheduleTime(workNumber);

        return "불러오기 성공";
    }

    @DeleteMapping("/delete")
    public String scheduleDelete(Integer workNumber, HttpServletRequest req){
        scheduleService.scheduleRemove(workNumber);
        return "삭제 성공!";
    }

    @PatchMapping("/spentTime")
    public String SpentTime(Integer workNumber, String workSpentTime){
        scheduleService.SpentTimeModify(workNumber, workSpentTime);
        return "소요 시간 계산 성공";
    }

    @GetMapping("/data")
    public ScheduleVO getData(Integer workNumber){
        return scheduleService.findData(workNumber);
    }

    @PatchMapping("/vacation")
    public String vacationUpdate(Integer memberNumber, String memberUse, HttpSession session){
        session.setAttribute("memberUse", String.valueOf((memberUse.equals('Y') ? 'V' : memberUse)));
        scheduleService.vacationModify(memberNumber, memberUse);
        return "변경 성공";
    }
}
