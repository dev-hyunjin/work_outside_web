$(".modal-open").on("click", function() {
   $(".modal-container").eq(0).css("display", "flex");
});

$(".cal-btn").on("click", function() {
    $('form')[0].reset();
    $('.modal-container-add').css("display", "none");
});

$(".cal-btn2").on("click", function() {
    // $('form')[0].reset();
    $('.modal-container-del').css("display", "none");
});

$(".modal-close").on("click", function() {
    $(this).parent().parent().parent().parent().css("display", "none");
});

$('.list1').on('click', function (){
    $(".modal-container").eq(1).css("display", "flex");
});

