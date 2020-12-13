

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
        "salesList":data
    }
    var template=Handlebars.compile(source);
    var html=template(renderData);
    $("#tbSalesListBody").html(html);
    $("[id=tdSalesListFee]").each((idx,td)=>{
        $(td).text('￦'+$.number($(td).text(),0,','));
    });
    
    if (!$.fn.dataTable.isDataTable('#tbSalesList')) {
        $('#tbSalesList').dataTable({
            "language": {
                "decimal": "",
                "emptyTable": "등록된 내용이 없습니다.",
                "info": "",
                "infoEmpty": "",
                "infoFiltered": "",
                "infoPostFix": "",
                "thousands": ",",
                "lengthMenu": "_MENU_",
                "loadingRecords": "로드 중 ...",
                "processing": "처리 중 ...",
                "search": "검색:",
                "zeroRecords": "일치하는 내용이 없습니다.",
                "paginate": {
                    "first": "처음",
                    "last": "마지막",
                    "next": "다음",
                    "previous": "이전"
                },
                "aria": {
                    "sortAscending": ": 오름차순으로 정렬",
                    "sortDescending": ": 내림차순으로 정렬"
                }
            }

        });
    }
    fnEventBind();
}
function fnInputModalEventBind(){
    //원화 세팅
    $("#inputPrice,#inputDiscount,#inputPointUse,#inputFee,#inputPointTotal").number(true,0);

    //회원검색 관련
    $("#formSelectUser [id^=radio]").off().on('click',function(){
        if($(this).attr('id')=="radioUser"){
            $('#divUserSearch').collapse('show');
            $("#divPoint").collapse('show');
        }else if($(this).attr('id')=="radioNoneUser"){
            $('#divUserSearch').collapse('hide');
            $("#divPoint").collapse('hide');
            $("#radioNoneDiscount").click();
            fnDisableAndResetPoint();
        }
    });
    function fnDisableAndResetPoint(){
        $("#inputPointUse").attr("readonly",true);
        $("#inputPointUse").val("0");
        $("#inputPointTotal").val("0");
        $("#inputPointUse").trigger('input');
    }

    $("#btnSearchCustomer").off().on('click',function(){
        var keyword=$("#inputSearchCustomer").val();
        if(!keyword){
            alert('검색어를 입력하세요');
        }else{
            fnSearchCustomer(keyword);
        }
    });
    $("#inputSearchCustomer").keyup(function(e){
        if(e.keyCode==13)
            $("#btnSearchCustomer").click();
    });
    //제품관련
    $("#formSelectProduct [id^=radio]").off().on('click',function(){
        if($(this).attr('id')=="radioProduct"){
            $("#divProductSearch").collapse('show');
            $("#inputPrice").attr('readonly',true);
            $("#inputPrice").val('0');
            $("#inputPointUse").val("0");
            $("#inputPointUse").trigger('input');
            $("#radioNoneDiscount").click();
        }else if($(this).attr('id')=="radioSelfPrice"){
            $("#divProductSearch").collapse('hide');
            $("#inputPrice").attr('readonly',false);
            
        }
    });
  

    $("#btnSearchProduct").off().on('click',function(){
        var keyword=$("#inputSearchProduct").val();
        if(!keyword){
            alert('검색어를 입력하세요');
        }else{
            fnSearchProduct(keyword);
        }
    });
    $("#inputSearchProduct").keyup(function(e){
        if(e.keyCode==13)
            $("#btnSearchProduct").click();
    });
    //할인관련

    $("#formSelectDiscount [id^=radio]").off().on('click',function(){
        //공통수행후 분기
        $("#inputDiscount").val("0");
        $("#inputDiscount").trigger('input');
        if($(this).attr('id')=="radioNoneDiscount"){
            $("#inputDiscount").attr("readonly",true);
        }else if($(this).attr('id')=="radioPercentDiscount"){
            $("#inputDiscount").attr("readonly",false);
            $("#appendPercent").text("%");
            
        }else if($(this).attr('id')=="radioNumberDiscount"){
            $("#inputDiscount").attr("readonly",false);
            $("#appendPercent").text("￦");
        }
        
    });
    //상품가격 변경시
    $("#inputPrice,#inputDiscount,#inputPointUse").on('input keydown',function() {
        if($(this).attr('id')=="inputDiscount"){
            if($("#formSelectDiscount [id^=radio]:checked").attr('id')=="radioPercentDiscount"){
                var val=$(this).val();
                if(val<0)
                    $(this).val(0);
                if(val>100)
                    $(this).val(100);
            }
        }
        fnCalculateFee();
    });
    //날짜 디폴트 : 오늘
    var d=new Date();
    $("#inputDate").val(moment(d).format("YYYY-MM-DD"));
    $("#inputTime").val(moment(d).format("HH:mm"));
    //저장
    $("#btnSaveSales").off().on('click',function(){
        fnCheckSaveSales();
    });
    fnInitModalForm(); //라디오버튼 등 form 초기화

}

