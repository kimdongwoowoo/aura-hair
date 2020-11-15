$(document).ready(function(){
    sidebarEventBind();
});
function sidebarEventBind(){
    $(".nav-item").click(function(){
        $(".nav-item").removeClass("active");
        $(this).addClass("active");
    });

    $("#sidebar_customer").click(function(){
        $.ajax({ 
            type: 'post' , 
            url: '/customer' , 
            success: function(data) { 
                $("#content").html(data); 
            }    
        });
    });
}