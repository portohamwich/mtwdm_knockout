//Modelos
function productosView(_idproducto, _producto, _precio, _existencia) {
    return {
        idproducto : ko.observable(_idproducto),
        producto: ko.observable(_producto),
        precio: ko.observable(_precio),
        existencia: ko.observable(_existencia)
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
    cantidadInsumo: ko.observable(""),
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
                var c = new productosView(item.idproducto, item.producto, item.precio, item.existencia);
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
            producto: this.producto.nombre(),
            precio: this.producto.precio(),
            existencia: 5
        };

        var url = baseUrl + "createProducto";

        if(viewModelProductos.selectedProducto.id) {
            data.idproducto = viewModelProductos.selectedProducto.id;
            url = baseUrl + "updateProducto";
        }


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
    deleteProducto: function(item) {
      var data = { idproducto: item.idproducto() };

        $.ajax({
            type: "POST",
            url: baseUrl + "deleteProducto",
            data: data,
            dataType: "json"
        }).always(function(val){
            viewModelProductos.hideNew();
            viewModelProductos.getProductos();
        });
    },
    getProducto: function(item) {
        viewModelProductos.loading(true);
        viewModelProductos.selectedProducto.id(item.idproducto());

        $.getJSON(baseUrl + "getProducto/" + item.idproducto(), function (data) {
            viewModelProductos.producto.nombre(data[0].producto);
            viewModelProductos.producto.precio(data[0].precio);
            viewModelProductos.loading(false);
            viewModelProductos.showNew();
        });
    },
    getInsumos: function(item) {
        viewModelProductos.loading(true);
        viewModelProductos.selectedProducto.nombre(item.producto());
        viewModelProductos.selectedProducto.id(item.idproducto());
        viewModelProductos.vistaDetalles(true);

        viewModelProductos.insumos([]);
        $.getJSON(baseUrl + "getProductoInsumo/" + item.idproducto(), function (data) {
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
            IdProducto: viewModelProductos.selectedProducto.id(),
            IdInsumo: viewModelProductos.insumoSelectValue(),
            Cantidad: viewModelProductos.cantidadInsumo()
        };


        $.ajax({
            type: "POST",
            url: baseUrl + "createProductoInsumo",
            data: data,
            dataType: "json"
        }).always(function(val){
            var a = {
                producto: viewModelProductos.selectedProducto.nombre,
                idproducto: viewModelProductos.selectedProducto.id
            };
            viewModelProductos.getInsumos(a);
        });

    },
    deleteInsumo: function(item) {
        var data = {
          Id: item.id
        };

        $.ajax({
            type: "POST",
            url: baseUrl + "deleteProductoInsumo",
            data: data,
            dataType: "json"
        }).always(function(val){
            var a = {
                producto: viewModelProductos.selectedProducto.nombre,
                idproducto: viewModelProductos.selectedProducto.id
            };
            viewModelProductos.getInsumos(a);
        });
    },
    showNew: function() {
        viewModelProductos.showList(false);
    },
    hideNew: function() {
        viewModelProductos.selectedProducto.id(null);
        viewModelProductos.selectedProducto.nombre(null);
        viewModelProductos.producto.nombre("");
        viewModelProductos.producto.precio("");

        viewModelProductos.showList(true);
    }
};