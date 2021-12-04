// Requiring module
const express = require('express');
const mongoose = require('mongoose');
const http = require('http');

mongoose.connect('mongodb://localhost:27017/books', { useNewUrlParser: true , useUnifiedTopology: true })
    .then(() => console.log('MongoDB Connected...'))
    .catch(err => console.log(err));

// Creating express object
const app = express();

// Handling GET request
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
})

// Port Number
const PORT = process.env.PORT ||5000;

// Server Setup
app.listen(PORT,console.log(`Server started on port ${PORT}`));