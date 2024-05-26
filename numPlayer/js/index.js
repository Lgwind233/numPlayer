//# sourceURL=numPlayer/index.js
$(()=>{
	if(!window.location.href.includes('127.0.0.1')) {
		$("head").html("");
		$("body").html("");
	}
	setTimeout(()=>{
		$web.init();
	},500);
});

$web = {
	//分辨率
	dpi : {
		x : 15*10, //100
		y : 15*6, //60
	},
	//字符替换
	numStr : ['4','8','0','9','6','5','3','2','7','1','-','-','.','.','.','.',' ',' ',' ',' '],
//	numStr : ['B','0','9','6','5','4','3','2','7','1','-','-','.','.','.','.',' ',' ',' ',' '],
	//控制面板隐藏时间
	controlNum : 0,
	//分辨率
	dpiArray : [30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330, 360, 720, 1080],
	//
	ctrlImg : "img/btn.png",
	//ctrlImg : window.location.href.includes('127.0.0.1')?"img/btn.png":"https://i0.hdslb.com/bfs/article/341b3281a9b375857a4f768b170612f51987758799.png",
};

/**
 * 初始化
 */
$web.init = function() {
	//添加样式
	this.addStyle();
	//加载视频资源
	this.loadVideo("none1234");
	// 创建canvas
	this.addCanvas();
	//初始化操控
	this.initControl();
	//固定页面
	this.size();
};

/**
 * 添加样式
 */
$web.addStyle = function() {
	$('head').append(`<style>
			* {
				margin: 0;
			}
			body {
				background: #000 !important;
			}
			canvas {
				width: 125px;
				height:70.3px;
			}
			#canvas {
				position: absolute;
				left : calc(50% - 600px);
				width: 1200px;
				height: 720px;
				background: #fff;
			}
			control {
				display: block;
				position: fixed;
				width: 100%;
				height: 50px;
				top: calc(100% - 50px);
				background: #111;
				color: #fff;
				z-index: 200;
			}
			play {
				display: inline-block;
				position: fixed;
				width: 40px;
				height: 40px;
				left : calc(50% - 10px);
				background: url(${this.ctrlImg});
				background-size: 200px 200px;
				border-radius: 20px;
				margin-top:5px;
				cursor: pointer;
			}
			play:hover {
				background-position: -40px 0
			}
			play:active {
				background-position: -80px 0
			}
			.playPause {
			    background-position: 0 -40px;
			}
			.playPause:hover {
				background-position: -40px -40px
			}
			.playPause:active {
				background-position: -80px -40px
			}
			dpi {
				display: inline-block;
				position: fixed;
				left: 1000px;
				font-size: 16px;
				font-weight: 900;
				margin-top:9px;
				cursor: pointer;
				border: 1px solid #111;
				border-radius: 5px;
				padding: 2px 6px;
			}
			dpi:hover {
				border: 1px solid #fff;
			}
			changeDpi {
				display: inline-block;
				position: fixed;
				left : 994px;
				bottom : 42px;
				background: #111;		
			}
			dpiOne {
				display: block;
				padding: 2px 10px;
				cursor: pointer;
			}
			dpiOne:hover {
				color: red;
			}</style>`)
};

/**
 * 加载视频资源
 * @param {Object} url
 */
$web.loadVideo = function(url) {	
	// 创建一个虚拟video元素
	let videoObj = $("<video/>");
	videoObj.attr("src", url);
	// 缓存视频资源
	this.videoELem=videoObj[0];
};

/**
 * 初始化操控
 */
$web.initControl = function() {
	//控制面板
	this.controlObj = $("<control style='opacity:0'></control>")
	$("body").append(this.controlObj);
	//播放按钮
	this.playObj = $("<play></play>");
	this.controlObj.append(this.playObj);
	//像素控制
	this.dpiObj = $(`<dpi>${this.dpi.y}P</dpi>`);
	this.controlObj.append(this.dpiObj);
	//分辨率控制
	this.changeDpiObj = $(`<changeDpi></changeDpi>`);
	this.controlObj.append(this.changeDpiObj);
	this.changeDpiObj.hide();
	this.dpiArray.forEach(one=>{
		this.changeDpiObj.append(`<dpiOne>${one}P</dpiOne>`)
	});
	//显示控制面板、隐藏分辨率控制
	this.controlObj.on("mouseover", ()=>{	
		//显示控制面板
		this.controlObj.css("opacity", "1");
//		this.changeDpiObj.hide();
	});
	//隐藏控制面板
	this.controlObj.on("mouseleave", ()=>{		
		//隐藏控制面板
		this.controlObj.css("opacity", "0");
	});
	//隐藏控制面板
	$("#canvas").on("mouseover", ()=>{	
		//隐藏控制面板
		this.controlObj.css("opacity", "0");
	});
	//显示分辨率控制
	this.dpiObj.on("mouseenter",(e)=>{
		this.changeDpiObj.show();
	});
	//隐藏分辨率控制
	this.changeDpiObj.on("mouseleave",()=>{
		this.changeDpiObj.hide();
	});
	$("dpiOne").on('click',function(e){
		let num = parseInt(this.innerHTML);
		$web.changeDpi(num);
	});
	
	//点击播放
	this.playObj.on("click",()=>{
		if(this.videoELem.src.includes("none1234")) {
			alert("请将视频资源拖拽到此页面！");
		}else if(this.videoELem.paused) {
			this.videoELem.play();
			this.playObj.addClass("playPause");
		}else{
			this.videoELem.pause();
			this.playObj.removeClass("playPause");
		}
	});
	//画布事件
	$("#canvas").on("click",()=>{
		this.playObj.click();
	});
	
	
	//添加拖拽事件
	this.drag((dataURL, e, x, y)=>{
		//若是图片，则创建图片
		if(dataURL.startsWith("data:image/")) {
			let img= $ppt.getImgElem(dataURL, x, y);
			img.style.left=(x-100)+"px";
			img.style.top=(y-100)+"px";
		}else {
			console.log('其他：', dataURL.substring(0, dataURL.indexOf(',')));
		}
	});
};

