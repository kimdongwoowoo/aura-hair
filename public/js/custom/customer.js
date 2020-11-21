$(document).ready(function(){
    fnRenderCustomerList();
});


//렌더링후 이벤트바인드
function fnRenderCustomerList(){
    $.ajax({ 
        url: "/api/customer",
        method: "GET", 
        dataType: "json",
        success:success,
        fail:fail
    });
    function success(data){
        
        var source=$("#tbCustomerList-template").html();
        var renderData={
            customerList:data
        }
        var template=Handlebars.compile(source);
        var html=template(renderData);
        $("#tbCustomerList").html(html);
        
    }
    function fail(err){
        console.log(err);
    }

    fnEventBind(); //이벤트 바인드

}

function fnEventBind(){
    $("#btnSaveCustomer").click(function(){
       var check=fnValidCheckCustomer();
       if(check){
            var newCustomer={
                name: $("#inputCustomerName").val(),
                phone:$("#inputCustomerPhone").val(),
                address:$("#inputCustomerAddress").val(),
                vip:$("#inputCustomerClass").val(),
                point:$("#inputCustomerPoint").val(),
                memo:$("#inputCustomerMemo").val()
            }
           fnSaveNewCustomer(newCustomer);
       }
       
    
    });
}
//저장후 렌더링함수 호출
function fnSaveNewCustomer(newCustomer){
    //POST
    $.ajax({ 
        url: "/api/customer",
        method: "POST",
        data:newCustomer,
        dataType: "json",
        success:success,
        fail:fail
    });
    function success(data){
        $("#customerModal").modal('toggle')
        fnRenderCustomerList();
    }
    function fail(err){
        console.log(err);
    }
    
}
function fnValidCheckCustomer(){
    var name=$("#inputCustomerName").val();
    var phone=$("#inputCustomerPhone").val(); //입력양식만 검사, POST호출시 중복검사
    //focus
    var address=$("#inputCustomerAddress").val();
    var vip=$("#inputCustomerClass").val();
    var point=$("#inputCustomerPoint").val();
    var memo=$("#inputCustomerMemo").val();
    
    //check 로직 추가
    return true;
}
