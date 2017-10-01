const express = require('express'),
    router = express.Router(),
    sql = require('../module/mysql');

router.get('/',(req,res) =>{
    res.locals.admin = req.session.admin;
    //根据ID从新到旧进行排序（降序）
    sql('select * from article order by id desc limit 0,4',(err,data) =>{
        res.render('index.ejs',{data:data});
    })

    //console.log(res.locals.admin)

});
router.get('/article',(req,res) =>{
    sql('select * from article where id = ?',[req.query.id],(err,data) =>{
        res.render('article.ejs',{data:data});
    })

});
// 用login代表的登录  用reg代表的注册
router.use('/login',require('./login'));
// http://localhost:3000/reg /
router.use('/reg',require('./reg'));
router.use('/admin',require('./admin'));
router.get('/logout',(req,res) => {
    res.clearCookie('login');
    req.session.admin = 0;
// 网址重定向
    res.redirect('/')
});

module.exports = router;