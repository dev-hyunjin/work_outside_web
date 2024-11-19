$(function() {

    const urlParams = new URL(location.href).searchParams;
    let paramDeptNumber = urlParams.get("deptNumber") ? urlParams.get("deptNumber") : '';
    let paramTeamNumber = urlParams.get("teamNumber") ? urlParams.get("teamNumber") : '';
    let paramMemberName = urlParams.get("memberName") ? urlParams.get("memberName") : '';
    let paramMemberUse = urlParams.get("memberUse") ? urlParams.get("memberUse") : '';

    if(paramMemberName) {
        $('.search-name').val(paramMemberName);
    }

    if(paramMemberUse == 'N') {
        $('.show-all').prop('checked', true);

        adminCommon.setPageBtn('&memberUse=N');
    } else {
        adminCommon.setPageBtn('&memberUse=Y');
    }

    members.forEach(member => {
        let text;

        if(`${member.memberUse}` == 'Y') {
            text = `
                <div class="user-list-sub">
                    <li class="null"></li>
                    <li class="name">${member.memberName}</li>
                    <li class="identity">${member.memberRank}</li>
                    <li class="dept">${member.deptName}</li>
                    <li class="team">${member.teamName}</li>
                    <input type="hidden" class="member-number" value="${member.memberNumber}">
                    <input type="hidden" class="member-id" value="${member.memberId}">
                    <input type="hidden" class="dept-number" value="${member.deptNumber}">
                    <input type="hidden" class="team-number" value="${member.teamNumber}">
                    <li class="btn">
                        <button type="button" class="edit">수정</button>
                        <button type="button" class="delete">삭제</button>
                    </li>
                </div>
                <hr>
            `;
        } else {
            text = `
                <div class="user-list-sub">
                    <li class="null"></li>
                    <li class="name unused">${member.memberName}</li>
                    <li class="identity unused">${member.memberRank}</li>
                    <li class="dept unused">${member.deptName}</li>
                    <li class="team unused">${member.teamName}</li>
                    <input type="hidden" class="member-number" value="${member.memberNumber}">
                    <li class="btn">
                        <button type="button" class="use">사용</button>
                    </li>
                </div>
                <hr>
            `;
        }
        $('.list-main-box').append(text);
    });

    departments.forEach(department => {

        let text;

        text = `
            <option value="${department.deptNumber}">${department.deptName}</option>
        `;

        $('.dept-list').append(text);
        $('#member-department').append(text);
        $('#modify-member-department').append(text);

        if(paramDeptNumber) {
            $('.dept-list').val(paramDeptNumber).prop('selected', true);
        }

        if(paramDeptNumber) {
            adminCommon.getTeamList($('.dept-list').val(), false, function(teams) {
                adminCommon.appendTeamText(teams, true, $('.team-list'));
            });

            $('.team-list').val(paramTeamNumber).prop('selected', true);
        }
    });

    $('.dept-list').on('change', function() {
        adminCommon.getTeamList($('.dept-list').val(), true, function(teams) {
            adminCommon.appendTeamText(teams, true, $('.team-list'));
        });
    });

    $('.use').on('click', function() {
        var memberNumber;

        memberNumber = $(this).parent().prev().val();

        adminCommon.changeUse("/admin/change-member-use", { memberNumber : memberNumber, memberUse : 'Y'})
    });

    $('.show-all').on('click', function() {
        if($(this).is(':checked')) {
            location.href = "/admin/user-mgmt?deptNumber=" + paramDeptNumber + "&teamNumber=" + paramTeamNumber + "&memberName=" + paramMemberName + "&memberUse=N";
        } else {
            location.href = "/admin/user-mgmt?deptNumber=" + paramDeptNumber + "&teamNumber=" + paramTeamNumber + "&memberName=" + paramMemberName + "&memberUse=Y";
        }
    });

    $('.submit').on('click', function() {
        let deptNumber = $('.dept-list option:selected').val();
        let teamNumber = $('.team-list option:selected').val();
        let memberName = $('.search-name').val();

        location.href = '/admin/user-mgmt?deptNumber=' + deptNumber + '&teamNumber=' + teamNumber + '&memberName=' + memberName + '&memberUse=' + (paramMemberUse ? paramMemberUse : 'Y');
    });

    adminCommon.closeModal(false);

    $('.delete').on('click', function() {
        let memberNumber = $(this).parents('.user-list-sub').find('.member-number').val();

        $('#member-delete-number').val(memberNumber);

        adminCommon.openModal(2);
    });

    $('#member-delete').on('click', function() {
        adminCommon.changeUse("/admin/change-member-use", { memberNumber : $('#member-delete-number').val(), memberUse : 'N'});
    });

    $('.edit').on('click', function() {
        let userDiv = $(this).parents('.user-list-sub');

        $('#modify-member-number').val(userDiv.find('.member-number').val());

        $('#modify-member-name').val(userDiv.find('.name').text());
        $('#modify-member-id').val(userDiv.find('.member-id').val())

        $('#modify-member-department').val(userDiv.find('.dept-number').val()).prop('selected', true);

        adminCommon.getTeamList(userDiv.find('.dept-number').val(), true, function(teams) {
            adminCommon.appendTeamText(teams, false, $('#modify-member-team'));

            $('#modify-member-team').val(userDiv.find('.team-number').val()).prop('selected', true);
        });

        $('#modify-member-rank').val(userDiv.find('.identity').text()).prop('selected', true);

        adminCommon.openModal(1);
    });

    $('#modify-member-department').on('change', function() {
        adminCommon.getTeamList($('#modify-member-department').val(), true, function(teams) {
            adminCommon.appendTeamText(teams, false, $('#modify-member-team'));
        });
    });

    $('#modify-btn').on('click', function() {
        let check = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{8,16}$/;
        const memberName = $('#modify-member-name').val();
        const memberPassword = $('#modify-member-password').val();
        const teamName = $('#modify-member-team').val();

        if(!memberName) {
            alert("이름을 입력하세요.");
            return;
        }

        if(memberPassword) {
            if(!check.test(memberPassword)) {
                alert("비밀번호는 8자 이상, 16자 이하이고 최소 하나의 문자, 하나의 숫자 및 하나의 특수 문자가 들어가야 합니다.");
                return;
            }
        }

        if(!teamName) {
            alert("팀을 선택해주세요.")
            return;
        }

        const memberDTO = {
            memberNumber : $('#modify-member-number').val(),
            memberId : $('#modify-member-id').val(),
            memberPassword : $('#modify-member-password').val(),
            memberName : $('#modify-member-name').val(),
            memberRank : $('#modify-member-rank').val(),
            deptNumber : $('#modify-member-department').val(),
            teamNumber : $('#modify-member-team').val(),
        }

        $.ajax({
            url: "/admin/change-member-info",
            type: 'post',
            data: JSON.stringify(memberDTO),
            contentType: "application/json; charset=utf-8",
            success: function() {
                location.reload();
            }
        });
    });

    $('.create').on('click', function() {
        adminCommon.getTeamList($('#member-department').val(), true, function(teams) {
            adminCommon.appendTeamText(teams, false, $('#member-team'));
        });

        adminCommon.openModal(0);
    });

    $('#member-department').on('change', function() {
        adminCommon.getTeamList($('#member-department').val(), true, function(teams) {
            adminCommon.appendTeamText(teams, false, $('#member-team'));
        });
    });

    $('#join-btn').on('click', function() {
        let check = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{8,16}$/;
        const memberName = $('input[name=memberName]').val();
        const memberId = $('input[name=memberId]').val();
        const memberPassword = $('input[name=memberPassword]').val();

        if(!memberName) {
            alert("이름을 입력하세요.");
            return;
        }

        if(!memberId) {
            alert("아이디를 입력하세요.");
            return;
        }

        if(memberId.length > 16) {
            alert("아이디는 최대 16글자입니다.");
            return;
        }

        if(!memberPassword) {
            alert("비밀번호를 입력하세요.");
            return;
        }
        
        if(!check.test(memberPassword)) {
            alert("비밀번호는 8자 이상, 16자 이하이고 최소 하나의 문자, 하나의 숫자 및 하나의 특수 문자가 들어가야 합니다.");
            return;
        }

        document.joinForm.submit();
    });
});