function fnCalculateFee(){
    //가격, 할인, 포인트로 총액 계산
    
    const price=$("#inputPrice").val();
    var fee=price;
    
    //할인 계산
    const selectDiscountId=$("#formSelectDiscount [id^=radio]:checked").attr('id');
    const discount=$("#inputDiscount").val();
    if(selectDiscountId=="radioPercentDiscount"){
        //할인율로 할인
        fee=fee*(100-discount)*0.01;
    }else if(selectDiscountId=="radioNumberDiscount"){
        //절대금액 할인
        fee=fee-discount;
    }
    //포인트 계산
    const usePoint=$("#inputPointUse").val();
    fee=fee-usePoint;
    $("#inputFee").val(fee);
}
function fnCheckSaveSales(){
    const fee=$("#inputFee").val();
    if(fee<0){
        alert('최종금액을 확인하세요');
        return;        
    }
    const date=$("#inputDate").val();
    const time=$("#inputTime").val();
    if(date=="" || time==""){
        alert('방문 날짜/시간을 확인하세요');
        return;        
    }
    
    if($("#inputPointUse").val()>0){
        if(!confirm('포인트를 차감하시겠습니까?')){
            return;
        }
    }
    fnMakeSales();
}
function fnMakeSales(){
    var sale={
        customerInfo:{
            _id:-1,
            name:"",
            phone:"",            
        },
        productInfo:{
            _id:-1,
            name:""
        },        
        price:0,
        discountType:0,
        discountValue:0,
        pointUse:0,
        fee:0,
        date:"",
        time:"",
        memo:""        
    };
    const customerTypeRadio=$("#formSelectUser [id^=radio]:checked").attr('id');
    if(customerTypeRadio=="radioUser"){
        const option=$("#selectCustomerList option:checked");
        sale.customerInfo.id=option.data('customerid');
        sale.customerInfo.name=option.data('customername');
        sale.customerInfo.phone=option.data('customerphone');
    }else{
        sale.customerInfo.name="비회원";
    }
    const productType=$("#formSelectProduct [id^=radio]:checked").attr('id');
    if(productType=="radioProduct"){
        const option=$("#selectProductList option:checked");
        sale.productInfo.id=option.data('productid');
        sale.productInfo.name=option.data('productname');
    }
    sale.price=$("#inputPrice").val();
    const discountType=$("#formSelectDiscount [id^=radio]:checked").attr('id');
    if(discountType=="radioNoneDiscount"){
        sale.discountType=0;
    }else if(discountType=="radioPercentDiscount"){
        sale.discountType=1;
    }else if(discountType=="radioNumberDiscount"){
        sale.discountType=2;
    }
    sale.discountValue=$("#inputDiscount").val();
    sale.pointUse=$("#inputPointUse").val();
    sale.fee=$("#inputFee").val();
    sale.date=$("#inputDate").val();
    sale.time=$("#inputTime").val();
    //DatePicker 추가
    sale.memo=$("#inputSalesMemo").val();

    fnSaveNewSales(sale);
    if(sale.customerInfo.id!=-1 && sale.pointUse>0)
        fnUsePoint(sale.customerInfo.id,sale.pointUse);
    
}
function fnUsePoint(customerId,point){
;
    $.ajax({ 
        url: "/api/customer/"+customerId,
        method: "GET",
        dataType: "json",
        success:success,
        fail:fail
    });
    
    
    function success(data){
        $.ajax({ 
            url: "/api/customer/"+data._id,
            method: "PUT",
            dataType: "json",
            
            data:{
                point:Number(data.point)-Number(point)
            }
        });
        
    }
    function fail(err){
        console.log(err);
    }
}
function fnRefundPoint(customerId,point){
    $.ajax({ 
        url: "/api/customer/"+customerId,
        method: "GET",
        dataType: "json",
        success:success,
        fail:fail
    });
    function success(data){
        $.ajax({ 
            url: "/api/customer/"+data._id,
            method: "PUT",
            dataType: "json",
            data:{
                point:Number(data.point)+Number(point)
            }
        });
        
    }
    function fail(err){
        console.log(err);
    }
}


