const express = require('express');
const mongoose = require('mongoose');
const app = express();
const port = 3000;

app.use(express.json());

const mongoUri = `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_HOST}/${process.env.MONGO_DB}?authSource=admin`;

console.log('MongoDB URI:', mongoUri); // Log the URI

mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected...'))
    .catch(err => {
        console.error('Error connecting to MongoDB', err);
    });

app.get('/', async (req, res) => {
    try {
        const clients = await mongoose.connection.db.collection('clients').find().toArray();
        let clientList = clients.map(client => `<li>${client.name} - ${client.email}</li>`).join('');
        res.send(`
            <html>
                <head>
                    <title>Client List</title>
                </head>
                <body>
                    <h1>Client List</h1>
                    <ul>
                        ${clientList}
                    </ul>
                </body>
            </html>
        `);
    } catch (err) {
        console.error('Error fetching clients', err);
        res.status(500).send('Error fetching clients');
    }
});

app.listen(port, () => {
    console.log(`API listening at http://localhost:${port}`);
});
