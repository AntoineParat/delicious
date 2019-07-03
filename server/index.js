const express = require("express")

const app = express();
const port = process.env.PORT || 3000; // process.env.PORT is for heroku deployment

app.use(express.static(__dirname + '/public/' ));
app.get(/.*/, (req,res) => res.sendFile(__dirname + '/public/index.html'))

app.listen(port, () => console.log('router is up on port' + port))
