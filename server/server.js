var express = require('express');
var bodyParser = require('body-parser');

var { mongodb } = require('./db/mongoose');
var { Todo } = require('./models/todo');
var { User } = require('./models/user');


var newTodo = new Todo({
    text: "new Todo"
});

newTodo.save().then((doc) => {
    console.log(JSON.stringify(doc, undefined, 2));
}, (err) => {
    console.log('Unable to save todo', err);
});


var otherTodo = new Todo({
    text: "other Todo",
    completed: true,
    completedAt: 125
});

otherTodo.save().then((doc) => {
    console.log(JSON.stringify(doc, undefined, 2));
}, (err) => {
    console.log('Unable to save todo', err);
});


var newUser = new User({
    email: "info@tata.ir"
});

newUser.save().then((doc) => {
    console.log(JSON.stringify(doc, undefined, 2));
}, (err) => {
    console.log('Unable to save user', err);
});