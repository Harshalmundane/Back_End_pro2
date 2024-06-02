const express = require('express');
const app = express();
const path = require('path');
const userModels = require("./models/user");
const mongoose = require('mongoose');

app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.render("index");
});

app.get('/read', async (req, res) => {
    try {
        let allUsers = await userModels.find();
        res.render("read", { users: allUsers });
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).send({ error: 'An error occurred while fetching users.' });
    }
});

app.post('/create', async (req, res) => {
    try {
        let { name, email, image } = req.body;
        let createUser = await userModels.create({
            name,
            email,
            image
        });
        res.redirect("/read");
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).send({ error: 'An error occurred while creating the user.' });
    }
});

app.get('/edit/:userid', async (req, res) => {
    try {
        let user = await userModels.findById(req.params.userid);
        res.render("edit", { user });
    } catch (error) {
        console.error('Error fetching user for edit:', error);
        res.status(500).send({ error: 'An error occurred while fetching the user.' });
    }
});

app.post('/update/:userid', async (req, res) => {
    try {
        const { image, name, email } = req.body;
        const userId = req.params.userid;

        await userModels.findOneAndUpdate(
            { _id: userId }, 
            { image, name, email },
            { new: true }
        );

        res.redirect("/read");
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).send({ error: 'An error occurred while updating the user.' });
    }
});


app.get('/delete/:id', async (req, res) => {
    try {
        await userModels.findByIdAndDelete(req.params.id);
        res.redirect('/read');
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).send('Error deleting user');
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
