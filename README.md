#Javabucks

###API instruction

1. Use geographical location to get list
http://localhost:3000/api/getList?lat=121.441052&lng=31.226492&dist=1000

2. Use id to get detailed information
http://localhost:3000/api/getShopDetail/5838b7a4d4427d6ad6b81ef0

3. Add new cafe shop
http://localhost:3000/api/addNewShop?name=小猫咖啡店&description=还是很不错的&network=30&latitude=121.447001&longitude=31.226006

###Database

mongodb : Location/cafe

###Run

run mongodb

npm install

node server/index.js



