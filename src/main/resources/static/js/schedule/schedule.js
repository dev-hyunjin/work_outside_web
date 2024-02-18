// 일정 완료하기
$('.wo-list').on('click','.wo-submit',function (){
    let workNumber = $(this).closest('.list1').find('.workNumber').val();
    console.log(workNumber);
    let memberNumber = $('.memberNumber').val();
    let value2 = $(this).text();

    // ----------------------------------------------------------------------
    let workST2 = $(this).closest('.list1').find('.work_start_time3').val();

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
    console.log(dateStr2);
    let timestamp2 = dateStr2 + ' ' + hours + ':' + minute + ':00.000';

    console.log(timestamp2);
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
        if(new Date(workST2) >= new Date(timestamp2)){
            alert("종료 시간이 시작 시간보다 작거나 같습니다.");
            $('.modal-container-edit').css("display", "none");
            return false;
        }

        let timestamp = workST2 + ':00.000';

        let workStartTime = new Date(timestamp);
        let workEndTime2 = $('.endTime').val();

        let workEndTime = new Date(workEndTime2);

        let workSpentTime2 = workEndTime.getTime() - workStartTime.getTime();

        let minutes = workSpentTime2 / (1000*60);

        let workRealStartTime = $(this).closest('.list1').find('.work_real_start_time').val();
        console.log(workRealStartTime);
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

function patchAjax(workNumber, workST2){
    // 데이터 값을 가져오기
    $.ajax({
        url : '/schedules/data',
        type : 'get',
        data : {
            workNumber : workNumber
        },
        success : function (response) {
            console.log(workST2);

            //----------------------------------------------------------------------------

            let timestamp = workST2 + ':00.000';

            let now2 = new Date();
            let hours = now2.getHours();
            let minute = now2.getMinutes();

            if(hours < 10) {
                hours = '0' + hours;
            }
            if(minute < 10) {
                minute = '0' + minute;
            }

            let workStartTime = new Date(timestamp);
            let workEndTime2 = $('.endTime').val();

            let workEndTime = new Date(workEndTime2);

            let workSpentTime2 = workEndTime.getTime() - workStartTime.getTime();

            let minutes = workSpentTime2 / (1000*60);
            // ----------------------------------------------------------------------

            $.ajax({
                url : '/schedules/spentTime',
                type : 'patch',
                data : {
                    workNumber : workNumber,
                    workSpentTime : minutes
                },
                success : function (){
                    console.log("성공");
                },
                error : function () {
                    console.log("실패");
                }
            });
        },
        error : function (){
            console.log("데이터 가져오기 실패");
        }
    });
}

// 일정 추가
$('.modal-container-add').on('click', '.add-btn' ,function (){
    let workStartTime = $('.workStartTime').val();
    let workEndTime = $('.workEndTime').val();
    let workTitle = $('#workTitle').val();
    let workDetail = $('#workDetail').val();
    let memberNumber =$('.memberNumber').val();
    let workPlaceNumber = $('.workList1 option:selected').val();

    //----------------------------------------------------------------------------
    //let now = new Date();
    //let dateStr = now.getFullYear() + '-' + (now.getMonth() + 1) + '-' + now.getDate();
    //let timestamp = dateStr + ' ' + workStartTime + ':00.000';
    //----------------------------------------------------------------------------

    let workSpentTime = '진행중';

    // if($('.workIng').is(":checked")) {
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
                workPredictTime : workEndTime
            },
            success: function () {
                location.reload();
            },
            error: function () {
                console.log("실패");
            }
        });

    // }
    // else if(!$('.workIng').is(":checked")) {
    //     let endTime = '종료';
    //
    //     // ----------------------------------------------------------------------
    //     let now = new Date();
    //     let dateStr = now.getFullYear() + '-' + (now.getMonth() + 1) + '-' + now.getDate();
    //     let timestamp = dateStr + ' ' + workStartTime + ':00.000';
    //
    //     let now2 = new Date();
    //     let dateStr2 = now2.getFullYear() + '-' + (now2.getMonth() + 1) + '-' + now2.getDate();
    //     let timestamp2 = dateStr2 + ' ' + workEndTime + ':00.000';
    //
    //     let workStartTime2 = new Date(timestamp);
    //     let workEndTime2 = new Date(timestamp2);
    //
    //     let workSpentTime = workEndTime2.getTime() - workStartTime2.getTime();
    //     let minutes = workSpentTime / (1000 * 60);
    //     // ----------------------------------------------------------------------
    //
    //     if (workEndTime < workStartTime) {
    //         alert("종료 시간이 시작 시간보다 작습니다.");
    //         $(".modal-container-add").eq(0).css("display", "flex");
    //         return false;
    //     } else if (workPlaceNumber == ''){
    //         alert("근무지를 선택해주세요.");
    //         $(".modal-container-add").eq(0).css("display", "flex");
    //         return false;
    //     } else {
    //         $.ajax({
    //             url: '/schedules/sdAdd',
    //             type: 'post',
    //             data: {
    //                 workStartTime: timestamp,
    //                 workEndTime: timestamp2,
    //                 workDetail: workDetail,
    //                 workPlaceNumber: workPlaceNumber,
    //                 memberNumber: memberNumber,
    //                 workStatus: endTime,
    //                 workSpentTime: minutes
    //             },
    //             success: function () {
    //                 location.reload();
    //             },
    //             error: function () {
    //                 console.log("실패");
    //             }
    //         });
    //     }
    // }
});

