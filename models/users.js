var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt');

var UserSchema = new Schema({
	username: {
		type: String,
		required: true
	},
	email: {
		type: String,
		required: true
	}
	passwordDigest: {
		type: String,
		required: true
	},
	createdAt: {
		type: Date,
		default: Date.now
	},
	playlists: []
})