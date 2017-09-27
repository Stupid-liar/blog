const http = require('http'),
    express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    session = require('express-session'),
    sql = require('./module/mysql');

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

app.use('/',require('./router/index'));
http.createServer(app).listen(3000);