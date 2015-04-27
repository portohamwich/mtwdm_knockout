//Modelos
function proveedoresView(_idproveedor, _proveedor, _direccion, _contacto) {
    return {
        idproveedor : ko.observable(_idproveedor),
        proveedor: ko.observable(_proveedor),
        direccion: ko.observable(_direccion),
        contacto: ko.observable(_contacto)
    }
}

var viewModelProveedores = {
    loading: ko.observable(""),
    filter: ko.observable(""),
    proveedores: ko.observableArray([]),
    proveedor: {
        nombre: ko.observable(""),
        direccion: ko.observable(""),
        contacto: ko.observable("")
    },
    selectedProveedor: ko.observable(null),
    showList: ko.observable(true),
    getProveedores: function(){
        viewModelProveedores.loading(true);
        viewModelProveedores.proveedores([]);
        $.getJSON(baseUrl + "getProveedores", function(data){
            $.each(data, function(i, item){
                var c = new proveedoresView(item.idProveedor, item.proveedor, item.direccion, item.contacto);
                viewModelProveedores.proveedores.push(c);
            });
            viewModelProveedores.loading(false);
        });
    },
    filteredProveedores: function() {
        var _filter = this.filter();
        var _proveedores = this.proveedores();
        if(!_filter) {
            return this.proveedores();
        } else {
            var arr = [];
            $.each(_proveedores, function(key, obj){
                if(stringStartsWith(obj.proveedor().toLowerCase(),_filter.toLowerCase())) {
                    arr.push(obj);
                }
            });

            return arr;
        }
    },
    saveProveedor: function() {
        var data = {
            proveedor: this.proveedor.nombre(),
            direccion: this.proveedor.direccion(),
            contacto: this.proveedor.contacto()
        };

        var url = baseUrl + "createProveedor";

        if(viewModelProveedores.selectedProveedor()) {
            url = baseUrl + "updateProveedor";
            data.idproveedor = viewModelProveedores.selectedProveedor();
        }

        $.ajax({
            type: "POST",
            url: url,
            data: data,
            dataType: "json"
        }).always(function(val){
            viewModelProveedores.hideNew();
            viewModelProveedores.getProveedores();
        });
    },
    getProveedor: function(item) {
        console.log(item);
        viewModelProveedores.loading(true);
        viewModelProveedores.selectedProveedor(item.idproveedor());

        $.getJSON(baseUrl + "getProveedor/" + item.idproveedor(), function(data){
            viewModelProveedores.proveedor.nombre(data[0].proveedor);
            viewModelProveedores.proveedor.direccion(data[0].direccion);
            viewModelProveedores.proveedor.contacto(data[0].contacto);

            viewModelProveedores.showNew();
            viewModelProveedores.loading(false);
        });
    },
    deleteProveedor: function(item) {
        viewModelProveedores.loading(true);
        var data = { idproveedor: item.idproveedor() };

        $.ajax({
            type: "POST",
            url: baseUrl + "deleteProveedor",
            data: data,
            dataType: "json"

        }).always(function(){
            viewModelProveedores.hideNew();
            viewModelProveedores.getProveedores();
        });
    },
    showNew: function() {
        viewModelProveedores.showList(false);
    },
    hideNew: function() {
        viewModelProveedores.proveedor.nombre("");
        viewModelProveedores.proveedor.direccion("");
        viewModelProveedores.proveedor.contacto("");
        viewModelProveedores.selectedProveedor(false);

        viewModelProveedores.showList(true);
    }
};