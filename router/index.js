const express = require('express'),
    router = express.Router(),
    sql = require('../module/mysql');

router.get('/',(req,res) =>{
    res.locals.admin = req.session.admin;
    res.render('index.ejs');
    //console.log(res.locals.admin)

});

// 用login代表的登录  用reg代表的注册
router.use('/login',require('./login'));
// http://localhost:3000/reg /
router.use('/reg',require('./reg'));
router.use('/admin',require('./admin'));
router.get('/logout',(req,res) => {
    res.clearCookie('login');
// 网址重定向
    res.redirect('/')
});
module.exports = router;