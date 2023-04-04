const express = require('express') // express 모듈을 가져오기
const app = express() // 새로운 express app 생성
const port = 5000 // 포트 설정

const bodyParser = require('body-parser'); // body-parser 가져오기

const { User } = require("./models/User"); // User 모델 가져오기

const config = require('./config/key') // MongoDB uri 가져오기

// body-parser 옵션 설정
// application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: true})); 

// application/json
app.use(bodyParser.json());

const mongoose = require('mongoose'); // mongoDB 모듈 가져오기
mongoose.connect(config.mongoURI, { // 데이터베이스 연결
  useNewUrlParser: true, useUnifiedTopology: true
}).then(() => console.log('MongoDB Connected..')) // DB에 연결이 되면 콘솔 출력
  .catch(err => console.log(err)) // 에러 발생시 출력

app.get('/', (req, res) => res.send('Hello world! 안녕!!')) // root 디렉토리에 접근하면 Hello world!를 출력

app.post('/register', (req, res) => {

  // 회원 가입할 때 필요한 정보들을 client에서 가져오면
  // 그것들을 데이터 베이스에 넣어준다.
  
  const user = new User(req.body)

  user.save()
        .then(saveData => {
          return res.status(200).json({ success: true })
        }).catch(err => {
          return res.json({ success: false, err })
        })

})



app.listen(port, () => console.log(`Example app listening on port ${port}!`)) // app이 port에 listen을 하면 console 출력