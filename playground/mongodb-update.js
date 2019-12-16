// 34-update-data-mongodb__videoroxo

const { MongoClient, ObjectID } = require('mongodb');

MongoClient.connect("mongodb://localhost:27017/TodoApp", (err, client) => {
    if (err) {
        return console.log('unable connect to mongoDB');
    }
    console.log('connected to mongoDB');

    const db = client.db("TodoApp");

    db.collection("Todos").findOneAndUpdate({ _id: new ObjectID("5df47b78f06183fd8e2ce355") }, { $set: { completed: true } }, { returnOriginal: false }).then((result) => {
        console.log('Todos documents of updated', result);
    })

    db.collection("Users").findOneAndUpdate({ _id: 2 }, { $inc: { age: 3 } }, { returnOriginal: false }).then((result) => {
        console.log('Users documents of updated', result);
    })

    client.close();
});