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

  console.log("Usuario retornado: ",user);

  if(!user){
    return response.status(404).json({
      error: "User not found"
    });
  }

  request.user = user;

  return next();

}

app.get('/users', (request, response) => {
    return response.status(200).json(users);
});

app.post('/users',  (request, response) => {
    const { name, username } = request.body;

    const user = {
      id: uuidv4(),
      name,
      username,
      todos: []
    }

    const existUser = users.find((us) => us.username === username);

    if(existUser){
      return response.status(400).json({
        error: "FODA_SE"
      })
    }

    users.push(user);

    return response.status(201).json(user);
});

app.get('/todos', checksExistsUserAccount, (request, response) => {
    const { user } = request;
    return response.status(200).json(user.todos);
});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  const { user } = request;
  const { title, deadline } = request.body;
  
  const todo = {
    id: uuidv4(),
    title: title,
    done: false,
    deadline: new Date(deadline),
    created_at: new Date()
  }

  user.todos.push(todo);

  return response.status(201).json(todo);
});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
    const { user} = request;
    const { id } = request.params;
    const { title, deadline } = request.body;

    const existTodo =  user.todo.find((td) => td.id === id)

    if(!existTodo){
        return response.status(404).json({
          error: "Todo not Exists"
        });
    }

    obj.todos.find((todo) => {
      if(todo.id == id){
        todo.deadline = deadline
        todo.title = title
      }
    });

    return response.status(200).json(obj);
});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  const { user} = request;
  const { id } = request.params;

  const existTodo =  user.todo.find((td) => td.id === id)

  if(!existTodo){
      return response.status(404).json({
        error: "Todo not Exists"
      });
  }

  user.todos.find((todo)=> {
      if(todo.id === id){
        todo.done = true;
      }
  })
  return response.status(200).json(obj);
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  const { user} = request;
  const { id } = request.params;

  const existTodo =  user.todo.find((td) => td.id === id)

    if(!existTodo){
        return response.status(404).json({
          error: "Todo not Exists"
        });
    }

  obj.todos.splice(existTodo,1);

  return response.status(204);

});

module.exports = app;