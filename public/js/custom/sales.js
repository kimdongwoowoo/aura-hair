

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
async function fnRenderSalesList(data){
    var source=$("#tbSalesList-template").html();


    var salesList=[];
    for(var i=0;i<data.length;++i){

        var sales={
            id:data[i].id
        };
        if(data[i].customerId==-1){
            sales.customerName="비회원";
            sales.phone="";
        }else{
            await $.ajax({ 
                url: "/api/customer/"+data[i].customerId,
                method: "GET", 
                dataType:"json",
                success:function(data){
                    sales.customerName=data.name;
                    sales.phone=data.phone;
                },
                fail:function(err){
                    console.log(err);
                }
            });
        }
        sales.fee=data[i].fee;
        sales.date=data[i].date;
        salesList.push(sales);
    }
    var renderData={
        "salesList":salesList
    }
    var template=Handlebars.compile(source);
    var html=template(renderData);
    $("#tbSalesListBody").html(html);
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
function fnModalEventBind(){
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
    //제품관련
    $("#formSelectProduct [id^=radio]").off().on('click',function(){
        if($(this).attr('id')=="radioProduct"){
            $("#divProductSearch").collapse('show');
            $("#inputPrice").attr('readonly',true);
        }else if($(this).attr('id')=="radioSelfPrice"){
            $("#divProductSearch").collapse('hide');
            $("#inputPrice").attr('readonly',false);
            //$("inputPrice").val('0');
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
    $("#inputPrice,#inputDiscount,#inputPointUse").on('input', function() {
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
    fnMakeSales();
}
function fnMakeSales(){
    var sale={
        customerId:-1,
        productId:-1,
        price:0,
        discountType:0,
        discountValue:0,
        pointUse:0,
        fee:0,
        date:0,
        memo:""        
    };
    const customerTypeRadio=$("#formSelectUser [id^=radio]:checked").attr('id');
    if(customerTypeRadio=="radioUser"){
        sale.customerId=$("#selectCustomerList option:checked").data('customerid');
    }
    const productType=$("#formSelectProduct [id^=radio]:checked").attr('id');
    if(productType=="radioProduct"){
        sale.productId=$("#selectProductList option:checked").data('productid');
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
    //DatePicker 추가
    sale.memo=$("#inputSalesMemo").val();
    fnSaveNewSales(sale);
    
}
function fnInitModalForm(){
    $('.modal-body form')[0].reset(); //전체 form 리셋
    $("#radioNoneUser").click();
    $("#radioNoneDiscount").click();
    $("#radioSelfPrice").click();
}
function fnEventBind(){
    $("#btnNewSales").off().on('click',function(){
        $("#modalSales").attr('salesId',''); //신규등록은 modal에서 id삭제
        
        fnModalEventBind(); //modal 이벤트바인드
        
        $("#modalSales").modal('toggle');
        
    });
    //header, footer를 제외, salesId를 포함한 row
    $("tr[salesId]").off().on('dblclick',function(){
        var id=$(this).attr('salesId');
        fnPopupModalSales(id);
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
            'GOLD':15,
            'VIP':20
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
function fnPopupModalSales(salesId){
    $("#modalReceipt").attr('salesId',salesId);
    
    $.ajax({ 
        url: "/api/sales/"+salesId,
        method: "GET", 
        dataType: "json",
        success:success,
        fail:fail
    });
    function success(data){
        
        $("#modalReceipt input").attr('disabled',true); //일단 다 비활성화
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
