const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();
const fs = require('fs');

server.use(middlewares);
server.use(jsonServer.bodyParser);

// User registration
server.post('/register', (req, res) => {
  // Get data from the request
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const db = JSON.parse(fs.readFileSync('db.json', 'UTF-8'));

  // Check if the user already exists
  const userExists = db.users.find((user) => user.email === email);

  if (userExists) {
    return res
      .status(400)
      .json({ error: 'User with this email already exists' });
  }

  // Create a new user
  const newUser = {
    id: db.users.length + 1,
    email,
    password,
  };

  db.users.push(newUser);
  fs.writeFileSync('db.json', JSON.stringify(db, null, 2));

  res.status(201).json({ message: 'Registration successful', user: newUser });
});

// User login
server.post('/login', (req, res) => {
  // Get data from the request
  const { email, password } = req.body;

  // Load the database
  const db = JSON.parse(fs.readFileSync('db.json', 'UTF-8'));

  // Find the user in the database
  const user = db.users.find(
    (user) => user.email === email && user.password === password
  );

  // If the user is not found
  if (!user) {
    return res.status(400).json({ error: 'Invalid email or password' });
  }

  res.status(200).json({ message: 'Login successful', user });
});

server.use(router);

// Start the server
server.listen(3000, () => {
  console.log('JSON Server is running');
});

module.exports = server;