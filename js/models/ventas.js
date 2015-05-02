function clientesView(_idcliente, _cliente, _direccion, _contacto) {
    return {
        idcliente : ko.observable(_idcliente),
        cliente: ko.observable(_cliente),
        direccion: ko.observable(_direccion),
        contacto: ko.observable(_contacto)
    }
}

function productosView(_idproducto, _producto, _precio, _existencia) {
    return {
        idproducto : ko.observable(_idproducto),
        producto: ko.observable(_producto),
        precio: ko.observable(_precio),
        existencia: ko.observable(_existencia)
    }
}

viewModelVentas = {
    loading: ko.observable(false),
    clientes: ko.observableArray([]),
    productos: ko.observableArray([]),
    showList: ko.observable(true),
    productosSelectValue: ko.observable(""),
    clientesSelectValue: ko.observable(""),
    venta: {
        nopedido: ko.observable(""),
        cantidad: ko.observable(""),
        nolote: ko.observable(""),
        precio: ko.observable(""),
        total: ko.observable(""),
        fecha: ko.observable("")
    },
    getClientes: function() {
        viewModelVentas.loading(true);
        viewModelVentas.clientes([]);
        $.getJSON(baseUrl + "getClientes", function(data){
            $.each(data, function(i, item){
                var c = new clientesView(item.idcliente, item.cliente, item.direccion, item.contacto);
                viewModelVentas.clientes.push(c);
            });
            viewModelVentas.loading(false);
        });
    },
    getProductos: function () {
        viewModelVentas.loading(true);
        viewModelVentas.productos([]);
        $.getJSON(baseUrl + "getProductos", function (data) {
            $.each(data, function (i, item) {
                var c = new productosView(item.idproducto, item.producto, item.precio, item.existencia);
                viewModelVentas.productos.push(c);
            });
            viewModelVentas.loading(false);
        });
    },
    showNew: function() {
        viewModelVentas.showList(false);
    },
    hideNew: function() {
        viewModelVentas.showList(true);
    },
    saveVenta: function() {
        var data = {
            idproducto: viewModelVentas.productosSelectValue(),
            idcliente: viewModelVentas.clientesSelectValue(),
            idusuario: 1,
            nopedido: viewModelVentas.venta.nopedido(),
            cantidad: viewModelVentas.venta.cantidad(),
            nolote: viewModelVentas.venta.nolote(),
            precio: viewModelVentas.venta.precio(),
            total: viewModelVentas.venta.total(),
            fecha: viewModelVentas.venta.fecha()
        };

        $.ajax({
            type: "POST",
            url: baseUrl + "createVenta",
            data: data,
            dataType: "json"
        }).always(function(val){
            viewModelVentas.hideNew();
        });
    }
};