package com.app.work.schedule.controller;

import com.app.work.domain.dto.WorkplaceDTO;
import com.app.work.domain.vo.ScheduleVO;
import com.app.work.schedule.service.ScheduleService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.time.Duration;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;

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
        if (scheduleVO.getWorkStatus().equals("완료")) {
            String workRealStartTimeStr = scheduleVO.getWorkRealStartTime().trim(); // 공백 제거
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss.SSS"); // 밀리초 포함
            System.out.println("소요시간! : " + scheduleVO.getWorkSpentTime());

            LocalDateTime workRealStartTime2 = LocalDateTime.parse(workRealStartTimeStr, formatter);
            LocalDateTime workEndTime2 = LocalDateTime.now();

            Duration duration = Duration.between(workRealStartTime2, workEndTime2);
            long minutesSpent = duration.toMinutes();


            if (scheduleVO.getWorkSpentTime().equals("NaN")) {
                scheduleVO.setWorkSpentTime(String.valueOf(minutesSpent));
                scheduleService.SpentTimeModify(workNumber, scheduleVO.getWorkSpentTime());
            } else {
                scheduleService.SpentTimeModify(workNumber, workSpentTime);
            }

        }
        return "진행완료 업데이트 성공";
    }

    @PostMapping("/sdAdd")
    public String scheduleAdd(ScheduleVO scheduleVO, HttpServletRequest req){
        int memberNumber = (Integer) req.getSession().getAttribute("sessionNumber");
        scheduleVO.setMemberNumber(memberNumber);

        if (scheduleVO.getWorkRealStartTime() == null || scheduleVO.getWorkRealStartTime().equals("")) {
            scheduleVO.setWorkRealStartTime(null);
        } else {
            scheduleVO.setWorkRealStartTime(scheduleVO.getWorkRealStartTime());
        }

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

    @PostMapping("/vacationAdd")
    public String vacationAdd(Integer memberNumber, String vacationStDate, String vacationEndDate, String vacationCheck, HttpServletRequest req){
        memberNumber = (Integer) req.getSession().getAttribute("sessionNumber");
        scheduleService.vacationRegister(memberNumber, vacationStDate, vacationEndDate, vacationCheck);
        return  "등록 성공";
    }

    @PostMapping("/vacationEdit")
    public String vacationEdit(Integer memberNumber, ScheduleVO scheduleVO,HttpServletRequest req) {
        memberNumber = (Integer) req.getSession().getAttribute("sessionNumber");
        scheduleService.editVacation(memberNumber, scheduleVO.getVacationStDate(), scheduleVO.getVacationEndDate(), scheduleVO.getVacationCheck());
        return "수정 성공";
    }

    @DeleteMapping("/vacationDelete")
    public String vacationDelete(Integer memberNumber, HttpServletRequest req){
        memberNumber = (Integer) req.getSession().getAttribute("sessionNumber");
        scheduleService.vacationRemove(memberNumber);
        return "삭제 성공!";
    }
}
