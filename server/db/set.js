var file = require('./shanghai.json');
var MongoClient = require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectID;
// var DB_CONN_STR = 'mongodb://localhost/Location'; 
var DB_CONN_STR = 'mongodb://124.42.118.165:20000/Location'; 
var TABLE_NAME = 'cafe' 

var insertData = function(db, callback) {  
  //连接到表  
  var collection = db.collection(TABLE_NAME);

  var whereStr = {};
  collection.find(whereStr, function(err, result) {
    if(err){
      console.log('Error:'+ err);
      return;
    }     
    callback(result);
  });
  // db.command({
  //    geoNear: "test2",
  //    near: { type: "Point", coordinates: [ 121.441052, 31.226492 ] },
  //    spherical: true,
  //    minDistance: 0,
  //    maxDistance: 7000
  //  }, function(err, res){
  //    if(err){
  //       console.log(err)
  //       return
  //    }
  //    console.log(res)
  //  });


  //插入数据
  // var data = file['features'];
  // var res = [];

  // function getDesc(properties){
  //   var str = []
  //   for(var prop in properties){
  //     if(prop !== '名称' 
  //       && prop !== 'marker-color' 
  //       && prop !== 'marker-symbol' 
  //       && prop !== "下载速度" 
  //       && prop !== "Speedtest 链接"){
  //       var value = properties[prop]
  //       str.push(prop+":"+value)
  //     }
  //   }
  //   return str.join(';')
  // }

  // data.forEach(function(item, index){
  //   res.push({
  //     // id: index,
  //     name: item['properties']["名称"],
  //     description: getDesc(item['properties']),
  //     coordinates: item["geometry"]["coordinates"],
  //     network: parseFloat(item['properties']["下载速度"])
  //   })
  // })


  // collection.ensureIndex({"coordinates":"2dsphere"},function(){
  //   collection.insert(res, function(err, result) { 
  //     if(err){
  //         console.log('Error:'+ err);
  //         return;
  //     }     
  //     callback(result);
  //   });
  // })

  // var whereStr = {"_id": ObjectID("58388baa91b020646b381542")};
  // collection.find(whereStr).toArray(function(err, result) {
  //   if(err)
  //   {
  //     console.log('Error:'+ err);
  //     return;
  //   }     
  //   callback(result);
  // });
}

MongoClient.connect(DB_CONN_STR, function(err, db) {
  if(err){
    console.log(err)
    return;
  }
  console.log("连接成功！");
  insertData(db, function(result) {
      console.log(result);
      db.close();
  });
});
