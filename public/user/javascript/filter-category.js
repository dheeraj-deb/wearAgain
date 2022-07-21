$(document).ready(()=>{
    $("#filter-women").on("click", ()=>{
        $.ajax({
            url:"/filter-category",
            data:{filter:"women's"},
            type:"POST",
            success:(data)=>{
                $("#refresh-section").load(location.href+" #refresh-section");
            }
        })
    }),
    $("#filter-allProducts").on("click", ()=>{
        $.ajax({
            url:'/all-products',
            type:'POST',
            success:(data)=>{
                $("#refresh-section").load(location.href+" #refresh-section");
            }
        })
    }),
    $("#filter-men").on("click", ()=>{
        $.ajax({
            url:"/filter-category",
            data:{filter:"men's"},
            type:"POST",
            success:(data)=>{
                $("#refresh-section").load(location.href+" #refresh-section");
            }
        })
    }),
    $("#filter-kids").on("click", ()=>{
        $.ajax({
            url:"/filter-category",
            data:{filter:"kids"},
            type:"POST",
            success:(data)=>{
                $("#refresh-section").load(location.href+" #refresh-section");
            }
        })
    })
    
})

