const { SHA256 } = require('crypto-js');
const jwt = require('jsonwebtoken');

const bcrypt = require('bcryptjs');

// 44-hashing-and-jwt-nodejs__videoroxo

var message = 'I am user number 6';
var hash = SHA256(message).toString();

console.clear();
console.log('message: ', message);
console.log('hash: ', hash);

var data = {
    id: 5
};

var token = {
    data,
    hash: SHA256(JSON.stringify(data) + 'somesecret').toString()
}

token.data.id = 2;
token.hash = SHA256(JSON.stringify(token.data) + 'somesecret').toString();

var resultHash = SHA256(JSON.stringify(token.data) + 'somesecret').toString();

if (resultHash === token.hash) {
    console.log('data was not changed');
} else {
    console.log('data was changed');
}

//create token
var newToken = jwt.sign(data, 'abc123');
console.log('newToken: ', newToken);

var decoded = jwt.decode(newToken);
console.log('decoded: ', decoded);

var verified = jwt.verify(newToken, 'abc123');
console.log('verified: ', verified);

// 47-hashing-user-password__videoroxo
var password = 'abc123!';
bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(password, salt, (err, hash) => {
        console.log('bcrypt hash', hash);
        bcrypt.compare(password, hash, (err, res) => {
            console.log(res);
        })
    });
});