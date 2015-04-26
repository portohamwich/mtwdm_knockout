getPartial();

$(window).on('hashchange',function(){
    getPartial();
});

function getPartial() {
    var hash = window.location.hash;

    switch(hash) {
        case '#usuarios':
            $('#content').load('partials/usuarios.html');
            break;

        case '#clientes':
            $('#content').load('partials/clientes.html');
            break;
    }
}