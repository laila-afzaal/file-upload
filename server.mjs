import express from "express"
import cors from "cors"
import mongoose from 'mongoose';
import fs from 'fs';
import admin from "firebase-admin";
import { stringToHash } from "bcrypt-inzi";

// https://firebase.google.com/docs/storage/admin/start
var serviceAccount = { // create service account from here: https://console.firebase.google.com/u/0/project/delete-this-1329/settings/serviceaccounts/adminsdk
  
  "type": "service_account",
  "project_id": "ecommerce-app-6a346",
  "private_key_id": "a630da87751cd7d705b7a519c71b776dc7876c1f",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCSsXbAEJHXvCqx\nAVrzNPQeBUK2LDLjciHTT8BTyHc8ZIMx7leKXpmyEj+v14+EYxTLGLmbj/Ha0c7b\nMlGE7FWkT/lIrUNwlCIimNti1rwh09efRo1AyyIR1NRX++wv6G2YvPNk5Ho3xdYc\nnhapc5XwELPaI/4L3WMp1L+4x5WMOD1zjBkOA5NWd/uKOCUR69OEjQwPlaY7e/Ih\nOVbddiu1bc/LIlKAlBtZVavODRHowHUK53Ly45tQIJIwGin20Xyix6pg4t2EDuGg\nmZYFXI3v+lgK33moYY+Gf71WzoyFs2oRb0XGqbqKAPH32vkQRpHsD4FHU9MhTPU8\ny24djf+bAgMBAAECggEAFS5ovizmUidKZsqSTmHMCfWqf1F8e5kER1XRqIdeqCq/\nQttuan1kZfD6nzJZ97yyyOymCE9NldILs1zdpnrVlucxUIwsG7pX/3Tg4LGu8pd7\nH/V4+e0a20ZG7vliTjyabp6B6oSPHTSEyRcOoKMe+E4BGjNuQFpUMjsU/+JZtqhE\nR844cpnoavzlf/YM1mmiF3AJNjcdelZnuyj505vlqkkuzcvTnn4gjtMaN5Xw9jGh\n7SUZA3OWoNg5rjq587MjmJ3UALBhO1+waQNpP4WeF2iCQMoEQncxuHlGKBLYBfDJ\nZNXKiuzWR8tuAtRkCrXTzkd7TbBNc9plbqilb6L+aQKBgQDD5rFrwjiNrWFoCr8K\nzIII2YAB4XYQJfqOf/Zx6xLIg6+AXpahWLLinvTbwrUB30d2A4pow+7WoCMz8KHg\nuduEIquJsHE8dOoPgv4TFQL6695ECE4Rxiq3p8krHMZsjx1oG1s0gLxQIaQ6E1iP\nJsthxLKaB/5ebZFqJfxO+70ljwKBgQC/sixledPCdt6sCeMS2J8ZVemcNDp8J738\nRfBwHgghliPkDWJYHdmeT/ZANp/DvqDzKJxP1FAtZZlCQ1q9VkCurh12rQZeAImZ\nGLc7w9Mh9kT9teSsO5x5rmyXi/KIvomwivHO+X5AG26a/kehsSk0USbPI4jFZWtF\nKAMyD7S3NQKBgEcms8v6p8W1ckpylL6cVqJWNOr584Kb+KvnCCCKC7FuOsD6GeWS\nLK6oozBqQInkibTwRkYU29tyIDcOMA1KE9OjMAB7aDVYFWb64cMWf5WZM4osJgbI\nnd1EgIk7E0p8lGaqgO7JzxufjGFXg3PC2F2zLldJjfbH/ue50jDxt9o7AoGBAJm2\n/fLBJhUhzJyXsQZDvhBK2/Dt0JgOJkJMsui0rECCbHVKZjnSddaEuCn1o1cLXXSe\nc/lvfntopOSFrhV1PJjV9bpcNGbcd3nUX9oExSDOobPwT1Xs1ySbwWgkSG9ummp+\ngDg/yAUP+jk+/aGiti/FgyFGlT30fXgPBcD25yqhAoGAf9z+HGWArkWL6a9gvNyP\n3EvWIybjKt7vJjin8X1TJ73GfQJkjFo2A5BPxGniASAqBDhIWnBGA87lTWR4ByKJ\n7RVSDP1QXdgQ1ybSnM47qGaluxsW6oWQttZNArRpHSLBhp/dCOapRlF0ozycNP7p\nZn+bF9YW6F9aLPq5WTXQelo=\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-ch1nd@ecommerce-app-6a346.iam.gserviceaccount.com",
  "client_id": "116435299505096880357",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-ch1nd%40ecommerce-app-6a346.iam.gserviceaccount.com"

};
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://ecommerce-app-6a346.firebaseio.com"
});
const bucket = admin.storage().bucket("gs://ecommerce-app-6a346.appspot.com");

//==============================================

//==============================================
import multer from 'multer'
const storageConfig = multer.diskStorage({ // https://www.npmjs.com/package/multer#diskstorage
    destination: './uploads/',
    filename: function (req, file, cb) {

        console.log("mul-file: ", file);
        cb(null, `${new Date().getTime()}-${file.originalname}`)
    }
})
var upload = multer({ storage: storageConfig })

