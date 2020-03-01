$(document).ready(function(){

    var _url = "https://my-json-server.typicode.com/yaelahnong/pwaapi/products"

    var dataResults = ''
    var catResults = ''
    var categories = []

    function renderPage(data){
        // loop
        $.each(data, function(key, items){
            
            _cat = items.category
            
            dataResults += "<div>"
            + "<h3>" + items.name + "</h3>"
            + "<p>" + _cat + "</p>"
            "<div>";
            // mengambil array unique
            if($.inArray(_cat, categories) == -1){
                categories.push(_cat)
                catResults += "<option value'"+ _cat + "'>" + _cat + "</option>"
            }
        })
        
        // render html
        // mengakses dari #products
        $('#products').html(dataResults)
        // supaya tetap ada opsi semua
        $('#cat_select').html("<option value='all'>semua</option>" + catResults)
    }

    // apakah api sudah di akses dari internet atau belum
    var networkDataReceived = false
    
    // FRESH DATA FROM ONLINE
    
                        // fetch dari url awal, kalau berhasil ...
    var networkUpdate = fetch(_url).then(function(response){
        return response.json()
    }).then(function(data){
        networkDataReceived = true
        renderPage(data)
    })

    // return data from cache
    caches.match(_url).then(function(response){
        if(!response) throw Error('no data on cache')
        return response.json()
    }).then(function(data){
        if(!networkDataReceived) {
            renderPage(data)
            console.log('render data from cache')
        }
    }).catch(function(){
        return networkUpdate
    })
        
        //Fungsi Filter
    $("#cat_select").on('change', function(){
        updateProduct($(this).val())
    })

    function updateProduct(cat){

        var dataResults = ''
        var _newUrl = _url

        // ketika kategori yang di pilih bukan all
        if(cat != 'all')
            // mengganti url dengan category yang dipilih
            _newUrl = _url + "?category=" + cat

            // get
            $.get(_newUrl, function(data){

            // loop
            $.each(data, function(key, items){
                
                _cat = items.category

                dataResults += "<div>"
                                    + "<h3>" + items.name + "</h3>"
                                    + "<p>" + _cat + "</p>"
                                "<div>";
                // mengambil array unique
                if($.inArray(_cat, categories) == -1){
                    categories.push(_cat)
                    catResults += "<option value'"+ _cat + "'>" + _cat + "</option>"
                }
            })

            // render html
            // mengakses dari #products
            $('#products').html(dataResults)
        })

    }
    

}) // end document ready jquery


// PWA
// CEK APAKAH SUDAH SUPPORT DI BROWSER ATAU BELUM
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() { // DI LOAD
        // KETIKA SUDAH SELESAI DI LOAD, DI REGISTER
                                        // NAMA FILE
        navigator.serviceWorker.register('/serviceworker.js').then(function(registration) { 
        // CEK APAKAH REGISTRASI BERHASIL ATAU TIDAK
        // Registration was successful
        console.log('ServiceWorker registration successful with scope: ', registration.scope);
    }, function(err) {
        // registration failed :(
        console.log('ServiceWorker registration failed: ', err);
        });
    });
}
