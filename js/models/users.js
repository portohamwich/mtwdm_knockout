//Modelos
function usersView(_usuarioid, _usuario, _email, _tipo) {
    return {
        usuarioid: ko.observable(_usuarioid),
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
        viewModelUsers.users = ko.observableArray([]);
        $.getJSON("mocks/users.json", function(data){
            $.each(data, function(i, item){
                var u = new usersView(item.usuarioId, item.usuario, item.email, item.tipousuario);
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

        url ="";

        $.ajax({
            type: "POST",
            url: url,
            data: data,
            success: this.hideNew,
            dataType: "json"
        });
    },
    editUser: function(item) {
        console.log(item.usuarioid());
    }
};


