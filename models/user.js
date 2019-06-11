const mongoose = require('mongoose')
const Schema = mongoose.Schema

//连接数据库
mongoose.connect('mongodb://localhost:27017/usertest', {useNewUrlParser: true});

const userSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    nickname: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    created_time: {
        type: Date,
        //注意这里不要写Date.now() 因为会即刻调用
        //这里直接给了一个方法： Date.now
        //当你去 new Model 的时候，如果你没有传递 create_time
        //则mongoose 就会调用default 指定的 Date.now 方法
        //然后使用其返回值作为默认值
        defalut: Date.now
    },
    last_modified_time: {
        type: Date,
        default: Date.now
    },
    //头像
    // avatar: {
    //     type: String,
    //     default: '/public/img/avatar-max-img.png'
    // },
    // bio: {
    //     type: String,
    //     default: ''
    // },
    // gender: {
    //     type: Number,
    //     enum: [-1, 0, 1],
    //     default: -1
    // },
    // birthday: {
    //     type: Date
    // },
    status: {
        type: Number,
        //0 没有权限限制
        //1 不可以评论
        //2 不可以登录
        enum: [0, 1, 2],
        default: 0
    }
})

module.exports = mongoose.model('User',userSchema)