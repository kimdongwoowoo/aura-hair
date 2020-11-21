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
    //debugger;
    var source=$("#tbProductList-template").html();
    var renderData={
        productList:data
    }
    var template=Handlebars.compile(source);
    var html=template(renderData);
    $("#tbProductList").html(html);
    
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
    $("#btnNewProduct").off().on('click',function(){
        $("#modalProduct").attr('productId',''); //신규고객은 modal에서 id삭제
        $('.modal-body form')[0].reset(); //전체 form 리셋
        $("#modalProduct").modal('toggle');
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
        var id=$(this).attr('productId');
        fnPopupModalProduct(id);
    });


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
