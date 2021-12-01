const Connection = require("../models/connection");

//Check if the user is a guest
exports.isGuest = (request, response, next) => {
    if(!request.session.user){
        return next();
    }else{
        request.flash("error", "You are already logged in!");
        return response.redirect("/users/profile");
    }
};

//Check if the user is authenticated
exports.isLoggedIn = (request, response, next) => {
    if(request.session.user){
        return next();
    }else{
        request.flash("error", "Please login first!");
        return response.redirect("/users/login");
    }
};

//Check if the user is the author of the story
exports.isHost = (request, response, next) => {
    let id = request.params.id;
    Connection.findById(id)
    .then(connection => {
        if(connection.host_Name == request.session.user){
            return next();
        }else{
            let err = new Error("You are unauthorized to access that resource");
            err.status = 401;
            return next(err);
        }
    })
    .catch(err=>next(err));
};