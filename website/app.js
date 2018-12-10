// const http = require('http');
// const port = process.env.PORT || 3000
// const server = http.createServer((req, res) => {
//     res.statusCode = 200;
//     res.setHeader('Content-Type', 'text/html');
//     res.setHeader('Access-Control-Allow-Origin', '*');

//     // Request methods you wish to allow
//     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

//     // Request headers you wish to allow
//     res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

//     // Set to true if you need the website to include cookies in the requests sent
//     // to the API (e.g. in case you use sessions)
//     res.setHeader('Access-Control-Allow-Credentials', true);
//     res.end('<h1>Hello World</h1>');
// });
// server.listen(port, () => {
//     console.log(`Server running at port ` + port);
// });


// var http = require('http');
// var fs = require('fs');
// var path = require('path');
// const port = process.env.PORT || 3000

// http.createServer(function (request, response) {
//     console.log('request starting...');

//     var contentType = 'text/html';
//     console.log('Path: ' + __dirname);
//     fs.readFileSync(path.join(__dirname, '/PlayerVsCPU.html'), function (error, content) {
//         if (error) {
//             if (error.code == 'ENOENT') {
//                 fs.readFile('./404.html', function (error, content) {
//                     response.writeHead(200, { 'Content-Type': contentType });
//                     response.end(content, 'utf-8');
//                 });
//             }
//             else {
//                 response.writeHead(500);
//                 response.end('Sorry, check with the site admin for error: ' + error.code + ' ..\n');
//                 response.end();
//             }
//         }
//         else {
//             response.writeHead(200, { 'Content-Type': contentType });
//             response.setHeader('Access-Control-Allow-Origin', '*');

//             // Request methods you wish to allow
//             response.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

//             // Request headers you wish to allow
//             response.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

//             // Set to true if you need the website to include cookies in the requests sent
//             // to the API (e.g. in case you use sessions)
//             response.setHeader('Access-Control-Allow-Credentials', true);
//             // response.end(content, 'utf-8');
//             res.end('<h1>Hello World</h1>');
//         }
//     });

// }).listen(port);

var express = require('express'); 
var app = express();

console.log('dir: ' + __dirname);
app.use(express.static(__dirname + '/public'));

app.listen(process.env.PORT || 3000);