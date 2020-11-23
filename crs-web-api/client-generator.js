var fs = require('fs');
// 

var x =fs.readFileSync("./client-template/main");

fs.writeFile("1.txt",x,()=>{});