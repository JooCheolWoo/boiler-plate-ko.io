const mongoose = require('mongoose');

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

const User = mongoose.model('User', userSchema) // 스키마를 모델로 감싸줌

module.exports = {User} // 다른 곳에서도 사용 가능하게!