const apikey =
  "http://api.openweathermap.org/data/2.5/weather?q=Tinsukia&appid=a5edb05e1e44f273552b97caf95af764";

  const http = require('http');
  const fs = require('fs');
  var requests = require("requests");

  const home = fs.readFileSync("home.html","utf-8");


  const server = http.createServer((req, res) => {
      const putValue = (tempVal, orgVal) => {
        let temprature = tempVal.replace("{%temp%}", orgVal.main.temp);
        temprature = temprature.replace("{%minTemp%}", orgVal.main.temp_min);
        temprature = temprature.replace("{%maxTemp%}", orgVal.main.temp_max);
        temprature = temprature.replace("{%location%}", orgVal.name);
        temprature = temprature.replace("{%country%}", orgVal.sys.country);
        return temprature;
      };

    if(req.url == "/"){

      requests(apikey)
      .on("data", (chunk) => {
        const objData = JSON.parse(chunk);
        const arrData = [objData];
        // console.log(arrData[0].main.temp);
        const realTimeData = arrData.map((val) =>
          putValue(home,val)).join("");     
      res.writeHead(200, { "Content-type": "text/html" });
      res.write(realTimeData);
      // console.log(realTimeData);
      });      
      requests(apikey).on("error", (err) => {
        console.log("connection closed due to error", err);
        res.end("Server error : 500");
      });
      requests(apikey).on("end", () => {
        res.end();
      });
    }
    else{
      res.writeHead(404, { "Content-type": "text/html" });
      res.end("Page Not Found");
    }
  });

  server.listen(8000,"127.0.0.1", () => {
    console.log("Server started\nListenting at port : 8000");
  })