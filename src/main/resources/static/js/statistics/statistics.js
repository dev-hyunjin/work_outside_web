$(function() {

    const urlParams = new URL(location.href).searchParams;
    let paramWorkStartTime = urlParams.get("workStartTime") ? urlParams.get("workStartTime") : '';
    let paramWorkEndTime = urlParams.get("workEndTime") ? urlParams.get("workEndTime") : '';
    let paramWorkplaceNumber = urlParams.get("workplaceNumber") ? urlParams.get("workplaceNumber") : '';
    let paramMemberNumber = urlParams.get("memberNumber") ? urlParams.get("memberNumber") : '';

    $('#work-start-time').val(paramWorkStartTime);
    $('#work-end-time').val(paramWorkEndTime);
    $('#name-list').val(paramMemberNumber);

    if($('.prev-btn').length) {
        $('.prev-btn').attr('href', updateURL($('.prev-btn').attr('href')));
    }

    if($('.number-btn').length) {
        $('.number-btn').each(function () {
            $(this).attr('href', updateURL($(this).attr('href')));
        });
    }

    if($('.next-btn').length) {
        $('.next-btn').attr('href', updateURL($('.next-btn').attr('href')));
    }

    function updateURL(url) {
        let originalUrl = url.split('&');

        let first = originalUrl[0];

        return first + '&workStartTime=' + paramWorkStartTime + '&workEndTime=' + paramWorkEndTime
            +'&workplaceNumber=' + paramWorkplaceNumber +'&memberNumber=' + paramMemberNumber;
    }

    statisticsCommon.statisticsList();
    statisticsCommon.workplaceList();

    $('#workplace-list').val(paramWorkplaceNumber).prop('selected', true);

    members.forEach(member => {

        let text;

        text = `
            <option value="${member.memberNumber}">${member.memberName}</option>
        `;

        $('#name-list').append(text);
    });

    $('.submit').on('click', function() {
        let workStartTime = $('#work-start-time').val();
        let workEndTime = $('#work-end-time').val();
        let workplaceNumber = $('#workplace-list').val();
        let memberNumber = $('#name-list').val();

        if(workEndTime && !workStartTime) {
            alert("날짜를 모두 고르거나 모두 고르지마세요");
            return;
        }

        if(statisticsCommon.checkLastDate(workStartTime, workEndTime)) {
            alert("시작날이 끝날보다 큽니다.");
            return;
        }

        location.href = '/statistics/statistics?workStartTime=' + workStartTime + '&workEndTime=' + workEndTime +
            '&workplaceNumber=' + workplaceNumber + '&memberNumber=' + memberNumber;
    });









    var barChart = function(chartID, chartNm, chartTick, chartData) {
        $.jqplot(chartID, [chartData], {
            title: chartNm,
            animate: true,
            seriesDefaults: {
                renderer:$.jqplot.BarRenderer,
                rendererOptions: {
                    varyBarColor: true,
                    barMargin: 10
                },
                pointLabels: {
                    show: true
                }
            },
            grid: {
                //background: "#FFFFFF",
                gridLineColor: "#BFBFBF",
                drawBorder:	false
            },
            axes:{
                xaxis:{
                    renderer:$.jqplot.CategoryAxisRenderer,
                    ticks: chartTick,
                    drawMajorGridlines: true,
                    tickOptions:{
                        textColor: "#333333",
                        showMarker:	false
                    }
                },
                yaxis:{
                    min: 0,
                    tickInterval: 1,    // 눈금간격
                    drawMajorGridlines: true,
                    tickOptions: {
                        formatString: "%'d",
                        textColor: "#333333",
                        showMarker:	false
                    }
                }
            }
        });
    };



    var popStatGraph = function () {
        // var data = $grid.pqGrid("option", "dataModel.data");
        // var data = [{
        //     avg_call_sec: 120,
        //     avg_call_time: "00:02:00",
        //     five_ten_cnt: 0,
        //     in_cnt: 1,
        //     local_cnt: 0,
        //     one_five_cnt: 1,
        //     one_under_cnt: 0,
        //     out_cnt: 0,
        //     rec_date: "20191014",
        //     rec_mode: "1",
        //     rec_mode_nm: "Back",
        //     ten_over_cnt: 0,
        //     tot_call_sec: 120,
        //     tot_call_time: "00:02:00",
        //     tot_cnt: 1,
        //     user_id: "lgs",
        //     user_name: "lgs",
        //     v_rec_date: "2019-10-14"
        // },
        //     {
        //         avg_call_sec: 120,
        //         avg_call_time: "00:02:00",
        //         five_ten_cnt: 0,
        //         in_cnt: 1,
        //         local_cnt: 0,
        //         one_five_cnt: 1,
        //         one_under_cnt: 0,
        //         out_cnt: 0,
        //         rec_date: "20191014",
        //         rec_mode: "1",
        //         rec_mode_nm: "Back",
        //         ten_over_cnt: 0,
        //         tot_call_sec: 120,
        //         tot_call_time: "00:02:00",
        //         tot_cnt: 1,
        //         user_id: "lgs",
        //         user_name: "lgs",
        //         v_rec_date: "2019-10-14"
        //     }];
        var data;

        $.ajax({
            url: "/statistics/get-graph-data-normal",
            type: "post",
            data: { workStartTime : paramWorkStartTime, workEndTime : paramWorkEndTime, workplaceNumber : paramWorkplaceNumber, memberNumber : paramMemberNumber },
            async: false,
            success: function(results) {
                if(results) {
                    data = results;
                }
            }
        });

        var chartTick = [], chartData = [];

        if(data!=undefined && data.length>0) {
            var data_team_name = {};
            var obj_team_name = $("#modalStatGraph select[name=team_name]");

            if(obj_team_name.html().trim()=="") {
                // user_id json 데이터 생성
                for(var i=0;i<data.length;i++) {
                    data_team_name[data[i].teamNumber] = data[i].teamName;
                }

                // user_id select box 생성
                // var html = "";
                // $.each(data_team_name, function(key, val) {
                //     html += "<option value='" + key + "'>" + val + "</option>";
                // });
                // obj_team_name.html(html);
            }

            // 그래프 데이터 생성
            var baseField = $("#modalStatGraph select[name=data_type]").val();

            for(var i=0;i<data.length;i++) {
                // if(obj_team_name.val()==data[i].teamName) {
                chartTick.push(data[i].workStartTime);
                // chartData.push(parseInt(eval("data[i]."+baseField)));
                chartData.push(data[i].totalCount);
                // }
            }
        } else {
            alert("데이터가 없습니다");
            return;
        }

        // 상단 title 표시
        $("#modalStatGraph #rec_date1").html(paramWorkStartTime);
        $("#modalStatGraph #rec_date2").html(paramWorkEndTime);
        $("#modalStatGraph #date_type").html($("#search select[name=date_type] option:selected").text());

        $("#modalStatGraph").modal("show");

        // graph
        $("#chart").html("");
        barChart("chart", "", chartTick, chartData);
    };

    // $("#modalStatGraph select[name=user_id], #modalStatGraph select[name=data_type]").change(function(){
    // 	popStatGraph();
    // });

    $(".graph").on('click', function(){
        if(!paramWorkStartTime || !paramWorkEndTime) {
            alert('날짜를 검색 후 이용해주세요.');
            return;
        }
        popStatGraph();
    });
});