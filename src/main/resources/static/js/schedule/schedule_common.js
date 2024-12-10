const scheduleCommon = (function() {

    function scheduleList() {

        schedules.forEach(schedule => {
            let text = '';
            text += `
             <div class="list1"> 
             <input type="hidden" class="workNumber" value="${schedule.workNumber}"/> 
             <input type="hidden" class="work_start_time" value="${schedule.workStartTime}"> <!-- 일반 형식 업무 시작 시간 | 오전 09:00-->
             <input type="hidden" class="work_start_time2" value="${schedule.workStartTime2}"> <!-- DB 형식의 업무 시작 시간 | 2024-01-01 00:00 --> 
             <input type="hidden" class="work_end_time2" value="${schedule.workEndTime2 != null ? schedule.workEndTime2 : ''}"/> <!-- DB 형식의 업무 끝나는 시간 | 2024-01-01 00:00 -->
             <input type="hidden" class="work_real_start_time workBtn" value="${schedule.workRealStartTime != null ? schedule.workRealStartTime : ''}"/> <!-- 업무 시작 버튼 누른 시간 --> 
             <input type="hidden" class="work_real_start_time2" value="${schedule.workRealStartTime2}"/> <!-- 자동 업무 시작 시간 -->
             <input type="hidden" class="work_predict_time" value="${schedule.workPredictTime != null ? schedule.workPredictTime : ''}"> <!-- 업무 종료 예상 시간 -->  
             <input type="hidden" class="real_work_predict_time" value="${schedule.realWorkPredictTime != null ? schedule.realWorkPredictTime : ''}"> <!-- 실제 업무 끝난 시간 --> 
             <input type="hidden" class="work_detail" value="${schedule.workDetail}">`;
            if (`${schedule.workStatus}` == '이동중') {
                text += `<li class="point1">●</li>`;
            } else if (`${schedule.workStatus}` == '진행중') {
                text += `<li class="point1" style="color: #F06292;">●</li>`;
            } else if (`${schedule.workStatus}` == '종료'){
                text += `<li class="point2 point">●</li>`;
            }
            text += ` 
            <li class="username"><span>${schedule.memberName}</span><span>${schedule.memberRank + '님'}</span></li> `;
            if(`${schedule.workStatus}` == '이동중') {
                text += `<li class="usertime"> <span class="workST">${schedule.workStartTime}</span> ~ `;
            } else if(`${schedule.workStatus}` == '진행중' || `${schedule.workStatus}` == '종료'){
                text += `<li class="usertime"> <span class="workST">${schedule.workRealStartTime3}</span> ~ `;
            }

            if(`${schedule.workStatus}` == '이동중' || `${schedule.workStatus}` == '진행중') {
                text += `<span class="workET">${schedule.workPredictTime}</span>`; <!-- 업무 종료 예상 시간 -->
            }
            else {
                text += `<span class="workET">${schedule.workEndTime}</span>`;
            }
            text += `    
                    </li>
                    <li class="ow"><span>${schedule.workPlaceName}</span>
                        <input type="hidden" class="workNum" value="${schedule.workPlaceNumber}"/>
                    </li>
                    <li class="work"><span class="workDT">${schedule.workTitle}</span></li>
                    <input type="hidden" value="${schedule.workStatus}" class="work-status"/>
                    <li class="btn">
                `;
            if (`${schedule.workStatus}` == '이동중') {
                text += `<button class="wo-submit workBtn" type="button">업무시작</button>`;
            } else if (`${schedule.workStatus}` == '진행중') {
                text += `<button class="wo-submit" type="button">완료</button>`;
            }
            text += `</div>`;
            $('.work-list').append(text);
        });
    }

    function scheduleList2() {
        let previous = []; // 이전 날짜 리스트
        let todays = [];   // 당일 날짜 리스트
        let upcoming = []; // 이후 날짜 리스트

        // 오늘 날짜 가져오기
        let today = new Date($(".endTime").val());
        today.setHours(0, 0, 0, 0); // 시간 부분을 0으로 설정

        schedules.forEach(schedule => {
            const workStartTime2 = new Date(schedule.workStartTime2); // DB 형식의 업무 시작 시간
            workStartTime2.setHours(0, 0, 0, 0); // 시간 부분을 0으로 설정하여 날짜 비교

            // 일정 분류
            if (workStartTime2 < today) {
                previous.push(schedule); // 이전 날짜 리스트에 추가
            } else if (workStartTime2.toDateString() === today.toDateString()) {
                todays.push(schedule); // 오늘 일정
            } else {
                upcoming.push(schedule); // 이후 일정
            }
        });

        if (previous.length == 0){
            $(".previous").css('display', 'none'); // 이전 일정 타이틀 숨기기
        }
        // 이전 날짜 리스트 렌더링
        else if (previous.length > 0) {
            previous.forEach(schedule => {
                let text = createScheduleHTML(schedule);
                $('.work-list.previous .toggle-content').append(text); // 이전 일정 리스트에 추가
            });
        }

        if (todays.length === 0 ) {
            $(".todays").css('display', 'none'); // 이전 일정 타이틀 숨기기
        }
        // 오늘 일정 렌더링
        else if (todays.length > 0) {
            todays.forEach(schedule => {
                let text = createScheduleHTML(schedule);
                $('.work-list.todays').append(text); // 당일 일정 리스트에 추가
            });
        }

        if(upcoming.length === 0 ) {
            $(".upcoming").find('.toggle-title').css('display', 'none'); // 이후 일정 타이틀 숨기기
        }
        // 이후 날짜 리스트 렌더링
        else if (upcoming.length > 0) {
            upcoming.forEach(schedule => {
                let text = createScheduleHTML(schedule);
                $('.work-list.upcoming .toggle-content').append(text); // 이후 일정 리스트에 추가
            });
        }

        // 접기/펼치기 기능 추가
        $('.toggle-title').click(function() {
            let $content = $(this).next('.toggle-content'); // 다음 요소
            $content.slideToggle(); // 해당 리스트 토글
            $(this).toggleClass('expanded'); // expanded 클래스 추가/제거
        });
    }

    function createScheduleHTML(schedule) {
        let text = '';
        text += `
        <div class="list1" style="margin-top: 10px;"> 
            <input type="hidden" class="workNumber" value="${schedule.workNumber}"/> 
            <input type="hidden" class="work_start_time" value="${schedule.workStartTime}"> 
            <input type="hidden" class="work_start_time2" value="${schedule.workStartTime2}"> 
            <input type="hidden" class="work_end_time2" value="${schedule.workEndTime2 != null ? schedule.workEndTime2 : ''}"/> 
            <input type="hidden" class="work_real_start_time workBtn" value="${schedule.workRealStartTime != null ? schedule.workRealStartTime : ''}"/> 
            <input type="hidden" class="work_real_start_time2" value="${schedule.workRealStartTime2}"/> 
            <input type="hidden" class="work_predict_time" value="${schedule.workPredictTime != null ? schedule.workPredictTime : ''}">  
            <input type="hidden" class="real_work_predict_time" value="${schedule.realWorkPredictTime != null ? schedule.realWorkPredictTime : ''}"> 
            <input type="hidden" class="work_detail" value="${schedule.workDetail}">`;

        // 업무 상태에 따른 아이콘 추가
        if (`${schedule.workStatus}` === '이동중') {
            text += `<li class="point1">●</li>`;
        } else if (`${schedule.workStatus}` === '진행중') {
            text += `<li class="point1" style="color: #F06292;">●</li>`;
        } else if (`${schedule.workStatus}` === '종료') {
            text += `<li class="point2 point">●</li>`;
        }

        text += ` 
        <li class="username"><span>${schedule.memberName}</span><span>${schedule.memberRank + '님'}</span></li>`;

        if (`${schedule.workStatus}` === '이동중') {
            text += `<li class="usertime"> <span class="workST">${schedule.workStartTime}</span> ~ `;
        } else {
            text += `<li class="usertime"> <span class="workST">${schedule.workRealStartTime3}</span> ~ `;
        }

        if (`${schedule.workStatus}` === '이동중' || `${schedule.workStatus}` === '진행중') {
            text += `<span class="workET">${schedule.workPredictTime}</span>`;
        } else {
            text += `<span class="workET">${schedule.workEndTime}</span>`;
        }

        text += `    
            </li>
            <li class="ow"><span>${schedule.workPlaceName}</span>
                <input type="hidden" class="workNum" value="${schedule.workPlaceNumber}"/>
            </li>
            <li class="work"><span class="workDT">${schedule.workTitle}</span></li>
            <input type="hidden" value="${schedule.workStatus}" class="work-status"/>
            <li class="btn">`;

        if (`${schedule.workStatus}` === '이동중') {
            text += `<button class="wo-submit workBtn" type="button">업무시작</button>`;
        } else if (`${schedule.workStatus}` === '진행중') {
            text += `<button class="wo-submit" type="button">완료</button>`;
        }

        text += `</div>`;
        return text;
    }


    //일정 완료하기
    function scheduleSubmit(){
        $('.wo-list').on('click','.wo-submit',function (){
            let workNumber = $(this).closest('.list1').find('.workNumber').val();
            let memberNumber = $('.memberNumber').val();
            let value2 = $(this).text();

            // ----------------------------------------------------------------------
            let workST2 = $(this).closest('.list1').find('.work_start_time2').val();
            let workRealST2 = $(this).closest('.list1').find('.work_start_time').val();
            let workRealST3 = $(this).closest('.list1').find('.work_start_time2').val();

            let now = new Date();
            let hours = now.getHours();
            let minute = now.getMinutes();

            if(hours < 10) {
                hours = '0' + hours;
            }
            if(minute < 10) {
                minute = '0' + minute;
            }

            let dateStr2 = now.getFullYear() + '-' + (now.getMonth() + 1) + '-' + now.getDate();
            //console.log(dateStr2);
            let timestamp2 = dateStr2 + ' ' + hours + ':' + minute + ':00.000';

            //console.log(timestamp2);
            // ----------------------------------------------------------------------

            if(value2 == '업무시작'){
                $.ajax({
                    url: '/schedules/status',
                    type: 'post',
                    data: {
                        workNumber: workNumber,
                        memberNumber: memberNumber,
                        workStatus: value2,
                        workRealStartTime : timestamp2
                    },
                    success: function () {
                        location.reload();
                    },
                    error: function () {
                        console.log("실패");
                    }
                });
            } else if(value2 == '완료') {
                if(new Date(workRealST2) >= new Date(timestamp2)){
                    alert("종료 시간이 시작 시간보다 작거나 같습니다.");
                    $('.modal-container-edit').css("display", "none");
                    return false;
                }

                let timestamp = workST2 + ':00.000';
                let ts = workRealST3 + ':00.000';

                let workStartTime = new Date(timestamp);
                let workRST = new Date(ts);
                let workEndTime2 = $('.endTime').val();

                let workRTime = new Date(ts);
                let workEndTime = new Date(workEndTime2);

                let workSpentTime2 = workEndTime.getTime() - workRST.getTime();
                let minutes = workSpentTime2 / (1000*60);

                let workRealStartTime = $(this).closest('.list1').find('.work_real_start_time').val();
                let timestamp3 = workRealStartTime + '.000';

                $.ajax({
                    url: '/schedules/status',
                    type: 'post',
                    data: {
                        workNumber: workNumber,
                        memberNumber: memberNumber,
                        workStatus: value2,
                        workSpentTime : minutes,
                        workRealStartTime : timestamp3
                    },
                    success: function () {
                        $('.modal-container-edit').css("display", "none");
                        location.reload();
                    },
                    error: function () {
                        console.log("실패");
                    }
                });
            }
        });
    }

    function scheduleCreate(){
        // 일정 추가
        $('.modal-container-add').on('click', '.add-btn' ,function (){
            let workStartTime = $('.workStartTime').val();
            let workEndTime = $('.workEndTime').val();
            let workTitle = $('#workTitle').val();
            let workDetail = $('#workDetail').val();
            let memberNumber =$('.memberNumber').val();
            let workPlaceNumber = $('.select-selected').attr('data-value');
            let workRealStartTime =  $('.workAutoCheck').val();
            //----------------------------------------------------------------------------
            // 등록시 조건 확인
            if(!workEndTime) {
                alert("근무 예상 종료시간을 입력해주세요.");
                $(".modal-container-add").eq(0).css("display", "flex");
                $(".modal-container-add").eq(0).find('.workEndTime').focus();
                return false;
            }

            if (new Date(workEndTime) <= new Date(workStartTime)) {
                alert("종료 시간이 시작 시간보다 작거나 같습니다.");
                $(".modal-container-add").eq(0).css("display", "flex");
                return false;
            }

            if (!workPlaceNumber) {
                alert("근무지를 선택해주세요.");
                $(".modal-container-add").eq(0).css("display", "flex");
                return false;
            }

            if(!workTitle) {
                alert("근무 제목을 입력해주세요.");
                $(".modal-container-add").eq(0).css("display", "flex");
                $(".modal-container-add").eq(0).find('#workTitle').focus();
                return false;
            }

            if(!workDetail) {
                alert("근무 내용을 입력해주세요.");
                $(".modal-container-add").eq(0).css("display", "flex");
                $(".modal-container-add").eq(0).find('.workDetail').focus();
                return false;
            }
            //----------------------------------------------------------------------------
            //휴가 등록 되어 있고 새로운 일정 등록하기 전 시간 비교
            let vacationCnt = $("#vacationCnt").val();
            let vacationStDate = $("#vacationStDate").text();
            let vacationCheck = $("#vacationCheck").val();

            if (vacationCnt == 1) {
                if(vacationCheck === "H") {
                    if (new Date(workStartTime).getTime() === new Date(vacationStDate).getTime()) {
                        alert("등록할 일정 시작 날짜 및 시간과 등록된 휴가 시작 날짜 및 시간이 동일합니다.");
                        $(".modal-container-add").eq(0).css("display", "flex");
                        return false;
                    }
                } else if(vacationCheck === "O") {
                    if (new Date(workStartTime).getDate() === new Date(vacationStDate).getDate()) {
                        alert("등록할 일정 시작 날짜와 등록된 휴가 시작 날짜가 동일합니다.");
                        $(".modal-container-add").eq(0).css("display", "flex");
                        return false;
                    }
                }
            }

            //----------------------------------------------------------------------------
            let workSpentTime = '진행중';
            let value = '이동중';

            $.ajax({
                url: '/schedules/sdAdd',
                type: 'post',
                data: {
                    workStartTime: workStartTime,
                    workDetail: workDetail,
                    workPlaceNumber: workPlaceNumber,
                    memberNumber: memberNumber,
                    workStatus: value,
                    workSpentTime: workSpentTime,
                    workTitle : workTitle,
                    workPredictTime : workEndTime,
                    workRealStartTime : workRealStartTime
                },
                success: function () {
                    location.reload();
                },
                error: function () {
                    console.log("실패");
                }
            });

        });
     }


    // 일정 업데이트(데이터 넣어주기 및 수정)
    function scheduleUpdate() {
        $('.wo-list').on('click', '.list1', function (){
            // ----------------------------------------------------------------------
            // 해당 리스트의 시작 시간 데이터 넣어주기
            let workST2 = $(this).closest('.list1').find('.work_start_time2').val();
            $('#workStartTime2').val(workST2);
            // 해당 리스트의 끝나는 시간 데이터 넣어주기
            let workET = $(this).closest('.list1').find('.work_end_time2').val();
            $('#workEndTime2').val(workET);
            // 해당 리스트의 끝나는 시간 데이터 넣어주기
            let workPT = $(this).closest('.list1').find('.real_work_predict_time').val();
            $('#workPredictTime').val(workPT);
            // 해당 리스트의 근무지 번호 넣어주기(근무지 이름 포함)
            let workNum = $(this).closest('.list1').find('.workNum').val();
            let workName = $(this).closest('.list1').find('.ow').text();
            $('#work1').val(workNum);
            $('#work1').text(workName);
            // 해당 리스트의 근무 제목 넣어주기
            let workText = $(this).closest('.list1').find('.workDT').text();
            $('.work-title').text(workText);
            // 해당 리스트의 근무 내용 넣어주기
            workText = $(this).closest('.list1').find('.work_detail').val();
            $('.workDT2').text(workText);
            // 해당 리스트의 일정 번호 가져오기
            let workNumber = $(this).closest('.list1').find('.workNumber').val();
            // 해당 리스트의 상태값 가져오기
            let workSS = $(this).closest('.list1').find('.work-status').val();
            // 해당 리스트의 업무 시작 시간 가져오기
            let workRealStartTime = $(this).closest('.list1').find('.work_real_start_time').val();
            $('#workRealStartTime').val(workRealStartTime);

            let submit = $(this).closest('.list1').find('.wo-submit').text();

            console.log(workST2);

            //----------------------------------------------------------------------------
            // 해당 리스트의 상태값에 따라 진행중 체크 표시
            if (workSS == '이동중' || workSS == '진행중'){
                $('.workIng').prop('checked', true).change();
            }
            else if(workSS == '종료'){
                $('.workIng').prop('checked', false).change();
            }

            // 진행중은 선택되어있게
            //$('.workIng').prop('checked', true);

            $(function() {
                $(".datetimepicker").datetimepicker({
                    format: "Y-m-d H:i",
                    step: 10
                });
            });

            //----------------------------------------------------------------------------
            // 진행중이 클릭되었을 때 체크 해제되면 끝나는 시간에 현재시간 넣고, 체크되면 시간 없애기
            $('.workIng').on('click', function() {
                let now = new Date();

                let hours = ('0' + now.getHours()).slice(-2);
                let minutes = ('0' + now.getMinutes()).slice(-2);
                let currentTime = hours + ":" + minutes;

                let endTime = $('.endTime').val();

                if($(this).is(':checked')) {
                    $(this).parents('.modal-container').find('[name=workStartTime2]').val(workST2);
                    $(this).parents('.modal-container').find('input[name=workEndTime]').val('');
                    $(this).parents('.modal-container').find('input[name=workRealStartTime]').val(workRealStartTime);
                } else {
                    $(this).parents('.modal-container').find('input[name=workRealStartTime]').val(workRealStartTime);
                    $(this).parents('.modal-container').find('input[name=workEndTime]').val(endTime);
                }
            });

            // 끝나는 시간을 선택했을 때 진행중 체크 해제.
            $('input[name=workEndTime]').on('change', function() {
                $(this).parents('.modal-container').find('.workIng').prop('checked', false);
            });
            //----------------------------------------------------------------------------
            // 버튼을 눌렀을 때
            $('.edit-btn').on('click', function (){
                // 일정 수정 모달의 근무지 select 박스 값 가져오기
                let workPlaceNumber = $('#work1').val();
                // 일정 수정 모달의 근무 제목 값
                let workTitle = $('.work-title').val();
                // 일정 수정 모달의 근무 내용 값
                let workDT2 = $('.workDT2').val();
                // 일정 수정 모달의 시작 시간 값
                let workST2 = $('#workStartTime2').val();
                // 일정 수정 모달의 끝나는 시간 값
                let workET2 = $('#workEndTime2').val();
                // 일정 수정 모달의 근무 예상종료시간 값
                let workPredictTime = $('#workPredictTime').val();
                // 모든 시간 계산은 workRealStartTime으로 함.
                let workRealStartTime = $('.workRealStartTime').val();

                if(!workPredictTime) {
                    alert("근무 예상종료시간을 입력해주세요.");
                    $(".modal-container-edit").eq(1).css("display", "flex");
                    $(".modal-container-edit").eq(1).find('.workEndTime').focus();
                    return false;
                }

                if(!workPlaceNumber) {
                    alert("근무지를 입력해주세요.");
                    $(".modal-container-edit").eq(1).css("display", "flex");
                    return false;
                }

                if(!workTitle) {
                    alert("근무 제목을 입력해주세요.");
                    $(".modal-container-edit").eq(1).css("display", "flex");
                    $(".modal-container-edit").eq(1).find('.work-title').focus();
                    return false;
                }

                if(!workDT2) {
                    alert("근무 내용을 입력해주세요.");
                    $(".modal-container-edit").eq(1).css("display", "flex");
                    $(".modal-container-edit").eq(1).find('.workDT2').focus();
                    return false;
                }

                /*if(!workRealStartTime && submit != '업무시작') {
                    alert("업무 시작 시간을 넣어주세요");
                    return false;
                }*/

                // 일정 수정 모달의 시작 시간 값 DB 형식이랑 맞춰주기
                let timestamp = workRealStartTime + ':00.000';

                // 일정 수정 모달의 끝나는 시간 값 DB 형식이랑 맞춰주기
                let timestamp2 = workET2 + ':00.000';

                workPredictTime = workPredictTime + ":00.000";

                // ----------------------------------------------------------------------
                if (timestamp2 < timestamp) {
                    console.log(timestamp);
                    console.log(timestamp2);
                    alert("종료 시간이 시작 시간보다 작거나 같습니다.");
                    return false;
                } else if (workPlaceNumber == ''){
                    alert("근무지를 선택해주세요.");
                    return false;
                }
                //----------------------------------------------------------------------------

                if($('.workIng').is(":checked") && submit == '업무시작'){
                    let value = '이동중';
                    let workET = null;
                    let spentTime = '진행중';

                    $.ajax({
                        url : '/schedules/update2',
                        type : 'patch',
                        data : {
                            workStartTime : timestamp,
                            workEndTime : workET,
                            workPlaceNumber : workPlaceNumber,
                            workDetail : workDT2,
                            workNumber : workNumber,
                            workStatus : value,
                            workSpentTime : spentTime,
                            workPredictTime: workPredictTime,
                            workTitle : workTitle
                        },
                        success : function (){
                            console.log("성공");
                            location.reload();
                        },
                        error : function (){
                            console.log("실패");
                        }
                    });
                }
                else if($('.workIng').is(":checked")) {
                    let value = '진행중';
                    let workET = null;
                    let spentTime = '진행중';

                    $.ajax({
                        url : '/schedules/update2',
                        type : 'patch',
                        data : {
                            workStartTime : timestamp,
                            workEndTime : workET,
                            workPlaceNumber : workPlaceNumber,
                            workDetail : workDT2,
                            workNumber : workNumber,
                            workStatus : value,
                            workSpentTime : spentTime,
                            workPredictTime: workPredictTime,
                            workTitle : workTitle,
                            workRealStartTime : workRealStartTime
                        },
                        success : function (){
                            console.log("성공");
                            location.reload();
                        },
                        error : function (){
                            console.log("실패");
                        }
                    });
                }
                else if(!$('.workIng').is(":checked")) {
                    let workStatusEnd = '종료';
                    let workStartTime = new Date(timestamp);
                    let workEndTime = new Date(timestamp2);
                    let workSpentTime = workEndTime.getTime() - workStartTime.getTime();
                    let minutes = workSpentTime / (1000 * 60);

                    console.log(minutes);

                    $.ajax({
                        url : '/schedules/update',
                        type : 'patch',
                        data : {
                            workStartTime : timestamp,
                            workEndTime : timestamp2,
                            workPlaceNumber : workPlaceNumber,
                            workDetail : workDT2,
                            workNumber : workNumber,
                            workStatus : workStatusEnd,
                            workSpentTime : minutes,
                            workPredictTime: workPredictTime,
                            workTitle : workTitle,
                            workRealStartTime : workRealStartTime
                        },
                        success : function (){
                            console.log("성공?");
                            location.reload();
                        },
                        error : function (){
                            console.log("실패");
                        }
                    });
                }
            });
            $('.del-btn').on('click', function (){
                $(".modal-container").eq(2).css("display", "flex");
                $('.del-number').val(workNumber);
            });

        });
    }

    // 일정 삭제
    function scheduleDelete(){
        $('.modal-container-del').on('click', '.del-btn2', function (){
            let workNumber = $('.del-number').val();

            $.ajax({
                url : '/schedules/delete',
                type : 'delete',
                data : {
                    workNumber : workNumber
                },
                success : function (){
                    location.reload();
                },
                error : function (){
                    console.log("실패");
                }
            });

        });
    }

    function vacationCheck() {
        $(".only_vacation").hide();
        $(".half_vacation").hide();

        $('#only_vacation').on("click", function () {
            $(".only_vacation").show();
            $(".half_vacation").hide();
            $("#vacation_st_date2").val("");
            $("#vacation_end_date2").val("");
            $('#half_vacation').prop('checked', false);
        });
        $("#half_vacation").on("click", function() {
            $(".only_vacation").hide();
            $(".half_vacation").show();
            $("#vacation_st_date").val("");
            $("#vacation_end_date").val("");
            $('#only_vacation').prop('checked', false);

            $(function() {
                $(".datetimepicker").datetimepicker({
                    format: "Y-m-d H:i",
                    step: 100, // 반차시 1시간 단위로 표시
                    onClose: function(selectedDate) {
                        // 선택된 날짜를 "YYYY-MM-DD HH:mm" 형식으로 변환
                        workAutoValue = moment(selectedDate).format("YYYY-MM-DD HH:mm");
                        $('.workAutoCheck').val(workAutoValue); // input 필드에 값 설정
                    }
                });
            });
        });
    }

    function vacation() {
        // 휴가 등록
        $('.modal-container-v').on('click', '.v-add-btn' ,function (){
            let memberNumber =$('.memberNumber').val();

            if(!$('#only_vacation').is(":checked") && !$('#half_vacation').is(":checked")) {
                alert("하루 휴가 또는 반차를 선택해주세요");
                $(".modal-container-v").eq(0).css("display", "flex");
                return false;
            }

            if($('#only_vacation').is(":checked")) {
                let vacationStDate = $('#vacation_st_date').val();
                let vacationEndDate = $('#vacation_end_date').val();

                // 연차일 경우 1시간 배치를 생각하여 종료 날짜 시간은 23시로 설정한다.
                let timestamp = vacationStDate + ' 00:00:00.000';
                let timestamp2 = vacationEndDate + ' 23:00:00.000';

                if (new Date(vacationEndDate) < new Date(vacationStDate)) {
                    alert("종료 날짜가 시작 날짜보다 작습니다.");
                    $(".modal-container-v").eq(0).css("display", "flex");
                    return false;
                }

                if (!vacationStDate) {
                    alert("날짜를 선택해주세요");
                    $(".modal-container-v").eq(0).css("display", "flex");
                    return false;
                }

                $.ajax({
                    url: '/schedules/vacationAdd',
                    type: 'post',
                    data: {
                        vacationStDate: timestamp,
                        vacationEndDate : timestamp2,
                        memberNumber: memberNumber,
                        vacationCheck : "O" // 연차(하루종일)
                    },
                    success: function () {
                        location.reload();
                    },
                    error: function () {
                        console.log("실패");
                    }
                });
            }

            if($('#half_vacation').is(":checked")) {
                let vacationStDate = $('#vacation_st_date2').val();
                let vacationEndDate = $('#vacation_end_date2').val();

                let timestamp = vacationStDate + ':00.000';
                let timestamp2 = vacationEndDate + ':00.000';

                if (new Date(vacationEndDate) < new Date(vacationStDate)) {
                    alert("종료 날짜가 시작 날짜보다 작습니다.");
                    $(".modal-container-v").eq(0).css("display", "flex");
                    return false;
                }

                if (!vacationStDate || !vacationEndDate) {
                    alert("날짜를 선택해주세요");
                    $(".modal-container-v").eq(0).css("display", "flex");
                    return false;
                }

                $.ajax({
                    url: '/schedules/vacationAdd',
                    type: 'post',
                    data: {
                        vacationStDate: timestamp,
                        vacationEndDate : timestamp2,
                        memberNumber: memberNumber,
                        vacationCheck : "H" //반차
                    },
                    success: function () {
                        location.reload();
                    },
                    error: function () {
                        console.log("실패");
                    }
                });

            }
        });
        vacationEdit();
    }

    // 휴가 수정
    function vacationEdit() {
        let vacationStDate = $("#vacationStDate").text();
        let vacationEndDate = $("#vacationEndDate").text();
        let vacationCheck = $("#vacationCheck").val();

        if(vacationCheck == 'O') {
            $(".only_vacation2").show();
            $(".half_vacation2").hide();
            $("#only_vacation2").prop('checked', true);
            $("#vacation_st_date3").val(vacationStDate);
            $("#vacation_end_date3").val(vacationEndDate);
        } else {
            $(".only_vacation2").hide();
            $(".half_vacation2").show();
            $("#half_vacation2").prop('checked', true);
            $("#vacation_st_date4").val(vacationStDate);
            $("#vacation_end_date4").val(vacationEndDate);

            $(".datetimepicker").datetimepicker({
                format: "Y-m-d H:i",
                step: 100, //1시간 단위
                onClose: function(selectedDate) {
                    // 선택된 날짜를 "YYYY-MM-DD HH:mm" 형식으로 변환
                    workAutoValue = moment(selectedDate).format("YYYY-MM-DD HH:mm");
                    $('.workAutoCheck').val(workAutoValue); // input 필드에 값 설정
                }
            });
        }

        $('#only_vacation2').on("click", function () {
            $(".only_vacation2").show();
            $(".half_vacation2").hide();
            $('#half_vacation2').prop('checked', false);
        });
        $("#half_vacation2").on("click", function() {
            $(".only_vacation2").hide();
            $(".half_vacation2").show();
            $('#only_vacation2').prop('checked', false);

            $(".datetimepicker").datetimepicker({
                format: "Y-m-d H:i",
                step: 100, //1시간 단위
                onClose: function(selectedDate) {
                    // 선택된 날짜를 "YYYY-MM-DD HH:mm" 형식으로 변환
                    workAutoValue = moment(selectedDate).format("YYYY-MM-DD HH:mm");
                    $('.workAutoCheck').val(workAutoValue); // input 필드에 값 설정
                }
            });

        });
        let memberNumber =$('.memberNumber').val();

        $('.modal-container-v-edit').on('click', '.v-edit-btn' ,function () {
            if($("#only_vacation2").is(":checked")) {
                let vacationUpdateStDate = $("#vacation_st_date3").val();
                let vacationUpdateEndDate = $("#vacation_end_date3").val();
                let timestamp = vacationUpdateStDate + ' 00:00:00.000';
                let timestamp2 = vacationUpdateEndDate + ' 23:00:00.000';

                if (new Date(vacationUpdateEndDate) < new Date(vacationUpdateStDate)) {
                    alert("종료 날짜가 시작 날짜보다 작습니다.");
                    $(".modal-container-v-edit").eq(0).css("display", "flex");
                    return false;
                }

                $.ajax({
                    url: '/schedules/vacationEdit',
                    type: 'post',
                    data: {
                        vacationStDate: timestamp,
                        vacationEndDate: timestamp2,
                        memberNumber: memberNumber,
                        vacationCheck: "O" //연차(하루종일)
                    },
                    success: function () {
                        location.reload();
                    },
                    error: function () {
                        console.log("실패");
                    }
                });
            } else if ($("#half_vacation2").is(":checked")) {
                let vacationUpdateStDate = $("#vacation_st_date4").val();
                let vacationUpdateEndDate = $("#vacation_end_date4").val();
                let timestamp = vacationUpdateStDate + ':00.000';
                let timestamp2 = vacationUpdateEndDate + ':00.000';

                if (new Date(vacationUpdateEndDate) < new Date(vacationUpdateStDate)) {
                    alert("종료 날짜가 시작 날짜보다 작습니다.");
                    $(".modal-container-v-edit").eq(0).css("display", "flex");
                    return false;
                }

                $.ajax({
                    url: '/schedules/vacationEdit',
                    type: 'post',
                    data: {
                        vacationStDate: timestamp,
                        vacationEndDate: timestamp2,
                        memberNumber: memberNumber,
                        vacationCheck: "H" //반차
                    },
                    success: function () {
                        location.reload();
                    },
                    error: function () {
                        console.log("실패");
                    }
                });
            }
        });

        $('.v-del-btn').on('click', function (){
            $(".modal-container-v-del").eq(0).css("display", "flex");
        });
    }

    // 휴가 삭제
    function vacationDelete(){
        $('.modal-container-v-del').on('click', '.del-v-btn2', function (){
            let memberNumber =$('.memberNumber').val();

            $.ajax({
                url : '/schedules/vacationDelete',
                type : 'delete',
                data : {
                    memberNumber : memberNumber
                },
                success : function (){
                    $.ajax({
                        url: '/schedules/vacation',
                        type: 'patch',
                        data: {
                            memberNumber: memberNumber,
                            memberUse : "Y"
                        },
                        success: function () {
                        },
                        error: function () {
                            console.log("실패");
                        }
                    });
                    location.reload();
                },
                error : function (){
                    console.log("실패");
                }
            });

        });
    }

    // 자동 업무 시작 버튼
    function AutoCheck() {
        var workAutoValue = '';
        $('#workAuto').on('click', function() {
            // 체크박스가 클릭될 때마다 모달 내용 초기화
            let text = `
            <div class="modal-content-time-auto">
                <input type="text" class="workTime workAutoCheck datetimepicker" value="${workAutoValue}" name="workAutoCheck" readonly style="background-color: white;">
                <button type="button" class="backBtn modal-btn">돌아가기</button>
            </div>
            `;

            // datetimepicker 초기화
            $(function() {
                $(".datetimepicker").datetimepicker({
                    format: "Y-m-d H:i",
                    step: 10, // 10분 단위로 설정
                    onClose: function(selectedDate) {
                        // 선택된 날짜를 "YYYY-MM-DD HH:mm" 형식으로 변환
                        workAutoValue = moment(selectedDate).format("YYYY-MM-DD HH:mm");
                        $('.workAutoCheck').val(workAutoValue); // input 필드에 값 설정
                    }
                });
            });

            $('.checkboxoption').hide();
            $('.modal-content-workautocheck-select').append(text);
        });

        // 돌아가기 버튼 클릭 시
        $(document).on('click', '.backBtn', function() {
            $('.workAutoCheck').val("");
            $('.checkboxoption').show();
            $('#workAuto').prop('checked', false);
            $('.modal-content-time-auto').hide();
        });
    }

    // 이외 옵션들
    function option() {
        $('.plus-btn').on('click', function (){
            const offset = new Date().getTimezoneOffset() * 60000;
            const today = new Date(Date.now() - offset);
            $('#workStartTime').val(today.toISOString().slice(0, -8));

            $(function() {
                $(".datetimepicker").datetimepicker({
                    format: "Y-m-d H:i",
                    step: 10
                });
            });
        });

        $('.modal-btn').on('click', function (){
            $('.modal-container-add').css("display", "none");
        });

        $('.wo-list').on('click', '.list1' ,function (){
            $(".modal-container").eq(1).css("display", "flex");
        });

        if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
            $('.main2').css('display', 'none');
        }

        // 근무지 검색 후 선택
        $('.workplaceNum').off('click').on('click', function (event) {
            event.stopPropagation();
            let workValue = $(this).attr('value');
            let workName = $(this).find('span').text();
            let workplaceNumber = $(this).attr('data-id'); // workplaceNumber 속성 가져오기

            // 선택한 요소의 텍스트로 대체
            $(this).closest('.workList1').find('.select-selected').text(workName);

            // 선택한 값으로 설정 (옵션의 value 속성 활용)
            if (workValue) {
                $(this).closest('.workList1').find('.select-selected').attr('data-value', workValue);
            } else {
                console.error('workValue가 유효하지 않습니다.');
            }

            // 선택한 workplaceNumber 값으로 설정
            $(this).closest('.workList1').find('.select-selected').attr('data-workplace-number', workplaceNumber);

            // 선택한 요소를 숨김
            $(this).closest('.select-items').hide();
        });

        $(document).on('click', function(event) {
            // 클릭한 요소가 .select-selected 또는 .select-items가 아닐 경우
            if (!$(event.target).closest('.select-selected').length && !$(event.target).closest('.select-items').length) {
                $('.select-items').hide(); // 선택 옵션 숨김
            }
        });
    }

    // 근무지 검색
    function search() {
        $('.select-selected').on('click', function() {
            $('.select-items').show();
        });

        $('.search-input').on('input', function (){
            let text = $(this).val().toUpperCase(); // 검색어를 가져옵니다.
            let items = $('.select-items').find('.workplaceNum'); // 모든 선택 옵션을 가져옵니다.

            // 각 요소의 텍스트와 검색어 비교하여 보이기/숨기기 처리
            for (let i = 0; i < items.length; i++) {
                let optionText = $(items[i]).find('span').text().toUpperCase();
                if (optionText.indexOf(text) > -1) {
                    $(items[i]).show();
                } else {
                    $(items[i]).hide();
                }
            }
        });
    }


    return { scheduleList : scheduleList2, scheduleSubmit : scheduleSubmit , scheduleCreate : scheduleCreate , scheduleUpdate : scheduleUpdate , scheduleDelete : scheduleDelete ,  vacation : vacation , AutoCheck : AutoCheck, option : option, search : search, vacationCheck : vacationCheck, vacationDelete : vacationDelete };
})();