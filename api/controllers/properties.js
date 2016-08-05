var Property = apiRequire("models/property");
var Province = apiRequire("models/province");

module.exports = {
    createProperty: createProperty,
    _createProperty: _createProperty,
    searchProperty: searchProperty,
    getProperty: getProperty
};

function createProperty(req, res, next) {
    var propertyParam = req.swagger.params.property.value;

    req.log.debug({
        property: propertyParam
    }, "Create Request");

    var pPersistedProperty = _createProperty(propertyParam);

    return pPersistedProperty.then(function (persistedProperty) {
        req.log.debug({
            provinces: persistedProperty.provinces
        }, "Create Response");

        res.send(200, {});

        return next();

    }).catch(_defaultErrorHandler(req, res, next));
}

function searchProperty(req, res, next) {
    var ax = req.swagger.params.ax.value;
    var ay = req.swagger.params.ay.value;
    var bx = req.swagger.params.bx.value;
    var by = req.swagger.params.by.value;

    req.log.debug({
        ax: ax,
        ay: ay,
        bx: bx,
        by: by
    }, "Search Request");

    var pProperties = Property.findByArea(ax, ay, bx, by).exec();

    return pProperties.then(function (properties) {
        var dtos = properties.map(_toPropertyDTO);

        req.log.debug({
            propertiesFound: dtos.length,
            properties: dtos.map(function (o) { return o.id }),
            bx: bx,
            by: by
        }, "Search Result");

        res.send({
            propertiesFound: dtos.length,
            properties: dtos
        });

        return next();

    }).catch(_defaultErrorHandler(req, res, next));
}

function getProperty(req, res, next) {
    var id = req.swagger.params.propertyId.value;

    req.log.debug({
        id: id
    }, "Get Request");

    Property.findById(id).exec().then(function (property) {
        if (property !== null) {
            var dto = _toPropertyDTO(property);

            req.log.debug({
                property: dto
            }, "Get response");

            res.send(200, dto);

            return next();

        } else {
            req.log.debug({
                property: null
            }, "Get response");

            res.send(404, {});

            return next();
        }

    }).catch(_defaultErrorHandler(req, res, next));
}

function _createProperty(property) {
    var pProvinces = Province.findByCoords(property.x, property.y).exec();

    var pProvincesNames = pProvinces.then(function (provinces) {
        return provinces.map(function (p) {
            return p.name;
        });
    });

    return pProvincesNames.then(function (provinceNames) {
        var newProperty = new Property({
            x: property.x,
            y: property.y,
            title: property.title,
            price: property.price,
            description: property.description,
            beds: property.beds,
            baths: property.baths,
            squareMeters: property.squareMeters,
            provinces: provinceNames
        });

        return newProperty.save();
    });
}

function _toPropertyDTO(property) {
    return {
        id: property._id,
        x: property.x,
        y: property.y,
        title: property.title,
        price: property.price,
        description: property.description,
        beds: property.beds,
        baths: property.baths,
        squareMeters: property.squareMeters,
        provinces: property.provinces
    }
}

function _defaultErrorHandler(req, res, next) {
    return function (err) {
        res.send(500, {
            status: 500,
            message: err
        });

        req.log.error(err);

        return next(err);
    }
}