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
    showList: ko.observable(true),
    showRegister: ko.observable(false),
    showform: ko.observable(false),
    filter: ko.observable(""),
    users: ko.observableArray([]),
    usermail: ko.observable(""),
    username: ko.observable(""),
    userpassword: ko.observable(""),
    usertype: ko.observable(""),
    tiposUsuario: ko.observableArray([
        { tag: "Administrador", val: 0 },
        { tag: "Simple mortal", val: 1 }
    ]),
    //Methods
    getUsers: function() {
        $.getJSON("http://apirest.dyndns.org/ApiRest/usuarios", function(data){
            $.each(data, function(i, item){
                var u = new usersView(item.idUsuarios, item.usuario, item.email, item.tipoUsuario);
                viewModelUsers.users.push(u);
            });
        });
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
        this.showList(false);
        this.showRegister(true);
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

        $.ajax({
            type: "POST",
            url: baseUrl + "usuarios",
            data: data,
            success: this.hideNew,
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
        console.log(item.idUsuarios());
    },
    deleteUser: function(item) {
        var data = { idUsuarios: item.idUsuarios() };

        $.ajax({
            type: "DELETE",
            url: baseUrl + "usuarios/" + item.idUsuarios(),
            data: data,
            success: viewModelUsers.successFn,
            dataType: "json"

        }).done(function(val){
            console.log('done');
        }).fail(function(){
            console.log('fail')
        });
    },
    isAdmin: function(item) {
        return item.tipo() == '0' ? true : false;
    },
    isNormal: function(item) {
        return item.tipo() == 1 ? true : false;
    },
    successFn: function(val){
        console.log('asdadsad');
        console.log(val);
    }
};


