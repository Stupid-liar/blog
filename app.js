const http = require('http'),
    express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    session = require('express-session'),
    sql = require('./module/mysql'),
    path = require('path'),
    ueditor = require("./ue");

app.set('views',__dirname+'/views');
app.set('view engine','ejs');
app.use(express.static(__dirname+'/public'));
app.use(bodyParser.json());//接受数据类型json
app.use(bodyParser.urlencoded( { extended:true } ));
app.use(cookieParser('cdd'));// 密钥
app.use(session({secret: 'cdd'}));//密钥

app.use(function (req,res,next){
    if(req.cookies['login']){
        res.locals.login = req.cookies.login.name;
        //console.log(res.locals.login);
        if(typeof req.session.admin){
            sql('SELECT * FROM user where username = ?',[res.locals.login],(err,data) => {
                // console.log(data)
                req.session.admin = Number(data[0]['admin']);
                next()
            })

        } else{
            next()
        }
    }else {
        next();
    }

    //继续往下执行

});//保存cookie
app.use("/ueditor/ue", ueditor(path.join(__dirname, 'public'), function (req, res, next) {
    //客户端上传文件设置
    var imgDir = '/img/ueditor/'
    var ActionType = req.query.action;
    if (ActionType === 'uploadimage' || ActionType === 'uploadfile' || ActionType === 'uploadvideo') {
        var file_url = imgDir;//默认图片上传地址
        /*其他上传格式的地址*/
        if (ActionType === 'uploadfile') {
            file_url = '/file/ueditor/'; //附件
        }
        if (ActionType === 'uploadvideo') {
            file_url = '/video/ueditor/'; //视频
        }
        res.ue_up(file_url); //你只要输入要保存的地址 。保存操作交给ueditor来做
        res.setHeader('Content-Type', 'text/html');
    }
    //  客户端发起图片列表请求
    else if (req.query.action === 'listimage') {
        var dir_url = imgDir;
        res.ue_list(dir_url); // 客户端会列出 dir_url 目录下的所有图片
    }
    // 客户端发起其它请求
    else {
        // console.log('config.json')
        res.setHeader('Content-Type', 'application/json');
        res.redirect('/ueditor/nodejs/config.json');
    }
}));
app.use('/',require('./router/index'));
http.createServer(app).listen(3000);