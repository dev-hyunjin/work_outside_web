$(function() {

    departments.forEach(department => {

        let text;

        text = `
            <hr>
            <ul class="dept">
                <div class="add-list">
                    <input type="hidden" id="department-number" value="${department.deptNumber}">
                    <div class="dept-name"><span class="arrow">▶</span> ${department.deptName}</div>
                    <div><button class="plus" type="button">➕</button> <button class="edit" type="button">✏️</button></div>
                </div>
            </ul>
        `;

        $('.company-list').append(text);
    });

    $('.edit').on('click', function() {
        $('#dept-edit').val($(this).parent().prev().text().replace('▶ ', ''));
        $('#dept-number').val($(this).parents('.dept').find('#department-number').val());
        adminCommon.openModal(4);
    });

    $('#dept-update').on('click', function() {
        adminCommon.changeUse("/admin/dept-update", { deptNumber : $('#dept-number').val(), deptName : $('#dept-edit').val() })
    });

    $('#dept-delete-btn').on('click', function() {
        adminCommon.openModal(5);
    });

    $('#remove-dept').on('click', function() {
        adminCommon.changeUse("/admin/dept-delete", { deptNumber : $('#dept-number').val() })
    });

    // 부서 이름 눌렀을 때 아래 요소 나타내기
    $('.dept-name').on('click', function() {
        const appendPlace = $(this).parents('.dept');

        if(appendPlace.children('.team-list').length != 0) {
            appendPlace.children('.team-list').remove();
            return;
        }

        adminCommon.getTeamList($(this).prev().val(), true, function(results) {
            if(results) {
                let text = `<div class="team-list">`;
                results.forEach(result => {

                    text += `
                        <li class="team"><span>•</span> <input type="hidden" value="${result.teamNumber}"><span class="team-name">${result.teamName}</span></li>
                    `;

                });
                text += `</div>`;

                appendPlace.append(text);

                $('.team-name').on('click', function() {
                    $('#team-name').val($(this).text());
                    $('#team-number-update').val($(this).prev().val());
                    adminCommon.openModal(2);
                });

                $('#team-update').on('click', function() {
                    adminCommon.changeUse("/admin/team-update", { teamNumber : $('#team-number-update').val(), teamName : $('#team-name').val() })
                });

                $('#team-delete').on('click', function() {
                    adminCommon.openModal(3);
                });

                $('#delete-submit').on('click', function() {
                    adminCommon.changeUse("/admin/team-delete", { teamNumber : $('#team-number-update').val() })
                });
            }
        });
    });

    $('.dept-btn').on('click', function() {
        adminCommon.openModal(0);
    });

    adminCommon.closeModal(false);

    $('.plus').on('click', function() {
        $('input[name=deptNumber]').val($(this).parents('.dept').find('#department-number').val());
        adminCommon.openModal(1);
    });

    $('.team-name').on('click', function() {
        adminCommon.openModal(2);
    });
});