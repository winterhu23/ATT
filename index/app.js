const qs = require('qs')
const http = require('http')
const fs = require('fs')
const mysql = require('mysql')

let connection = mysql.createConnection({
    host:'',
    user:'',
    password:'',
    database:''
})

connection.connect();


// http   
//     .createServer((req, res)=>{
//         let url = req.url
//         if(url === '/'){
//             fs.readFile('./views/login.html',(err, data)=>{
//                 if(err){
//                     return res.end('404 Not Found')
//                 }
                
//                 res.end(data.toString())
//                 //res.end(data)
//             })
//         }
//     })
//     .listen(3000,()=>{
//         console.log('server is running')
//     })