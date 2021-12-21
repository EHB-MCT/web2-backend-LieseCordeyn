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

app.post('/books', async (req, res) => {
    /* can only send data in the body */


    try {
        //connect with database
        await client.connect();
        const coll = client.db('courseProject').collection('books');

        
      //validation for double challenges 
      const myDoc = await coll.findOne({book_id: req.body.book_id});  // Find document 
      if (myDoc){
        res.status(400).send('Bad request: book already exists with id' + req.body.book_id);
        return; //cause we don't want the code to continue
        }

        //save new challenge
        let newBook = {
            book_id: req.body.book_id,
            author: req.body.author,
            title: req.body.title,
            started: req.body.started,
            finished: req.body.finished,
            proces: req.body.proces,
            rating: req.body.rating,
            favorite_character: req.body.favorite_character,
            favorite_chapter: req.body.favorite_chapter,
            favorite_quote: req.body.favorite_quote,
            wishlist: req.body.wishlist,
            current_read: req.body.current_read,
            to_be_read: req.body.to_be_read
        }
        
        //insert into database
        let insertResult = await coll.insertOne(newBook);

        //send back succes message

        res.status(201).json(newBook);
        console.log(newBook)
        return;

    } catch (error) {
        console.log('error');
        res.status(500).send({
            error: 'an error has occured',
            value: error
        });
    }finally{
        await client.close();
    }
});


app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})