const express = require('express'),
    router = express.Router(),
    sql = require('../module/mysql');
//get post 任何形式的访问都会走这一条路由

router.use((req,res,next) =>{
    if(req.session.admin){
        next();
    }else{
        res.send('请使用管理员账号的登录')
    }
});
router.get('/',(req,res) =>{
    res.render('admin/admin');
});
router.get('/user',(req,res) =>{
    sql('select * from user',(err,data) =>{
        res.render('./admin/user',{data:data});
    });
})
router.post('/user',(req,res) =>{
    //console.log(req.body);
    let id = req.body.id;
        sql('delete from user where id = ?',[id],(err,data) =>{
            res.send('删除成功');
        })
});
router.get('/user/updateuser',(req,res)=>{
    sql('select * from user where id=?',[req.query.id],(err,data) =>{
        res.render('admin/updateuser',{data:data});
    });
})
router.post('/user/updateuser',(req,res) =>{
    console.log(req.body);
    let id = req.body.id,
        newuser = req.body.newuser,
        newadmin = req.body.newadmin;
    sql('UPDATE `user` SET `username` = ?, `admin` = ? WHERE `user`.`id` = ?;',[newuser,newadmin,id],(err,data) =>{
        res.send('修改成功')
    })

});

module.exports = router;