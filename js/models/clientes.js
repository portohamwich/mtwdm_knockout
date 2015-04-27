//Modelos
function clientesView(_idcliente, _cliente, _direccion, _contacto) {
    return {
        idcliente : ko.observable(_idcliente),
        cliente: ko.observable(_cliente),
        direccion: ko.observable(_direccion),
        contacto: ko.observable(_contacto)
    }
}

var viewModelClientes = {
    loading: ko.observable(""),
    filter: ko.observable(""),
    clientes: ko.observableArray([]),
    cliente: {
        nombre: ko.observable(""),
        direccion: ko.observable(""),
        contacto: ko.observable("")
    },
    selectedCliente: ko.observable(null),
    showList: ko.observable(true),
    getClientes: function(){
        viewModelClientes.loading(true);
        viewModelClientes.clientes([]);
        $.getJSON(baseUrl + "getClientes", function(data){
            $.each(data, function(i, item){
                var c = new clientesView(item.idcliente, item.cliente, item.direccion, item.contacto);
                viewModelClientes.clientes.push(c);
            });
            viewModelClientes.loading(false);
        });
    },
    filteredClientes: function() {
        var _filter = this.filter();
        var _clientes = this.clientes();
        if(!_filter) {
            return this.clientes();
        } else {
            var arr = [];
            $.each(_clientes, function(key, obj){
                if(stringStartsWith(obj.cliente().toLowerCase(),_filter.toLowerCase())) {
                    arr.push(obj);
                }
            });

            return arr;
        }
    },
    saveCliente: function() {
        var data = {
            cliente: this.cliente.nombre(),
            direccion: this.cliente.direccion(),
            contacto: this.cliente.contacto()
        };

        var url = baseUrl + "createCliente";

        if(viewModelClientes.selectedCliente()) {
            url = baseUrl + "updateCliente";
            data.idcliente = viewModelClientes.selectedCliente();
        }

        $.ajax({
            type: "POST",
            url: url,
            data: data,
            dataType: "json"
        }).always(function(val){
            viewModelClientes.hideNew();
            viewModelClientes.getClientes();
        });
    },
    getCliente: function(item) {
        viewModelClientes.loading(true);
        viewModelClientes.selectedCliente(item.idcliente());

        $.getJSON(baseUrl + "getCliente/" + item.idcliente(), function(data){
            viewModelClientes.cliente.nombre(data[0].cliente);
            viewModelClientes.cliente.direccion(data[0].direccion);
            viewModelClientes.cliente.contacto(data[0].contacto);

            viewModelClientes.showNew();
            viewModelClientes.loading(false);
        });
    },
    deleteCliente: function(item) {
        viewModelClientes.loading(true);
        var data = { idcliente: item.idcliente() };

        $.ajax({
            type: "POST",
            url: baseUrl + "deleteCliente",
            data: data,
            dataType: "json"

        }).always(function(){
            viewModelClientes.hideNew();
            viewModelClientes.getClientes();
        });
    },
    showNew: function() {
        viewModelClientes.showList(false);
    },
    hideNew: function() {
        viewModelClientes.cliente.nombre("");
        viewModelClientes.cliente.direccion("");
        viewModelClientes.cliente.contacto("");
        viewModelClientes.selectedCliente(false);

        viewModelClientes.showList(true);
    }
};