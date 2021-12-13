const express = require('express')
const fs = require('fs/promises')
const app = express()
const port = 3000
const bodyParser = require('body-parser')

app.use(express.static('public'))
app.use(bodyParser.json())

app.get('/', (req, res) => {
    res.status(300).redirect('/info.html')
})

//return all books
app.get('/books', async (req, res) => {
    try {
        //read data
        let books = await fs.readFile('data/books.json');
        //send data
        res.status(200).send(JSON.parse(books));
    } catch (error) {
        res.status(500).send('File could not be read! Try again later');
    }
})

//return one book with id
app.get('/book',async(req, res)=>{
    console.log(req.query)

    try {
        //read data
        let books = JSON.parse(await fs.readFile('data/books.json'));

        //find data
        let book = books[req.query.id];

        if(book){
            //send data
            res.status(200).send(book);
        }else{
            res.status(400).send('boardgame could not be found with id:' + req.query.id );
        }

        
       
    } catch (error) {
        res.status(500).send('File could not be read! Try again later');
    }

})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})