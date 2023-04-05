const mongoose = require('mongoose');
const bcrypt = require('bcrypt')
const saltRounds = 10
const jwt = require('jsonwebtoken')

const userSchema = mongoose.Schema({
    name: {
        type: String,
        maxlength: 50   
    },
    email: {
        type: String,
        trim: true, // 빈칸제거
        unique: 1
    },
    password: {
        type: String,
        minlength: 5
    },
    lastname: {
        type: String,
        maxlength: 50
    },
    role: { // User 구분 (관리자, 일반유저)
        type: Number,
        default: 0
    },
    image: String,
    token: { 
        type: String
    },
    tokenExp: { // 토큰 유효기간
        type: Number
    }
})

// user 정보를 save 메소드를 실행하기 전에 먼저 실행됨
// 끝이나면 next로 다음 과정으로 전달
userSchema.pre('save', function(next){
    var user = this; // userSchema를 가리킴

    if(user.isModified('password')) {
        //비밀번호를 암호화
        bcrypt.genSalt(saltRounds, function(err, salt) {
            if(err) return next(err)

            bcrypt.hash(user.password, salt, function(err, hash) {
                if(err) return next(err)
                user.password = hash
                next()
            })
        })
    } else {
        next()
    }


})

userSchema.methods.comparePassword = function(plainPassword, cb) {

    // plainPassword와  암호화된 비밀번호가 같은지 확인해야됨
    bcrypt.compare(plainPassword, this.password, (err, isMatch) => {
        if(err) return cb(err);
        cb(null, isMatch)
    })
}

userSchema.methods.generateToken = function(cb) {

    var user = this;
    
    // jsonwebtoken을 이용해서 토큰 생성
    var token = jwt.sign(user._id.toHexString(), 'secretToken')

    user.token = token
    user.save()
        .then(user => {cb(null, user)})
        .catch(err => cb(err))
}

userSchema.statics.findByToken = function(token, cb) {
    var user = this;

    // 토큰을 decode 한다
    jwt.verify(token, 'secretToken', function(err, decoded) {
        // 유저 아이디를 이용해서 유저를 찾은 다음에
        // 클라이언트에서 가져온 token과 DB에 보관된 토큰이 일치하는지 확인

        user.findOne({ "_id": decoded, "token": token })
            .then(user => {
                cb(null, user);
            })
            .catch(err => {
                cb(err);
            })
    })
}

const User = mongoose.model('User', userSchema) // 스키마를 모델로 감싸줌

module.exports = {User} // 다른 곳에서도 사용 가능하게!