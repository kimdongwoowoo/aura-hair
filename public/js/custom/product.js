$(document).ready(function(){
    fnGetAllProductList();
});
function fnGetAllProductList(){
    $.ajax({ 
        url: "/api/product",
        method: "GET", 
        dataType: "json",
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
function fnRenderProductList(data){
    var source=$("#tbProductList-template").html();
    var renderData={
        productList:data
    }
    if ($.fn.dataTable.isDataTable('#tbProductList')){
        $('#tbProductList').dataTable().fnDestroy();
    }
    var template=Handlebars.compile(source);
    var html=template(renderData);
    $("#tbProductListBody").html(html);
    $("[id=tdbProductListPrice]").each((idx,td)=>{
        $(td).text('￦'+$.number($(td).text(),0,','));
    });
    
    $('#tbProductList').dataTable({
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
    fnEventBind();
}
function fnUpdateProduct(product){
     //PUT
     $.ajax({ 
        url: "/api/product/"+product.id,
        method: "PUT",
        data:product,
        dataType: "json",
        success:success,
        fail:fail
    });
    function success(data){
        $("#modalProduct").modal('toggle');
        fnGetAllProductList();
    }
    function fail(err){
        console.log(err);
    }
}
function fnEventBind(){
    $("#inputProductPrice").number(true,0);
    $("#btnNewProduct").off().on('click',function(){
        $("#modalProduct").attr('productId',''); //신규고객은 modal에서 id삭제
        $('.modal-body form')[0].reset(); //전체 form 리셋
        $("#modalProduct").modal('toggle');
        $("#btnDelProduct").hide();
    });
    $("#btnSaveProduct").off().on('click',function(){
       var check=fnValidCheckProduct();
       if(check){
            var product={
                class:$("#inputProductClass").val(),
                name: $("#inputProductName").val(),
                price:$("#inputProductPrice").val(),
                memo:$("#inputProductMemo").val()
            }

            if($("#modalProduct").attr('productId')){
                product['id']=$("#modalProduct").attr('productId');
                fnUpdateProduct(product);
            }else{
                fnSaveNewProduct(product);
            }
           
       }
    });

    $("#btnSearchProduct").off().on('click',function(){
        var keyword=$("#inputSearchProduct").val();
        if(!keyword){
            fnGetAllProductList();
        }else{
            fnSearchProduct(keyword);
        }
    });

    //header, footer를 제외, productId를 포함한 row
    $("tr[productId]").off().on('dblclick',function(){
        $("#btnDelProduct").show();
        var id=$(this).attr('productId');
        fnPopupModalProduct(id);
    });
    $("#btnDelProduct").off().on('click',function(){
        var res=confirm('삭제하시겠습니까?');
        if(res){
            fnDeleteProduct($("#modalProduct").attr('productId'));
        }
    });

}
function fnDeleteProduct(productId){
    $.ajax({ 
        url: "/api/product/"+productId,
        method: "DELETE",   
        success:success,
        fail:fail
    });
    function success(data){
        alert('삭제되었습니다.');
        $("#modalProduct").modal('toggle');
        fnGetAllProductList();
        
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
        fnRenderProductList(data)
    }
    function fail(err){
        console.log(err);
    }
}
function fnPopupModalProduct(productId){
    $("#modalProduct").attr('productId',productId);
    $.ajax({ 
        url: "/api/product/"+productId,
        method: "GET", 
        dataType: "json",
        success:success,
        fail:fail
    });
    function success(data){
        //console.log(data);
        $("#inputProductClass").val(data.class);
        $("#inputProductName").val(data.name);
        $("#inputProductPrice").val(data.price);
        $("#inputProductMemo").val(data.memo);
        
        $("#modalProduct").modal('toggle');
    }
    function fail(err){
        console.log(err);
    }

    


}
//저장후 렌더링함수 호출
function fnSaveNewProduct(product){
    //POST
    $.ajax({ 
        url: "/api/product",
        method: "POST",
        data:product,
        dataType: "json",
        success:success,
        fail:fail
    });
    function success(data){
        $("#modalProduct").modal('toggle');
        fnGetAllProductList();
    }
    function fail(err){
        console.log(err);
    }
    
}
function fnValidCheckProduct(){
    
    //check 로직 추가
    return true;
}