function fnInitModalForm(){
    $('.modal-body form')[0].reset(); //전체 form 리셋
    $("#inputPrice").val("0");

    $("#radioNoneUser").click();
    $("#radioNoneDiscount").click();
    $("#radioSelfPrice").click();
}
function fnEventBind(){
    $("#btnNewSales").off().on('click',function(){
        
        $("#modalSales").attr('salesId',''); //신규등록은 modal에서 id삭제
        fnInputModalEventBind(); //modal 이벤트바인드
        $("#modalSales").modal('toggle');
        
    });
    
    //header, footer를 제외, salesId를 포함한 row
    $("tr[salesId]").off().on('dblclick',function(){
        const salesId=$(this).attr('salesId');
        $("#modalReceipt").attr('salesId',salesId);
        const customerId=$(this).data('customerid');
        $("#modalReceipt").attr('customerId',customerId);
        fnPopupModalSales(salesId);
        
    });
    $("#btnDelSales").off().on('click',function(){
        if(confirm("삭제하시겠습니까?")){
            if($("#modalReceipt").attr('customerId')!=-1 && $("#tdPoint").data('point')>0){
                if(confirm("포인트를 환불하시겠습니까?")){
                    const customerId=$("#modalReceipt").attr('customerId');
                    const point=$("#tdPoint").data('point');
                    fnRefundPoint(customerId,point);
                }
            }
            const salesId=$("#modalReceipt").attr('salesId');
            fnDeleteSales(salesId);
        }
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
        fnRenderCustomerList(data);
    }
    function fail(err){
        console.log(err);
    }
}
function fnSearchProduct(keyword){
    $.ajax({ 
        url: "/api/product",
        method: "GET", 
        dataType:"json",
        data:{
            keyword:keyword
        },    
        success:success,
        fail:fail
    });
    function success(data){
        fnRenderProductList(data);
    }
    function fail(err){
        console.log(err);
    }
}

//렌더링후 이벤트바인드
//순수 data만 갖고 렌더링
function fnRenderCustomerList(data){
    var source=$("#selectCustomerList-template").html();
    var renderData={
        'customerList':data
    }
    var template=Handlebars.compile(source);
    var html=template(renderData);
    $("#selectCustomerList").html(html);
    fnSelectCustomerListEventBind();
}

//렌더링후 이벤트바인드
//순수 data만 갖고 렌더링
function fnRenderProductList(data){
    var source=$("#selectProductList-template").html();
    var renderData={
        'productList':data
    }
    var template=Handlebars.compile(source);
    var html=template(renderData);
    $("#selectProductList").html(html);
    fnSelectProductListEventBind();
}
function fnSelectCustomerListEventBind(){
    $("#selectCustomerList option").off().on('dblclick',function(){
        var point=$(this).data('point');
        var vip=$(this).data('vip');
        $("#radioPercentDiscount").click();
        const vipPercent={
            'SILVER':10,
            'GOLD':20,
            'VIP':30
        }
        $("#inputDiscount").val(vipPercent[vip]);
        $("#inputDiscount").trigger('input');
        $("#inputPointUse").attr('readonly',false);
        $("#inputPointUse").val('0');
        $("#inputPointUse").trigger('input');
        $("#inputPointTotal").val(point);
        
    });

}
function fnSelectProductListEventBind(){
    $("#selectProductList option").off().on('dblclick',function(){
        $("#inputPrice").val($(this).data('price'));
        $("#inputPrice").trigger('input');
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
function fnDeleteSales(salesId){
    $.ajax({ 
        url: "/api/sales/"+salesId,
        method: "DELETE",   
        success:success,
        fail:fail
    });
    function success(data){
        alert('삭제되었습니다.');
        $("#modalReceipt").modal('toggle');
        fnGetAllSalesList();   
    }
    function fail(err){
        console.log(err);
    }
}
function fnReceiptModalEventBind(){
        
   
}
function fnPopupModalSales(salesId){

    $.ajax({ 
        url: "/api/sales/"+salesId,
        method: "GET", 
        dataType: "json",
        success:success,
        fail:fail
    });
    function success(data){
        
        $("#modalReceipt input").attr('disabled',true); //일단 다 비활성화
        
        $('[id^=trDetail]').collapse('hide');
        var receiptName=data.customerInfo.name;
        if(data.customerInfo.phone!="")
            receiptName+="("+data.customerInfo.phone+")";
        $("#tdReceiptName").text(receiptName);
        $("#divReceiptFee").text('￦'+$.number(data.fee,0,','));
        $("#tdPrice").text('￦'+$.number(data.price,0,','));
        $("#modalReceipt").data('discountType',data.discountType);
        if(data.discountType==1){
            $("#tdDiscount").text("-￦"+ $.number(data.price*data.discountValue*0.01,0,','));
        }else if(data.discountType==2){
            $("#tdDiscount").text("-￦"+ $.number(data.discountValue,0,','));
        }
        $("#modalReceipt").data('customerId',data.customerInfo.id);
        if(data.customerInfo.id!=-1){
            
            $("#tdPoint").text("-￦"+$.number(data.pointUse,0,','));
            $("#tdPoint").data('point',data.pointUse);
        }
        $("#tdFee").text('￦'+$.number(data.fee,0,','));

        
        $("#aReceiptDetail").off().on('click',function(){
            if($("#modalReceipt").data('discountType')!=0){
                $("#trDetailDiscount").collapse('toggle');
            }
            if($("#modalReceipt").data('customerId')!=-1){
                $("#trDetailPoint").collapse('toggle');
            }            
            $("#trDetailPrice").collapse('toggle');
            $("#trDetailFee").collapse('toggle');
        });
        $("#tdReceiptDate").text(data.date+" / "+data.time);
        $("#tdReceiptMemo").text(data.memo);
        //메모,날짜만 활성화
        //정책 : 환불, 수정등은 삭제후 재등록 
        $("#modalReceipt").modal('toggle');
        
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
        data:JSON.stringify(sales),
        dataType: "json",
        contentType:"application/json",
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
