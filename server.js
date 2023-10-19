const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const config = require('./config');
const Patient = require('./model/Patient');  // Update with the path to your schema file
const User = require('./model/User')
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');



const app = express();
const PORT = process.env.PORT || 5000;



// Connect to your MongoDB database
mongoose.connect(
    ""
  
  );



app.use(bodyParser.json());
app.use(cors()); // This is a basic setup allowing all origins. Refine for production use.

// Routes

// Create a new patient
app.post('/api/patients',verifyToken, (req, res) => {
  const newPatient = new Patient(req.body);
  newPatient.save()
    .then(patient => res.json(patient))
    .catch(err => res.status(400).json(err));
});

// Get all patients
app.get('/api/patients', verifyToken, (req, res) => {
    Patient.find()
    .then(patients => res.json(patients))
    .catch(err => res.status(400).json(err));
  });
// Get a single patient by ID
app.get('/api/patients/:id',verifyToken, (req, res) => {
  Patient.findById(req.params.id)
    .then(patient => {
      if (!patient) return res.status(404).json({ message: 'Patient not found' });
      res.json(patient);
    })
    .catch(err => res.status(400).json(err));
});

// Update a patient
app.put('/api/patients/:id',verifyToken, (req, res) => {
  Patient.findByIdAndUpdate(req.params.id, req.body, { new: true })
    .then(patient => res.json(patient))
    .catch(err => res.status(400).json(err));
});

// Delete a patient
app.delete('/api/patients/:id', verifyToken,(req, res) => {
  Patient.findByIdAndRemove(req.params.id)
    .then(() => res.json({ message: 'Patient deleted successfully' }))
    .catch(err => res.status(400).json(err));
});

// Start the server
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));





// Login a user and send back a JWT
app.post('/api/login', async (req, res) => {
    try {
      const { username, password } = req.body;
      const user = await User.findOne({ username });
  
      if (!user || !bcrypt.compareSync(password, user.password)) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
  
      const token = jwt.sign({ id: user._id }, config.jwtSecret, { expiresIn: '1h' });
      res.json({ token });
  
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });
  
  // ...
  
  // Middleware for checking JWT
  function verifyToken(req, res, next) {
    const bearerHeader = req.headers['authorization'];
    if (typeof bearerHeader !== 'undefined') {
      const bearerToken = bearerHeader.split(' ')[1];
      jwt.verify(bearerToken, config.jwtSecret, (err, data) => {
        if (err) {
          return res.status(403).json({ message: 'Unauthorized' });
        }
        req.userData = data;
        next();
      });
    } else {
      res.status(403).json({ message: 'Unauthorized' });
    }
  }




  app.post('/api/register', async (req, res) => {
    try {
      const { username, password } = req.body;
  
      // Check if username already exists
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return res.status(400).json({ message: 'Username already taken.' });
      }
  
      const user = new User({ username, password });
      await user.save();
      res.json({ message: 'User registered successfully' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  
  
  
  
  
  