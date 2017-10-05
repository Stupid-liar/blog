const multer = require('multer');

let storage = multer.diskStorage({  //上穿路径处理上传之后重命名
    destination: `${process.cwd()}/public/img/bg`,
    // destination: path.join(process.cwd(),'public'),
    filename: function (req,file,callback) {
        //console.log(file);
        let filename = (file.originalname).split(".");
        callback(null,`${Date.now()}.${filename[filename.length-1]}`)
    }
});
// let fileFilter = function (req,file,callback) {
//     if(file.mimetype === 'imgage/gif'|| file.mimetype === 'imgage/jpg'|| file.mimetype === 'imgage/png'){  //只允许gif上传
//         callback(null,true)
//     }else{
//         callback('图片格式错误，只可上传jpg或png或gif格式',false)
//     }
// };
//使用信息
let upload = multer({
    storage: storage
    // fileFilter: fileFilter,
});

module.exports = upload;