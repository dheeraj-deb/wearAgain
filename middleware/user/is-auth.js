module.exports = (req, res, next) => {
    if(!req.session.isUserLoggedIn || req.session.user.isBlocked){
        return res.redirect('/user_signin')
    }
    next()
}