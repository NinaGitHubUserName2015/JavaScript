var chess = document.getElementById('chess');
var context = chess.getContext('2d');

var me = true;
var chessBoard = [];
//游戏结束的判断
var over = false;

//赢法数组
var wins = [];
//count代表赢法种类的索引，代表第几种赢法，所有的种类是572种
var count = 0;
//赢法的统计数组, 我方和电脑方，维度是赢的种类数
var myWin = [];
var computerWin = [];

//初始化棋盘
for(var i = 0; i < 15; i++)
{
	chessBoard[i] = [];
	for(var j = 0; j < 15; j++)
	{
		//0代表没有落子
		chessBoard[i][j] = 0;
	}
}

//初始化赢法数组
for(var i = 0; i < 15; i++)
{
	wins[i] = [];
	for(var j = 0; j < 15; j++)
	{
		wins[i][j] = [];
	}
}

//初始化三维赢法数组
//所有的竖线赢法
for(var i = 0; i < 15; i++)
{
	for(var j = 0; j < 11; j++)
	{
		//wins[0][0][0] = true;
		//wins[0][1][0] = true;
		//wins[0][2][0] = true;
		//wins[0][3][0] = true;
		//wins[0][4][0] = true;

		//wins[0][1][1] = true;
		//wins[0][2][1] = true;
		//wins[0][3][1] = true;
		//wins[0][4][1] = true;
		//wins[0][5][1] = true;
		for(var k = 0; k < 5; k++)
		{
			wins[i][j + k][count] = true;
		}
		count++;
	}
}
//所有的横线赢法
for(var i = 0; i < 15; i++)
{
	for(var j = 0; j < 11; j++)
	{
		for(var k = 0; k < 5; k++)
		{
			wins[j + k][i][count] = true;
		}
		count++;
	}
}
//所有的斜线赢法
for(var i = 0; i < 11; i++)
{
	for(var j = 0; j < 11; j++)
	{
		for(var k = 0; k < 5; k++)
		{
			wins[i + k][j + k][count] = true;
		}
		count++;
	}
}
//所有的反斜线赢法
for(var i = 0; i < 11; i++)
{
	for(var j = 14; j > 3; j--)
	{
		for(var k = 0; k < 5; k++)
		{
			wins[i + k][j - k][count] = true;
		}
		count++;
	}
}

//初始化赢法统计数组
for(var i = 0; i < count; i++)
{
	myWin[i] = 0;
	computerWin[i] = 0;
}

context.strokeStyle = "#BFBFBF";

var logo = new Image();
logo.src = "img/logo.png";
logo.onload = function(){
	context.drawImage(logo, 0, 0, 450, 450);
	drawChessBoard();
}

var drawChessBoard = function(){
	for(var i = 0; i < 15; i++){
		context.moveTo(15 + i * 30, 15);
		context.lineTo(15 + i * 30, 435);
		context.stroke();

		context.moveTo(15, 15 + i * 30);
		context.lineTo(435, 15 + i * 30);
		context.stroke();
	}
}

//me代表是黑棋
var oneStep = function(i, j, me){
	var gradient = context.createRadialGradient(17 + i * 30, 13 + j * 30, 13, 17 + i * 30, 13 + j * 30, 0);
	if(me){
		gradient.addColorStop(0, "#0A0A0A");
		gradient.addColorStop(1, "#636766");
	}else{
		gradient.addColorStop(0, "#D1D1D1");
		gradient.addColorStop(1, "#F9F9F9");
	}

	context.fillStyle = gradient;
	//context.fillStyle = "#636766";
	context.beginPath();
	context.arc(15 + i * 30, 15 + j * 30, 13, 0, 2 * Math.PI);
	context.closePath();
	context.fill();
}

chess.onclick = function(e){
	if(over){
		return;
	}
	if(!me){
		//如果不是我方下棋，直接返回
		return;
	}
	var x = e.offsetX;
	var y = e.offsetY;
	var i = Math.floor(x / 30);
	var j = Math.floor(y / 30);
	if(chessBoard[i][j] == 0)
	{
		oneStep(i, j, me);
		//if(me)
		//{
		chessBoard[i][j] = 1;
		//}else{
		//	chessBoard[i][j] = 2;
		//}
		//更新赢法的统计数组
		for(var k = 0; k < count; k++){
			if(wins[i][j][k]){
				myWin[k]++;
				//这个时候[i, j]这个位置已经落了黑子，所以电脑方的第k种赢法已经不可能了，设置一个异常值
				computerWin[k] = 6;
			}
			if(myWin[k] == 5){
				window.alert("你赢了");
				over = true;
			}
		}
		if(!over){
			//如果还没有结束，就调用计算机AI下棋
			me = !me;
			computerAI();
		}
	}
}

//计算机AI
var computerAI = function(){
	var myScore = [];
	var computerScore = [];

	//记录myScore和computerScore里面的最大分值
	var max = 0;
	//最大分值的坐标,也是计算机要落子的点
	var u = 0;
	var v = 0;

	//初始化得分，个人看法：每走一步都初始化，比较浪费，应该提出来放在公共区或者和棋盘数组合并
	for(var i = 0; i < 15; i++){
		myScore[i] = [];
		computerScore[i] = [];
		for(var j = 0; j < 15; j++){
			myScore[i][j] = 0;
			computerScore[i][j] = 0;
		}
	}
	for(var i = 0; i < 15; i++){
		for(var j = 0; j < 15; j++){
			//遍历棋盘所有位置，如果还没有落子，计算这个位置的所有赢法的得分，得分最高的位置，计算机落子
			if(chessBoard[i][j] == 0){
				//循环遍历这个位置的所有赢法
				for(var k = 0; k < count; k++){
					//wins[i][j][k]赢法数组，如果为true，计算分数
					if(wins[i][j][k]){
						if(myWin[k] == 1){
							myScore[i][j] += 200;
						}else if(myWin[k] == 2){
							myScore[i][j] += 400;
						}else if(myWin[k] ==3){
							myScore[i][j] += 2000;
						}else if(myWin[k] == 4){
							myScore[i][j] += 10000;
						}
						if(computerWin[k] == 1){
							computerScore[i][j] += 220;
						}else if(computerWin[k] == 2){
							computerScore[i][j] += 440;
						}else if(computerWin[k] == 3){
							computerScore[i][j] += 2200;
						}else if(computerWin[k] == 4){
							computerScore[i][j] += 20000;
						}
					}
				}
				//myScore和最大值的关系
				if(myScore[i][j] > max){
					max = myScore[i][j];
					u = i;
					v = j;
				}else if(myScore[i][j] == max){
					if(computerScore[i][j] > computerScore[u][v]){
						u = i;
						v = j;
					}
				}
				//computerScore和最大值的关系
				if(computerScore[i][j] > max){
					max = computerScore[i][j];
					u = i;
					v = j;
				}else if(computerScore[i][j] == max){
					if(myScore[i][j] > myScore[u][v]){
						u = i;
						v = j;
					}
				}
			}
		}
	}
	//找到位置，计算机落子，更新赢法的统计数组
	oneStep(u, v, false);
	chessBoard[u][v] = 2;
	//更新赢法的统计数组
	for(var k = 0; k < count; k++){
		if(wins[u][v][k]){
			computerWin[k]++;
			//这个时候[i, j]这个位置已经落了黑子，所以我方的第k种赢法已经不可能了，设置一个异常值
			myWin[k] = 6;
		}
		if(computerWin[k] == 5){
			window.alert("计算机赢了");
			over = true;
		}
	}
	if(!over){
		//如果还没有结束，我方下棋
		me = !me;
	}
}

