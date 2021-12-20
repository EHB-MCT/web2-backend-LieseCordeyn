const express = require('express');
const fs = require('fs/promises');
const bodyParser = require('body-parser');
const {
    MongoClient
} = require('mongodb');
const cors = require("cors");
require('dotenv').config();

const app = express();
const port = process.env.PORT;

//create mongo client
const client = new MongoClient(process.env.FINAL_URL);

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
    //id is located in the query: red.query.id
    try {
        await client.connect();

        const coll = client.db('courseProject').collection('books');

        const query = {
            book_id: req.query.id
        };


        const book = await coll.findOne(query)

        if (book) {
            //send data
            res.status(200).send(book);
        } else {
            res.status(400).send('book could not be found with id:' + req.query.id);
        }



    } catch (error) {
        res.status(500).send('Data could not be read! Try again later');
    } finally {
        await client.close();
    }


})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})