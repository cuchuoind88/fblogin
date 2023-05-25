
const cors=require('cors');
const allowedOrigins=['https://localhost:3443','http://localhost:3000'];
var corsWithOptions=(req,callback)=>{
        var corsOptions;
       console.log(req.header('Origin'));
     if(allowedOrigins.indexOf(req.header('Origin'))!=-1)
     {
        corsOptions = { origin: true };
     }
     else 
        {
        corsOptions = { origin: false };
        }
        callback(null, corsOptions);
}
exports.cors=cors();
exports.corsWithOptionss=cors(corsWithOptions);