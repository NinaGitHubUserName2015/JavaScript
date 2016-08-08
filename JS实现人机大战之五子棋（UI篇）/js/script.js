var chess = document.getElementById('chess');
var context = chess.getContext('2d');

var me = true;
var chessBoard = [];

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
var drawChess = function(i, j, me){
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
	var x = e.offsetX;
	var y = e.offsetY;
	var i = Math.floor(x / 30);
	var j = Math.floor(y / 30);
	if(chessBoard[i][j] == 0)
	{
		drawChess(i, j, me);
		if(me)
		{
			chessBoard[i][j] = 1;
		}else{
			chessBoard[i][j] = 2;
		}
		me = !me;
	}
}