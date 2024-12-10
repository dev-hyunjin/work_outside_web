package com.app.work.schedule.controller;

import com.app.work.domain.vo.ScheduleVO;
import com.app.work.schedule.service.ScheduleService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class Schedule {
    private final ScheduleService scheduleService;

    @Scheduled(cron = "0 0/1 * * * *")
    public void scheduledCheck(){
        List<ScheduleVO> scheduleList = scheduleService.findSchedule();
        LocalDateTime now = LocalDateTime.now();

        DateTimeFormatter dateTimeFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");
        now.format(dateTimeFormatter);



        for (ScheduleVO scheduleVO : scheduleList) {
            if (scheduleVO.getWorkRealStartTime() == null) {
                log.info("workRealStartTime이 null이므로 업데이트를 수행하지 않습니다.");
            } else if(scheduleVO.getWorkStatus().equals("이동중") && scheduleVO.getWorkRealStartTime2().equals(now.format(dateTimeFormatter)) && scheduleVO.getWorkRealStartTime() != null) {
                scheduleVO.setWorkStatus("진행중"); // workStatus를 '진행중'으로 변경합니다.
                scheduleService.status(scheduleVO.getWorkNumber(), scheduleVO.getMemberNumber(),scheduleVO.getWorkStatus());
                log.info("workRealStartTime이 null이 아니므로 workStatus를 '진행중'으로 변경하고 업데이트를 수행했습니다.");
            }
        }
    }

    @Scheduled(cron = "0 0 0/1 * * *")
    public void vacationCheck(){
        List<ScheduleVO> vacationList = scheduleService.findVacationList();
        LocalDateTime now = LocalDateTime.now();

        DateTimeFormatter dateTimeFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        now.format(dateTimeFormatter);

        DateTimeFormatter dateTimeFormatter2 = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
        now.format(dateTimeFormatter2);

        for (ScheduleVO scheduleVO : vacationList) {
            log.info(scheduleVO.getVacationCheck());
            if(scheduleVO.getVacationCheck().equals("O")) {
                if (scheduleVO.getVacationStDate2().equals(now.format(dateTimeFormatter2))) {
                    // 시작 날짜가 현재 날짜와 동일하면 상태를 "V"로 변경
                    scheduleService.vacationModify(scheduleVO.getMemberNumber(), "V");
                    log.info("시작날짜가 동일하여 업데이트 합니다.");
                } else if (scheduleVO.getVacationEndDate2().equals(now.format(dateTimeFormatter2))) {
                    // 종료 날짜가 현재 날짜와 동일하면 상태를 "Y"로 변경하고 항목 삭제
                    scheduleService.vacationModify(scheduleVO.getMemberNumber(), "Y");
                    scheduleService.vacationRemove(scheduleVO.getMemberNumber());
                    log.info("종료날짜가 동일하여 해당 데이터를 삭제 합니다.");
                }  else if (!scheduleVO.getVacationEndDate2().equals(now.format(dateTimeFormatter2))) {
                    log.info("해당 날짜에 포함되는 휴가가 없어 수정 및 삭제하지 않았습니다.");
                }
            } else if(scheduleVO.getVacationCheck().equals("H")) {
                if (scheduleVO.getVacationStDate2().equals(now.format(dateTimeFormatter2))) {
                    // 시작 날짜가 현재 날짜와 동일하면 상태를 "V"로 변경
                    scheduleService.vacationModify(scheduleVO.getMemberNumber(), "V");
                } else if (scheduleVO.getVacationEndDate2().equals(now.format(dateTimeFormatter2))) {
                    // 종료 날짜가 현재 날짜와 동일하면 상태를 "Y"로 변경하고 항목 삭제
                    scheduleService.vacationModify(scheduleVO.getMemberNumber(), "Y");
                    scheduleService.vacationRemove(scheduleVO.getMemberNumber());
                }  else if (!scheduleVO.getVacationEndDate2().equals(now.format(dateTimeFormatter2))) {
                    log.info("해당 날짜에 포함되는 휴가가 없어 수정 및 삭제하지 않았습니다.");
                }
            } else {
                log.info("등록된 휴가가 없습니다.");
            }

        }
    }
}
