lists.forEach(workList => {
    let text = `
        <div class="list1" title="`;

        if(`${workList.workStatus}` == '진행중') {
            text += `작업중`;
        } else {
            text += `${workList.workStatus}`;
        }

        text += `">
            <input type="hidden" class="workNumber" value="${workList.workNumber}"/>
            <input type="hidden" class="workStartTime" value="${workList.workStartTime}">
            <input type="hidden" class="workPredictTime" value="${workList.workPredictTime}">
            <input type="hidden" class="memberName" value="${workList.memberName}"/>
            <input type="hidden" class="memberNumber" value="${workList.memberNumber}"/>
            <input type="hidden" class="workPlace" value="${workList.workPlaceName}"/>
            <input type="hidden" class="workTitle" value="${workList.workTitle}"/>
            <input type="hidden" class="workDetail" value="${workList.workDetail}"/>
            <input type="hidden" class="workStatus" value="${workList.workStatus}"/>
            `;
            if(`${workList.workStatus}` == '이동중') {
                text += `<li class="point1">●</li>`;
            } else if(`${workList.workStatus}` == '진행중') {
                text += `<li class="point1" style="color: #F06292">●</li>`;
            }
            text += `
            <li class="username"><span>${workList.memberName}</span> <span>${workList.memberRank}님</span></li>
            <li class="usertime"><span>` + formatDateTime(`${workList.workStartTime}`) + `</span> ~ <span>` + formatDateTime(`${workList.workPredictTime}`) + `</span>
            <li class="ow"><span>${workList.workPlaceName}</span></li>
            <li class="work"><span>${workList.workTitle}</li>
        </div>
    `;

    for(let i = 0; i < $('.memberNumber').length; i++) {
        if($('.memberNumber').eq(i).val() == `${workList.memberNumber}`) {
            if($('.memberNumber').eq(i + 1).val() == `${workList.memberNumber}`) continue;
            $('.list1').eq(i).after(text);
            $('.list1').eq(i + 1).hide();
            // text = '';
            return;
        }
    }

    $('.listloop').append(text);
});

finishLists.forEach(workList => {
    let text = `<div class="list1" title="${workList.workStatus}">
            <input type="hidden" class="workNumber" value="${workList.workNumber}"/>
            <input type="hidden" class="workStartTime" value="${workList.workStartTime}">
            <input type="hidden" class="workPredictTime" value="${workList.workPredictTime}">
            <input type="hidden" class="memberName" value="${workList.memberName}"/>
            <input type="hidden" class="memberNumber" value="${workList.memberNumber}"/>
            <input type="hidden" class="workPlace" value="${workList.workPlaceName}"/>
            <input type="hidden" class="workTitle" value="${workList.workTitle}"/>
            <input type="hidden" class="workDetail" value="${workList.workDetail}"/>
            <input type="hidden" class="workStatus" value="${workList.workStatus}"/>
            
            <li class="point2">●</li>
            <li class="username"><span>${workList.memberName}</span> <span>${workList.memberRank}님</span></li>
            <li class="usertime"><span>` + formatDateTime(`${workList.workStartTime}`) + `</span> ~ <span>` + formatDateTime(`${workList.workPredictTime}`) + `</span>
            <li class="ow"><span>${workList.workPlaceName}</span></li>
            <li class="work"><span>${workList.workTitle}</li>
        </div>
    `;

    for(let i = 0; i < $('.list1').length; i++) {
        if(($('.list1').eq(i).find('.memberNumber').val() == `${workList.memberNumber}`)) {
            if($('.memberNumber').eq(i + 1).val() == `${workList.memberNumber}` && ($('.workStartTime').eq(i + 1).val() < `${workList.workStartTime}`)) continue;
            $('.list1').eq(i).after(text);
            $('.list1').eq(i + 1).hide();
            return;
        }

    }

    for(let i = 0; i < $('.list1').length; i++) {
        if(($('.workStartTime').eq(i).val() > `${workList.workStartTime}`) && ($('.list1').eq(i).css('display') == 'flex')) {
            $('.list1').eq(i).before(text);
            return;
        }
    }

    $('.listloop').append(text);
});

