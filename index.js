const express = require('express');
const fs = require('fs/promises');
const app = express();
const port = 3000;
const bodyParser = require('body-parser');
const {
    MongoClient
} = require('mongodb');
const config = require('./config.json');
const cors = require("cors");

//create mongo client
const client = new MongoClient(config.finalUrl);

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res) => {
    res.status(300).redirect('/info.html');
})

//return all books
app.get('/books', async (req, res) => {
    try {
        await client.connect();

        const coll = client.db('courseProject').collection('books');
        const books = await coll.find({}).toArray();


        //send data
        res.status(200).send(books);
    } catch (error) {
        console.log(error)
        res.status(500).send({
            error: 'Something went wrong',
            value: error
        });
    } finally {
        await client.close()
    }
})

//return one book with id
app.get('/book', async (req, res) => {
    console.log(req.query)

    try {
        //read data
        let books = JSON.parse(await fs.readFile('data/books.json'));

        //find data
        let book = books[req.query.id];

        if (book) {
            //send data
            res.status(200).send(book);
        } else {
            res.status(400).send('boardgame could not be found with id:' + req.query.id);
        }



    } catch (error) {
        res.status(500).send('File could not be read! Try again later');
    }

})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})