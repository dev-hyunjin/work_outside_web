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
});