const express = require('express');
const cors = require('cors');

 const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

 const users = [];

function checksExistsUserAccount(request, response, next) {
  const { username } = request.headers;

  console.log(username);

  const user = users.find(user => user.username === username);

  if(!user){
    return response.status(404).json({
      error: "User not found"
    });
  }

  request.user = user;

  return next();

}

app.post('/users', (request, response) => {
    const { name, username } = request.body;

    const user = {
      uuid: uuidv4(),
      name,
      username,
      todos: []
    }

    users.push(user);

    return response.status(201).json(users);
});

app.get('/todos', checksExistsUserAccount, (request, response) => {
    const { user } = request;
    return response.status(200).json(user.todos);
});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  const { title, deadline } = request.body;
  const { user } = request;

  const todo = {
    id: uuidv4(),
    title: title,
    done: false,
    deadline: deadline,
    created_at: new Date()
  }

  user.todos.push(todo);

  return response.status(200).send();
});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
    const { user} = request;
    const { id } = request.params;
    const { title, deadline } = request.body;

    const obj =  users.find((u)=> u.username ===  user.username)

    obj.todos.find((todo) => {
      if(todo.id === id){
        todo.deadline = deadline
        todo.title = title
      }
    });

    return response.status(200).json(obj);
});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  const { user} = request;
  const { id } = request.params;

  const obj =  users.find((u)=> u.username ===  user.username);

  obj.todos.find((todo)=> {
      if(todo.id === id){
        todo.done = true;
      }
  })
  return response.status(200).json(obj);
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  const { user} = request;
  const { id } = request.params;

  const obj =  users.find((u)=> u.username ===  user.username);

  const todo = obj.todos.find((todo)=> {(todo.id === id)})

  obj.todos.splice(todo,1);

  return response.status(200).json(obj);

});

module.exports = app;