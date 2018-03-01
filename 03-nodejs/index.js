'use strict';

console.log(`
3.
---

We need to create a route that downloads the entire database to a .csv file.
The endpoint must be set to: GET /users

Make sure to have an instance of MongoDB running at: mongodb://localhost

Run the database seed with:
$ node utils/seed.js

-> Warning: It contains hundreds of entities and our production server is quite small
`);

const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');

// Setup database
mongoose.Promise = Promise;
mongoose.connect('mongodb://localhost/mediastream-challenge');
const User = require('./models/User');

// Setup Express.js app
const app = express();

// Endpoint
app.get('/users', function (req, res) {

    function prepare(value) {
        return '"' + String(value || "") + '"';
    }

    res.setHeader('Content-disposition', 'attachment; filename=data.csv');
    res.set('Content-Type', 'text/csv');
    res.write(['Name', 'Email'].map(prepare).join(',') + '\n');

    User
        .find({}, 'name email')
        .exec()
        .then((data)=>{

            data.forEach((row) => {
                res.write([row.name, row.email].map(prepare).join(',') + '\n');
            });
            res.status(200).send();  
        });
});

app.listen(3000);