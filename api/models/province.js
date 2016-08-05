const mongoose = require('mongoose');

const model = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    boundaries: {
        x0: {
            type: Number,
            required: true,
            min: 0,
            max: 1400
        },
        y0: {
            type: Number,
            required: true,
            min: 0,
            max: 1000
        },
        x1: {
            type: Number,
            required: true,
            min: 0,
            max: 1400
        },
        y1: {
            type: Number,
            required: true,
            min: 0,
            max: 1000
        }
    }
}, {
    timestamps: true
});

model.statics.findByCoords = function (x, y) {
    return this.find({
        'boundaries.x0': { $lte: x },
        'boundaries.x1': { $gt: x },
        'boundaries.y0': { $lte: y },
        'boundaries.y1': { $gt: y }
    });
};

module.exports = mongoose.model('Province', model);