$('.memberName').each((i, e) => {
    if($('.memberName').eq(i).val() == $('.memberName').eq(i - 1).val() && $('.memberName').eq(i).parents('.list1').prev().length != 0 && $('.list1').eq(i).find('.workStatus').next().attr('class') != `point2`) {
        $('.username').prev().eq(i).attr('class', 'point4');
        $('.username').prev().eq(i).removeAttr('style');
        $('.list1').eq(i).attr('title', '대기중');
        return;
    }
    if($('.memberName').eq(i).parents('.list1').prev().length == 0 && ($('.memberName').eq(i).val() == $('.memberName').eq(i + 1).val())) {
        $('.username').prev().eq(i).attr('class', 'point point1');
        return;
    }
    if(($('.memberName').eq(i).val() != $('.memberName').eq(i - 1).val()) && ($('.memberName').eq(i).val() == $('.memberName').eq(i + 1).val())) {
        if($('.workStatus').eq(i).val() == '종료') {
            $('.username').prev().eq(i).attr('class', 'point point2');
            return;
        }
        $('.username').prev().eq(i).attr('class', 'point point1');
        return;
    }
});

function formatDateTime(dateTimeString) {
    const dateTime = new Date(dateTimeString);

    const period = dateTime.getHours() >= 12 ? '오후' : '오전';
    const formattedHours = dateTime.getHours().toString().padStart(2, '0');
    const formattedMinutes = dateTime.getMinutes().toString().padStart(2, '0');

    return `${period} ${formattedHours}:${formattedMinutes}`;
}

$('.point').on('click', function() {
    let memberName = $(this).parents('.list1').find('.memberName').val();

    if($(this).parents('.list1').next().css('display') == 'flex') {
        let count = 0;
        for (let i = 0; i < $('.list1').length; i++) {
            if((memberName == $('.memberName').eq(i).val())) {
                if(count == 0) {
                    if($('.workStatus').eq(i).val() == '종료') {
                        $('.list1').eq(i).find('.point-').attr('class','point point2');
                    } else {
                        $('.list1').eq(i).find('.point-').attr('class','point point1');
                    }
                    count++;
                    continue;
                }
                $('.memberName').eq(i).parents('.list1').slideUp();
            }
        }
    } else {
        let count = 0;
        for (let i = 0; i < $('.list1').length; i++) {
            if((memberName == $('.memberName').eq(i).val())) {
                if(count == 0) {
                    if($('.workStatus').eq(i).val() == '종료') {
                        $('.list1').eq(i).find('.point').attr('class','point- point2');
                    } else {
                        $('.list1').eq(i).find('.point').attr('class','point- point1');
                    }
                    count++;
                    continue;
                }
                $('.memberName').eq(i).parents('.list1').slideDown();
            }
        }
    }
});

$('.list1').on('click', function (e){
    if($(e.target).hasClass('point1') || $(e.target).hasClass('point2')) {
        return;
    }

    $(".modal-container-popup").css("display", "flex");

    let modalName = $(this).closest('.list1').find('.memberName').val();
    let modalST = $(this).closest('.list1').find('.workStartTime').val();
    let modalET = $(this).closest('.list1').find('.workPredictTime').val();
    let modalWP = $(this).closest('.list1').find('.workPlace').val();
    let modalTitle = $(this).closest('.list1').find('.workTitle').val();
    let modalDetail = $(this).closest('.list1').find('.workDetail').val();

    $('.modal-name').text(modalName + '님 일정 상세');
    $('.modal-st').text(modalST);
    $('.modal-et').text(modalET);
    $('.modal-wp').text(modalWP);
    $('.modal-worktitle').text("제목 : " + modalTitle);
    $('.modal-detail').text(modalDetail);
});

$('.modal-close').on('click', function (){
    $(".modal-container-popup").css("display", "none");
});

