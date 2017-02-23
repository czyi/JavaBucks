javabucks

API说明

1. 根据地理位置获取列表
http://localhost:3000/api/getList?lat=121.441052&lng=31.226492&dist=1000

2. 根据id获取详细信息
http://localhost:3000/api/getShopDetail/5838b7a4d4427d6ad6b81ef0

3. 添加新的咖啡店
http://localhost:3000/api/addNewShop?name=小猫咖啡店&description=还是很不错的&network=30&latitude=121.447001&longitude=31.226006

还有两处不好的地方：主要是for不是同步导致的，早上试了下map也并没有卵用
1. _id
2. network没有根据数值做转换

数据库说明

db下面有一个set.js，单独跑一下就好了
远程的数据库暂时连不上。。

统一的话应该是用 Location/cafe 这个数据库
