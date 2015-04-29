//Modelos
function productosView(_idproducto, _producto, _precio) {
    return {
        idproducto : ko.observable(_idproducto),
        producto: ko.observable(_producto),
        precio: ko.observable(_precio)
    }
}

function productosInsumosView(_id, _idinsumo, _idproducto, insumo) {
    return {
        id: ko.observable(_id),
        idinsumo: ko.observable(_idinsumo),
        idproducto: ko.observable(_idproducto),
        insumo: insumo
    }
}

var viewModelProductos = {
    loading: ko.observable(false),
    filter: ko.observable(""),
    productos: ko.observableArray([]),
    allInsumos: ko.observableArray([]),
    insumoSelectValue: ko.observable(""),
    insumos: ko.observableArray([]),
    producto: {
        nombre: ko.observable(""),
        precio: ko.observable("")
    },
    selectedProducto: { id: ko.observable(null), nombre: ko.observable(null) },
    showList: ko.observable(true),
    vistaDetalles: ko.observable(false),
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
    getAllInsumos: function() {
        if(!viewModelProductos.allInsumos().length) {
            $.getJSON(baseUrl + "getInsumos", function (data) {
                $.each(data, function (i, item) {
                    var insumo = { id: item.idinsumo, insumo: item.insumo };
                    viewModelProductos.allInsumos.push(insumo);
                });
                viewModelProductos.loading(false);
            });
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
    getProducto: function(item) {
        viewModelProductos.loading(true);
        viewModelProductos.selectedProducto(item.idproducto());
        console.log(item);

        $.getJSON(baseUrl + "getProducto/" + item.idproducto(), function (data) {
            console.log(data);
            viewModelProductos.loading(false);
        });
    },
    getInsumos: function(item) {
        viewModelProductos.loading(true);
        viewModelProductos.selectedProducto.nombre(item.producto());
        viewModelProductos.selectedProducto.id(item.idproducto());
        viewModelProductos.vistaDetalles(true);

        $.getJSON(baseUrl + "getProductoInsumos/" + item.idproducto(), function (data) {
            $.each(data, function (i, item) {
                var i = new productosInsumosView(item.id, item.idinsumo, item.idproducto, item.insumo);
                viewModelProductos.insumos.push(i);
            });

            viewModelProductos.getAllInsumos();
            viewModelProductos.loading(false);
        });
    },
    addInsumo: function() {
        var data = {
            idproducto: viewModelProductos.selectedProducto.id(),
            idinsumo: viewModelProductos.insumoSelectValue()
        };

        $.ajax({
            type: "POST",
            url: baseUrl + "createProductoInsumo",
            data: data,
            dataType: "json"
        }).always(function(val){
            viewModelProductos.getInsumos(viewModelProductos.selectedProducto.id());
        });

    },
    showNew: function() {
        viewModelProductos.showList(false);
    },
    hideNew: function() {
        viewModelProductos.selectedProducto.id(null);
        viewModelProductos.selectedProducto.nombre(null);
        viewModelProductos.producto.producto("");
        viewModelProductos.producto.precio("");
        viewModelProductos.producto.existencia("");

        viewModelProductos.showList(true);
    }
};