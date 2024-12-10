$(document).ready( function (){
    document.cookie = `expires=Fri, 31 Dec 9999 23:59:59 GMT;`;
    
    // 휴가 등록 수정
    $(".vacation-btn").on("click", function() {
        if($("#vacationCnt").val() == 1) {
            alert("이미 휴가 등록 되어 있습니다. 수정 또는 삭제 해주세요.");
            $(".modal-container-v").eq(0).css("display", "none");
            return false;
        }
    });

});

$(function() {
    scheduleCommon.scheduleSubmit();
    scheduleCommon.scheduleUpdate();
    scheduleCommon.scheduleDelete();
    scheduleCommon.vacation();
    scheduleCommon.AutoCheck();
    scheduleCommon.scheduleCreate();
    scheduleCommon.scheduleList();
    scheduleCommon.option();
    scheduleCommon.search();
    scheduleCommon.vacationCheck();
    scheduleCommon.vacationDelete();
});