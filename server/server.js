const express = require('express');
const app = express();
const request = require('request');
const bodyParser = require('body-parser');
app.use(bodyParser.json());
const path = require('path');
const multer  = require('multer');
const upload = multer({ dest: 'uploads/' });
const fs = require('fs');  // Filesystem


// --------------------------   MAIN API   ---------------------------------

app.post('/api/login', function (req, res) {
    let email = req.body.email;
    let pwd = req.body.pwd;

    console.log('Email: ', email);
    console.log('Pwd: ', pwd);
    let options = {
        method: 'POST',
        url: 'http://34.249.244.134/api/login',
        body: JSON.stringify({email: email, pwd: pwd}),
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        }
    };

    console.log('Login', options);

    function handleResponse(error, response, body){
        if (!error && response.statusCode === 200) {
            let response_data = JSON.parse(body);

            res.send(response_data);
        }
    }

    request(options, handleResponse);
});

// Add a product favorite to users account
app.post('/api/addfav', function (req, res) {
    let email = req.body.email;
    let img_hash = req.body.img_hash;

    let options = {
        method: 'POST',
        url: 'http://34.249.244.134/api/addfav',
        body: JSON.stringify({email: email, img_hash: img_hash}),
        json: true
    };

    console.log('Add Fav, options: ', options);

    function handleResponse(error, response, body){
        if (!error && response.statusCode === 200) {
            let response_data = JSON.parse(body);

            res.send(response_data);
        }
    }

    request(options, handleResponse);
});

// Retrieve user favorites
app.get('/api/favorites', function (req, res) {
    let email = req.query.email;


    let options = {
        method: 'GET',
        url: 'http://34.249.244.134/api/favorites',
        qs: {
            email: email
        }
    };

    console.log('Favorites, options: ', options);

    function handleResponse(error, response, body){
        if (!error && response.statusCode === 200) {
            let response_data = JSON.parse(body);

            res.send(response_data);
        }
    }

    request(options, handleResponse);
});

// Remove a product favorite from users account
app.post('/api/removefav', function (req, res) {
    let email = req.body.email;
    let img_hash = req.body.img_hash;

    let options = {
        method: 'POST',
        url: 'http://34.249.244.134/api/removefav',
        body: JSON.stringify({email: email, img_hash: img_hash}),
        json: true
    };

    console.log('Remove Fav, options: ', options);

    function handleResponse(error, response, body){
        if (!error && response.statusCode === 200) {
            let response_data = JSON.parse(body);

            res.send(response_data);
        }
    }

    request(options, handleResponse);
});

// Search similar products to requested search product
app.get('/api/search', function (req, res) {
    let main_cat = req.query.main_cat;
    let main_cat2 = req.query.main_cat2;
    let color_1 = req.query.color_1;
    let siamese_64 = req.query.siamese_64;
    let sex = req.query.sex;
    let id = req.query.id;

    let options = {
        method: 'GET',
        url: 'http://34.249.244.134/api/search',
        qs: {
            main_cat: main_cat,
            main_cat2: main_cat2,
            color_1: color_1,
            siamese_64: siamese_64,
            sex: sex,
            id: id
        }
    };

    console.log('Search, options: ', options);

    function handleResponse(error, response, body){
        if (!error && response.statusCode === 200) {
            let response_data = JSON.parse(body);

            res.send(response_data);
        }
    }

    request(options, handleResponse);
});

// Search products based on input text string
app.get('/api/text', function (req, res) {
    let string = req.query.string;
    let sex = req.query.sex;

    let options = {
        method: 'GET',
        url: 'http://34.249.244.134/api/text',
        qs: {
            string: string,
            sex: sex
        }
    };

    console.log('Text, options: ', options);

    function handleResponse(error, response, body){
        if (!error && response.statusCode === 200) {
            let response_data = JSON.parse(body);

            res.send(response_data);
        }
    }

    request(options, handleResponse);
});

// Get product category, color and siamese encoding
app.post('/api/colorcat', upload.single('image'), function (req, res) {

    let image = req.file.path;

    let formData = {
            image: fs.createReadStream(image),
        };

    function handleResponse(error, response, body){
        if (!error && response.statusCode === 200) {
            let response_data = JSON.parse(body);

            res.send(response_data);
        }
    }

    let options = {
        method: 'POST',
        url: 'http://34.249.244.134/api/colorcat',
        formData:    formData
    };

    console.log('Colorcat, options: ', options);
    request(options, handleResponse);
});

// Search products based on confirmation modal input
app.get('/api/colorcatsearch', function (req, res) {
    let cat_ai_txt = req.query.cat_ai_txt;
    let color_rgb = req.query.color_rgb;
    let siamese_64 = req.query.siamese_64;
    let sex = req.query.sex;

    let options = {
        method: 'GET',
        url: 'http://34.249.244.134/api/colorcatsearch',
        qs: {
            cat_ai_txt: cat_ai_txt,
            color_rgb: color_rgb,
            siamese_64: siamese_64,
            sex: sex
        }
    };

    console.log('Colorcatsearch, options: ', options);

    function handleResponse(error, response, body){
        if (!error && response.statusCode === 200) {
            let response_data = JSON.parse(body);

            res.send(response_data);
        }
    }

    request(options, handleResponse);
});


app.use(express.static(__dirname + './../dist/')); //serves the index.html

app.get('*', function (request, response){
    response.sendFile(path.resolve(__dirname, './../dist/', 'index.html'))
});

app.listen(8081); //listens on port 3000 -> http://localhost:3000/
