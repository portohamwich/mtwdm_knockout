//Modelos
function usersView(_usuarioid, _usuario, _email, _tipo) {
    return {
        idUsuarios: ko.observable(_usuarioid),
        usuario: ko.observable(_usuario),
        email: ko.observable(_email),
        tipo: ko.observable(_tipo)
    }
}

//ViewModels
var viewModelUsers = {
    //Properties
    loading: ko.observable(false),
    showList: ko.observable(true),
    showRegister: ko.observable(false),
    showform: ko.observable(false),
    filter: ko.observable(""),
    users: ko.observableArray([]),
    usermail: ko.observable(""),
    username: ko.observable(""),
    userpassword: ko.observable(""),
    usertype: ko.observable(""),
    selectedUser: ko.observable(null),
    tiposUsuario: ko.observableArray([
        { tag: "Administrador", val: 0 },
        { tag: "Simple mortal", val: 1 }
    ]),
    //Methods
    getUsers: function() {
        viewModelUsers.loading(true);
        viewModelUsers.users([]);

        setTimeout(function(){
            $.getJSON(baseUrl + "/getUsuarios", function(data){
                $.each(data, function(i, item){
                    var u = new usersView(item.idUsuarios, item.usuario, item.email, item.tipoUsuario);
                    viewModelUsers.users.push(u);
                });
                viewModelUsers.loading(false);
            });
        }, 1000);

    },
    filteredUsers: function() {
        var _filter = this.filter();
        var _users = this.users();
        if(!_filter) {
            return this.users();
        } else {
            var arr = [];
            $.each(_users, function(key, obj){
                if(stringStartsWith(obj.usuario().toLowerCase(),_filter.toLowerCase())) {
                    arr.push(obj);
                }
            });

            return arr;
        }

    },
    showNew: function() {
        viewModelUsers.selectedUser(null);

        viewModelUsers.usermail("");
        viewModelUsers.username("");
        viewModelUsers.userpassword("");
        viewModelUsers.usertype(null);

        viewModelUsers.showList(false);
        viewModelUsers.showRegister(true);
    },
    hideNew: function() {
        this.showList(true);
        this.showRegister(false);
        this.getUsers();
    },
    saveUser: function() {
        var data = {
            usuario: this.username(),
            password: this.userpassword(),
            email: this.usermail(),
            tipousuario: this.usertype()
        };
        var url = baseUrl + "createUsuario";

        if(viewModelUsers.selectedUser()) {
            url = baseUrl + "updateUsuario";
            data.idusuarios = viewModelUsers.selectedUser();
        }

        $.ajax({
            type: "POST",
            url: url,
            data: data,
            dataType: "json"

        }).always(function(val){
            var data = {
                usuario: ko.observable(viewModelUsers.username()),
                password: ko.observable(viewModelUsers.userpassword()),
                email: ko.observable(viewModelUsers.usermail()),
                tipo: ko.observable(viewModelUsers.usertype())
            };
            viewModelUsers.users.push(data);
            viewModelUsers.hideNew();
        });
    },
    editUser: function(item) {
        viewModelUsers.loading(true);
        viewModelUsers.showNew();
        viewModelUsers.selectedUser(item.idUsuarios());

        $.getJSON(baseUrl + "getUsuario/" + item.idUsuarios(), function(data){
            viewModelUsers.loading(false);
            viewModelUsers.usermail(data[0].email);
            viewModelUsers.username(data[0].usuario);
            viewModelUsers.userpassword(data[0].password);
            viewModelUsers.usertype(data[0].tipoUsuario);
        });
    },
    deleteUser: function(item) {
        var data = { idusuarios: item.idUsuarios() };

        $.ajax({
            type: "POST",
            url: baseUrl + "deleteUsuario",
            data: data,
            dataType: "json"

        }).always(function(){
            viewModelUsers.hideNew();
        });
    },
    isAdmin: function(item) {
        return item.tipo() == '0' ? true : false;
    },
    isNormal: function(item) {
        return item.tipo() == 1 ? true : false;
    }
};


