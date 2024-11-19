const urlParams = new URL(location.href).searchParams;
if(urlParams.get('interceptor') == 'Y') {
    alert("권한이 없습니다.");
}

$('.loginok').on('click', function (){
    loginOk();
});

// 엔터로 로그인 처리하기
$(document).on('keyup', function (e){
    if(e.keyCode === 13) {
        loginOk();
    }
});

function loginOk() {
    let memberId = $('.member_id').val();
    let memberPassword = $('.member_password').val();

    console.log(memberId , memberPassword);

    $.ajax({
        url : '/logins/loginOk',
        type : 'post',
        data : JSON.stringify({memberId : memberId , memberPassword : memberPassword}),
        contentType : "application/json; charset=utf-8",
        async : false,
        success : function (result){
            // Param();
            if (result == -1 || result == 0) {
                alert("아이디와 비밀번호를 확인해주세요.");
                let url = window.location.href;
                window.location.href = url;
            }else if(result == 2){
                if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
                    document.cookie = `expires=Fri, 31 Dec 9999 23:59:59 GMT; path=/`;
                     window.location.href = 'http://112.217.73.70:8080/sd';
                     //window.location.href = 'http://localhost:1000/sd';
                } else {
                    window.location.href = 'http://112.217.73.70:8080/list/list';
                    //window.location.href = 'http://localhost:1000/list/list';
                }
            }else if(result == 3){
                document.cookie = `expires=Fri, 31 Dec 9999 23:59:59 GMT; path=/`;
                window.location.href = 'http://112.217.73.70:8080/sd';
                //window.location.href = 'http://localhost:1000/sd';
            }
        },
        error : function (){
            console.log("실패");
        }
    });
}