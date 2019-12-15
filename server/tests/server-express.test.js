const expect = require('expect');
const request = require('supertest');

const { app } = require('../server-express');
const { Todo } = require('../models/todo');

const { ObjectID } = require('mongodb');

const todos = [
    { _id: new ObjectID(), text: "todo1" },
    { _id: new ObjectID(), text: "todo2" },
]

beforeEach((done) => {
    Todo.deleteMany({}).then(() => {
        return Todo.insertMany(todos)
    }).then(() => done());
})

describe("Post /todos", () => {

    it("Should create a new todo", (done) => {
        var text = "new todo one";
        request(app)
            .post('/todos')
            .send({ text })
            .expect(200)
            .expect((res) => {
                expect(res.body.text).toBe(text);
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                Todo.find().then((todos) => {
                    expect(todos.length).toBe(3);
                    expect(todos[2].text).toBe(text);
                    done();
                }).catch((e) => done(e));
            });
    });

    it("Should not create a new todo with invalid body data", (done) => {
        request(app)
            .post('/todos')
            .send({})
            .expect(400)
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                Todo.find().then((todos) => {
                    expect(todos.length).toBe(2);
                    done();
                }).catch((e) => done(e));
            });
    });

})

describe("get /todos", () => {

    it("Should get all todos", (done) => {
        request(app)
            .get('/todos')
            .expect(200)
            .expect((res) => {
                expect(res.body.todos.length).toBe(2);
            })
            .end(done);
    });
})

describe("get /todos/:id", () => {

    it("Should get todo doc", (done) => {
        request(app)
            .get(`/todos/${todos[0]._id.toHexString()}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(todos[0].text);
            })
            .end(done);
    });

    it("Should return 404 if todo not found", (done) => {
        var hexId = new ObjectID().toHexString();
        request(app)
            .get(`/todos/${hexId}`)
            .expect(404)
            .end(done);
    });

    it("Should return for non-object ids", (done) => {
        request(app)
            .get('/todos/234324')
            .expect(404)
            .end(done);
    })

})


describe("delete /todos/:id", () => {
    var hexId = todos[1]._id.toHexString();

    it("Should delete todo doc", (done) => {
        request(app)
            .delete(`/todos/${hexId}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo._id).toBe(hexId);
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                Todo.findById(hexId).then((todo) => {
                    expect(todo).toBeNull();
                    done();
                })
            });
    });

    it("Shoubld return 404 if todo not found", (done) => {
        var hexId = new ObjectID().toHexString();
        request(app)
            .delete(`/todos/${hexId}`)
            .expect(404)
            .end(done);
    });

    it("Shoubld return for non-object ids", (done) => {
        request(app)
            .delete('/todos/234324')
            .expect(404)
            .end(done);
    })

})

describe("update /todos/:id", () => {
    var hexId = todos[0]._id.toHexString();
    var text = "test todo";

    it("Should update todo doc", (done) => {
        request(app)
            .patch(`/todos/${hexId}`)
            .send({ text, completed: true })
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(text);
                expect(res.body.todo.completed).toBe(true);
                expect(typeof res.body.todo.completedAt).toBe('number');
            })
            .end(done);
    });

    it("Should clear completedAt", (done) => {
        request(app)
            .patch(`/todos/${hexId}`)
            .send({ text, completed: false })
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(text);
                expect(res.body.todo.completed).toBe(false);
                expect(res.body.todo.completedAt).toBeNull();
            })
            .end(done);
    });

})