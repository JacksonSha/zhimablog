var crypto = require('crypto');
var Buffer = require('buffer').Buffer;

//var ciphers = crypto.getCiphers();
//console.log(ciphers);
//var hashes = crypto.getHashes();
//console.log(hashes);

var config = {
	h : 'sha1',
	c : 'bf-cbc',
	key : 'b001c96c26d6fedf'
}

var Blowfish = function(text) {
	var sha1 = crypto.createHash(config.h);
	var value = sha1.update(text).digest('hex');
	// console.log(value);

	// var iv = new Buffer("16d87ab3", "binary");user.js
	// var iv = new Buffer([ -95,87,33,21,-40,-15,-9,7 ]);
	var iv = crypto.randomBytes(8);
	// console.log(iv);

	// var cipher = crypto.createCipher(config.c, config.key);
	var cipher = crypto.createCipheriv(config.c, config.key, iv);

	var res = cipher.update(value, 'binary', 'hex');
	res += cipher.final('hex');

	// console.log(res);
	return {c: config.c, v: iv.toString('hex'), xs: res, ht: value};
}

module.exports = Blowfish;

//console.log(Blowfish('jacsha@acxiom.com'));

