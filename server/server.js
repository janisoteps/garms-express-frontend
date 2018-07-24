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


// Register new user
app.post('/api/register', function (req, res) {
    let email = req.body.email;
    let pwd = req.body.pwd;
    let sex = req.body.sex;
    let username = req.body.username;
    let fb_id = Math.random() * 1000 + Math.random() * 1000 + Math.random() * 1000;

    let options = {
        method: 'POST',
        url: 'http://34.249.244.134/api/register',
        body: JSON.stringify({
            email: email,
            pwd: pwd,
            sex: sex,
            username: username,
            fb_id: fb_id
        }),
        json: true
    };

    console.log('Register, options: ', options);

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
            // let response_data = JSON.parse(body);

            console.log('Remove fav response: ', body);

            res.send(body);
        }
    }

    request(options, handleResponse);
});


// Search similar products to requested search product
app.get('/api/search', function (req, res) {
    let main_cat = req.query.main_cat;
    let main_cat2 = req.query.main_cat2;
    let color_1 = req.query.color_1;
    let siamese_64 = req.query.pca_256;
    let sex = req.query.sex;
    let id = req.query.id;

    let options = {
        method: 'GET',
        url: 'http://34.249.244.134/api/search',
        qs: {
            main_cat: main_cat,
            main_cat2: main_cat2,
            color_1: color_1,
            pca_256: siamese_64,
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

    console.log('Image size: ', req.file.size);

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
    let siamese_64 = req.query.pca_256;
    let sex = req.query.sex;

    let options = {
        method: 'GET',
        url: 'http://34.249.244.134/api/colorcatsearch',
        qs: {
            cat_ai_txt: cat_ai_txt,
            color_rgb: color_rgb,
            pca_256: siamese_64,
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


// Return images for each cat in request array
app.post('/api/cat-images', function (req, res) {
    let categories = req.body.categories;
    let sex = req.body.sex;
    let mainCat = req.body.main_cat;

    let options = {
        method: 'POST',
        url: 'http://34.249.244.134/api/cat-images',
        body: JSON.stringify({categories: categories, sex: sex, main_cat: mainCat}),
        json: true
    };

    console.log('Cat images, options: ', options);

    function handleResponse(error, response, body){
        if (!error && response.statusCode === 200) {
            // let response_data = JSON.parse(body);

            console.log('Cat iamges: ', body);

            res.send(body);
        }
    }

    request(options, handleResponse);
});


// Do product search from Explorer component
app.post('/api/explorer_search', function (req, res) {
    let mainCatTop = req.body.mainCatTop;
    let mainCatSub = req.body.mainCatSub;
    let sex = req.body.sex;
    let colorSelected = req.body.colorSelected;
    let shops = req.body.shops;
    let brands = req.body.brands;
    let maxPrice = req.body.maxPrice;
    let color = req.body.color;

    let options = {
        method: 'POST',
        url: 'http://34.249.244.134/api/explorer_search',
        body: JSON.stringify({
            main_cat_top: mainCatTop,
            main_cat_sub: mainCatSub,
            sex: sex,
            color_selected: colorSelected,
            shops: shops,
            brands: brands,
            max_price: maxPrice,
            color: color
        }),
        json: true
    };

    console.log('Explorer search, options: ', options);

    function handleResponse(error, response, body){
        if (!error && response.statusCode === 200) {
            console.log('Explorer response length: ', body.res.length);

            res.send(body);
        }
    }

    request(options, handleResponse);
});


app.use(express.static(__dirname + './../dist/')); //serves the index.html

app.get('*', function (request, response){
    response.sendFile(path.resolve(__dirname, './../dist/', 'index.html'))
});

app.listen(8081); //listens on port 3000 -> http://localhost:3000/
