const express = require('express') // express 모듈을 가져오기
const app = express() // 새로운 express app 생성
const port = 5000 // 포트 설정
const bodyParser = require('body-parser') // body-parser 가져오기
const cookieParser = require('cookie-parser')
const { User } = require("./models/User") // User 모델 가져오기
const config = require('./config/key') // MongoDB uri 가져오기
const { auth } = require('./middleware/auth')

// body-parser 옵션 설정
// application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))

// application/json
app.use(bodyParser.json());

app.use(cookieParser());

const mongoose = require('mongoose'); // mongoDB 모듈 가져오기
mongoose.connect(config.mongoURI, { // 데이터베이스 연결
  useNewUrlParser: true, useUnifiedTopology: true
}).then(() => console.log('MongoDB Connected..')) // DB에 연결이 되면 콘솔 출력
  .catch(err => console.log(err)) // 에러 발생시 출력

app.get('/', (req, res) => res.send('Hello world! 안녕!!')) // root 디렉토리에 접근하면 Hello world!를 출력

app.get('/api/hello', (req, res) => {
  res.send("안녕하세요~")
})

app.post('/api/users/register', (req, res) => {

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

app.post('/api/users/login', (req, res) => {

  // 요청된 이메일을 데이터베이스에서 있는지 찾는다
  User.findOne({email: req.body.email})
  .then(user => {
    if (!user) {
      return res.json({
        loginSuccess: false,
        message: "제공된 이메일에 해당하는 유저가 없습니다."
      })
    }

    // 요청된 이메일이 데이터 베이스에 있다면 비밀번호가 맞는 비밀번호인지 확인
    user.comparePassword(req.body.password, (err, isMatch) => {
      if (!isMatch) return res.json({ loginSuccess: false, message: "비밀번호가 틀렸습니다." })

      // 비밀번호가 맞다면 토큰 생성하기
      user.generateToken((err, user) => {
        if (err) return res.status(400).send(err);

        // 토큰을 저장한다. 어디에? 쿠키, 로컬스토리지
        res.cookie('x_auth', user.token)
          .status(200)
          .json({ loginSuccess: true, userId: user._id })
      })
    })
  })
})

app.get('/api/users/auth', auth, (req, res) => {

  // 여기까지 미들웨어를 통과해 왔다는 얘기는 Authentication이 True 라는 말
  res.status(200).json({
    _id: req.user._id,
    isAdmin: req.user.role === 0 ? false : true,
    isAuth: true,
    email: req.user.email,
    name: req.user.name,
    lastname: req.user.lastname,
    role: req.user.role,
    image: req.user.image 
  })

})

app.get('/api/users/logout', auth, (req, res) => {
  
  User.findOneAndUpdate({ _id: req.user._id }, { token: "" })
      .then(logout => {
        return res.status(200).send({
          success: true
        })
      })
      .catch(err => {
        return res.json({
          success: false, err
        })
      })
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`)) // app이 port에 listen을 하면 console 출력