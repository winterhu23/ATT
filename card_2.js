/*
作者：胡鑫
 */
/*
type的取值范围：0~4
	0：Joker
value取值范围：0~14
	0：Black Joker
	1: Red Joker 
*/
const JOKER = 0;
const SPADE = 1;//黑桃
const DIAMOND = 2;//方片 
const HEART = 3;//红桃 
const CLUB = 4;//梅花

const BLACK_JOKER = 0;
const RED_JOKER = 1;

const TYPE_MAP = {
	0: 'Joker',
	1: 'Spand',
	2: 'Diamond',
	3: 'Heart',
	4: 'Club',
}
const VALUE_MAP={
	0: 'red',
	1: 'black',
	11: 'J',
 	12: 'Q',
	13: 'K',
	14: 'A',
}
class Card{
	constructor(type, value){
		this.type = type;
		this.value = value;
	}	
	get type(){
		return this._type;
	}
	set type(t){
		if(t < 0 || t > 4){
			this._type = 0;
		}
		else{
			this._type = t;
		}
		
	}
	get value(){
		return this._value;
	}
	set value(v){
		if(this.type === JOKER){
			if(v < 0 || v > 1){
				this._value = 0;
			}
			else{
				this._value = v;
			}
		}
		else{
			if(v < 0 || v > 14){
				this._value = 2;
			}
			else{
				this._value = v;
			}
		}
	}
	/*
	功能：返回图片的绝对路径
	*/
	relativeURL(){
		let url;
		let typeStr = TYPE_MAP[this.type];
		let valueStr ;
		if(this.value >= 2 && this.value <= 10){
			valueStr = `${this.value}`;
			console.log(valueStr);
		}
		else{
            valueStr = VALUE_MAP[this.value];
        }
		url = './images/' + typeStr + '/' + valueStr + '.png';
		return url;
	}
	
}

/*
功能：创建5张卡牌放入cardGroup数组里
*/
function createRandomCard(){
	return new Card();
}
let cardGroup = [];
for(let i = 0; i < 5; i++){
	cardGroup.push(createRandomCard());
}
/*
功能：将54张牌放入pokers数组里
 */
const pokers = [];
for(let i = 0; i < 5; i++){
	if(i === 0){
		pokers.push(new Card(i, 0));
		pokers.push(new Card(i, 1));
	}
	else{
		for(let j = 2; j < 15; j++){
		
			pokers.push(new Card(i,j)); 
		}
	}
	
} 
/*

*/
let randomcards = () =>{
	//取5个0~53的数放入result里
    const result = [];
    while (result.length<5) {
        let ri=Math.floor(Math.random()*54)
        if(!result.includes(ri))
        {
            result.push(ri);
        }
	}
	//将这5个数的Card放入resultobject
    const resultobjects = [];
    for (const i of result)
    {
        resultobjects.push(pokers[i]);
    }
    return resultobjects;
}

console.log(randomcards());
console.log("-------------------");

module.exports = randomcards;