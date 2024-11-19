package com.app.work.schedule.controller;

import com.app.work.domain.vo.ListVO;
import com.app.work.domain.vo.ScheduleVO;
import com.app.work.list.service.ListService;
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
}
