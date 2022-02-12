const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const exphbs = require('express-handlebars');
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access');
const Handlebars = require('handlebars');

// Database
const db = require('./config/database');

// test DB
db.authenticate()
    .then(() => console.log('Database Connection established'))
    .catch(err => console.log('Error connecting' + err))

const app = express();

// Handlebars configuration (engine is mainly for interface)
// layout is the thing that stores everything that is represented on the webpage
// express handlebars takes obj as arguments and callling it as a main. handlebars
app.engine('.handlebars', exphbs({ handlebars: allowInsecurePrototypeAccess(Handlebars), defaultLayout: 'main' }));
// setting view engine to handlebars
app.set('view engine', 'handlebars');

// body parser
app.use(bodyParser.urlencoded({ extended: false }));

// set static folder
app.use(express.static(path.join(__dirname, 'public')));


// rendering index handlebars + 
// choosing the different layout than defaultLayout. i.e. landing
app.get('/', (req, res) => {
    res.render('index', { layout: 'landing' });
})

// GIG routes
app.use('/gigs', require('./routes/gigs'))

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server started at ${PORT}`));
