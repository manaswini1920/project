const model = require("../models/user");
const Connection = require("../models/connection");

exports.new = (request, response, next) => {
    response.render("./user/new");
};

exports.create = (request, response, next) => {
    let user = new model(request.body);
    user.save()
    .then(user => response.redirect('/users/login'))
    .catch(err => {
        if(err.name === "ValidationError"){
            request.flash("error", err.message);
            return response.redirect('/users/new');
        }

        if(err.code === 11000){
            request.flash('error', 'Email is Already in Use!');
            return response.redirect('/users/new');
        }

        next(err);
    });
};

exports.getUserLogin = (request, response, next) => {
    return response.render('./user/login');
};

exports.login = (request, response, next) => {
    let email = request.body.email;
    let password = request.body.password;

    model.findOne({email: email})
    .then(user => {
        if(!user){
            request.flash('error', "Wrong Email Address!");
            response.redirect('/users/login');
        }else{
            user.comparePassword(password)
            .then(result => {
                if(result){
                    request.session.user = user._id;
                    request.flash('success', 'You have successfully logged in!');
                    response.redirect('/users/profile');
                }else{
                    request.flash('error', 'Wrong Password!')
                    response.redirect('/users/login');
                }
            })
        }
    })

    .catch(err => next(err));
};

exports.profile = (request, response, next) => {
    let id = request.session.user;
    Promise.all([model.findById(id), Connection.find({host_Name: id})])
    .then(results => {
        const [user, connections] = results;
        response.render("./user/profile", {user, connections});
    })
    .catch(err=>next(err));
};

exports.logout = (request, response, next) => {
    request.session.destroy(err => {
        if(err)
            return next(err);
        else
            response.redirect('/')
    });
};