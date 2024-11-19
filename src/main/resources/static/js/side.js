let url = window.location.href;

// local 1000 서버
// if(url.indexOf('http://localhost:1000/admin/') != -1){
//     $('.adminpage').attr("id", "click");
// }
//
// if(url == 'http://localhost:1000/list/list') {
//     $('.listpage').attr("id", "click");
// }
//
// if(url == 'http://localhost:1000/sd') {
//     $('.schedulepage').attr("id", "click");
// }
//
// if(url.indexOf('http://localhost:1000/statistics/') != -1) {
//     $('.statisticspage').attr("id", "click");
// }

// -----------------------------------------------------------------------------
// local 8080 서버
if(url.indexOf('http://112.217.73.70:8080/admin/') != -1){
    $('.adminpage').attr("id", "click");
}

if(url == 'http://112.217.73.70:8080/list/list') {
    $('.listpage').attr("id", "click");
}

if(url == 'http://112.217.73.70:8080/sd') {
    $('.schedulepage').attr("id", "click");
}

if(url.indexOf('http://112.217.73.70:8080/statistics/') != -1) {
    $('.statisticspage').attr("id", "click");
}

$(document).ready(function() {
    let savedColor = getCookie('template_color');

    if (savedColor) {
        $('.template_color').val(savedColor); // 쿠키 값으로 템플릿 색상 설정
        setTemplateColor(savedColor); // 템플릿 스타일 적용
    } else {
        // 기본 템플릿 색상 설정
        $('.template_color').val('default');
        setTemplateColor('default');
    }
});

$('.color_template_item').on('click', function () {
    if($('.click_color').css('display') == 'none') {
        $('.click_color').show();
    }
    else {
        $('.click_color').hide();
    }
});

$('.template_color').on('change', function (){
    let color = $(this).val();
    setTemplateColor(color); // 템플릿 스타일 적용

    // 쿠키 설정
    document.cookie = `template_color=${color}; expires=Fri, 31 Dec 9999 23:59:59 GMT; path=/`;
});

function setTemplateColor(color) {
    let baseUrl = window.location.origin;
    let link = $('<link>');
    let css = `css/total/${color}.css`;
    let Path = `${baseUrl}/${css}`;

    link.attr('rel', 'stylesheet');
    link.attr('href', Path);

    link.addClass('custom_css');

    // 기존 스타일 시트 제거
    $('head').find('.custom_css').remove();
``
    $('head').append(link);
}

function getCookie(name) {
    const value = "; " + document.cookie;
    const parts = value.split("; " + name + "=");
    if (parts.length === 2) {
        return parts.pop().split(";").shift();
    }
    return null;
}