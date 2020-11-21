$(document).ready(function(){
    fnGetAllCustomerList();
});
function fnGetAllCustomerList(){
    $.ajax({ 
        url: "/api/customer",
        method: "GET", 
        dataType: "json",
        success:success,
        fail:fail
    });
    function success(data){
        fnRenderCustomerList(data);
    }
    function fail(err){
        console.log(err);
    }
}

//렌더링후 이벤트바인드
//순수 data만 갖고 렌더링
function fnRenderCustomerList(data){
    var source=$("#tbCustomerList-template").html();
    var renderData={
        customerList:data
    }
    var template=Handlebars.compile(source);
    var html=template(renderData);
    $("#tbCustomerList").html(html);
    fnEventBind();
}
function fnUpdateCustomer(customer){
     //PUT
     $.ajax({ 
        url: "/api/customer/"+customer.id,
        method: "PUT",
        data:customer,
        dataType: "json",
        success:success,
        fail:fail
    });
    function success(data){
        $("#modalCustomer").modal('toggle');
        fnGetAllCustomerList();
    }
    function fail(err){
        console.log(err);
    }
}
function fnEventBind(){
    $("#btnNewCustomer").off().on('click',function(){
        $("#modalCustomer").attr('customerId',''); //신규고객은 modal에서 id삭제
        $('.modal-body form')[0].reset(); //전체 form 리셋
        $("#modalCustomer").modal('toggle');
    });
    $("#btnSaveCustomer").off().on('click',function(){
       var check=fnValidCheckCustomer();
       if(check){
            var customer={
                name: $("#inputCustomerName").val(),
                phone:$("#inputCustomerPhone").val(),
                address:$("#inputCustomerAddress").val(),
                vip:$("#inputCustomerClass").val(),
                point:$("#inputCustomerPoint").val(),
                memo:$("#inputCustomerMemo").val()
            }

            if($("#modalCustomer").attr('customerId')){
                customer['id']=$("#modalCustomer").attr('customerId');
                fnUpdateCustomer(customer);
            }else{
                fnSaveNewCustomer(customer);
            }
           
       }
    });

    $("#btnSearchCustomer").off().on('click',function(){
        var keyword=$("#inputSearchCustomer").val();
        if(!keyword){
            fnGetAllCustomerList();
        }else{
            fnSearchCustomer(keyword);
        }
    });

    //header, footer를 제외, customerId를 포함한 row
    $("tr[customerId]").off().on('dblclick',function(){
        var id=$(this).attr('customerId');
        fnPopupModalCustomer(id);
    });


}
function fnSearchCustomer(keyword){
    $.ajax({ 
        url: "/api/customer",
        method: "GET", 
        dataType:"json",
        data:{
            keyword:keyword
        },    
        success:success,
        fail:fail
    });
    function success(data){
        fnRenderCustomerList(data)
    }
    function fail(err){
        console.log(err);
    }
}
function fnPopupModalCustomer(customerId){
    $("#modalCustomer").attr('customerId',customerId);
    $.ajax({ 
        url: "/api/customer/"+customerId,
        method: "GET", 
        dataType: "json",
        success:success,
        fail:fail
    });
    function success(data){
        //console.log(data);
        $("#inputCustomerName").val(data.name);
        $("#inputCustomerPhone").val(data.phone);
        $("#inputCustomerAddress").val(data.address);
        $("#inputCustomerClass").val(data.vip);
        $("#inputCustomerPoint").val(data.point);
        $("#inputCustomerMemo").val(data.memo);
        
        $("#modalCustomer").modal('toggle');
    }
    function fail(err){
        console.log(err);
    }

    


}
//저장후 렌더링함수 호출
function fnSaveNewCustomer(customer){
    //POST
    $.ajax({ 
        url: "/api/customer",
        method: "POST",
        data:customer,
        dataType: "json",
        success:success,
        fail:fail
    });
    function success(data){
        $("#modalCustomer").modal('toggle');
        fnGetAllCustomerList();
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
