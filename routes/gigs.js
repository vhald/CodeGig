const express = require('express');
const router = express.Router();
const db = require('../config/database');
const Gig = require('../models/Gig');
const sequelize = require('sequelize');
// using this to use the SQL like operator
const Op = sequelize.Op;

// get gig list
router.get('/', (req, res) => {
    // res.send('GIGS');
    // findAll 
    Gig.findAll()
        .then(gigs => {
            // console.log(gigs);
            // res.sendStatus(200);

            res.render('gigs', {
                gigs
            });

        })
        .catch(err => { console.log(err); })
})

// display add gig form
router.get('/add', (req, res) => { res.render('add') });


// add a gig 
// hardcoded first for checking.
router.post('/add', (req, res) => {
    // const data = {
    //     title: 'Poker',
    //     technologies: 'VFX, Green Screen, batman, etc..',
    //     budget: '$100',
    //     description: 'Merol muspi dolor sit amet, consectetur adipiscing elit. Etiam vitae quam accumsan neque rhoncus malesuada quis lacinia mi. Nunc ac nunc nec arcu tempus luctus. Cras imperdiet felis eget ultricies lacinia. Integer vel placerat augue. Vestibulum bibendum facilisis volutpat. Ut iaculis nec libero lacinia tincidunt.',
    //     contact_email: 'stan@lee.com'
    // }

    let { title, technologies, description, budget, contact_email } = req.body;
    let errors = [];

    // validate feilds, using js for validate not require of HTML
    if (!title) {
        errors.push({ text: 'Please add a title' });
    }
    if (!technologies) {
        errors.push({ text: 'Please add a techs!!' });
    }
    if (!description) {
        errors.push({ text: 'Please add a description' });
    }
    if (!contact_email) {
        errors.push({ text: 'Please add a email address' });
    }


    // check for errors
    if (errors.length > 0) {
        res.render('add', {
            errors,
            title,
            technologies,
            description,
            budget,
            contact_email
        })
    } else {
        if (!budget) {
            budget = "Unknown";
        } else {
            budget = `$${budget}`;
        }

        // make lowercase and remove space after the comma
        // in this /regex/ inside it < ,_text -> ,text >
        technologies = technologies.toLowerCase().replace(/, /g, ',');

        // Insert into table
        Gig.create({
            title,
            technologies,
            description,
            budget,
            contact_email
        })
            .then(gig => { res.redirect('/gigs') })
            .catch(err => { console.log(err) });
    }
});

// search for gigs 
router.get('/search', (req, res) => {
    let { term } = req.query;

    // making Lowercase the search term.
    term = term.toLowerCase();

    Gig.findAll({ where: { technologies: { [Op.like]: '%' + term + '%' } } })
        .then(gigs => { res.render('gigs', { gigs }) })
        .catch(err => { console.log(err) });
});


module.exports = router