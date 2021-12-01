const express = require("express");
const morgan = require("morgan");
const connectionRoutes = require("./routes/connectionRoutes.js");
const methodOverride = require("method-override");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const userRoutes = require("./routes/userRoutes.js");
const User = require("./models/user");
const mongoUrl= process.env.mongoUrl || 'mongodb://mongo/project'
const app = express();
//Creates the application



//connect to database
mongoose.connect(mongoUrl, 
                {useNewUrlParser: true, useUnifiedTopology: true })
.then(()=>{
    console.log('mongo connected');
    //start the server
})
.catch(err=>console.log(err.message));

//mount middleware
app.use(
    session({
        secret: "apoawoiepoadnfiapsda",
        resave: false,
        saveUninitialized: false,
        store: new MongoStore({mongoUrl}),
        cookie: {maxAge: 60*60*1000} 
    })
);

app.use(flash());

app.use((request, response, next) => {
    response.locals.user = request.session.user || null;
    response.locals.errorMessages = request.flash('error');
    response.locals.successMessages = request.flash('success');
    next();
});

app.use(express.static("public"));
app.use(express.urlencoded({extended: true}));
app.use(morgan("tiny"));
app.use(methodOverride("_method"));

//set up routes
app.get("/", function(request, response, next){
    let id = request.session.user;

    User.findById(id)
    .then(user => response.render("index.ejs", {user}))
    .catch(err => next(err));

});

app.get("/about", function(request, response, next){
    let id = request.session.user;

    User.findById(id)
    .then(user => response.render("about.ejs", {user}))
    .catch(err => next(err));
});

app.get("/contact", function(request, response){
    let id = request.session.user;

    User.findById(id)
    .then(user => response.render("contact.ejs", {user}))
    .catch(err => next(err));
});

app.use("/connections", connectionRoutes); 
app.use("/users", userRoutes);

app.use(function (request, response, next){
    let err = new Error("The server cannot locate " + request.url);
    err.status = 404;
    next(err);
});

app.use(function (err, request, response, next){
    
    if(!err.status){
        err.status = 500;
        err.message = ("Internal Server Error");
    }

    let id = request.session.user;

    User.findById(id)
    .then(user => {
        response.status(err.status);
        response.render("error.ejs", {user, error: err})
    })
    .catch(err => next(err));
});
module.exports=app