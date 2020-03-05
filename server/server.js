const express = require('express');
const app = express();
const request = require('request');
const bodyParser = require('body-parser');
app.use(bodyParser.json());
const path = require('path');
const multer  = require('multer');
const upload = multer({ dest: 'uploads/' });
// const multerS3 = require('multer-s3');
const fs = require('fs');  // Filesystem
const emailValidator = require("email-validator");
const sha1 = require('sha1');
const aws = require('aws-sdk');


const api_base_url = 'https://main-api.garms.io/api/';
// const api_base_url = 'http://127.0.0.1:5000/api/';
const BUCKET_NAME = 'garms-userimages';
const IAM_USER_KEY = process.env.IAM_USER_KEY;
const IAM_USER_SECRET = process.env.IAM_USER_SECRET;


// --------------------------   MAIN API   ---------------------------------


// Get product category, color and siamese encoding
app.post('/api/upload_image', upload.single('image'), function (req, res) {
    const timestamp = Date.now();
    const imgId = sha1(`${timestamp}`);
    const image = req.file.path;
    const fileType = req.file.mimetype;
    let extension = null;
    if (fileType === 'image/jpeg') {
        extension = 'jpg'
    }
    if (fileType === 'image/png') {
        extension = 'png'
    }

    let s3bucket = new aws.S3({
        accessKeyId: IAM_USER_KEY,
        secretAccessKey: IAM_USER_SECRET,
        Bucket: BUCKET_NAME,
    });

    let params = {
        Bucket: BUCKET_NAME,
        Key: `${imgId}.${extension}`,
        Body: fs.createReadStream(image),
        ContentType: fileType,
        ACL: 'public-read'
    };

    s3bucket.upload(params, function (err, responseData) {
        if (err) {
            console.log('error in callback');
            console.log(err);
        }

        res.send(responseData['Location']);
    });
});


app.post('/api/login', function (req, res) {
    let email = req.body.email;
    let pwd = req.body.pwd;
    pwd = pwd.replace(/[^A-Za-z0-9]/g, "");

    if (emailValidator.validate(email) && typeof pwd === 'string' && pwd.length < 30) {

        let options = {
            method: 'POST',
            url: api_base_url + 'login',
            body: JSON.stringify({email: email, pwd: pwd}),
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            }
        };

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


app.post('/api/pw_reset_token', function (req, res) {
    let email = req.body.email;
    let pw = req.body.pw;

    if (emailValidator.validate(email) && typeof pw === 'string' && pw.length < 30) {

        let options = {
            method: 'POST',
            url: api_base_url + 'pw_reset_token',
            body: JSON.stringify({email: email, pw: pw}),
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            }
        };

        function handleResponse(error, response, body){
            if (!error && response.statusCode === 200) {
                // console.log(body);
                let response_data = JSON.parse(body);

                res.send(response_data);
            }
        }

        request(options, handleResponse);
    } else {
        res.send(JSON.parse("Unauthorized"));
    }
});


app.post('/api/pw_reset', function (req, res) {
    let email = req.body.email;
    let token = req.body.token;
    let new_pw = req.body.new_pw;

    if (emailValidator.validate(email) && typeof new_pw === 'string' && new_pw.length < 30) {
        let options = {
            method: 'POST',
            url: api_base_url + 'pw_reset',
            body: JSON.stringify({
                email: email,
                new_pw: new_pw,
                token: token
            }),
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            }
        };

        function handleResponse(error, response, body){
            if (!error && response.statusCode === 200) {
                let response_data = JSON.parse(body);
                console.log(response_data);
                res.send(response_data);
            }
        }

        request(options, handleResponse);
    } else {
        res.send(JSON.stringify({res:"Unauthorized"}));
    }
});


app.post('/api/pw_reset_email', function (req, res) {
    let email = req.body.email;

    if (emailValidator.validate(email)) {
        let options = {
            method: 'POST',
            url: api_base_url + 'pw_reset_email',
            body: JSON.stringify({
                email: email
            }),
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            }
        };

        function handleResponse(error, response, body){
            if (!error && response.statusCode === 200) {
                let response_data = JSON.parse(body);
                console.log(response_data);
                res.send(response_data);
            }
        }

        request(options, handleResponse);
    } else {
        res.send(JSON.stringify({response:"Unauthorized"}));
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
        url: api_base_url + 'register',
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
        url: api_base_url + 'complete_first_login',
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
        url: api_base_url + 'addfav',
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
        url: api_base_url + 'favorites',
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
        url: api_base_url + 'insta_pics',
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
        url: api_base_url + 'save_insta_username',
        body: JSON.stringify({email: email, insta_username: insta_username}),
        json: true
    };

    function handleResponse(error, response, body){
        if (!error && response.statusCode === 200) {

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
        url: api_base_url + 'removefav',
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
        url: api_base_url + 'search',
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
        url: api_base_url + 'text',
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
        url: api_base_url + 'text_search',
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
        url: api_base_url + 'img_features',
        formData:    formData
    };

    // console.log('Img features, options: ', options);
    request(options, handleResponse);
});


