// implement your API here

const express = require('express'); /// import express

const db = require('./data/db.js'); /// import db file

const server = express(); /// create server instance

server.use(express.json()); /// middleware to parse JSON from body

/// ENDPOINT
server.get('/api/users', (req, res) => {
    db.find()
        .then(users => {
            res.status(200).json(users)
        })
        .catch(error => {
            console.log('error on GET', error);
            res.status(500)
                .json({ errorMessage: 'error getting list of users from database' });
        })
})

server.get(`/api/users/:id`, (req, res) => {
    const id = req.params.id
    db.findById(id)
        .then(user => {
            res.status(200).json(user)
        })
        .catch(error => {
            console.log('error on GET', error);
            res.status(500)
                .json({ errorMessage: 'error getting user' });
        })
})

server.post('/api/users', (req, res) => {
    /// get data from client
    const userData = req.body;

    /// call db and add clients data
    if (userData.name === undefined || userData.bio === undefined) {
        return res.status(400).json({ errorMessage: "Please give name AND bio" });
    }

    db.insert(userData)
        .then(user => {
            res.status(201).json(user);
        })
        .catch(error => {
            console.log('error on POST', error);
            res.status(500).json({ errorMessage: 'error adding user to db' });
        });

})

server.put('/api/users/:id', (req, res) => {
    const changes = req.body;
    const id = req.params.id;

    db.update(id, changes)
        .then(user => {
            if (user) {
                res.status(200).json(user);
            } else {
                res.status(404).json({ message: 'User not found' })
            }
        })
        .catch(error => {
            console.log('error on PUT', error);
            res.status(500).json({ errorMessage: 'error editing user' });
        })
})

server.delete('/api/users/:id', (req, res) => {
    const id = req.params.id;

    db.remove(id)
        .then(removed => {
            if (removed) {
                /// no user with that id
                res.status(200).json({ message: 'user removed' })
            } else {
                res.status(404).json({ message: 'user not found' })
            }
        })
        .catch(error => {
            console.log('error on delete', error);
            res.status(500).json({ errorMessage: "error removing user" })
        })
})

const port = 4005

server.listen(port, () => {
    console.log(`server running on port ${port}`);
})