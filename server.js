const express = require('express');
const app = express();
const cors = require('cors');
const GoogleMapsAPI = require('googlemaps');
const StaticMaps = require('staticmaps');
require('dotenv').config();

// Parsing json
app.use(express.json());

// Access public
app.use('/public', express.static(__dirname + '/public'));

// Modules
const geo = require("./controller");

// Listen
/*
app.listen(port, () => {
    console.log(`Server running on port ${port}`)
});
*/

app.listen(process.env.PORT, () => {

    const port = process.env.PORT;

    console.log(`Server running on port ${port}...`);
});

// Maps params
var publicConfig = {
    key: 'AIzaSyAtfhwmbXKUqtX9oeYB1gH7nWY5_JhcmJg',
    encode_polylines: false,
    secure: true, // use https
};

var gmAPI = new GoogleMapsAPI(publicConfig);

app.get('/api/distrito/:lat&:lng', async (req, res) => {

    const {
        lat,
        lng
    } = req.params;

    if (await geo.get_distrito(lat, lng)) {
        res.status(200).json({
            status: 200,
            msg: await geo.get_distrito(lat, lng)
        });
    } else {
        res.status(500).json({
            status: 500,
            error: 'Error al intentar obtener el distrito'
        })
    }
});


app.get('/api/colonia/:lat&:lng', async (req, res) => {


    const {
        lat,
        lng
    } = req.params;

    if (await geo.get_colonia(lat, lng)) {
        res.status(200).json({
            status: 200,
            msg: await geo.get_colonia(lat, lng)
        });
    } else {
        res.status(500).json({
            status: 500,
            error: 'Error al intentar obtener la colonia'
        })
    }
});

app.get('/api/zona/:lat&:lng', async (req, res) => {


    const {
        lat,
        lng
    } = req.params;

    if (await geo.get_zona(lat, lng)) {
        res.status(200).json({
            status: 200,
            msg: await geo.get_zona(lat, lng)
        });
    } else {
        res.status(500).json({
            status: 500,
            error: 'Error al intentar obtener la zona'
        })
    }
});

app.get('/api/geocodeAddress/:ubicacion', (req, res) => {


    let ubicacion = req.params.ubicacion;
    let filename = Date.now();

    //Verifica si no utilizó el autocompletado
    if (!ubicacion.includes('México')) {
        ubicacion = `${ubicacion}, Zapopan, Jal., México`;
    }

    // geocode API
    var geocodeParams = {
        address: ubicacion,
        components: `components=country:MX`,
        language: "es",
        region: "mx"
    };

    gmAPI.geocode(geocodeParams, async (err, result) => {

        let {
            lat,
            lng
        } = result.results[0].geometry.location;
        let ubicacion = result.results[0].formatted_address;
        let calle = result.results[0].formatted_address.split(',')[0].replace(/[0-9]/g, '').trim();

        // Maps statics 
        const options = {
            width: 600,
            height: 400
        };

        const map = new StaticMaps(options);

        const circle = {
            coord: [lng, lat],
            radius: 10,
            fill: '#963EFF',
            width: 0,
        };

        map.addCircle(circle);
        await map.render();
        await map.image.save(`public/${filename}.png`);

        res.status(200).json({
            status: 200,
            results: {
                lat: lat,
                lng: lng,
                ubicacion: ubicacion,
                calle: calle,
                Map: filename
            }
        });

    });

});