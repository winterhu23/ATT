const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser')

//引入Card.js
// const randomcards=require('./Card');

// const pokers = randomcards.pokers

// const randomCards = randomcards.randomCards 

//引入Card.js,解构复制
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

app.get('/',(req,res)=>{
    
    const htmlPath=path.join(__dirname,'public','card.html');
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

// const express = require('express');
// const app = express();
// const path = require('path');
// const bodyParser = require('body-parser')

// // const cardModule = require('./card');
// // const pokers = cardModule.pokers;
// // const randomcards = cardModule.randomcards;
// const {pokers, randomCards, CardGroup} = require('./public/card');


// const port = 3000;

// app.use(express.static('public'))//可以被http服务访问到
// app.use(bodyParser.urlencoded({extended:false}))
// app.use(bodyParser.json())
// app.use(express.json());
// const winRates = {
//     'is5k':750,
//     'isrs':250,
//     'issf':150,
//     'is4k':60,
//     'isfh':10,
//     'isfl':7,
//     'isst':5,
//     'is3k':3,
//     'is2p':2,
//     'is1p':1,
//     '再接再厉':0,
//     //待操作
// }

// app.get('/',function (req, res){
//     const htmlpath = path.join(__dirname,'public','card.html');
//     res.sendFile(htmlpath);
// })

// function genCardGroup(randIdx){//有问题
//     cards = new CardGroup();
//     randIdx.forEach(id => {
//         cards.push(id);//需要修改
//     });
//     return cards;
// }

// let gameCoin = 10000;
// let gameCards;

// app.get('/random',(req,res) =>{
//     const randIdx = randomCards();

//     //pokers

//     gameCards = genCardGroup(randIdx);
//     // CardGroup.cards = new CardGroup();
//     // randIdx.forEach(id=>{
//     //     cards.push(pokers[id]);
//     // })

//     // const newArr = [];
   

//     // for(const card of cards){
//     //     const newCard ={
//     //         type: card.type,
//     //         value: card.value,
//     //     };
//     //     newArr.push(newCard);
//     // }
//     res.json({
//         //改
//         cards: randIdx,//cards,
//         result: gameCards.judge(),//cards.judge(), 
//     });
// })

// // const keep = req.body.keep;
// // if(!keep)
// // keep = [];
// // keep.forEach(keepID => {
// //     const temp = [];

// //     for(let i = 0; i < 5; i ++){
// //         if(keep.includes(i)){
// //             temp.push(gameCards[i]);
// //         }
// //         else{
// //             temp.push[null];
// //         }
// //     }

// //     gameCards = temp;
// //     // gameCards.forEach(idx => {
// //     //     temp.push(idx) or (null);
// //     // })
// // })

// // let gameStart = false;
// // let gameCoin = 10000;
// // let gameCards;

// // function genCardGroup(indexes){
// //     const cards = new groupCards();
// // }

// app.post('/pour',(req, res) => {
//     /*
//         let coin
//     */
//    //let coin = req.body.coin || 0
// //    if(gameStart){
// //        res.json({
// //            code: 1,
// //            desc:'游戏已经开始',
// //        })
// //        return;
// //    }

//    let coin = req.body.coin || 0;
//    if(coin < 1){
//        res.json({
//            code: 1,
//            dsec: "下注金额不能为0"
//        })
//        return;
//    }
//    if(gameCoin < coin){
//        res,json({
//         code:1,
//         desc:'金额不足了哦'
//        })
//     return 
//    }
//    pourCoin = coin;
//    gameCoin -= coin;
//    //gameCards = randomCards();
//    res.json({
//     coin:0,
//     currCoin:gameCoin,
//     gameStart:true,
//     //result: cards.judge(), 
// });

// })
// app.post('/switch',(req, res) => {
//     /*
//         [0,1,3],[]
//     */
//    let keep = req.body['keepcard[]']
//    for(let i = 0; i < req.body.length; i++){
//        if (keep[i] == '0') {
//            keep[i] = 0;
//        }
//        else if (keep[i] == '1'){
//            keep[i] = 1;
//        }
//        else if (keep[i] == '2'){
//              keep[i] = 2;
//        }
//         else if (keep[i] == '3'){
//             keep[i] = 3;
//        }
//         else if (keep[i] == '4'){
//             keep[i] = 4;
//        }
//    }
//    if(!kepp){
//        keep = []
//    }
//    let temp = []
//    for(let i = 0; i < 5; i++){
//        let cardtext = false;
//        for(let j = 0; j < req.body.length; j++){
//            if(keep[j] == i){
//                cardtext = !cardtext
//                break
//            }
//        }
//        if(cardtext){
//            temp[i] = gameCards[i].cardid;
//        }
//        else{
//            temp[i] = null
//        }
//    }

//    gameCards = randomCards(temp)

//    const cards = genCardGroup(gameCards)

//    const result = cards.judge()

//    const winCoin = (windRates[result] || 0) * req.body.pourCoin

//    if(winCoin > 0){
//        gameCoin += winCoin
//    }
//    else{
//        gameCoin = gameCoin
//    }

//    res.json({
//        cards,
//        result,
//        gameCoin,
//        keep,
//        temp
//    })
// //    if(gameStart){
// //     res.json({
// //         code: 2,
// //         desc:'游戏未开始',
// //     })
// //     return;
// //    }
// //     let change = req.body.change;
// //     for(let i = 0; i < change.length; i++){
// //         const index = change[i];
// //         gameCards[index]
// //         //T000
// //     }

// //     gameStart = false;
// //     res.json({
// //         cards: card,
// //         result:'3k',
// //         winCoin:1000
// //     })
// })

// app.listen(port,()=>{
//     console.log(`Server start on port ${port}`);
// });