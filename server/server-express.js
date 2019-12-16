var express = require('express');
var bodyParser = require('body-parser');

var { mongodb } = require('./db/mongoose');
var { Todo } = require('./models/todo');
var { User } = require('./models/user');

var { ObjectID } = require('mongodb');

var _ = require('lodash');

var { authenticate } = require('./middlewares/authenticate');

var app = express();

app.use(bodyParser.json());

app.post('/todos', (req, res) => {
    var todo = new Todo({ text: req.body.text });
    todo.save().then((doc) => {
        res.send(doc);
    }, (err) => {
        res.status(400).send(err);
    });
})

app.get('/todos', (req, res) => {
    Todo.find().then((todos) => {
        res.send({ todos });
    }, (e) => {
        res.status(400).send(e);
    })
})

app.get('/todos/:id', (req, res) => {
    var id = req.params.id;
    if (!ObjectID.isValid(id)) {
        return res.status(404).send();
    }
    Todo.findById(id).then((todo) => {
        if (!todo) {
            return res.status(404).send();
        }
        res.send({ todo });
    }).catch((e) => res.status(404).send());
})

app.delete('/todos/:id', (req, res) => {
    var id = req.params.id;
    if (!ObjectID.isValid(id)) {
        return res.status(404).send();
    }
    Todo.findByIdAndDelete({ _id: id }).then((todo) => {
        if (!todo) {
            return res.status(404).send();
        }
        res.send({ todo });
    }).catch((e) => res.status(404).send());
})

app.patch('/todos/:id', (req, res) => {
    var id = req.params.id;
    var body = _.pick(req.body, ['text', 'completed']);

    if (!ObjectID.isValid(id)) {
        return res.status(404).send();
    }

    if (_.isBoolean(body.completed) && body.completed) {
        body.completedAt = new Date().getTime();
    } else {
        body.completed = false;
        body.completedAt = null;
    }

    Todo.findOneAndUpdate({ _id: new ObjectID(id) }, { $set: body }, { new: true }).then((todo) => {
        if (!todo) {
            return res.status(404).send();
        }
        res.send({ todo });
    }).catch((e) => res.status(400).send());
})

// 46-private-route-middleware__videoroxo

// app.get('/user/me', (req, res) => {
//     var token = req.header('x-auth');
//     User.findByToken(token).then((user) => {
//         if (!user) {
//             return Promise.reject();
//         } 
//             res.send(user);
//     }).catch((err) => {
//         res.status(401).send(err);
//     })
// })

app.get('/user/me', authenticate, (req, res) => {
    res.send(req.user);
})

// 48-login-logout-routes-editted__videoroxo
app.post('/users/login', (req, res) => {
    var body = _.pick(req.body, ['email', 'password']);
    User.findByCredentials(body.email, body.password).then((user) => {
        return user.generateAuthToken().then((token) => {
            res.header('x-auth', token).send(user);
        });
    }).catch((err) => res.status(400).send(err));
})

app.delete('/users/logout', authenticate, (req, res) => {
    req.user.removeToken(req.token).then(() => {
        res.status(200).send();
    }).catch((err) => res.status(400).send());
})

app.post('/users', (req, res) => {
    var body = _.pick(req.body, ['email', 'password']);
    var user = new User(body);
    user.save().then((user) => {
        user.generateAuthToken().then((token) => {
            res.header('x-auth', token).send(user);
        });
    }).catch((err) => res.status(400).send(err));
})

app.listen(3000, () => {
    console.log('Starting on port 3000');
})

module.exports = { app };