const { request, response } = require('express');
const express = require('express');
const cors = require('cors');
const { v4: uuidV4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checkExistsUserAccount(request, response, next) {
    const { username } = request.headers;
    const user = users.find(user => user.username === username);
    if(!user) {
        return response.status(404).json({error: "User not found"});
    };
    request.user = user;
    return next();
}

app.post('/users', (request,response) => {
    const { name, username } = request.body;
    const userExist = users.find(user => user.username === username);
    if(userExist) {
      return response.status(400).json({error: 'Username already exist'});
    }
    const user = { id: uuidV4(), name, username, todos: []};
    users.push(user);
    return response.status(201).send(user);
});

app.get('/todos', checkExistsUserAccount, (request, response) => {
    const { user } = request;
    return response.send(user.todos);
});

app.post('/todos', checkExistsUserAccount, (request, response) => {
    const {user} = request;
    const { title, deadline } = request.body;
    const todo = { id: uuidV4(), title, done: false, deadline: new Date(deadline), created_at: new Date()};
    user.todos.push(todo);
    return response.status(201).send(todo);
});

app.put('/todos/:id', checkExistsUserAccount, (request, response) => {
    const {user} = request;
    const { id } = request.params;
    const { title, deadline } = request.body;
    const todo = user.todos.find((todo) => todo.id === id);
    if(!todo) {
        return response.status(404).json({error: "Todo not found"});
    };
    todo.title = title;
    todo.deadline = new Date(deadline);
    return response.send(todo);
});

app.patch('/todos/:id/done', checkExistsUserAccount, (request, response) => {
    const {user} = request;
    const { id } = request.params;
    const todo = user.todos.find((todo) => todo.id === id);
    if(!todo) {
        return response.status(404).json({error: "Todo not found"});
    };
    todo.done = true;
    return response.send(todo);
});

app.delete('/todos/:id', checkExistsUserAccount, (request, response) => {
    const {user} = request;
    const { id } = request.params;
    const todoIndex = user.todos.findIndex(todo => todo.id === id);
    if(todoIndex === -1) {
      return response.status(404).json({error: "Todo not found"});
  };
    user.todos.splice(todoIndex, 1);
    return response.status(204).send();
});

module.exports = app;

