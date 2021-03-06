const express = require('express'),
    router = express.Router(),
    sql = require('../module/mysql'),
    upload = require('../module/multer');
//配置信息

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
    //console.log(req.body);
    let id = req.body.id,
        newuser = req.body.newuser,
        newadmin = req.body.newadmin;
        sql('UPDATE `user` SET `username` = ?, `admin` = ? WHERE `user`.`id` = ?;',[newuser,newadmin,id],(err,data) =>{
            if(err){
            res.send('更新失败')
        }
        res.json({
        result: '成功'
        })
    })
});
router.get('/article',(req,res) => {
    res.render('admin/article')
})
//upload.array(),upload.files多个文件   多个文本框
router.post('/article',upload.single('cdd'),(req,res) => {
    let title = req.body.title,
        tag = req.body.tag,
        author = req.body.author,
        content = req.body.content;
        let img = "";
        if(req.file === undefined){
            img = '/img/bg/par.jpg';
            // console.log(9);
        }else{
            img = '/img/bg/' + req.file.filename;
        }
        // let img = '/img/bg/' + req.file.filename;

        // time = new Date().toLocaleString().substring(0,10);
        let time = new Date().toLocaleString();
    sql('INSERT INTO `article` (`id`, `title`, `tag`, `author`, `content`, `time`,`img`) VALUES (0,?,?,?,?,?,?)',[title,tag,author,content,time,img],(err,data) =>{
            if(err){
                res.send('保存失败')
                return
            }
            res.json({
                result: '保存成功'
            })
        })
})
module.exports = router;