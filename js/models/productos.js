//Modelos
function productosView(_idproducto, _producto, _precio) {
    return {
        idproducto : ko.observable(_idproducto),
        producto: ko.observable(_producto),
        precio: ko.observable(_precio)
    }
}

var viewModelProductos = {
    loading: ko.observable(false),
    filter: ko.observable(""),
    productos: ko.observableArray([]),
    producto: {
        nombre: ko.observable(""),
        precio: ko.observable("")
    },
    selectedProducto: ko.observable(null),
    showList: ko.observable(true),
    getProductos: function () {
        viewModelProductos.loading(true);
        viewModelProductos.productos([]);
        $.getJSON(baseUrl + "getProductos", function (data) {
            $.each(data, function (i, item) {
                var c = new productosView(item.idproducto, item.producto, item.precio);
                viewModelProductos.productos.push(c);
            });
            viewModelProductos.loading(false);
        });
    },
    filteredProductos: function () {
        var _filter = this.filter();
        var _productos = this.productos();
        if (!_filter) {
            return this.productos();
        } else {
            var arr = [];
            $.each(_productos, function (key, obj) {
                if (stringStartsWith(obj.producto().toLowerCase(), _filter.toLowerCase())) {
                    arr.push(obj);
                }
            });

            return arr;
        }
    },
    saveProducto: function() {
        var data = {
            producto: this.producto.producto(),
            precio: this.producto.precio(),
            existencia: this.producto.existencia()
        };

        var url = baseUrl + "createProducto";


        $.ajax({
            type: "POST",
            url: url,
            data: data,
            dataType: "json"
        }).always(function(val){
            viewModelProductos.hideNew();
            viewModelProductos.getProductos();
        });
    },
    showNew: function() {
        viewModelProductos.showList(false);
    },
    hideNew: function() {
        viewModelProductos.producto.producto("");
        viewModelProductos.producto.precio("");
        viewModelProductos.producto.existencia("");

        viewModelProductos.showList(true);
    }
};