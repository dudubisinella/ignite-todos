const { request, response } = require('express');
const express = require('express');
const cors = require('cors');
const { v4: uuidV4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const todos = [];

function existUsername(request, response, next) {
    const { username } = request.headers;
    const todo = todos.find((todo) => todo.username === username);
    if(!todo) {
        return response.status(400).json({error: "Todos not found"});
    };
    request.todo = todo;
    return next();
}

function existID(request, response, next) {
    const { id } = request.params;
    const todo = todos.find((todo) => todo.id === id);
    if(!todo) {
        return response.status(400).json({error: "Id not found"});
    };
    request.todo = todo;
    return next();
}

app.post('/users', (request,response) => {
    const { name, username } = request.body;
    todos.push({ id: uuidV4(), name, username, todos: []});
    console.log(todos);
    return response.status(201).send();
});

app.get('/todos', existUsername, (request, response) => {
    const {username} = request.headers;
    return response.send(todos);
});

app.post('/todos', existUsername, (request, response) => {
    const {username} = request.headers;
    const { title, deadline } = request.body;
    const createTodo = { id: uuidV4(), title, done: false, deadline: new Date(deadline), created_at: new Date()};
    todos.push(createTodo);
    return response.status(201).send(createTodo);
});

app.put('/todos/:id', existUsername, existID, (request, response) => {
    const {username} = request.headers;
    const { id } = request.params;
    const { title, deadline } = request.body;
    const createTodo = { title, done: false, deadline: new Date(deadline), created_at: new Date()};
    todos.push(createTodo);
    return response.status(201).send(createTodo);
});

app.patch('/todos/:id/done', existUsername, existID, (request, response) => {
    const {username} = request.headers;
    const { id } = request.params;
    const updateDone = { done: true };
    todos.push(updateDone);
    return response.status(201).send(updateDone);
});

app.delete('/todos/:id', existUsername, existID, (request, response) => {
    const {username} = request.headers;
    const { id } = request.params;
    todos.splice(id, 1);
    return response.send();
});

module.exports = app;

