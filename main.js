const express = require("express");
const bodyparser = require("body-parser");
const server = express();
const port = 4000;
const { sequelize } = require("./connect");

server.use(bodyparser.json());

server.get("/tasks", (req, res) => {
    sequelize.query('SELECT * FROM tasks', {
            type: sequelize.QueryTypes.SELECT
        })
        .then((tasks) => {
            res.status(200).json({ tasks });
        })
        .catch(err => {
            res.json({ error: err });
        })
});

server.get("/tasks/category/:category", (req, res) => {
    const category = req.params.category;
    sequelize.query('SELECT * FROM tasks WHERE category = ?', {
            type: sequelize.QueryTypes.SELECT,
            replacements: [category]
        })
        .then((tasks) => {
            res.json(tasks);
        })
});

server.get("/tasks/id/:id", (req, res) => {
    const id = req.params.id;
    sequelize.query('SELECT * FROM tasks WHERE id = ?', {
            type: sequelize.QueryTypes.SELECT,
            replacements: [id]
        })
        .then((tasks) => {
            res.json(tasks);
        })
});

server.get("/tasks/completed/:completed", (req, res) => {
    const completed = req.params.completed;
    sequelize.query('SELECT * FROM tasks WHERE completed = ?', {
            type: sequelize.QueryTypes.SELECT,
            replacements: [completed]
        })
        .then((tasks) => {
            res.json(tasks);
        })
})

function validateAdd(req, res, next) {
    const { category, title, description, completed, coments } = req.body;
    if (category && title && description && completed) {
        next();
    } else {
        res.json({ message: "Error, incomplete data" });
    }
}

server.post("/tasks", validateAdd, (req, res) => {
    const { category, title, description, completed, coments } = req.body;
    sequelize.query('INSERT INTO tasks VALUES(null,?,?,?,?,?,null)', {
            replacements: [category, title, description, completed, coments]
        })
        .then((tasks) => {
            res.status(201).json({ message: "sucessfull insert data" });
        })
});

server.put("/tasks/:id", (req, res) => {
    const id = req.params.id;
    const { category, title, description, completed, coments } = req.body;
    sequelize.query('UPDATE tasks SET category = ?, title = ?, description = ?, completed = ?, coments = ? WHERE id = ?', {
            replacements: [category, title, description, completed, coments, id]
        })
        .then((tasks) => {
            res.json({ message: "Data update correctly" });
        })
})

server.listen(port, () => {
    console.log(`Server running port ${port}`);
});