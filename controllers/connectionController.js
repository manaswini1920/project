const model = require("../models/connection.js");
const User = require("../models/user");

//GET /connections; send all connections to the user
exports.index = function(request, response, next){
    let id = request.session.user;
    Promise.all([model.find(), User.findById(id)])
    .then(results => {
        const [connections, user] = results;
        response.render('./connection/connections.ejs', {connections, user})
    })
    .catch(err => next(err));
};

//GET /connections/new; send HTML form for creating a new connection.
exports.new = function(request, response, next){
    let id = request.session.user;

    User.findById(id)
    .then(user => {
        response.render("connection/newConnection", {user});
    })
    .catch(err => next(err));
    
};

//POST /connections; create a new connection
exports.create = function(request, response, next){
    request.body.imageURL = "/images/no-image-available.jpeg";

    let connection = new model(request.body);
    connection.host_Name = request.session.user;
    connection.save()
    .then(connection => response.redirect("/connections"))
    .catch(err => {
        if(err.name === "ValidationError"){
            err.status == 400;
            request.flash("error", err.message);
            response.redirect("back");;
        }
        next(err);
    });
    
};

//GET /connections/:id; send details of connection identified by id
exports.show = function(request, response, next){
    let connectionId = request.params.id;
    let userId = request.session.user;

    //Find the id in the database that matches the one give by the user
    Promise.all([model.findById(connectionId).populate("host_Name", "firstName lastName" ), User.findById(userId)])
    .then(results =>{

        const [connection, user] = results;

        if(connection) {
            return response.render("./connection/connection.ejs",{connection, user});
        }else{
            let err = new Error("Cannot find a connection with id " + connectionId);
            err.status = 404;
            next(err);
        }
    })
    .catch(err=>next(err));
};

//GET /connections/:id/edit; send HTML form for editing an existing connection
exports.edit = function(request, response, next){
    let connectionId = request.params.id;
    let userId = request.session.user;

    //Find the id in the database that matches the one give by the user
    Promise.all([model.findById(connectionId), User.findById(userId)])
    .then(results => {

        const [connection, user] = results;

        if (connection) {
            return response.render("./connection/edit.ejs", {connection, user});
        } else {
            let err = new Error("Cannot find with a connection with id " + connectionId);
            err.status = 404;
            next(err);    
        }
    })
    .catch(err=>next(err));
};

//PUT /connections/:id; Update the connection identified by id
exports.update = function(request, response, next){
    let connection = request.body;
    let id = request.params.id;

    model.findByIdAndUpdate(id, connection, {useFindAndModify: false, runValidators: true})
    .then(connection => {
        if(connection){
            response.redirect("/connections/" + id);
        }else{
            let err = new Error("Cannot find a connection with id " + id);
            err.status = 404;
            next(err);    
        }
    })
    .catch(err => {
        if(err.name === 'ValidationError'){
            err.status == 400;
            request.flash("error", err.message);
            response.redirect("back");
        }
        next(err);
    });

};

//DELETE /connections/:id; delete the connection identified by id
exports.delete = function(request, response, next){
    let id = request.params.id;

    model.findByIdAndDelete(id, {useFindAndModify: false})
    .then(connection => {
        if (connection) {
            response.redirect("/connections/");
        } else {
            let err = new Error("Cannot find a connection with id " + id);
            err.status = 404;
            return next(err);    
        }
    })
    .catch(err=>next(err));
};

