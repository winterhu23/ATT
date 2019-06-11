
const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser')
const session = require('express-session')
const sessionRouter = require('./routes/session')

//引入Card.js
// const randomcards=require('./Card');

// const pokers = randomcards.pokers

// const randomCards = randomcards.randomCards 

//引入Card.js,解构复制
app.use('/node_modules/',express.static(path.join(__dirname,'./node_modules/')))
app.engine('html',require('express-art-template'))
app.set('views',path.join(__dirname,'./views/'))//默认就是 ./views/ 目录


//我们可以通过req.session 来访问和设置session 成员了
//添加session数据：req.session.foo = 'bar'
//访问session数据：req.session.foo
app.use(session({
    //配置加密字符串，它会在原有加密基础之上和这个字符串拼起来去加密
    //目的是为了增加安全性
    secret: 'keyboard cat',
    resave: false,
    //无论你是否使用session，我都默认直接给你分配一把钥匙
    saveUninitialized: true
  }))


const {pokers, randomCards, CardGroup} = require('./public/card');

//分配的端口
const port=3000;

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(express.json());
app.use(bodyParser.urlencoded({extended:false}));
const windRates = {
    'is5k':750,
    'isrs':250,
    'issf':150,
    'is4k':60,
    'isfh':10,
    'isfl':7,
    'isst':5,
    'is3k':3,
    'is2p':2,
    'is1p':1,
    '再接再厉':0,
    //待操作
}
app.use(sessionRouter)

app.get('/',(req,res)=>{
    
    const htmlPath=path.join(__dirname,'views','card.html');
    res.sendFile(htmlPath);
});

//indexes: []
function genCardGroup(randIdx){//有问题
    cards = new CardGroup();
    randIdx.forEach(id => {
        cards.push(id);//需要修改
    });
    return cards;
}

let gameCoin = 10000;
let gameCards;

app.get('/random',(req,res)=>{
    
    const randIdx=randomCards();//调用函数[0,12,2,14,5]
    gameCards = genCardGroup(randIdx);
    res.json({
        cards:randIdx,//=>{(type:1,vaule:1)}
        result:gameCards.judge(),
    });//返回客户端
});

//下注
app.post('/pour',(req,res)=>{
     
    let coin = req.body.coin || 0
    if( coin < 1){
        res.json({
            code:1,
            desc: '下注金额不能为0'
        })
        return
    }
    if( gameCoin < coin){
        res.json({
            code:1,
            desc: '金额不足'
        })
        return
    }
    pourCoin = coin
    gameCoin -= coin

    res.json({
        code:0,
        currCoin:gameCoin,
        gameStart:true,
    })
})

app.post('/switch',(req,res)=>{
    /*
        keep = [0,1,2]
    */
    let keep  = req.body['keepcard[]']
    for(let i=0;i<req.body.length;i++){
        if(keep[i]=="0"){
            keep[i]=0;
        }else if(keep[i]=="1"){
            keep[i]=1;
        }else if(keep[i]=="2"){
            keep[i]=2;
        }else if(keep[i]=="3"){
            keep[i]=3;
        }else if(keep[i]=="4"){
            keep[i]=4;
        }
    }
    if(!keep){
        keep = [];
    }
    let temp = []
    for(let i=0;i<5;i++){
        let cardtext = false;
        for(let j =0;j<req.body.length;j++){
            if(keep[j]==i){
                cardtext = !cardtext;
                break;
            }
        }
        if(cardtext){
            temp[i]=gameCards[i].cardid;
        }else{
            temp[i]=null;
        }
    }

    gameCards = randomCards(temp)
    
    const cards = genCardGroup(gameCards)
 
    const result = cards.judge()

    const winCoin = (windRates[result] || 0)*req.body.pourCoin

    if(winCoin>0){
        gameCoin+=winCoin
    }else{
        gameCoin=gameCoin
    }
    res.json({
        cards,
        result,
        gameCoin,
        keep,
        temp
    })
})

app.listen(port,()=>{
    console.log(`Server start on port ${port}`);
});

