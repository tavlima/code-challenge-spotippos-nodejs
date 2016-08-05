// NPM modules
var fs = require('fs');
var mongoose = require('mongoose');
var Bunyan = require('bunyan');

// Local modules
var config = require('./config');
var Property = apiRequire("models/property");
var Province = apiRequire("models/province");
var Properties = apiRequire("controllers/properties");

module.exports = mongoose;

/*
 * Database
 */
mongoose.connection.on('error', function (err) {
    console.log(err);
});

mongoose.connection.on('connected', function () {
    console.log('Mongoose connection open to ' + config.env.dbURI);
});

mongoose.connection.on('disconnected', function (err) {
    console.log('Mongoose default connection disconnected');
});

mongoose.Promise = global.Promise;
// mongoose.set('debug', true);

mongoose.connect(config.env.dbURI);


// Database initialization
var logger = new Bunyan({
    name: 'dbinit',
    streams: [
        {
            stream: process.stdout,
            level: 'debug'
        }
    ]
});

function _preloadDatabase() {
    var pAllProvinces = Province.find().exec();

    var pInitProvinces = pAllProvinces.then(function (provinces) {
        if (provinces.length == 0) {
            logger.debug("No province found. Pre-loading database.");
            return _preloadProvinces();
        } else {
            logger.debug("Provinces found");
        }
    }).then(function (arr) {
        if (arr) {
            logger.debug(_extractProvinceNames(arr), "Database pre-loaded with provinces.")
        }
    });

    var pAllProperties = pInitProvinces.then(function () {
        return Property.find().exec();
    });

    var pInitProperties = pAllProperties.then(function (properties) {
        if (properties.length == 0) {
            logger.debug("No property found. Pre-loading database.");
            return _preloadProperties();
        } else {
            logger.debug("Properties found");
        }
    }).then(function (arr) {
        if (arr) {
            logger.debug("Database pre-loaded with properties.")
        }
    });

    pInitProperties.catch(function (err) {
        logger.error(err, "Error");
    });
}

function _preloadProvinces() {
    return _readJsonFileAsPromise('resources/provinces.json')
        .then(function (obj) {
            var provinces = _extractProvinces(obj);

            return Promise.all(provinces.map(function (p) { return p.save() }));
        });
}

function _preloadProperties() {
    return _readJsonFileAsPromise('resources/properties.json')
        .then(function (obj) {
            var properties = _extractProperties(obj);

            return Promise.all(properties.map(function (p) { return Properties._createProperty(p) }));
        });
}

function _readJsonFileAsPromise(fileName) {
    return new Promise(function (resolve, reject) {
        fs.readFile(fileName, 'utf8', function (err, data) {
            if (err) {
                reject(err);
            } else {
                resolve(JSON.parse(data));
            }
        });
    });
}

function _extractProvinceNames(arr) {
    return arr.map(function (p) {
        return p.name
    });
}

function _extractProvinces(obj) {
    var ret = [];

    for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
            var newProvince = {
                name: key,
                boundaries: {
                    x0: obj[key].boundaries.upperLeft.x,
                    y0: obj[key].boundaries.bottomRight.y,
                    x1: obj[key].boundaries.bottomRight.x,
                    y1: obj[key].boundaries.upperLeft.y
                }
            };

            ret.push(new Province(newProvince));
        }
    }

    return ret;
}

function _extractProperties(obj) {
    return obj.properties.map(function (o) {
        return {
            title: o.title,
            price: o.price,
            description: o.description,
            x: o.lat,
            y: o.long,
            beds: o.beds,
            baths: o.baths,
            squareMeters: o.squareMeters
        }
    });
}

_preloadDatabase();