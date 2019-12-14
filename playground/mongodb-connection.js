const { MongoClient, ObjectID } = require('mongodb');

// const MongoClient = require('mongodb').MongoClient;

// 31-objectid-mongodb__videoroxo
var user = { name: 'Mohammad', age: 29 };
var { name } = user;
console.log(name);

var obj = new ObjectID();
console.log('obj', obj.getTimestamp());

// 30-mongodb-nodejs-start__videoroxo
MongoClient.connect("mongodb://localhost:27017/TodoApp", (err, client) => {
    if (err) {
        return console.log('unable connect to mongoDB');
    }
    console.log('connected to mongoDB');

    const db = client.db("TodoApp");

    db.collection("Todos").insertOne({
        text: "something to do",
        completed: false
    }, (err, result) => {
        if (err) {
            return console.log('unable to insert todos', err);
        }
        console.log(JSON.stringify(result.ops, undefined, 2));

    })

    db.collection("Users").insertOne({
        _id: 3,
        name: 'Mohammad',
        location: 'Tehran',
        age: 29
    }, (err, result) => {
        if (err) {
            return console.log('unable to insert todos', err);
        }
        console.log(JSON.stringify(result.ops[0]._id));

    })

    client.close();
});