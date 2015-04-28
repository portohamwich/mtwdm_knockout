//Modelos
function insumosView(_idinsumo, _insumo, _precio, _existencia) {
    return {
        idinsumo : ko.observable(_idinsumo),
        insumo: ko.observable(_insumo),
        precio: ko.observable(_precio),
        existencia: ko.observable(_existencia)
    }
}

var viewModelInsumos = {
    loading: ko.observable(false),
    filter: ko.observable(""),
    insumos: ko.observableArray([]),
    insumo: {
        insumo: ko.observable(""),
        precio: ko.observable(""),
        existencia: ko.observable("")
    },
    selectedInsumo: ko.observable(null),
    showList: ko.observable(true),
    getInsumos: function () {
        viewModelInsumos.loading(true);
        viewModelInsumos.insumos([]);
        $.getJSON(baseUrl + "getInsumos", function (data) {
            $.each(data, function (i, item) {
                var c = new insumosView(item.idinsumo, item.insumo, item.precio, item.existencia);
                viewModelInsumos.insumos.push(c);
            });
            viewModelInsumos.loading(false);
        });
    },
    filteredInsumos: function () {
        var _filter = this.filter();
        var _insumos = this.insumos();
        if (!_filter) {
            return this.insumos();
        } else {
            var arr = [];
            $.each(_insumos, function (key, obj) {
                if (stringStartsWith(obj.insumo().toLowerCase(), _filter.toLowerCase())) {
                    arr.push(obj);
                }
            });

            return arr;
        }
    },
    saveInsumo: function() {
        var data = {
            insumo: this.insumo.insumo(),
            precio: this.insumo.precio(),
            existencia: this.insumo.existencia()
        };

        var url = baseUrl + "createInsumo";


        $.ajax({
            type: "POST",
            url: url,
            data: data,
            dataType: "json"
        }).always(function(val){
            viewModelInsumos.hideNew();
            viewModelInsumos.getInsumos();
        });
    },
    showNew: function() {
        viewModelInsumos.showList(false);
    },
    hideNew: function() {
        viewModelInsumos.insumo.insumo("");
        viewModelInsumos.insumo.precio("");
        viewModelInsumos.insumo.existencia("");

        viewModelInsumos.showList(true);
    }
};