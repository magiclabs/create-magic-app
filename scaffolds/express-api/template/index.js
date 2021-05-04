const { Magic } = require('@magic-sdk/admin');
const express = require('express');
const app = express();
const dotenv = require('dotenv');

dotenv.config();

const port = process.env.PORT || 9000;
const key = process.env.MAGIC_SECRET_KEY;

// enables parsing of json object in the body of the request
app.use(express.json());

// Initiating Magic instance for server-side methods
const magic = new Magic(key);

// List of todos
let todos = [
  {
    id: 1,
    title: 'Sign up to Magic.',
  },
  {
    id: 2,
    title: 'Use npx make-magic --template express-api',
  },
  {
    id: 3,
    title: 'Share on Social Media.',
  },
];

app.get('/', (req, res) => {
  res.send('Presto! Welcome to Magic.');
});

app.get('/secret', isAuthorized, (req, res) => {
  res.send('You are in good hands! Secured by Magic.');
});

app.get('/api/todos', (req, res) => {
  res.status(200).send(todos);
});

app.get('/api/todos/:id', (req, res) => {
  const todo = todos.find((t) => t.id === parseInt(req.params.id));
  if (!todo) return res.status(404).send(`Todo with the id ${req.params.id} was not found.`);
  res.status(200).send(todo);
});

app.use(isAuthorized);

app.post('/api/todos', (req, res) => {
  if (!req.body.title) return res.status(400).send('Title missing.');

  const todo = {
    id: todos.length + 1,
    title: req.body.title,
  };
  todos.push(todo);
  res.send(todo);
});

app.put('/api/todos/:id', (req, res) => {
  const todo = todos.find((t) => t.id === parseInt(req.params.id));

  if (!todo) return res.status(404).send(`todo with the id ${req.params.id} was not found.`);

  if (req.body.title) {
    todo.title = req.body.title;
  } else {
    return res.status(400).send('Title missing.');
  }

  res.send(todo);
});

app.delete('/api/todos/:id', (req, res) => {
  const todo = todos.find((t) => t.id === parseInt(req.params.id));

  if (!todo) return res.status(404).send(`todo with the id ${req.params.id} was not found.`);

  const index = todos.indexOf(todo);
  todos.splice(index, 1);

  res.send(todo);
});

async function isAuthorized(req, res, next) {
  if (req.headers.authorization !== undefined) {
    try {
      const didToken = req.headers.authorization.split(' ')[1];
      await magic.token.validate(didToken);
      return next();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(500).json({ message: 'Authorization Header required.' });
  }
}

app.listen(port, () => console.log(`Server listening on PORT:${port}`));
