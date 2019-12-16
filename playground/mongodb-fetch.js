// 32-fetch-data-mongodb__videoroxo

const { MongoClient, ObjectID } = require('mongodb');

MongoClient.connect("mongodb://localhost:27017/TodoApp", (err, client) => {
    if (err) {
        return console.log('unable connect to mongoDB');
    }
    console.log('connected to mongoDB');

    const db = client.db("TodoApp");

    db.collection('Todos').find({ _id: new ObjectID("5dee4aefe4b1e526f8ed498e") }).toArray().then((docs) => {
        console.log('Todos');
        console.log(JSON.stringify(docs, 2, undefined));
    }, (error) => {
        console.log('Unable to fetch Todos', error);
    })

    db.collection('Users').find().count().then((count) => {
        console.log(`Users count: ${count}`);
    }, (error) => {
        console.log('Unable to fetch Users', error);
    })

    db.collection('Users').find({ name: 'Mohammad' }).toArray().then((docs) => {
        console.log('Users');
        console.log(JSON.stringify(docs, 2, undefined));
    }, (error) => {
        console.log('Unable to fetch Users', error);
    })

    client.close();
});