const multer = require('multer');

let storage = multer.diskStorage({  //上穿路径处理上传之后重命名
    destination: `${process.cwd()}/public/img`,
    // destination: path.join(process.cwd(),'public'),
    filename: function (req,file,callback) {
        //console.log(file);
        let filename = (file.originalname).split(".");
        callback(null,`${Date.now()}.${filename[filename.length-1]}`)
    }
});
//使用信息
let upload = multer({
    storage: storage
});

module.exports = upload;