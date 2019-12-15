var mongoose = require('mongoose');

var validator = require('validator');

var User = mongoose.model("User", {
    email: {
        type: String,
        required: true,
        minlength: 1,
        trim: true,
        validate: {
            validator: (value) => {
                return validator.isEmail(value)
            },
            message: '{VALUE} این ایمیل معتبر نیست'
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    token: [{
        access: {
            type: String,
            required: true
        },
        token: {
            type: String,
            required: true
        }
    }
    ]
});

module.exports = { User };