const express = require('express') // express 모듈을 가져오기
const app = express() // 새로운 express app 생성
const port = 5000 // 포트 설정

const mongoose = require('mongoose'); // mongoDB 모듈 가져오기
mongoose.connect('mongodb+srv://tkfkdal:abcd1234@boilerplate.phd0f4g.mongodb.net/?retryWrites=true&w=majority', { // 데이터베이스 연결
  useNewUrlParser: true, useUnifiedTopology: true
}).then(() => console.log('MongoDB Connected..')) // DB에 연결이 되면 콘솔 출력
  .catch(err => console.log(err)) // 에러 발생시 출력

app.get('/', (req, res) => res.send('Hello world!')) // root 디렉토리에 접근하면 Hello world!를 출력

app.listen(port, () => console.log(`Example app listening on port ${port}!`)) // app이 port에 listen을 하면 console 출력