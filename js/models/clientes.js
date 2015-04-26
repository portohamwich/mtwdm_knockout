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
    filter: ko.observable(""),
    clientes: ko.observableArray([]),
    getClientes: function(){
        viewModelClientes.clientes = ko.observableArray([]);
        $.getJSON("mocks/clientes.json", function(data){
            $.each(data, function(i, item){
                var c = new clientesView(item.idcliente, item.cliente, item.direccion, item.contacto);
                viewModelClientes.clientes.push(c);
            });
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
    }
};