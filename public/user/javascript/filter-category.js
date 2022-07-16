$(document).ready(()=>{
    $("#filter-women").click(()=>{
        $.post('/product-women',{
            filter:"women"
        },
        function(data, status){
            // console.log('uyuihjjhg');    
            // console.log(data);
            // window.location.reload()        
            $("#refresh-section").load(location.href+" #refresh-section");

        })
    })
    $("#filter-allProducts").click(()=>{
        $.post('/all-products', {
            filter:"allProduct"
        },
        function(data, status){
            $("#refresh-section").load(location.href+" #refresh-section")
        })
    })
})