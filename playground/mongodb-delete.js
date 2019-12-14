const { MongoClient, ObjectID } = require('mongodb');

MongoClient.connect("mongodb://localhost:27017/TodoApp", (err, client) => {
    if (err) {
        return console.log('unable connect to mongoDB');
    }
    console.log('connected to mongoDB');

    const db = client.db("TodoApp");

    db.collection("Todos").deleteMany({ text: "something to do" }).then((result) => {
        console.log('Todos documents of removed', result);
    })

    db.collection("Todos").deleteOne({ text: "something to do" }).then((result) => {
        console.log(' Todos document of removed', result);
    })

    db.collection("Todos").findOneAndDelete({ text: "something to do" }).then((result) => {
        console.log('Todos document of find and removed', result);
    })

    db.collection("Users").findOneAndDelete({ _id: new ObjectID("5df47a9af06183fd8e2ce350") }).then((result) => {
        console.log(' Users document of find and removed', result);
    })

    client.close();
});