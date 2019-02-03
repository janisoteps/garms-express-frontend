const express = require('express');
const app = express();
const request = require('request');
const bodyParser = require('body-parser');
app.use(bodyParser.json());
const path = require('path');
const multer  = require('multer');
const upload = multer({ dest: 'uploads/' });
const fs = require('fs');  // Filesystem
const emailValidator = require("email-validator");


// --------------------------   MAIN API   ---------------------------------


app.post('/api/login', function (req, res) {
    let email = req.body.email;
    let pwd = req.body.pwd;
    pwd = pwd.replace(/[^A-Za-z0-9]/g, "");

    if (emailValidator.validate(email) && typeof pwd === 'string' && pwd.length < 30) {
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
    } else {
        res.send(JSON.parse("Unauthorized"));
    }
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
            fb_id: fb_id,
            first_login: 1
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

app.post('/api/complete_first_login', function (req, res) {
    let email = req.body.email;
    let options = {
        method: 'POST',
        url: 'http://34.249.244.134/api/complete_first_login',
        body: JSON.stringify({
            email: email
        })
    };
    console.log('complete first login');

    function handleResponse(error, response, body){
        if (!error && response.statusCode === 200) {
            let response_data = JSON.parse(body);
            console.log(`response: ${response_data}`);
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


// Retrieve user Instagram picks
app.get('/api/insta_pics', function (req, res) {
    let email = req.query.email;

    let options = {
        method: 'GET',
        url: 'http://34.249.244.134/api/insta_pics',
        qs: {
            email: email
        }
    };

    console.log('Insta pics, options: ', options);

    function handleResponse(error, response, body){
        console.log('Insta pics, response status: ', response.statusCode);
        if (!error && response.statusCode === 200) {
            let response_data = JSON.parse(body);

            res.send(response_data);
        }
    }

    request(options, handleResponse);
});


// Update user's Instagram username
app.post('/api/save_insta_username', function (req, res) {
    let email = req.body.email;
    let insta_username = req.body.insta_username;

    let options = {
        method: 'POST',
        url: 'http://34.249.244.134/api/save_insta_username',
        body: JSON.stringify({email: email, insta_username: insta_username}),
        json: true
    };
    console.log('Save Insta username, options: ', options);

    function handleResponse(error, response, body){
        if (!error && response.statusCode === 200) {
            console.log('Save Insta username response: ', body);

            res.send(body);
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


// Search products based on input text string
app.get('/api/text_search', function (req, res) {
    let string = req.query.search_string;
    let sex = req.query.sex;

    console.log(string);

    let options = {
        method: 'GET',
        url: 'http://34.249.244.134/api/text_search',
        qs: {
            search_string: string,
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
app.post('/api/img_features', upload.single('image'), function (req, res) {

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
        url: 'http://34.249.244.134/api/img_features',
        formData:    formData
    };

    console.log('Img features, options: ', options);
    request(options, handleResponse);
});


// Search products based on confirmation modal input
app.post('/api/search_from_image', function (req, res) {
    let tags = req.body.tags;
    let color_rgb_1 = req.body.color_rgb_1;
    let color_rgb_2 = req.body.color_rgb_2;
    let no_shop = req.body.no_shop;
    let sex = req.body.sex;
    let encoding_nocrop = req.body.encoding_nocrop;


    let options = {
        method: 'POST',
        url: 'http://34.249.244.134/api/search_from_image',
        // url: 'http://127.0.0.1:5000/api/search_from_image',
        body: JSON.stringify({
            tags: tags,
            color_1: color_rgb_1,
            color_2: color_rgb_2,
            sex: sex,
            no_shop: no_shop,
            encoding_nocrop: encoding_nocrop
        }),
        json: true
    };

    console.log('Search from image, options: ', options);

    function handleResponse(error, response, body){
        if (!error && response.statusCode === 200) {
            // let response_data = JSON.parse(body);

            res.send(body);
        }
    }

    request(options, handleResponse);
});


// Search products based on confirmation modal input
app.get('/api/search_similar', function (req, res) {
    let img_hash = req.query.img_hash;
    let tags_positive = req.query.tags_positive;
    let tags_negative = req.query.tags_negative;
    let color_1 = req.query.color_1;
    let color_2 = req.query.color_2;
    let no_shop = req.query.no_shop;
    let sex = req.query.sex;

    let options = {
        method: 'GET',
        url: 'http://34.249.244.134/api/search_similar',
        // url: 'http://127.0.0.1:5000/api/search_similar',
        qs: {
            img_hash: img_hash,
            tags_positive: tags_positive,
            tags_negative: tags_negative,
            color_1: color_1,
            color_2: color_2,
            sex: sex,
            no_shop: no_shop
        }
    };

    console.log('Search similar images , options: ', options);

    function handleResponse(error, response, body){
        if (!error && response.statusCode === 200) {
            let response_data = JSON.parse(body);

            res.send(response_data);
        }
    }

    request(options, handleResponse);
});


// Submit Instagram image mention
app.post('/api/submit_instagram', function (req, res) {
    let mention_username= req.body.mention_username;
    let comment_id = req.body.comment_id;
    let mention_timestamp = req.body.mention_timestamp;
    let media_id = req.body.media_id;
    let media_type = req.body.media_type;
    let media_url = req.body.media_url;
    let media_permalink = req.body.media_permalink;
    let owner_username = req.body.owner_username;

    let options = {
        method: 'POST',
        url: 'http://34.249.244.134/api/submit_instagram',
        body: {
            mention_username: mention_username,
            comment_id: comment_id,
            mention_timestamp: mention_timestamp,
            media_id: media_id,
            media_type: media_type,
            media_url: media_url,
            media_permalink: media_permalink,
            owner_username: owner_username
        },
        json: true
    };

    function handleResponse(error, response, body){
        if (!error && response.statusCode === 200) {
            console.log('Explorer response length: ', body.res.length);

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


// Do product search from Explorer component
app.post('/api/sequences', function (req, res) {
    let input_text = req.body.input_text;
    console.log('Sequence prediction input: ' + input_text);
    let options = {
        method: 'POST',
        url: 'http://34.244.146.183/api/sequences',
        body: {
            input_text: input_text
        },
        json: true
    };

    function handleResponse(error, response, body){
        if (!error && response.statusCode === 200) {

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