// Search products based on confirmation modal input
app.post('/api/search_from_image', function (req, res) {
    let tags = req.body.tags;
    let color_rgb_1 = req.body.color_rgb_1;
    // let color_rgb_2 = req.body.color_rgb_2;
    let no_shop = req.body.no_shop;
    let sex = req.body.sex;
    let encoding_rcnn = req.body.encoding_rcnn;
    const vgg16_encoding = req.body.vgg16_encoding;

    let options = {
        method: 'POST',
        url: api_base_url + 'search_from_image',
        body: JSON.stringify({
            tags: tags,
            color_1: color_rgb_1,
            // color_2: color_rgb_2,
            sex: sex,
            no_shop: no_shop,
            encoding_rcnn: encoding_rcnn,
            vgg16_encoding: vgg16_encoding
        }),
        json: true
    };
    // console.log('Search from image, options: ', options);

    function handleResponse(error, response, body){
        if (!error && response.statusCode === 200) {
            res.send(body);
        }
    }

    request(options, handleResponse);
});


// Search products based on confirmation modal input
app.post('/api/search_similar', function (req, res) {
    let img_hash = req.body.img_hash;
    let tags_positive = req.body.tags_positive;
    let tags_negative = req.body.tags_negative;
    let color_1 = req.body.color_1;
    // let color_2 = req.body.color_2;
    let no_shop = req.body.no_shop;
    let sex = req.body.sex;
    let max_price = req.body.max_price;
    let brands = req.body.brands;

    let options = {
        method: 'POST',
        url: api_base_url + 'search_similar',
        body: JSON.stringify({
            img_hash: img_hash,
            tags_positive: tags_positive,
            tags_negative: tags_negative,
            color_1: color_1,
            // color_2: color_2,
            sex: sex,
            no_shop: no_shop,
            max_price: max_price,
            brands: brands
        }),
        json: true
    };

    function handleResponse(error, response, body){
        if (!error && response.statusCode === 200) {
            res.send(body);
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
        url: api_base_url + 'submit_instagram',
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
            // console.log('Explorer response length: ', body.res.length);

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
        url: api_base_url + 'explorer_search',
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

    // console.log('Explorer search, options: ', options);

    function handleResponse(error, response, body){
        if (!error && response.statusCode === 200) {
            // console.log('Explorer response length: ', body.res.length);

            res.send(body);
        }
    }

    request(options, handleResponse);
});


// Do product search from Explorer component
app.post('/api/sequences', function (req, res) {
    let input_text = req.body.input_text;
    // console.log('Sequence prediction input: ' + input_text);
    let options = {
        method: 'POST',
        url: api_base_url + 'sequences',
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


app.post('/api/add_look', function (req, res) {
    let email = req.body.email;
    let look_name = req.body.look_name;

    let options = {
        method: 'POST',
        url: api_base_url + 'add_look',
        body: JSON.stringify({email: email, look_name: look_name}),
        json: true
    };
    // console.log('Add Look, options: ', options);

    function handleResponse(error, response, body){
        if (!error && response.statusCode === 200) {
            // console.log('Add Look response: ', body);
            res.send(body);
        }
    }

    request(options, handleResponse);
});


app.post('/api/remove_look', function (req, res) {
    let email = req.body.email;
    let look_name = req.body.look_name;

    let options = {
        method: 'POST',
        url: api_base_url + 'remove_look',
        body: JSON.stringify({email: email, look_name: look_name}),
        json: true
    };

    function handleResponse(error, response, body){
        if (!error && response.statusCode === 200) {
            res.send(body);
        }
    }

    request(options, handleResponse);
});


app.post('/api/rename_look', function (req, res) {
    let email = req.body.email;
    let look_name = req.body.look_name;
    let new_look_name = req.body.new_look_name;

    let options = {
        method: 'POST',
        url: api_base_url + 'rename_look',
        body: JSON.stringify({
            email: email,
            look_name: look_name,
            new_look_name: new_look_name
        }),
        json: true
    };

    function handleResponse(error, response, body){
        if (!error && response.statusCode === 200) {
            res.send(body);
        }
    }

    request(options, handleResponse);
});


app.post('/api/get_looks', function (req, res) {
    let email = req.body.email;
    // console.log(email);

    let options = {
        method: 'POST',
        url: api_base_url + 'get_looks',
        body: JSON.stringify({email: email}),
        json: true
    };
    // console.log('Get Looks, options: ', options);

    function handleResponse(error, response, body){
        console.log('GetLook response: ', body);
        if (!error && response.statusCode === 200) {
            res.send(body);
        }
    }

    request(options, handleResponse);
});


app.post('/api/add_outfit', function (req, res) {
    const email = req.body.email;
    const look_name = req.body.look_name;
    const prod_id = req.body.prod_id;
    const sex = req.body.sex;

    let options = {
        method: 'POST',
        url: api_base_url + 'add_outfit',
        body: JSON.stringify({
            email: email,
            look_name: look_name,
            prod_id: prod_id,
            sex: sex
        }),
        json: true
    };

    function handleResponse(error, response, body){
        if (!error && response.statusCode === 200) {
            res.send(body);
        }
    }

    request(options, handleResponse);
});


app.post('/api/remove_outfit', function (req, res) {
    let email = req.body.email;
    let look_name = req.body.look_name;
    let prod_id = req.body.prod_id;
    let outfit_date = req.body.outfit_date;


    let options = {
        method: 'POST',
        url: api_base_url + 'remove_outfit',
        body: JSON.stringify({email: email, look_name: look_name, prod_id: prod_id, outfit_date: outfit_date}),
        json: true
    };

    function handleResponse(error, response, body){
        if (!error && response.statusCode === 200) {
            res.send(body);
        }
    }

    request(options, handleResponse);
});


app.post('/api/get_products', function (req, res) {
    const prod_hashes = req.body.prod_hashes;
    const sex = req.body.sex;

    const options = {
        method: 'POST',
        url: api_base_url + 'get_products',
        body: JSON.stringify({
            prod_hashes: prod_hashes,
            sex: sex
        }),
        json: true
    };

    function handleResponse(error, response, body){
        if (!error && response.statusCode === 200) {
            res.send(body);
        }
    }

    request(options, handleResponse);
});


app.post('/api/get_image', function (req, res) {
    const img_hash = req.body.img_hash;
    const sex = req.body.sex;

    let options = {
        method: 'POST',
        url: api_base_url + 'get_image',
        body: {
            img_hash: img_hash,
            sex: sex
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


app.post('/api/get_prod_hash', function (req, res) {
    const img_hash = req.body.img_hash;
    const sex = req.body.sex;

    const options = {
        method: 'POST',
        url: api_base_url + 'get_prod_hash',
        body: JSON.stringify({
            img_hash: img_hash,
            sex: sex
        }),
        json: true
    };

    function handleResponse(error, response, body){
        if (!error && response.statusCode === 200) {
            res.send(body);
        }
    }

    request(options, handleResponse);
});


app.post('/api/recommend_tags', function (req, res) {
    const email = req.body.email;
    const sex = req.body.sex;
    const req_looks = req.body.req_looks;

    const options = {
        method: 'POST',
        url: api_base_url + 'recommend_tags',
        body: {
            email: email,
            sex: sex,
            req_looks: req_looks
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


app.post('/api/recommend_random', function (req, res) {
    let sex = req.body.sex;
    // console.log(sex);
    if (!sex) {
        sex = ''
    }
    const options = {
        method: 'POST',
        url: api_base_url + 'recommend_random',
        body: {sex: sex},
        json: true
    };

    function handleResponse(error, response, body){
        if (!error && response.statusCode === 200) {
            res.send(body);
        }
    }

    request(options, handleResponse);
});


app.post('/api/recommend_deals', function (req, res) {
    const sex = req.body.sex;
    const cats = req.body.cats;
    const shops = req.body.shops;
    const brands = req.body.brands;

    const options = {
        method: 'POST',
        url: api_base_url + 'recommend_deals',
        body: {
            sex: sex,
            cats: cats,
            shops: shops,
            brands: brands
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


app.post('/api/add_loading_content', function (req, res) {
    const content_type = req.body.content_type;
    const content_text = req.body.content_text;
    const content_image = req.body.content_image;

    const options = {
        method: 'POST',
        url: api_base_url + 'add_loading_content',
        body: {
            content_type: content_type,
            content_text: content_text,
            content_image: content_image
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


app.get('/api/get_random_loading_content', function (req, res) {
    let options = {
        method: 'GET',
        url: api_base_url + 'get_random_loading_content'
    };

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
