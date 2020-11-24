$(document).ready(function(){
    fnGetAllSalesList();
});
function fnGetAllSalesList(){
    $.ajax({ 
        url: "/api/sales",
        method: "GET", 
        dataType: "json",
        success:success,
        fail:fail
    });
    function success(data){
        fnRenderSalesList(data);
    }
    function fail(err){
        console.log(err);
    }
}

//렌더링후 이벤트바인드
//순수 data만 갖고 렌더링
function fnRenderSalesList(data){
    var source=$("#tbSalesList-template").html();
    var renderData={
        salesList:data
    }
    var template=Handlebars.compile(source);
    var html=template(renderData);
    $("#tbSalesList").html(html);
    fnEventBind();
}
function fnUpdateSales(sales){
     //PUT
     $.ajax({ 
        url: "/api/sales/"+sales.id,
        method: "PUT",
        data:sales,
        dataType: "json",
        success:success,
        fail:fail
    });
    function success(data){
        $("#modalSales").modal('toggle');
        fnGetAllSalesList();
    }
    function fail(err){
        console.log(err);
    }
}
function fnEventBind(){
    $("#btnNewSales").off().on('click',function(){
        $("#modalSales").attr('salesId',''); //신규고객은 modal에서 id삭제
        $('.modal-body form')[0].reset(); //전체 form 리셋
        $("#modalSales").modal('toggle');
    });
    $("#btnSaveSales").off().on('click',function(){
       var check=fnValidCheckSales();
       if(check){
            var sales={
                name: $("#inputSalesName").val(),
                phone:$("#inputSalesPhone").val(),
                address:$("#inputSalesAddress").val(),
                vip:$("#inputSalesClass").val(),
                point:$("#inputSalesPoint").val(),
                memo:$("#inputSalesMemo").val()
            }

            if($("#modalSales").attr('salesId')){
                sales['id']=$("#modalSales").attr('salesId');
                fnUpdateSales(sales);
            }else{
                fnSaveNewSales(sales);
            }
           
       }
    });

    $("#btnSearchSales").off().on('click',function(){
        var keyword=$("#inputSearchSales").val();
        if(!keyword){
            fnGetAllSalesList();
        }else{
            fnSearchSales(keyword);
        }
    });

    //header, footer를 제외, salesId를 포함한 row
    $("tr[salesId]").off().on('dblclick',function(){
        var id=$(this).attr('salesId');
        fnPopupModalSales(id);
    });


}
function fnSearchSales(keyword){
    $.ajax({ 
        url: "/api/sales",
        method: "GET", 
        dataType:"json",
        data:{
            keyword:keyword
        },    
        success:success,
        fail:fail
    });
    function success(data){
        fnRenderSalesList(data)
    }
    function fail(err){
        console.log(err);
    }
}
function fnPopupModalSales(salesId){
    $("#modalSales").attr('salesId',salesId);
    $.ajax({ 
        url: "/api/sales/"+salesId,
        method: "GET", 
        dataType: "json",
        success:success,
        fail:fail
    });
    function success(data){
        //console.log(data);
        $("#inputSalesName").val(data.name);
        $("#inputSalesPhone").val(data.phone);
        $("#inputSalesAddress").val(data.address);
        $("#inputSalesClass").val(data.vip);
        $("#inputSalesPoint").val(data.point);
        $("#inputSalesMemo").val(data.memo);
        
        $("#modalSales").modal('toggle');
    }
    function fail(err){
        console.log(err);
    }

    


}
//저장후 렌더링함수 호출
function fnSaveNewSales(sales){
    //POST
    $.ajax({ 
        url: "/api/sales",
        method: "POST",
        data:sales,
        dataType: "json",
        success:success,
        fail:fail
    });
    function success(data){
        $("#modalSales").modal('toggle');
        fnGetAllSalesList();
    }
    function fail(err){
        console.log(err);
    }
    
}
function fnValidCheckSales(){
    var name=$("#inputSalesName").val();
    var phone=$("#inputSalesPhone").val(); //입력양식만 검사, POST호출시 중복검사
    //focus
    var address=$("#inputSalesAddress").val();
    var vip=$("#inputSalesClass").val();
    var point=$("#inputSalesPoint").val();
    var memo=$("#inputSalesMemo").val();
    
    //check 로직 추가
    return true;
}
