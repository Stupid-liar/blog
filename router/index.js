const express = require('express'),
    router = express.Router(),
    sql = require('../module/mysql');

router.get('/',(req,res) =>{
    res.locals.admin = req.session.admin;
    //根据ID从新到旧进行排序（降序）
    sql('select * from article order by id desc limit 0,4',(err,data) =>{
        res.render('index.ejs',{data:data});
    });

    //console.log(res.locals.admin)

});
router.get('/search',(req,res) =>{
    // console.log(req.query.search)
    sql('select * from article where title like ?',['%'+ req.query.search +'%'],(err,data) =>{
        if(err||data.length === 0){
            res.send('没有查到相关')
            return;
        }
        res.render('search.ejs',{data: data})
    })
});
router.get('/article/list-:page.html',(req,res) =>{
    //console.log(req.params.page)
    //console.log(req.query.type)
    sql('select * from article where tag = ? ',[req.query.type],(err,datan) =>{
        if(datan.length === 0){
            res.send('博主很懒什么都没有留下');
            return;
        }
        sql('select * from article where tag = ? order by id desc limit ?,2',[req.query.type,(Number(req.params.page)-1)*2],(err,data)=>{
            // console.log(data)
            if(data.length === 0){
                res.send('博主很懒什么都没有留下');
             }
            res.render('article_list.ejs',{data: data,num: datan})
        })
    });

});
router.get('/article/:id.html',(req,res) =>{
    sql('select * from article where id = ?',[req.params.id],(err,data) =>{
        sql('UPDATE `article` SET `read` = ? WHERE `article`.`id` = ?',[Number(data[0]['read'])+1,data[0]['id']],(err,data2) => {
            // console.log(Number(data[0]['read'])+1)
            // console.log(data[0]['id'])
        })
        if(data.length == 0){
            res.status(404).render('404.ejs')//返回页面的状态码
            return
        }
        sql('select * from articlepinglun where pid = ?',[req.params.id],(err,data1) =>{
            res.render('article.ejs',{data:data,pinglun:data1 });
        })

    })
});
router.post('/article/:id.html',(req,res) =>{
    //console.log(req.params)
    //console.log(req.body)
    sql('insert into articlepinglun (id,uid,pid,content) values (0,?,?,?)',[req.body.uid,req.params.id,req.body.content],(err,data) => {
        res.send('成功');
    })
})



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