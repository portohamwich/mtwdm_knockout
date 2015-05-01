function compraView(idinsumo, idproveedor, cantidad, precio, total, fecha, pagado, insumo, proveedor) {
    return {
        idinsumo: ko.observable(idinsumo),
        idproveedor: ko.observable(idproveedor),
        cantidad: ko.observable(cantidad),
        precio: ko.observable(precio),
        total: ko.observable(total),
        fecha: ko.observable(fecha),
        pagado: ko.observable(pagado),
        insumo: ko.observable(insumo),
        proveedor: ko.observable(proveedor)
    }
}

function proveedoresView(_idproveedor, _proveedor, _direccion, _contacto) {
    return {
        idproveedor : ko.observable(_idproveedor),
        proveedor: ko.observable(_proveedor),
        direccion: ko.observable(_direccion),
        contacto: ko.observable(_contacto)
    }
}

function insumosView(_idinsumo, _insumo, _precio, _existencia) {
    return {
        idinsumo : ko.observable(_idinsumo),
        insumo: ko.observable(_insumo),
        precio: ko.observable(_precio),
        existencia: ko.observable(_existencia)
    }
}

viewModelCompras = {
    loading: ko.observable(false),
    compras: ko.observableArray([]),
    pagadas: ko.observable(false),
    showList: ko.observable(true),
    proveedores: ko.observableArray([]),
    proveedorSelectValue: ko.observable(""),
    insumos: ko.observableArray([]),
    insumoSelectValue: ko.observable(""),
    insumoObj: {
        cantidad: ko.observable(""),
        fecha: ko.observable(""),
        precio: ko.observable(""),
        total: ko.observable("")
    },
    getCompras: function(tipo){
        viewModelCompras.loading(true);
        viewModelCompras.compras([]);
        $.getJSON(baseUrl + "getCompras/"+tipo, function(data){
            $.each(data, function(i, item){
               var compra = new compraView(item.idinsumo, item.idproveedor, item.cantidad, item.precio, item.total,
                                           item.fecha, item.pagado, item.insumo, item.proveedor);
               viewModelCompras.compras.push(compra);
            });

            viewModelCompras.loading(false);
        });
    },
    getPagadas: function() {
        viewModelCompras.getCompras(1);
        viewModelCompras.pagadas(true);
    },
    getPorPagar: function() {
        viewModelCompras.getCompras(0);
        viewModelCompras.pagadas(false);
    },
    showNew: function() {
        viewModelCompras.showList(false);
    },
    hideNew: function() {
        viewModelCompras.showList(true);
    },
    getProveedores: function(){
        viewModelCompras.loading(true);
        viewModelCompras.proveedores([]);
        $.getJSON(baseUrl + "getProveedores", function(data){
            $.each(data, function(i, item){
                var c = new proveedoresView(item.idProveedor, item.proveedor, item.direccion, item.contacto);
                viewModelCompras.proveedores.push(c);
            });
            viewModelCompras.loading(false);
        });
    },
    getInsumos: function () {
        viewModelCompras.loading(true);
        viewModelCompras.insumos([]);
        $.getJSON(baseUrl + "getInsumos", function (data) {
            $.each(data, function (i, item) {
                var c = new insumosView(item.idinsumo, item.insumo, item.precio, item.existencia);
                viewModelCompras.insumos.push(c);
            });
            viewModelCompras.loading(false);
        });
    },
    saveCompra: function() {
        var data = {
            idproveedor: ""+viewModelCompras.proveedorSelectValue(),
            idinsumo: ""+viewModelCompras.insumoSelectValue(),
            total: ""+viewModelCompras.insumoObj.total(),
            fecha: ""+viewModelCompras.insumoObj.fecha(),
            cantidad: ""+viewModelCompras.insumoObj.cantidad(),
            pagado: "0",
            precio: ""+viewModelCompras.insumoObj.precio()
        };

        socket.emit("COMPRA_REGISTRADA_EVENT");

        $.ajax({
            type: "POST",
            url: baseUrl + "createCompra",
            data: data,
            dataType: "json"
        }).always(function(val){
            viewModelCompras.getPorPagar();
            viewModelCompras.hideNew();
        });
    }
};
