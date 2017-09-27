const express = require('express'),
    router = express.Router(),
    crypto = require('crypto'),
    sql = require('../module/mysql');

router.get('/',(req,res) =>{
    //console.log(req.cookies);
    res.render('login')
});
router.post('/',(req,res)=>{
    const user = req.body['name'],
    pass = req.body['pass'],
    md5 = crypto.createHash('md5');
    sql('SELECT * FROM user where username = ?',[user],(err,data) => {
    //console.log(data);
    if(data.length == 0){
        res.json({
            result:'用户名不存在'
        });
        return
    }
    let newpass = md5.update(pass).digest('hex');
    if(data[0]['pass'] == newpass){
        // 登陆成功
        // 1. cookie的名称  2.数据  3.过期时间
        res.cookie('login',{ name:user } ,{ maxAge: 1000*60*60*24 } );
        req.session.admin = Number(data[0]['admin']);//所有后台页面都通用的
        res.json({
            result:'成功'
        });
    }else{
        // 登陆失败
        res.json({
            result:'用户名或密码错误'
        });
        }
    })
});


module.exports = router;