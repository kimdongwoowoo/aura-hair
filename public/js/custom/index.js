$(document).ready(function(){
    sidebarEventBind();
    $("#sidebar_sales").click();
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
    $("#sidebar_product").click(function(){
        $.ajax({ 
            type: 'post' , 
            url: '/product' , 
            success: function(data) { 
                $("#content").html(data); 
            }    
        });
    });
    $("#sidebar_sales").click(function(){
        $.ajax({ 
            type: 'post' , 
            url: '/sales' , 
            success: function(data) { 
                $("#content").html(data); 
            }    
        });
    });
    $("#sidebar_schedule").click(function(){
        $.ajax({ 
            type: 'post' , 
            url: '/schedule' , 
            success: function(data) { 
                $("#content").html(data); 
            }    
        });
    });
    $("#sidebar_sales_graph").click(function(){
        $.ajax({ 
            type: 'post' , 
            url: '/sales_graph' , 
            success: function(data) { 
                $("#content").html(data); 
            }    
        });
    });
    
    $("#aMain").click(function(){
        $("#sidebar_sales").click();
    })
    
}