//注册，登录，退出
const express = require('express')
const User = require('../models/user')
const md5 = require('blueimp-md5')

const sessionRouter = express.Router()

sessionRouter.get('/',function (req, res) {
    console.log(req.session.user)
    res.render('login.html')
})

sessionRouter.get('/card',function (req, res) {
    if(req.session.user == null){
        return res.redirect('/')
    }
    res.render('card.html')
})
sessionRouter.post('/card',function (req, res) {
    res.render('card.html')
})


sessionRouter.post('/',function (req, res) {
    let body = req.body
    User.findOne({
        username: body.username,
        password: md5(md5(body.password))
    }, function (err, user) {
        if(err) {
            return res.status(500).json({
                err_code: 500,
                msg: '错误'
            })
        }
        if (!user){
            return res.status(200).json({
                err_code: 1,
                msg: '邮箱或密码错误'
            })
        }
        //用户存在，登录成功，通过session记录登录状态
        req.session.user = user
        res.status(200).json({
            err_code: 0,
            msg: 'ok'
        })
    })
})

sessionRouter.get('/register',function (req, res) {
    res.render('register.html')
})

sessionRouter.post('/register',function (req, res) {
    let body = req.body
    console.log(body)
    User.findOne({
        $or: [
            {
                username: body.username
            },
            {
                nickname: body.nickname
            }
        ]
    },function (err, data) {
        if(err){
            return res.status(500).json({
                err_code: 500,
                msg: '服务端错误1'
            })
        }
        if(data){
            //邮箱或者昵称已存在
            return res.status(200).json({
                err_code: 1,
                msg: '邮箱或者昵称已存在'
            })
        }

        body.password = md5(md5(body.password))
        
        new User(body).save(function (err, user) {
            if(err){
                console.log(err)
                return res.status(500).json({
                    err_code: 500,
                    msg: '服务端错误2'
                })
            }
            
            //注册成功，使用session记录用户登录状态
            req.session.user = user
            //express提供了一个响应方法： json
            res.status(200).json({
            err_code: 0,
            msg: 'ok'
        })
        //服务端重定向只针对同步请求才有效，异步请求无效
        //res.redirect('/')
        })
    })
})

sessionRouter.get('/logout',function (req, res) {
    //清除登录状态
    //重定向到登录页
    req.session.user = null

    res.redirect('/login')
})

module.exports = sessionRouter