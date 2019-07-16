require("./mongoDB/mongoose")
const express = require("express");
// const history = require('connect-history-api-fallback');
const userRouter = require('./routes/users');
const storeRouter = require('./routes/stores')
const cookieParser = require('cookie-parser');


const app = express();
// app.use(history());

const port = process.env.PORT || 3000; 

app.use(cookieParser());

/* UNCOMMENT FOR PRODUCTION */
app.use(express.static(__dirname + '/public/' ));
 app.get('*', (req,res) => res.sendFile(__dirname + '/public/index.html'))

app.use(express.json()) //automatically parse upcoming JSON file


app.use(userRouter);
app.use(storeRouter);

app.listen(port, () => console.log('router is up on port' + port))
