const mongoose = require('mongoose');

const model = mongoose.Schema({
    x: {
        type: Number,
        required: true
    },
    y: {
        type: Number,
        required: true
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    price: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    beds: {
        type: Number,
        required: true
    },
    baths: {
        type: Number,
        required: true
    },
    provinces: {
        type: [String]
    },
    squareMeters: {
        type: Number,
        required: true
    }
}, {
    timestamps: true
});

model.statics.findByArea = function (x0, y0, x1, y1) {
    return this.find({
        $and: [
            { $and: [ { x: { $gte: x0 } }, { x: { $lte: x1 } } ] },
            { $and: [ { y: { $gte: y0 } }, { y: { $lte: y1 } } ] }
        ]
    });
};

module.exports = mongoose.model('Property', model);