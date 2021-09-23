const geo_model = require("./model");

class Geo {

    get_distrito(lat, lng) {
        return geo_model.get_distrito(lat, lng);
    }

    get_colonia(lat, lng) {
        return geo_model.get_colonia(lat, lng);
    }

    get_zona(lat, lng) {
        return geo_model.get_zona(lat, lng);
    }

}


module.exports = new Geo();