const db = require("./conexion");

class Geo_model {

    constructor() {
        this.db = db;
    }

    async get_distrito(lat, lng) {

        try {

            const result = await this.db.query(`SELECT  num_dist, nombre_dis  FROM gestion_vocacion_ppdu_2012.ppdu_distritos where ST_Intersects(geom,
                ST_Transform(ST_GeomFromText('POINT(${lng} ${lat})',4326),32613)) group by gid;`);

            return result[0].nombre_dis;

        } catch (error) {
            return false;
        }

    }

    async get_colonia(lat, lng) {

        try {

            const result = await this.db.query(`SELECT  nombre
            FROM gestion_ordenamiento_territorial.colonias_ciudapp where ST_Intersects(geom,
                    ST_Transform(ST_GeomFromText('POINT(${lng} ${lat})',4326),32613));`);

            return result[0].nombre;

        } catch (error) {
            return false;
        }

    }

    async get_zona(lat, lng) {

        try {

            const result = await this.db.query(`SELECT  zona  FROM cc_analisis.zonas_cc where ST_Intersects(geom,
                ST_Transform(ST_GeomFromText('POINT(${lng} ${lat})',4326),32613)) group by gid;`);

            return result[0].zona;

        } catch (error) {
            return false;
        }

    }

}

module.exports = new Geo_model();