//==============================================

const port = process.env.PORT || 5000;
let dbURI = process.env.MONGODBURI || 'mongodb+srv://xyz:321@cluster0.zwm89fi.mongodb.net/fileUpload?retryWrites=true&w=majority';


const app = express();
app.use(express.json()); //parsing body
// app.use(cookieParser()); //parsing cookies

app.use(cors({
    origin: ['http://localhost:3000', 'https://ecommerce-app-6a346.web.app', "*" ],
    credentials: true
}));


const userSchema = new mongoose.Schema({

    name: { type: String },
    email: { type: String, required: true },
    password: { type: String, required: true },
    profilePicture: { type: String, required: true },

    createdOn: { type: Date, default: Date.now },
});
const userModel = mongoose.model('Users', userSchema);



app.post("/signup", upload.any(), (req, res) => {

    let body = req.body;

    // console.log("body: ", body);
    // console.log("body: ", body.name);
    // console.log("body: ", body.email);
    // console.log("body: ", body.password);

    console.log("file: ", req.files[0]);

    if (!body.name
        || !body.email
        || !body.password
    ) {
        res.status(400).send(
            `required fields missing, request example: 
                {
                    "name": "John",
                    "email": "abc@abc.com",
                    "password": "12345"
                }`
        );
        return;
    }


    // https://googleapis.dev/nodejs/storage/latest/Bucket.html#upload-examples
    bucket.upload(
        req.files[0].path,
        {
            destination: `profilePhotos/${req.files[0].filename}`, // give destination name if you want to give a certain name to file in bucket, include date to make name unique otherwise it will replace previous file with the same name
        },
        function (err, file, apiResponse) {
            if (!err) {
                // console.log("api resp: ", apiResponse);

                // https://googleapis.dev/nodejs/storage/latest/Bucket.html#getSignedUrl
                file.getSignedUrl({
                    action: 'read',
                    expires: '03-09-2491'
                }).then((urlData, err) => {
                    if (!err) {
                        console.log("public downloadable url: ", urlData[0]) // this is public downloadable url 

                        // delete file from folder before sending response back to client (optional but recommended)
                        // optional because it is gonna delete automatically sooner or later
                        // recommended because you may run out of space if you dont do so, and if your files are sensitive it is simply not safe in server folder
                        try {
                            fs.unlinkSync(req.files[0].path)
                            //file removed
                        } catch (err) {
                            console.error(err)
                        }


                        // check if user already exist // query email user
                        userModel.findOne({ email: body.email }, (err, user) => {
                            if (!err) {
                                console.log("user: ", user);

                                if (user) { // user already exist
                                    console.log("user already exist: ", user);
                                    res.status(400).send({ message: "user already exist,, please try a different email" });
                                    return;

                                } else { // user not already exist

                                    stringToHash(body.password).then(hashString => {

                                        userModel.create({
                                            name: body.name,
                                            email: body.email.toLowerCase(),
                                            password: hashString,
                                            profilePicture: urlData[0]
                                        },
                                            (err, result) => {
                                                if (!err) {
                                                    console.log("data saved: ", result);
                                                    res.status(201).send({
                                                        message: "user is created",
                                                        data: {
                                                            name: body.name,
                                                            email: body.email.toLowerCase(),
                                                            profilePicture: urlData[0]
                                                        }
                                                    });
                                                } else {
                                                    console.log("db error: ", err);
                                                    res.status(500).send({ message: "internal server error" });
                                                }
                                            });
                                    })

                                }
                            } else {
                                console.log("db error: ", err);
                                res.status(500).send({ message: "db error in query" });
                                return;
                            }
                        })


                    }
                })
            } else {
                console.log("err: ", err)
                res.status(500).send();
            }
        });








});


app.get("/users", async (req, res) => {
    try {
        let users = await userModel.find({}).exec();
        console.log("all user : ", users);

        res.send({
            message: "all users",
            data: users
        });
    } catch (error) {
        res.status(500).send({
            message: "failed to get product"
        });
    }
})



app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})


///////////////////// - MongoDB Connection Code- ////////////////////////////////

// let dbURI = 'mongodb://localhost/mydatabase';
mongoose.connect(dbURI);


////////////////mongodb connected disconnected events///////////////////////////////////////////////
mongoose.connection.on('connected', function () {//connected
  console.log("Mongoose is connected");
  // process.exit(1);
});

mongoose.connection.on('disconnected', function () {//disconnected
  console.log("Mongoose is disconnected");
  process.exit(1);
});

mongoose.connection.on('error', function (err) {//any error
  console.log('Mongoose connection error: ', err);
  process.exit(1);
});

process.on('SIGINT', function () {/////this function will run jst before app is closing
  console.log("app is terminating");
  mongoose.connection.close(function () {
    console.log('Mongoose default connection closed');
    process.exit(0);
  });
});
//boiler plate from : https://github.com/mInzamamMalik/MERN-Stack-Web-Development-Class/blob/main/03.%20nodejs/7.%20express%20login%20signup%20with%20database/server.mjs
////////////////mongodb connected disconnected events///////////////////////////////////////////////