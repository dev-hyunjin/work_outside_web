$('.list-main-box').on('click', '.st-list-sub', function (){
     if($(this).find('.time_taken').text() == '진행중') {
          alert('진행중인 일정입니다.');
          return;
     }

     let workNumber = $(this).find('.work-number').val();

     $.ajax({
          url: "/schedules/data",
          type: "get",
          data: { workNumber : workNumber },
          success: function(result) {
               if(result) {
                    $('.work-number').val(result.workNumber);
                    $('#workStartTime').val(result.workStartTime);
                    $('#workEndTime').val(result.workEndTime);
                    $('#work1').val(result.workPlaceNumber);
                    $('.work-title').val(result.workTitle);
                    $('.workDT2').val(result.workDetail);
               }
          }
     });

     $(".modal-container-edit").css("display", "flex");
});

$('.modal-close').on('click', function (){
     $('.modal-container-edit').css("display", "none");
});

$('.edit-btn').on('click', function() {
     let workNumber = $('.work-number').val();
     let workStartTime = $('#workStartTime').val();
     let workEndTime = $('#workEndTime').val();
     let workplaceNumber = $('#work1').val();
     let workTitle = $('.work-title').val();
     let workDetail = $('.workDT2').val();
     let workSpentTime = new Date(workEndTime).getTime() - new Date(workStartTime).getTime();
     workSpentTime =  workSpentTime / (1000 * 60);

     if(workSpentTime <= 0) {
          alert("종료시간이 시작시간보다 작거나 같습니다.")
          return;
     }

     if(!$('.work-title').val()) {
          alert("근무 제목을 입력해주세요.");
          $(".modal-container-edit").eq(0).find('.work-title').focus();
          return false;
     }

     if(!$('.workDT2').val()) {
          alert("근무 내용을 입력해주세요.");
          $(".modal-container-edit").eq(0).find('.workDT2').focus();
          return false;
     }

     $.ajax({
          url: "/schedules/update",
          type: "patch",
          data: { workNumber : workNumber, workStartTime : workStartTime, workEndTime : workEndTime, workPlaceNumber : workplaceNumber,
               workTitle : workTitle, workDetail : workDetail, workSpentTime : workSpentTime },
          success: function() {
               location.reload();
          }
     });
});

$('.del-btn').on('click', () => {
     $('.del-number').val($('.work-number').val());
     $('.modal-container-del').css('display', 'flex');
});

$('.del-btn2').on('click', function() {
     let workNumber = $('.del-number').val();

     $.ajax({
          url: "/schedules/delete",
          type: "delete",
          data: { workNumber : workNumber },
          success: function() {
               location.reload();
          }
     });
});

$('.cal-btn2').on('click', () => {
     $('.modal-container-del').hide();
});