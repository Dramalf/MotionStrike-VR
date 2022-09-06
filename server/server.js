// const fs = require('fs');
const  app = require('express')();
// const options = {
//   key: fs.readFileSync('/home/cert/dramalf.xyz.key'),
//   cert: fs.readFileSync('/home/cert/dramalf.xyz.pem')
//   };
// const https=require('https');
// const  server = https.createServer(options,app).listen(8080,function(){
//   console.log("SERVER LISTENING");
// });
// const io= require("socket.io")(8080, {
//     cors: {
//       origin: ["https://116.62.218.178:80"]
//     }
//   })
const https =require("https");
const Server=require("socket.io")


const fs = require('fs');
// 引入证书
const options = {
  key: fs.readFileSync('/home/cert/dramalf.xyz.key'),
  cert: fs.readFileSync('/home/cert/dramalf.xyz.pem')
  };
  app.get('/', function(req, res) {
    res.send('hello node')
  })
const httpServer = https.createServer(options,app).listen(8081);
const io = Server(httpServer, {
  // options
  cors: {
    origin: ["https://192.168.43.123:3000"]
  }
});
function getPublicIP() {
  const os = require("os");
  const ifaces = os.networkInterfaces();
  let en0;

  Object.keys(ifaces).forEach((ifname) => {
    let alias = 0;

    ifaces[ifname].forEach(function (iface) {
      if ("IPv4" !== iface.family || iface.internal !== false) {
        // skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
        return;
      }

      if (alias >= 1) {
        // this single interface has multiple ipv4 addresses
        en0 = iface.address;
        console.log(ifname + ":" + alias, iface.address);
      } else {
        // this interface has only one ipv4 adress
       // console.log(ifname, iface.address);
        en0 = iface.address;
      }
      ++alias;
    });
  });
  return en0;
};

io.on("connection", (socket) => {
  console.log(socket.handshake.headers["user-agent"])
  socket.on('aaa',(e)=>{
    console.log(e)
  })
});
const ip = getPublicIP();