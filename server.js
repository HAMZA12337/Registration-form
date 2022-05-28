var express = require('express');
var env = require('dotenv').config()
var ejs = require('ejs');
var path = require('path');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var session = require('express-session');
const MongoStore = require('connect-mongo');

//var url="mongodb://localhost:27017/?readPreference=primary&appname=MongoDB%20Compass&directConnection=true&ssl=false";


//connecter app avec la base de donnee
mongoose.connect(url,function(err){
if(err) console.log("Mauvais Fait !!");
else console.log("Bien Fait !!");
})
//Lancer le port de server
const PORT=process.env.PORT || 3000 ;
app.listen(PORT,function(){

console.log("Your server is startrd on "+PORT);
})

//set of session
var db=mongoose.connection;
db.on('error',console.error.bind(console,'connection error'));
db.once('open ',function(){
});


  app.use(
    session({
        secret: 'story book',
        resave: false,
        saveUninitialized: false,
        store: MongoStore.create({
            mongoUrl: "mongodb://localhost:27017/?readPreference=primary&appname=MongoDB%20Compass&directConnection=true&ssl=false"
        })
    })
);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');	

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(__dirname + '/views'));
var index = require('./routes/index');
app.use('/', index);
