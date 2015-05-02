/**
 * Created by porto on 25/04/15.
 */

var baseUrl = "http://produccionapi.azurewebsites.net/";


//Añadida porque ko no la traia, jaja
var stringStartsWith = function (string, startsWith) {
    string = string || "";
    if (startsWith.length > string.length)
        return false;
    return string.substring(0, startsWith.length) === startsWith;
};

//Center element on screen
jQuery.fn.center = function () {
    this.css("position","absolute");
    this.css("top", Math.max(0, (($(window).height() - $(this).outerHeight()) / 2) +
        $(window).scrollTop()) + "px");
    this.css("left", Math.max(0, (($(window).width() - $(this).outerWidth()) / 2) +
        $(window).scrollLeft()) + "px");
    return this;
};

getCantidadCompras = function(){
    $.getJSON(baseUrl + "getCompras/0", function(data){
       $('#cantidadPorPagar').html(data.length);
    });
};