
$(document).ready(function(){
    fnEventBind();
});
function fnEventBind(){
    $("#btnGetMoney").off().on('click',function(){
        const start=$("#inputStart").val();
        const end=$("#inputEnd").val();
        if(!start){
            alert('시작일을 입력하세요.');
            return;
        }else if(!end){
            alert('종료일을 입력하세요.');
            return;
        }
        if(start>end){
            alert('시작일 < 종료일 이어야합니다.');
            return;
        }
        fnGetSalesGraphList(start,end);
        console.log(start,end);
    });
    
}
function fnGetSalesGraphList(start,end){
    //GET
    //var data=[{date:'2021-03-24',money:12345,count:6},{date:'2021-03-24',money:12345,count:6}]
    $.ajax({ 
        url: "/api/sales",
        method: "GET", 
        dataType:"json",
        data:{
            start:start,
            end:end
        },    
        success:success,
        fail:fail
    });
    function success(data){
        fnRenderGraph(data);
    }
    function fail(err){
        console.log(err);
    }
   
}
function fnRenderGraph(data){
    var source=$("#tbSalesGraph-template").html();
    var total=0;
    for(var i=0;i<data.length;++i){
        total+=Number(data[i].totalSaleAmount);
        data[i].value=data[i].totalSaleAmount/10000; //100만원의 %
        data[i].totalSaleAmount=$.number(data[i].totalSaleAmount,0,',');
        
    }
    var renderData={
        tbSalesGraphList:data
    };
    console.log(renderData);
    var template=Handlebars.compile(source);
    var html=template(renderData);
    $("#tbSalesGraphBody").html(html);
    for(var i=0;i<data.length;++i){
        data[i].value=data[i].totalSaleAmount/10000; //100만원의 %
    }

    //요약표시
    $("#labelTotalSales").text("총 매출 : "+$.number(total,0,',')+"원");
}