/**
 * Created by porto on 25/04/15.
 */

var baseUrl = "http://apirest.dyndns.org/ApiRest/";


//Añadida porque ko no la traia, jaja
var stringStartsWith = function (string, startsWith) {
    string = string || "";
    if (startsWith.length > string.length)
        return false;
    return string.substring(0, startsWith.length) === startsWith;
};