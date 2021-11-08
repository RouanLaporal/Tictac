var mongoose = require('mongoose');
var Schema = mongoose.Schema

var UserSchema = new Schema({
    mail: {type: String, required: true, unique: true},
    rateLimit: {type: Number, required: true }
});


module.exports = mongoose.model('User', UserSchema);