var MongoClient = require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectID;
// var DB_CONN_STR = 'mongodb://124.42.118.165:20000/Location'; 
var DB_CONN_STR = 'mongodb://localhost/Location';
var TABLE_NAME = 'cafe' 

module.exports.getList = function(latitude, longitude, distance) { 
  var p = new Promise(function(resolve, reject){
    MongoClient.connect(DB_CONN_STR, function(err, db) {
      if(err){
        console.log(err)
        reject(err);
        return;
      }
      console.log("连接成功！");
      var collection = db.collection(TABLE_NAME);
      db.command({
         geoNear: TABLE_NAME,
         near: { type: "Point", coordinates: [ longitude, latitude ] },
         spherical: true,
         minDistance: 0,
         maxDistance: distance
      }, function(err, result){
          if(err){
            console.log(err)
            reject(err)
            return;
          }
          resolve(result['results'])
      });
    }); 
  });
  return p;
}

module.exports.getDetail = function(id) { 
  var p = new Promise(function(resolve, reject){
    MongoClient.connect(DB_CONN_STR, function(err, db) {
      if(err){
        console.log(err)
        reject(err);
        return;
      }
      console.log("连接成功！");
      var collection = db.collection(TABLE_NAME);
      var whereStr = {"_id": ObjectID(id)};
      collection.find(whereStr).toArray(function(err, result) {
        if(err){
            console.log(err)
            reject(err)
            return;
          }
          resolve(result)
      });
    }); 
  });
  return p;
}

module.exports.addShop = function(data) { 
  var p = new Promise(function(resolve, reject){
    MongoClient.connect(DB_CONN_STR, function(err, db) {
      if(err){
        console.log(err)
        reject(err);
        return;
      }
      console.log("连接成功！");
      var collection = db.collection(TABLE_NAME);
      collection.ensureIndex({"coordinates":"2dsphere"},function(){
        collection.insert(data, function(err, result) { 
          if(err){
            console.log(err)
            reject(err)
            return;
          }
          resolve(result)
        });
      })
    }); 
  });
  return p;
}
