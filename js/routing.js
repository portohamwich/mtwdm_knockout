getPartial();

$(window).on('hashchange',function(){
    getPartial();
});

function getPartial() {
    var hash = window.location.hash;

    switch(hash) {
        case '#usuarios': $('#content').load('partials/usuarios.html'); break;
        case '#clientes': $('#content').load('partials/clientes.html'); break;
        case '#proveedores': $('#content').load('partials/proveedores.html'); break;
        case '#insumos': $('#content').load('partials/insumos.html'); break;
        case '#productos': $('#content').load('partials/productos.html'); break;
        case '#compras': $('#content').load('partials/compras.html'); break;
        case '#ventas': $('#content').load('partials/ventas.html'); break;
    }
}