// 일정 업데이트(데이터 넣어주기 및 수정)
$('.wo-list').on('click', '.list1', function (){
    // ----------------------------------------------------------------------
    // 해당 리스트의 시작 시간 데이터 넣어주기
    let workST2 = $(this).closest('.list1').find('.work_start_time2').val();
    $('#workStartTime2').val(workST2);

    // 해당 리스트의 끝나는 시간 데이터 넣어주기
    let workET = $(this).closest('.list1').find('.work_end_time2').val();
    $('.workEndTime2').val(workET);

    // 해당 리스트의 끝나는 시간 데이터 넣어주기
    let workPT = $(this).closest('.list1').find('.real_work_predict_time').val();
    $('#workPredictTime').val(workPT);

    // 해당 리스트의 근무지 번호 넣어주기(근무지 이름 포함)
    let workNum = $(this).closest('.list1').find('.workNum').val();
    $('#work1').val(workNum).prop('selected', true);

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
    console.log(submit);

    //----------------------------------------------------------------------------
    // 해당 리스트의 상태값에 따라 진행중 체크 표시
    if (workSS == 'on' || workSS == '진행중'){
        $('.workIng').prop('checked', true).change();
    }
    else if(workSS == '종료'){
        $('.workIng').prop('checked', false).change();
    }
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
        console.log(workST2);
        // 일정 수정 모달의 끝나는 시간 값
        let workET2 = $('#workEndTime2').val();

        // 일정 수정 모달의 근무 예상종료시간 값
        let workPredictTime = $('#workPredictTime').val();

        let workRealStartTime = $('#workRealStartTime').val();

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

        if(!workRealStartTime && submit != '업무시작') {
            alert("업무 시작 시간을 넣어주세요");
            return false;
        }

        // 일정 수정 모달의 시작 시간 값 DB 형식이랑 맞춰주기
        let now = new Date();
        let dateStr = now.getFullYear() + '-' + (now.getMonth() + 1) + '-' + now.getDate();
        let timestamp = /* dateStr + ' ' + */ workST2 + ':00.000';
        console.log(timestamp);

        // 일정 수정 모달의 끝나는 시간 값 DB 형식이랑 맞춰주기
        let now2 = new Date();
        let dateStr2 = now2.getFullYear() + '-' + (now2.getMonth() + 1) + '-' + now2.getDate();
        let timestamp2 = /*dateStr2 + ' ' + */ workET2 + ':00.000';

        workPredictTime = workPredictTime + ":00.000";

        let realStartTime = $('#workRealStartTime').val();
        let timestamp3 = realStartTime + ':00.000';
        console.log(realStartTime);

        // 해당 리스트의 진행 상황 값
        // let workStatus = $(this).closest('.list1').find('.work-status').val();
        // console.log(workStatus);
    // ----------------------------------------------------------------------
        if (timestamp2 <= timestamp) {
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


// 일정 삭제
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

$('.plus-btn').on('click', function (){
    const offset = new Date().getTimezoneOffset() * 60000;
    const today = new Date(Date.now() - offset);
    $('#workStartTime').val(today.toISOString().slice(0, -8));
});

$('.modal-btn').on('click', function (){
    $('.modal-container-add').css("display", "none");
});

// 진행중은 선택되어있게
$('.workIng').prop('checked', true);

// 진행중이 클릭되었을 때 체크 해제되면 끝나는 시간에 현재시간 넣고, 체크되면 시간 없애기
$('.workIng').on('click', function() {
    let now = new Date();

    let hours = ('0' + now.getHours()).slice(-2);
    let minutes = ('0' + now.getMinutes()).slice(-2);
    let currentTime = hours + ":" + minutes;

    let endTime = $('.endTime').val();

    if($(this).is(':checked')) {
        $(this).parents('.modal-container').find('input[name=workEndTime]').val('');
        $(this).parents('.modal-container').find('input[name=workRealStartTime]').val('');
    } else {
        $(this).parents('.modal-container').find('input[name=workEndTime]').val(endTime);
    }
});

// 끝나는 시간을 선택했을 때 진행중 체크 해제.
$('input[name=workEndTime]').on('change', function() {
    $(this).parents('.modal-container').find('.workIng').prop('checked', false);
});

if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
    $('.main2').css('display', 'none');
}

// 휴가 등록
$('.vacation-btn').on('click', function (){

    if($(this).is(":checked")){
        let val = 'V';
        let memberNumber = $('.memberNumber').val();

        $.ajax({
            url : '/schedules/vacation',
            type : 'patch',

            data : {
                memberNumber : memberNumber,
                memberUse : val
            },
            success : function (){
                console.log("변경 성공");
                $('.plus-btn').prop('disabled', true);
            },
            error : function (){
                console.log("변경 실패");
            }
        });
    }
    else {
        let val = 'Y';
        let memberNumber = $('.memberNumber').val();

        $.ajax({
            url : '/schedules/vacation',
            type : 'patch',
            data : {
                memberNumber : memberNumber,
                memberUse : val
            },
            success : function (){
                console.log("변경 성공");
                $('.plus-btn').prop('disabled', false);
            },
            error : function (){
                console.log("변경 실패");
            }
        });
    }
});

$(document).ready( function (){
    document.cookie = `expires=Fri, 31 Dec 9999 23:59:59 GMT;`;
    if($('.memberUse').val() == 'V') {
        $('.vacation-btn').prop('checked', true);
        $('.plus-btn').prop('disabled', true);
    }
    else if($('.memberUse').val() == 'Y') {
        $('.vacation-btn').prop('checked', false);
        $('.plus-btn').prop('disabled', false);
    }
});