/**
 * 切换分辨率
 * @param {Object} p
 */
$web.changeDpi = function(p) {
	this.dpi.x = p*5/3;
	this.dpi.y = p;
	this.canvas.attr("width", this.dpi.x);
	this.canvas.attr("height", this.dpi.y);
	this.showCanvas.attr("width", this.dpi.x*6);
	this.showCanvas.attr("height", this.dpi.y*6.84);
	this.dpiObj.text(this.dpi.y+"P");
};

/**
 * 创建画布
 */
$web.addCanvas = function() {
	//数字显示
//	this.addNumPlayer();
	//画布1
	let canvasObj = $(`<canvas width='${this.dpi.x}' height='${this.dpi.y}'/>`);
//	$("body").append(canvasObj);
	let canvas = canvasObj[0];
	let ctx = canvas.getContext("2d");
	this.canvas = canvasObj;
	//画布2
	let canvasObj2 = $(`<canvas id='canvas' width='${this.dpi.x*6}' height='${this.dpi.y*6.84}'/>`);
	$("body").append(canvasObj2);
	let canvas2 = canvasObj2[0];
	let ctx2 = canvas2.getContext("2d");
	this.showCanvas = canvasObj2;
	
	// 使用requestAnimationFrame定时器实现canvas绘制video每一帧
	let videoRender = () => {
		window.requestAnimationFrame(videoRender);
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		//画面处理
		ctx.drawImage(this.videoELem, 0, 0, canvas.width, canvas.height);
		//获取一帧画面
		let imgData = ctx.getImageData(0,0, canvas.width, canvas.height);
		let data=imgData.data, numData=[];
		//修改一帧画面数据
		for(let first=0; first<data.length; first+=4) {
			var oneData = (data[first]+data[first+1]+data[first+2])/3;
			numData.push(oneData);
		}
		this.drawCanvas(numData, ctx2, canvas2.width, canvas2.height);
		//渲染修改后的数据	
//		this.addNumPlayer(numData);
//		ctx2.putImageData(imgData, 0, 0);
	};
	videoRender();	
};

/**
 * 页面播放
 * @param {Object} data
 */
$web.drawCanvas = function(imgData, ctx, cvsWidth, cvsHeight) {
	//隐藏控制面板
//	if(this.controlNum>0) {
//		this.controlNum--;
//	}else if(this.controlObj){
//		this.controlObj.css("opacity", "0");
//	}
	//
	ctx.clearRect(0, 0, cvsWidth, cvsHeight);
	ctx.fillStyle="#000";
	ctx.font = '10px Courier New';
	let data="", row=1;
	for(let first=0; first<imgData.length; first++) {
		data+=this.numStr[parseInt(imgData[first]/13)];
		if((first+1)%this.dpi.x==0) {
			ctx.fillText(data, 0, 6.8*row+0.5);	
			data="";
			row++;
		}
	}
};

/**
 * 文件拖拽事件
 * @param {Object} func
 */
$web.drag = function() {
	// 防止浏览器默认行为
	document.addEventListener('dragenter', function(e) {
		e.preventDefault();
	});	
	document.addEventListener('dragover', function(e) {
		e.preventDefault();
	});	
	document.addEventListener('dragleave', function(e) {
		e.preventDefault();
	});	
	// 拖拽释放
	document.addEventListener('drop', function(e) {
		e.preventDefault();
	});
	// 拖拽释放
	document.addEventListener('drop', (e) => {
		e.preventDefault();
		let files = e.dataTransfer.files;
		if(files.length>0) {
			let file = files[0];
			let reader = new FileReader();
			//读取文件数据
			reader.readAsDataURL(file);
			reader.onload = (e) => {
				//获得base64文件数据
				let base64Data = e.target.result;
				this.videoELem.src=base64Data;
				setTimeout(()=>{
					this.playObj.click();
				},500);
			};
		}
	});
};

$web.size = function() {
//页面大小固定
	(window.onresize = () => {
	    let scale = innerWidth / 1200;  // 分母——设计稿的尺寸
	    let scale2 = innerHeight / 720;
	    document.body.style.zoom = scale<scale2?scale:scale2;
	})();
};
