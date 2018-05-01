// Load a text resource from a file over the network
getCanvas = function(canvasName) {
	var canvas = $('#' + canvasName);
	if(!canvas[0]){
	  $('#test_canvases').append("<canvas id='" + canvasName + "' width='256' height='256'></canvas>");
	}
	return canvas = $('#' + canvasName)[0];
  }
  
  var vetexID;
  var tem_program;
  Mat3 = (function() {
	function Mat3(data1) {
	  this.data = data1;
	  if (this.data == null) {
		this.data = new Float32Array(9);
	  }
	  this.ident();
	}
  
	Mat3.prototype.ident = function() {
	  var d;
	  d = this.data;
	  d[0] = 1;
	  d[1] = 0;
	  d[2] = 0;
	  d[3] = 0;
	  d[4] = 1;
	  d[5] = 0;
	  d[6] = 0;
	  d[7] = 0;
	  d[8] = 1;
	  return this;
	};
  
	Mat3.prototype.transpose = function() {
	  var a01, a02, a12, d;
	  d = this.data;
	  a01 = d[1];
	  a02 = d[2];
	  a12 = d[5];
	  d[1] = d[3];
	  d[2] = d[6];
	  d[3] = a01;
	  d[5] = d[7];
	  d[6] = a02;
	  d[7] = a12;
	  return this;
	};
  
	Mat3.prototype.mulVec3 = function(vec, dst) {
	  if (dst == null) {
		dst = vec;
	  }
	  this.mulVal3(vec.x, vec.y, vec.z, dst);
	  return dst;
	};
  
	Mat3.prototype.mulVal3 = function(x, y, z, dst) {
	  var d;
	  dst = dst.data;
	  d = this.data;
	  dst[0] = d[0] * x + d[3] * y + d[6] * z;
	  dst[1] = d[1] * x + d[4] * y + d[7] * z;
	  dst[2] = d[2] * x + d[5] * y + d[8] * z;
	  return this;
	};
  
	Mat3.prototype.rotatex = function(angle) {
	  var c, s;
	  s = Math.sin(angle * arc);
	  c = Math.cos(angle * arc);
	  return this.amul(1, 0, 0, 0, c, s, 0, -s, c);
	};
  
	Mat3.prototype.rotatey = function(angle) {
	  var c, s;
	  s = Math.sin(angle * arc);
	  c = Math.cos(angle * arc);
	  return this.amul(c, 0, -s, 0, 1, 0, s, 0, c);
	};
  
	Mat3.prototype.rotatez = function(angle) {
	  var c, s;
	  s = Math.sin(angle * arc);
	  c = Math.cos(angle * arc);
	  return this.amul(c, s, 0, -s, c, 0, 0, 0, 1);
	};
  
	Mat3.prototype.amul = function(b00, b10, b20, b01, b11, b21, b02, b12, b22, b03, b13, b23) {
	  var a, a00, a01, a02, a10, a11, a12, a20, a21, a22;
	  a = this.data;
	  a00 = a[0];
	  a10 = a[1];
	  a20 = a[2];
	  a01 = a[3];
	  a11 = a[4];
	  a21 = a[5];
	  a02 = a[6];
	  a12 = a[7];
	  a22 = a[8];
	  a[0] = a00 * b00 + a01 * b10 + a02 * b20;
	  a[1] = a10 * b00 + a11 * b10 + a12 * b20;
	  a[2] = a20 * b00 + a21 * b10 + a22 * b20;
	  a[3] = a00 * b01 + a01 * b11 + a02 * b21;
	  a[4] = a10 * b01 + a11 * b11 + a12 * b21;
	  a[5] = a20 * b01 + a21 * b11 + a22 * b21;
	  a[6] = a00 * b02 + a01 * b12 + a02 * b22;
	  a[7] = a10 * b02 + a11 * b12 + a12 * b22;
	  a[8] = a20 * b02 + a21 * b12 + a22 * b22;
	  return this;
	};
  
	Mat3.prototype.fromMat4Rot = function(source) {
	  return source.toMat3Rot(this);
	};
  
	Mat3.prototype.log = function() {
	  var d;
	  d = this.data;
	  return console.log('%f, %f, %f,\n%f, %f, %f, \n%f, %f, %f, ', d[0], d[1], d[2], d[3], d[4], d[5], d[6], d[7], d[8]);
	};
  
	return Mat3;
  
  })();
  
  /*=============map部分===============================开头============================================*/
  //建立program的map
  var Program_data = function(){
	this.activeFlag = undefined //这个program是否被激活
	  this.programName = undefined; //program的名字
	this.vertexSource = undefined; //vetex的source
	this.fragSource = undefined //frag的source
	  this.attriData = [];  //重新建立一个新的Attri_data object的array
	this.uniformData = []; //重新建立一个新的Uniform_data object的array
	this.varyingData = []; //重新建立一个新的Varying_data object的array
  }
  var ProgramDataMap = [];
  
  var Shader_data = function(){
	this.shaderTpye = undefined; //35633为vetex 35632为frag
	this.shaderName = undefined; //shader的实际赋值
	this.shaderSource = undefined; //shader的源代码（这块是直接用来修改的）
  }
  var ShaderDataMap = [];
  
  //建立buffer的map
  var Buffer_data = function(){
	this.bufferName = undefined;  //bindBuffer 时候使用的名字  
	this.bufferType = undefined;  //依照这个来判断是array还是element_array
	this.bufferData = undefined;  //存储buffer本身的数值
	this.activeFlag = undefined;  //这个是需要判断当前bindbuffer到底使用的是哪一个buffer，这个buffer是否被激活
	this.activeElement = undefined;  //判断哪一个Element为最后加入的，也就为激活状态
  
  }
  var BufferDataMap = [];
  
  // 建立attribute的map
  var Attri_data = function(){
	this.programName = undefined; //这个位置是在哪一个program的
	this.shaderName = undefined;  //在glsl代码中对应的attribute的变量名
	this.attriEleNum = undefined;  //记录attribute最终要变成vec2还是vc3
	this.uniformData = []; //这个是记录最终生成的数值，直接通过uniform传入的
  }
  var AttriDataMap = [];
  
  //建立random number program 和 shadername对应关系的map
  var Attribute_loc = function(){
	this.randomNumber = undefined;  //这块记录的就是随机产生的位置数字
	this.shaderName = undefined;    //在glsl代码中对应的attribute的变量名
	this.programName = undefined;   //这个位置是在哪一个program的 
  }
  var AttributeLocMap = [];
  
  
  //两个uniform的map
  //存储uniform的数据
  //这块的uniform类行vec2，vec3，vec4为2，3，4，matrix2，3，4为12，13，14
  var Uniform_data = function(){
	this.programName = undefined; //这个位置是在哪一个program的
	this.shaderName = undefined;  //在glsl代码中对应的uniform的变量名
	this.uniformNum = undefined;  //这个uniform是vec2，vec3，vec4
	this.uniformType = undefined;  //这个类型是int 0 还是 float 1
	this.uniformData = undefined;  // 这个uniform的数据
	this.uniformActive = undefined;  //这个uniform是否要被输入到shader
  }
  var UniformDataMap = [];
  
  
  //储存uniform的location
  var Uniform_loc = function(){
	this.randomNumber = undefined;  //这块记录的就是随机产生的位置数字
	this.shaderName = undefined;    //在glsl代码中对应的attribute的变量名
	this.programName = undefined;   //这个位置是在哪一个program的 
  }
  var UniformLocMap = [];
  
  // 建立varying的map
  var Varying_data = function(){
	this.shaderName = undefined;  //在glsl代码中对应的varying的变量名
	this.varyEleNum = undefined;  //记录varying最终要变成vec2还是vc3
	this.uniformData = []; //这个是记录最终生成的数值，直接通过uniform传入的
  }
  
  /*==========================map部分======================================结尾========================*/
  
  rewrite = function(gl, canvas){
	ProgramDataMap = [];
	ShaderDataMap = [];
	BufferDataMap = [];
	AttriDataMap = [];
	AttributeLocMap = [];
	UniformDataMap = [];
	UniformLocMap = [];
  
  
  
  
	/*====================关于program和shader source部分的代码=================开头=======================*/
	//重新定义createShader
	gl.my_createShader = gl.__proto__.createShader;
	gl.createShader = function (shaderTpye){
	  var newData = new Shader_data;
	  newData.shaderTpye = shaderTpye;
	  newData.shaderName = gl.my_createShader(shaderTpye);
	  ShaderDataMap.push(newData);
	  return newData.shaderName;
	}
  
	gl.my_shaderSource = gl.__proto__.shaderSource;
	gl.shaderSource = function(shaderName,shaderSource){
	  gl.my_shaderSource(shaderName,shaderSource);
	  for (var i = 0; i < ShaderDataMap.length; i++){
		if (ShaderDataMap[i].shaderName == shaderName){
		  ShaderDataMap[i].shaderSource = shaderSource;
		  return;
		}
	  }
	}
  
	gl.my_createProgram = gl.__proto__.createProgram;
	gl.createProgram = function (){
	  var newData = new Program_data;
	  newData.programName = gl.my_createProgram();
	  ProgramDataMap.push(newData);
	  return newData.programName;
	}
  
	gl.my_attachShader = gl.__proto__.attachShader;
	gl.attachShader = function (programName, shaderName){
	  //要先实现原本的功能，要不后面都一直报错
	  gl.my_attachShader(programName, shaderName);
	  var shaderData = new Shader_data;
	  shaderData = getShaderSource(shaderName);
	  //console.log("shaderData",shaderData);
	  for (var i = 0; i < ProgramDataMap.length; i++){
		if (ProgramDataMap[i].programName == programName){
		  if (shaderData.shaderTpye == 35633){
			//console.log("shaderData.shaderSource -->-->",shaderData.shaderSource);
			ProgramDataMap[i].vertexSource = shaderData.shaderSource;
		  }	
		  else
			ProgramDataMap[i].fragSource = shaderData.shaderSource;
		  ProgramDataMap[i].activeFlag = 0;
		  return;
		}
	  }
	}
  
	getShaderSource = function(shaderName){
	  for (var i = 0; i < ShaderDataMap.length; i++){
		if (ShaderDataMap[i].shaderName == shaderName)
		  return (ShaderDataMap[i]);
	  }
	}
	

	//判断是否要进入自动编译段！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！
	//判断是否要进入自动编译段！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！
	//判断是否要进入自动编译段！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！
	var parsingflag = 1;
	var Compiler;
	gl.my_useProgram =  gl.__proto__.useProgram;
	gl.useProgram = function (programName){
	  //这块执行原函数，只需要知道使用了哪一个program就可以了
	  gl.my_useProgram(programName);
	  for (var i = 0; i < ProgramDataMap.length; i++)
		//console/log("我们运行了useProgram");
		if (ProgramDataMap[i].programName == programName){
		  //console.log("我们激活了program的状态");
		  ProgramDataMap[i].activeFlag = 1;
		}	
		else
		  ProgramDataMap[i].activeFlag = 0;
		  
	//将eval并入这个部分
	if (parsingflag == 1){
		if ((vetexID == 3) ){
			var testShader = 
			`
			precision mediump float;
	
			attribute vec3 vertPosition;
			attribute vec2 vertTexCoord;
			varying vec2 fragTexCoord;
			uniform mat4 mWorld;
			uniform mat4 mView;
			uniform mat4 mProj;
	
			void main()
			{
			fragTexCoord = vertTexCoord;
			gl_Position = mProj * mView * mWorld * vec4(vertPosition, 1.0);
			}	
			`
			}else{
			var testShader = 
			  `
			precision mediump float;
			attribute vec3 vertPosition;
			attribute vec2 vertTexCoord;
			attribute vec3 vertNormal;
			varying vec2 fragTexCoord;
			varying vec3 fragNormal;
			varying vec4 vPosition;
			uniform mat4 mWorld;
			uniform mat4 mView;
			uniform mat4 mProj;
			void main()
			{
			  vPosition = mView * vec4(vertPosition, 1.0);
			  fragTexCoord = vertTexCoord;
			  fragNormal = (mWorld * vec4(vertNormal, 0.0)).xyz;
			  gl_Position = mProj * mView * mWorld * vec4(vertPosition, 1.0);
			}
			`
			}
			  //console.log("ProgramDataMap",ProgramDataMap);
			var t0 = performance.now();
			var Compiler = GLSL();
			//console.log("testShader",testShader);
			compiled = Compiler.compile(testShader);
			// console.log("shader",testShader);
			// console.log("compiled",compiled);
	
			var t1 = performance.now();
			console.log('compile', t1 - t0);

	}
	}
  
	/*===================关于program和shader source部分的代码=================结尾================*/
  
	/*===============关于Attribute部分的代码=======================开头==========================*/
	//重新定义bindbuffer
	//有两种情况，第一个是第一次出现这个buffer，需要完全加入一个新的attribute变量，第二种情况，只是更新目前到底在修饰哪一个buffer
	//bindbuffer这块出现了次数远远多于正常情况的情况
	//var bindbuffernum = 0;
	gl.my_bindBuffer = gl.__proto__.bindBuffer;
	gl.bindBuffer = function (bufferType, bufferName){
	  //console.log("bufferName",bufferName);
	  //bindbuffernum ++;
	  initBufferMap(); // 重新把之前所有active的buffer状态归位inactive
	  addBufferMap(bufferType, bufferName);  //判断是否拥有这条buffer，如果没有的话就直接加入这个buffer
	  activeBufferMap(bufferType, bufferName); //激活当前的buffer
  
  
	  //这块还是需要让原始代码运行
	  // *******************************这块在去掉另外一套系统后，应该可以删除
	  gl.my_bindBuffer(bufferType, bufferName);
	}
  
	/*------------用在bindbuffer 的几个函数-------------*/	  
	// 重新把之前所有active的buffer状态归位inactive
	initBufferMap = function(){
	  for (i = 0; i < BufferDataMap.length; i++)
		BufferDataMap[i].activeFlag = 0;
	}
  
	//判断是否拥有这条buffer，如果没有的话就直接加入这个buffer
	addBufferMap = function(bufferType, bufferName){
	  //如果出现了重复的buffer，要在原始基础上直接赋值
	  for (i = 0; i < BufferDataMap.length; i++){
		if (BufferDataMap[i].bufferName == bufferName){
		  if (bufferType == 34963){
			for (var j = 0; j < BufferDataMap.length; j++)
			  BufferDataMap[j].activeElement = 0;
			BufferDataMap[i].activeElement = 1;
		  }
		  return;
		}	
	  }
	  var newData = new Buffer_data();
	  newData.bufferType = bufferType;
	  newData.bufferName = bufferName;
	  if (bufferType == 34963){
		for (var i = 0; i < BufferDataMap.length; i++)
		  BufferDataMap[i].activeElement = 0;
		newData.activeElement = 1;
	  }
	  BufferDataMap.push(newData);
	  return;
	}
  
	//激活当前的buffer
	activeBufferMap = function(bufferType, bufferName){
	  for (i = 0; i < BufferDataMap.length; i++)
		if (BufferDataMap[i].bufferName == bufferName){
		  BufferDataMap[i].activeFlag = 1;
		  return;
		}
	}
	/*----------------------------------------------------*/
  
	//重新定义bufferData
	gl.my_glbufferData = gl.__proto__.bufferData;
	gl.bufferData = function (a, bufferData, c){
	  for (i = 0; i < BufferDataMap.length; i++){
		if (BufferDataMap[i].activeFlag == 1){
		  BufferDataMap[i].bufferData = bufferData;
		}
	  }
	} 
  
  
	//重新定义getAttribLocation
	//这块需要建立一个新的map，记录随机产生的数字和其对应关系的
	gl.my_getAttribLocation = gl.__proto__.getAttribLocation;
	gl.getAttribLocation = function (programName, shaderName){
	  for (i = 0; i < AttributeLocMap.length; i++){
		if ((AttributeLocMap[i].programName == programName) && (AttributeLocMap[i].shaderName == shaderName))
		  return AttributeLocMap[i].randomNumber;
	  }	
	  var newData = new Attribute_loc;
	  newData.randomNumber = creatNumber(); // 通过creatNumber得到一个确定的函数
	  newData.programName = programName;
	  newData.shaderName = shaderName;
	  AttributeLocMap.push(newData);
	  return newData.randomNumber;   //将位置的数值返回以方便在gl.vertexAttribPointer中将两个map进行关连
  
	}
  
	/*------------gl.getAttribLocation------开头-------------*/
	//用getAttribLocation的函数
	var __Locnumber = 100; //初始化函数
	//单独建立函数的原因是在单个program的时候，单一__Locnumber是可行的，我担心在three.js多program和多attribute的情况下，可能会出问题，先暂时写成这样，调试的时候再做修改。
	creatNumber = function(){
	  __Locnumber++;
	  return __Locnumber;
	}
	/*--------------------------------------------------------*/ 
  
  
  
  
  
	gl.my_vertexAttribPointer = gl.__proto__.vertexAttribPointer;
	gl.vertexAttribPointer = function (positionAttributeLocation, size, type, normalize, stride, offset){
	  /*------------map部分------开头-------------*/
	  //这块就需要将两个map进行关连，最终合成到一个map中
	  //此时，bindbuffer已经激活了一个javascript部分的buffer数据类型，现在需要将其合成
	  //在这里要考虑单个buffer最终合成多个attribute这种情况，所以说应该是建立buffer map和attribute map两张表格才可以（上个版本只用了一个表格，是不可以的）
  
  
	  //先提取getAttribLocation能获得的glsl部分的信息
	  var ShaderData = new Attribute_loc;
	  ShaderData = getShaderData(positionAttributeLocation);
  
	  //提取bufferdata中的信息
	  var BufferData = new Buffer_data;
	  BufferData = getBufferData();
	  //console.log("BufferData",BufferData);
  
  
	  //在这里生成一个新的attribute条目
	  // 这个版本需要考虑重复赋值这种情况
	  addAttriMap(ShaderData,BufferData,size,stride/4,offset/4);
	  //console.log("AttriDataMap",AttriDataMap);
	}
  
	/*------------gl.vertexAttribPointer------开头-------------*/
	//用在vertexAttribPointer中的函数
	//提取getAttribLocation能获得的glsl部分的信息
	var getShaderData = function(positionAttributeLocation){
	  for (var i = 0; i < AttributeLocMap.length; i++){
		if (AttributeLocMap[i].randomNumber == positionAttributeLocation)
		  return AttributeLocMap[i];
	  }
  
	}
  
  
	//提取bufferdata中的信息
	var getBufferData = function(){
	  for (var i = 0; i < BufferDataMap.length; i++){
		if (BufferDataMap[i].activeFlag == 1)
		  return BufferDataMap[i];
	  }
	}
  
	//判断是否需要有element array存在,0 表示不存在， bufferdata 表示存在
	//gl.ARRAY_BUFFER 34962
	//gl.ELEMENT_ARRAY_BUFFER 34963
	var getEleFlag = function(){
	  for (var i = 0; i < BufferDataMap.length; i++){
		if (BufferDataMap[i].bufferType == 34963)
		  return BufferDataMap[i].bufferData;
	  }
	  return 0;
	}
  
	//考虑了attribute会被重复赋值的情况。
	//需要判断是否需要重组bufferdata
	var addAttriMap = function( ShaderData = new Attribute_loc,BufferData = new Buffer_data,size,stride,offset){
	  //这是一种特殊情况
	  if (stride == 0)
		stride = size;
	  var newAttri = new Attri_data;
	  //var temData = [];
	  newAttri.shaderName = ShaderData.shaderName;
	  newAttri.programName = ShaderData.programName;
	  for (var i = 0; i < AttriDataMap.length; i++){
		if ( (newAttri.shaderName == AttriDataMap[i].shaderName) && (newAttri.programName == AttriDataMap[i].programName) ){
		  AttriDataMap[i].attriEleNum = size;
		  for (var i = 0; i * stride < BufferData.bufferData.length; i++){
			for (var j = i * stride + offset; j < i * stride + offset + size; j++)
			  AttriDataMap[i].uniformData = AttriDataMap[i].uniformData.concat(BufferData.bufferData[j]);
		  }
		  return;
		}
	  }
	  newAttri.attriEleNum = size;
	  for (var i = 0; i * stride < BufferData.bufferData.length; i++){
		for (var j = i * stride + offset; j < i * stride + offset + size; j++)
		  newAttri.uniformData = newAttri.uniformData.concat(BufferData.bufferData[j]);
	  }
	  //console.log("newAttri",newAttri);
  
	  // 将attribute加入map
	  AttriDataMap.push(newAttri);
	}
  
	/*----------------------------------------------------------------------*/ 
  
  
  
  
  
  
  
	/*===================关于Attribute部分的代码========================结尾===============*/
  
  
  
	/*====================关于uniform部分的代码==========================开头============*/
	//重新定义getAttribLocation
	//这块需要建立一个新的map，记录随机产生的数字和其对应关系的
	gl.my_getUniformLocation = gl.__proto__.getUniformLocation;
	gl.getUniformLocation = function (programName, shaderName){
	  // 如果出现了重复的，就直接返回原始值
	  for (i = 0; i < UniformLocMap.length;i++){
		if ((UniformLocMap[i].programName == programName) && (UniformLocMap[i].shaderName == shaderName))
		  return UniformLocMap[i].randomNumber;
	  }
  
	  var newData = new Uniform_loc;
	  newData.randomNumber = creatNumber();
	  newData.programName = programName;
	  newData.shaderName = shaderName;
	  UniformLocMap.push(newData);
  
  
	  //开启map状态
	  return newData.randomNumber;   
  
	}
  
	//进入uniform 赋值区域  需要重新定义大量函数， 放在一起定义就好了
	//这个类型是int 0 还是 float 1
	//传入loc，data，type, num
	//个数是1的情况
	gl.my_uniform1i = gl.__proto__.uniform1i;
	gl.uniform1i = function (uniformLoc, uniformData){
	  AddUniformMap(uniformLoc, uniformData, 0, 1);
	}
  
	gl.my_uniform1iv = gl.__proto__.uniform1iv;
	gl.uniform1iv = function (uniformLoc, uniformData){
	  AddUniformMap(uniformLoc, uniformData, 0, 1);
	}
  
	gl.my_uniform1f = gl.__proto__.uniform1f;
	gl.uniform1f = function (uniformLoc, uniformData){
	  AddUniformMap(uniformLoc, uniformData, 1, 1);
	}
  
	gl.my_uniform1fv = gl.__proto__.uniform1fv;
	gl.uniform1fv = function (uniformLoc, uniformData){
	  AddUniformMap(uniformLoc, uniformData, 1, 1);
	}
  
	//个数是2的情况
	gl.my_uniform2i = gl.__proto__.uniform2i;
	gl.uniform2i = function (uniformLoc, uniformData0, uniformData1){
	  var uniformData = [uniformData0, uniformData1];
	  AddUniformMap(uniformLoc, uniformData, 0, 2);
	}
  
	gl.my_uniform2iv = gl.__proto__.uniform2iv;
	gl.uniform2iv = function (uniformLoc, uniformData){
	  AddUniformMap(uniformLoc, uniformData, 0, 2);
	}
  
	gl.my_uniform2f = gl.__proto__.uniform2f;
	gl.uniform2f = function (uniformLoc,  uniformData0, uniformData1){
	  var uniformData = [uniformData0, uniformData1];
	  AddUniformMap(uniformLoc, uniformData, 1, 2);
	}
  
	gl.my_uniform2fv = gl.__proto__.uniform2fv;
	gl.uniform2fv = function (uniformLoc, uniformData){
	  AddUniformMap(uniformLoc, uniformData, 1, 2);
	}
  
	//个数是3的情况
	gl.my_uniform3i = gl.__proto__.uniform3i;
	gl.uniform3i = function (uniformLoc, uniformData0, uniformData1, uniformData2){
	  var uniformData = [uniformData0, uniformData1, uniformData2];
	  AddUniformMap(uniformLoc, uniformData, 0, 3);
	}
//    var __testnumber = 0;
	gl.my_uniform3iv = gl.__proto__.uniform3iv;
	gl.uniform3iv = function (uniformLoc, uniformData){
	  AddUniformMap(uniformLoc, uniformData, 0, 3);
	//   console.log("__testnumber",__testnumber++);
	//   console.log("fdsfdsfsdfdsfds");
	}
  
	gl.my_uniform3f = gl.__proto__.uniform3f;
	gl.uniform3f = function (uniformLoc,  uniformData0, uniformData1, uniformData2){
	  var uniformData = [uniformData0, uniformData1, uniformData2];
	  AddUniformMap(uniformLoc, uniformData, 1, 3);
	}
  
	gl.my_uniform3fv = gl.__proto__.niform3fv;
	gl.niform3fv = function (uniformLoc, uniformData){
	  AddUniformMap(uniformLoc, uniformData, 1, 3);
	}
  
	//个数是4的情况
	gl.my_uniform4i = gl.__proto__.uniform4i;
	gl.uniform4i = function (uniformLoc, uniformData0, uniformData1, uniformData2,uniformData3){
	  var uniformData = [uniformData0, uniformData1, uniformData2, ,uniformData3];
	  AddUniformMap(uniformLoc, uniformData, 0, 4);
	}
  
	gl.my_uniform4iv = gl.__proto__.uniform4iv;
	gl.uniform4iv = function (uniformLoc, uniformData){
	  AddUniformMap(uniformLoc, uniformData, 0, 4);
	}
  
	gl.my_uniform4f = gl.__proto__.uniform4f;
	gl.uniform4f = function (uniformLoc,  uniformData0, uniformData1, uniformData2, uniformData3){
	  var uniformData = [uniformData0, uniformData1, uniformData2, ,uniformData3];
	  AddUniformMap(uniformLoc, uniformData, 1, 4);
	}
  
	gl.my_uniform4fv = gl.__proto__.uniform4fv;
	gl.uniform4fv = function (uniformLoc, uniformData){
	  AddUniformMap(uniformLoc, uniformData, 1, 4);
	}
  
	//matrix 
	//在这里不考虑2*3， 2*4， 3*4 这几种情况
	gl.my_uniformMatrix2fv = gl.__proto__.uniformMatrix2fv;
	gl.uniformMatrix2fv = function (uniformLoc,transpose, uniformData){
	  AddUniformMap(uniformLoc, uniformData, 1, 12);
	}
  
	gl.my_uniformMatrix3fv = gl.__proto__.uniformMatrix3fv;
	gl.uniformMatrix3fv = function (uniformLoc,transpose, uniformData){
	  AddUniformMap(uniformLoc, uniformData, 1, 13);
	}
  
	gl.my_uniformMatrix4fv = gl.__proto__.uniformMatrix4fv;
	gl.uniformMatrix4fv = function (uniformLoc,transpose, uniformData){
	  //console.log("^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^");
	  //console.log("uniformData",uniformData);
	  AddUniformMap(uniformLoc, uniformData, 1, 14);
	}
  
  
	/*------------gl.uniformXX和gl.uniformMatrix4XX------开头-------------*/
	//需要考虑重复赋值的情况
	var AddUniformMap = function(uniformLoc, uniformData, type, size){
	  var newUniform = new Uniform_data;
	  var newUniformLoc = new Uniform_loc;
	  //console.log("**************************************************************");
	  //console.log("uniformLoc", uniformLoc);
	  //console.log("UniformLocMap",UniformLocMap);
	  newUniformLoc = getUniformLoc(uniformLoc);
	  //console.log("**************************************************************");
	  //console.log(newUniformLoc);
	  newUniform.programName = newUniformLoc.programName;
	  newUniform.shaderName = newUniformLoc.shaderName;
	  for (var i = 0; i < UniformDataMap.length; i++){
		if ((newUniform.programName == UniformDataMap[i].programName) && (newUniform.shaderName == UniformDataMap[i].shaderName)){
		  UniformDataMap[i].uniformNum = size;
		  UniformDataMap[i].uniformType = type;
		  UniformDataMap[i].uniformData = uniformData;
		  UniformDataMap[i].uniformActive = 1;   // 这个是在后面和shader互动的时候使用的
		  return;
		}
	  }
	  newUniform.uniformNum = size;
	  newUniform.uniformType = type;
	  newUniform.uniformData = uniformData;
	  newUniform.uniformActive = 1;   // 这个是在后面和shader互动的时候使用的
	  UniformDataMap.push(newUniform);
	}
  
	var getUniformLoc = function(randomNumber){
	  for (var i = 0; i < UniformLocMap.length; i++)
		if (randomNumber == UniformLocMap[i].randomNumber)
		  return UniformLocMap[i];
	}
  
	/*---------------------------------------------------------------*/ 
  
	/*=========================关于uniform部分的代码================结尾==================*/
  
  
	/*=========================关于draw部分的代码====================开头==================*/
	gl.my_drawElements = gl.__proto__.drawElements;
	gl.drawElements = function(mode, count, type, offset){
	  var elementArray = [];
	  var activeProgram;
	  var activeProgramNum;
	  activeProgram = getactiveProgram();
	  activeProgramNum = getactiveProgramNum();
    var t0 = performance.now();
	  elementArray = getElementArray(count,offset);
    var t1 = performance.now();
    console.log('prepare for drawarrays', t1 - t0);
    for (var i = 0; i < AttriDataMap.length; i++){
      var newData = new Attri_data;
      if( AttriDataMap[i].programName == activeProgram){
        newData.programName = AttriDataMap[i].programName;
        newData.shaderName = AttriDataMap[i].shaderName;
        newData.attriEleNum = AttriDataMap[i].attriEleNum;
        newData.uniformData = AttriDataMap[i].uniformData;

        newData.uniformData = [];
        for (var j = 0; j < elementArray.length; j++){
          for (var k = elementArray[j] * newData.attriEleNum; k <  (elementArray[j] + 1) * newData.attriEleNum; k++)
            newData.uniformData.push(AttriDataMap[i].uniformData[k]);
        }
        ProgramDataMap[activeProgramNum].attriData.push(newData);
      }
    }
    gl.drawArrays(mode, 0 , count);
  }

  getactiveProgram = function(){
    for (var i = 0; i < ProgramDataMap.length; i++)
      if (ProgramDataMap[i].activeFlag == 1)
        return ProgramDataMap[i].programName;
  }

  getactiveProgramNum = function(){
    for (var i = 0; i < ProgramDataMap.length; i++)
      if (ProgramDataMap[i].activeFlag == 1)
        return i;
  }

  getElementArray = function(count,offset){
    var elementArray = [];
    var returnArray = [];
    for (var i = 0; i < BufferDataMap.length; i++)
      if (BufferDataMap[i].activeElement == 1)
        elementArray = BufferDataMap[i].bufferData;
    return elementArray.slice(offset, offset + count);
  }

  //mode
  //gl.POINTS 0
  //gl.LINES 1
  //gl.LINE_LOOP 2
  //gl.LINE_STRIP 3
  //gl.TRIANGLES 4
  var varyingmap = [];
  gl.my_drawArrays = gl.__proto__.drawArrays;
  gl.drawArrays = function(mode, first, count){
    var startdraw = performance.now();
    var activeProgram;
    var activeProgramNum;
    activeProgram = getactiveProgram();
    activeProgramNum = getactiveProgramNum();
    //没有进入gl.element直接进入这个gl.drawelement
    //加入attribute的部分
    // console.log("BufferDataMap",BufferDataMap);
    // console.log("AttriDataMap",AttriDataMap);
    if (ProgramDataMap[activeProgramNum].attriData.length == 0){
      for (var i = 0; i < AttriDataMap.length; i++)
        if( AttriDataMap[i].programName == activeProgram){
          var newData = new Attri_data;
          newData.programName = AttriDataMap[i].programName;
          newData.shaderName = AttriDataMap[i].shaderName;
          newData.attriEleNum = AttriDataMap[i].attriEleNum;
          newData.uniformData = [];
          // console.log("start",newData.attriEleNum * first);
          // console.log("end",newData.attriEleNum * (first + count));
          //在这里面添加first和count
          for(var j = newData.attriEleNum * first; j < newData.attriEleNum * (first + count); j++)
            newData.uniformData = newData.uniformData.concat(AttriDataMap[i].uniformData[j]);
          ProgramDataMap[activeProgramNum].attriData.push(newData);
        }

    }

    //加入uniform的部分
    for(var i = 0; i < UniformDataMap.length; i++){
      if (UniformDataMap[i].programName == activeProgram){
        var newData = new Uniform_data;
        newData.programName = UniformDataMap[i].programName;
        newData.shaderName = UniformDataMap[i].shaderName;
        newData.uniformNum = UniformDataMap[i].uniformNum;
        newData.uniformType = UniformDataMap[i].uniformType;
        newData.uniformActive = UniformDataMap[i].uniformActive;
        newData.uniformData = [];
        for (var idx in UniformDataMap[i].uniformData)
          newData.uniformData.push(UniformDataMap[i].uniformData[idx]);
        ProgramDataMap[activeProgramNum].uniformData.push(newData);
      }
    } 
    //console.log("数据处理区域完毕");
    //console.log("ProgramDataMap", ProgramDataMap);



	  if (parsingflag == 1){
		/*------------------自动化连接部分------------------------------------*/
		/*------------------数据输入部分--------------------------------------*/
		
  
		//需要进行mat从一维到二维的转化
		//先进行一个临时的转化
		var Tem_uniform_data = function(){
		  this.shaderName = undefined;
		  this.uniformData = undefined;
		}
		// console.log("ProgramDataMap",ProgramDataMap);
		var TemUniformDataMap = [];
		set_value_dict = {};
  
		//这里是转化的第一个版本
		handflag = 1;
		if (handflag == 0){
			var t0 = performance.now();
			for (var i in ProgramDataMap[activeProgramNum].attriData){
			var newData = new Tem_uniform_data;
			newData.shaderName = ProgramDataMap[activeProgramNum].attriData[i].shaderName;
			newData.uniformData = [];
			for (j = 0; j < ProgramDataMap[activeProgramNum].attriData[i].uniformData.length; j += ProgramDataMap[activeProgramNum].attriData[i].attriEleNum){
				var tem = [];
				for (k = j; k < j + ProgramDataMap[activeProgramNum].attriData[i].attriEleNum; k++){
				tem.push(ProgramDataMap[activeProgramNum].attriData[i].uniformData[k]);
				}
				newData.uniformData.push(tem);
			}
			TemUniformDataMap.push(newData);
			}
	
			//console.log("ProgramDataMap",ProgramDataMap);
			for (var i in ProgramDataMap[activeProgramNum].uniformData){
			var newData = new Tem_uniform_data;
			newData.shaderName = ProgramDataMap[activeProgramNum].uniformData[i].shaderName;
			if (ProgramDataMap[activeProgramNum].uniformData[i].uniformNum == 14){
				//console.log("进入转换");
				newData.uniformData = [];
				for (var j = 0; j <= 3; j++){
				var tem = [];
				for (var k = 1; k <= 4; k++){
					tem = tem.concat(ProgramDataMap[activeProgramNum].uniformData[i].uniformData[j * 4 + k - 1]);
				}
				newData.uniformData.push(tem);
				}
			}else{
				//这块正式写的时候要改，要不然会修改原始值的！！！！！！！！！！！！！！！！！！！！！
				newData.uniformData = ProgramDataMap[activeProgramNum].uniformData[i].uniformData;
			}
			TemUniformDataMap.push(newData);
			}


			var t1 = performance.now();
			console.log('convert', t1 - t0);
			//  console.log("TemUniformDataMap",TemUniformDataMap);
	
			
			for (var i in TemUniformDataMap){
			set_value_dict[TemUniformDataMap[i].shaderName] = TemUniformDataMap[i].uniformData;
			}

			var t0 = performance.now();
			compiled = set_values(set_value_dict, compiled,TemUniformDataMap[0].length);
			var t1 = performance.now();
			//console.log("compiled",compiled);
			console.log('==========set_values', t1 - t0);

			var t0 = performance.now();
			eval(compiled);
			var t1 = performance.now();
			console.log('==========eval', t1 - t0);
		}else{
			var vertPosition = [[0.46875,0.542186975479126,0.2421880066394806],[0.4375,0.534375011920929,0.1640630066394806],[0.5,0.612500011920929,0.09375],[0.46875,0.542186975479126,0.2421880066394806],[0.5,0.612500011920929,0.09375],[0.5625,0.628125011920929,0.2421880066394806],[-0.5,0.612500011920929,0.09375],[-0.4375,0.534375011920929,0.1640630066394806],[-0.46875,0.542186975479126,0.2421880066394806],[-0.5,0.612500011920929,0.09375],[-0.46875,0.542186975479126,0.2421880066394806],[-0.5625,0.628125011920929,0.2421880066394806],[0.5625,0.628125011920929,0.2421880066394806],[0.5,0.612500011920929,0.09375],[0.546875,0.721875011920929,0.0546875],[0.5625,0.628125011920929,0.2421880066394806],[0.546875,0.721875011920929,0.0546875],[0.625,0.737500011920929,0.2421880066394806],[-0.546875,0.721875011920929,0.0546875],[-0.5,0.612500011920929,0.09375],[-0.5625,0.628125011920929,0.2421880066394806],[-0.546875,0.721875011920929,0.0546875],[-0.5625,0.628125011920929,0.2421880066394806],[-0.625,0.737500011920929,0.2421880066394806],[0.5,0.612500011920929,0.09375],[0.3515630066394806,0.581250011920929,0.03125],[0.3515630066394806,0.682811975479126,-0.0234375],[0.5,0.612500011920929,0.09375],[0.3515630066394806,0.682811975479126,-0.0234375],[0.546875,0.721875011920929,0.0546875],[-0.3515630066394806,0.682811975479126,-0.0234375],[-0.3515630066394806,0.581250011920929,0.03125],[-0.5,0.612500011920929,0.09375],[-0.3515630066394806,0.682811975479126,-0.0234375],[-0.5,0.612500011920929,0.09375],[-0.546875,0.721875011920929,0.0546875],[0.4375,0.534375011920929,0.1640630066394806],[0.3515630066394806,0.518750011920929,0.1328130066394806],[0.3515630066394806,0.581250011920929,0.03125],[0.4375,0.534375011920929,0.1640630066394806],[0.3515630066394806,0.581250011920929,0.03125],[0.5,0.612500011920929,0.09375],[-0.3515630066394806,0.581250011920929,0.03125],[-0.3515630066394806,0.518750011920929,0.1328130066394806],[-0.4375,0.534375011920929,0.1640630066394806],[-0.3515630066394806,0.581250011920929,0.03125],[-0.4375,0.534375011920929,0.1640630066394806],[-0.5,0.612500011920929,0.09375],[0.3515630066394806,0.518750011920929,0.1328130066394806],[0.2734380066394806,0.503125011920929,0.1640630066394806],[0.203125,0.557811975479126,0.09375],[0.3515630066394806,0.518750011920929,0.1328130066394806],[0.203125,0.557811975479126,0.09375],[0.3515630066394806,0.581250011920929,0.03125],[-0.203125,0.557811975479126,0.09375],[-0.2734380066394806,0.503125011920929,0.1640630066394806],[-0.3515630066394806,0.518750011920929,0.1328130066394806],[-0.203125,0.557811975479126,0.09375],[-0.3515630066394806,0.518750011920929,0.1328130066394806],[-0.3515630066394806,0.581250011920929,0.03125],[0.3515630066394806,0.581250011920929,0.03125],[0.203125,0.557811975479126,0.09375],[0.15625,0.651561975479126,0.0546875],[0.3515630066394806,0.581250011920929,0.03125],[0.15625,0.651561975479126,0.0546875],[0.3515630066394806,0.682811975479126,-0.0234375],[-0.15625,0.651561975479126,0.0546875],[-0.203125,0.557811975479126,0.09375],[-0.3515630066394806,0.581250011920929,0.03125],[-0.15625,0.651561975479126,0.0546875],[-0.3515630066394806,0.581250011920929,0.03125],[-0.3515630066394806,0.682811975479126,-0.0234375],[0.203125,0.557811975479126,0.09375],[0.140625,0.557811975479126,0.2421880066394806],[0.078125,0.643750011920929,0.2421880066394806],[0.203125,0.557811975479126,0.09375],[0.078125,0.643750011920929,0.2421880066394806],[0.15625,0.651561975479126,0.0546875],[-0.078125,0.643750011920929,0.2421880066394806],[-0.140625,0.557811975479126,0.2421880066394806],[-0.203125,0.557811975479126,0.09375],[-0.078125,0.643750011920929,0.2421880066394806],[-0.203125,0.557811975479126,0.09375],[-0.15625,0.651561975479126,0.0546875],[0.2734380066394806,0.503125011920929,0.1640630066394806],[0.2421880066394806,0.503125011920929,0.2421880066394806],[0.140625,0.557811975479126,0.2421880066394806],[0.2734380066394806,0.503125011920929,0.1640630066394806],[0.140625,0.557811975479126,0.2421880066394806],[0.203125,0.557811975479126,0.09375],[-0.140625,0.557811975479126,0.2421880066394806],[-0.2421880066394806,0.503125011920929,0.2421880066394806],[-0.2734380066394806,0.503125011920929,0.1640630066394806],[-0.140625,0.557811975479126,0.2421880066394806],[-0.2734380066394806,0.503125011920929,0.1640630066394806],[-0.203125,0.557811975479126,0.09375],[0.2421880066394806,0.503125011920929,0.2421880066394806],[0.2734380066394806,0.503125011920929,0.328125],[0.203125,0.557811975479126,0.390625],[0.2421880066394806,0.503125011920929,0.2421880066394806],[0.203125,0.557811975479126,0.390625],[0.140625,0.557811975479126,0.2421880066394806],[-0.203125,0.557811975479126,0.390625],[-0.2734380066394806,0.503125011920929,0.328125],[-0.2421880066394806,0.503125011920929,0.2421880066394806],[-0.203125,0.557811975479126,0.390625],[-0.2421880066394806,0.503125011920929,0.2421880066394806],[-0.140625,0.557811975479126,0.2421880066394806],[0.140625,0.557811975479126,0.2421880066394806],[0.203125,0.557811975479126,0.390625],[0.15625,0.651561975479126,0.4375],[0.140625,0.557811975479126,0.2421880066394806],[0.15625,0.651561975479126,0.4375],[0.078125,0.643750011920929,0.2421880066394806],[-0.15625,0.651561975479126,0.4375],[-0.203125,0.557811975479126,0.390625],[-0.140625,0.557811975479126,0.2421880066394806],[-0.15625,0.651561975479126,0.4375],[-0.140625,0.557811975479126,0.2421880066394806],[-0.078125,0.643750011920929,0.2421880066394806],[0.203125,0.557811975479126,0.390625],[0.3515630066394806,0.581250011920929,0.453125],[0.3515630066394806,0.682811975479126,0.515625],[0.203125,0.557811975479126,0.390625],[0.3515630066394806,0.682811975479126,0.515625],[0.15625,0.651561975479126,0.4375],[-0.3515630066394806,0.682811975479126,0.515625],[-0.3515630066394806,0.581250011920929,0.453125],[-0.203125,0.557811975479126,0.390625],[-0.3515630066394806,0.682811975479126,0.515625],[-0.203125,0.557811975479126,0.390625],[-0.15625,0.651561975479126,0.4375],[0.2734380066394806,0.503125011920929,0.328125],[0.3515630066394806,0.518750011920929,0.359375],[0.3515630066394806,0.581250011920929,0.453125],[0.2734380066394806,0.503125011920929,0.328125],[0.3515630066394806,0.581250011920929,0.453125],[0.203125,0.557811975479126,0.390625],[-0.3515630066394806,0.581250011920929,0.453125],[-0.3515630066394806,0.518750011920929,0.359375],[-0.2734380066394806,0.503125011920929,0.328125],[-0.3515630066394806,0.581250011920929,0.453125],[-0.2734380066394806,0.503125011920929,0.328125],[-0.203125,0.557811975479126,0.390625],[0.3515630066394806,0.518750011920929,0.359375],[0.4375,0.534375011920929,0.328125],[0.5,0.612500011920929,0.390625],[0.3515630066394806,0.518750011920929,0.359375],[0.5,0.612500011920929,0.390625],[0.3515630066394806,0.581250011920929,0.453125],[-0.5,0.612500011920929,0.390625],[-0.4375,0.534375011920929,0.328125],[-0.3515630066394806,0.518750011920929,0.359375],[-0.5,0.612500011920929,0.390625],[-0.3515630066394806,0.518750011920929,0.359375],[-0.3515630066394806,0.581250011920929,0.453125],[0.3515630066394806,0.581250011920929,0.453125],[0.5,0.612500011920929,0.390625],[0.546875,0.721875011920929,0.4375],[0.3515630066394806,0.581250011920929,0.453125],[0.546875,0.721875011920929,0.4375],[0.3515630066394806,0.682811975479126,0.515625],[-0.546875,0.721875011920929,0.4375],[-0.5,0.612500011920929,0.390625],[-0.3515630066394806,0.581250011920929,0.453125],[-0.546875,0.721875011920929,0.4375],[-0.3515630066394806,0.581250011920929,0.453125],[-0.3515630066394806,0.682811975479126,0.515625],[0.5,0.612500011920929,0.390625],[0.5625,0.628125011920929,0.2421880066394806],[0.625,0.737500011920929,0.2421880066394806],[0.5,0.612500011920929,0.390625],[0.625,0.737500011920929,0.2421880066394806],[0.546875,0.721875011920929,0.4375],[-0.625,0.737500011920929,0.2421880066394806],[-0.5625,0.628125011920929,0.2421880066394806],[-0.5,0.612500011920929,0.390625],[-0.625,0.737500011920929,0.2421880066394806],[-0.5,0.612500011920929,0.390625],[-0.546875,0.721875011920929,0.4375],[0.4375,0.534375011920929,0.328125],[0.46875,0.542186975479126,0.2421880066394806],[0.5625,0.628125011920929,0.2421880066394806],[0.4375,0.534375011920929,0.328125],[0.5625,0.628125011920929,0.2421880066394806],[0.5,0.612500011920929,0.390625],[-0.5625,0.628125011920929,0.2421880066394806],[-0.46875,0.542186975479126,0.2421880066394806],[-0.4375,0.534375011920929,0.328125],[-0.5625,0.628125011920929,0.2421880066394806],[-0.4375,0.534375011920929,0.328125],[-0.5,0.612500011920929,0.390625],[0.46875,0.542186975479126,0.2421880066394806],[0.4375,0.534375011920929,0.328125],[0.4453130066394806,0.518750011920929,0.3359380066394806],[0.46875,0.542186975479126,0.2421880066394806],[0.4453130066394806,0.518750011920929,0.3359380066394806],[0.4765630066394806,0.526561975479126,0.2421880066394806],[-0.4453130066394806,0.518750011920929,0.3359380066394806],[-0.4375,0.534375011920929,0.328125],[-0.46875,0.542186975479126,0.2421880066394806],[-0.4453130066394806,0.518750011920929,0.3359380066394806],[-0.46875,0.542186975479126,0.2421880066394806],[-0.4765630066394806,0.526561975479126,0.2421880066394806],[0.4375,0.534375011920929,0.328125],[0.3515630066394806,0.518750011920929,0.359375],[0.3515630066394806,0.49531200528144836,0.375],[0.4375,0.534375011920929,0.328125],[0.3515630066394806,0.49531200528144836,0.375],[0.4453130066394806,0.518750011920929,0.3359380066394806],[-0.3515630066394806,0.49531200528144836,0.375],[-0.3515630066394806,0.518750011920929,0.359375],[-0.4375,0.534375011920929,0.328125],[-0.3515630066394806,0.49531200528144836,0.375],[-0.4375,0.534375011920929,0.328125],[-0.4453130066394806,0.518750011920929,0.3359380066394806],[0.3515630066394806,0.518750011920929,0.359375],[0.2734380066394806,0.503125011920929,0.328125],[0.265625,0.47968700528144836,0.3359380066394806],[0.3515630066394806,0.518750011920929,0.359375],[0.265625,0.47968700528144836,0.3359380066394806],[0.3515630066394806,0.49531200528144836,0.375],[-0.265625,0.47968700528144836,0.3359380066394806],[-0.2734380066394806,0.503125011920929,0.328125],[-0.3515630066394806,0.518750011920929,0.359375],[-0.265625,0.47968700528144836,0.3359380066394806],[-0.3515630066394806,0.518750011920929,0.359375],[-0.3515630066394806,0.49531200528144836,0.375],[0.2734380066394806,0.503125011920929,0.328125],[0.2421880066394806,0.503125011920929,0.2421880066394806],[0.2265630066394806,0.47968700528144836,0.2421880066394806],[0.2734380066394806,0.503125011920929,0.328125],[0.2265630066394806,0.47968700528144836,0.2421880066394806],[0.265625,0.47968700528144836,0.3359380066394806],[-0.2265630066394806,0.47968700528144836,0.2421880066394806],[-0.2421880066394806,0.503125011920929,0.2421880066394806],[-0.2734380066394806,0.503125011920929,0.328125],[-0.2265630066394806,0.47968700528144836,0.2421880066394806],[-0.2734380066394806,0.503125011920929,0.328125],[-0.265625,0.47968700528144836,0.3359380066394806],[0.2421880066394806,0.503125011920929,0.2421880066394806],[0.2734380066394806,0.503125011920929,0.1640630066394806],[0.265625,0.47968700528144836,0.15625],[0.2421880066394806,0.503125011920929,0.2421880066394806],[0.265625,0.47968700528144836,0.15625],[0.2265630066394806,0.47968700528144836,0.2421880066394806],[-0.265625,0.47968700528144836,0.15625],[-0.2734380066394806,0.503125011920929,0.1640630066394806],[-0.2421880066394806,0.503125011920929,0.2421880066394806],[-0.265625,0.47968700528144836,0.15625],[-0.2421880066394806,0.503125011920929,0.2421880066394806],[-0.2265630066394806,0.47968700528144836,0.2421880066394806],[0.2734380066394806,0.503125011920929,0.1640630066394806],[0.3515630066394806,0.518750011920929,0.1328130066394806],[0.3515630066394806,0.49531200528144836,0.1171879991889],[0.2734380066394806,0.503125011920929,0.1640630066394806],[0.3515630066394806,0.49531200528144836,0.1171879991889],[0.265625,0.47968700528144836,0.15625],[-0.3515630066394806,0.49531200528144836,0.1171879991889],[-0.3515630066394806,0.518750011920929,0.1328130066394806],[-0.2734380066394806,0.503125011920929,0.1640630066394806],[-0.3515630066394806,0.49531200528144836,0.1171879991889],[-0.2734380066394806,0.503125011920929,0.1640630066394806],[-0.265625,0.47968700528144836,0.15625],[0.3515630066394806,0.518750011920929,0.1328130066394806],[0.4375,0.534375011920929,0.1640630066394806],[0.4453130066394806,0.518750011920929,0.15625],[0.3515630066394806,0.518750011920929,0.1328130066394806],[0.4453130066394806,0.518750011920929,0.15625],[0.3515630066394806,0.49531200528144836,0.1171879991889],[-0.4453130066394806,0.518750011920929,0.15625],[-0.4375,0.534375011920929,0.1640630066394806],[-0.3515630066394806,0.518750011920929,0.1328130066394806],[-0.4453130066394806,0.518750011920929,0.15625],[-0.3515630066394806,0.518750011920929,0.1328130066394806],[-0.3515630066394806,0.49531200528144836,0.1171879991889],[0.4375,0.534375011920929,0.1640630066394806],[0.46875,0.542186975479126,0.2421880066394806],[0.4765630066394806,0.526561975479126,0.2421880066394806],[0.4375,0.534375011920929,0.1640630066394806],[0.4765630066394806,0.526561975479126,0.2421880066394806],[0.4453130066394806,0.518750011920929,0.15625],[-0.4765630066394806,0.526561975479126,0.2421880066394806],[-0.46875,0.542186975479126,0.2421880066394806],[-0.4375,0.534375011920929,0.1640630066394806],[-0.4765630066394806,0.526561975479126,0.2421880066394806],[-0.4375,0.534375011920929,0.1640630066394806],[-0.4453130066394806,0.518750011920929,0.15625],[0.3515630066394806,0.47187501192092896,0.2421880066394806],[0.4453130066394806,0.518750011920929,0.15625],[0.4765630066394806,0.526561975479126,0.2421880066394806],[-0.4765630066394806,0.526561975479126,0.2421880066394806],[-0.4453130066394806,0.518750011920929,0.15625],[-0.3515630066394806,0.47187501192092896,0.2421880066394806],[0.3515630066394806,0.49531200528144836,0.1171879991889],[0.4453130066394806,0.518750011920929,0.15625],[0.3515630066394806,0.47187501192092896,0.2421880066394806],[-0.3515630066394806,0.47187501192092896,0.2421880066394806],[-0.4453130066394806,0.518750011920929,0.15625],[-0.3515630066394806,0.49531200528144836,0.1171879991889],[0.3515630066394806,0.47187501192092896,0.2421880066394806],[0.265625,0.47968700528144836,0.15625],[0.3515630066394806,0.49531200528144836,0.1171879991889],[-0.3515630066394806,0.49531200528144836,0.1171879991889],[-0.265625,0.47968700528144836,0.15625],[-0.3515630066394806,0.47187501192092896,0.2421880066394806],[0.3515630066394806,0.47187501192092896,0.2421880066394806],[0.2265630066394806,0.47968700528144836,0.2421880066394806],[0.265625,0.47968700528144836,0.15625],[-0.265625,0.47968700528144836,0.15625],[-0.2265630066394806,0.47968700528144836,0.2421880066394806],[-0.3515630066394806,0.47187501192092896,0.2421880066394806],[0.3515630066394806,0.47187501192092896,0.2421880066394806],[0.265625,0.47968700528144836,0.3359380066394806],[0.2265630066394806,0.47968700528144836,0.2421880066394806],[-0.2265630066394806,0.47968700528144836,0.2421880066394806],[-0.265625,0.47968700528144836,0.3359380066394806],[-0.3515630066394806,0.47187501192092896,0.2421880066394806],[0.3515630066394806,0.47187501192092896,0.2421880066394806],[0.3515630066394806,0.49531200528144836,0.375],[0.265625,0.47968700528144836,0.3359380066394806],[-0.265625,0.47968700528144836,0.3359380066394806],[-0.3515630066394806,0.49531200528144836,0.375],[-0.3515630066394806,0.47187501192092896,0.2421880066394806],[0.3515630066394806,0.47187501192092896,0.2421880066394806],[0.4453130066394806,0.518750011920929,0.3359380066394806],[0.3515630066394806,0.49531200528144836,0.375],[-0.3515630066394806,0.49531200528144836,0.375],[-0.4453130066394806,0.518750011920929,0.3359380066394806],[-0.3515630066394806,0.47187501192092896,0.2421880066394806],[0.3515630066394806,0.47187501192092896,0.2421880066394806],[0.4765630066394806,0.526561975479126,0.2421880066394806],[0.4453130066394806,0.518750011920929,0.3359380066394806],[-0.4453130066394806,0.518750011920929,0.3359380066394806],[-0.4765630066394806,0.526561975479126,0.2421880066394806],[-0.3515630066394806,0.47187501192092896,0.2421880066394806],[0.1796880066394806,0.745311975479126,-0.96875],[0.1640630066394806,0.667186975479126,-0.9296879768371582],[0,0.659375011920929,-0.9453129768371582],[0.1796880066394806,0.745311975479126,-0.96875],[0,0.659375011920929,-0.9453129768371582],[0,0.721875011920929,-0.984375],[0,0.659375011920929,-0.9453129768371582],[-0.1640630066394806,0.667186975479126,-0.9296879768371582],[-0.1796880066394806,0.745311975479126,-0.96875],[0,0.659375011920929,-0.9453129768371582],[-0.1796880066394806,0.745311975479126,-0.96875],[0,0.721875011920929,-0.984375],[0.328125,0.776561975479126,-0.9453129768371582],[0.234375,0.667186975479126,-0.9140629768371582],[0.1640630066394806,0.667186975479126,-0.9296879768371582],[0.328125,0.776561975479126,-0.9453129768371582],[0.1640630066394806,0.667186975479126,-0.9296879768371582],[0.1796880066394806,0.745311975479126,-0.96875],[-0.1640630066394806,0.667186975479126,-0.9296879768371582],[-0.234375,0.667186975479126,-0.9140629768371582],[-0.328125,0.776561975479126,-0.9453129768371582],[-0.1640630066394806,0.667186975479126,-0.9296879768371582],[-0.328125,0.776561975479126,-0.9453129768371582],[-0.1796880066394806,0.745311975479126,-0.96875],[0.3671880066394806,0.768750011920929,-0.890625],[0.265625,0.635936975479126,-0.8203129768371582],[0.234375,0.667186975479126,-0.9140629768371582],[0.3671880066394806,0.768750011920929,-0.890625],[0.234375,0.667186975479126,-0.9140629768371582],[0.328125,0.776561975479126,-0.9453129768371582],[-0.234375,0.667186975479126,-0.9140629768371582],[-0.265625,0.635936975479126,-0.8203129768371582],[-0.3671880066394806,0.768750011920929,-0.890625],[-0.234375,0.667186975479126,-0.9140629768371582],[-0.3671880066394806,0.768750011920929,-0.890625],[-0.328125,0.776561975479126,-0.9453129768371582],[0.3515630066394806,0.729686975479126,-0.6953129768371582],[0.25,0.612500011920929,-0.703125],[0.265625,0.635936975479126,-0.8203129768371582],[0.3515630066394806,0.729686975479126,-0.6953129768371582],[0.265625,0.635936975479126,-0.8203129768371582],[0.3671880066394806,0.768750011920929,-0.890625],[-0.265625,0.635936975479126,-0.8203129768371582],[-0.25,0.612500011920929,-0.703125],[-0.3515630066394806,0.729686975479126,-0.6953129768371582],[-0.265625,0.635936975479126,-0.8203129768371582],[-0.3515630066394806,0.729686975479126,-0.6953129768371582],[-0.3671880066394806,0.768750011920929,-0.890625],[0.3125,0.729686975479126,-0.4375],[0.2109380066394806,0.589061975479126,-0.4453130066394806],[0.25,0.612500011920929,-0.703125],[0.3125,0.729686975479126,-0.4375],[0.25,0.612500011920929,-0.703125],[0.3515630066394806,0.729686975479126,-0.6953129768371582],[-0.25,0.612500011920929,-0.703125],[-0.2109380066394806,0.589061975479126,-0.4453130066394806],[-0.3125,0.729686975479126,-0.4375],[-0.25,0.612500011920929,-0.703125],[-0.3125,0.729686975479126,-0.4375],[-0.3515630066394806,0.729686975479126,-0.6953129768371582],[0.203125,0.737500011920929,-0.1875],[0.4375,0.768750011920929,-0.140625],[0.3984380066394806,0.628125011920929,-0.046875],[0.203125,0.737500011920929,-0.1875],[0.3984380066394806,0.628125011920929,-0.046875],[0.125,0.48750001192092896,-0.1015629991889],[-0.3984380066394806,0.628125011920929,-0.046875],[-0.4375,0.768750011920929,-0.140625],[-0.203125,0.737500011920929,-0.1875],[-0.3984380066394806,0.628125011920929,-0.046875],[-0.203125,0.737500011920929,-0.1875],[-0.125,0.48750001192092896,-0.1015629991889],[0.4375,0.768750011920929,-0.140625],[0.6328129768371582,0.760936975479126,-0.0390625],[0.6171879768371582,0.675000011920929,0.0546875],[0.4375,0.768750011920929,-0.140625],[0.6171879768371582,0.675000011920929,0.0546875],[0.3984380066394806,0.628125011920929,-0.046875],[-0.6171879768371582,0.675000011920929,0.0546875],[-0.6328129768371582,0.760936975479126,-0.0390625],[-0.4375,0.768750011920929,-0.140625],[-0.6171879768371582,0.675000011920929,0.0546875],[-0.4375,0.768750011920929,-0.140625],[-0.3984380066394806,0.628125011920929,-0.046875],[0.6328129768371582,0.760936975479126,-0.0390625],[0.828125,0.854686975479126,0.1484380066394806],[0.7265629768371582,0.698436975479126,0.203125],[0.6328129768371582,0.760936975479126,-0.0390625],[0.7265629768371582,0.698436975479126,0.203125],[0.6171879768371582,0.675000011920929,0.0546875],[-0.7265629768371582,0.698436975479126,0.203125],[-0.828125,0.854686975479126,0.1484380066394806],[-0.6328129768371582,0.760936975479126,-0.0390625],[-0.7265629768371582,0.698436975479126,0.203125],[-0.6328129768371582,0.760936975479126,-0.0390625],[-0.6171879768371582,0.675000011920929,0.0546875],[0.828125,0.854686975479126,0.1484380066394806],[0.859375,0.706250011920929,0.4296880066394806],[0.7421879768371582,0.643750011920929,0.375],[0.828125,0.854686975479126,0.1484380066394806],[0.7421879768371582,0.643750011920929,0.375],[0.7265629768371582,0.698436975479126,0.203125],[-0.7421879768371582,0.643750011920929,0.375],[-0.859375,0.706250011920929,0.4296880066394806],[-0.828125,0.854686975479126,0.1484380066394806],[-0.7421879768371582,0.643750011920929,0.375],[-0.828125,0.854686975479126,0.1484380066394806],[-0.7265629768371582,0.698436975479126,0.203125],[0.859375,0.706250011920929,0.4296880066394806],[0.7109379768371582,0.675000011920929,0.484375],[0.6875,0.573436975479126,0.4140630066394806],[0.859375,0.706250011920929,0.4296880066394806],[0.6875,0.573436975479126,0.4140630066394806],[0.7421879768371582,0.643750011920929,0.375],[-0.6875,0.573436975479126,0.4140630066394806],[-0.7109379768371582,0.675000011920929,0.484375],[-0.859375,0.706250011920929,0.4296880066394806],[-0.6875,0.573436975479126,0.4140630066394806],[-0.859375,0.706250011920929,0.4296880066394806],[-0.7421879768371582,0.643750011920929,0.375],[0.7109379768371582,0.675000011920929,0.484375],[0.4921880066394806,0.612500011920929,0.6015629768371582],[0.4375,0.503125011920929,0.546875],[0.7109379768371582,0.675000011920929,0.484375],[0.4375,0.503125011920929,0.546875],[0.6875,0.573436975479126,0.4140630066394806],[-0.4375,0.503125011920929,0.546875],[-0.4921880066394806,0.612500011920929,0.6015629768371582],[-0.7109379768371582,0.675000011920929,0.484375],[-0.4375,0.503125011920929,0.546875],[-0.7109379768371582,0.675000011920929,0.484375],[-0.6875,0.573436975479126,0.4140630066394806],[0.4921880066394806,0.612500011920929,0.6015629768371582],[0.3203130066394806,0.565625011920929,0.7578129768371582],[0.3125,0.46406200528144836,0.640625],[0.4921880066394806,0.612500011920929,0.6015629768371582],[0.3125,0.46406200528144836,0.640625],[0.4375,0.503125011920929,0.546875],[-0.3125,0.46406200528144836,0.640625],[-0.3203130066394806,0.565625011920929,0.7578129768371582],[-0.4921880066394806,0.612500011920929,0.6015629768371582],[-0.3125,0.46406200528144836,0.640625],[-0.4921880066394806,0.612500011920929,0.6015629768371582],[-0.4375,0.503125011920929,0.546875],[0.3203130066394806,0.565625011920929,0.7578129768371582],[0.15625,0.542186975479126,0.71875],[0.203125,0.44843700528144836,0.6171879768371582],[0.3203130066394806,0.565625011920929,0.7578129768371582],[0.203125,0.44843700528144836,0.6171879768371582],[0.3125,0.46406200528144836,0.640625],[-0.203125,0.44843700528144836,0.6171879768371582],[-0.15625,0.542186975479126,0.71875],[-0.3203130066394806,0.565625011920929,0.7578129768371582],[-0.203125,0.44843700528144836,0.6171879768371582],[-0.3203130066394806,0.565625011920929,0.7578129768371582],[-0.3125,0.46406200528144836,0.640625],[0.15625,0.542186975479126,0.71875],[0.0625,0.550000011920929,0.4921880066394806],[0.1015629991889,0.45625001192092896,0.4296880066394806],[0.15625,0.542186975479126,0.71875],[0.1015629991889,0.45625001192092896,0.4296880066394806],[0.203125,0.44843700528144836,0.6171879768371582],[-0.1015629991889,0.45625001192092896,0.4296880066394806],[-0.0625,0.550000011920929,0.4921880066394806],[-0.15625,0.542186975479126,0.71875],[-0.1015629991889,0.45625001192092896,0.4296880066394806],[-0.15625,0.542186975479126,0.71875],[-0.203125,0.44843700528144836,0.6171879768371582],[0.0625,0.550000011920929,0.4921880066394806],[0,0.557811975479126,0.4296880066394806],[0,0.47968700528144836,0.3515630066394806],[0.0625,0.550000011920929,0.4921880066394806],[0,0.47968700528144836,0.3515630066394806],[0.1015629991889,0.45625001192092896,0.4296880066394806],[0,0.47968700528144836,0.3515630066394806],[0,0.557811975479126,0.4296880066394806],[-0.0625,0.550000011920929,0.4921880066394806],[0,0.47968700528144836,0.3515630066394806],[-0.0625,0.550000011920929,0.4921880066394806],[-0.1015629991889,0.45625001192092896,0.4296880066394806],[0.1640630066394806,0.526561975479126,0.4140630066394806],[0.25,0.542186975479126,0.46875],[0.203125,0.44843700528144836,0.6171879768371582],[0.1640630066394806,0.526561975479126,0.4140630066394806],[0.203125,0.44843700528144836,0.6171879768371582],[0.1015629991889,0.45625001192092896,0.4296880066394806],[-0.203125,0.44843700528144836,0.6171879768371582],[-0.25,0.542186975479126,0.46875],[-0.1640630066394806,0.526561975479126,0.4140630066394806],[-0.203125,0.44843700528144836,0.6171879768371582],[-0.1640630066394806,0.526561975479126,0.4140630066394806],[-0.1015629991889,0.45625001192092896,0.4296880066394806],[0.25,0.542186975479126,0.46875],[0.328125,0.557811975479126,0.4765630066394806],[0.3125,0.46406200528144836,0.640625],[0.25,0.542186975479126,0.46875],[0.3125,0.46406200528144836,0.640625],[0.203125,0.44843700528144836,0.6171879768371582],[-0.3125,0.46406200528144836,0.640625],[-0.328125,0.557811975479126,0.4765630066394806],[-0.25,0.542186975479126,0.46875],[-0.3125,0.46406200528144836,0.640625],[-0.25,0.542186975479126,0.46875],[-0.203125,0.44843700528144836,0.6171879768371582],[0.4296880066394806,0.581250011920929,0.4375],[0.4375,0.503125011920929,0.546875],[0.3125,0.46406200528144836,0.640625],[0.4296880066394806,0.581250011920929,0.4375],[0.3125,0.46406200528144836,0.640625],[0.328125,0.557811975479126,0.4765630066394806],[-0.3125,0.46406200528144836,0.640625],[-0.4375,0.503125011920929,0.546875],[-0.4296880066394806,0.581250011920929,0.4375],[-0.3125,0.46406200528144836,0.640625],[-0.4296880066394806,0.581250011920929,0.4375],[-0.328125,0.557811975479126,0.4765630066394806],[0.6015629768371582,0.635936975479126,0.375],[0.6875,0.573436975479126,0.4140630066394806],[0.4375,0.503125011920929,0.546875],[0.6015629768371582,0.635936975479126,0.375],[0.4375,0.503125011920929,0.546875],[0.4296880066394806,0.581250011920929,0.4375],[-0.4375,0.503125011920929,0.546875],[-0.6875,0.573436975479126,0.4140630066394806],[-0.6015629768371582,0.635936975479126,0.375],[-0.4375,0.503125011920929,0.546875],[-0.6015629768371582,0.635936975479126,0.375],[-0.4296880066394806,0.581250011920929,0.4375],[0.640625,0.651561975479126,0.296875],[0.7421879768371582,0.643750011920929,0.375],[0.6875,0.573436975479126,0.4140630066394806],[0.640625,0.651561975479126,0.296875],[0.6875,0.573436975479126,0.4140630066394806],[0.6015629768371582,0.635936975479126,0.375],[-0.6875,0.573436975479126,0.4140630066394806],[-0.7421879768371582,0.643750011920929,0.375],[-0.640625,0.651561975479126,0.296875],[-0.6875,0.573436975479126,0.4140630066394806],[-0.640625,0.651561975479126,0.296875],[-0.6015629768371582,0.635936975479126,0.375],[0.625,0.651561975479126,0.1875],[0.7265629768371582,0.698436975479126,0.203125],[0.7421879768371582,0.643750011920929,0.375],[0.625,0.651561975479126,0.1875],[0.7421879768371582,0.643750011920929,0.375],[0.640625,0.651561975479126,0.296875],[-0.7421879768371582,0.643750011920929,0.375],[-0.7265629768371582,0.698436975479126,0.203125],[-0.625,0.651561975479126,0.1875],[-0.7421879768371582,0.643750011920929,0.375],[-0.625,0.651561975479126,0.1875],[-0.640625,0.651561975479126,0.296875],[0.4921880066394806,0.628125011920929,0.0625],[0.6171879768371582,0.675000011920929,0.0546875],[0.7265629768371582,0.698436975479126,0.203125],[0.4921880066394806,0.628125011920929,0.0625],[0.7265629768371582,0.698436975479126,0.203125],[0.625,0.651561975479126,0.1875],[-0.7265629768371582,0.698436975479126,0.203125],[-0.6171879768371582,0.675000011920929,0.0546875],[-0.4921880066394806,0.628125011920929,0.0625],[-0.7265629768371582,0.698436975479126,0.203125],[-0.4921880066394806,0.628125011920929,0.0625],[-0.625,0.651561975479126,0.1875],[0.375,0.596875011920929,0.015625],[0.3984380066394806,0.628125011920929,-0.046875],[0.6171879768371582,0.675000011920929,0.0546875],[0.375,0.596875011920929,0.015625],[0.6171879768371582,0.675000011920929,0.0546875],[0.4921880066394806,0.628125011920929,0.0625],[-0.6171879768371582,0.675000011920929,0.0546875],[-0.3984380066394806,0.628125011920929,-0.046875],[-0.375,0.596875011920929,0.015625],[-0.6171879768371582,0.675000011920929,0.0546875],[-0.375,0.596875011920929,0.015625],[-0.4921880066394806,0.628125011920929,0.0625],[0.203125,0.557811975479126,0.09375],[0.125,0.48750001192092896,-0.1015629991889],[0.3984380066394806,0.628125011920929,-0.046875],[0.203125,0.557811975479126,0.09375],[0.3984380066394806,0.628125011920929,-0.046875],[0.375,0.596875011920929,0.015625],[-0.3984380066394806,0.628125011920929,-0.046875],[-0.125,0.48750001192092896,-0.1015629991889],[-0.203125,0.557811975479126,0.09375],[-0.3984380066394806,0.628125011920929,-0.046875],[-0.203125,0.557811975479126,0.09375],[-0.375,0.596875011920929,0.015625],[0.203125,0.557811975479126,0.09375],[0.1640630066394806,0.550000011920929,0.140625],[0,0.573436975479126,0.046875],[0.203125,0.557811975479126,0.09375],[0,0.573436975479126,0.046875],[0.125,0.48750001192092896,-0.1015629991889],[0,0.573436975479126,0.046875],[-0.1640630066394806,0.550000011920929,0.140625],[-0.203125,0.557811975479126,0.09375],[0,0.573436975479126,0.046875],[-0.203125,0.557811975479126,0.09375],[-0.125,0.48750001192092896,-0.1015629991889],[0.1640630066394806,0.526561975479126,0.4140630066394806],[0.1015629991889,0.45625001192092896,0.4296880066394806],[0,0.47968700528144836,0.3515630066394806],[0.1640630066394806,0.526561975479126,0.4140630066394806],[0,0.47968700528144836,0.3515630066394806],[0.125,0.534375011920929,0.3046880066394806],[0,0.47968700528144836,0.3515630066394806],[-0.1015629991889,0.45625001192092896,0.4296880066394806],[-0.1640630066394806,0.526561975479126,0.4140630066394806],[0,0.47968700528144836,0.3515630066394806],[-0.1640630066394806,0.526561975479126,0.4140630066394806],[-0.125,0.534375011920929,0.3046880066394806],[0.125,0.534375011920929,0.3046880066394806],[0,0.47968700528144836,0.3515630066394806],[0,0.534375011920929,0.2109380066394806],[0.125,0.534375011920929,0.3046880066394806],[0,0.534375011920929,0.2109380066394806],[0.1328130066394806,0.542186975479126,0.2109380066394806],[0,0.534375011920929,0.2109380066394806],[0,0.47968700528144836,0.3515630066394806],[-0.125,0.534375011920929,0.3046880066394806],[0,0.534375011920929,0.2109380066394806],[-0.125,0.534375011920929,0.3046880066394806],[-0.1328130066394806,0.542186975479126,0.2109380066394806],[0,0.573436975479126,0.046875],[0.1640630066394806,0.550000011920929,0.140625],[0.1328130066394806,0.542186975479126,0.2109380066394806],[0,0.573436975479126,0.046875],[0.1328130066394806,0.542186975479126,0.2109380066394806],[0,0.534375011920929,0.2109380066394806],[-0.1328130066394806,0.542186975479126,0.2109380066394806],[-0.1640630066394806,0.550000011920929,0.140625],[0,0.573436975479126,0.046875],[-0.1328130066394806,0.542186975479126,0.2109380066394806],[0,0.573436975479126,0.046875],[0,0.534375011920929,0.2109380066394806],[0.0625,0.604686975479126,-0.8828129768371582],[0,0.612500011920929,-0.890625],[0,0.659375011920929,-0.9453129768371582],[0.0625,0.604686975479126,-0.8828129768371582],[0,0.659375011920929,-0.9453129768371582],[0.1640630066394806,0.667186975479126,-0.9296879768371582],[0,0.659375011920929,-0.9453129768371582],[0,0.612500011920929,-0.890625],[-0.0625,0.604686975479126,-0.8828129768371582],[0,0.659375011920929,-0.9453129768371582],[-0.0625,0.604686975479126,-0.8828129768371582],[-0.1640630066394806,0.667186975479126,-0.9296879768371582],[0.1171879991889,0.589061975479126,-0.8359379768371582],[0.0625,0.604686975479126,-0.8828129768371582],[0.1640630066394806,0.667186975479126,-0.9296879768371582],[0.1171879991889,0.589061975479126,-0.8359379768371582],[0.1640630066394806,0.667186975479126,-0.9296879768371582],[0.234375,0.667186975479126,-0.9140629768371582],[-0.1640630066394806,0.667186975479126,-0.9296879768371582],[-0.0625,0.604686975479126,-0.8828129768371582],[-0.1171879991889,0.589061975479126,-0.8359379768371582],[-0.1640630066394806,0.667186975479126,-0.9296879768371582],[-0.1171879991889,0.589061975479126,-0.8359379768371582],[-0.234375,0.667186975479126,-0.9140629768371582],[0.109375,0.565625011920929,-0.71875],[0.1171879991889,0.589061975479126,-0.8359379768371582],[0.234375,0.667186975479126,-0.9140629768371582],[0.109375,0.565625011920929,-0.71875],[0.234375,0.667186975479126,-0.9140629768371582],[0.265625,0.635936975479126,-0.8203129768371582],[-0.234375,0.667186975479126,-0.9140629768371582],[-0.1171879991889,0.589061975479126,-0.8359379768371582],[-0.109375,0.565625011920929,-0.71875],[-0.234375,0.667186975479126,-0.9140629768371582],[-0.109375,0.565625011920929,-0.71875],[-0.265625,0.635936975479126,-0.8203129768371582],[0.2109380066394806,0.589061975479126,-0.4453130066394806],[0.078125,0.550000011920929,-0.4453130066394806],[0.1171879991889,0.565625011920929,-0.6875],[0.2109380066394806,0.589061975479126,-0.4453130066394806],[0.1171879991889,0.565625011920929,-0.6875],[0.25,0.612500011920929,-0.703125],[-0.1171879991889,0.565625011920929,-0.6875],[-0.078125,0.550000011920929,-0.4453130066394806],[-0.2109380066394806,0.589061975479126,-0.4453130066394806],[-0.1171879991889,0.565625011920929,-0.6875],[-0.2109380066394806,0.589061975479126,-0.4453130066394806],[-0.25,0.612500011920929,-0.703125],[0.109375,0.565625011920929,-0.71875],[0.265625,0.635936975479126,-0.8203129768371582],[0.25,0.612500011920929,-0.703125],[0.109375,0.565625011920929,-0.71875],[0.25,0.612500011920929,-0.703125],[0.1171879991889,0.565625011920929,-0.6875],[-0.25,0.612500011920929,-0.703125],[-0.265625,0.635936975479126,-0.8203129768371582],[-0.109375,0.565625011920929,-0.71875],[-0.25,0.612500011920929,-0.703125],[-0.109375,0.565625011920929,-0.71875],[-0.1171879991889,0.565625011920929,-0.6875],[0.0859375,0.557811975479126,-0.2890630066394806],[0,0.557811975479126,-0.328125],[0,0.550000011920929,-0.4453130066394806],[0.0859375,0.557811975479126,-0.2890630066394806],[0,0.550000011920929,-0.4453130066394806],[0.078125,0.550000011920929,-0.4453130066394806],[0,0.550000011920929,-0.4453130066394806],[0,0.557811975479126,-0.328125],[-0.0859375,0.557811975479126,-0.2890630066394806],[0,0.550000011920929,-0.4453130066394806],[-0.0859375,0.557811975479126,-0.2890630066394806],[-0.078125,0.550000011920929,-0.4453130066394806],[0.1171879991889,0.565625011920929,-0.6875],[0.078125,0.550000011920929,-0.4453130066394806],[0,0.550000011920929,-0.4453130066394806],[0.1171879991889,0.565625011920929,-0.6875],[0,0.550000011920929,-0.4453130066394806],[0,0.565625011920929,-0.6796879768371582],[0,0.550000011920929,-0.4453130066394806],[-0.078125,0.550000011920929,-0.4453130066394806],[-0.1171879991889,0.565625011920929,-0.6875],[0,0.550000011920929,-0.4453130066394806],[-0.1171879991889,0.565625011920929,-0.6875],[0,0.565625011920929,-0.6796879768371582],[0,0.565625011920929,-0.765625],[0.109375,0.565625011920929,-0.71875],[0.1171879991889,0.565625011920929,-0.6875],[0,0.565625011920929,-0.765625],[0.1171879991889,0.565625011920929,-0.6875],[0,0.565625011920929,-0.6796879768371582],[-0.1171879991889,0.565625011920929,-0.6875],[-0.109375,0.565625011920929,-0.71875],[0,0.565625011920929,-0.765625],[-0.1171879991889,0.565625011920929,-0.6875],[0,0.565625011920929,-0.765625],[0,0.565625011920929,-0.6796879768371582],[0.125,0.550000011920929,-0.2265630066394806],[0.1328130066394806,0.503125011920929,-0.2265630066394806],[0.09375,0.518750011920929,-0.2734380066394806],[0.125,0.550000011920929,-0.2265630066394806],[0.09375,0.518750011920929,-0.2734380066394806],[0.0859375,0.557811975479126,-0.2890630066394806],[-0.09375,0.518750011920929,-0.2734380066394806],[-0.1328130066394806,0.503125011920929,-0.2265630066394806],[-0.125,0.550000011920929,-0.2265630066394806],[-0.09375,0.518750011920929,-0.2734380066394806],[-0.125,0.550000011920929,-0.2265630066394806],[-0.0859375,0.557811975479126,-0.2890630066394806],[0.1015629991889,0.557811975479126,-0.1484380066394806],[0.109375,0.518750011920929,-0.1328130066394806],[0.1328130066394806,0.503125011920929,-0.2265630066394806],[0.1015629991889,0.557811975479126,-0.1484380066394806],[0.1328130066394806,0.503125011920929,-0.2265630066394806],[0.125,0.550000011920929,-0.2265630066394806],[-0.1328130066394806,0.503125011920929,-0.2265630066394806],[-0.109375,0.518750011920929,-0.1328130066394806],[-0.1015629991889,0.557811975479126,-0.1484380066394806],[-0.1328130066394806,0.503125011920929,-0.2265630066394806],[-0.1015629991889,0.557811975479126,-0.1484380066394806],[-0.125,0.550000011920929,-0.2265630066394806],[0,0.557811975479126,-0.140625],[0.0390625,0.518750011920929,-0.125],[0.109375,0.518750011920929,-0.1328130066394806],[0,0.557811975479126,-0.140625],[0.109375,0.518750011920929,-0.1328130066394806],[0.1015629991889,0.557811975479126,-0.1484380066394806],[-0.109375,0.518750011920929,-0.1328130066394806],[-0.0390625,0.518750011920929,-0.125],[0,0.557811975479126,-0.140625],[-0.109375,0.518750011920929,-0.1328130066394806],[0,0.557811975479126,-0.140625],[-0.1015629991889,0.557811975479126,-0.1484380066394806],[0,0.550000011920929,-0.1953130066394806],[0,0.503125011920929,-0.1875],[0.0390625,0.518750011920929,-0.125],[0,0.550000011920929,-0.1953130066394806],[0.0390625,0.518750011920929,-0.125],[0,0.557811975479126,-0.140625],[-0.0390625,0.518750011920929,-0.125],[0,0.503125011920929,-0.1875],[0,0.550000011920929,-0.1953130066394806],[-0.0390625,0.518750011920929,-0.125],[0,0.550000011920929,-0.1953130066394806],[0,0.557811975479126,-0.140625],[0,0.557811975479126,-0.328125],[0.0859375,0.557811975479126,-0.2890630066394806],[0.09375,0.518750011920929,-0.2734380066394806],[0,0.557811975479126,-0.328125],[0.09375,0.518750011920929,-0.2734380066394806],[0,0.518750011920929,-0.3203130066394806],[-0.09375,0.518750011920929,-0.2734380066394806],[-0.0859375,0.557811975479126,-0.2890630066394806],[0,0.557811975479126,-0.328125],[-0.09375,0.518750011920929,-0.2734380066394806],[0,0.557811975479126,-0.328125],[0,0.518750011920929,-0.3203130066394806],[0,0.518750011920929,-0.3203130066394806],[0.09375,0.518750011920929,-0.2734380066394806],[0.078125,0.49531200528144836,-0.25],[0,0.518750011920929,-0.3203130066394806],[0.078125,0.49531200528144836,-0.25],[0,0.49531200528144836,-0.2890630066394806],[-0.078125,0.49531200528144836,-0.25],[-0.09375,0.518750011920929,-0.2734380066394806],[0,0.518750011920929,-0.3203130066394806],[-0.078125,0.49531200528144836,-0.25],[0,0.518750011920929,-0.3203130066394806],[0,0.49531200528144836,-0.2890630066394806],[0,0.503125011920929,-0.1875],[0,0.47187501192092896,-0.203125],[0.046875,0.48750001192092896,-0.1484380066394806],[0,0.503125011920929,-0.1875],[0.046875,0.48750001192092896,-0.1484380066394806],[0.0390625,0.518750011920929,-0.125],[-0.046875,0.48750001192092896,-0.1484380066394806],[0,0.47187501192092896,-0.203125],[0,0.503125011920929,-0.1875],[-0.046875,0.48750001192092896,-0.1484380066394806],[0,0.503125011920929,-0.1875],[-0.0390625,0.518750011920929,-0.125],[0.0390625,0.518750011920929,-0.125],[0.046875,0.48750001192092896,-0.1484380066394806],[0.09375,0.48750001192092896,-0.15625],[0.0390625,0.518750011920929,-0.125],[0.09375,0.48750001192092896,-0.15625],[0.109375,0.518750011920929,-0.1328130066394806],[-0.09375,0.48750001192092896,-0.15625],[-0.046875,0.48750001192092896,-0.1484380066394806],[-0.0390625,0.518750011920929,-0.125],[-0.09375,0.48750001192092896,-0.15625],[-0.0390625,0.518750011920929,-0.125],[-0.109375,0.518750011920929,-0.1328130066394806],[0.109375,0.518750011920929,-0.1328130066394806],[0.09375,0.48750001192092896,-0.15625],[0.109375,0.47187501192092896,-0.2265630066394806],[0.109375,0.518750011920929,-0.1328130066394806],[0.109375,0.47187501192092896,-0.2265630066394806],[0.1328130066394806,0.503125011920929,-0.2265630066394806],[-0.109375,0.47187501192092896,-0.2265630066394806],[-0.09375,0.48750001192092896,-0.15625],[-0.109375,0.518750011920929,-0.1328130066394806],[-0.109375,0.47187501192092896,-0.2265630066394806],[-0.109375,0.518750011920929,-0.1328130066394806],[-0.1328130066394806,0.503125011920929,-0.2265630066394806],[0.1328130066394806,0.503125011920929,-0.2265630066394806],[0.109375,0.47187501192092896,-0.2265630066394806],[0.078125,0.49531200528144836,-0.25],[0.1328130066394806,0.503125011920929,-0.2265630066394806],[0.078125,0.49531200528144836,-0.25],[0.09375,0.518750011920929,-0.2734380066394806],[-0.078125,0.49531200528144836,-0.25],[-0.109375,0.47187501192092896,-0.2265630066394806],[-0.1328130066394806,0.503125011920929,-0.2265630066394806],[-0.078125,0.49531200528144836,-0.25],[-0.1328130066394806,0.503125011920929,-0.2265630066394806],[-0.09375,0.518750011920929,-0.2734380066394806],[0,0.47187501192092896,-0.203125],[0.109375,0.47187501192092896,-0.2265630066394806],[0.09375,0.48750001192092896,-0.15625],[0,0.47187501192092896,-0.203125],[0.09375,0.48750001192092896,-0.15625],[0.046875,0.48750001192092896,-0.1484380066394806],[-0.09375,0.48750001192092896,-0.15625],[-0.109375,0.47187501192092896,-0.2265630066394806],[0,0.47187501192092896,-0.203125],[-0.09375,0.48750001192092896,-0.15625],[0,0.47187501192092896,-0.203125],[-0.046875,0.48750001192092896,-0.1484380066394806],[0,0.47187501192092896,-0.203125],[0,0.49531200528144836,-0.2890630066394806],[0.078125,0.49531200528144836,-0.25],[0,0.47187501192092896,-0.203125],[0.078125,0.49531200528144836,-0.25],[0.109375,0.47187501192092896,-0.2265630066394806],[-0.078125,0.49531200528144836,-0.25],[0,0.49531200528144836,-0.2890630066394806],[0,0.47187501192092896,-0.203125],[-0.078125,0.49531200528144836,-0.25],[0,0.47187501192092896,-0.203125],[-0.109375,0.47187501192092896,-0.2265630066394806],[0,0.557811975479126,-0.140625],[0.1015629991889,0.557811975479126,-0.1484380066394806],[0.125,0.48750001192092896,-0.1015629991889],[0,0.557811975479126,-0.140625],[0.125,0.48750001192092896,-0.1015629991889],[0,0.573436975479126,0.046875],[-0.125,0.48750001192092896,-0.1015629991889],[-0.1015629991889,0.557811975479126,-0.1484380066394806],[0,0.557811975479126,-0.140625],[-0.125,0.48750001192092896,-0.1015629991889],[0,0.557811975479126,-0.140625],[0,0.573436975479126,0.046875],[0.1015629991889,0.557811975479126,-0.1484380066394806],[0.125,0.550000011920929,-0.2265630066394806],[0.1640630066394806,0.589061975479126,-0.2421880066394806],[0.1015629991889,0.557811975479126,-0.1484380066394806],[0.1640630066394806,0.589061975479126,-0.2421880066394806],[0.125,0.48750001192092896,-0.1015629991889],[-0.1640630066394806,0.589061975479126,-0.2421880066394806],[-0.125,0.550000011920929,-0.2265630066394806],[-0.1015629991889,0.557811975479126,-0.1484380066394806],[-0.1640630066394806,0.589061975479126,-0.2421880066394806],[-0.1015629991889,0.557811975479126,-0.1484380066394806],[-0.125,0.48750001192092896,-0.1015629991889],[0.125,0.550000011920929,-0.2265630066394806],[0.0859375,0.557811975479126,-0.2890630066394806],[0.1796880066394806,0.589061975479126,-0.3125],[0.125,0.550000011920929,-0.2265630066394806],[0.1796880066394806,0.589061975479126,-0.3125],[0.1640630066394806,0.589061975479126,-0.2421880066394806],[-0.1796880066394806,0.589061975479126,-0.3125],[-0.0859375,0.557811975479126,-0.2890630066394806],[-0.125,0.550000011920929,-0.2265630066394806],[-0.1796880066394806,0.589061975479126,-0.3125],[-0.125,0.550000011920929,-0.2265630066394806],[-0.1640630066394806,0.589061975479126,-0.2421880066394806],[0.0859375,0.557811975479126,-0.2890630066394806],[0.078125,0.550000011920929,-0.4453130066394806],[0.2109380066394806,0.589061975479126,-0.4453130066394806],[0.0859375,0.557811975479126,-0.2890630066394806],[0.2109380066394806,0.589061975479126,-0.4453130066394806],[0.1796880066394806,0.589061975479126,-0.3125],[-0.2109380066394806,0.589061975479126,-0.4453130066394806],[-0.078125,0.550000011920929,-0.4453130066394806],[-0.0859375,0.557811975479126,-0.2890630066394806],[-0.2109380066394806,0.589061975479126,-0.4453130066394806],[-0.0859375,0.557811975479126,-0.2890630066394806],[-0.1796880066394806,0.589061975479126,-0.3125],[0.3125,0.729686975479126,-0.4375],[0.2578130066394806,0.745311975479126,-0.3125],[0.1796880066394806,0.589061975479126,-0.3125],[0.3125,0.729686975479126,-0.4375],[0.1796880066394806,0.589061975479126,-0.3125],[0.2109380066394806,0.589061975479126,-0.4453130066394806],[-0.1796880066394806,0.589061975479126,-0.3125],[-0.2578130066394806,0.745311975479126,-0.3125],[-0.3125,0.729686975479126,-0.4375],[-0.1796880066394806,0.589061975479126,-0.3125],[-0.3125,0.729686975479126,-0.4375],[-0.2109380066394806,0.589061975479126,-0.4453130066394806],[0.2578130066394806,0.745311975479126,-0.3125],[0.234375,0.745311975479126,-0.25],[0.1640630066394806,0.589061975479126,-0.2421880066394806],[0.2578130066394806,0.745311975479126,-0.3125],[0.1640630066394806,0.589061975479126,-0.2421880066394806],[0.1796880066394806,0.589061975479126,-0.3125],[-0.1640630066394806,0.589061975479126,-0.2421880066394806],[-0.234375,0.745311975479126,-0.25],[-0.2578130066394806,0.745311975479126,-0.3125],[-0.1640630066394806,0.589061975479126,-0.2421880066394806],[-0.2578130066394806,0.745311975479126,-0.3125],[-0.1796880066394806,0.589061975479126,-0.3125],[0.203125,0.737500011920929,-0.1875],[0.125,0.48750001192092896,-0.1015629991889],[0.1640630066394806,0.589061975479126,-0.2421880066394806],[0.203125,0.737500011920929,-0.1875],[0.1640630066394806,0.589061975479126,-0.2421880066394806],[0.234375,0.745311975479126,-0.25],[-0.1640630066394806,0.589061975479126,-0.2421880066394806],[-0.125,0.48750001192092896,-0.1015629991889],[-0.203125,0.737500011920929,-0.1875],[-0.1640630066394806,0.589061975479126,-0.2421880066394806],[-0.203125,0.737500011920929,-0.1875],[-0.234375,0.745311975479126,-0.25],[0.109375,0.565625011920929,-0.71875],[0,0.565625011920929,-0.765625],[0,0.581250011920929,-0.7734379768371582],[0.109375,0.565625011920929,-0.71875],[0,0.581250011920929,-0.7734379768371582],[0.09375,0.573436975479126,-0.7421879768371582],[0,0.581250011920929,-0.7734379768371582],[0,0.565625011920929,-0.765625],[-0.109375,0.565625011920929,-0.71875],[0,0.581250011920929,-0.7734379768371582],[-0.109375,0.565625011920929,-0.71875],[-0.09375,0.573436975479126,-0.7421879768371582],[0.1171879991889,0.589061975479126,-0.8359379768371582],[0.109375,0.565625011920929,-0.71875],[0.09375,0.573436975479126,-0.7421879768371582],[0.1171879991889,0.589061975479126,-0.8359379768371582],[0.09375,0.573436975479126,-0.7421879768371582],[0.09375,0.589061975479126,-0.8203129768371582],[-0.09375,0.573436975479126,-0.7421879768371582],[-0.109375,0.565625011920929,-0.71875],[-0.1171879991889,0.589061975479126,-0.8359379768371582],[-0.09375,0.573436975479126,-0.7421879768371582],[-0.1171879991889,0.589061975479126,-0.8359379768371582],[-0.09375,0.589061975479126,-0.8203129768371582],[0.0625,0.604686975479126,-0.8828129768371582],[0.1171879991889,0.589061975479126,-0.8359379768371582],[0.09375,0.589061975479126,-0.8203129768371582],[0.0625,0.604686975479126,-0.8828129768371582],[0.09375,0.589061975479126,-0.8203129768371582],[0.046875,0.612500011920929,-0.8671879768371582],[-0.09375,0.589061975479126,-0.8203129768371582],[-0.1171879991889,0.589061975479126,-0.8359379768371582],[-0.0625,0.604686975479126,-0.8828129768371582],[-0.09375,0.589061975479126,-0.8203129768371582],[-0.0625,0.604686975479126,-0.8828129768371582],[-0.046875,0.612500011920929,-0.8671879768371582],[0,0.612500011920929,-0.890625],[0.0625,0.604686975479126,-0.8828129768371582],[0.046875,0.612500011920929,-0.8671879768371582],[0,0.612500011920929,-0.890625],[0.046875,0.612500011920929,-0.8671879768371582],[0,0.612500011920929,-0.875],[-0.046875,0.612500011920929,-0.8671879768371582],[-0.0625,0.604686975479126,-0.8828129768371582],[0,0.612500011920929,-0.890625],[-0.046875,0.612500011920929,-0.8671879768371582],[0,0.612500011920929,-0.890625],[0,0.612500011920929,-0.875],[0,0.612500011920929,-0.875],[0.046875,0.612500011920929,-0.8671879768371582],[0.046875,0.667186975479126,-0.8515629768371582],[0,0.612500011920929,-0.875],[0.046875,0.667186975479126,-0.8515629768371582],[0,0.667186975479126,-0.859375],[-0.046875,0.667186975479126,-0.8515629768371582],[-0.046875,0.612500011920929,-0.8671879768371582],[0,0.612500011920929,-0.875],[-0.046875,0.667186975479126,-0.8515629768371582],[0,0.612500011920929,-0.875],[0,0.667186975479126,-0.859375],[0.046875,0.612500011920929,-0.8671879768371582],[0.09375,0.589061975479126,-0.8203129768371582],[0.09375,0.659375011920929,-0.8125],[0.046875,0.612500011920929,-0.8671879768371582],[0.09375,0.659375011920929,-0.8125],[0.046875,0.667186975479126,-0.8515629768371582],[-0.09375,0.659375011920929,-0.8125],[-0.09375,0.589061975479126,-0.8203129768371582],[-0.046875,0.612500011920929,-0.8671879768371582],[-0.09375,0.659375011920929,-0.8125],[-0.046875,0.612500011920929,-0.8671879768371582],[-0.046875,0.667186975479126,-0.8515629768371582],[0.09375,0.589061975479126,-0.8203129768371582],[0.09375,0.573436975479126,-0.7421879768371582],[0.09375,0.635936975479126,-0.75],[0.09375,0.589061975479126,-0.8203129768371582],[0.09375,0.635936975479126,-0.75],[0.09375,0.659375011920929,-0.8125],[-0.09375,0.635936975479126,-0.75],[-0.09375,0.573436975479126,-0.7421879768371582],[-0.09375,0.589061975479126,-0.8203129768371582],[-0.09375,0.635936975479126,-0.75],[-0.09375,0.589061975479126,-0.8203129768371582],[-0.09375,0.659375011920929,-0.8125],[0.09375,0.573436975479126,-0.7421879768371582],[0,0.581250011920929,-0.7734379768371582],[0,0.643750011920929,-0.78125],[0.09375,0.573436975479126,-0.7421879768371582],[0,0.643750011920929,-0.78125],[0.09375,0.635936975479126,-0.75],[0,0.643750011920929,-0.78125],[0,0.581250011920929,-0.7734379768371582],[-0.09375,0.573436975479126,-0.7421879768371582],[0,0.643750011920929,-0.78125],[-0.09375,0.573436975479126,-0.7421879768371582],[-0.09375,0.635936975479126,-0.75],[0,0.643750011920929,-0.78125],[0,0.667186975479126,-0.859375],[0.046875,0.667186975479126,-0.8515629768371582],[0,0.643750011920929,-0.78125],[0.046875,0.667186975479126,-0.8515629768371582],[0.09375,0.635936975479126,-0.75],[-0.046875,0.667186975479126,-0.8515629768371582],[0,0.667186975479126,-0.859375],[0,0.643750011920929,-0.78125],[-0.046875,0.667186975479126,-0.8515629768371582],[0,0.643750011920929,-0.78125],[-0.09375,0.635936975479126,-0.75],[0.09375,0.635936975479126,-0.75],[0.046875,0.667186975479126,-0.8515629768371582],[0.09375,0.659375011920929,-0.8125],[-0.09375,0.659375011920929,-0.8125],[-0.046875,0.667186975479126,-0.8515629768371582],[-0.09375,0.635936975479126,-0.75],[0.1328130066394806,0.542186975479126,0.2109380066394806],[0.1640630066394806,0.550000011920929,0.140625],[0.1875,0.526561975479126,0.15625],[0.1328130066394806,0.542186975479126,0.2109380066394806],[0.1875,0.526561975479126,0.15625],[0.171875,0.518750011920929,0.21875],[-0.1875,0.526561975479126,0.15625],[-0.1640630066394806,0.550000011920929,0.140625],[-0.1328130066394806,0.542186975479126,0.2109380066394806],[-0.1875,0.526561975479126,0.15625],[-0.1328130066394806,0.542186975479126,0.2109380066394806],[-0.171875,0.518750011920929,0.21875],[0.125,0.534375011920929,0.3046880066394806],[0.1328130066394806,0.542186975479126,0.2109380066394806],[0.171875,0.518750011920929,0.21875],[0.125,0.534375011920929,0.3046880066394806],[0.171875,0.518750011920929,0.21875],[0.1796880066394806,0.518750011920929,0.296875],[-0.171875,0.518750011920929,0.21875],[-0.1328130066394806,0.542186975479126,0.2109380066394806],[-0.125,0.534375011920929,0.3046880066394806],[-0.171875,0.518750011920929,0.21875],[-0.125,0.534375011920929,0.3046880066394806],[-0.1796880066394806,0.518750011920929,0.296875],[0.1640630066394806,0.526561975479126,0.4140630066394806],[0.125,0.534375011920929,0.3046880066394806],[0.1796880066394806,0.518750011920929,0.296875],[0.1640630066394806,0.526561975479126,0.4140630066394806],[0.1796880066394806,0.518750011920929,0.296875],[0.2109380066394806,0.518750011920929,0.375],[-0.1796880066394806,0.518750011920929,0.296875],[-0.125,0.534375011920929,0.3046880066394806],[-0.1640630066394806,0.526561975479126,0.4140630066394806],[-0.1796880066394806,0.518750011920929,0.296875],[-0.1640630066394806,0.526561975479126,0.4140630066394806],[-0.2109380066394806,0.518750011920929,0.375],[0.1640630066394806,0.550000011920929,0.140625],[0.203125,0.557811975479126,0.09375],[0.2265630066394806,0.518750011920929,0.109375],[0.1640630066394806,0.550000011920929,0.140625],[0.2265630066394806,0.518750011920929,0.109375],[0.1875,0.526561975479126,0.15625],[-0.2265630066394806,0.518750011920929,0.109375],[-0.203125,0.557811975479126,0.09375],[-0.1640630066394806,0.550000011920929,0.140625],[-0.2265630066394806,0.518750011920929,0.109375],[-0.1640630066394806,0.550000011920929,0.140625],[-0.1875,0.526561975479126,0.15625],[0.203125,0.557811975479126,0.09375],[0.375,0.596875011920929,0.015625],[0.375,0.557811975479126,0.0625],[0.203125,0.557811975479126,0.09375],[0.375,0.557811975479126,0.0625],[0.2265630066394806,0.518750011920929,0.109375],[-0.375,0.557811975479126,0.0625],[-0.375,0.596875011920929,0.015625],[-0.203125,0.557811975479126,0.09375],[-0.375,0.557811975479126,0.0625],[-0.203125,0.557811975479126,0.09375],[-0.2265630066394806,0.518750011920929,0.109375],[0.375,0.596875011920929,0.015625],[0.4921880066394806,0.628125011920929,0.0625],[0.4765630066394806,0.581250011920929,0.1015629991889],[0.375,0.596875011920929,0.015625],[0.4765630066394806,0.581250011920929,0.1015629991889],[0.375,0.557811975479126,0.0625],[-0.4765630066394806,0.581250011920929,0.1015629991889],[-0.4921880066394806,0.628125011920929,0.0625],[-0.375,0.596875011920929,0.015625],[-0.4765630066394806,0.581250011920929,0.1015629991889],[-0.375,0.596875011920929,0.015625],[-0.375,0.557811975479126,0.0625],[0.4921880066394806,0.628125011920929,0.0625],[0.625,0.651561975479126,0.1875],[0.578125,0.620311975479126,0.1953130066394806],[0.4921880066394806,0.628125011920929,0.0625],[0.578125,0.620311975479126,0.1953130066394806],[0.4765630066394806,0.581250011920929,0.1015629991889],[-0.578125,0.620311975479126,0.1953130066394806],[-0.625,0.651561975479126,0.1875],[-0.4921880066394806,0.628125011920929,0.0625],[-0.578125,0.620311975479126,0.1953130066394806],[-0.4921880066394806,0.628125011920929,0.0625],[-0.4765630066394806,0.581250011920929,0.1015629991889],[0.625,0.651561975479126,0.1875],[0.640625,0.651561975479126,0.296875],[0.5859379768371582,0.612500011920929,0.2890630066394806],[0.625,0.651561975479126,0.1875],[0.5859379768371582,0.612500011920929,0.2890630066394806],[0.578125,0.620311975479126,0.1953130066394806],[-0.5859379768371582,0.612500011920929,0.2890630066394806],[-0.640625,0.651561975479126,0.296875],[-0.625,0.651561975479126,0.1875],[-0.5859379768371582,0.612500011920929,0.2890630066394806],[-0.625,0.651561975479126,0.1875],[-0.578125,0.620311975479126,0.1953130066394806],[0.640625,0.651561975479126,0.296875],[0.6015629768371582,0.635936975479126,0.375],[0.5625,0.604686975479126,0.3515630066394806],[0.640625,0.651561975479126,0.296875],[0.5625,0.604686975479126,0.3515630066394806],[0.5859379768371582,0.612500011920929,0.2890630066394806],[-0.5625,0.604686975479126,0.3515630066394806],[-0.6015629768371582,0.635936975479126,0.375],[-0.640625,0.651561975479126,0.296875],[-0.5625,0.604686975479126,0.3515630066394806],[-0.640625,0.651561975479126,0.296875],[-0.5859379768371582,0.612500011920929,0.2890630066394806],[0.6015629768371582,0.635936975479126,0.375],[0.4296880066394806,0.581250011920929,0.4375],[0.421875,0.526561975479126,0.3984380066394806],[0.6015629768371582,0.635936975479126,0.375],[0.421875,0.526561975479126,0.3984380066394806],[0.5625,0.604686975479126,0.3515630066394806],[-0.421875,0.526561975479126,0.3984380066394806],[-0.4296880066394806,0.581250011920929,0.4375],[-0.6015629768371582,0.635936975479126,0.375],[-0.421875,0.526561975479126,0.3984380066394806],[-0.6015629768371582,0.635936975479126,0.375],[-0.5625,0.604686975479126,0.3515630066394806],[0.4296880066394806,0.581250011920929,0.4375],[0.328125,0.557811975479126,0.4765630066394806],[0.3359380066394806,0.542186975479126,0.4296880066394806],[0.4296880066394806,0.581250011920929,0.4375],[0.3359380066394806,0.542186975479126,0.4296880066394806],[0.421875,0.526561975479126,0.3984380066394806],[-0.3359380066394806,0.542186975479126,0.4296880066394806],[-0.328125,0.557811975479126,0.4765630066394806],[-0.4296880066394806,0.581250011920929,0.4375],[-0.3359380066394806,0.542186975479126,0.4296880066394806],[-0.4296880066394806,0.581250011920929,0.4375],[-0.421875,0.526561975479126,0.3984380066394806],[0.328125,0.557811975479126,0.4765630066394806],[0.25,0.542186975479126,0.46875],[0.2734380066394806,0.526561975479126,0.421875],[0.328125,0.557811975479126,0.4765630066394806],[0.2734380066394806,0.526561975479126,0.421875],[0.3359380066394806,0.542186975479126,0.4296880066394806],[-0.2734380066394806,0.526561975479126,0.421875],[-0.25,0.542186975479126,0.46875],[-0.328125,0.557811975479126,0.4765630066394806],[-0.2734380066394806,0.526561975479126,0.421875],[-0.328125,0.557811975479126,0.4765630066394806],[-0.3359380066394806,0.542186975479126,0.4296880066394806],[0.25,0.542186975479126,0.46875],[0.1640630066394806,0.526561975479126,0.4140630066394806],[0.2109380066394806,0.518750011920929,0.375],[0.25,0.542186975479126,0.46875],[0.2109380066394806,0.518750011920929,0.375],[0.2734380066394806,0.526561975479126,0.421875],[-0.2109380066394806,0.518750011920929,0.375],[-0.1640630066394806,0.526561975479126,0.4140630066394806],[-0.25,0.542186975479126,0.46875],[-0.2109380066394806,0.518750011920929,0.375],[-0.25,0.542186975479126,0.46875],[-0.2734380066394806,0.526561975479126,0.421875],[0.2734380066394806,0.526561975479126,0.421875],[0.2109380066394806,0.518750011920929,0.375],[0.234375,0.542186975479126,0.359375],[0.2734380066394806,0.526561975479126,0.421875],[0.234375,0.542186975479126,0.359375],[0.28125,0.534375011920929,0.3984380066394806],[-0.234375,0.542186975479126,0.359375],[-0.2109380066394806,0.518750011920929,0.375],[-0.2734380066394806,0.526561975479126,0.421875],[-0.234375,0.542186975479126,0.359375],[-0.2734380066394806,0.526561975479126,0.421875],[-0.28125,0.534375011920929,0.3984380066394806],[0.3359380066394806,0.542186975479126,0.4296880066394806],[0.2734380066394806,0.526561975479126,0.421875],[0.28125,0.534375011920929,0.3984380066394806],[0.3359380066394806,0.542186975479126,0.4296880066394806],[0.28125,0.534375011920929,0.3984380066394806],[0.3359380066394806,0.550000011920929,0.40625],[-0.28125,0.534375011920929,0.3984380066394806],[-0.2734380066394806,0.526561975479126,0.421875],[-0.3359380066394806,0.542186975479126,0.4296880066394806],[-0.28125,0.534375011920929,0.3984380066394806],[-0.3359380066394806,0.542186975479126,0.4296880066394806],[-0.3359380066394806,0.550000011920929,0.40625],[0.421875,0.526561975479126,0.3984380066394806],[0.3359380066394806,0.542186975479126,0.4296880066394806],[0.3359380066394806,0.550000011920929,0.40625],[0.421875,0.526561975479126,0.3984380066394806],[0.3359380066394806,0.550000011920929,0.40625],[0.4140630066394806,0.550000011920929,0.390625],[-0.3359380066394806,0.550000011920929,0.40625],[-0.3359380066394806,0.542186975479126,0.4296880066394806],[-0.421875,0.526561975479126,0.3984380066394806],[-0.3359380066394806,0.550000011920929,0.40625],[-0.421875,0.526561975479126,0.3984380066394806],[-0.4140630066394806,0.550000011920929,0.390625],[0.5625,0.604686975479126,0.3515630066394806],[0.421875,0.526561975479126,0.3984380066394806],[0.4140630066394806,0.550000011920929,0.390625],[0.5625,0.604686975479126,0.3515630066394806],[0.4140630066394806,0.550000011920929,0.390625],[0.53125,0.620311975479126,0.3359380066394806],[-0.4140630066394806,0.550000011920929,0.390625],[-0.421875,0.526561975479126,0.3984380066394806],[-0.5625,0.604686975479126,0.3515630066394806],[-0.4140630066394806,0.550000011920929,0.390625],[-0.5625,0.604686975479126,0.3515630066394806],[-0.53125,0.620311975479126,0.3359380066394806],[0.5859379768371582,0.612500011920929,0.2890630066394806],[0.5625,0.604686975479126,0.3515630066394806],[0.53125,0.620311975479126,0.3359380066394806],[0.5859379768371582,0.612500011920929,0.2890630066394806],[0.53125,0.620311975479126,0.3359380066394806],[0.5546879768371582,0.628125011920929,0.28125],[-0.53125,0.620311975479126,0.3359380066394806],[-0.5625,0.604686975479126,0.3515630066394806],[-0.5859379768371582,0.612500011920929,0.2890630066394806],[-0.53125,0.620311975479126,0.3359380066394806],[-0.5859379768371582,0.612500011920929,0.2890630066394806],[-0.5546879768371582,0.628125011920929,0.28125],[0.578125,0.620311975479126,0.1953130066394806],[0.5859379768371582,0.612500011920929,0.2890630066394806],[0.5546879768371582,0.628125011920929,0.28125],[0.578125,0.620311975479126,0.1953130066394806],[0.5546879768371582,0.628125011920929,0.28125],[0.546875,0.628125011920929,0.2109380066394806],[-0.5546879768371582,0.628125011920929,0.28125],[-0.5859379768371582,0.612500011920929,0.2890630066394806],[-0.578125,0.620311975479126,0.1953130066394806],[-0.5546879768371582,0.628125011920929,0.28125],[-0.578125,0.620311975479126,0.1953130066394806],[-0.546875,0.628125011920929,0.2109380066394806],[0.4765630066394806,0.581250011920929,0.1015629991889],[0.578125,0.620311975479126,0.1953130066394806],[0.546875,0.628125011920929,0.2109380066394806],[0.4765630066394806,0.581250011920929,0.1015629991889],[0.546875,0.628125011920929,0.2109380066394806],[0.4609380066394806,0.596875011920929,0.1171879991889],[-0.546875,0.628125011920929,0.2109380066394806],[-0.578125,0.620311975479126,0.1953130066394806],[-0.4765630066394806,0.581250011920929,0.1015629991889],[-0.546875,0.628125011920929,0.2109380066394806],[-0.4765630066394806,0.581250011920929,0.1015629991889],[-0.4609380066394806,0.596875011920929,0.1171879991889],[0.375,0.557811975479126,0.0625],[0.4765630066394806,0.581250011920929,0.1015629991889],[0.4609380066394806,0.596875011920929,0.1171879991889],[0.375,0.557811975479126,0.0625],[0.4609380066394806,0.596875011920929,0.1171879991889],[0.375,0.573436975479126,0.0859375],[-0.4609380066394806,0.596875011920929,0.1171879991889],[-0.4765630066394806,0.581250011920929,0.1015629991889],[-0.375,0.557811975479126,0.0625],[-0.4609380066394806,0.596875011920929,0.1171879991889],[-0.375,0.557811975479126,0.0625],[-0.375,0.573436975479126,0.0859375],[0.2265630066394806,0.518750011920929,0.109375],[0.375,0.557811975479126,0.0625],[0.375,0.573436975479126,0.0859375],[0.2265630066394806,0.518750011920929,0.109375],[0.375,0.573436975479126,0.0859375],[0.2421880066394806,0.542186975479126,0.125],[-0.375,0.573436975479126,0.0859375],[-0.375,0.557811975479126,0.0625],[-0.2265630066394806,0.518750011920929,0.109375],[-0.375,0.573436975479126,0.0859375],[-0.2265630066394806,0.518750011920929,0.109375],[-0.2421880066394806,0.542186975479126,0.125],[0.1875,0.526561975479126,0.15625],[0.2265630066394806,0.518750011920929,0.109375],[0.2421880066394806,0.542186975479126,0.125],[0.1875,0.526561975479126,0.15625],[0.2421880066394806,0.542186975479126,0.125],[0.203125,0.550000011920929,0.171875],[-0.2421880066394806,0.542186975479126,0.125],[-0.2265630066394806,0.518750011920929,0.109375],[-0.1875,0.526561975479126,0.15625],[-0.2421880066394806,0.542186975479126,0.125],[-0.1875,0.526561975479126,0.15625],[-0.203125,0.550000011920929,0.171875],[0.2109380066394806,0.518750011920929,0.375],[0.1796880066394806,0.518750011920929,0.296875],[0.1953130066394806,0.542186975479126,0.296875],[0.2109380066394806,0.518750011920929,0.375],[0.1953130066394806,0.542186975479126,0.296875],[0.234375,0.542186975479126,0.359375],[-0.1953130066394806,0.542186975479126,0.296875],[-0.1796880066394806,0.518750011920929,0.296875],[-0.2109380066394806,0.518750011920929,0.375],[-0.1953130066394806,0.542186975479126,0.296875],[-0.2109380066394806,0.518750011920929,0.375],[-0.234375,0.542186975479126,0.359375],[0.1796880066394806,0.518750011920929,0.296875],[0.171875,0.518750011920929,0.21875],[0.1953130066394806,0.550000011920929,0.2265630066394806],[0.1796880066394806,0.518750011920929,0.296875],[0.1953130066394806,0.550000011920929,0.2265630066394806],[0.1953130066394806,0.542186975479126,0.296875],[-0.1953130066394806,0.550000011920929,0.2265630066394806],[-0.171875,0.518750011920929,0.21875],[-0.1796880066394806,0.518750011920929,0.296875],[-0.1953130066394806,0.550000011920929,0.2265630066394806],[-0.1796880066394806,0.518750011920929,0.296875],[-0.1953130066394806,0.542186975479126,0.296875],[0.171875,0.518750011920929,0.21875],[0.1875,0.526561975479126,0.15625],[0.203125,0.550000011920929,0.171875],[0.171875,0.518750011920929,0.21875],[0.203125,0.550000011920929,0.171875],[0.1953130066394806,0.550000011920929,0.2265630066394806],[-0.203125,0.550000011920929,0.171875],[-0.1875,0.526561975479126,0.15625],[-0.171875,0.518750011920929,0.21875],[-0.203125,0.550000011920929,0.171875],[-0.171875,0.518750011920929,0.21875],[-0.1953130066394806,0.550000011920929,0.2265630066394806],[0,0.557811975479126,0.4296880066394806],[0.0625,0.550000011920929,0.4921880066394806],[0.109375,0.690625011920929,0.4609380066394806],[0,0.557811975479126,0.4296880066394806],[0.109375,0.690625011920929,0.4609380066394806],[0,0.698436975479126,0.40625],[-0.109375,0.690625011920929,0.4609380066394806],[-0.0625,0.550000011920929,0.4921880066394806],[0,0.557811975479126,0.4296880066394806],[-0.109375,0.690625011920929,0.4609380066394806],[0,0.557811975479126,0.4296880066394806],[0,0.698436975479126,0.40625],[0.0625,0.550000011920929,0.4921880066394806],[0.15625,0.542186975479126,0.71875],[0.1953130066394806,0.682811975479126,0.6640629768371582],[0.0625,0.550000011920929,0.4921880066394806],[0.1953130066394806,0.682811975479126,0.6640629768371582],[0.109375,0.690625011920929,0.4609380066394806],[-0.1953130066394806,0.682811975479126,0.6640629768371582],[-0.15625,0.542186975479126,0.71875],[-0.0625,0.550000011920929,0.4921880066394806],[-0.1953130066394806,0.682811975479126,0.6640629768371582],[-0.0625,0.550000011920929,0.4921880066394806],[-0.109375,0.690625011920929,0.4609380066394806],[0.15625,0.542186975479126,0.71875],[0.3203130066394806,0.565625011920929,0.7578129768371582],[0.3359380066394806,0.706250011920929,0.6875],[0.15625,0.542186975479126,0.71875],[0.3359380066394806,0.706250011920929,0.6875],[0.1953130066394806,0.682811975479126,0.6640629768371582],[-0.3359380066394806,0.706250011920929,0.6875],[-0.3203130066394806,0.565625011920929,0.7578129768371582],[-0.15625,0.542186975479126,0.71875],[-0.3359380066394806,0.706250011920929,0.6875],[-0.15625,0.542186975479126,0.71875],[-0.1953130066394806,0.682811975479126,0.6640629768371582],[0.3203130066394806,0.565625011920929,0.7578129768371582],[0.4921880066394806,0.612500011920929,0.6015629768371582],[0.484375,0.745311975479126,0.5546879768371582],[0.3203130066394806,0.565625011920929,0.7578129768371582],[0.484375,0.745311975479126,0.5546879768371582],[0.3359380066394806,0.706250011920929,0.6875],[-0.484375,0.745311975479126,0.5546879768371582],[-0.4921880066394806,0.612500011920929,0.6015629768371582],[-0.3203130066394806,0.565625011920929,0.7578129768371582],[-0.484375,0.745311975479126,0.5546879768371582],[-0.3203130066394806,0.565625011920929,0.7578129768371582],[-0.3359380066394806,0.706250011920929,0.6875],[0.4921880066394806,0.612500011920929,0.6015629768371582],[0.7109379768371582,0.675000011920929,0.484375],[0.6796879768371582,0.807811975479126,0.453125],[0.4921880066394806,0.612500011920929,0.6015629768371582],[0.6796879768371582,0.807811975479126,0.453125],[0.484375,0.745311975479126,0.5546879768371582],[-0.6796879768371582,0.807811975479126,0.453125],[-0.7109379768371582,0.675000011920929,0.484375],[-0.4921880066394806,0.612500011920929,0.6015629768371582],[-0.6796879768371582,0.807811975479126,0.453125],[-0.4921880066394806,0.612500011920929,0.6015629768371582],[-0.484375,0.745311975479126,0.5546879768371582],[0.7109379768371582,0.675000011920929,0.484375],[0.859375,0.706250011920929,0.4296880066394806],[0.796875,0.839061975479126,0.40625],[0.7109379768371582,0.675000011920929,0.484375],[0.796875,0.839061975479126,0.40625],[0.6796879768371582,0.807811975479126,0.453125],[-0.796875,0.839061975479126,0.40625],[-0.859375,0.706250011920929,0.4296880066394806],[-0.7109379768371582,0.675000011920929,0.484375],[-0.796875,0.839061975479126,0.40625],[-0.7109379768371582,0.675000011920929,0.484375],[-0.6796879768371582,0.807811975479126,0.453125],[0.859375,0.706250011920929,0.4296880066394806],[0.828125,0.854686975479126,0.1484380066394806],[0.7734379768371582,0.925000011920929,0.1640630066394806],[0.859375,0.706250011920929,0.4296880066394806],[0.7734379768371582,0.925000011920929,0.1640630066394806],[0.796875,0.839061975479126,0.40625],[-0.7734379768371582,0.925000011920929,0.1640630066394806],[-0.828125,0.854686975479126,0.1484380066394806],[-0.859375,0.706250011920929,0.4296880066394806],[-0.7734379768371582,0.925000011920929,0.1640630066394806],[-0.859375,0.706250011920929,0.4296880066394806],[-0.796875,0.839061975479126,0.40625],[0.828125,0.854686975479126,0.1484380066394806],[0.6328129768371582,0.760936975479126,-0.0390625],[0.6015629768371582,0.885936975479126,0],[0.828125,0.854686975479126,0.1484380066394806],[0.6015629768371582,0.885936975479126,0],[0.7734379768371582,0.925000011920929,0.1640630066394806],[-0.6015629768371582,0.885936975479126,0],[-0.6328129768371582,0.760936975479126,-0.0390625],[-0.828125,0.854686975479126,0.1484380066394806],[-0.6015629768371582,0.885936975479126,0],[-0.828125,0.854686975479126,0.1484380066394806],[-0.7734379768371582,0.925000011920929,0.1640630066394806],[0.6328129768371582,0.760936975479126,-0.0390625],[0.4375,0.768750011920929,-0.140625],[0.4375,0.831250011920929,-0.09375],[0.6328129768371582,0.760936975479126,-0.0390625],[0.4375,0.831250011920929,-0.09375],[0.6015629768371582,0.885936975479126,0],[-0.4375,0.831250011920929,-0.09375],[-0.4375,0.768750011920929,-0.140625],[-0.6328129768371582,0.760936975479126,-0.0390625],[-0.4375,0.831250011920929,-0.09375],[-0.6328129768371582,0.760936975479126,-0.0390625],[-0.6015629768371582,0.885936975479126,0],[0,0.979686975479126,-0.5703129768371582],[0,1.0187499523162842,-0.484375],[0.1796880066394806,1.042186975479126,-0.4140630066394806],[0,0.979686975479126,-0.5703129768371582],[0.1796880066394806,1.042186975479126,-0.4140630066394806],[0.125,0.940625011920929,-0.5390629768371582],[-0.1796880066394806,1.042186975479126,-0.4140630066394806],[0,1.0187499523162842,-0.484375],[0,0.979686975479126,-0.5703129768371582],[-0.1796880066394806,1.042186975479126,-0.4140630066394806],[0,0.979686975479126,-0.5703129768371582],[-0.125,0.940625011920929,-0.5390629768371582],[0,0.956250011920929,-0.8046879768371582],[0,0.979686975479126,-0.5703129768371582],[0.125,0.940625011920929,-0.5390629768371582],[0,0.956250011920929,-0.8046879768371582],[0.125,0.940625011920929,-0.5390629768371582],[0.140625,0.932811975479126,-0.7578129768371582],[-0.125,0.940625011920929,-0.5390629768371582],[0,0.979686975479126,-0.5703129768371582],[0,0.956250011920929,-0.8046879768371582],[-0.125,0.940625011920929,-0.5390629768371582],[0,0.956250011920929,-0.8046879768371582],[-0.140625,0.932811975479126,-0.7578129768371582],[0,0.839061975479126,-0.9765629768371582],[0,0.956250011920929,-0.8046879768371582],[0.140625,0.932811975479126,-0.7578129768371582],[0,0.839061975479126,-0.9765629768371582],[0.140625,0.932811975479126,-0.7578129768371582],[0.1640630066394806,0.862500011920929,-0.9453129768371582],[-0.140625,0.932811975479126,-0.7578129768371582],[0,0.956250011920929,-0.8046879768371582],[0,0.839061975479126,-0.9765629768371582],[-0.140625,0.932811975479126,-0.7578129768371582],[0,0.839061975479126,-0.9765629768371582],[-0.1640630066394806,0.862500011920929,-0.9453129768371582],[0.1796880066394806,0.745311975479126,-0.96875],[0,0.721875011920929,-0.984375],[0,0.839061975479126,-0.9765629768371582],[0.1796880066394806,0.745311975479126,-0.96875],[0,0.839061975479126,-0.9765629768371582],[0.1640630066394806,0.862500011920929,-0.9453129768371582],[0,0.839061975479126,-0.9765629768371582],[0,0.721875011920929,-0.984375],[-0.1796880066394806,0.745311975479126,-0.96875],[0,0.839061975479126,-0.9765629768371582],[-0.1796880066394806,0.745311975479126,-0.96875],[-0.1640630066394806,0.862500011920929,-0.9453129768371582],[0.328125,0.776561975479126,-0.9453129768371582],[0.1796880066394806,0.745311975479126,-0.96875],[0.1640630066394806,0.862500011920929,-0.9453129768371582],[0.328125,0.776561975479126,-0.9453129768371582],[0.1640630066394806,0.862500011920929,-0.9453129768371582],[0.328125,0.901561975479126,-0.9140629768371582],[-0.1640630066394806,0.862500011920929,-0.9453129768371582],[-0.1796880066394806,0.745311975479126,-0.96875],[-0.328125,0.776561975479126,-0.9453129768371582],[-0.1640630066394806,0.862500011920929,-0.9453129768371582],[-0.328125,0.776561975479126,-0.9453129768371582],[-0.328125,0.901561975479126,-0.9140629768371582],[0.3671880066394806,0.768750011920929,-0.890625],[0.328125,0.776561975479126,-0.9453129768371582],[0.328125,0.901561975479126,-0.9140629768371582],[0.3671880066394806,0.768750011920929,-0.890625],[0.328125,0.901561975479126,-0.9140629768371582],[0.2890630066394806,0.917186975479126,-0.7109379768371582],[-0.328125,0.901561975479126,-0.9140629768371582],[-0.328125,0.776561975479126,-0.9453129768371582],[-0.3671880066394806,0.768750011920929,-0.890625],[-0.328125,0.901561975479126,-0.9140629768371582],[-0.3671880066394806,0.768750011920929,-0.890625],[-0.2890630066394806,0.917186975479126,-0.7109379768371582],[0.3515630066394806,0.729686975479126,-0.6953129768371582],[0.3671880066394806,0.768750011920929,-0.890625],[0.2890630066394806,0.917186975479126,-0.7109379768371582],[0.3515630066394806,0.729686975479126,-0.6953129768371582],[0.2890630066394806,0.917186975479126,-0.7109379768371582],[0.25,0.909375011920929,-0.5],[-0.2890630066394806,0.917186975479126,-0.7109379768371582],[-0.3671880066394806,0.768750011920929,-0.890625],[-0.3515630066394806,0.729686975479126,-0.6953129768371582],[-0.2890630066394806,0.917186975479126,-0.7109379768371582],[-0.3515630066394806,0.729686975479126,-0.6953129768371582],[-0.25,0.909375011920929,-0.5],[0.2890630066394806,0.917186975479126,-0.7109379768371582],[0.140625,0.932811975479126,-0.7578129768371582],[0.125,0.940625011920929,-0.5390629768371582],[0.2890630066394806,0.917186975479126,-0.7109379768371582],[0.125,0.940625011920929,-0.5390629768371582],[0.25,0.909375011920929,-0.5],[-0.125,0.940625011920929,-0.5390629768371582],[-0.140625,0.932811975479126,-0.7578129768371582],[-0.2890630066394806,0.917186975479126,-0.7109379768371582],[-0.125,0.940625011920929,-0.5390629768371582],[-0.2890630066394806,0.917186975479126,-0.7109379768371582],[-0.25,0.909375011920929,-0.5],[0.2890630066394806,0.917186975479126,-0.7109379768371582],[0.328125,0.901561975479126,-0.9140629768371582],[0.1640630066394806,0.862500011920929,-0.9453129768371582],[0.2890630066394806,0.917186975479126,-0.7109379768371582],[0.1640630066394806,0.862500011920929,-0.9453129768371582],[0.140625,0.932811975479126,-0.7578129768371582],[-0.1640630066394806,0.862500011920929,-0.9453129768371582],[-0.328125,0.901561975479126,-0.9140629768371582],[-0.2890630066394806,0.917186975479126,-0.7109379768371582],[-0.1640630066394806,0.862500011920929,-0.9453129768371582],[-0.2890630066394806,0.917186975479126,-0.7109379768371582],[-0.140625,0.932811975479126,-0.7578129768371582],[0.234375,0.893750011920929,-0.3515630066394806],[0.25,0.909375011920929,-0.5],[0.125,0.940625011920929,-0.5390629768371582],[0.234375,0.893750011920929,-0.3515630066394806],[0.125,0.940625011920929,-0.5390629768371582],[0.1796880066394806,1.042186975479126,-0.4140630066394806],[-0.125,0.940625011920929,-0.5390629768371582],[-0.25,0.909375011920929,-0.5],[-0.234375,0.893750011920929,-0.3515630066394806],[-0.125,0.940625011920929,-0.5390629768371582],[-0.234375,0.893750011920929,-0.3515630066394806],[-0.1796880066394806,1.042186975479126,-0.4140630066394806],[0.3125,0.729686975479126,-0.4375],[0.3515630066394806,0.729686975479126,-0.6953129768371582],[0.25,0.909375011920929,-0.5],[0.3125,0.729686975479126,-0.4375],[0.25,0.909375011920929,-0.5],[0.234375,0.893750011920929,-0.3515630066394806],[-0.25,0.909375011920929,-0.5],[-0.3515630066394806,0.729686975479126,-0.6953129768371582],[-0.3125,0.729686975479126,-0.4375],[-0.25,0.909375011920929,-0.5],[-0.3125,0.729686975479126,-0.4375],[-0.234375,0.893750011920929,-0.3515630066394806],[0.2578130066394806,0.745311975479126,-0.3125],[0.21875,0.870311975479126,-0.28125],[0.2109380066394806,0.831250011920929,-0.2265630066394806],[0.2578130066394806,0.745311975479126,-0.3125],[0.2109380066394806,0.831250011920929,-0.2265630066394806],[0.234375,0.745311975479126,-0.25],[-0.2109380066394806,0.831250011920929,-0.2265630066394806],[-0.21875,0.870311975479126,-0.28125],[-0.2578130066394806,0.745311975479126,-0.3125],[-0.2109380066394806,0.831250011920929,-0.2265630066394806],[-0.2578130066394806,0.745311975479126,-0.3125],[-0.234375,0.745311975479126,-0.25],[0.3125,0.729686975479126,-0.4375],[0.234375,0.893750011920929,-0.3515630066394806],[0.21875,0.870311975479126,-0.28125],[0.3125,0.729686975479126,-0.4375],[0.21875,0.870311975479126,-0.28125],[0.2578130066394806,0.745311975479126,-0.3125],[-0.21875,0.870311975479126,-0.28125],[-0.234375,0.893750011920929,-0.3515630066394806],[-0.3125,0.729686975479126,-0.4375],[-0.21875,0.870311975479126,-0.28125],[-0.3125,0.729686975479126,-0.4375],[-0.2578130066394806,0.745311975479126,-0.3125],[0.203125,0.737500011920929,-0.1875],[0.234375,0.745311975479126,-0.25],[0.2109380066394806,0.831250011920929,-0.2265630066394806],[0.203125,0.737500011920929,-0.1875],[0.2109380066394806,0.831250011920929,-0.2265630066394806],[0.203125,0.800000011920929,-0.171875],[-0.2109380066394806,0.831250011920929,-0.2265630066394806],[-0.234375,0.745311975479126,-0.25],[-0.203125,0.737500011920929,-0.1875],[-0.2109380066394806,0.831250011920929,-0.2265630066394806],[-0.203125,0.737500011920929,-0.1875],[-0.203125,0.800000011920929,-0.171875],[0.203125,0.737500011920929,-0.1875],[0.203125,0.800000011920929,-0.171875],[0.4375,0.831250011920929,-0.09375],[0.203125,0.737500011920929,-0.1875],[0.4375,0.831250011920929,-0.09375],[0.4375,0.768750011920929,-0.140625],[-0.4375,0.831250011920929,-0.09375],[-0.203125,0.800000011920929,-0.171875],[-0.203125,0.737500011920929,-0.1875],[-0.4375,0.831250011920929,-0.09375],[-0.203125,0.737500011920929,-0.1875],[-0.4375,0.768750011920929,-0.140625],[0,2.128124952316284,0.0703125],[0.3359380066394806,1.964063048362732,0.0546875],[0.34375,1.839063048362732,-0.1484380066394806],[0,2.128124952316284,0.0703125],[0.34375,1.839063048362732,-0.1484380066394806],[0,1.9718749523162842,-0.1953130066394806],[-0.34375,1.839063048362732,-0.1484380066394806],[-0.3359380066394806,1.964063048362732,0.0546875],[0,2.128124952316284,0.0703125],[-0.34375,1.839063048362732,-0.1484380066394806],[0,2.128124952316284,0.0703125],[0,1.9718749523162842,-0.1953130066394806],[0,1.9718749523162842,-0.1953130066394806],[0.34375,1.839063048362732,-0.1484380066394806],[0.296875,1.5656249523162842,-0.3125],[0,1.9718749523162842,-0.1953130066394806],[0.296875,1.5656249523162842,-0.3125],[0,1.651563048362732,-0.3828130066394806],[-0.296875,1.5656249523162842,-0.3125],[-0.34375,1.839063048362732,-0.1484380066394806],[0,1.9718749523162842,-0.1953130066394806],[-0.296875,1.5656249523162842,-0.3125],[0,1.9718749523162842,-0.1953130066394806],[0,1.651563048362732,-0.3828130066394806],[0,1.651563048362732,-0.3828130066394806],[0.296875,1.5656249523162842,-0.3125],[0.2109380066394806,1.135936975479126,-0.390625],[0,1.651563048362732,-0.3828130066394806],[0.2109380066394806,1.135936975479126,-0.390625],[0,1.1124999523162842,-0.4609380066394806],[-0.2109380066394806,1.135936975479126,-0.390625],[-0.296875,1.5656249523162842,-0.3125],[0,1.651563048362732,-0.3828130066394806],[-0.2109380066394806,1.135936975479126,-0.390625],[0,1.651563048362732,-0.3828130066394806],[0,1.1124999523162842,-0.4609380066394806],[0,1.1124999523162842,-0.4609380066394806],[0.2109380066394806,1.135936975479126,-0.390625],[0.1796880066394806,1.042186975479126,-0.4140630066394806],[0,1.1124999523162842,-0.4609380066394806],[0.1796880066394806,1.042186975479126,-0.4140630066394806],[0,1.0187499523162842,-0.484375],[-0.1796880066394806,1.042186975479126,-0.4140630066394806],[-0.2109380066394806,1.135936975479126,-0.390625],[0,1.1124999523162842,-0.4609380066394806],[-0.1796880066394806,1.042186975479126,-0.4140630066394806],[0,1.1124999523162842,-0.4609380066394806],[0,1.0187499523162842,-0.484375],[0.234375,0.893750011920929,-0.3515630066394806],[0.1796880066394806,1.042186975479126,-0.4140630066394806],[0.2109380066394806,1.135936975479126,-0.390625],[0.234375,0.893750011920929,-0.3515630066394806],[0.2109380066394806,1.135936975479126,-0.390625],[0.21875,0.870311975479126,-0.28125],[-0.2109380066394806,1.135936975479126,-0.390625],[-0.1796880066394806,1.042186975479126,-0.4140630066394806],[-0.234375,0.893750011920929,-0.3515630066394806],[-0.2109380066394806,1.135936975479126,-0.390625],[-0.234375,0.893750011920929,-0.3515630066394806],[-0.21875,0.870311975479126,-0.28125],[0.7734379768371582,0.925000011920929,0.1640630066394806],[0.6015629768371582,0.885936975479126,0],[0.734375,1.2296874523162842,-0.046875],[0.7734379768371582,0.925000011920929,0.1640630066394806],[0.734375,1.2296874523162842,-0.046875],[0.8515629768371582,1.2453124523162842,0.234375],[-0.734375,1.2296874523162842,-0.046875],[-0.6015629768371582,0.885936975479126,0],[-0.7734379768371582,0.925000011920929,0.1640630066394806],[-0.734375,1.2296874523162842,-0.046875],[-0.7734379768371582,0.925000011920929,0.1640630066394806],[-0.8515629768371582,1.2453124523162842,0.234375],[0,2.1515629291534424,0.5625],[0.4609380066394806,2.003124952316284,0.4375],[0.3359380066394806,1.964063048362732,0.0546875],[0,2.1515629291534424,0.5625],[0.3359380066394806,1.964063048362732,0.0546875],[0,2.128124952316284,0.0703125],[-0.3359380066394806,1.964063048362732,0.0546875],[-0.4609380066394806,2.003124952316284,0.4375],[0,2.1515629291534424,0.5625],[-0.3359380066394806,1.964063048362732,0.0546875],[0,2.1515629291534424,0.5625],[0,2.128124952316284,0.0703125],[0,1.010936975479126,0.8984379768371582],[0.453125,1.0656249523162842,0.8515629768371582],[0.453125,1.3703124523162842,0.9296879768371582],[0,1.010936975479126,0.8984379768371582],[0.453125,1.3703124523162842,0.9296879768371582],[0,1.3781249523162842,0.984375],[-0.453125,1.3703124523162842,0.9296879768371582],[-0.453125,1.0656249523162842,0.8515629768371582],[0,1.010936975479126,0.8984379768371582],[-0.453125,1.3703124523162842,0.9296879768371582],[0,1.010936975479126,0.8984379768371582],[0,1.3781249523162842,0.984375],[0,1.3781249523162842,0.984375],[0.453125,1.3703124523162842,0.9296879768371582],[0.453125,1.682813048362732,0.8671879768371582],[0,1.3781249523162842,0.984375],[0.453125,1.682813048362732,0.8671879768371582],[0,1.8468749523162842,0.8984379768371582],[-0.453125,1.682813048362732,0.8671879768371582],[-0.453125,1.3703124523162842,0.9296879768371582],[0,1.3781249523162842,0.984375],[-0.453125,1.682813048362732,0.8671879768371582],[0,1.3781249523162842,0.984375],[0,1.8468749523162842,0.8984379768371582],[0,1.8468749523162842,0.8984379768371582],[0.453125,1.682813048362732,0.8671879768371582],[0.4609380066394806,2.003124952316284,0.4375],[0,1.8468749523162842,0.8984379768371582],[0.4609380066394806,2.003124952316284,0.4375],[0,2.1515629291534424,0.5625],[-0.4609380066394806,2.003124952316284,0.4375],[-0.453125,1.682813048362732,0.8671879768371582],[0,1.8468749523162842,0.8984379768371582],[-0.4609380066394806,2.003124952316284,0.4375],[0,1.8468749523162842,0.8984379768371582],[0,2.1515629291534424,0.5625],[0.6796879768371582,0.807811975479126,0.453125],[0.796875,0.839061975479126,0.40625],[0.7265629768371582,0.964061975479126,0.40625],[0.6796879768371582,0.807811975479126,0.453125],[0.7265629768371582,0.964061975479126,0.40625],[0.6328129768371582,1.0187499523162842,0.453125],[-0.7265629768371582,0.964061975479126,0.40625],[-0.796875,0.839061975479126,0.40625],[-0.6796879768371582,0.807811975479126,0.453125],[-0.7265629768371582,0.964061975479126,0.40625],[-0.6796879768371582,0.807811975479126,0.453125],[-0.6328129768371582,1.0187499523162842,0.453125],[0.6328129768371582,1.0187499523162842,0.453125],[0.7265629768371582,0.964061975479126,0.40625],[0.796875,1.1749999523162842,0.5625],[0.6328129768371582,1.0187499523162842,0.453125],[0.796875,1.1749999523162842,0.5625],[0.640625,1.2453124523162842,0.703125],[-0.796875,1.1749999523162842,0.5625],[-0.7265629768371582,0.964061975479126,0.40625],[-0.6328129768371582,1.0187499523162842,0.453125],[-0.796875,1.1749999523162842,0.5625],[-0.6328129768371582,1.0187499523162842,0.453125],[-0.640625,1.2453124523162842,0.703125],[0.640625,1.2453124523162842,0.703125],[0.796875,1.1749999523162842,0.5625],[0.796875,1.417188048362732,0.6171879768371582],[0.640625,1.2453124523162842,0.703125],[0.796875,1.417188048362732,0.6171879768371582],[0.640625,1.495313048362732,0.75],[-0.796875,1.417188048362732,0.6171879768371582],[-0.796875,1.1749999523162842,0.5625],[-0.640625,1.2453124523162842,0.703125],[-0.796875,1.417188048362732,0.6171879768371582],[-0.640625,1.2453124523162842,0.703125],[-0.640625,1.495313048362732,0.75],[0.640625,1.495313048362732,0.75],[0.796875,1.417188048362732,0.6171879768371582],[0.796875,1.6593749523162842,0.5390629768371582],[0.640625,1.495313048362732,0.75],[0.796875,1.6593749523162842,0.5390629768371582],[0.640625,1.745313048362732,0.6796879768371582],[-0.796875,1.6593749523162842,0.5390629768371582],[-0.796875,1.417188048362732,0.6171879768371582],[-0.640625,1.495313048362732,0.75],[-0.796875,1.6593749523162842,0.5390629768371582],[-0.640625,1.495313048362732,0.75],[-0.640625,1.745313048362732,0.6796879768371582],[0.7734379768371582,1.7374999523162842,0.265625],[0.6171879768371582,1.885938048362732,0.328125],[0.640625,1.745313048362732,0.6796879768371582],[0.7734379768371582,1.7374999523162842,0.265625],[0.640625,1.745313048362732,0.6796879768371582],[0.796875,1.6593749523162842,0.5390629768371582],[-0.640625,1.745313048362732,0.6796879768371582],[-0.6171879768371582,1.885938048362732,0.328125],[-0.7734379768371582,1.7374999523162842,0.265625],[-0.640625,1.745313048362732,0.6796879768371582],[-0.7734379768371582,1.7374999523162842,0.265625],[-0.796875,1.6593749523162842,0.5390629768371582],[0.4609380066394806,2.003124952316284,0.4375],[0.453125,1.682813048362732,0.8671879768371582],[0.640625,1.745313048362732,0.6796879768371582],[0.4609380066394806,2.003124952316284,0.4375],[0.640625,1.745313048362732,0.6796879768371582],[0.6171879768371582,1.885938048362732,0.328125],[-0.640625,1.745313048362732,0.6796879768371582],[-0.453125,1.682813048362732,0.8671879768371582],[-0.4609380066394806,2.003124952316284,0.4375],[-0.640625,1.745313048362732,0.6796879768371582],[-0.4609380066394806,2.003124952316284,0.4375],[-0.6171879768371582,1.885938048362732,0.328125],[0.453125,1.682813048362732,0.8671879768371582],[0.453125,1.3703124523162842,0.9296879768371582],[0.640625,1.495313048362732,0.75],[0.453125,1.682813048362732,0.8671879768371582],[0.640625,1.495313048362732,0.75],[0.640625,1.745313048362732,0.6796879768371582],[-0.640625,1.495313048362732,0.75],[-0.453125,1.3703124523162842,0.9296879768371582],[-0.453125,1.682813048362732,0.8671879768371582],[-0.640625,1.495313048362732,0.75],[-0.453125,1.682813048362732,0.8671879768371582],[-0.640625,1.745313048362732,0.6796879768371582],[0.453125,1.3703124523162842,0.9296879768371582],[0.453125,1.0656249523162842,0.8515629768371582],[0.640625,1.2453124523162842,0.703125],[0.453125,1.3703124523162842,0.9296879768371582],[0.640625,1.2453124523162842,0.703125],[0.640625,1.495313048362732,0.75],[-0.640625,1.2453124523162842,0.703125],[-0.453125,1.0656249523162842,0.8515629768371582],[-0.453125,1.3703124523162842,0.9296879768371582],[-0.640625,1.2453124523162842,0.703125],[-0.453125,1.3703124523162842,0.9296879768371582],[-0.640625,1.495313048362732,0.75],[0.453125,1.0656249523162842,0.8515629768371582],[0.4609380066394806,0.870311975479126,0.5234379768371582],[0.6328129768371582,1.0187499523162842,0.453125],[0.453125,1.0656249523162842,0.8515629768371582],[0.6328129768371582,1.0187499523162842,0.453125],[0.640625,1.2453124523162842,0.703125],[-0.6328129768371582,1.0187499523162842,0.453125],[-0.4609380066394806,0.870311975479126,0.5234379768371582],[-0.453125,1.0656249523162842,0.8515629768371582],[-0.6328129768371582,1.0187499523162842,0.453125],[-0.453125,1.0656249523162842,0.8515629768371582],[-0.640625,1.2453124523162842,0.703125],[0.484375,0.745311975479126,0.5546879768371582],[0.6796879768371582,0.807811975479126,0.453125],[0.6328129768371582,1.0187499523162842,0.453125],[0.484375,0.745311975479126,0.5546879768371582],[0.6328129768371582,1.0187499523162842,0.453125],[0.4609380066394806,0.870311975479126,0.5234379768371582],[-0.6328129768371582,1.0187499523162842,0.453125],[-0.6796879768371582,0.807811975479126,0.453125],[-0.484375,0.745311975479126,0.5546879768371582],[-0.6328129768371582,1.0187499523162842,0.453125],[-0.484375,0.745311975479126,0.5546879768371582],[-0.4609380066394806,0.870311975479126,0.5234379768371582],[0,0.729686975479126,0.5703129768371582],[0.4609380066394806,0.870311975479126,0.5234379768371582],[0.453125,1.0656249523162842,0.8515629768371582],[0,0.729686975479126,0.5703129768371582],[0.453125,1.0656249523162842,0.8515629768371582],[0,1.010936975479126,0.8984379768371582],[-0.453125,1.0656249523162842,0.8515629768371582],[-0.4609380066394806,0.870311975479126,0.5234379768371582],[0,0.729686975479126,0.5703129768371582],[-0.453125,1.0656249523162842,0.8515629768371582],[0,0.729686975479126,0.5703129768371582],[0,1.010936975479126,0.8984379768371582],[0.109375,0.690625011920929,0.4609380066394806],[0.1953130066394806,0.682811975479126,0.6640629768371582],[0.3359380066394806,0.706250011920929,0.6875],[0.109375,0.690625011920929,0.4609380066394806],[0.3359380066394806,0.706250011920929,0.6875],[0.484375,0.745311975479126,0.5546879768371582],[-0.3359380066394806,0.706250011920929,0.6875],[-0.1953130066394806,0.682811975479126,0.6640629768371582],[-0.109375,0.690625011920929,0.4609380066394806],[-0.3359380066394806,0.706250011920929,0.6875],[-0.109375,0.690625011920929,0.4609380066394806],[-0.484375,0.745311975479126,0.5546879768371582],[0.109375,0.690625011920929,0.4609380066394806],[0.484375,0.745311975479126,0.5546879768371582],[0.4609380066394806,0.870311975479126,0.5234379768371582],[0.109375,0.690625011920929,0.4609380066394806],[0.4609380066394806,0.870311975479126,0.5234379768371582],[0,0.729686975479126,0.5703129768371582],[-0.4609380066394806,0.870311975479126,0.5234379768371582],[-0.484375,0.745311975479126,0.5546879768371582],[-0.109375,0.690625011920929,0.4609380066394806],[-0.4609380066394806,0.870311975479126,0.5234379768371582],[-0.109375,0.690625011920929,0.4609380066394806],[0,0.729686975479126,0.5703129768371582],[0,0.698436975479126,0.40625],[0.109375,0.690625011920929,0.4609380066394806],[0,0.729686975479126,0.5703129768371582],[0,0.729686975479126,0.5703129768371582],[-0.109375,0.690625011920929,0.4609380066394806],[0,0.698436975479126,0.40625],[0.796875,0.839061975479126,0.40625],[0.7734379768371582,0.925000011920929,0.1640630066394806],[0.8515629768371582,1.2453124523162842,0.234375],[0.796875,0.839061975479126,0.40625],[0.8515629768371582,1.2453124523162842,0.234375],[0.7265629768371582,0.964061975479126,0.40625],[-0.8515629768371582,1.2453124523162842,0.234375],[-0.7734379768371582,0.925000011920929,0.1640630066394806],[-0.796875,0.839061975479126,0.40625],[-0.8515629768371582,1.2453124523162842,0.234375],[-0.796875,0.839061975479126,0.40625],[-0.7265629768371582,0.964061975479126,0.40625],[0.8515629768371582,1.2453124523162842,0.234375],[0.859375,1.3468749523162842,0.3203130066394806],[0.796875,1.1749999523162842,0.5625],[0.8515629768371582,1.2453124523162842,0.234375],[0.796875,1.1749999523162842,0.5625],[0.7265629768371582,0.964061975479126,0.40625],[-0.796875,1.1749999523162842,0.5625],[-0.859375,1.3468749523162842,0.3203130066394806],[-0.8515629768371582,1.2453124523162842,0.234375],[-0.796875,1.1749999523162842,0.5625],[-0.8515629768371582,1.2453124523162842,0.234375],[-0.7265629768371582,0.964061975479126,0.40625],[0.859375,1.3468749523162842,0.3203130066394806],[0.8203129768371582,1.5031249523162842,0.328125],[0.796875,1.417188048362732,0.6171879768371582],[0.859375,1.3468749523162842,0.3203130066394806],[0.796875,1.417188048362732,0.6171879768371582],[0.796875,1.1749999523162842,0.5625],[-0.796875,1.417188048362732,0.6171879768371582],[-0.8203129768371582,1.5031249523162842,0.328125],[-0.859375,1.3468749523162842,0.3203130066394806],[-0.796875,1.417188048362732,0.6171879768371582],[-0.859375,1.3468749523162842,0.3203130066394806],[-0.796875,1.1749999523162842,0.5625],[0.7734379768371582,1.7374999523162842,0.265625],[0.796875,1.6593749523162842,0.5390629768371582],[0.796875,1.417188048362732,0.6171879768371582],[0.7734379768371582,1.7374999523162842,0.265625],[0.796875,1.417188048362732,0.6171879768371582],[0.8203129768371582,1.5031249523162842,0.328125],[-0.796875,1.417188048362732,0.6171879768371582],[-0.796875,1.6593749523162842,0.5390629768371582],[-0.7734379768371582,1.7374999523162842,0.265625],[-0.796875,1.417188048362732,0.6171879768371582],[-0.7734379768371582,1.7374999523162842,0.265625],[-0.8203129768371582,1.5031249523162842,0.328125],[0.2109380066394806,1.135936975479126,-0.390625],[0.296875,1.5656249523162842,-0.3125],[0.4296880066394806,1.510938048362732,-0.1953130066394806],[0.2109380066394806,1.135936975479126,-0.390625],[0.4296880066394806,1.510938048362732,-0.1953130066394806],[0.40625,1.151561975479126,-0.171875],[-0.4296880066394806,1.510938048362732,-0.1953130066394806],[-0.296875,1.5656249523162842,-0.3125],[-0.2109380066394806,1.135936975479126,-0.390625],[-0.4296880066394806,1.510938048362732,-0.1953130066394806],[-0.2109380066394806,1.135936975479126,-0.390625],[-0.40625,1.151561975479126,-0.171875],[0.734375,1.2296874523162842,-0.046875],[0.40625,1.151561975479126,-0.171875],[0.4296880066394806,1.510938048362732,-0.1953130066394806],[0.734375,1.2296874523162842,-0.046875],[0.4296880066394806,1.510938048362732,-0.1953130066394806],[0.59375,1.464063048362732,-0.125],[-0.4296880066394806,1.510938048362732,-0.1953130066394806],[-0.40625,1.151561975479126,-0.171875],[-0.734375,1.2296874523162842,-0.046875],[-0.4296880066394806,1.510938048362732,-0.1953130066394806],[-0.734375,1.2296874523162842,-0.046875],[-0.59375,1.464063048362732,-0.125],[0.6015629768371582,0.885936975479126,0],[0.4375,0.831250011920929,-0.09375],[0.40625,1.151561975479126,-0.171875],[0.6015629768371582,0.885936975479126,0],[0.40625,1.151561975479126,-0.171875],[0.734375,1.2296874523162842,-0.046875],[-0.40625,1.151561975479126,-0.171875],[-0.4375,0.831250011920929,-0.09375],[-0.6015629768371582,0.885936975479126,0],[-0.40625,1.151561975479126,-0.171875],[-0.6015629768371582,0.885936975479126,0],[-0.734375,1.2296874523162842,-0.046875],[0.4375,0.831250011920929,-0.09375],[0.2109380066394806,0.831250011920929,-0.2265630066394806],[0.21875,0.870311975479126,-0.28125],[0.4375,0.831250011920929,-0.09375],[0.21875,0.870311975479126,-0.28125],[0.40625,1.151561975479126,-0.171875],[-0.21875,0.870311975479126,-0.28125],[-0.2109380066394806,0.831250011920929,-0.2265630066394806],[-0.4375,0.831250011920929,-0.09375],[-0.21875,0.870311975479126,-0.28125],[-0.4375,0.831250011920929,-0.09375],[-0.40625,1.151561975479126,-0.171875],[0.21875,0.870311975479126,-0.28125],[0.2109380066394806,1.135936975479126,-0.390625],[0.40625,1.151561975479126,-0.171875],[-0.40625,1.151561975479126,-0.171875],[-0.2109380066394806,1.135936975479126,-0.390625],[-0.21875,0.870311975479126,-0.28125],[0.4375,0.831250011920929,-0.09375],[0.203125,0.800000011920929,-0.171875],[0.2109380066394806,0.831250011920929,-0.2265630066394806],[-0.2109380066394806,0.831250011920929,-0.2265630066394806],[-0.203125,0.800000011920929,-0.171875],[-0.4375,0.831250011920929,-0.09375],[0.7734379768371582,1.7374999523162842,0.265625],[0.640625,1.729688048362732,-0.0078125],[0.484375,1.8468749523162842,0.0234375],[0.7734379768371582,1.7374999523162842,0.265625],[0.484375,1.8468749523162842,0.0234375],[0.6171879768371582,1.885938048362732,0.328125],[-0.484375,1.8468749523162842,0.0234375],[-0.640625,1.729688048362732,-0.0078125],[-0.7734379768371582,1.7374999523162842,0.265625],[-0.484375,1.8468749523162842,0.0234375],[-0.7734379768371582,1.7374999523162842,0.265625],[-0.6171879768371582,1.885938048362732,0.328125],[0.4609380066394806,2.003124952316284,0.4375],[0.6171879768371582,1.885938048362732,0.328125],[0.484375,1.8468749523162842,0.0234375],[0.4609380066394806,2.003124952316284,0.4375],[0.484375,1.8468749523162842,0.0234375],[0.3359380066394806,1.964063048362732,0.0546875],[-0.484375,1.8468749523162842,0.0234375],[-0.6171879768371582,1.885938048362732,0.328125],[-0.4609380066394806,2.003124952316284,0.4375],[-0.484375,1.8468749523162842,0.0234375],[-0.4609380066394806,2.003124952316284,0.4375],[-0.3359380066394806,1.964063048362732,0.0546875],[0.59375,1.464063048362732,-0.125],[0.4296880066394806,1.510938048362732,-0.1953130066394806],[0.484375,1.8468749523162842,0.0234375],[0.59375,1.464063048362732,-0.125],[0.484375,1.8468749523162842,0.0234375],[0.640625,1.729688048362732,-0.0078125],[-0.484375,1.8468749523162842,0.0234375],[-0.4296880066394806,1.510938048362732,-0.1953130066394806],[-0.59375,1.464063048362732,-0.125],[-0.484375,1.8468749523162842,0.0234375],[-0.59375,1.464063048362732,-0.125],[-0.640625,1.729688048362732,-0.0078125],[0.296875,1.5656249523162842,-0.3125],[0.34375,1.839063048362732,-0.1484380066394806],[0.484375,1.8468749523162842,0.0234375],[0.296875,1.5656249523162842,-0.3125],[0.484375,1.8468749523162842,0.0234375],[0.4296880066394806,1.510938048362732,-0.1953130066394806],[-0.484375,1.8468749523162842,0.0234375],[-0.34375,1.839063048362732,-0.1484380066394806],[-0.296875,1.5656249523162842,-0.3125],[-0.484375,1.8468749523162842,0.0234375],[-0.296875,1.5656249523162842,-0.3125],[-0.4296880066394806,1.510938048362732,-0.1953130066394806],[0.3359380066394806,1.964063048362732,0.0546875],[0.484375,1.8468749523162842,0.0234375],[0.34375,1.839063048362732,-0.1484380066394806],[-0.34375,1.839063048362732,-0.1484380066394806],[-0.484375,1.8468749523162842,0.0234375],[-0.3359380066394806,1.964063048362732,0.0546875],[1.0234400033950806,1.6124999523162842,0.4765630066394806],[0.890625,1.5343749523162842,0.40625],[0.921875,1.5187499523162842,0.359375],[1.0234400033950806,1.6124999523162842,0.4765630066394806],[0.921875,1.5187499523162842,0.359375],[1.0156300067901611,1.589063048362732,0.4140630066394806],[-0.921875,1.5187499523162842,0.359375],[-0.890625,1.5343749523162842,0.40625],[-1.0234400033950806,1.6124999523162842,0.4765630066394806],[-0.921875,1.5187499523162842,0.359375],[-1.0234400033950806,1.6124999523162842,0.4765630066394806],[-1.0156300067901611,1.589063048362732,0.4140630066394806],[1.0234400033950806,1.6124999523162842,0.4765630066394806],[1.0156300067901611,1.589063048362732,0.4140630066394806],[1.1875,1.6906249523162842,0.4375],[1.0234400033950806,1.6124999523162842,0.4765630066394806],[1.1875,1.6906249523162842,0.4375],[1.2343800067901611,1.7218749523162842,0.5078129768371582],[-1.1875,1.6906249523162842,0.4375],[-1.0156300067901611,1.589063048362732,0.4140630066394806],[-1.0234400033950806,1.6124999523162842,0.4765630066394806],[-1.1875,1.6906249523162842,0.4375],[-1.0234400033950806,1.6124999523162842,0.4765630066394806],[-1.2343800067901611,1.7218749523162842,0.5078129768371582],[1.2343800067901611,1.7218749523162842,0.5078129768371582],[1.1875,1.6906249523162842,0.4375],[1.2656300067901611,1.7062499523162842,0.2890630066394806],[1.2343800067901611,1.7218749523162842,0.5078129768371582],[1.2656300067901611,1.7062499523162842,0.2890630066394806],[1.3515599966049194,1.7218749523162842,0.3203130066394806],[-1.2656300067901611,1.7062499523162842,0.2890630066394806],[-1.1875,1.6906249523162842,0.4375],[-1.2343800067901611,1.7218749523162842,0.5078129768371582],[-1.2656300067901611,1.7062499523162842,0.2890630066394806],[-1.2343800067901611,1.7218749523162842,0.5078129768371582],[-1.3515599966049194,1.7218749523162842,0.3203130066394806],[1.3515599966049194,1.7218749523162842,0.3203130066394806],[1.2656300067901611,1.7062499523162842,0.2890630066394806],[1.2109400033950806,1.7062499523162842,0.078125],[1.3515599966049194,1.7218749523162842,0.3203130066394806],[1.2109400033950806,1.7062499523162842,0.078125],[1.28125,1.729688048362732,0.0546875],[-1.2109400033950806,1.7062499523162842,0.078125],[-1.2656300067901611,1.7062499523162842,0.2890630066394806],[-1.3515599966049194,1.7218749523162842,0.3203130066394806],[-1.2109400033950806,1.7062499523162842,0.078125],[-1.3515599966049194,1.7218749523162842,0.3203130066394806],[-1.28125,1.729688048362732,0.0546875],[1.28125,1.729688048362732,0.0546875],[1.2109400033950806,1.7062499523162842,0.078125],[1.03125,1.604688048362732,-0.0390625],[1.28125,1.729688048362732,0.0546875],[1.03125,1.604688048362732,-0.0390625],[1.0390599966049194,1.6281249523162842,-0.1015629991889],[-1.03125,1.604688048362732,-0.0390625],[-1.2109400033950806,1.7062499523162842,0.078125],[-1.28125,1.729688048362732,0.0546875],[-1.03125,1.604688048362732,-0.0390625],[-1.28125,1.729688048362732,0.0546875],[-1.0390599966049194,1.6281249523162842,-0.1015629991889],[1.0390599966049194,1.6281249523162842,-0.1015629991889],[1.03125,1.604688048362732,-0.0390625],[0.828125,1.432813048362732,-0.0703125],[1.0390599966049194,1.6281249523162842,-0.1015629991889],[0.828125,1.432813048362732,-0.0703125],[0.7734379768371582,1.4249999523162842,-0.140625],[-0.828125,1.432813048362732,-0.0703125],[-1.03125,1.604688048362732,-0.0390625],[-1.0390599966049194,1.6281249523162842,-0.1015629991889],[-0.828125,1.432813048362732,-0.0703125],[-1.0390599966049194,1.6281249523162842,-0.1015629991889],[-0.7734379768371582,1.4249999523162842,-0.140625],[1.03125,1.604688048362732,-0.0390625],[1.0390599966049194,1.667188048362732,0],[0.8828129768371582,1.510938048362732,-0.0234375],[1.03125,1.604688048362732,-0.0390625],[0.8828129768371582,1.510938048362732,-0.0234375],[0.828125,1.432813048362732,-0.0703125],[-0.8828129768371582,1.510938048362732,-0.0234375],[-1.0390599966049194,1.667188048362732,0],[-1.03125,1.604688048362732,-0.0390625],[-0.8828129768371582,1.510938048362732,-0.0234375],[-1.03125,1.604688048362732,-0.0390625],[-0.828125,1.432813048362732,-0.0703125],[1.2109400033950806,1.7062499523162842,0.078125],[1.1875,1.745313048362732,0.09375],[1.0390599966049194,1.667188048362732,0],[1.2109400033950806,1.7062499523162842,0.078125],[1.0390599966049194,1.667188048362732,0],[1.03125,1.604688048362732,-0.0390625],[-1.0390599966049194,1.667188048362732,0],[-1.1875,1.745313048362732,0.09375],[-1.2109400033950806,1.7062499523162842,0.078125],[-1.0390599966049194,1.667188048362732,0],[-1.2109400033950806,1.7062499523162842,0.078125],[-1.03125,1.604688048362732,-0.0390625],[1.2656300067901611,1.7062499523162842,0.2890630066394806],[1.2343800067901611,1.745313048362732,0.25],[1.1875,1.745313048362732,0.09375],[1.2656300067901611,1.7062499523162842,0.2890630066394806],[1.1875,1.745313048362732,0.09375],[1.2109400033950806,1.7062499523162842,0.078125],[-1.1875,1.745313048362732,0.09375],[-1.2343800067901611,1.745313048362732,0.25],[-1.2656300067901611,1.7062499523162842,0.2890630066394806],[-1.1875,1.745313048362732,0.09375],[-1.2656300067901611,1.7062499523162842,0.2890630066394806],[-1.2109400033950806,1.7062499523162842,0.078125],[1.1875,1.6906249523162842,0.4375],[1.1718800067901611,1.7374999523162842,0.359375],[1.2343800067901611,1.745313048362732,0.25],[1.1875,1.6906249523162842,0.4375],[1.2343800067901611,1.745313048362732,0.25],[1.2656300067901611,1.7062499523162842,0.2890630066394806],[-1.2343800067901611,1.745313048362732,0.25],[-1.1718800067901611,1.7374999523162842,0.359375],[-1.1875,1.6906249523162842,0.4375],[-1.2343800067901611,1.745313048362732,0.25],[-1.1875,1.6906249523162842,0.4375],[-1.2656300067901611,1.7062499523162842,0.2890630066394806],[1.0156300067901611,1.589063048362732,0.4140630066394806],[1.0234400033950806,1.6593749523162842,0.34375],[1.1718800067901611,1.7374999523162842,0.359375],[1.0156300067901611,1.589063048362732,0.4140630066394806],[1.1718800067901611,1.7374999523162842,0.359375],[1.1875,1.6906249523162842,0.4375],[-1.1718800067901611,1.7374999523162842,0.359375],[-1.0234400033950806,1.6593749523162842,0.34375],[-1.0156300067901611,1.589063048362732,0.4140630066394806],[-1.1718800067901611,1.7374999523162842,0.359375],[-1.0156300067901611,1.589063048362732,0.4140630066394806],[-1.1875,1.6906249523162842,0.4375],[1.0156300067901611,1.589063048362732,0.4140630066394806],[0.921875,1.5187499523162842,0.359375],[0.9453129768371582,1.589063048362732,0.3046880066394806],[1.0156300067901611,1.589063048362732,0.4140630066394806],[0.9453129768371582,1.589063048362732,0.3046880066394806],[1.0234400033950806,1.6593749523162842,0.34375],[-0.9453129768371582,1.589063048362732,0.3046880066394806],[-0.921875,1.5187499523162842,0.359375],[-1.0156300067901611,1.589063048362732,0.4140630066394806],[-0.9453129768371582,1.589063048362732,0.3046880066394806],[-1.0156300067901611,1.589063048362732,0.4140630066394806],[-1.0234400033950806,1.6593749523162842,0.34375],[0.734375,1.2296874523162842,-0.046875],[0.59375,1.464063048362732,-0.125],[0.71875,1.4718749523162842,-0.0234375],[0.734375,1.2296874523162842,-0.046875],[0.71875,1.4718749523162842,-0.0234375],[0.7265629768371582,1.3703124523162842,0],[-0.71875,1.4718749523162842,-0.0234375],[-0.59375,1.464063048362732,-0.125],[-0.734375,1.2296874523162842,-0.046875],[-0.71875,1.4718749523162842,-0.0234375],[-0.734375,1.2296874523162842,-0.046875],[-0.7265629768371582,1.3703124523162842,0],[0.59375,1.464063048362732,-0.125],[0.7734379768371582,1.4249999523162842,-0.140625],[0.828125,1.432813048362732,-0.0703125],[0.59375,1.464063048362732,-0.125],[0.828125,1.432813048362732,-0.0703125],[0.71875,1.4718749523162842,-0.0234375],[-0.828125,1.432813048362732,-0.0703125],[-0.7734379768371582,1.4249999523162842,-0.140625],[-0.59375,1.464063048362732,-0.125],[-0.828125,1.432813048362732,-0.0703125],[-0.59375,1.464063048362732,-0.125],[-0.71875,1.4718749523162842,-0.0234375],[0.8515629768371582,1.2453124523162842,0.234375],[0.734375,1.2296874523162842,-0.046875],[0.7265629768371582,1.3703124523162842,0],[0.8515629768371582,1.2453124523162842,0.234375],[0.7265629768371582,1.3703124523162842,0],[0.859375,1.3468749523162842,0.3203130066394806],[-0.7265629768371582,1.3703124523162842,0],[-0.734375,1.2296874523162842,-0.046875],[-0.8515629768371582,1.2453124523162842,0.234375],[-0.7265629768371582,1.3703124523162842,0],[-0.8515629768371582,1.2453124523162842,0.234375],[-0.859375,1.3468749523162842,0.3203130066394806],[0.8203129768371582,1.5031249523162842,0.328125],[0.84375,1.510938048362732,0.2890630066394806],[0.921875,1.5187499523162842,0.359375],[0.8203129768371582,1.5031249523162842,0.328125],[0.921875,1.5187499523162842,0.359375],[0.890625,1.5343749523162842,0.40625],[-0.921875,1.5187499523162842,0.359375],[-0.84375,1.510938048362732,0.2890630066394806],[-0.8203129768371582,1.5031249523162842,0.328125],[-0.921875,1.5187499523162842,0.359375],[-0.8203129768371582,1.5031249523162842,0.328125],[-0.890625,1.5343749523162842,0.40625],[0.828125,1.432813048362732,-0.0703125],[0.8828129768371582,1.510938048362732,-0.0234375],[0.8125,1.573438048362732,-0.015625],[0.828125,1.432813048362732,-0.0703125],[0.8125,1.573438048362732,-0.015625],[0.71875,1.4718749523162842,-0.0234375],[-0.8125,1.573438048362732,-0.015625],[-0.8828129768371582,1.510938048362732,-0.0234375],[-0.828125,1.432813048362732,-0.0703125],[-0.8125,1.573438048362732,-0.015625],[-0.828125,1.432813048362732,-0.0703125],[-0.71875,1.4718749523162842,-0.0234375],[0.84375,1.573438048362732,0.015625],[0.71875,1.4874999523162842,0.0390625],[0.71875,1.4718749523162842,-0.0234375],[0.84375,1.573438048362732,0.015625],[0.71875,1.4718749523162842,-0.0234375],[0.8125,1.573438048362732,-0.015625],[-0.71875,1.4718749523162842,-0.0234375],[-0.71875,1.4874999523162842,0.0390625],[-0.84375,1.573438048362732,0.015625],[-0.71875,1.4718749523162842,-0.0234375],[-0.84375,1.573438048362732,0.015625],[-0.8125,1.573438048362732,-0.015625],[0.7578129768371582,1.573438048362732,0.09375],[0.71875,1.4874999523162842,0.0390625],[0.84375,1.573438048362732,0.015625],[0.7578129768371582,1.573438048362732,0.09375],[0.84375,1.573438048362732,0.015625],[0.8203129768371582,1.573438048362732,0.0859375],[-0.84375,1.573438048362732,0.015625],[-0.71875,1.4874999523162842,0.0390625],[-0.7578129768371582,1.573438048362732,0.09375],[-0.84375,1.573438048362732,0.015625],[-0.7578129768371582,1.573438048362732,0.09375],[-0.8203129768371582,1.573438048362732,0.0859375],[0.8359379768371582,1.573438048362732,0.171875],[0.796875,1.510938048362732,0.203125],[0.71875,1.4874999523162842,0.0390625],[0.8359379768371582,1.573438048362732,0.171875],[0.71875,1.4874999523162842,0.0390625],[0.7578129768371582,1.573438048362732,0.09375],[-0.71875,1.4874999523162842,0.0390625],[-0.796875,1.510938048362732,0.203125],[-0.8359379768371582,1.573438048362732,0.171875],[-0.71875,1.4874999523162842,0.0390625],[-0.8359379768371582,1.573438048362732,0.171875],[-0.7578129768371582,1.573438048362732,0.09375],[0.84375,1.510938048362732,0.2890630066394806],[0.796875,1.510938048362732,0.203125],[0.8359379768371582,1.573438048362732,0.171875],[0.84375,1.510938048362732,0.2890630066394806],[0.8359379768371582,1.573438048362732,0.171875],[0.890625,1.5656249523162842,0.2421880066394806],[-0.8359379768371582,1.573438048362732,0.171875],[-0.796875,1.510938048362732,0.203125],[-0.84375,1.510938048362732,0.2890630066394806],[-0.8359379768371582,1.573438048362732,0.171875],[-0.84375,1.510938048362732,0.2890630066394806],[-0.890625,1.5656249523162842,0.2421880066394806],[0.921875,1.5187499523162842,0.359375],[0.84375,1.510938048362732,0.2890630066394806],[0.890625,1.5656249523162842,0.2421880066394806],[0.921875,1.5187499523162842,0.359375],[0.890625,1.5656249523162842,0.2421880066394806],[0.9453129768371582,1.589063048362732,0.3046880066394806],[-0.890625,1.5656249523162842,0.2421880066394806],[-0.84375,1.510938048362732,0.2890630066394806],[-0.921875,1.5187499523162842,0.359375],[-0.890625,1.5656249523162842,0.2421880066394806],[-0.921875,1.5187499523162842,0.359375],[-0.9453129768371582,1.589063048362732,0.3046880066394806],[0.859375,1.3468749523162842,0.3203130066394806],[0.796875,1.510938048362732,0.203125],[0.84375,1.510938048362732,0.2890630066394806],[0.859375,1.3468749523162842,0.3203130066394806],[0.84375,1.510938048362732,0.2890630066394806],[0.8203129768371582,1.5031249523162842,0.328125],[-0.84375,1.510938048362732,0.2890630066394806],[-0.796875,1.510938048362732,0.203125],[-0.859375,1.3468749523162842,0.3203130066394806],[-0.84375,1.510938048362732,0.2890630066394806],[-0.859375,1.3468749523162842,0.3203130066394806],[-0.8203129768371582,1.5031249523162842,0.328125],[0.859375,1.3468749523162842,0.3203130066394806],[0.7265629768371582,1.3703124523162842,0],[0.71875,1.4874999523162842,0.0390625],[0.859375,1.3468749523162842,0.3203130066394806],[0.71875,1.4874999523162842,0.0390625],[0.796875,1.510938048362732,0.203125],[-0.71875,1.4874999523162842,0.0390625],[-0.7265629768371582,1.3703124523162842,0],[-0.859375,1.3468749523162842,0.3203130066394806],[-0.71875,1.4874999523162842,0.0390625],[-0.859375,1.3468749523162842,0.3203130066394806],[-0.796875,1.510938048362732,0.203125],[0.7265629768371582,1.3703124523162842,0],[0.71875,1.4718749523162842,-0.0234375],[0.71875,1.4874999523162842,0.0390625],[-0.71875,1.4874999523162842,0.0390625],[-0.71875,1.4718749523162842,-0.0234375],[-0.7265629768371582,1.3703124523162842,0],[0.9453129768371582,1.589063048362732,0.3046880066394806],[0.890625,1.5656249523162842,0.2421880066394806],[0.890625,1.620313048362732,0.234375],[0.9453129768371582,1.589063048362732,0.3046880066394806],[0.890625,1.620313048362732,0.234375],[0.953125,1.6437499523162842,0.2890630066394806],[-0.890625,1.620313048362732,0.234375],[-0.890625,1.5656249523162842,0.2421880066394806],[-0.9453129768371582,1.589063048362732,0.3046880066394806],[-0.890625,1.620313048362732,0.234375],[-0.9453129768371582,1.589063048362732,0.3046880066394806],[-0.953125,1.6437499523162842,0.2890630066394806],[0.890625,1.5656249523162842,0.2421880066394806],[0.8359379768371582,1.573438048362732,0.171875],[0.84375,1.620313048362732,0.171875],[0.890625,1.5656249523162842,0.2421880066394806],[0.84375,1.620313048362732,0.171875],[0.890625,1.620313048362732,0.234375],[-0.84375,1.620313048362732,0.171875],[-0.8359379768371582,1.573438048362732,0.171875],[-0.890625,1.5656249523162842,0.2421880066394806],[-0.84375,1.620313048362732,0.171875],[-0.890625,1.5656249523162842,0.2421880066394806],[-0.890625,1.620313048362732,0.234375],[0.8359379768371582,1.573438048362732,0.171875],[0.7578129768371582,1.573438048362732,0.09375],[0.765625,1.620313048362732,0.09375],[0.8359379768371582,1.573438048362732,0.171875],[0.765625,1.620313048362732,0.09375],[0.84375,1.620313048362732,0.171875],[-0.765625,1.620313048362732,0.09375],[-0.7578129768371582,1.573438048362732,0.09375],[-0.8359379768371582,1.573438048362732,0.171875],[-0.765625,1.620313048362732,0.09375],[-0.8359379768371582,1.573438048362732,0.171875],[-0.84375,1.620313048362732,0.171875],[0.7578129768371582,1.573438048362732,0.09375],[0.8203129768371582,1.573438048362732,0.0859375],[0.828125,1.620313048362732,0.078125],[0.7578129768371582,1.573438048362732,0.09375],[0.828125,1.620313048362732,0.078125],[0.765625,1.620313048362732,0.09375],[-0.828125,1.620313048362732,0.078125],[-0.8203129768371582,1.573438048362732,0.0859375],[-0.7578129768371582,1.573438048362732,0.09375],[-0.828125,1.620313048362732,0.078125],[-0.7578129768371582,1.573438048362732,0.09375],[-0.765625,1.620313048362732,0.09375],[0.8203129768371582,1.573438048362732,0.0859375],[0.84375,1.573438048362732,0.015625],[0.8515629768371582,1.620313048362732,0.015625],[0.8203129768371582,1.573438048362732,0.0859375],[0.8515629768371582,1.620313048362732,0.015625],[0.828125,1.620313048362732,0.078125],[-0.8515629768371582,1.620313048362732,0.015625],[-0.84375,1.573438048362732,0.015625],[-0.8203129768371582,1.573438048362732,0.0859375],[-0.8515629768371582,1.620313048362732,0.015625],[-0.8203129768371582,1.573438048362732,0.0859375],[-0.828125,1.620313048362732,0.078125],[0.84375,1.573438048362732,0.015625],[0.8125,1.573438048362732,-0.015625],[0.8125,1.620313048362732,-0.015625],[0.84375,1.573438048362732,0.015625],[0.8125,1.620313048362732,-0.015625],[0.8515629768371582,1.620313048362732,0.015625],[-0.8125,1.620313048362732,-0.015625],[-0.8125,1.573438048362732,-0.015625],[-0.84375,1.573438048362732,0.015625],[-0.8125,1.620313048362732,-0.015625],[-0.84375,1.573438048362732,0.015625],[-0.8515629768371582,1.620313048362732,0.015625],[0.8125,1.573438048362732,-0.015625],[0.8828129768371582,1.510938048362732,-0.0234375],[0.8828129768371582,1.5656249523162842,-0.015625],[0.8125,1.573438048362732,-0.015625],[0.8828129768371582,1.5656249523162842,-0.015625],[0.8125,1.620313048362732,-0.015625],[-0.8828129768371582,1.5656249523162842,-0.015625],[-0.8828129768371582,1.510938048362732,-0.0234375],[-0.8125,1.573438048362732,-0.015625],[-0.8828129768371582,1.5656249523162842,-0.015625],[-0.8125,1.573438048362732,-0.015625],[-0.8125,1.620313048362732,-0.015625],[1.0234400033950806,1.6593749523162842,0.34375],[0.9453129768371582,1.589063048362732,0.3046880066394806],[0.953125,1.6437499523162842,0.2890630066394806],[1.0234400033950806,1.6593749523162842,0.34375],[0.953125,1.6437499523162842,0.2890630066394806],[1.0390599966049194,1.714063048362732,0.328125],[-0.953125,1.6437499523162842,0.2890630066394806],[-0.9453129768371582,1.589063048362732,0.3046880066394806],[-1.0234400033950806,1.6593749523162842,0.34375],[-0.953125,1.6437499523162842,0.2890630066394806],[-1.0234400033950806,1.6593749523162842,0.34375],[-1.0390599966049194,1.714063048362732,0.328125],[1.1718800067901611,1.7374999523162842,0.359375],[1.0234400033950806,1.6593749523162842,0.34375],[1.0390599966049194,1.714063048362732,0.328125],[1.1718800067901611,1.7374999523162842,0.359375],[1.0390599966049194,1.714063048362732,0.328125],[1.1875,1.7843749523162842,0.34375],[-1.0390599966049194,1.714063048362732,0.328125],[-1.0234400033950806,1.6593749523162842,0.34375],[-1.1718800067901611,1.7374999523162842,0.359375],[-1.0390599966049194,1.714063048362732,0.328125],[-1.1718800067901611,1.7374999523162842,0.359375],[-1.1875,1.7843749523162842,0.34375],[1.2343800067901611,1.745313048362732,0.25],[1.1718800067901611,1.7374999523162842,0.359375],[1.1875,1.7843749523162842,0.34375],[1.2343800067901611,1.745313048362732,0.25],[1.1875,1.7843749523162842,0.34375],[1.2578099966049194,1.792188048362732,0.2421880066394806],[-1.1875,1.7843749523162842,0.34375],[-1.1718800067901611,1.7374999523162842,0.359375],[-1.2343800067901611,1.745313048362732,0.25],[-1.1875,1.7843749523162842,0.34375],[-1.2343800067901611,1.745313048362732,0.25],[-1.2578099966049194,1.792188048362732,0.2421880066394806],[1.1875,1.745313048362732,0.09375],[1.2343800067901611,1.745313048362732,0.25],[1.2578099966049194,1.792188048362732,0.2421880066394806],[1.1875,1.745313048362732,0.09375],[1.2578099966049194,1.792188048362732,0.2421880066394806],[1.2109400033950806,1.7843749523162842,0.0859375],[-1.2578099966049194,1.792188048362732,0.2421880066394806],[-1.2343800067901611,1.745313048362732,0.25],[-1.1875,1.745313048362732,0.09375],[-1.2578099966049194,1.792188048362732,0.2421880066394806],[-1.1875,1.745313048362732,0.09375],[-1.2109400033950806,1.7843749523162842,0.0859375],[1.0390599966049194,1.667188048362732,0],[1.1875,1.745313048362732,0.09375],[1.2109400033950806,1.7843749523162842,0.0859375],[1.0390599966049194,1.667188048362732,0],[1.2109400033950806,1.7843749523162842,0.0859375],[1.0468800067901611,1.7218749523162842,0],[-1.2109400033950806,1.7843749523162842,0.0859375],[-1.1875,1.745313048362732,0.09375],[-1.0390599966049194,1.667188048362732,0],[-1.2109400033950806,1.7843749523162842,0.0859375],[-1.0390599966049194,1.667188048362732,0],[-1.0468800067901611,1.7218749523162842,0],[0.8828129768371582,1.510938048362732,-0.0234375],[1.0390599966049194,1.667188048362732,0],[1.0468800067901611,1.7218749523162842,0],[0.8828129768371582,1.510938048362732,-0.0234375],[1.0468800067901611,1.7218749523162842,0],[0.8828129768371582,1.5656249523162842,-0.015625],[-1.0468800067901611,1.7218749523162842,0],[-1.0390599966049194,1.667188048362732,0],[-0.8828129768371582,1.510938048362732,-0.0234375],[-1.0468800067901611,1.7218749523162842,0],[-0.8828129768371582,1.510938048362732,-0.0234375],[-0.8828129768371582,1.5656249523162842,-0.015625],[0.828125,1.620313048362732,0.078125],[0.8515629768371582,1.620313048362732,0.015625],[0.9375,1.635938048362732,0.0625],[0.828125,1.620313048362732,0.078125],[0.9375,1.635938048362732,0.0625],[0.890625,1.6281249523162842,0.109375],[-0.9375,1.635938048362732,0.0625],[-0.8515629768371582,1.620313048362732,0.015625],[-0.828125,1.620313048362732,0.078125],[-0.9375,1.635938048362732,0.0625],[-0.828125,1.620313048362732,0.078125],[-0.890625,1.6281249523162842,0.109375],[0.890625,1.6281249523162842,0.109375],[0.9375,1.635938048362732,0.0625],[1,1.667188048362732,0.125],[0.890625,1.6281249523162842,0.109375],[1,1.667188048362732,0.125],[0.9609379768371582,1.651563048362732,0.171875],[-1,1.667188048362732,0.125],[-0.9375,1.635938048362732,0.0625],[-0.890625,1.6281249523162842,0.109375],[-1,1.667188048362732,0.125],[-0.890625,1.6281249523162842,0.109375],[-0.9609379768371582,1.651563048362732,0.171875],[0.9609379768371582,1.651563048362732,0.171875],[1,1.667188048362732,0.125],[1.0546900033950806,1.682813048362732,0.1875],[0.9609379768371582,1.651563048362732,0.171875],[1.0546900033950806,1.682813048362732,0.1875],[1.0156300067901611,1.6749999523162842,0.234375],[-1.0546900033950806,1.682813048362732,0.1875],[-1,1.667188048362732,0.125],[-0.9609379768371582,1.651563048362732,0.171875],[-1.0546900033950806,1.682813048362732,0.1875],[-0.9609379768371582,1.651563048362732,0.171875],[-1.0156300067901611,1.6749999523162842,0.234375],[1.0156300067901611,1.6749999523162842,0.234375],[1.0546900033950806,1.682813048362732,0.1875],[1.1093800067901611,1.6906249523162842,0.2109380066394806],[1.0156300067901611,1.6749999523162842,0.234375],[1.1093800067901611,1.6906249523162842,0.2109380066394806],[1.0859400033950806,1.6906249523162842,0.2734380066394806],[-1.1093800067901611,1.6906249523162842,0.2109380066394806],[-1.0546900033950806,1.682813048362732,0.1875],[-1.0156300067901611,1.6749999523162842,0.234375],[-1.1093800067901611,1.6906249523162842,0.2109380066394806],[-1.0156300067901611,1.6749999523162842,0.234375],[-1.0859400033950806,1.6906249523162842,0.2734380066394806],[1.0390599966049194,1.714063048362732,0.328125],[0.953125,1.6437499523162842,0.2890630066394806],[1.0156300067901611,1.6749999523162842,0.234375],[1.0390599966049194,1.714063048362732,0.328125],[1.0156300067901611,1.6749999523162842,0.234375],[1.0859400033950806,1.6906249523162842,0.2734380066394806],[-1.0156300067901611,1.6749999523162842,0.234375],[-0.953125,1.6437499523162842,0.2890630066394806],[-1.0390599966049194,1.714063048362732,0.328125],[-1.0156300067901611,1.6749999523162842,0.234375],[-1.0390599966049194,1.714063048362732,0.328125],[-1.0859400033950806,1.6906249523162842,0.2734380066394806],[0.890625,1.620313048362732,0.234375],[0.9609379768371582,1.651563048362732,0.171875],[1.0156300067901611,1.6749999523162842,0.234375],[0.890625,1.620313048362732,0.234375],[1.0156300067901611,1.6749999523162842,0.234375],[0.953125,1.6437499523162842,0.2890630066394806],[-1.0156300067901611,1.6749999523162842,0.234375],[-0.9609379768371582,1.651563048362732,0.171875],[-0.890625,1.620313048362732,0.234375],[-1.0156300067901611,1.6749999523162842,0.234375],[-0.890625,1.620313048362732,0.234375],[-0.953125,1.6437499523162842,0.2890630066394806],[0.890625,1.620313048362732,0.234375],[0.84375,1.620313048362732,0.171875],[0.890625,1.6281249523162842,0.109375],[0.890625,1.620313048362732,0.234375],[0.890625,1.6281249523162842,0.109375],[0.9609379768371582,1.651563048362732,0.171875],[-0.890625,1.6281249523162842,0.109375],[-0.84375,1.620313048362732,0.171875],[-0.890625,1.620313048362732,0.234375],[-0.890625,1.6281249523162842,0.109375],[-0.890625,1.620313048362732,0.234375],[-0.9609379768371582,1.651563048362732,0.171875],[0.828125,1.620313048362732,0.078125],[0.890625,1.6281249523162842,0.109375],[0.84375,1.620313048362732,0.171875],[0.828125,1.620313048362732,0.078125],[0.84375,1.620313048362732,0.171875],[0.765625,1.620313048362732,0.09375],[-0.84375,1.620313048362732,0.171875],[-0.890625,1.6281249523162842,0.109375],[-0.828125,1.620313048362732,0.078125],[-0.84375,1.620313048362732,0.171875],[-0.828125,1.620313048362732,0.078125],[-0.765625,1.620313048362732,0.09375],[0.8515629768371582,1.620313048362732,0.015625],[0.8125,1.620313048362732,-0.015625],[0.8828129768371582,1.5656249523162842,-0.015625],[0.8515629768371582,1.620313048362732,0.015625],[0.8828129768371582,1.5656249523162842,-0.015625],[0.9375,1.635938048362732,0.0625],[-0.8515629768371582,1.620313048362732,0.015625],[-0.9375,1.635938048362732,0.0625],[-0.8828129768371582,1.5656249523162842,-0.015625],[-0.8515629768371582,1.620313048362732,0.015625],[-0.8828129768371582,1.5656249523162842,-0.015625],[-0.8125,1.620313048362732,-0.015625],[0.9375,1.635938048362732,0.0625],[0.8828129768371582,1.5656249523162842,-0.015625],[1.0468800067901611,1.7218749523162842,0],[0.9375,1.635938048362732,0.0625],[1.0468800067901611,1.7218749523162842,0],[1,1.667188048362732,0.125],[-0.9375,1.635938048362732,0.0625],[-1,1.667188048362732,0.125],[-1.0468800067901611,1.7218749523162842,0],[-0.9375,1.635938048362732,0.0625],[-1.0468800067901611,1.7218749523162842,0],[-0.8828129768371582,1.5656249523162842,-0.015625],[1.2109400033950806,1.7843749523162842,0.0859375],[1.0546900033950806,1.682813048362732,0.1875],[1,1.667188048362732,0.125],[1.2109400033950806,1.7843749523162842,0.0859375],[1,1.667188048362732,0.125],[1.0468800067901611,1.7218749523162842,0],[-1,1.667188048362732,0.125],[-1.0546900033950806,1.682813048362732,0.1875],[-1.2109400033950806,1.7843749523162842,0.0859375],[-1,1.667188048362732,0.125],[-1.2109400033950806,1.7843749523162842,0.0859375],[-1.0468800067901611,1.7218749523162842,0],[1.2578099966049194,1.792188048362732,0.2421880066394806],[1.1093800067901611,1.6906249523162842,0.2109380066394806],[1.0546900033950806,1.682813048362732,0.1875],[1.2578099966049194,1.792188048362732,0.2421880066394806],[1.0546900033950806,1.682813048362732,0.1875],[1.2109400033950806,1.7843749523162842,0.0859375],[-1.0546900033950806,1.682813048362732,0.1875],[-1.1093800067901611,1.6906249523162842,0.2109380066394806],[-1.2578099966049194,1.792188048362732,0.2421880066394806],[-1.0546900033950806,1.682813048362732,0.1875],[-1.2578099966049194,1.792188048362732,0.2421880066394806],[-1.2109400033950806,1.7843749523162842,0.0859375],[1.1875,1.7843749523162842,0.34375],[1.0859400033950806,1.6906249523162842,0.2734380066394806],[1.1093800067901611,1.6906249523162842,0.2109380066394806],[1.1875,1.7843749523162842,0.34375],[1.1093800067901611,1.6906249523162842,0.2109380066394806],[1.2578099966049194,1.792188048362732,0.2421880066394806],[-1.1093800067901611,1.6906249523162842,0.2109380066394806],[-1.0859400033950806,1.6906249523162842,0.2734380066394806],[-1.1875,1.7843749523162842,0.34375],[-1.1093800067901611,1.6906249523162842,0.2109380066394806],[-1.1875,1.7843749523162842,0.34375],[-1.2578099966049194,1.792188048362732,0.2421880066394806],[1.0390599966049194,1.714063048362732,0.328125],[1.0859400033950806,1.6906249523162842,0.2734380066394806],[1.1875,1.7843749523162842,0.34375],[-1.1875,1.7843749523162842,0.34375],[-1.0859400033950806,1.6906249523162842,0.2734380066394806],[-1.0390599966049194,1.714063048362732,0.328125],[1.0390599966049194,1.6281249523162842,-0.1015629991889],[0.7734379768371582,1.4249999523162842,-0.140625],[0.7890629768371582,1.6281249523162842,-0.125],[1.0390599966049194,1.6281249523162842,-0.1015629991889],[0.7890629768371582,1.6281249523162842,-0.125],[1.0390599966049194,1.792188048362732,-0.0859375],[-0.7890629768371582,1.6281249523162842,-0.125],[-0.7734379768371582,1.4249999523162842,-0.140625],[-1.0390599966049194,1.6281249523162842,-0.1015629991889],[-0.7890629768371582,1.6281249523162842,-0.125],[-1.0390599966049194,1.6281249523162842,-0.1015629991889],[-1.0390599966049194,1.792188048362732,-0.0859375],[1.28125,1.729688048362732,0.0546875],[1.0390599966049194,1.6281249523162842,-0.1015629991889],[1.0390599966049194,1.792188048362732,-0.0859375],[1.28125,1.729688048362732,0.0546875],[1.0390599966049194,1.792188048362732,-0.0859375],[1.3125,1.8312499523162842,0.0546875],[-1.0390599966049194,1.792188048362732,-0.0859375],[-1.0390599966049194,1.6281249523162842,-0.1015629991889],[-1.28125,1.729688048362732,0.0546875],[-1.0390599966049194,1.792188048362732,-0.0859375],[-1.28125,1.729688048362732,0.0546875],[-1.3125,1.8312499523162842,0.0546875],[1.3515599966049194,1.7218749523162842,0.3203130066394806],[1.28125,1.729688048362732,0.0546875],[1.3125,1.8312499523162842,0.0546875],[1.3515599966049194,1.7218749523162842,0.3203130066394806],[1.3125,1.8312499523162842,0.0546875],[1.3671900033950806,1.7999999523162842,0.296875],[-1.3125,1.8312499523162842,0.0546875],[-1.28125,1.729688048362732,0.0546875],[-1.3515599966049194,1.7218749523162842,0.3203130066394806],[-1.3125,1.8312499523162842,0.0546875],[-1.3515599966049194,1.7218749523162842,0.3203130066394806],[-1.3671900033950806,1.7999999523162842,0.296875],[1.2343800067901611,1.7218749523162842,0.5078129768371582],[1.3515599966049194,1.7218749523162842,0.3203130066394806],[1.3671900033950806,1.7999999523162842,0.296875],[1.2343800067901611,1.7218749523162842,0.5078129768371582],[1.3671900033950806,1.7999999523162842,0.296875],[1.25,1.8468749523162842,0.46875],[-1.3671900033950806,1.7999999523162842,0.296875],[-1.3515599966049194,1.7218749523162842,0.3203130066394806],[-1.2343800067901611,1.7218749523162842,0.5078129768371582],[-1.3671900033950806,1.7999999523162842,0.296875],[-1.2343800067901611,1.7218749523162842,0.5078129768371582],[-1.25,1.8468749523162842,0.46875],[1.0234400033950806,1.6124999523162842,0.4765630066394806],[1.2343800067901611,1.7218749523162842,0.5078129768371582],[1.25,1.8468749523162842,0.46875],[1.0234400033950806,1.6124999523162842,0.4765630066394806],[1.25,1.8468749523162842,0.46875],[1.0234400033950806,1.7843749523162842,0.4375],[-1.25,1.8468749523162842,0.46875],[-1.2343800067901611,1.7218749523162842,0.5078129768371582],[-1.0234400033950806,1.6124999523162842,0.4765630066394806],[-1.25,1.8468749523162842,0.46875],[-1.0234400033950806,1.6124999523162842,0.4765630066394806],[-1.0234400033950806,1.7843749523162842,0.4375],[0.890625,1.5343749523162842,0.40625],[1.0234400033950806,1.6124999523162842,0.4765630066394806],[1.0234400033950806,1.7843749523162842,0.4375],[0.890625,1.5343749523162842,0.40625],[1.0234400033950806,1.7843749523162842,0.4375],[0.859375,1.682813048362732,0.3828130066394806],[-1.0234400033950806,1.7843749523162842,0.4375],[-1.0234400033950806,1.6124999523162842,0.4765630066394806],[-0.890625,1.5343749523162842,0.40625],[-1.0234400033950806,1.7843749523162842,0.4375],[-0.890625,1.5343749523162842,0.40625],[-0.859375,1.682813048362732,0.3828130066394806],[1.0234400033950806,1.7843749523162842,0.4375],[1.0390599966049194,1.792188048362732,-0.0859375],[0.7890629768371582,1.6281249523162842,-0.125],[1.0234400033950806,1.7843749523162842,0.4375],[0.7890629768371582,1.6281249523162842,-0.125],[0.859375,1.682813048362732,0.3828130066394806],[-0.7890629768371582,1.6281249523162842,-0.125],[-1.0390599966049194,1.792188048362732,-0.0859375],[-1.0234400033950806,1.7843749523162842,0.4375],[-0.7890629768371582,1.6281249523162842,-0.125],[-1.0234400033950806,1.7843749523162842,0.4375],[-0.859375,1.682813048362732,0.3828130066394806],[1.0234400033950806,1.7843749523162842,0.4375],[1.25,1.8468749523162842,0.46875],[1.3125,1.8312499523162842,0.0546875],[1.0234400033950806,1.7843749523162842,0.4375],[1.3125,1.8312499523162842,0.0546875],[1.0390599966049194,1.792188048362732,-0.0859375],[-1.3125,1.8312499523162842,0.0546875],[-1.25,1.8468749523162842,0.46875],[-1.0234400033950806,1.7843749523162842,0.4375],[-1.3125,1.8312499523162842,0.0546875],[-1.0234400033950806,1.7843749523162842,0.4375],[-1.0390599966049194,1.792188048362732,-0.0859375],[1.25,1.8468749523162842,0.46875],[1.3671900033950806,1.7999999523162842,0.296875],[1.3125,1.8312499523162842,0.0546875],[-1.3125,1.8312499523162842,0.0546875],[-1.3671900033950806,1.7999999523162842,0.296875],[-1.25,1.8468749523162842,0.46875],[0.7734379768371582,1.7374999523162842,0.265625],[0.8203129768371582,1.5031249523162842,0.328125],[0.890625,1.5343749523162842,0.40625],[0.7734379768371582,1.7374999523162842,0.265625],[0.890625,1.5343749523162842,0.40625],[0.859375,1.682813048362732,0.3828130066394806],[-0.890625,1.5343749523162842,0.40625],[-0.8203129768371582,1.5031249523162842,0.328125],[-0.7734379768371582,1.7374999523162842,0.265625],[-0.890625,1.5343749523162842,0.40625],[-0.7734379768371582,1.7374999523162842,0.265625],[-0.859375,1.682813048362732,0.3828130066394806],[0.7734379768371582,1.7374999523162842,0.265625],[0.859375,1.682813048362732,0.3828130066394806],[0.7890629768371582,1.6281249523162842,-0.125],[0.7734379768371582,1.7374999523162842,0.265625],[0.7890629768371582,1.6281249523162842,-0.125],[0.640625,1.729688048362732,-0.0078125],[-0.7890629768371582,1.6281249523162842,-0.125],[-0.859375,1.682813048362732,0.3828130066394806],[-0.7734379768371582,1.7374999523162842,0.265625],[-0.7890629768371582,1.6281249523162842,-0.125],[-0.7734379768371582,1.7374999523162842,0.265625],[-0.640625,1.729688048362732,-0.0078125],[0.59375,1.464063048362732,-0.125],[0.640625,1.729688048362732,-0.0078125],[0.7890629768371582,1.6281249523162842,-0.125],[0.59375,1.464063048362732,-0.125],[0.7890629768371582,1.6281249523162842,-0.125],[0.7734379768371582,1.4249999523162842,-0.140625],[-0.7890629768371582,1.6281249523162842,-0.125],[-0.640625,1.729688048362732,-0.0078125],[-0.59375,1.464063048362732,-0.125],[-0.7890629768371582,1.6281249523162842,-0.125],[-0.59375,1.464063048362732,-0.125],[-0.7734379768371582,1.4249999523162842,-0.140625],[1.1703799962997437,-0.14981499314308167,-0.7270299792289734],[-1.1878999471664429,-2.5080950260162354,-0.7270299792289734],[-1.1878999471664429,-0.14981499314308167,-0.7270299792289734],[-1.1878999471664429,-2.5080950260162354,-0.7270299792289734],[1.1703799962997437,-0.14981499314308167,-0.7270299792289734],[1.1703799962997437,-2.5080950260162354,-0.7270299792289734],[1.1703799962997437,-0.14981499314308167,-0.7270299792289734],[1.1703799962997437,-2.5080950260162354,0.593280017375946],[1.1703799962997437,-2.5080950260162354,-0.7270299792289734],[1.1703799962997437,-2.5080950260162354,0.593280017375946],[1.1703799962997437,-0.14981499314308167,-0.7270299792289734],[1.1703799962997437,-0.14981499314308167,0.593280017375946],[1.1703799962997437,-0.14981499314308167,-0.7270299792289734],[-1.1878999471664429,-0.14981499314308167,0.593280017375946],[1.1703799962997437,-0.14981499314308167,0.593280017375946],[-1.1878999471664429,-0.14981499314308167,0.593280017375946],[1.1703799962997437,-0.14981499314308167,-0.7270299792289734],[-1.1878999471664429,-0.14981499314308167,-0.7270299792289734],[-1.1878999471664429,-0.14981499314308167,-0.7270299792289734],[-1.1878999471664429,-0.47626999020576477,-0.1846884936094284],[-1.1878999471664429,-0.14981499314308167,0.593280017375946],[-1.1878999471664429,-0.14981499314308167,-0.7270299792289734],[-1.1878999471664429,-2.19673490524292,-0.1846884936094284],[-1.1878999471664429,-0.47626999020576477,-0.1846884936094284],[-1.1878999471664429,-2.5080950260162354,-0.7270299792289734],[-1.1878999471664429,-2.19673490524292,-0.1846884936094284],[-1.1878999471664429,-0.14981499314308167,-0.7270299792289734],[-1.1878999471664429,-0.14981499314308167,0.593280017375946],[-1.1878999471664429,-0.47626999020576477,-0.1846884936094284],[-1.1878999471664429,-0.47626999020576477,0.593280017375946],[-1.1878999471664429,-2.5080950260162354,-0.7270299792289734],[-1.1878999471664429,-2.19673490524292,0.593280017375946],[-1.1878999471664429,-2.19673490524292,-0.1846884936094284],[-1.1878999471664429,-2.19673490524292,0.593280017375946],[-1.1878999471664429,-2.5080950260162354,-0.7270299792289734],[-1.1878999471664429,-2.5080950260162354,0.593280017375946],[-1.1878999471664429,-2.5080950260162354,-0.7270299792289734],[1.1703799962997437,-2.5080950260162354,0.593280017375946],[-1.1878999471664429,-2.5080950260162354,0.593280017375946],[1.1703799962997437,-2.5080950260162354,0.593280017375946],[-1.1878999471664429,-2.5080950260162354,-0.7270299792289734],[1.1703799962997437,-2.5080950260162354,-0.7270299792289734],[1.1703799962997437,-2.5080950260162354,0.593280017375946],[-1.1878999471664429,-2.19673490524292,0.593280017375946],[-1.1878999471664429,-2.5080950260162354,0.593280017375946],[-1.1878999471664429,-2.19673490524292,0.593280017375946],[1.1703799962997437,-2.5080950260162354,0.593280017375946],[0.3456929922103882,-2.19673490524292,0.593280017375946],[0.3456929922103882,-2.19673490524292,0.593280017375946],[1.1703799962997437,-2.5080950260162354,0.593280017375946],[0.3456929922103882,-0.47626999020576477,0.593280017375946],[1.1703799962997437,-0.14981499314308167,0.593280017375946],[0.3456929922103882,-0.47626999020576477,0.593280017375946],[1.1703799962997437,-2.5080950260162354,0.593280017375946],[-1.1878999471664429,-0.14981499314308167,0.593280017375946],[0.3456929922103882,-0.47626999020576477,0.593280017375946],[1.1703799962997437,-0.14981499314308167,0.593280017375946],[0.3456929922103882,-0.47626999020576477,0.593280017375946],[-1.1878999471664429,-0.14981499314308167,0.593280017375946],[-1.1878999471664429,-0.47626999020576477,0.593280017375946],[-1.1878999471664429,-0.47626999020576477,-0.1846884936094284],[0.3456929922103882,-0.47626999020576477,0.593280017375946],[-1.1878999471664429,-0.47626999020576477,0.593280017375946],[0.3456929922103882,-0.47626999020576477,0.593280017375946],[-1.1878999471664429,-0.47626999020576477,-0.1846884936094284],[0.3456929922103882,-0.47626999020576477,-0.1846884936094284],[-1.1878999471664429,-0.47626999020576477,-0.1846884936094284],[0.3456929922103882,-2.19673490524292,-0.1846884936094284],[0.3456929922103882,-0.47626999020576477,-0.1846884936094284],[0.3456929922103882,-2.19673490524292,-0.1846884936094284],[-1.1878999471664429,-0.47626999020576477,-0.1846884936094284],[-1.1878999471664429,-2.19673490524292,-0.1846884936094284],[-1.1878999471664429,-2.19673490524292,0.593280017375946],[0.3456929922103882,-2.19673490524292,-0.1846884936094284],[-1.1878999471664429,-2.19673490524292,-0.1846884936094284],[0.3456929922103882,-2.19673490524292,-0.1846884936094284],[-1.1878999471664429,-2.19673490524292,0.593280017375946],[0.3456929922103882,-2.19673490524292,0.593280017375946],[0.3456929922103882,-0.47626999020576477,0.593280017375946],[0.3456929922103882,-2.19673490524292,-0.1846884936094284],[0.3456929922103882,-2.19673490524292,0.593280017375946],[0.3456929922103882,-2.19673490524292,-0.1846884936094284],[0.3456929922103882,-0.47626999020576477,0.593280017375946],[0.3456929922103882,-0.47626999020576477,-0.1846884936094284]];
			var vertTexCoord = [[0.9430879950523376,0.22913800179958344],[0.9434300065040588,0.212351992726326],[0.9678109884262085,0.20364999771118164],[0.9430879950523376,0.22913800179958344],[0.9678109884262085,0.20364999771118164],[0.9683979749679565,0.2403780072927475],[0.8818110227584839,0.053950000554323196],[0.9057819843292236,0.06372500211000443],[0.9053789973258972,0.08050929754972458],[0.8818110227584839,0.053950000554323196],[0.9053789973258972,0.08050929754972458],[0.8795949816703796,0.09061560034751892],[0.9683979749679565,0.2403780072927475],[0.9678109884262085,0.20364999771118164],[0.999638020992279,0.19781899452209473],[0.9683979749679565,0.2403780072927475],[0.999638020992279,0.19781899452209473],[0.9971749782562256,0.2532519996166229],[0.8502749800682068,0.04671179875731468],[0.8818110227584839,0.053950000554323196],[0.8795949816703796,0.09061560034751892],[0.8502749800682068,0.04671179875731468],[0.8795949816703796,0.09061560034751892],[0.8502749800682068,0.1021990031003952],[0.9678109884262085,0.20364999771118164],[0.9425039887428284,0.1779090017080307],[0.9600340127944946,0.15279699862003326],[0.9678109884262085,0.20364999771118164],[0.9600340127944946,0.15279699862003326],[0.999638020992279,0.19781899452209473],[0.891838014125824,0.00349181005731225],[0.9082369804382324,0.02935680001974106],[0.8818110227584839,0.053950000554323196],[0.891838014125824,0.00349181005731225],[0.8818110227584839,0.053950000554323196],[0.8502749800682068,0.04671179875731468],[0.9434300065040588,0.212351992726326],[0.9309599995613098,0.19896200299263],[0.9425039887428284,0.1779090017080307],[0.9434300065040588,0.212351992726326],[0.9425039887428284,0.1779090017080307],[0.9678109884262085,0.20364999771118164],[0.9082369804382324,0.02935680001974106],[0.9188349843025208,0.050902001559734344],[0.9057819843292236,0.06372500211000443],[0.9082369804382324,0.02935680001974106],[0.9057819843292236,0.06372500211000443],[0.8818110227584839,0.053950000554323196],[0.9309599995613098,0.19896200299263],[0.9138669967651367,0.19871799647808075],[0.9073500037193298,0.17730699479579926],[0.9309599995613098,0.19896200299263],[0.9073500037193298,0.17730699479579926],[0.9425039887428284,0.1779090017080307],[0.943382978439331,0.030316300690174103],[0.9359210133552551,0.05141669884324074],[0.9188349843025208,0.050902001559734344],[0.943382978439331,0.030316300690174103],[0.9188349843025208,0.050902001559734344],[0.9082369804382324,0.02935680001974106],[0.9425039887428284,0.1779090017080307],[0.9073500037193298,0.17730699479579926],[0.8973699808120728,0.1466359943151474],[0.9425039887428284,0.1779090017080307],[0.8973699808120728,0.1466359943151474],[0.9600340127944946,0.15279699862003326],[0.9547140002250671,0.0001186439985758625],[0.943382978439331,0.030316300690174103],[0.9082369804382324,0.02935680001974106],[0.9547140002250671,0.0001186439985758625],[0.9082369804382324,0.02935680001974106],[0.891838014125824,0.00349181005731225],[0.9073500037193298,0.17730699479579926],[0.8783130049705505,0.19960500299930573],[0.8502749800682068,0.18901899456977844],[0.9073500037193298,0.17730699479579926],[0.8502749800682068,0.18901899456977844],[0.8973699808120728,0.1466359943151474],[0.9998810291290283,0.04454969987273216],[0.9714009761810303,0.05388059839606285],[0.943382978439331,0.030316300690174103],[0.9998810291290283,0.04454969987273216],[0.943382978439331,0.030316300690174103],[0.9547140002250671,0.0001186439985758625],[0.9138669967651367,0.19871799647808075],[0.8999720215797424,0.2097810059785843],[0.8783130049705505,0.19960500299930573],[0.9138669967651367,0.19871799647808075],[0.8783130049705505,0.19960500299930573],[0.9073500037193298,0.17730699479579926],[0.9714009761810303,0.05388059839606285],[0.9493110179901123,0.06308580189943314],[0.9359210133552551,0.05141669884324074],[0.9714009761810303,0.05388059839606285],[0.9359210133552551,0.05141669884324074],[0.943382978439331,0.030316300690174103],[0.8999720215797424,0.2097810059785843],[0.9002879858016968,0.22874000668525696],[0.8796039819717407,0.2369139939546585],[0.8999720215797424,0.2097810059785843],[0.8796039819717407,0.2369139939546585],[0.8783130049705505,0.19960500299930573],[0.9684550166130066,0.09109629690647125],[0.9481549859046936,0.08201219886541367],[0.9493110179901123,0.06308580189943314],[0.9684550166130066,0.09109629690647125],[0.9493110179901123,0.06308580189943314],[0.9714009761810303,0.05388059839606285],[0.8783130049705505,0.19960500299930573],[0.8796039819717407,0.2369139939546585],[0.8525819778442383,0.2522050142288208],[0.8783130049705505,0.19960500299930573],[0.8525819778442383,0.2522050142288208],[0.8502749800682068,0.18901899456977844],[0.9947720170021057,0.10757099837064743],[0.9684550166130066,0.09109629690647125],[0.9714009761810303,0.05388059839606285],[0.9947720170021057,0.10757099837064743],[0.9714009761810303,0.05388059839606285],[0.9998810291290283,0.04454969987273216],[0.8796039819717407,0.2369139939546585],[0.9044790267944336,0.2629309892654419],[0.8974609971046448,0.29306501150131226],[0.8796039819717407,0.2369139939546585],[0.8974609971046448,0.29306501150131226],[0.8525819778442383,0.2522050142288208],[0.9481239914894104,0.14639900624752045],[0.9424499869346619,0.11598300188779831],[0.9684550166130066,0.09109629690647125],[0.9481239914894104,0.14639900624752045],[0.9684550166130066,0.09109629690647125],[0.9947720170021057,0.10757099837064743],[0.9002879858016968,0.22874000668525696],[0.9118509888648987,0.24145999550819397],[0.9044790267944336,0.2629309892654419],[0.9002879858016968,0.22874000668525696],[0.9044790267944336,0.2629309892654419],[0.8796039819717407,0.2369139939546585],[0.9424499869346619,0.11598300188779831],[0.9360380172729492,0.09420619904994965],[0.9481549859046936,0.08201219886541367],[0.9424499869346619,0.11598300188779831],[0.9481549859046936,0.08201219886541367],[0.9684550166130066,0.09109629690647125],[0.9118509888648987,0.24145999550819397],[0.9301440119743347,0.24175000190734863],[0.9406329989433289,0.2644389867782593],[0.9118509888648987,0.24145999550819397],[0.9406329989433289,0.2644389867782593],[0.9044790267944336,0.2629309892654419],[0.9062640070915222,0.11588499695062637],[0.9177500009536743,0.09368360042572021],[0.9360380172729492,0.09420619904994965],[0.9062640070915222,0.11588499695062637],[0.9360380172729492,0.09420619904994965],[0.9424499869346619,0.11598300188779831],[0.9044790267944336,0.2629309892654419],[0.9406329989433289,0.2644389867782593],[0.9565039873123169,0.29306501150131226],[0.9044790267944336,0.2629309892654419],[0.9565039873123169,0.29306501150131226],[0.8974609971046448,0.29306501150131226],[0.8891379833221436,0.143777996301651],[0.9062640070915222,0.11588499695062637],[0.9424499869346619,0.11598300188779831],[0.8891379833221436,0.143777996301651],[0.9424499869346619,0.11598300188779831],[0.9481239914894104,0.14639900624752045],[0.9406329989433289,0.2644389867782593],[0.9683979749679565,0.2403780072927475],[0.9971749782562256,0.2532519996166229],[0.9406329989433289,0.2644389867782593],[0.9971749782562256,0.2532519996166229],[0.9565039873123169,0.29306501150131226],[0.8502749800682068,0.1021990031003952],[0.8795949816703796,0.09061560034751892],[0.9062640070915222,0.11588499695062637],[0.8502749800682068,0.1021990031003952],[0.9062640070915222,0.11588499695062637],[0.8891379833221436,0.143777996301651],[0.9301440119743347,0.24175000190734863],[0.9430879950523376,0.22913800179958344],[0.9683979749679565,0.2403780072927475],[0.9301440119743347,0.24175000190734863],[0.9683979749679565,0.2403780072927475],[0.9406329989433289,0.2644389867782593],[0.8795949816703796,0.09061560034751892],[0.9053789973258972,0.08050929754972458],[0.9177500009536743,0.09368360042572021],[0.8795949816703796,0.09061560034751892],[0.9177500009536743,0.09368360042572021],[0.9062640070915222,0.11588499695062637],[0.9430879950523376,0.22913800179958344],[0.9301440119743347,0.24175000190734863],[0.9283559918403625,0.2385520040988922],[0.9430879950523376,0.22913800179958344],[0.9283559918403625,0.2385520040988922],[0.9404360055923462,0.22801099717617035],[0.9196789860725403,0.09056810289621353],[0.9177500009536743,0.09368360042572021],[0.9053789973258972,0.08050929754972458],[0.9196789860725403,0.09056810289621353],[0.9053789973258972,0.08050929754972458],[0.9080780148506165,0.07950189709663391],[0.9301440119743347,0.24175000190734863],[0.9118509888648987,0.24145999550819397],[0.9132090210914612,0.23642399907112122],[0.9301440119743347,0.24175000190734863],[0.9132090210914612,0.23642399907112122],[0.9283559918403625,0.2385520040988922],[0.9349049925804138,0.08911450207233429],[0.9360380172729492,0.09420619904994965],[0.9177500009536743,0.09368360042572021],[0.9349049925804138,0.08911450207233429],[0.9177500009536743,0.09368360042572021],[0.9196789860725403,0.09056810289621353],[0.9118509888648987,0.24145999550819397],[0.9002879858016968,0.22874000668525696],[0.9047300219535828,0.22656799852848053],[0.9118509888648987,0.24145999550819397],[0.9047300219535828,0.22656799852848053],[0.9132090210914612,0.23642399907112122],[0.9438130259513855,0.0796445980668068],[0.9481549859046936,0.08201219886541367],[0.9360380172729492,0.09420619904994965],[0.9438130259513855,0.0796445980668068],[0.9360380172729492,0.09420619904994965],[0.9349049925804138,0.08911450207233429],[0.9002879858016968,0.22874000668525696],[0.8999720215797424,0.2097810059785843],[0.9057890176773071,0.21258799731731415],[0.9002879858016968,0.22874000668525696],[0.9057890176773071,0.21258799731731415],[0.9047300219535828,0.22656799852848053],[0.9433760046958923,0.06563150137662888],[0.9493110179901123,0.06308580189943314],[0.9481549859046936,0.08201219886541367],[0.9433760046958923,0.06563150137662888],[0.9481549859046936,0.08201219886541367],[0.9438130259513855,0.0796445980668068],[0.8999720215797424,0.2097810059785843],[0.9138669967651367,0.19871799647808075],[0.915120005607605,0.20348499715328217],[0.8999720215797424,0.2097810059785843],[0.915120005607605,0.20348499715328217],[0.9057890176773071,0.21258799731731415],[0.9344580173492432,0.05612339824438095],[0.9359210133552551,0.05141669884324074],[0.9493110179901123,0.06308580189943314],[0.9344580173492432,0.05612339824438095],[0.9493110179901123,0.06308580189943314],[0.9433760046958923,0.06563150137662888],[0.9138669967651367,0.19871799647808075],[0.9309599995613098,0.19896200299263],[0.9281269907951355,0.20330600440502167],[0.9138669967651367,0.19871799647808075],[0.9281269907951355,0.20330600440502167],[0.915120005607605,0.20348499715328217],[0.9214720129966736,0.05536679923534393],[0.9188349843025208,0.050902001559734344],[0.9359210133552551,0.05141669884324074],[0.9214720129966736,0.05536679923534393],[0.9359210133552551,0.05141669884324074],[0.9344580173492432,0.05612339824438095],[0.9309599995613098,0.19896200299263],[0.9434300065040588,0.212351992726326],[0.9398699998855591,0.2132119983434677],[0.9309599995613098,0.19896200299263],[0.9398699998855591,0.2132119983434677],[0.9281269907951355,0.20330600440502167],[0.9093000292778015,0.06474220007658005],[0.9057819843292236,0.06372500211000443],[0.9188349843025208,0.050902001559734344],[0.9093000292778015,0.06474220007658005],[0.9188349843025208,0.050902001559734344],[0.9214720129966736,0.05536679923534393],[0.9434300065040588,0.212351992726326],[0.9430879950523376,0.22913800179958344],[0.9404360055923462,0.22801099717617035],[0.9434300065040588,0.212351992726326],[0.9404360055923462,0.22801099717617035],[0.9398699998855591,0.2132119983434677],[0.9080780148506165,0.07950189709663391],[0.9053789973258972,0.08050929754972458],[0.9057819843292236,0.06372500211000443],[0.9080780148506165,0.07950189709663391],[0.9057819843292236,0.06372500211000443],[0.9093000292778015,0.06474220007658005],[0.9212539792060852,0.21959899365901947],[0.9398699998855591,0.2132119983434677],[0.9404360055923462,0.22801099717617035],[0.9080780148506165,0.07950189709663391],[0.9093000292778015,0.06474220007658005],[0.9276149868965149,0.07194910198450089],[0.9281269907951355,0.20330600440502167],[0.9398699998855591,0.2132119983434677],[0.9212539792060852,0.21959899365901947],[0.9276149868965149,0.07194910198450089],[0.9093000292778015,0.06474220007658005],[0.9214720129966736,0.05536679923534393],[0.9212539792060852,0.21959899365901947],[0.915120005607605,0.20348499715328217],[0.9281269907951355,0.20330600440502167],[0.9214720129966736,0.05536679923534393],[0.9344580173492432,0.05612339824438095],[0.9276149868965149,0.07194910198450089],[0.9212539792060852,0.21959899365901947],[0.9057890176773071,0.21258799731731415],[0.915120005607605,0.20348499715328217],[0.9344580173492432,0.05612339824438095],[0.9433760046958923,0.06563150137662888],[0.9276149868965149,0.07194910198450089],[0.9212539792060852,0.21959899365901947],[0.9047300219535828,0.22656799852848053],[0.9057890176773071,0.21258799731731415],[0.9433760046958923,0.06563150137662888],[0.9438130259513855,0.0796445980668068],[0.9276149868965149,0.07194910198450089],[0.9212539792060852,0.21959899365901947],[0.9132090210914612,0.23642399907112122],[0.9047300219535828,0.22656799852848053],[0.9438130259513855,0.0796445980668068],[0.9349049925804138,0.08911450207233429],[0.9276149868965149,0.07194910198450089],[0.9212539792060852,0.21959899365901947],[0.9283559918403625,0.2385520040988922],[0.9132090210914612,0.23642399907112122],[0.9349049925804138,0.08911450207233429],[0.9196789860725403,0.09056810289621353],[0.9276149868965149,0.07194910198450089],[0.9212539792060852,0.21959899365901947],[0.9404360055923462,0.22801099717617035],[0.9283559918403625,0.2385520040988922],[0.9196789860725403,0.09056810289621353],[0.9080780148506165,0.07950189709663391],[0.9276149868965149,0.07194910198450089],[0.3508090078830719,0.545527994632721],[0.3509970009326935,0.5461969971656799],[0.3497140109539032,0.5467270016670227],[0.3508090078830719,0.545527994632721],[0.3497140109539032,0.5467270016670227],[0.34952598810195923,0.5461440086364746],[0.3497140109539032,0.5467270016670227],[0.3483409881591797,0.547061026096344],[0.34809601306915283,0.5463820099830627],[0.3497140109539032,0.5467270016670227],[0.34809601306915283,0.5463820099830627],[0.34952598810195923,0.5461440086364746],[0.35161298513412476,0.5450369715690613],[0.3515250086784363,0.5459679961204529],[0.3509970009326935,0.5461969971656799],[0.35161298513412476,0.5450369715690613],[0.3509970009326935,0.5461969971656799],[0.3508090078830719,0.545527994632721],[0.3483409881591797,0.547061026096344],[0.34775200486183167,0.5471940040588379],[0.34710800647735596,0.5464370250701904],[0.3483409881591797,0.547061026096344],[0.34710800647735596,0.5464370250701904],[0.34809601306915283,0.5463820099830627],[0.3520300090312958,0.5449770092964172],[0.35235700011253357,0.546297013759613],[0.3515250086784363,0.5459679961204529],[0.3520300090312958,0.5449770092964172],[0.3515250086784363,0.5459679961204529],[0.35161298513412476,0.5450369715690613],[0.34775200486183167,0.5471940040588379],[0.34724101424217224,0.5480070114135742],[0.3467000126838684,0.5466390252113342],[0.34775200486183167,0.5471940040588379],[0.3467000126838684,0.5466390252113342],[0.34710800647735596,0.5464370250701904],[0.353861004114151,0.5449920296669006],[0.3535490036010742,0.5471169948577881],[0.35235700011253357,0.546297013759613],[0.353861004114151,0.5449920296669006],[0.35235700011253357,0.546297013759613],[0.3520300090312958,0.5449770092964172],[0.34724101424217224,0.5480070114135742],[0.3467620015144348,0.5495240092277527],[0.3450149893760681,0.5478379726409912],[0.34724101424217224,0.5480070114135742],[0.3450149893760681,0.5478379726409912],[0.3467000126838684,0.5466390252113342],[0.3596689999103546,0.5447310209274292],[0.3592680096626282,0.5505899786949158],[0.3535490036010742,0.5471169948577881],[0.3596689999103546,0.5447310209274292],[0.3535490036010742,0.5471169948577881],[0.353861004114151,0.5449920296669006],[0.3467620015144348,0.5495240092277527],[0.3444420099258423,0.5573070049285889],[0.33862799406051636,0.5522159934043884],[0.3467620015144348,0.5495240092277527],[0.33862799406051636,0.5522159934043884],[0.3450149893760681,0.5478379726409912],[0.3735930025577545,0.5433080196380615],[0.38182899355888367,0.5322489738464355],[0.39147698879241943,0.5381860136985779],[0.3735930025577545,0.5433080196380615],[0.39147698879241943,0.5381860136985779],[0.38619500398635864,0.5659180283546448],[0.22686900198459625,0.6307359933853149],[0.2696959972381592,0.5563740134239197],[0.31578001379966736,0.570044994354248],[0.22686900198459625,0.6307359933853149],[0.31578001379966736,0.570044994354248],[0.3554700016975403,0.6059100031852722],[0.38182899355888367,0.5322489738464355],[0.3870849907398224,0.5230849981307983],[0.39253899455070496,0.5229989886283875],[0.38182899355888367,0.5322489738464355],[0.39253899455070496,0.5229989886283875],[0.39147698879241943,0.5381860136985779],[0.17884700000286102,0.4965899884700775],[0.23137600719928741,0.5114849805831909],[0.2696959972381592,0.5563740134239197],[0.17884700000286102,0.4965899884700775],[0.2696959972381592,0.5563740134239197],[0.22686900198459625,0.6307359933853149],[0.3870849907398224,0.5230849981307983],[0.3886930048465729,0.5125229954719543],[0.39508700370788574,0.5156220197677612],[0.3870849907398224,0.5230849981307983],[0.39508700370788574,0.5156220197677612],[0.39253899455070496,0.5229989886283875],[0.19962799549102783,0.4103910028934479],[0.2610720098018646,0.447721004486084],[0.23137600719928741,0.5114849805831909],[0.19962799549102783,0.4103910028934479],[0.23137600719928741,0.5114849805831909],[0.17884700000286102,0.4965899884700775],[0.3886930048465729,0.5125229954719543],[0.3956950008869171,0.5079439878463745],[0.3989660143852234,0.5100499987602234],[0.3886930048465729,0.5125229954719543],[0.3989660143852234,0.5100499987602234],[0.39508700370788574,0.5156220197677612],[0.25557100772857666,0.35754600167274475],[0.2782120108604431,0.39221298694610596],[0.2610720098018646,0.447721004486084],[0.25557100772857666,0.35754600167274475],[0.2610720098018646,0.447721004486084],[0.19962799549102783,0.4103910028934479],[0.3956950008869171,0.5079439878463745],[0.39949101209640503,0.5054020285606384],[0.40230798721313477,0.5089809894561768],[0.3956950008869171,0.5079439878463745],[0.40230798721313477,0.5089809894561768],[0.3989660143852234,0.5100499987602234],[0.2796579897403717,0.32396799325942993],[0.3011769950389862,0.3637079894542694],[0.2782120108604431,0.39221298694610596],[0.2796579897403717,0.32396799325942993],[0.2782120108604431,0.39221298694610596],[0.25557100772857666,0.35754600167274475],[0.39949101209640503,0.5054020285606384],[0.4092330038547516,0.5003529787063599],[0.41399699449539185,0.5048869848251343],[0.39949101209640503,0.5054020285606384],[0.41399699449539185,0.5048869848251343],[0.40230798721313477,0.5089809894561768],[0.41127800941467285,0.28700199723243713],[0.37811601161956787,0.3384070098400116],[0.3011769950389862,0.3637079894542694],[0.41127800941467285,0.28700199723243713],[0.3011769950389862,0.3637079894542694],[0.2796579897403717,0.32396799325942993],[0.4092330038547516,0.5003529787063599],[0.416810005903244,0.4961380064487457],[0.419622004032135,0.5007690191268921],[0.4092330038547516,0.5003529787063599],[0.419622004032135,0.5007690191268921],[0.41399699449539185,0.5048869848251343],[0.45600199699401855,0.33740198612213135],[0.4277929961681366,0.36631500720977783],[0.37811601161956787,0.3384070098400116],[0.45600199699401855,0.33740198612213135],[0.37811601161956787,0.3384070098400116],[0.41127800941467285,0.28700199723243713],[0.416810005903244,0.4961380064487457],[0.42119699716567993,0.4940730035305023],[0.42440900206565857,0.4989619851112366],[0.416810005903244,0.4961380064487457],[0.42440900206565857,0.4989619851112366],[0.419622004032135,0.5007690191268921],[0.47720301151275635,0.3673439919948578],[0.44604599475860596,0.3825109899044037],[0.4277929961681366,0.36631500720977783],[0.47720301151275635,0.3673439919948578],[0.4277929961681366,0.36631500720977783],[0.45600199699401855,0.33740198612213135],[0.42119699716567993,0.4940730035305023],[0.44454601407051086,0.48162201046943665],[0.4494889974594116,0.5037760138511658],[0.42119699716567993,0.4940730035305023],[0.4494889974594116,0.5037760138511658],[0.42440900206565857,0.4989619851112366],[0.5334960222244263,0.4453119933605194],[0.4729999899864197,0.43860700726509094],[0.44604599475860596,0.3825109899044037],[0.5334960222244263,0.4453119933605194],[0.44604599475860596,0.3825109899044037],[0.47720301151275635,0.3673439919948578],[0.44454601407051086,0.48162201046943665],[0.46794599294662476,0.4679949879646301],[0.49528101086616516,0.5095450282096863],[0.44454601407051086,0.48162201046943665],[0.49528101086616516,0.5095450282096863],[0.4494889974594116,0.5037760138511658],[0.49528101086616516,0.5095450282096863],[0.46794599294662476,0.4679949879646301],[0.4729999899864197,0.43860700726509094],[0.49528101086616516,0.5095450282096863],[0.4729999899864197,0.43860700726509094],[0.5334960222244263,0.4453119933605194],[0.43731099367141724,0.5142229795455933],[0.4260070025920868,0.5109379887580872],[0.42440900206565857,0.4989619851112366],[0.43731099367141724,0.5142229795455933],[0.42440900206565857,0.4989619851112366],[0.4494889974594116,0.5037760138511658],[0.47720301151275635,0.3673439919948578],[0.6028169989585876,0.27751100063323975],[0.6191830039024353,0.4007740020751953],[0.47720301151275635,0.3673439919948578],[0.6191830039024353,0.4007740020751953],[0.5334960222244263,0.4453119933605194],[0.4260070025920868,0.5109379887580872],[0.4200829863548279,0.5109300017356873],[0.419622004032135,0.5007690191268921],[0.4260070025920868,0.5109379887580872],[0.419622004032135,0.5007690191268921],[0.42440900206565857,0.4989619851112366],[0.45600199699401855,0.33740198612213135],[0.5407950282096863,0.20525899529457092],[0.6028169989585876,0.27751100063323975],[0.45600199699401855,0.33740198612213135],[0.6028169989585876,0.27751100063323975],[0.47720301151275635,0.3673439919948578],[0.4132010042667389,0.5119100213050842],[0.41399699449539185,0.5048869848251343],[0.419622004032135,0.5007690191268921],[0.4132010042667389,0.5119100213050842],[0.419622004032135,0.5007690191268921],[0.4200829863548279,0.5109300017356873],[0.45600199699401855,0.33740198612213135],[0.41127800941467285,0.28700199723243713],[0.3950270116329193,0.14088299870491028],[0.45600199699401855,0.33740198612213135],[0.3950270116329193,0.14088299870491028],[0.5407950282096863,0.20525899529457092],[0.40392500162124634,0.5130050182342529],[0.40230798721313477,0.5089809894561768],[0.41399699449539185,0.5048869848251343],[0.40392500162124634,0.5130050182342529],[0.41399699449539185,0.5048869848251343],[0.4132010042667389,0.5119100213050842],[0.41127800941467285,0.28700199723243713],[0.2796579897403717,0.32396799325942993],[0.22409099340438843,0.26494100689888],[0.41127800941467285,0.28700199723243713],[0.22409099340438843,0.26494100689888],[0.3950270116329193,0.14088299870491028],[0.4005280137062073,0.5150949954986572],[0.3989660143852234,0.5100499987602234],[0.40230798721313477,0.5089809894561768],[0.4005280137062073,0.5150949954986572],[0.40230798721313477,0.5089809894561768],[0.40392500162124634,0.5130050182342529],[0.2796579897403717,0.32396799325942993],[0.25557100772857666,0.35754600167274475],[0.17820699512958527,0.33021700382232666],[0.2796579897403717,0.32396799325942993],[0.17820699512958527,0.33021700382232666],[0.22409099340438843,0.26494100689888],[0.39770200848579407,0.5195019841194153],[0.39508700370788574,0.5156220197677612],[0.3989660143852234,0.5100499987602234],[0.39770200848579407,0.5195019841194153],[0.3989660143852234,0.5100499987602234],[0.4005280137062073,0.5150949954986572],[0.25557100772857666,0.35754600167274475],[0.19962799549102783,0.4103910028934479],[0.12988699972629547,0.4158639907836914],[0.25557100772857666,0.35754600167274475],[0.12988699972629547,0.4158639907836914],[0.17820699512958527,0.33021700382232666],[0.3961380124092102,0.5294029712677002],[0.39253899455070496,0.5229989886283875],[0.39508700370788574,0.5156220197677612],[0.3961380124092102,0.5294029712677002],[0.39508700370788574,0.5156220197677612],[0.39770200848579407,0.5195019841194153],[0.19962799549102783,0.4103910028934479],[0.17884700000286102,0.4965899884700775],[0.14338600635528564,0.5847280025482178],[0.19962799549102783,0.4103910028934479],[0.14338600635528564,0.5847280025482178],[0.12988699972629547,0.4158639907836914],[0.3973110020160675,0.5385109782218933],[0.39147698879241943,0.5381860136985779],[0.39253899455070496,0.5229989886283875],[0.3973110020160675,0.5385109782218933],[0.39253899455070496,0.5229989886283875],[0.3961380124092102,0.5294029712677002],[0.17884700000286102,0.4965899884700775],[0.22686900198459625,0.6307359933853149],[0.22148799896240234,0.6878759860992432],[0.17884700000286102,0.4965899884700775],[0.22148799896240234,0.6878759860992432],[0.14338600635528564,0.5847280025482178],[0.41162601113319397,0.5530359745025635],[0.38619500398635864,0.5659180283546448],[0.39147698879241943,0.5381860136985779],[0.41162601113319397,0.5530359745025635],[0.39147698879241943,0.5381860136985779],[0.3973110020160675,0.5385109782218933],[0.22686900198459625,0.6307359933853149],[0.3554700016975403,0.6059100031852722],[0.4066910147666931,0.8111259937286377],[0.22686900198459625,0.6307359933853149],[0.4066910147666931,0.8111259937286377],[0.22148799896240234,0.6878759860992432],[0.41162601113319397,0.5530359745025635],[0.42218101024627686,0.5547249913215637],[0.4137830138206482,0.5997869968414307],[0.41162601113319397,0.5530359745025635],[0.4137830138206482,0.5997869968414307],[0.38619500398635864,0.5659180283546448],[0.4137830138206482,0.5997869968414307],[0.4821450114250183,0.7920939922332764],[0.4066910147666931,0.8111259937286377],[0.4137830138206482,0.5997869968414307],[0.4066910147666931,0.8111259937286377],[0.3554700016975403,0.6059100031852722],[0.43731099367141724,0.5142229795455933],[0.4494889974594116,0.5037760138511658],[0.49528101086616516,0.5095450282096863],[0.43731099367141724,0.5142229795455933],[0.49528101086616516,0.5095450282096863],[0.44630900025367737,0.5329049825668335],[0.49528101086616516,0.5095450282096863],[0.5334960222244263,0.4453119933605194],[0.6191830039024353,0.4007740020751953],[0.49528101086616516,0.5095450282096863],[0.6191830039024353,0.4007740020751953],[0.6317189931869507,0.5737450122833252],[0.44630900025367737,0.5329049825668335],[0.49528101086616516,0.5095450282096863],[0.47211700677871704,0.5793790221214294],[0.44630900025367737,0.5329049825668335],[0.47211700677871704,0.5793790221214294],[0.4363040030002594,0.5496469736099243],[0.47211700677871704,0.5793790221214294],[0.49528101086616516,0.5095450282096863],[0.6317189931869507,0.5737450122833252],[0.47211700677871704,0.5793790221214294],[0.6317189931869507,0.5737450122833252],[0.5622919797897339,0.705947995185852],[0.4137830138206482,0.5997869968414307],[0.42218101024627686,0.5547249913215637],[0.4363040030002594,0.5496469736099243],[0.4137830138206482,0.5997869968414307],[0.4363040030002594,0.5496469736099243],[0.47211700677871704,0.5793790221214294],[0.5622919797897339,0.705947995185852],[0.4821450114250183,0.7920939922332764],[0.4137830138206482,0.5997869968414307],[0.5622919797897339,0.705947995185852],[0.4137830138206482,0.5997869968414307],[0.47211700677871704,0.5793790221214294],[0.3505220115184784,0.5472170114517212],[0.3499239981174469,0.5473560094833374],[0.3497140109539032,0.5467270016670227],[0.3505220115184784,0.5472170114517212],[0.3497140109539032,0.5467270016670227],[0.3509970009326935,0.5461969971656799],[0.3497140109539032,0.5467270016670227],[0.3499239981174469,0.5473560094833374],[0.3493579924106598,0.5476099848747253],[0.3497140109539032,0.5467270016670227],[0.3493579924106598,0.5476099848747253],[0.3483409881591797,0.547061026096344],[0.35124701261520386,0.5473549962043762],[0.3505220115184784,0.5472170114517212],[0.3509970009326935,0.5461969971656799],[0.35124701261520386,0.5473549962043762],[0.3509970009326935,0.5461969971656799],[0.3515250086784363,0.5459679961204529],[0.3483409881591797,0.547061026096344],[0.3493579924106598,0.5476099848747253],[0.3488540053367615,0.5481780171394348],[0.3483409881591797,0.547061026096344],[0.3488540053367615,0.5481780171394348],[0.34775200486183167,0.5471940040588379],[0.3520340025424957,0.5487409830093384],[0.35124701261520386,0.5473549962043762],[0.3515250086784363,0.5459679961204529],[0.3520340025424957,0.5487409830093384],[0.3515250086784363,0.5459679961204529],[0.35235700011253357,0.546297013759613],[0.34775200486183167,0.5471940040588379],[0.3488540053367615,0.5481780171394348],[0.3491179943084717,0.5498110055923462],[0.34775200486183167,0.5471940040588379],[0.3491179943084717,0.5498110055923462],[0.34724101424217224,0.5480070114135742],[0.3592680096626282,0.5505899786949158],[0.35642799735069275,0.5552520155906677],[0.3524639904499054,0.5490099787712097],[0.3592680096626282,0.5505899786949158],[0.3524639904499054,0.5490099787712097],[0.3535490036010742,0.5471169948577881],[0.3489600121974945,0.5503209829330444],[0.35076001286506653,0.5580999851226807],[0.3444420099258423,0.5573070049285889],[0.3489600121974945,0.5503209829330444],[0.3444420099258423,0.5573070049285889],[0.3467620015144348,0.5495240092277527],[0.3520340025424957,0.5487409830093384],[0.35235700011253357,0.546297013759613],[0.3535490036010742,0.5471169948577881],[0.3520340025424957,0.5487409830093384],[0.3535490036010742,0.5471169948577881],[0.3524639904499054,0.5490099787712097],[0.3467620015144348,0.5495240092277527],[0.34724101424217224,0.5480070114135742],[0.3491179943084717,0.5498110055923462],[0.3467620015144348,0.5495240092277527],[0.3491179943084717,0.5498110055923462],[0.3489600121974945,0.5503209829330444],[0.3638409972190857,0.560791015625],[0.35728898644447327,0.563202977180481],[0.35382598638534546,0.5569329857826233],[0.3638409972190857,0.560791015625],[0.35382598638534546,0.5569329857826233],[0.35642799735069275,0.5552520155906677],[0.35382598638534546,0.5569329857826233],[0.35728898644447327,0.563202977180481],[0.35194098949432373,0.5688859820365906],[0.35382598638534546,0.5569329857826233],[0.35194098949432373,0.5688859820365906],[0.35076001286506653,0.5580999851226807],[0.3524639904499054,0.5490099787712097],[0.35642799735069275,0.5552520155906677],[0.35382598638534546,0.5569329857826233],[0.3524639904499054,0.5490099787712097],[0.35382598638534546,0.5569329857826233],[0.3509669899940491,0.5502600073814392],[0.35382598638534546,0.5569329857826233],[0.35076001286506653,0.5580999851226807],[0.3489600121974945,0.5503209829330444],[0.35382598638534546,0.5569329857826233],[0.3489600121974945,0.5503209829330444],[0.3509669899940491,0.5502600073814392],[0.35054299235343933,0.5491219758987427],[0.3520340025424957,0.5487409830093384],[0.3524639904499054,0.5490099787712097],[0.35054299235343933,0.5491219758987427],[0.3524639904499054,0.5490099787712097],[0.3509669899940491,0.5502600073814392],[0.3489600121974945,0.5503209829330444],[0.3491179943084717,0.5498110055923462],[0.35054299235343933,0.5491219758987427],[0.3489600121974945,0.5503209829330444],[0.35054299235343933,0.5491219758987427],[0.3509669899940491,0.5502600073814392],[0.3703700006008148,0.5611220002174377],[0.3688260018825531,0.5649330019950867],[0.3653559982776642,0.56352299451828],[0.3703700006008148,0.5611220002174377],[0.3653559982776642,0.56352299451828],[0.3638409972190857,0.560791015625],[0.3545379936695099,0.5716080069541931],[0.35530099272727966,0.5760719776153564],[0.3498469889163971,0.5772240161895752],[0.3545379936695099,0.5716080069541931],[0.3498469889163971,0.5772240161895752],[0.35194098949432373,0.5688859820365906],[0.37706199288368225,0.5667600035667419],[0.37303200364112854,0.5681139826774597],[0.3688260018825531,0.5649330019950867],[0.37706199288368225,0.5667600035667419],[0.3688260018825531,0.5649330019950867],[0.3703700006008148,0.5611220002174377],[0.35530099272727966,0.5760719776153564],[0.35866498947143555,0.5817509889602661],[0.3565939962863922,0.5877400040626526],[0.35530099272727966,0.5760719776153564],[0.3565939962863922,0.5877400040626526],[0.3498469889163971,0.5772240161895752],[0.37398698925971985,0.5812370181083679],[0.3724119961261749,0.5729339718818665],[0.37303200364112854,0.5681139826774597],[0.37398698925971985,0.5812370181083679],[0.37303200364112854,0.5681139826774597],[0.37706199288368225,0.5667600035667419],[0.35866498947143555,0.5817509889602661],[0.36429598927497864,0.5809890031814575],[0.37398698925971985,0.5812370181083679],[0.35866498947143555,0.5817509889602661],[0.37398698925971985,0.5812370181083679],[0.3565939962863922,0.5877400040626526],[0.367686003446579,0.5771769881248474],[0.3663879930973053,0.5746279954910278],[0.3724119961261749,0.5729339718818665],[0.367686003446579,0.5771769881248474],[0.3724119961261749,0.5729339718818665],[0.37398698925971985,0.5812370181083679],[0.36429598927497864,0.5809890031814575],[0.3663879930973053,0.5746279954910278],[0.367686003446579,0.5771769881248474],[0.36429598927497864,0.5809890031814575],[0.367686003446579,0.5771769881248474],[0.37398698925971985,0.5812370181083679],[0.35728898644447327,0.563202977180481],[0.3638409972190857,0.560791015625],[0.3653559982776642,0.56352299451828],[0.35728898644447327,0.563202977180481],[0.3653559982776642,0.56352299451828],[0.35876500606536865,0.5653799772262573],[0.3545379936695099,0.5716080069541931],[0.35194098949432373,0.5688859820365906],[0.35728898644447327,0.563202977180481],[0.3545379936695099,0.5716080069541931],[0.35728898644447327,0.563202977180481],[0.35876500606536865,0.5653799772262573],[0.35876500606536865,0.5653799772262573],[0.3653559982776642,0.56352299451828],[0.3656170070171356,0.5659589767456055],[0.35876500606536865,0.5653799772262573],[0.3656170070171356,0.5659589767456055],[0.3602980077266693,0.5674660205841064],[0.35722899436950684,0.5725849866867065],[0.3545379936695099,0.5716080069541931],[0.35876500606536865,0.5653799772262573],[0.35722899436950684,0.5725849866867065],[0.35876500606536865,0.5653799772262573],[0.3602980077266693,0.5674660205841064],[0.3663879930973053,0.5746279954910278],[0.364329993724823,0.5724409818649292],[0.36994099617004395,0.571382999420166],[0.3663879930973053,0.5746279954910278],[0.36994099617004395,0.571382999420166],[0.3724119961261749,0.5729339718818665],[0.36271101236343384,0.5782099962234497],[0.364329993724823,0.5724409818649292],[0.3663879930973053,0.5746279954910278],[0.36271101236343384,0.5782099962234497],[0.3663879930973053,0.5746279954910278],[0.36429598927497864,0.5809890031814575],[0.3724119961261749,0.5729339718818665],[0.36994099617004395,0.571382999420166],[0.3706890046596527,0.568668007850647],[0.3724119961261749,0.5729339718818665],[0.3706890046596527,0.568668007850647],[0.37303200364112854,0.5681139826774597],[0.35955899953842163,0.5788570046424866],[0.36271101236343384,0.5782099962234497],[0.36429598927497864,0.5809890031814575],[0.35955899953842163,0.5788570046424866],[0.36429598927497864,0.5809890031814575],[0.35866498947143555,0.5817509889602661],[0.37303200364112854,0.5681139826774597],[0.3706890046596527,0.568668007850647],[0.36792001128196716,0.5666249990463257],[0.37303200364112854,0.5681139826774597],[0.36792001128196716,0.5666249990463257],[0.3688260018825531,0.5649330019950867],[0.3575119972229004,0.5753009915351868],[0.35955899953842163,0.5788570046424866],[0.35866498947143555,0.5817509889602661],[0.3575119972229004,0.5753009915351868],[0.35866498947143555,0.5817509889602661],[0.35530099272727966,0.5760719776153564],[0.3688260018825531,0.5649330019950867],[0.36792001128196716,0.5666249990463257],[0.3656170070171356,0.5659589767456055],[0.3688260018825531,0.5649330019950867],[0.3656170070171356,0.5659589767456055],[0.3653559982776642,0.56352299451828],[0.35722899436950684,0.5725849866867065],[0.3575119972229004,0.5753009915351868],[0.35530099272727966,0.5760719776153564],[0.35722899436950684,0.5725849866867065],[0.35530099272727966,0.5760719776153564],[0.3545379936695099,0.5716080069541931],[0.364329993724823,0.5724409818649292],[0.36792001128196716,0.5666249990463257],[0.3706890046596527,0.568668007850647],[0.364329993724823,0.5724409818649292],[0.3706890046596527,0.568668007850647],[0.36994099617004395,0.571382999420166],[0.35955899953842163,0.5788570046424866],[0.3575119972229004,0.5753009915351868],[0.364329993724823,0.5724409818649292],[0.35955899953842163,0.5788570046424866],[0.364329993724823,0.5724409818649292],[0.36271101236343384,0.5782099962234497],[0.364329993724823,0.5724409818649292],[0.3602980077266693,0.5674660205841064],[0.3656170070171356,0.5659589767456055],[0.364329993724823,0.5724409818649292],[0.3656170070171356,0.5659589767456055],[0.36792001128196716,0.5666249990463257],[0.35722899436950684,0.5725849866867065],[0.3602980077266693,0.5674660205841064],[0.364329993724823,0.5724409818649292],[0.35722899436950684,0.5725849866867065],[0.364329993724823,0.5724409818649292],[0.3575119972229004,0.5753009915351868],[0.37398698925971985,0.5812370181083679],[0.37706199288368225,0.5667600035667419],[0.38619500398635864,0.5659180283546448],[0.37398698925971985,0.5812370181083679],[0.38619500398635864,0.5659180283546448],[0.4137830138206482,0.5997869968414307],[0.3554700016975403,0.6059100031852722],[0.3565939962863922,0.5877400040626526],[0.37398698925971985,0.5812370181083679],[0.3554700016975403,0.6059100031852722],[0.37398698925971985,0.5812370181083679],[0.4137830138206482,0.5997869968414307],[0.37706199288368225,0.5667600035667419],[0.3703700006008148,0.5611220002174377],[0.3708850145339966,0.5561180114746094],[0.37706199288368225,0.5667600035667419],[0.3708850145339966,0.5561180114746094],[0.38619500398635864,0.5659180283546448],[0.3420790135860443,0.5762649774551392],[0.3498469889163971,0.5772240161895752],[0.3565939962863922,0.5877400040626526],[0.3420790135860443,0.5762649774551392],[0.3565939962863922,0.5877400040626526],[0.3554700016975403,0.6059100031852722],[0.3703700006008148,0.5611220002174377],[0.3638409972190857,0.560791015625],[0.3655779957771301,0.5539140105247498],[0.3703700006008148,0.5611220002174377],[0.3655779957771301,0.5539140105247498],[0.3708850145339966,0.5561180114746094],[0.34281501173973083,0.5671120285987854],[0.35194098949432373,0.5688859820365906],[0.3498469889163971,0.5772240161895752],[0.34281501173973083,0.5671120285987854],[0.3498469889163971,0.5772240161895752],[0.3420790135860443,0.5762649774551392],[0.3638409972190857,0.560791015625],[0.35642799735069275,0.5552520155906677],[0.3592680096626282,0.5505899786949158],[0.3638409972190857,0.560791015625],[0.3592680096626282,0.5505899786949158],[0.3655779957771301,0.5539140105247498],[0.3444420099258423,0.5573070049285889],[0.35076001286506653,0.5580999851226807],[0.35194098949432373,0.5688859820365906],[0.3444420099258423,0.5573070049285889],[0.35194098949432373,0.5688859820365906],[0.34281501173973083,0.5671120285987854],[0.3596689999103546,0.5447310209274292],[0.3653779923915863,0.5440379977226257],[0.3655779957771301,0.5539140105247498],[0.3596689999103546,0.5447310209274292],[0.3655779957771301,0.5539140105247498],[0.3592680096626282,0.5505899786949158],[0.34281501173973083,0.5671120285987854],[0.33033499121665955,0.5576149821281433],[0.33862799406051636,0.5522159934043884],[0.34281501173973083,0.5671120285987854],[0.33862799406051636,0.5522159934043884],[0.3444420099258423,0.5573070049285889],[0.3653779923915863,0.5440379977226257],[0.3689599931240082,0.5437729954719543],[0.3708850145339966,0.5561180114746094],[0.3653779923915863,0.5440379977226257],[0.3708850145339966,0.5561180114746094],[0.3655779957771301,0.5539140105247498],[0.3420790135860443,0.5762649774551392],[0.3246619999408722,0.5623909831047058],[0.33033499121665955,0.5576149821281433],[0.3420790135860443,0.5762649774551392],[0.33033499121665955,0.5576149821281433],[0.34281501173973083,0.5671120285987854],[0.3735930025577545,0.5433080196380615],[0.38619500398635864,0.5659180283546448],[0.3708850145339966,0.5561180114746094],[0.3735930025577545,0.5433080196380615],[0.3708850145339966,0.5561180114746094],[0.3689599931240082,0.5437729954719543],[0.3420790135860443,0.5762649774551392],[0.3554700016975403,0.6059100031852722],[0.31578001379966736,0.570044994354248],[0.3420790135860443,0.5762649774551392],[0.31578001379966736,0.570044994354248],[0.3246619999408722,0.5623909831047058],[0.3520340025424957,0.5487409830093384],[0.35054299235343933,0.5491219758987427],[0.35048601031303406,0.5489659905433655],[0.3520340025424957,0.5487409830093384],[0.35048601031303406,0.5489659905433655],[0.3516550064086914,0.5485829710960388],[0.35048601031303406,0.5489659905433655],[0.35054299235343933,0.5491219758987427],[0.3491179943084717,0.5498110055923462],[0.35048601031303406,0.5489659905433655],[0.3491179943084717,0.5498110055923462],[0.3493190109729767,0.5494319796562195],[0.35124701261520386,0.5473549962043762],[0.3520340025424957,0.5487409830093384],[0.3516550064086914,0.5485829710960388],[0.35124701261520386,0.5473549962043762],[0.3516550064086914,0.5485829710960388],[0.3511269986629486,0.5476160049438477],[0.3493190109729767,0.5494319796562195],[0.3491179943084717,0.5498110055923462],[0.3488540053367615,0.5481780171394348],[0.3493190109729767,0.5494319796562195],[0.3488540053367615,0.5481780171394348],[0.34911900758743286,0.5483120083808899],[0.3505220115184784,0.5472170114517212],[0.35124701261520386,0.5473549962043762],[0.3511269986629486,0.5476160049438477],[0.3505220115184784,0.5472170114517212],[0.3511269986629486,0.5476160049438477],[0.35043299198150635,0.5474169850349426],[0.34911900758743286,0.5483120083808899],[0.3488540053367615,0.5481780171394348],[0.3493579924106598,0.5476099848747253],[0.34911900758743286,0.5483120083808899],[0.3493579924106598,0.5476099848747253],[0.34955400228500366,0.5477160215377808],[0.3499239981174469,0.5473560094833374],[0.3505220115184784,0.5472170114517212],[0.35043299198150635,0.5474169850349426],[0.3499239981174469,0.5473560094833374],[0.35043299198150635,0.5474169850349426],[0.3499700129032135,0.5474920272827148],[0.34955400228500366,0.5477160215377808],[0.3493579924106598,0.5476099848747253],[0.3499239981174469,0.5473560094833374],[0.34955400228500366,0.5477160215377808],[0.3499239981174469,0.5473560094833374],[0.3499700129032135,0.5474920272827148],[0.3499700129032135,0.5474920272827148],[0.35043299198150635,0.5474169850349426],[0.3504030108451843,0.5479040145874023],[0.3499700129032135,0.5474920272827148],[0.3504030108451843,0.5479040145874023],[0.35012099146842957,0.5479320287704468],[0.34988200664520264,0.5480849742889404],[0.34955400228500366,0.5477160215377808],[0.3499700129032135,0.5474920272827148],[0.34988200664520264,0.5480849742889404],[0.3499700129032135,0.5474920272827148],[0.35012099146842957,0.5479320287704468],[0.35043299198150635,0.5474169850349426],[0.3511269986629486,0.5476160049438477],[0.35073399543762207,0.5479549765586853],[0.35043299198150635,0.5474169850349426],[0.35073399543762207,0.5479549765586853],[0.3504030108451843,0.5479040145874023],[0.3496519923210144,0.548334002494812],[0.34911900758743286,0.5483120083808899],[0.34955400228500366,0.5477160215377808],[0.3496519923210144,0.548334002494812],[0.34955400228500366,0.5477160215377808],[0.34988200664520264,0.5480849742889404],[0.3511269986629486,0.5476160049438477],[0.3516550064086914,0.5485829710960388],[0.3509159982204437,0.5482590198516846],[0.3511269986629486,0.5476160049438477],[0.3509159982204437,0.5482590198516846],[0.35073399543762207,0.5479549765586853],[0.349700003862381,0.5486909747123718],[0.3493190109729767,0.5494319796562195],[0.34911900758743286,0.5483120083808899],[0.349700003862381,0.5486909747123718],[0.34911900758743286,0.5483120083808899],[0.3496519923210144,0.548334002494812],[0.3516550064086914,0.5485829710960388],[0.35048601031303406,0.5489659905433655],[0.3503020107746124,0.5484510064125061],[0.3516550064086914,0.5485829710960388],[0.3503020107746124,0.5484510064125061],[0.3509159982204437,0.5482590198516846],[0.3503020107746124,0.5484510064125061],[0.35048601031303406,0.5489659905433655],[0.3493190109729767,0.5494319796562195],[0.3503020107746124,0.5484510064125061],[0.3493190109729767,0.5494319796562195],[0.349700003862381,0.5486909747123718],[0.3503020107746124,0.5484510064125061],[0.35012099146842957,0.5479320287704468],[0.3504030108451843,0.5479040145874023],[0.3503020107746124,0.5484510064125061],[0.3504030108451843,0.5479040145874023],[0.3509159982204437,0.5482590198516846],[0.34988200664520264,0.5480849742889404],[0.35012099146842957,0.5479320287704468],[0.3503020107746124,0.5484510064125061],[0.34988200664520264,0.5480849742889404],[0.3503020107746124,0.5484510064125061],[0.349700003862381,0.5486909747123718],[0.3509159982204437,0.5482590198516846],[0.3504030108451843,0.5479040145874023],[0.35073399543762207,0.5479549765586853],[0.3496519923210144,0.548334002494812],[0.34988200664520264,0.5480849742889404],[0.349700003862381,0.5486909747123718],[0.4363040030002594,0.5496469736099243],[0.42218101024627686,0.5547249913215637],[0.4221409857273102,0.548225998878479],[0.4363040030002594,0.5496469736099243],[0.4221409857273102,0.548225998878479],[0.43091198801994324,0.5432429909706116],[0.520117998123169,0.8552899956703186],[0.4821450114250183,0.7920939922332764],[0.5622919797897339,0.705947995185852],[0.520117998123169,0.8552899956703186],[0.5622919797897339,0.705947995185852],[0.6396769881248474,0.760267972946167],[0.44630900025367737,0.5329049825668335],[0.4363040030002594,0.5496469736099243],[0.43091198801994324,0.5432429909706116],[0.44630900025367737,0.5329049825668335],[0.43091198801994324,0.5432429909706116],[0.4345160126686096,0.5318340063095093],[0.6396769881248474,0.760267972946167],[0.5622919797897339,0.705947995185852],[0.6317189931869507,0.5737450122833252],[0.6396769881248474,0.760267972946167],[0.6317189931869507,0.5737450122833252],[0.7398319840431213,0.5939729809761047],[0.43731099367141724,0.5142229795455933],[0.44630900025367737,0.5329049825668335],[0.4345160126686096,0.5318340063095093],[0.43731099367141724,0.5142229795455933],[0.4345160126686096,0.5318340063095093],[0.43151500821113586,0.5204060077667236],[0.7398319840431213,0.5939729809761047],[0.6317189931869507,0.5737450122833252],[0.6191830039024353,0.4007740020751953],[0.7398319840431213,0.5939729809761047],[0.6191830039024353,0.4007740020751953],[0.7458440065383911,0.3894580006599426],[0.42218101024627686,0.5547249913215637],[0.41162601113319397,0.5530359745025635],[0.41364699602127075,0.5468980073928833],[0.42218101024627686,0.5547249913215637],[0.41364699602127075,0.5468980073928833],[0.4221409857273102,0.548225998878479],[0.39615100622177124,0.8717179894447327],[0.4066910147666931,0.8111259937286377],[0.4821450114250183,0.7920939922332764],[0.39615100622177124,0.8717179894447327],[0.4821450114250183,0.7920939922332764],[0.520117998123169,0.8552899956703186],[0.41162601113319397,0.5530359745025635],[0.3973110020160675,0.5385109782218933],[0.4018450081348419,0.5369679927825928],[0.41162601113319397,0.5530359745025635],[0.4018450081348419,0.5369679927825928],[0.41364699602127075,0.5468980073928833],[0.1750209927558899,0.7536389827728271],[0.22148799896240234,0.6878759860992432],[0.4066910147666931,0.8111259937286377],[0.1750209927558899,0.7536389827728271],[0.4066910147666931,0.8111259937286377],[0.39615100622177124,0.8717179894447327],[0.3973110020160675,0.5385109782218933],[0.3961380124092102,0.5294029712677002],[0.3998759984970093,0.5294319987297058],[0.3973110020160675,0.5385109782218933],[0.3998759984970093,0.5294319987297058],[0.4018450081348419,0.5369679927825928],[0.06911519914865494,0.6205250024795532],[0.14338600635528564,0.5847280025482178],[0.22148799896240234,0.6878759860992432],[0.06911519914865494,0.6205250024795532],[0.22148799896240234,0.6878759860992432],[0.1750209927558899,0.7536389827728271],[0.3961380124092102,0.5294029712677002],[0.39770200848579407,0.5195019841194153],[0.39996200799942017,0.5212609767913818],[0.3961380124092102,0.5294029712677002],[0.39996200799942017,0.5212609767913818],[0.3998759984970093,0.5294319987297058],[0.06676740199327469,0.41812199354171753],[0.12988699972629547,0.4158639907836914],[0.14338600635528564,0.5847280025482178],[0.06676740199327469,0.41812199354171753],[0.14338600635528564,0.5847280025482178],[0.06911519914865494,0.6205250024795532],[0.39770200848579407,0.5195019841194153],[0.4005280137062073,0.5150949954986572],[0.40296000242233276,0.5172230005264282],[0.39770200848579407,0.5195019841194153],[0.40296000242233276,0.5172230005264282],[0.39996200799942017,0.5212609767913818],[0.11101499944925308,0.2762739956378937],[0.17820699512958527,0.33021700382232666],[0.12988699972629547,0.4158639907836914],[0.11101499944925308,0.2762739956378937],[0.12988699972629547,0.4158639907836914],[0.06676740199327469,0.41812199354171753],[0.4005280137062073,0.5150949954986572],[0.40392500162124634,0.5130050182342529],[0.40571001172065735,0.5149310231208801],[0.4005280137062073,0.5150949954986572],[0.40571001172065735,0.5149310231208801],[0.40296000242233276,0.5172230005264282],[0.1954980045557022,0.20416200160980225],[0.22409099340438843,0.26494100689888],[0.17820699512958527,0.33021700382232666],[0.1954980045557022,0.20416200160980225],[0.17820699512958527,0.33021700382232666],[0.11101499944925308,0.2762739956378937],[0.40392500162124634,0.5130050182342529],[0.4132010042667389,0.5119100213050842],[0.4136120080947876,0.5148969888687134],[0.40392500162124634,0.5130050182342529],[0.4136120080947876,0.5148969888687134],[0.40571001172065735,0.5149310231208801],[0.4006659984588623,0.05315859988331795],[0.3950270116329193,0.14088299870491028],[0.22409099340438843,0.26494100689888],[0.4006659984588623,0.05315859988331795],[0.22409099340438843,0.26494100689888],[0.1954980045557022,0.20416200160980225],[0.4132010042667389,0.5119100213050842],[0.4200829863548279,0.5109300017356873],[0.4194200038909912,0.514385998249054],[0.4132010042667389,0.5119100213050842],[0.4194200038909912,0.514385998249054],[0.4136120080947876,0.5148969888687134],[0.5820940136909485,0.12258599698543549],[0.5407950282096863,0.20525899529457092],[0.3950270116329193,0.14088299870491028],[0.5820940136909485,0.12258599698543549],[0.3950270116329193,0.14088299870491028],[0.4006659984588623,0.05315859988331795],[0.4200829863548279,0.5109300017356873],[0.4260070025920868,0.5109379887580872],[0.42460501194000244,0.5154420137405396],[0.4200829863548279,0.5109300017356873],[0.42460501194000244,0.5154420137405396],[0.4194200038909912,0.514385998249054],[0.68122398853302,0.22815300524234772],[0.6028169989585876,0.27751100063323975],[0.5407950282096863,0.20525899529457092],[0.68122398853302,0.22815300524234772],[0.5407950282096863,0.20525899529457092],[0.5820940136909485,0.12258599698543549],[0.4260070025920868,0.5109379887580872],[0.43731099367141724,0.5142229795455933],[0.43151500821113586,0.5204060077667236],[0.4260070025920868,0.5109379887580872],[0.43151500821113586,0.5204060077667236],[0.42460501194000244,0.5154420137405396],[0.7458440065383911,0.3894580006599426],[0.6191830039024353,0.4007740020751953],[0.6028169989585876,0.27751100063323975],[0.7458440065383911,0.3894580006599426],[0.6028169989585876,0.27751100063323975],[0.68122398853302,0.22815300524234772],[0.42460501194000244,0.5154420137405396],[0.43151500821113586,0.5204060077667236],[0.42738398909568787,0.5225239992141724],[0.42460501194000244,0.5154420137405396],[0.42738398909568787,0.5225239992141724],[0.4235619902610779,0.5174040198326111],[0.8500379920005798,0.358040988445282],[0.7458440065383911,0.3894580006599426],[0.68122398853302,0.22815300524234772],[0.8500379920005798,0.358040988445282],[0.68122398853302,0.22815300524234772],[0.7397140264511108,0.19324399530887604],[0.4194200038909912,0.514385998249054],[0.42460501194000244,0.5154420137405396],[0.4235619902610779,0.5174040198326111],[0.4194200038909912,0.514385998249054],[0.4235619902610779,0.5174040198326111],[0.41908198595046997,0.5161550045013428],[0.7397140264511108,0.19324399530887604],[0.68122398853302,0.22815300524234772],[0.5820940136909485,0.12258599698543549],[0.7397140264511108,0.19324399530887604],[0.5820940136909485,0.12258599698543549],[0.6121749877929688,0.0676627978682518],[0.4136120080947876,0.5148969888687134],[0.4194200038909912,0.514385998249054],[0.41908198595046997,0.5161550045013428],[0.4136120080947876,0.5148969888687134],[0.41908198595046997,0.5161550045013428],[0.41373100876808167,0.5161460041999817],[0.6121749877929688,0.0676627978682518],[0.5820940136909485,0.12258599698543549],[0.4006659984588623,0.05315859988331795],[0.6121749877929688,0.0676627978682518],[0.4006659984588623,0.05315859988331795],[0.4009160101413727,0.0001186439985758625],[0.40571001172065735,0.5149310231208801],[0.4136120080947876,0.5148969888687134],[0.41373100876808167,0.5161460041999817],[0.40571001172065735,0.5149310231208801],[0.41373100876808167,0.5161460041999817],[0.4067089855670929,0.5168160200119019],[0.4009160101413727,0.0001186439985758625],[0.4006659984588623,0.05315859988331795],[0.1954980045557022,0.20416200160980225],[0.4009160101413727,0.0001186439985758625],[0.1954980045557022,0.20416200160980225],[0.14538800716400146,0.13786600530147552],[0.40296000242233276,0.5172230005264282],[0.40571001172065735,0.5149310231208801],[0.4067089855670929,0.5168160200119019],[0.40296000242233276,0.5172230005264282],[0.4067089855670929,0.5168160200119019],[0.4040929973125458,0.5186949968338013],[0.14538800716400146,0.13786600530147552],[0.1954980045557022,0.20416200160980225],[0.11101499944925308,0.2762739956378937],[0.14538800716400146,0.13786600530147552],[0.11101499944925308,0.2762739956378937],[0.051533300429582596,0.2513119876384735],[0.39996200799942017,0.5212609767913818],[0.40296000242233276,0.5172230005264282],[0.4040929973125458,0.5186949968338013],[0.39996200799942017,0.5212609767913818],[0.4040929973125458,0.5186949968338013],[0.4018529951572418,0.5218430161476135],[0.051533300429582596,0.2513119876384735],[0.11101499944925308,0.2762739956378937],[0.06676740199327469,0.41812199354171753],[0.051533300429582596,0.2513119876384735],[0.06676740199327469,0.41812199354171753],[0.0001186439985758625,0.4015530049800873],[0.3998759984970093,0.5294319987297058],[0.39996200799942017,0.5212609767913818],[0.4018529951572418,0.5218430161476135],[0.3998759984970093,0.5294319987297058],[0.4018529951572418,0.5218430161476135],[0.40152299404144287,0.5292389988899231],[0.0001186439985758625,0.4015530049800873],[0.06676740199327469,0.41812199354171753],[0.06911519914865494,0.6205250024795532],[0.0001186439985758625,0.4015530049800873],[0.06911519914865494,0.6205250024795532],[0.027710499241948128,0.6384959816932678],[0.4018450081348419,0.5369679927825928],[0.3998759984970093,0.5294319987297058],[0.40152299404144287,0.5292389988899231],[0.4018450081348419,0.5369679927825928],[0.40152299404144287,0.5292389988899231],[0.40348300337791443,0.5354300141334534],[0.027710499241948128,0.6384959816932678],[0.06911519914865494,0.6205250024795532],[0.1750209927558899,0.7536389827728271],[0.027710499241948128,0.6384959816932678],[0.1750209927558899,0.7536389827728271],[0.13585300743579865,0.7851769924163818],[0.41364699602127075,0.5468980073928833],[0.4018450081348419,0.5369679927825928],[0.40348300337791443,0.5354300141334534],[0.41364699602127075,0.5468980073928833],[0.40348300337791443,0.5354300141334534],[0.4144259989261627,0.5435789823532104],[0.13585300743579865,0.7851769924163818],[0.1750209927558899,0.7536389827728271],[0.39615100622177124,0.8717179894447327],[0.13585300743579865,0.7851769924163818],[0.39615100622177124,0.8717179894447327],[0.37820500135421753,0.9333930015563965],[0.4221409857273102,0.548225998878479],[0.41364699602127075,0.5468980073928833],[0.4144259989261627,0.5435789823532104],[0.4221409857273102,0.548225998878479],[0.4144259989261627,0.5435789823532104],[0.42194199562072754,0.5433239936828613],[0.37820500135421753,0.9333930015563965],[0.39615100622177124,0.8717179894447327],[0.520117998123169,0.8552899956703186],[0.37820500135421753,0.9333930015563965],[0.520117998123169,0.8552899956703186],[0.5703880190849304,0.9333930015563965],[0.43151500821113586,0.5204060077667236],[0.4345160126686096,0.5318340063095093],[0.43036898970603943,0.5312190055847168],[0.43151500821113586,0.5204060077667236],[0.43036898970603943,0.5312190055847168],[0.42738398909568787,0.5225239992141724],[0.8231329917907715,0.6078180074691772],[0.7398319840431213,0.5939729809761047],[0.7458440065383911,0.3894580006599426],[0.8231329917907715,0.6078180074691772],[0.7458440065383911,0.3894580006599426],[0.8500379920005798,0.358040988445282],[0.4345160126686096,0.5318340063095093],[0.43091198801994324,0.5432429909706116],[0.427046000957489,0.5392789840698242],[0.4345160126686096,0.5318340063095093],[0.427046000957489,0.5392789840698242],[0.43036898970603943,0.5312190055847168],[0.7364699840545654,0.8297150135040283],[0.6396769881248474,0.760267972946167],[0.7398319840431213,0.5939729809761047],[0.7364699840545654,0.8297150135040283],[0.7398319840431213,0.5939729809761047],[0.8231329917907715,0.6078180074691772],[0.43091198801994324,0.5432429909706116],[0.4221409857273102,0.548225998878479],[0.42194199562072754,0.5433239936828613],[0.43091198801994324,0.5432429909706116],[0.42194199562072754,0.5433239936828613],[0.427046000957489,0.5392789840698242],[0.5703880190849304,0.9333930015563965],[0.520117998123169,0.8552899956703186],[0.6396769881248474,0.760267972946167],[0.5703880190849304,0.9333930015563965],[0.6396769881248474,0.760267972946167],[0.7364699840545654,0.8297150135040283],[0.46794599294662476,0.4679949879646301],[0.44454601407051086,0.48162201046943665],[0.42281201481819153,0.46692100167274475],[0.46794599294662476,0.4679949879646301],[0.42281201481819153,0.46692100167274475],[0.4296570122241974,0.45545798540115356],[0.4266200065612793,0.4356589913368225],[0.4729999899864197,0.43860700726509094],[0.46794599294662476,0.4679949879646301],[0.4266200065612793,0.4356589913368225],[0.46794599294662476,0.4679949879646301],[0.4296570122241974,0.45545798540115356],[0.44454601407051086,0.48162201046943665],[0.42119699716567993,0.4940730035305023],[0.41709500551223755,0.4892820119857788],[0.44454601407051086,0.48162201046943665],[0.41709500551223755,0.4892820119857788],[0.42281201481819153,0.46692100167274475],[0.42514100670814514,0.3950429856777191],[0.44604599475860596,0.3825109899044037],[0.4729999899864197,0.43860700726509094],[0.42514100670814514,0.3950429856777191],[0.4729999899864197,0.43860700726509094],[0.4266200065612793,0.4356589913368225],[0.42119699716567993,0.4940730035305023],[0.416810005903244,0.4961380064487457],[0.4133340120315552,0.49355700612068176],[0.42119699716567993,0.4940730035305023],[0.4133340120315552,0.49355700612068176],[0.41709500551223755,0.4892820119857788],[0.40920698642730713,0.3790319859981537],[0.4277929961681366,0.36631500720977783],[0.44604599475860596,0.3825109899044037],[0.40920698642730713,0.3790319859981537],[0.44604599475860596,0.3825109899044037],[0.42514100670814514,0.3950429856777191],[0.416810005903244,0.4961380064487457],[0.4092330038547516,0.5003529787063599],[0.4043799936771393,0.4946630001068115],[0.416810005903244,0.4961380064487457],[0.4043799936771393,0.4946630001068115],[0.4133340120315552,0.49355700612068176],[0.3686619997024536,0.38035300374031067],[0.37811601161956787,0.3384070098400116],[0.4277929961681366,0.36631500720977783],[0.3686619997024536,0.38035300374031067],[0.4277929961681366,0.36631500720977783],[0.40920698642730713,0.3790319859981537],[0.4092330038547516,0.5003529787063599],[0.39949101209640503,0.5054020285606384],[0.3956579864025116,0.501941978931427],[0.4092330038547516,0.5003529787063599],[0.3956579864025116,0.501941978931427],[0.4043799936771393,0.4946630001068115],[0.31690099835395813,0.39565199613571167],[0.3011769950389862,0.3637079894542694],[0.37811601161956787,0.3384070098400116],[0.31690099835395813,0.39565199613571167],[0.37811601161956787,0.3384070098400116],[0.3686619997024536,0.38035300374031067],[0.39949101209640503,0.5054020285606384],[0.3956950008869171,0.5079439878463745],[0.39267799258232117,0.5051980018615723],[0.39949101209640503,0.5054020285606384],[0.39267799258232117,0.5051980018615723],[0.3956579864025116,0.501941978931427],[0.2967909872531891,0.41033801436424255],[0.2782120108604431,0.39221298694610596],[0.3011769950389862,0.3637079894542694],[0.2967909872531891,0.41033801436424255],[0.3011769950389862,0.3637079894542694],[0.31690099835395813,0.39565199613571167],[0.3956950008869171,0.5079439878463745],[0.3886930048465729,0.5125229954719543],[0.38582199811935425,0.5112149715423584],[0.3956950008869171,0.5079439878463745],[0.38582199811935425,0.5112149715423584],[0.39267799258232117,0.5051980018615723],[0.2770169973373413,0.4562849998474121],[0.2610720098018646,0.447721004486084],[0.2782120108604431,0.39221298694610596],[0.2770169973373413,0.4562849998474121],[0.2782120108604431,0.39221298694610596],[0.2967909872531891,0.41033801436424255],[0.3886930048465729,0.5125229954719543],[0.3870849907398224,0.5230849981307983],[0.3819969892501831,0.5202289819717407],[0.3886930048465729,0.5125229954719543],[0.3819969892501831,0.5202289819717407],[0.38582199811935425,0.5112149715423584],[0.2656309902667999,0.5030379891395569],[0.23137600719928741,0.5114849805831909],[0.2610720098018646,0.447721004486084],[0.2656309902667999,0.5030379891395569],[0.2610720098018646,0.447721004486084],[0.2770169973373413,0.4562849998474121],[0.3870849907398224,0.5230849981307983],[0.38182899355888367,0.5322489738464355],[0.3789120018482208,0.5290250182151794],[0.3870849907398224,0.5230849981307983],[0.3789120018482208,0.5290250182151794],[0.3819969892501831,0.5202289819717407],[0.27722498774528503,0.5396419763565063],[0.2696959972381592,0.5563740134239197],[0.23137600719928741,0.5114849805831909],[0.27722498774528503,0.5396419763565063],[0.23137600719928741,0.5114849805831909],[0.2656309902667999,0.5030379891395569],[0.3472369909286499,0.5373769998550415],[0.34656599164009094,0.5333970189094543],[0.35615798830986023,0.5308200120925903],[0.3472369909286499,0.5373769998550415],[0.35615798830986023,0.5308200120925903],[0.35187798738479614,0.5371080040931702],[0.33501100540161133,0.5328689813613892],[0.34656599164009094,0.5333970189094543],[0.3472369909286499,0.5373769998550415],[0.33501100540161133,0.5328689813613892],[0.3472369909286499,0.5373769998550415],[0.34249699115753174,0.538873016834259],[0.3486180007457733,0.5430690050125122],[0.3472369909286499,0.5373769998550415],[0.35187798738479614,0.5371080040931702],[0.3486180007457733,0.5430690050125122],[0.35187798738479614,0.5371080040931702],[0.3504819869995117,0.5424550175666809],[0.34249699115753174,0.538873016834259],[0.3472369909286499,0.5373769998550415],[0.3486180007457733,0.5430690050125122],[0.34249699115753174,0.538873016834259],[0.3486180007457733,0.5430690050125122],[0.3466370105743408,0.5434809923171997],[0.3492409884929657,0.5452250242233276],[0.3486180007457733,0.5430690050125122],[0.3504819869995117,0.5424550175666809],[0.3492409884929657,0.5452250242233276],[0.3504819869995117,0.5424550175666809],[0.350492000579834,0.5446659922599792],[0.3466370105743408,0.5434809923171997],[0.3486180007457733,0.5430690050125122],[0.3492409884929657,0.5452250242233276],[0.3466370105743408,0.5434809923171997],[0.3492409884929657,0.5452250242233276],[0.3478649854660034,0.5454570055007935],[0.3508090078830719,0.545527994632721],[0.34952598810195923,0.5461440086364746],[0.3492409884929657,0.5452250242233276],[0.3508090078830719,0.545527994632721],[0.3492409884929657,0.5452250242233276],[0.350492000579834,0.5446659922599792],[0.3492409884929657,0.5452250242233276],[0.34952598810195923,0.5461440086364746],[0.34809601306915283,0.5463820099830627],[0.3492409884929657,0.5452250242233276],[0.34809601306915283,0.5463820099830627],[0.3478649854660034,0.5454570055007935],[0.35161298513412476,0.5450369715690613],[0.3508090078830719,0.545527994632721],[0.350492000579834,0.5446659922599792],[0.35161298513412476,0.5450369715690613],[0.350492000579834,0.5446659922599792],[0.35154101252555847,0.544409990310669],[0.3478649854660034,0.5454570055007935],[0.34809601306915283,0.5463820099830627],[0.34710800647735596,0.5464370250701904],[0.3478649854660034,0.5454570055007935],[0.34710800647735596,0.5464370250701904],[0.34679800271987915,0.5458379983901978],[0.3520300090312958,0.5449770092964172],[0.35161298513412476,0.5450369715690613],[0.35154101252555847,0.544409990310669],[0.3520300090312958,0.5449770092964172],[0.35154101252555847,0.544409990310669],[0.35257598757743835,0.5429199934005737],[0.34679800271987915,0.5458379983901978],[0.34710800647735596,0.5464370250701904],[0.3467000126838684,0.5466390252113342],[0.34679800271987915,0.5458379983901978],[0.3467000126838684,0.5466390252113342],[0.34494099020957947,0.545074999332428],[0.353861004114151,0.5449920296669006],[0.3520300090312958,0.5449770092964172],[0.35257598757743835,0.5429199934005737],[0.353861004114151,0.5449920296669006],[0.35257598757743835,0.5429199934005737],[0.3562699854373932,0.5388489961624146],[0.34494099020957947,0.545074999332428],[0.3467000126838684,0.5466390252113342],[0.3450149893760681,0.5478379726409912],[0.34494099020957947,0.545074999332428],[0.3450149893760681,0.5478379726409912],[0.3383199870586395,0.5429819822311401],[0.35257598757743835,0.5429199934005737],[0.3504819869995117,0.5424550175666809],[0.35187798738479614,0.5371080040931702],[0.35257598757743835,0.5429199934005737],[0.35187798738479614,0.5371080040931702],[0.3562699854373932,0.5388489961624146],[0.34249699115753174,0.538873016834259],[0.3466370105743408,0.5434809923171997],[0.34494099020957947,0.545074999332428],[0.34249699115753174,0.538873016834259],[0.34494099020957947,0.545074999332428],[0.3383199870586395,0.5429819822311401],[0.35257598757743835,0.5429199934005737],[0.35154101252555847,0.544409990310669],[0.350492000579834,0.5446659922599792],[0.35257598757743835,0.5429199934005737],[0.350492000579834,0.5446659922599792],[0.3504819869995117,0.5424550175666809],[0.3478649854660034,0.5454570055007935],[0.34679800271987915,0.5458379983901978],[0.34494099020957947,0.545074999332428],[0.3478649854660034,0.5454570055007935],[0.34494099020957947,0.545074999332428],[0.3466370105743408,0.5434809923171997],[0.36221298575401306,0.5371959805488586],[0.3562699854373932,0.5388489961624146],[0.35187798738479614,0.5371080040931702],[0.36221298575401306,0.5371959805488586],[0.35187798738479614,0.5371080040931702],[0.35615798830986023,0.5308200120925903],[0.34249699115753174,0.538873016834259],[0.3383199870586395,0.5429819822311401],[0.32877400517463684,0.5443390011787415],[0.34249699115753174,0.538873016834259],[0.32877400517463684,0.5443390011787415],[0.33501100540161133,0.5328689813613892],[0.3596689999103546,0.5447310209274292],[0.353861004114151,0.5449920296669006],[0.3562699854373932,0.5388489961624146],[0.3596689999103546,0.5447310209274292],[0.3562699854373932,0.5388489961624146],[0.36221298575401306,0.5371959805488586],[0.3383199870586395,0.5429819822311401],[0.3450149893760681,0.5478379726409912],[0.33862799406051636,0.5522159934043884],[0.3383199870586395,0.5429819822311401],[0.33862799406051636,0.5522159934043884],[0.32877400517463684,0.5443390011787415],[0.3653779923915863,0.5440379977226257],[0.3659990131855011,0.5370110273361206],[0.36932799220085144,0.538519024848938],[0.3653779923915863,0.5440379977226257],[0.36932799220085144,0.538519024848938],[0.3689599931240082,0.5437729954719543],[0.31703999638557434,0.5533679723739624],[0.32180899381637573,0.5464950203895569],[0.33033499121665955,0.5576149821281433],[0.31703999638557434,0.5533679723739624],[0.33033499121665955,0.5576149821281433],[0.3246619999408722,0.5623909831047058],[0.3596689999103546,0.5447310209274292],[0.36221298575401306,0.5371959805488586],[0.3659990131855011,0.5370110273361206],[0.3596689999103546,0.5447310209274292],[0.3659990131855011,0.5370110273361206],[0.3653779923915863,0.5440379977226257],[0.32180899381637573,0.5464950203895569],[0.32877400517463684,0.5443390011787415],[0.33862799406051636,0.5522159934043884],[0.32180899381637573,0.5464950203895569],[0.33862799406051636,0.5522159934043884],[0.33033499121665955,0.5576149821281433],[0.3735930025577545,0.5433080196380615],[0.3689599931240082,0.5437729954719543],[0.36932799220085144,0.538519024848938],[0.3735930025577545,0.5433080196380615],[0.36932799220085144,0.538519024848938],[0.37234601378440857,0.5396069884300232],[0.31703999638557434,0.5533679723739624],[0.3246619999408722,0.5623909831047058],[0.31578001379966736,0.570044994354248],[0.31703999638557434,0.5533679723739624],[0.31578001379966736,0.570044994354248],[0.3121129870414734,0.5599290132522583],[0.3735930025577545,0.5433080196380615],[0.37234601378440857,0.5396069884300232],[0.3789120018482208,0.5290250182151794],[0.3735930025577545,0.5433080196380615],[0.3789120018482208,0.5290250182151794],[0.38182899355888367,0.5322489738464355],[0.27722498774528503,0.5396419763565063],[0.3121129870414734,0.5599290132522583],[0.31578001379966736,0.570044994354248],[0.27722498774528503,0.5396419763565063],[0.31578001379966736,0.570044994354248],[0.2696959972381592,0.5563740134239197],[0.35405999422073364,0.4955730140209198],[0.359158992767334,0.49904200434684753],[0.35812199115753174,0.503242015838623],[0.35405999422073364,0.4955730140209198],[0.35812199115753174,0.503242015838623],[0.3518660068511963,0.50034099817276],[0.34442800283432007,0.4977889955043793],[0.34742501378059387,0.4933130145072937],[0.35405999422073364,0.4955730140209198],[0.34442800283432007,0.4977889955043793],[0.35405999422073364,0.4955730140209198],[0.3518660068511963,0.50034099817276],[0.3518660068511963,0.50034099817276],[0.35812199115753174,0.503242015838623],[0.3569839894771576,0.5104209780693054],[0.3518660068511963,0.50034099817276],[0.3569839894771576,0.5104209780693054],[0.34901100397109985,0.5084229707717896],[0.339942991733551,0.5061420202255249],[0.34442800283432007,0.4977889955043793],[0.3518660068511963,0.50034099817276],[0.339942991733551,0.5061420202255249],[0.3518660068511963,0.50034099817276],[0.34901100397109985,0.5084229707717896],[0.34901100397109985,0.5084229707717896],[0.3569839894771576,0.5104209780693054],[0.3563520014286041,0.5261489748954773],[0.34901100397109985,0.5084229707717896],[0.3563520014286041,0.5261489748954773],[0.3461570143699646,0.528889000415802],[0.33367300033569336,0.5265650153160095],[0.339942991733551,0.5061420202255249],[0.34901100397109985,0.5084229707717896],[0.33367300033569336,0.5265650153160095],[0.34901100397109985,0.5084229707717896],[0.3461570143699646,0.528889000415802],[0.3461570143699646,0.528889000415802],[0.3563520014286041,0.5261489748954773],[0.35615798830986023,0.5308200120925903],[0.3461570143699646,0.528889000415802],[0.35615798830986023,0.5308200120925903],[0.34656599164009094,0.5333970189094543],[0.33501100540161133,0.5328689813613892],[0.33367300033569336,0.5265650153160095],[0.3461570143699646,0.528889000415802],[0.33501100540161133,0.5328689813613892],[0.3461570143699646,0.528889000415802],[0.34656599164009094,0.5333970189094543],[0.36221298575401306,0.5371959805488586],[0.35615798830986023,0.5308200120925903],[0.3563520014286041,0.5261489748954773],[0.36221298575401306,0.5371959805488586],[0.3563520014286041,0.5261489748954773],[0.3659990131855011,0.5370110273361206],[0.33367300033569336,0.5265650153160095],[0.33501100540161133,0.5328689813613892],[0.32877400517463684,0.5443390011787415],[0.33367300033569336,0.5265650153160095],[0.32877400517463684,0.5443390011787415],[0.32180899381637573,0.5464950203895569],[0.38582199811935425,0.5112149715423584],[0.3819969892501831,0.5202289819717407],[0.3736700117588043,0.5109660029411316],[0.38582199811935425,0.5112149715423584],[0.3736700117588043,0.5109660029411316],[0.37756600975990295,0.5042110085487366],[0.3138290047645569,0.4890359938144684],[0.2656309902667999,0.5030379891395569],[0.2770169973373413,0.4562849998474121],[0.3138290047645569,0.4890359938144684],[0.2770169973373413,0.4562849998474121],[0.3211219906806946,0.47065600752830505],[0.35777801275253296,0.4892120063304901],[0.3633739948272705,0.4941909909248352],[0.359158992767334,0.49904200434684753],[0.35777801275253296,0.4892120063304901],[0.359158992767334,0.49904200434684753],[0.35405999422073364,0.4955730140209198],[0.34742501378059387,0.4933130145072937],[0.3497050106525421,0.4855569899082184],[0.35777801275253296,0.4892120063304901],[0.34742501378059387,0.4933130145072937],[0.35777801275253296,0.4892120063304901],[0.35405999422073364,0.4955730140209198],[0.3822619915008545,0.46622800827026367],[0.3834950029850006,0.4834659993648529],[0.37534099817276,0.4851369857788086],[0.3822619915008545,0.46622800827026367],[0.37534099817276,0.4851369857788086],[0.37033000588417053,0.4746530055999756],[0.35888099670410156,0.46693000197410583],[0.36382800340652466,0.454477995634079],[0.3822619915008545,0.46622800827026367],[0.35888099670410156,0.46693000197410583],[0.3822619915008545,0.46622800827026367],[0.37033000588417053,0.4746530055999756],[0.37033000588417053,0.4746530055999756],[0.37534099817276,0.4851369857788086],[0.36945998668670654,0.48778998851776123],[0.37033000588417053,0.4746530055999756],[0.36945998668670654,0.48778998851776123],[0.3622030019760132,0.48298099637031555],[0.35536301136016846,0.47523200511932373],[0.35888099670410156,0.46693000197410583],[0.37033000588417053,0.4746530055999756],[0.35536301136016846,0.47523200511932373],[0.37033000588417053,0.4746530055999756],[0.3622030019760132,0.48298099637031555],[0.3622030019760132,0.48298099637031555],[0.36945998668670654,0.48778998851776123],[0.3633739948272705,0.4941909909248352],[0.3622030019760132,0.48298099637031555],[0.3633739948272705,0.4941909909248352],[0.35777801275253296,0.4892120063304901],[0.3497050106525421,0.4855569899082184],[0.35536301136016846,0.47523200511932373],[0.3622030019760132,0.48298099637031555],[0.3497050106525421,0.4855569899082184],[0.3622030019760132,0.48298099637031555],[0.35777801275253296,0.4892120063304901],[0.3956579864025116,0.501941978931427],[0.39267799258232117,0.5051980018615723],[0.38895300030708313,0.5016639828681946],[0.3956579864025116,0.501941978931427],[0.38895300030708313,0.5016639828681946],[0.38906100392341614,0.49702298641204834],[0.31471800804138184,0.4281269907951355],[0.2967909872531891,0.41033801436424255],[0.31690099835395813,0.39565199613571167],[0.31471800804138184,0.4281269907951355],[0.31690099835395813,0.39565199613571167],[0.33367300033569336,0.4287729859352112],[0.38906100392341614,0.49702298641204834],[0.38895300030708313,0.5016639828681946],[0.38096800446510315,0.4969939887523651],[0.38906100392341614,0.49702298641204834],[0.38096800446510315,0.4969939887523651],[0.37996798753738403,0.49125900864601135],[0.33525800704956055,0.4564589858055115],[0.31471800804138184,0.4281269907951355],[0.33367300033569336,0.4287729859352112],[0.33525800704956055,0.4564589858055115],[0.33367300033569336,0.4287729859352112],[0.3485240042209625,0.45810601115226746],[0.37996798753738403,0.49125900864601135],[0.38096800446510315,0.4969939887523651],[0.3755829930305481,0.49512600898742676],[0.37996798753738403,0.49125900864601135],[0.3755829930305481,0.49512600898742676],[0.3739610016345978,0.4910629987716675],[0.341933012008667,0.46766000986099243],[0.33525800704956055,0.4564589858055115],[0.3485240042209625,0.45810601115226746],[0.341933012008667,0.46766000986099243],[0.3485240042209625,0.45810601115226746],[0.3496420085430145,0.4692539870738983],[0.3739610016345978,0.4910629987716675],[0.3755829930305481,0.49512600898742676],[0.3710159957408905,0.4959299862384796],[0.3739610016345978,0.4910629987716675],[0.3710159957408905,0.4959299862384796],[0.3694010078907013,0.4925439953804016],[0.34301599860191345,0.4760960042476654],[0.341933012008667,0.46766000986099243],[0.3496420085430145,0.4692539870738983],[0.34301599860191345,0.4760960042476654],[0.3496420085430145,0.4692539870738983],[0.34900200366973877,0.47689101099967957],[0.36783701181411743,0.499904990196228],[0.3653410077095032,0.49716100096702576],[0.3694010078907013,0.4925439953804016],[0.36783701181411743,0.499904990196228],[0.3694010078907013,0.4925439953804016],[0.3710159957408905,0.4959299862384796],[0.34900200366973877,0.47689101099967957],[0.34490299224853516,0.4850060045719147],[0.339462012052536,0.4837050139904022],[0.34900200366973877,0.47689101099967957],[0.339462012052536,0.4837050139904022],[0.34301599860191345,0.4760960042476654],[0.3633739948272705,0.4941909909248352],[0.36945998668670654,0.48778998851776123],[0.3694010078907013,0.4925439953804016],[0.3633739948272705,0.4941909909248352],[0.3694010078907013,0.4925439953804016],[0.3653410077095032,0.49716100096702576],[0.34900200366973877,0.47689101099967957],[0.35536301136016846,0.47523200511932373],[0.3497050106525421,0.4855569899082184],[0.34900200366973877,0.47689101099967957],[0.3497050106525421,0.4855569899082184],[0.34490299224853516,0.4850060045719147],[0.36945998668670654,0.48778998851776123],[0.37534099817276,0.4851369857788086],[0.3739610016345978,0.4910629987716675],[0.36945998668670654,0.48778998851776123],[0.3739610016345978,0.4910629987716675],[0.3694010078907013,0.4925439953804016],[0.3496420085430145,0.4692539870738983],[0.35888099670410156,0.46693000197410583],[0.35536301136016846,0.47523200511932373],[0.3496420085430145,0.4692539870738983],[0.35536301136016846,0.47523200511932373],[0.34900200366973877,0.47689101099967957],[0.37534099817276,0.4851369857788086],[0.3834950029850006,0.4834659993648529],[0.37996798753738403,0.49125900864601135],[0.37534099817276,0.4851369857788086],[0.37996798753738403,0.49125900864601135],[0.3739610016345978,0.4910629987716675],[0.3485240042209625,0.45810601115226746],[0.36382800340652466,0.454477995634079],[0.35888099670410156,0.46693000197410583],[0.3485240042209625,0.45810601115226746],[0.35888099670410156,0.46693000197410583],[0.3496420085430145,0.4692539870738983],[0.3834950029850006,0.4834659993648529],[0.39834699034690857,0.4904389977455139],[0.38906100392341614,0.49702298641204834],[0.3834950029850006,0.4834659993648529],[0.38906100392341614,0.49702298641204834],[0.37996798753738403,0.49125900864601135],[0.33367300033569336,0.4287729859352112],[0.3642660081386566,0.4062190055847168],[0.36382800340652466,0.454477995634079],[0.33367300033569336,0.4287729859352112],[0.36382800340652466,0.454477995634079],[0.3485240042209625,0.45810601115226746],[0.4043799936771393,0.4946630001068115],[0.3956579864025116,0.501941978931427],[0.38906100392341614,0.49702298641204834],[0.4043799936771393,0.4946630001068115],[0.38906100392341614,0.49702298641204834],[0.39834699034690857,0.4904389977455139],[0.33367300033569336,0.4287729859352112],[0.31690099835395813,0.39565199613571167],[0.3686619997024536,0.38035300374031067],[0.33367300033569336,0.4287729859352112],[0.3686619997024536,0.38035300374031067],[0.3642660081386566,0.4062190055847168],[0.4145149886608124,0.45468100905418396],[0.39834699034690857,0.4904389977455139],[0.3834950029850006,0.4834659993648529],[0.4145149886608124,0.45468100905418396],[0.3834950029850006,0.4834659993648529],[0.3822619915008545,0.46622800827026367],[0.36382800340652466,0.454477995634079],[0.3642660081386566,0.4062190055847168],[0.4145149886608124,0.45468100905418396],[0.36382800340652466,0.454477995634079],[0.4145149886608124,0.45468100905418396],[0.3822619915008545,0.46622800827026367],[0.42281201481819153,0.46692100167274475],[0.41709500551223755,0.4892820119857788],[0.4133340120315552,0.49355700612068176],[0.42281201481819153,0.46692100167274475],[0.4133340120315552,0.49355700612068176],[0.4043799936771393,0.4946630001068115],[0.40920698642730713,0.3790319859981537],[0.42514100670814514,0.3950429856777191],[0.4266200065612793,0.4356589913368225],[0.40920698642730713,0.3790319859981537],[0.4266200065612793,0.4356589913368225],[0.3686619997024536,0.38035300374031067],[0.42281201481819153,0.46692100167274475],[0.4043799936771393,0.4946630001068115],[0.39834699034690857,0.4904389977455139],[0.42281201481819153,0.46692100167274475],[0.39834699034690857,0.4904389977455139],[0.4145149886608124,0.45468100905418396],[0.3642660081386566,0.4062190055847168],[0.3686619997024536,0.38035300374031067],[0.4266200065612793,0.4356589913368225],[0.3642660081386566,0.4062190055847168],[0.4266200065612793,0.4356589913368225],[0.4145149886608124,0.45468100905418396],[0.4296570122241974,0.45545798540115356],[0.42281201481819153,0.46692100167274475],[0.4145149886608124,0.45468100905418396],[0.4145149886608124,0.45468100905418396],[0.4266200065612793,0.4356589913368225],[0.4296570122241974,0.45545798540115356],[0.39267799258232117,0.5051980018615723],[0.38582199811935425,0.5112149715423584],[0.37756600975990295,0.5042110085487366],[0.39267799258232117,0.5051980018615723],[0.37756600975990295,0.5042110085487366],[0.38895300030708313,0.5016639828681946],[0.3211219906806946,0.47065600752830505],[0.2770169973373413,0.4562849998474121],[0.2967909872531891,0.41033801436424255],[0.3211219906806946,0.47065600752830505],[0.2967909872531891,0.41033801436424255],[0.31471800804138184,0.4281269907951355],[0.37756600975990295,0.5042110085487366],[0.3760659992694855,0.5015209913253784],[0.38096800446510315,0.4969939887523651],[0.37756600975990295,0.5042110085487366],[0.38096800446510315,0.4969939887523651],[0.38895300030708313,0.5016639828681946],[0.33525800704956055,0.4564589858055115],[0.32861799001693726,0.47106701135635376],[0.3211219906806946,0.47065600752830505],[0.33525800704956055,0.4564589858055115],[0.3211219906806946,0.47065600752830505],[0.31471800804138184,0.4281269907951355],[0.3760659992694855,0.5015209913253784],[0.37244299054145813,0.5003299713134766],[0.3755829930305481,0.49512600898742676],[0.3760659992694855,0.5015209913253784],[0.3755829930305481,0.49512600898742676],[0.38096800446510315,0.4969939887523651],[0.341933012008667,0.46766000986099243],[0.3344759941101074,0.47676700353622437],[0.32861799001693726,0.47106701135635376],[0.341933012008667,0.46766000986099243],[0.32861799001693726,0.47106701135635376],[0.33525800704956055,0.4564589858055115],[0.36783701181411743,0.499904990196228],[0.3710159957408905,0.4959299862384796],[0.3755829930305481,0.49512600898742676],[0.36783701181411743,0.499904990196228],[0.3755829930305481,0.49512600898742676],[0.37244299054145813,0.5003299713134766],[0.341933012008667,0.46766000986099243],[0.34301599860191345,0.4760960042476654],[0.339462012052536,0.4837050139904022],[0.341933012008667,0.46766000986099243],[0.339462012052536,0.4837050139904022],[0.3344759941101074,0.47676700353622437],[0.3563520014286041,0.5261489748954773],[0.3569839894771576,0.5104209780693054],[0.361735999584198,0.5099729895591736],[0.3563520014286041,0.5261489748954773],[0.361735999584198,0.5099729895591736],[0.3668240010738373,0.5205230116844177],[0.33410701155662537,0.5020840167999268],[0.339942991733551,0.5061420202255249],[0.33367300033569336,0.5265650153160095],[0.33410701155662537,0.5020840167999268],[0.33367300033569336,0.5265650153160095],[0.31710898876190186,0.515205979347229],[0.3736700117588043,0.5109660029411316],[0.3668240010738373,0.5205230116844177],[0.361735999584198,0.5099729895591736],[0.3736700117588043,0.5109660029411316],[0.361735999584198,0.5099729895591736],[0.3660160005092621,0.5087869763374329],[0.33410701155662537,0.5020840167999268],[0.31710898876190186,0.515205979347229],[0.3138290047645569,0.4890359938144684],[0.33410701155662537,0.5020840167999268],[0.3138290047645569,0.4890359938144684],[0.3294770121574402,0.49637699127197266],[0.3819969892501831,0.5202289819717407],[0.3789120018482208,0.5290250182151794],[0.3668240010738373,0.5205230116844177],[0.3819969892501831,0.5202289819717407],[0.3668240010738373,0.5205230116844177],[0.3736700117588043,0.5109660029411316],[0.31710898876190186,0.515205979347229],[0.27722498774528503,0.5396419763565063],[0.2656309902667999,0.5030379891395569],[0.31710898876190186,0.515205979347229],[0.2656309902667999,0.5030379891395569],[0.3138290047645569,0.4890359938144684],[0.3789120018482208,0.5290250182151794],[0.36932799220085144,0.538519024848938],[0.3659990131855011,0.5370110273361206],[0.3789120018482208,0.5290250182151794],[0.3659990131855011,0.5370110273361206],[0.3668240010738373,0.5205230116844177],[0.32180899381637573,0.5464950203895569],[0.31703999638557434,0.5533679723739624],[0.27722498774528503,0.5396419763565063],[0.32180899381637573,0.5464950203895569],[0.27722498774528503,0.5396419763565063],[0.31710898876190186,0.515205979347229],[0.3659990131855011,0.5370110273361206],[0.3563520014286041,0.5261489748954773],[0.3668240010738373,0.5205230116844177],[0.31710898876190186,0.515205979347229],[0.33367300033569336,0.5265650153160095],[0.32180899381637573,0.5464950203895569],[0.3789120018482208,0.5290250182151794],[0.37234601378440857,0.5396069884300232],[0.36932799220085144,0.538519024848938],[0.31703999638557434,0.5533679723739624],[0.3121129870414734,0.5599290132522583],[0.27722498774528503,0.5396419763565063],[0.36783701181411743,0.499904990196228],[0.36480000615119934,0.5026500225067139],[0.3617919981479645,0.5011370182037354],[0.36783701181411743,0.499904990196228],[0.3617919981479645,0.5011370182037354],[0.3653410077095032,0.49716100096702576],[0.3431110084056854,0.4923419952392578],[0.33855101466178894,0.4904560148715973],[0.339462012052536,0.4837050139904022],[0.3431110084056854,0.4923419952392578],[0.339462012052536,0.4837050139904022],[0.34490299224853516,0.4850060045719147],[0.3633739948272705,0.4941909909248352],[0.3653410077095032,0.49716100096702576],[0.3617919981479645,0.5011370182037354],[0.3633739948272705,0.4941909909248352],[0.3617919981479645,0.5011370182037354],[0.359158992767334,0.49904200434684753],[0.3431110084056854,0.4923419952392578],[0.34490299224853516,0.4850060045719147],[0.3497050106525421,0.4855569899082184],[0.3431110084056854,0.4923419952392578],[0.3497050106525421,0.4855569899082184],[0.34742501378059387,0.4933130145072937],[0.3660160005092621,0.5087869763374329],[0.361735999584198,0.5099729895591736],[0.3617919981479645,0.5011370182037354],[0.3660160005092621,0.5087869763374329],[0.3617919981479645,0.5011370182037354],[0.36480000615119934,0.5026500225067139],[0.3431110084056854,0.4923419952392578],[0.33410701155662537,0.5020840167999268],[0.3294770121574402,0.49637699127197266],[0.3431110084056854,0.4923419952392578],[0.3294770121574402,0.49637699127197266],[0.33855101466178894,0.4904560148715973],[0.3569839894771576,0.5104209780693054],[0.35812199115753174,0.503242015838623],[0.3617919981479645,0.5011370182037354],[0.3569839894771576,0.5104209780693054],[0.3617919981479645,0.5011370182037354],[0.361735999584198,0.5099729895591736],[0.3431110084056854,0.4923419952392578],[0.34442800283432007,0.4977889955043793],[0.339942991733551,0.5061420202255249],[0.3431110084056854,0.4923419952392578],[0.339942991733551,0.5061420202255249],[0.33410701155662537,0.5020840167999268],[0.359158992767334,0.49904200434684753],[0.3617919981479645,0.5011370182037354],[0.35812199115753174,0.503242015838623],[0.34442800283432007,0.4977889955043793],[0.3431110084056854,0.4923419952392578],[0.34742501378059387,0.4933130145072937],[0.369581013917923,0.5015990138053894],[0.37022900581359863,0.5010709762573242],[0.3704240024089813,0.5014020204544067],[0.369581013917923,0.5015990138053894],[0.3704240024089813,0.5014020204544067],[0.36979201436042786,0.5016779899597168],[0.33477601408958435,0.4812859892845154],[0.33549800515174866,0.4812609851360321],[0.335330992937088,0.4828130006790161],[0.33477601408958435,0.4812859892845154],[0.335330992937088,0.4828130006790161],[0.334991991519928,0.4825670123100281],[0.369581013917923,0.5015990138053894],[0.36979201436042786,0.5016779899597168],[0.3693639934062958,0.5019810199737549],[0.369581013917923,0.5015990138053894],[0.3693639934062958,0.5019810199737549],[0.3692440092563629,0.5019440054893494],[0.3349759876728058,0.48354199528694153],[0.334991991519928,0.4825670123100281],[0.335330992937088,0.4828130006790161],[0.3349759876728058,0.48354199528694153],[0.335330992937088,0.4828130006790161],[0.3351590037345886,0.4836849868297577],[0.3692440092563629,0.5019440054893494],[0.3693639934062958,0.5019810199737549],[0.3692370057106018,0.5021790266036987],[0.3692440092563629,0.5019440054893494],[0.3692370057106018,0.5021790266036987],[0.369174987077713,0.5021179914474487],[0.3348099887371063,0.48394501209259033],[0.3349759876728058,0.48354199528694153],[0.3351590037345886,0.4836849868297577],[0.3348099887371063,0.48394501209259033],[0.3351590037345886,0.4836849868297577],[0.33496901392936707,0.4839729964733124],[0.369174987077713,0.5021179914474487],[0.3692370057106018,0.5021790266036987],[0.3690670132637024,0.5024669766426086],[0.369174987077713,0.5021179914474487],[0.3690670132637024,0.5024669766426086],[0.3689909875392914,0.5023549795150757],[0.33455801010131836,0.4845080077648163],[0.3348099887371063,0.48394501209259033],[0.33496901392936707,0.4839729964733124],[0.33455801010131836,0.4845080077648163],[0.33496901392936707,0.4839729964733124],[0.33480700850486755,0.48450198769569397],[0.3689909875392914,0.5023549795150757],[0.3690670132637024,0.5024669766426086],[0.3687810003757477,0.5031759738922119],[0.3689909875392914,0.5023549795150757],[0.3687810003757477,0.5031759738922119],[0.3685239851474762,0.5031089782714844],[0.3338159918785095,0.4857099950313568],[0.33455801010131836,0.4845080077648163],[0.33480700850486755,0.48450198769569397],[0.3338159918785095,0.4857099950313568],[0.33480700850486755,0.48450198769569397],[0.3341970145702362,0.4860079884529114],[0.3685239851474762,0.5031089782714844],[0.3687810003757477,0.5031759738922119],[0.36862000823020935,0.5049139857292175],[0.3685239851474762,0.5031089782714844],[0.36862000823020935,0.5049139857292175],[0.3679620027542114,0.5053319931030273],[0.33141300082206726,0.487978994846344],[0.3338159918785095,0.4857099950313568],[0.3341970145702362,0.4860079884529114],[0.33141300082206726,0.487978994846344],[0.3341970145702362,0.4860079884529114],[0.33160099387168884,0.4894149899482727],[0.3687810003757477,0.5031759738922119],[0.36904001235961914,0.5029850006103516],[0.36896800994873047,0.5042629837989807],[0.3687810003757477,0.5031759738922119],[0.36896800994873047,0.5042629837989807],[0.36862000823020935,0.5049139857292175],[0.3319689929485321,0.48669999837875366],[0.3338110148906708,0.4851189851760864],[0.3338159918785095,0.4857099950313568],[0.3319689929485321,0.48669999837875366],[0.3338159918785095,0.4857099950313568],[0.33141300082206726,0.487978994846344],[0.3690670132637024,0.5024669766426086],[0.3691540062427521,0.5024830102920532],[0.36904001235961914,0.5029850006103516],[0.3690670132637024,0.5024669766426086],[0.36904001235961914,0.5029850006103516],[0.3687810003757477,0.5031759738922119],[0.3338110148906708,0.4851189851760864],[0.3344399929046631,0.4843960106372833],[0.33455801010131836,0.4845080077648163],[0.3338110148906708,0.4851189851760864],[0.33455801010131836,0.4845080077648163],[0.3338159918785095,0.4857099950313568],[0.3692370057106018,0.5021790266036987],[0.36925798654556274,0.5022500157356262],[0.3691540062427521,0.5024830102920532],[0.3692370057106018,0.5021790266036987],[0.3691540062427521,0.5024830102920532],[0.3690670132637024,0.5024669766426086],[0.3344399929046631,0.4843960106372833],[0.3346799910068512,0.4839879870414734],[0.3348099887371063,0.48394501209259033],[0.3344399929046631,0.4843960106372833],[0.3348099887371063,0.48394501209259033],[0.33455801010131836,0.4845080077648163],[0.3693639934062958,0.5019810199737549],[0.3694019913673401,0.5021200180053711],[0.36925798654556274,0.5022500157356262],[0.3693639934062958,0.5019810199737549],[0.36925798654556274,0.5022500157356262],[0.3692370057106018,0.5021790266036987],[0.3346799910068512,0.4839879870414734],[0.33472299575805664,0.4836310148239136],[0.3349759876728058,0.48354199528694153],[0.3346799910068512,0.4839879870414734],[0.3349759876728058,0.48354199528694153],[0.3348099887371063,0.48394501209259033],[0.36979201436042786,0.5016779899597168],[0.36980000138282776,0.5020189881324768],[0.3694019913673401,0.5021200180053711],[0.36979201436042786,0.5016779899597168],[0.3694019913673401,0.5021200180053711],[0.3693639934062958,0.5019810199737549],[0.33472299575805664,0.4836310148239136],[0.3344550132751465,0.4829089939594269],[0.334991991519928,0.4825670123100281],[0.33472299575805664,0.4836310148239136],[0.334991991519928,0.4825670123100281],[0.3349759876728058,0.48354199528694153],[0.36979201436042786,0.5016779899597168],[0.3704240024089813,0.5014020204544067],[0.3703480064868927,0.5019980072975159],[0.36979201436042786,0.5016779899597168],[0.3703480064868927,0.5019980072975159],[0.36980000138282776,0.5020189881324768],[0.33390501141548157,0.48202699422836304],[0.33477601408958435,0.4812859892845154],[0.334991991519928,0.4825670123100281],[0.33390501141548157,0.48202699422836304],[0.334991991519928,0.4825670123100281],[0.3344550132751465,0.4829089939594269],[0.3736700117588043,0.5109660029411316],[0.3660160005092621,0.5087869763374329],[0.36983901262283325,0.5064539909362793],[0.3736700117588043,0.5109660029411316],[0.36983901262283325,0.5064539909362793],[0.37171998620033264,0.5079619884490967],[0.3275020122528076,0.4881109893321991],[0.3294770121574402,0.49637699127197266],[0.3138290047645569,0.4890359938144684],[0.3275020122528076,0.4881109893321991],[0.3138290047645569,0.4890359938144684],[0.32229599356651306,0.4872170090675354],[0.3660160005092621,0.5087869763374329],[0.3679620027542114,0.5053319931030273],[0.36862000823020935,0.5049139857292175],[0.3660160005092621,0.5087869763374329],[0.36862000823020935,0.5049139857292175],[0.36983901262283325,0.5064539909362793],[0.33141300082206726,0.487978994846344],[0.33160099387168884,0.4894149899482727],[0.3294770121574402,0.49637699127197266],[0.33141300082206726,0.487978994846344],[0.3294770121574402,0.49637699127197266],[0.3275020122528076,0.4881109893321991],[0.37756600975990295,0.5042110085487366],[0.3736700117588043,0.5109660029411316],[0.37171998620033264,0.5079619884490967],[0.37756600975990295,0.5042110085487366],[0.37171998620033264,0.5079619884490967],[0.3760659992694855,0.5015209913253784],[0.32229599356651306,0.4872170090675354],[0.3138290047645569,0.4890359938144684],[0.3211219906806946,0.47065600752830505],[0.32229599356651306,0.4872170090675354],[0.3211219906806946,0.47065600752830505],[0.32861799001693726,0.47106701135635376],[0.37244299054145813,0.5003299713134766],[0.3717910051345825,0.5016090273857117],[0.3704240024089813,0.5014020204544067],[0.37244299054145813,0.5003299713134766],[0.3704240024089813,0.5014020204544067],[0.37022900581359863,0.5010709762573242],[0.33477601408958435,0.4812859892845154],[0.3330079913139343,0.4792419970035553],[0.3344759941101074,0.47676700353622437],[0.33477601408958435,0.4812859892845154],[0.3344759941101074,0.47676700353622437],[0.33549800515174866,0.4812609851360321],[0.36862000823020935,0.5049139857292175],[0.36896800994873047,0.5042629837989807],[0.3696419894695282,0.5044029951095581],[0.36862000823020935,0.5049139857292175],[0.3696419894695282,0.5044029951095581],[0.36983901262283325,0.5064539909362793],[0.33095699548721313,0.485848993062973],[0.3319689929485321,0.48669999837875366],[0.33141300082206726,0.487978994846344],[0.33095699548721313,0.485848993062973],[0.33141300082206726,0.487978994846344],[0.3275020122528076,0.4881109893321991],[0.36990201473236084,0.5041970014572144],[0.3706839978694916,0.5056809782981873],[0.36983901262283325,0.5064539909362793],[0.36990201473236084,0.5041970014572144],[0.36983901262283325,0.5064539909362793],[0.3696419894695282,0.5044029951095581],[0.3275020122528076,0.4881109893321991],[0.3276340067386627,0.48579299449920654],[0.33096399903297424,0.48520201444625854],[0.3275020122528076,0.4881109893321991],[0.33096399903297424,0.48520201444625854],[0.33095699548721313,0.485848993062973],[0.37069499492645264,0.5041980147361755],[0.3706839978694916,0.5056809782981873],[0.36990201473236084,0.5041970014572144],[0.37069499492645264,0.5041980147361755],[0.36990201473236084,0.5041970014572144],[0.37024199962615967,0.5040240287780762],[0.33096399903297424,0.48520201444625854],[0.3276340067386627,0.48579299449920654],[0.33001700043678284,0.48396000266075134],[0.33096399903297424,0.48520201444625854],[0.33001700043678284,0.48396000266075134],[0.33083200454711914,0.4844689965248108],[0.3710080087184906,0.5032430291175842],[0.3721570074558258,0.5032539963722229],[0.3706839978694916,0.5056809782981873],[0.3710080087184906,0.5032430291175842],[0.3706839978694916,0.5056809782981873],[0.37069499492645264,0.5041980147361755],[0.3276340067386627,0.48579299449920654],[0.32979801297187805,0.48041900992393494],[0.3311769962310791,0.482340008020401],[0.3276340067386627,0.48579299449920654],[0.3311769962310791,0.482340008020401],[0.33001700043678284,0.48396000266075134],[0.3717910051345825,0.5016090273857117],[0.3721570074558258,0.5032539963722229],[0.3710080087184906,0.5032430291175842],[0.3717910051345825,0.5016090273857117],[0.3710080087184906,0.5032430291175842],[0.37088799476623535,0.5023990273475647],[0.3311769962310791,0.482340008020401],[0.32979801297187805,0.48041900992393494],[0.3330079913139343,0.4792419970035553],[0.3311769962310791,0.482340008020401],[0.3330079913139343,0.4792419970035553],[0.33268100023269653,0.4815880060195923],[0.3704240024089813,0.5014020204544067],[0.3717910051345825,0.5016090273857117],[0.37088799476623535,0.5023990273475647],[0.3704240024089813,0.5014020204544067],[0.37088799476623535,0.5023990273475647],[0.3703480064868927,0.5019980072975159],[0.33268100023269653,0.4815880060195923],[0.3330079913139343,0.4792419970035553],[0.33477601408958435,0.4812859892845154],[0.33268100023269653,0.4815880060195923],[0.33477601408958435,0.4812859892845154],[0.33390501141548157,0.48202699422836304],[0.3760659992694855,0.5015209913253784],[0.3721570074558258,0.5032539963722229],[0.3717910051345825,0.5016090273857117],[0.3760659992694855,0.5015209913253784],[0.3717910051345825,0.5016090273857117],[0.37244299054145813,0.5003299713134766],[0.3330079913139343,0.4792419970035553],[0.32979801297187805,0.48041900992393494],[0.32861799001693726,0.47106701135635376],[0.3330079913139343,0.4792419970035553],[0.32861799001693726,0.47106701135635376],[0.3344759941101074,0.47676700353622437],[0.3760659992694855,0.5015209913253784],[0.37171998620033264,0.5079619884490967],[0.3706839978694916,0.5056809782981873],[0.3760659992694855,0.5015209913253784],[0.3706839978694916,0.5056809782981873],[0.3721570074558258,0.5032539963722229],[0.3276340067386627,0.48579299449920654],[0.32229599356651306,0.4872170090675354],[0.32861799001693726,0.47106701135635376],[0.3276340067386627,0.48579299449920654],[0.32861799001693726,0.47106701135635376],[0.32979801297187805,0.48041900992393494],[0.37171998620033264,0.5079619884490967],[0.36983901262283325,0.5064539909362793],[0.3706839978694916,0.5056809782981873],[0.3276340067386627,0.48579299449920654],[0.3275020122528076,0.4881109893321991],[0.32229599356651306,0.4872170090675354],[0.3703480064868927,0.5019980072975159],[0.37088799476623535,0.5023990273475647],[0.3704879879951477,0.5026159882545471],[0.3703480064868927,0.5019980072975159],[0.3704879879951477,0.5026159882545471],[0.3701229989528656,0.5022370219230652],[0.3327710032463074,0.4824709892272949],[0.33268100023269653,0.4815880060195923],[0.33390501141548157,0.48202699422836304],[0.3327710032463074,0.4824709892272949],[0.33390501141548157,0.48202699422836304],[0.3337700068950653,0.4826360046863556],[0.37088799476623535,0.5023990273475647],[0.3710080087184906,0.5032430291175842],[0.3705570101737976,0.5031909942626953],[0.37088799476623535,0.5023990273475647],[0.3705570101737976,0.5031909942626953],[0.3704879879951477,0.5026159882545471],[0.33177900314331055,0.48300400376319885],[0.3311769962310791,0.482340008020401],[0.33268100023269653,0.4815880060195923],[0.33177900314331055,0.48300400376319885],[0.33268100023269653,0.4815880060195923],[0.3327710032463074,0.4824709892272949],[0.3710080087184906,0.5032430291175842],[0.37069499492645264,0.5041980147361755],[0.37049800157546997,0.5038480162620544],[0.3710080087184906,0.5032430291175842],[0.37049800157546997,0.5038480162620544],[0.3705570101737976,0.5031909942626953],[0.33080801367759705,0.48385998606681824],[0.33001700043678284,0.48396000266075134],[0.3311769962310791,0.482340008020401],[0.33080801367759705,0.48385998606681824],[0.3311769962310791,0.482340008020401],[0.33177900314331055,0.48300400376319885],[0.37069499492645264,0.5041980147361755],[0.37024199962615967,0.5040240287780762],[0.3701480031013489,0.5037400126457214],[0.37069499492645264,0.5041980147361755],[0.3701480031013489,0.5037400126457214],[0.37049800157546997,0.5038480162620544],[0.331385999917984,0.484281986951828],[0.33083200454711914,0.4844689965248108],[0.33001700043678284,0.48396000266075134],[0.331385999917984,0.484281986951828],[0.33001700043678284,0.48396000266075134],[0.33080801367759705,0.48385998606681824],[0.37024199962615967,0.5040240287780762],[0.36990201473236084,0.5041970014572144],[0.36972901225090027,0.503944993019104],[0.37024199962615967,0.5040240287780762],[0.36972901225090027,0.503944993019104],[0.3701480031013489,0.5037400126457214],[0.3315579891204834,0.48517200350761414],[0.33096399903297424,0.48520201444625854],[0.33083200454711914,0.4844689965248108],[0.3315579891204834,0.48517200350761414],[0.33083200454711914,0.4844689965248108],[0.331385999917984,0.484281986951828],[0.36990201473236084,0.5041970014572144],[0.3696419894695282,0.5044029951095581],[0.36966100335121155,0.5041519999504089],[0.36990201473236084,0.5041970014572144],[0.36966100335121155,0.5041519999504089],[0.36972901225090027,0.503944993019104],[0.3313220143318176,0.48552098870277405],[0.33095699548721313,0.485848993062973],[0.33096399903297424,0.48520201444625854],[0.3313220143318176,0.48552098870277405],[0.33096399903297424,0.48520201444625854],[0.3315579891204834,0.48517200350761414],[0.3696419894695282,0.5044029951095581],[0.36896800994873047,0.5042629837989807],[0.36922600865364075,0.5040410161018372],[0.3696419894695282,0.5044029951095581],[0.36922600865364075,0.5040410161018372],[0.36966100335121155,0.5041519999504089],[0.33200201392173767,0.486052006483078],[0.3319689929485321,0.48669999837875366],[0.33095699548721313,0.485848993062973],[0.33200201392173767,0.486052006483078],[0.33095699548721313,0.485848993062973],[0.3313220143318176,0.48552098870277405],[0.36980000138282776,0.5020189881324768],[0.3703480064868927,0.5019980072975159],[0.3701229989528656,0.5022370219230652],[0.36980000138282776,0.5020189881324768],[0.3701229989528656,0.5022370219230652],[0.3696880042552948,0.5021520256996155],[0.3337700068950653,0.4826360046863556],[0.33390501141548157,0.48202699422836304],[0.3344550132751465,0.4829089939594269],[0.3337700068950653,0.4826360046863556],[0.3344550132751465,0.4829089939594269],[0.3343699872493744,0.4832240045070648],[0.3694019913673401,0.5021200180053711],[0.36980000138282776,0.5020189881324768],[0.3696880042552948,0.5021520256996155],[0.3694019913673401,0.5021200180053711],[0.3696880042552948,0.5021520256996155],[0.369392991065979,0.5021989941596985],[0.3343699872493744,0.4832240045070648],[0.3344550132751465,0.4829089939594269],[0.33472299575805664,0.4836310148239136],[0.3343699872493744,0.4832240045070648],[0.33472299575805664,0.4836310148239136],[0.33461400866508484,0.48372799158096313],[0.36925798654556274,0.5022500157356262],[0.3694019913673401,0.5021200180053711],[0.369392991065979,0.5021989941596985],[0.36925798654556274,0.5022500157356262],[0.369392991065979,0.5021989941596985],[0.3693139851093292,0.5023030042648315],[0.33461400866508484,0.48372799158096313],[0.33472299575805664,0.4836310148239136],[0.3346799910068512,0.4839879870414734],[0.33461400866508484,0.48372799158096313],[0.3346799910068512,0.4839879870414734],[0.3345400094985962,0.48396098613739014],[0.3691540062427521,0.5024830102920532],[0.36925798654556274,0.5022500157356262],[0.3693139851093292,0.5023030042648315],[0.3691540062427521,0.5024830102920532],[0.3693139851093292,0.5023030042648315],[0.3692319989204407,0.5024710297584534],[0.3345400094985962,0.48396098613739014],[0.3346799910068512,0.4839879870414734],[0.3344399929046631,0.4843960106372833],[0.3345400094985962,0.48396098613739014],[0.3344399929046631,0.4843960106372833],[0.33437299728393555,0.484266996383667],[0.36904001235961914,0.5029850006103516],[0.3691540062427521,0.5024830102920532],[0.3692319989204407,0.5024710297584534],[0.36904001235961914,0.5029850006103516],[0.3692319989204407,0.5024710297584534],[0.3691839873790741,0.5028610229492188],[0.33437299728393555,0.484266996383667],[0.3344399929046631,0.4843960106372833],[0.3338110148906708,0.4851189851760864],[0.33437299728393555,0.484266996383667],[0.3338110148906708,0.4851189851760864],[0.33383598923683167,0.4847649931907654],[0.36896800994873047,0.5042629837989807],[0.36904001235961914,0.5029850006103516],[0.3691839873790741,0.5028610229492188],[0.36896800994873047,0.5042629837989807],[0.3691839873790741,0.5028610229492188],[0.36922600865364075,0.5040410161018372],[0.33383598923683167,0.4847649931907654],[0.3338110148906708,0.4851189851760864],[0.3319689929485321,0.48669999837875366],[0.33383598923683167,0.4847649931907654],[0.3319689929485321,0.48669999837875366],[0.33200201392173767,0.486052006483078],[0.3701480031013489,0.5037400126457214],[0.36972901225090027,0.503944993019104],[0.36961299180984497,0.5033079981803894],[0.3701480031013489,0.5037400126457214],[0.36961299180984497,0.5033079981803894],[0.3700140118598938,0.5033100247383118],[0.33267098665237427,0.4846169948577881],[0.3315579891204834,0.48517200350761414],[0.331385999917984,0.484281986951828],[0.33267098665237427,0.4846169948577881],[0.331385999917984,0.484281986951828],[0.3322109878063202,0.4839969873428345],[0.3700140118598938,0.5033100247383118],[0.36961299180984497,0.5033079981803894],[0.36963599920272827,0.5028259754180908],[0.3700140118598938,0.5033100247383118],[0.36963599920272827,0.5028259754180908],[0.369922012090683,0.5027869939804077],[0.33338800072669983,0.4840390086174011],[0.33267098665237427,0.4846169948577881],[0.3322109878063202,0.4839969873428345],[0.33338800072669983,0.4840390086174011],[0.3322109878063202,0.4839969873428345],[0.3331280052661896,0.4835529923439026],[0.369922012090683,0.5027869939804077],[0.36963599920272827,0.5028259754180908],[0.36963000893592834,0.5025500059127808],[0.369922012090683,0.5027869939804077],[0.36963000893592834,0.5025500059127808],[0.3697960078716278,0.5024470090866089],[0.3338179886341095,0.4837439954280853],[0.33338800072669983,0.4840390086174011],[0.3331280052661896,0.4835529923439026],[0.3338179886341095,0.4837439954280853],[0.3331280052661896,0.4835529923439026],[0.3337950110435486,0.48337501287460327],[0.3697960078716278,0.5024470090866089],[0.36963000893592834,0.5025500059127808],[0.36952999234199524,0.5024269819259644],[0.3697960078716278,0.5024470090866089],[0.36952999234199524,0.5024269819259644],[0.3696030080318451,0.5023180246353149],[0.33411601185798645,0.48376399278640747],[0.3338179886341095,0.4837439954280853],[0.3337950110435486,0.48337501287460327],[0.33411601185798645,0.48376399278640747],[0.3337950110435486,0.48337501287460327],[0.3342050015926361,0.4835340082645416],[0.3696880042552948,0.5021520256996155],[0.3701229989528656,0.5022370219230652],[0.3697960078716278,0.5024470090866089],[0.3696880042552948,0.5021520256996155],[0.3697960078716278,0.5024470090866089],[0.3696030080318451,0.5023180246353149],[0.3337950110435486,0.48337501287460327],[0.3337700068950653,0.4826360046863556],[0.3343699872493744,0.4832240045070648],[0.3337950110435486,0.48337501287460327],[0.3343699872493744,0.4832240045070648],[0.3342050015926361,0.4835340082645416],[0.3704879879951477,0.5026159882545471],[0.369922012090683,0.5027869939804077],[0.3697960078716278,0.5024470090866089],[0.3704879879951477,0.5026159882545471],[0.3697960078716278,0.5024470090866089],[0.3701229989528656,0.5022370219230652],[0.3337950110435486,0.48337501287460327],[0.3331280052661896,0.4835529923439026],[0.3327710032463074,0.4824709892272949],[0.3337950110435486,0.48337501287460327],[0.3327710032463074,0.4824709892272949],[0.3337700068950653,0.4826360046863556],[0.3704879879951477,0.5026159882545471],[0.3705570101737976,0.5031909942626953],[0.3700140118598938,0.5033100247383118],[0.3704879879951477,0.5026159882545471],[0.3700140118598938,0.5033100247383118],[0.369922012090683,0.5027869939804077],[0.3322109878063202,0.4839969873428345],[0.33177900314331055,0.48300400376319885],[0.3327710032463074,0.4824709892272949],[0.3322109878063202,0.4839969873428345],[0.3327710032463074,0.4824709892272949],[0.3331280052661896,0.4835529923439026],[0.3701480031013489,0.5037400126457214],[0.3700140118598938,0.5033100247383118],[0.3705570101737976,0.5031909942626953],[0.3701480031013489,0.5037400126457214],[0.3705570101737976,0.5031909942626953],[0.37049800157546997,0.5038480162620544],[0.33177900314331055,0.48300400376319885],[0.3322109878063202,0.4839969873428345],[0.331385999917984,0.484281986951828],[0.33177900314331055,0.48300400376319885],[0.331385999917984,0.484281986951828],[0.33080801367759705,0.48385998606681824],[0.36972901225090027,0.503944993019104],[0.36966100335121155,0.5041519999504089],[0.36922600865364075,0.5040410161018372],[0.36972901225090027,0.503944993019104],[0.36922600865364075,0.5040410161018372],[0.36961299180984497,0.5033079981803894],[0.3315579891204834,0.48517200350761414],[0.33267098665237427,0.4846169948577881],[0.33200201392173767,0.486052006483078],[0.3315579891204834,0.48517200350761414],[0.33200201392173767,0.486052006483078],[0.3313220143318176,0.48552098870277405],[0.36961299180984497,0.5033079981803894],[0.36922600865364075,0.5040410161018372],[0.3691839873790741,0.5028610229492188],[0.36961299180984497,0.5033079981803894],[0.3691839873790741,0.5028610229492188],[0.36963599920272827,0.5028259754180908],[0.33267098665237427,0.4846169948577881],[0.33338800072669983,0.4840390086174011],[0.33383598923683167,0.4847649931907654],[0.33267098665237427,0.4846169948577881],[0.33383598923683167,0.4847649931907654],[0.33200201392173767,0.486052006483078],[0.3692319989204407,0.5024710297584534],[0.36963000893592834,0.5025500059127808],[0.36963599920272827,0.5028259754180908],[0.3692319989204407,0.5024710297584534],[0.36963599920272827,0.5028259754180908],[0.3691839873790741,0.5028610229492188],[0.33338800072669983,0.4840390086174011],[0.3338179886341095,0.4837439954280853],[0.33437299728393555,0.484266996383667],[0.33338800072669983,0.4840390086174011],[0.33437299728393555,0.484266996383667],[0.33383598923683167,0.4847649931907654],[0.3693139851093292,0.5023030042648315],[0.36952999234199524,0.5024269819259644],[0.36963000893592834,0.5025500059127808],[0.3693139851093292,0.5023030042648315],[0.36963000893592834,0.5025500059127808],[0.3692319989204407,0.5024710297584534],[0.3338179886341095,0.4837439954280853],[0.33411601185798645,0.48376399278640747],[0.3345400094985962,0.48396098613739014],[0.3338179886341095,0.4837439954280853],[0.3345400094985962,0.48396098613739014],[0.33437299728393555,0.484266996383667],[0.369392991065979,0.5021989941596985],[0.3696030080318451,0.5023180246353149],[0.36952999234199524,0.5024269819259644],[0.369392991065979,0.5021989941596985],[0.36952999234199524,0.5024269819259644],[0.3693139851093292,0.5023030042648315],[0.33411601185798645,0.48376399278640747],[0.3342050015926361,0.4835340082645416],[0.33461400866508484,0.48372799158096313],[0.33411601185798645,0.48376399278640747],[0.33461400866508484,0.48372799158096313],[0.3345400094985962,0.48396098613739014],[0.3696880042552948,0.5021520256996155],[0.3696030080318451,0.5023180246353149],[0.369392991065979,0.5021989941596985],[0.33461400866508484,0.48372799158096313],[0.3342050015926361,0.4835340082645416],[0.3343699872493744,0.4832240045070648],[0.3685239851474762,0.5031089782714844],[0.3679620027542114,0.5053319931030273],[0.36636000871658325,0.5037400126457214],[0.3685239851474762,0.5031089782714844],[0.36636000871658325,0.5037400126457214],[0.3683600127696991,0.5024700164794922],[0.3356040120124817,0.4896799921989441],[0.33160099387168884,0.4894149899482727],[0.3341970145702362,0.4860079884529114],[0.3356040120124817,0.4896799921989441],[0.3341970145702362,0.4860079884529114],[0.3353100121021271,0.4855560064315796],[0.3689909875392914,0.5023549795150757],[0.3685239851474762,0.5031089782714844],[0.3683600127696991,0.5024700164794922],[0.3689909875392914,0.5023549795150757],[0.3683600127696991,0.5024700164794922],[0.3689349889755249,0.502206027507782],[0.3353100121021271,0.4855560064315796],[0.3341970145702362,0.4860079884529114],[0.33480700850486755,0.48450198769569397],[0.3353100121021271,0.4855560064315796],[0.33480700850486755,0.48450198769569397],[0.3350920081138611,0.48442700505256653],[0.369174987077713,0.5021179914474487],[0.3689909875392914,0.5023549795150757],[0.3689349889755249,0.502206027507782],[0.369174987077713,0.5021179914474487],[0.3689349889755249,0.502206027507782],[0.36910900473594666,0.5021039843559265],[0.3350920081138611,0.48442700505256653],[0.33480700850486755,0.48450198769569397],[0.33496901392936707,0.4839729964733124],[0.3350920081138611,0.48442700505256653],[0.33496901392936707,0.4839729964733124],[0.3350610136985779,0.4840579926967621],[0.3692440092563629,0.5019440054893494],[0.369174987077713,0.5021179914474487],[0.36910900473594666,0.5021039843559265],[0.3692440092563629,0.5019440054893494],[0.36910900473594666,0.5021039843559265],[0.3691290020942688,0.5019680261611938],[0.3350610136985779,0.4840579926967621],[0.33496901392936707,0.4839729964733124],[0.3351590037345886,0.4836849868297577],[0.3350610136985779,0.4840579926967621],[0.3351590037345886,0.4836849868297577],[0.33524399995803833,0.48388299345970154],[0.369581013917923,0.5015990138053894],[0.3692440092563629,0.5019440054893494],[0.3691290020942688,0.5019680261611938],[0.369581013917923,0.5015990138053894],[0.3691290020942688,0.5019680261611938],[0.36905598640441895,0.5016229748725891],[0.33524399995803833,0.48388299345970154],[0.3351590037345886,0.4836849868297577],[0.335330992937088,0.4828130006790161],[0.33524399995803833,0.48388299345970154],[0.335330992937088,0.4828130006790161],[0.3358370065689087,0.48363199830055237],[0.37022900581359863,0.5010709762573242],[0.369581013917923,0.5015990138053894],[0.36905598640441895,0.5016229748725891],[0.37022900581359863,0.5010709762573242],[0.36905598640441895,0.5016229748725891],[0.3689579963684082,0.5002740025520325],[0.3358370065689087,0.48363199830055237],[0.335330992937088,0.4828130006790161],[0.33549800515174866,0.4812609851360321],[0.3358370065689087,0.48363199830055237],[0.33549800515174866,0.4812609851360321],[0.33788999915122986,0.48243799805641174],[0.36905598640441895,0.5016229748725891],[0.3683600127696991,0.5024700164794922],[0.36636000871658325,0.5037400126457214],[0.36905598640441895,0.5016229748725891],[0.36636000871658325,0.5037400126457214],[0.3689579963684082,0.5002740025520325],[0.3356040120124817,0.4896799921989441],[0.3353100121021271,0.4855560064315796],[0.3358370065689087,0.48363199830055237],[0.3356040120124817,0.4896799921989441],[0.3358370065689087,0.48363199830055237],[0.33788999915122986,0.48243799805641174],[0.36905598640441895,0.5016229748725891],[0.3691290020942688,0.5019680261611938],[0.3689349889755249,0.502206027507782],[0.36905598640441895,0.5016229748725891],[0.3689349889755249,0.502206027507782],[0.3683600127696991,0.5024700164794922],[0.3350920081138611,0.48442700505256653],[0.33524399995803833,0.48388299345970154],[0.3358370065689087,0.48363199830055237],[0.3350920081138611,0.48442700505256653],[0.3358370065689087,0.48363199830055237],[0.3353100121021271,0.4855560064315796],[0.3691290020942688,0.5019680261611938],[0.36910900473594666,0.5021039843559265],[0.3689349889755249,0.502206027507782],[0.3350920081138611,0.48442700505256653],[0.3350610136985779,0.4840579926967621],[0.33524399995803833,0.48388299345970154],[0.36783701181411743,0.499904990196228],[0.37244299054145813,0.5003299713134766],[0.37022900581359863,0.5010709762573242],[0.36783701181411743,0.499904990196228],[0.37022900581359863,0.5010709762573242],[0.3689579963684082,0.5002740025520325],[0.33549800515174866,0.4812609851360321],[0.3344759941101074,0.47676700353622437],[0.339462012052536,0.4837050139904022],[0.33549800515174866,0.4812609851360321],[0.339462012052536,0.4837050139904022],[0.33788999915122986,0.48243799805641174],[0.36783701181411743,0.499904990196228],[0.3689579963684082,0.5002740025520325],[0.36636000871658325,0.5037400126457214],[0.36783701181411743,0.499904990196228],[0.36636000871658325,0.5037400126457214],[0.36480000615119934,0.5026500225067139],[0.3356040120124817,0.4896799921989441],[0.33788999915122986,0.48243799805641174],[0.339462012052536,0.4837050139904022],[0.3356040120124817,0.4896799921989441],[0.339462012052536,0.4837050139904022],[0.33855101466178894,0.4904560148715973],[0.3660160005092621,0.5087869763374329],[0.36480000615119934,0.5026500225067139],[0.36636000871658325,0.5037400126457214],[0.3660160005092621,0.5087869763374329],[0.36636000871658325,0.5037400126457214],[0.3679620027542114,0.5053319931030273],[0.3356040120124817,0.4896799921989441],[0.33855101466178894,0.4904560148715973],[0.3294770121574402,0.49637699127197266],[0.3356040120124817,0.4896799921989441],[0.3294770121574402,0.49637699127197266],[0.33160099387168884,0.4894149899482727],[-1.1102199806005023e-16,1],[1,-3.3306698679688577e-16],[1,1],[1,-3.3306698679688577e-16],[-1.1102199806005023e-16,1],[-1.1102199806005023e-16,-3.3306698679688577e-16],[1,-0.5598620176315308],[-3.3306698679688577e-16,-1.6653300370752025e-16],[-3.3306698679688577e-16,-0.5598620176315308],[-3.3306698679688577e-16,-1.6653300370752025e-16],[1,-0.5598620176315308],[1,-1.6653300370752025e-16],[-5.551119755337213e-17,-0.5598620176315308],[1,-1.6653300370752025e-16],[-5.551119755337213e-17,-1.6653300370752025e-16],[1,-1.6653300370752025e-16],[-5.551119755337213e-17,-0.5598620176315308],[1,-0.5598620176315308],[-0.21467800438404083,-0.3566490113735199],[-8.881779961836516e-16,1.3877799719215278e-16],[-0.21467800438404083,0.5115969777107239],[-0.21467800438404083,-0.3566490113735199],[1.1313899755477905,1.3877799719215278e-16],[-8.881779961836516e-16,1.3877799719215278e-16],[1.3361400365829468,-0.3566490113735199],[1.1313899755477905,1.3877799719215278e-16],[-0.21467800438404083,-0.3566490113735199],[-0.21467800438404083,0.5115969777107239],[-8.881779961836516e-16,1.3877799719215278e-16],[-8.881779961836516e-16,0.5115969777107239],[1.3361400365829468,-0.3566490113735199],[1.1313899755477905,0.5115969777107239],[1.1313899755477905,1.3877799719215278e-16],[1.1313899755477905,0.5115969777107239],[1.3361400365829468,-0.3566490113735199],[1.3361400365829468,0.5115969777107239],[-1,-0.5598620176315308],[5.551119755337213e-17,-1.6653300370752025e-16],[-1,-1.6653300370752025e-16],[5.551119755337213e-17,-1.6653300370752025e-16],[-1,-0.5598620176315308],[5.551119755337213e-17,-0.5598620176315308],[1,-3.3306698679688577e-16],[1.1102199806005023e-16,0.1320279985666275],[1.1102199806005023e-16,-3.3306698679688577e-16],[1.1102199806005023e-16,0.1320279985666275],[1,-3.3306698679688577e-16],[0.6503009796142578,0.1320279985666275],[0.6503009796142578,0.1320279985666275],[1,-3.3306698679688577e-16],[0.6503009796142578,0.8615710139274597],[1,1],[0.6503009796142578,0.8615710139274597],[1,-3.3306698679688577e-16],[1.1102199806005023e-16,1],[0.6503009796142578,0.8615710139274597],[1,1],[0.6503009796142578,0.8615710139274597],[1.1102199806005023e-16,1],[1.1102199806005023e-16,0.8615710139274597],[-1,9.71445014198114e-17],[8.326670037710714e-17,0.5072849988937378],[-1,0.5072849988937378],[8.326670037710714e-17,0.5072849988937378],[-1,9.71445014198114e-17],[8.326670037710714e-17,9.71445014198114e-17],[-0.891381025314331,1],[2.7755598776686065e-17,0],[2.7755598776686065e-17,1],[2.7755598776686065e-17,0],[-0.891381025314331,1],[-0.891381025314331,0],[1,0.5072849988937378],[-8.326670037710714e-17,9.71445014198114e-17],[1,9.71445014198114e-17],[-8.326670037710714e-17,9.71445014198114e-17],[1,0.5072849988937378],[-8.326670037710714e-17,0.5072849988937378],[-1,0.4521839916706085],[0,1.1102199806005023e-16],[0,0.4521839916706085],[0,1.1102199806005023e-16],[-1,0.4521839916706085],[-1,1.1102199806005023e-16]];
			var vertNormal = [[0.6649929881095886,-0.7193629741668701,-0.20075200498104095],[0.6649929881095886,-0.7193629741668701,-0.20075200498104095],[0.6649929881095886,-0.7193629741668701,-0.20075200498104095],[0.6649929881095886,-0.7193629741668701,-0.20075200498104095],[0.6649929881095886,-0.7193629741668701,-0.20075200498104095],[0.6649929881095886,-0.7193629741668701,-0.20075200498104095],[-0.6649929881095886,-0.7193629741668701,-0.20075200498104095],[-0.6649929881095886,-0.7193629741668701,-0.20075200498104095],[-0.6649929881095886,-0.7193629741668701,-0.20075200498104095],[-0.6649929881095886,-0.7193629741668701,-0.20075200498104095],[-0.6649929881095886,-0.7193629741668701,-0.20075200498104095],[-0.6649929881095886,-0.7193629741668701,-0.20075200498104095],[0.8294270038604736,-0.46892398595809937,-0.30358099937438965],[0.8294270038604736,-0.46892398595809937,-0.30358099937438965],[0.8294270038604736,-0.46892398595809937,-0.30358099937438965],[0.8294270038604736,-0.46892398595809937,-0.30358099937438965],[0.8294270038604736,-0.46892398595809937,-0.30358099937438965],[0.8294270038604736,-0.46892398595809937,-0.30358099937438965],[-0.8294270038604736,-0.46892398595809937,-0.30358099937438965],[-0.8294270038604736,-0.46892398595809937,-0.30358099937438965],[-0.8294270038604736,-0.46892398595809937,-0.30358099937438965],[-0.8294270038604736,-0.46892398595809937,-0.30358099937438965],[-0.8294270038604736,-0.46892398595809937,-0.30358099937438965],[-0.8294270038604736,-0.46892398595809937,-0.30358099937438965],[0.4155479967594147,-0.4449310004711151,-0.7933200001716614],[0.4155479967594147,-0.4449310004711151,-0.7933200001716614],[0.4155479967594147,-0.4449310004711151,-0.7933200001716614],[0.4155479967594147,-0.4449310004711151,-0.7933200001716614],[0.4155479967594147,-0.4449310004711151,-0.7933200001716614],[0.4155479967594147,-0.4449310004711151,-0.7933200001716614],[-0.4155479967594147,-0.4449310004711151,-0.7933200001716614],[-0.4155479967594147,-0.4449310004711151,-0.7933200001716614],[-0.4155479967594147,-0.4449310004711151,-0.7933200001716614],[-0.4155479967594147,-0.4449310004711151,-0.7933200001716614],[-0.4155479967594147,-0.4449310004711151,-0.7933200001716614],[-0.4155479967594147,-0.4449310004711151,-0.7933200001716614],[0.3599500060081482,-0.7819600105285645,-0.5088949799537659],[0.3599500060081482,-0.7819600105285645,-0.5088949799537659],[0.3599500060081482,-0.7819600105285645,-0.5088949799537659],[0.3599500060081482,-0.7819600105285645,-0.5088949799537659],[0.3599500060081482,-0.7819600105285645,-0.5088949799537659],[0.3599500060081482,-0.7819600105285645,-0.5088949799537659],[-0.3599500060081482,-0.7819600105285645,-0.5088949799537659],[-0.3599500060081482,-0.7819600105285645,-0.5088949799537659],[-0.3599500060081482,-0.7819600105285645,-0.5088949799537659],[-0.3599500060081482,-0.7819600105285645,-0.5088949799537659],[-0.3599500060081482,-0.7819600105285645,-0.5088949799537659],[-0.3599500060081482,-0.7819600105285645,-0.5088949799537659],[-0.07866580039262772,-0.8383529782295227,-0.5394229888916016],[-0.07866580039262772,-0.8383529782295227,-0.5394229888916016],[-0.07866580039262772,-0.8383529782295227,-0.5394229888916016],[-0.07866580039262772,-0.8383529782295227,-0.5394229888916016],[-0.07866580039262772,-0.8383529782295227,-0.5394229888916016],[-0.07866580039262772,-0.8383529782295227,-0.5394229888916016],[0.07866580039262772,-0.8383529782295227,-0.5394229888916016],[0.07866580039262772,-0.8383529782295227,-0.5394229888916016],[0.07866580039262772,-0.8383529782295227,-0.5394229888916016],[0.07866580039262772,-0.8383529782295227,-0.5394229888916016],[0.07866580039262772,-0.8383529782295227,-0.5394229888916016],[0.07866580039262772,-0.8383529782295227,-0.5394229888916016],[-0.26962700486183167,-0.468531996011734,-0.8412960171699524],[-0.26962700486183167,-0.468531996011734,-0.8412960171699524],[-0.26962700486183167,-0.468531996011734,-0.8412960171699524],[-0.26962700486183167,-0.468531996011734,-0.8412960171699524],[-0.26962700486183167,-0.468531996011734,-0.8412960171699524],[-0.26962700486183167,-0.468531996011734,-0.8412960171699524],[0.26962700486183167,-0.468531996011734,-0.8412960171699524],[0.26962700486183167,-0.468531996011734,-0.8412960171699524],[0.26962700486183167,-0.468531996011734,-0.8412960171699524],[0.26962700486183167,-0.468531996011734,-0.8412960171699524],[0.26962700486183167,-0.468531996011734,-0.8412960171699524],[0.26962700486183167,-0.468531996011734,-0.8412960171699524],[-0.7706559896469116,-0.5419660210609436,-0.33520400524139404],[-0.7706559896469116,-0.5419660210609436,-0.33520400524139404],[-0.7706559896469116,-0.5419660210609436,-0.33520400524139404],[-0.7706559896469116,-0.5419660210609436,-0.33520400524139404],[-0.7706559896469116,-0.5419660210609436,-0.33520400524139404],[-0.7706559896469116,-0.5419660210609436,-0.33520400524139404],[0.7706559896469116,-0.5419660210609436,-0.33520400524139404],[0.7706559896469116,-0.5419660210609436,-0.33520400524139404],[0.7706559896469116,-0.5419660210609436,-0.33520400524139404],[0.7706559896469116,-0.5419660210609436,-0.33520400524139404],[0.7706559896469116,-0.5419660210609436,-0.33520400524139404],[0.7706559896469116,-0.5419660210609436,-0.33520400524139404],[-0.46894100308418274,-0.8616499900817871,-0.19404500722885132],[-0.46894100308418274,-0.8616499900817871,-0.19404500722885132],[-0.46894100308418274,-0.8616499900817871,-0.19404500722885132],[-0.46894100308418274,-0.8616499900817871,-0.19404500722885132],[-0.46894100308418274,-0.8616499900817871,-0.19404500722885132],[-0.46894100308418274,-0.8616499900817871,-0.19404500722885132],[0.46894100308418274,-0.8616499900817871,-0.19404500722885132],[0.46894100308418274,-0.8616499900817871,-0.19404500722885132],[0.46894100308418274,-0.8616499900817871,-0.19404500722885132],[0.46894100308418274,-0.8616499900817871,-0.19404500722885132],[0.46894100308418274,-0.8616499900817871,-0.19404500722885132],[0.46894100308418274,-0.8616499900817871,-0.19404500722885132],[-0.47673100233078003,-0.8581159710884094,0.19069300591945648],[-0.47673100233078003,-0.8581159710884094,0.19069300591945648],[-0.47673100233078003,-0.8581159710884094,0.19069300591945648],[-0.47673100233078003,-0.8581159710884094,0.19069300591945648],[-0.47673100233078003,-0.8581159710884094,0.19069300591945648],[-0.47673100233078003,-0.8581159710884094,0.19069300591945648],[0.47673100233078003,-0.8581159710884094,0.19069300591945648],[0.47673100233078003,-0.8581159710884094,0.19069300591945648],[0.47673100233078003,-0.8581159710884094,0.19069300591945648],[0.47673100233078003,-0.8581159710884094,0.19069300591945648],[0.47673100233078003,-0.8581159710884094,0.19069300591945648],[0.47673100233078003,-0.8581159710884094,0.19069300591945648],[-0.7672020196914673,-0.5521420240402222,0.32640400528907776],[-0.7672020196914673,-0.5521420240402222,0.32640400528907776],[-0.7672020196914673,-0.5521420240402222,0.32640400528907776],[-0.7672020196914673,-0.5521420240402222,0.32640400528907776],[-0.7672020196914673,-0.5521420240402222,0.32640400528907776],[-0.7672020196914673,-0.5521420240402222,0.32640400528907776],[0.7672020196914673,-0.5521420240402222,0.32640400528907776],[0.7672020196914673,-0.5521420240402222,0.32640400528907776],[0.7672020196914673,-0.5521420240402222,0.32640400528907776],[0.7672020196914673,-0.5521420240402222,0.32640400528907776],[0.7672020196914673,-0.5521420240402222,0.32640400528907776],[0.7672020196914673,-0.5521420240402222,0.32640400528907776],[-0.2519280016422272,-0.5181689858436584,0.8173329830169678],[-0.2519280016422272,-0.5181689858436584,0.8173329830169678],[-0.2519280016422272,-0.5181689858436584,0.8173329830169678],[-0.2519280016422272,-0.5181689858436584,0.8173329830169678],[-0.2519280016422272,-0.5181689858436584,0.8173329830169678],[-0.2519280016422272,-0.5181689858436584,0.8173329830169678],[0.2519280016422272,-0.5181689858436584,0.8173329830169678],[0.2519280016422272,-0.5181689858436584,0.8173329830169678],[0.2519280016422272,-0.5181689858436584,0.8173329830169678],[0.2519280016422272,-0.5181689858436584,0.8173329830169678],[0.2519280016422272,-0.5181689858436584,0.8173329830169678],[0.2519280016422272,-0.5181689858436584,0.8173329830169678],[-0.09493289887905121,-0.8164229989051819,0.5695970058441162],[-0.09493289887905121,-0.8164229989051819,0.5695970058441162],[-0.09493289887905121,-0.8164229989051819,0.5695970058441162],[-0.09493289887905121,-0.8164229989051819,0.5695970058441162],[-0.09493289887905121,-0.8164229989051819,0.5695970058441162],[-0.09493289887905121,-0.8164229989051819,0.5695970058441162],[0.09493289887905121,-0.8164229989051819,0.5695970058441162],[0.09493289887905121,-0.8164229989051819,0.5695970058441162],[0.09493289887905121,-0.8164229989051819,0.5695970058441162],[0.09493289887905121,-0.8164229989051819,0.5695970058441162],[0.09493289887905121,-0.8164229989051819,0.5695970058441162],[0.09493289887905121,-0.8164229989051819,0.5695970058441162],[0.36674201488494873,-0.7596799731254578,0.5370150208473206],[0.36674201488494873,-0.7596799731254578,0.5370150208473206],[0.36674201488494873,-0.7596799731254578,0.5370150208473206],[0.36674201488494873,-0.7596799731254578,0.5370150208473206],[0.36674201488494873,-0.7596799731254578,0.5370150208473206],[0.36674201488494873,-0.7596799731254578,0.5370150208473206],[-0.36674201488494873,-0.7596799731254578,0.5370150208473206],[-0.36674201488494873,-0.7596799731254578,0.5370150208473206],[-0.36674201488494873,-0.7596799731254578,0.5370150208473206],[-0.36674201488494873,-0.7596799731254578,0.5370150208473206],[-0.36674201488494873,-0.7596799731254578,0.5370150208473206],[-0.36674201488494873,-0.7596799731254578,0.5370150208473206],[0.4140549898147583,-0.48982998728752136,0.7672190070152283],[0.4140549898147583,-0.48982998728752136,0.7672190070152283],[0.4140549898147583,-0.48982998728752136,0.7672190070152283],[0.4140549898147583,-0.48982998728752136,0.7672190070152283],[0.4140549898147583,-0.48982998728752136,0.7672190070152283],[0.4140549898147583,-0.48982998728752136,0.7672190070152283],[-0.4140549898147583,-0.48982998728752136,0.7672190070152283],[-0.4140549898147583,-0.48982998728752136,0.7672190070152283],[-0.4140549898147583,-0.48982998728752136,0.7672190070152283],[-0.4140549898147583,-0.48982998728752136,0.7672190070152283],[-0.4140549898147583,-0.48982998728752136,0.7672190070152283],[-0.4140549898147583,-0.48982998728752136,0.7672190070152283],[0.8277469873428345,-0.47714099287986755,0.29524698853492737],[0.8277469873428345,-0.47714099287986755,0.29524698853492737],[0.8277469873428345,-0.47714099287986755,0.29524698853492737],[0.8277469873428345,-0.47714099287986755,0.29524698853492737],[0.8277469873428345,-0.47714099287986755,0.29524698853492737],[0.8277469873428345,-0.47714099287986755,0.29524698853492737],[-0.8277469873428345,-0.47714099287986755,0.29524698853492737],[-0.8277469873428345,-0.47714099287986755,0.29524698853492737],[-0.8277469873428345,-0.47714099287986755,0.29524698853492737],[-0.8277469873428345,-0.47714099287986755,0.29524698853492737],[-0.8277469873428345,-0.47714099287986755,0.29524698853492737],[-0.8277469873428345,-0.47714099287986755,0.29524698853492737],[0.6713449954986572,-0.7144590020179749,0.1970919966697693],[0.6713449954986572,-0.7144590020179749,0.1970919966697693],[0.6713449954986572,-0.7144590020179749,0.1970919966697693],[0.6713449954986572,-0.7144590020179749,0.1970919966697693],[0.6713449954986572,-0.7144590020179749,0.1970919966697693],[0.6713449954986572,-0.7144590020179749,0.1970919966697693],[-0.6713449954986572,-0.7144590020179749,0.1970919966697693],[-0.6713449954986572,-0.7144590020179749,0.1970919966697693],[-0.6713449954986572,-0.7144590020179749,0.1970919966697693],[-0.6713449954986572,-0.7144590020179749,0.1970919966697693],[-0.6713449954986572,-0.7144590020179749,0.1970919966697693],[-0.6713449954986572,-0.7144590020179749,0.1970919966697693],[0.8111069798469543,0.4866639971733093,0.3244430124759674],[0.8111069798469543,0.4866639971733093,0.3244430124759674],[0.8111069798469543,0.4866639971733093,0.3244430124759674],[0.8111069798469543,0.4866639971733093,0.3244430124759674],[0.8111069798469543,0.4866639971733093,0.3244430124759674],[0.8111069798469543,0.4866639971733093,0.3244430124759674],[-0.8111069798469543,0.4866639971733093,0.3244430124759674],[-0.8111069798469543,0.4866639971733093,0.3244430124759674],[-0.8111069798469543,0.4866639971733093,0.3244430124759674],[-0.8111069798469543,0.4866639971733093,0.3244430124759674],[-0.8111069798469543,0.4866639971733093,0.3244430124759674],[-0.8111069798469543,0.4866639971733093,0.3244430124759674],[0.2051520049571991,0.5333960056304932,0.820609986782074],[0.2051520049571991,0.5333960056304932,0.820609986782074],[0.2051520049571991,0.5333960056304932,0.820609986782074],[0.2051520049571991,0.5333960056304932,0.820609986782074],[0.2051520049571991,0.5333960056304932,0.820609986782074],[0.2051520049571991,0.5333960056304932,0.820609986782074],[-0.2051520049571991,0.5333960056304932,0.820609986782074],[-0.2051520049571991,0.5333960056304932,0.820609986782074],[-0.2051520049571991,0.5333960056304932,0.820609986782074],[-0.2051520049571991,0.5333960056304932,0.820609986782074],[-0.2051520049571991,0.5333960056304932,0.820609986782074],[-0.2051520049571991,0.5333960056304932,0.820609986782074],[-0.42231398820877075,0.4607059955596924,0.7806410193443298],[-0.42231398820877075,0.4607059955596924,0.7806410193443298],[-0.42231398820877075,0.4607059955596924,0.7806410193443298],[-0.42231398820877075,0.4607059955596924,0.7806410193443298],[-0.42231398820877075,0.4607059955596924,0.7806410193443298],[-0.42231398820877075,0.4607059955596924,0.7806410193443298],[0.42231398820877075,0.4607059955596924,0.7806410193443298],[0.42231398820877075,0.4607059955596924,0.7806410193443298],[0.42231398820877075,0.4607059955596924,0.7806410193443298],[0.42231398820877075,0.4607059955596924,0.7806410193443298],[0.42231398820877075,0.4607059955596924,0.7806410193443298],[0.42231398820877075,0.4607059955596924,0.7806410193443298],[-0.8240609765052795,0.46577298641204834,0.3224579989910126],[-0.8240609765052795,0.46577298641204834,0.3224579989910126],[-0.8240609765052795,0.46577298641204834,0.3224579989910126],[-0.8240609765052795,0.46577298641204834,0.3224579989910126],[-0.8240609765052795,0.46577298641204834,0.3224579989910126],[-0.8240609765052795,0.46577298641204834,0.3224579989910126],[0.8240609765052795,0.46577298641204834,0.3224579989910126],[0.8240609765052795,0.46577298641204834,0.3224579989910126],[0.8240609765052795,0.46577298641204834,0.3224579989910126],[0.8240609765052795,0.46577298641204834,0.3224579989910126],[0.8240609765052795,0.46577298641204834,0.3224579989910126],[0.8240609765052795,0.46577298641204834,0.3224579989910126],[-0.8137329816818237,0.4649910032749176,-0.3487429916858673],[-0.8137329816818237,0.4649910032749176,-0.3487429916858673],[-0.8137329816818237,0.4649910032749176,-0.3487429916858673],[-0.8137329816818237,0.4649910032749176,-0.3487429916858673],[-0.8137329816818237,0.4649910032749176,-0.3487429916858673],[-0.8137329816818237,0.4649910032749176,-0.3487429916858673],[0.8137329816818237,0.4649910032749176,-0.3487429916858673],[0.8137329816818237,0.4649910032749176,-0.3487429916858673],[0.8137329816818237,0.4649910032749176,-0.3487429916858673],[0.8137329816818237,0.4649910032749176,-0.3487429916858673],[0.8137329816818237,0.4649910032749176,-0.3487429916858673],[0.8137329816818237,0.4649910032749176,-0.3487429916858673],[-0.42231398820877075,0.4607059955596924,-0.7806410193443298],[-0.42231398820877075,0.4607059955596924,-0.7806410193443298],[-0.42231398820877075,0.4607059955596924,-0.7806410193443298],[-0.42231398820877075,0.4607059955596924,-0.7806410193443298],[-0.42231398820877075,0.4607059955596924,-0.7806410193443298],[-0.42231398820877075,0.4607059955596924,-0.7806410193443298],[0.42231398820877075,0.4607059955596924,-0.7806410193443298],[0.42231398820877075,0.4607059955596924,-0.7806410193443298],[0.42231398820877075,0.4607059955596924,-0.7806410193443298],[0.42231398820877075,0.4607059955596924,-0.7806410193443298],[0.42231398820877075,0.4607059955596924,-0.7806410193443298],[0.42231398820877075,0.4607059955596924,-0.7806410193443298],[0.2051520049571991,0.5333960056304932,-0.820609986782074],[0.2051520049571991,0.5333960056304932,-0.820609986782074],[0.2051520049571991,0.5333960056304932,-0.820609986782074],[0.2051520049571991,0.5333960056304932,-0.820609986782074],[0.2051520049571991,0.5333960056304932,-0.820609986782074],[0.2051520049571991,0.5333960056304932,-0.820609986782074],[-0.2051520049571991,0.5333960056304932,-0.820609986782074],[-0.2051520049571991,0.5333960056304932,-0.820609986782074],[-0.2051520049571991,0.5333960056304932,-0.820609986782074],[-0.2051520049571991,0.5333960056304932,-0.820609986782074],[-0.2051520049571991,0.5333960056304932,-0.820609986782074],[-0.2051520049571991,0.5333960056304932,-0.820609986782074],[0.7994769811630249,0.48748600482940674,-0.3509899973869324],[0.7994769811630249,0.48748600482940674,-0.3509899973869324],[0.7994769811630249,0.48748600482940674,-0.3509899973869324],[0.7994769811630249,0.48748600482940674,-0.3509899973869324],[0.7994769811630249,0.48748600482940674,-0.3509899973869324],[0.7994769811630249,0.48748600482940674,-0.3509899973869324],[-0.7994769811630249,0.48748600482940674,-0.3509899973869324],[-0.7994769811630249,0.48748600482940674,-0.3509899973869324],[-0.7994769811630249,0.48748600482940674,-0.3509899973869324],[-0.7994769811630249,0.48748600482940674,-0.3509899973869324],[-0.7994769811630249,0.48748600482940674,-0.3509899973869324],[-0.7994769811630249,0.48748600482940674,-0.3509899973869324],[0.4000389873981476,-0.9143750071525574,-0.06234379857778549],[0.4000389873981476,-0.9143750071525574,-0.06234379857778549],[0.4000389873981476,-0.9143750071525574,-0.06234379857778549],[-0.4000389873981476,-0.9143750071525574,-0.06234379857778549],[-0.4000389873981476,-0.9143750071525574,-0.06234379857778549],[-0.4000389873981476,-0.9143750071525574,-0.06234379857778549],[0.3069379925727844,-0.9354289770126343,-0.1753930002450943],[0.3069379925727844,-0.9354289770126343,-0.1753930002450943],[0.3069379925727844,-0.9354289770126343,-0.1753930002450943],[-0.3069379925727844,-0.9354289770126343,-0.1753930002450943],[-0.3069379925727844,-0.9354289770126343,-0.1753930002450943],[-0.3069379925727844,-0.9354289770126343,-0.1753930002450943],[0.09451159834861755,-0.9784730076789856,-0.18346400558948517],[0.09451159834861755,-0.9784730076789856,-0.18346400558948517],[0.09451159834861755,-0.9784730076789856,-0.18346400558948517],[-0.09451159834861755,-0.9784730076789856,-0.18346400558948517],[-0.09451159834861755,-0.9784730076789856,-0.18346400558948517],[-0.09451159834861755,-0.9784730076789856,-0.18346400558948517],[-0.06235320121049881,-0.997651994228363,-0.02834239974617958],[-0.06235320121049881,-0.997651994228363,-0.02834239974617958],[-0.06235320121049881,-0.997651994228363,-0.02834239974617958],[0.06235320121049881,-0.997651994228363,-0.02834239974617958],[0.06235320121049881,-0.997651994228363,-0.02834239974617958],[0.06235320121049881,-0.997651994228363,-0.02834239974617958],[-0.06235719844698906,-0.9977160096168518,0.025982199236750603],[-0.06235719844698906,-0.9977160096168518,0.025982199236750603],[-0.06235719844698906,-0.9977160096168518,0.025982199236750603],[0.06235719844698906,-0.9977160096168518,0.025982199236750603],[0.06235719844698906,-0.9977160096168518,0.025982199236750603],[0.06235719844698906,-0.9977160096168518,0.025982199236750603],[0.09956110268831253,-0.9798910021781921,0.17292200028896332],[0.09956110268831253,-0.9798910021781921,0.17292200028896332],[0.09956110268831253,-0.9798910021781921,0.17292200028896332],[-0.09956110268831253,-0.9798910021781921,0.17292200028896332],[-0.09956110268831253,-0.9798910021781921,0.17292200028896332],[-0.09956110268831253,-0.9798910021781921,0.17292200028896332],[0.3035709857940674,-0.9383100271224976,0.165583997964859],[0.3035709857940674,-0.9383100271224976,0.165583997964859],[0.3035709857940674,-0.9383100271224976,0.165583997964859],[-0.3035709857940674,-0.9383100271224976,0.165583997964859],[-0.3035709857940674,-0.9383100271224976,0.165583997964859],[-0.3035709857940674,-0.9383100271224976,0.165583997964859],[0.4001629948616028,-0.9146590232849121,0.0571662001311779],[0.4001629948616028,-0.9146590232849121,0.0571662001311779],[0.4001629948616028,-0.9146590232849121,0.0571662001311779],[-0.4001629948616028,-0.9146590232849121,0.0571662001311779],[-0.4001629948616028,-0.9146590232849121,0.0571662001311779],[-0.4001629948616028,-0.9146590232849121,0.0571662001311779],[0.12309099733829498,-0.4923659861087799,-0.8616399765014648],[0.12309099733829498,-0.4923659861087799,-0.8616399765014648],[0.12309099733829498,-0.4923659861087799,-0.8616399765014648],[0.12309099733829498,-0.4923659861087799,-0.8616399765014648],[0.12309099733829498,-0.4923659861087799,-0.8616399765014648],[0.12309099733829498,-0.4923659861087799,-0.8616399765014648],[-0.12309099733829498,-0.4923659861087799,-0.8616399765014648],[-0.12309099733829498,-0.4923659861087799,-0.8616399765014648],[-0.12309099733829498,-0.4923659861087799,-0.8616399765014648],[-0.12309099733829498,-0.4923659861087799,-0.8616399765014648],[-0.12309099733829498,-0.4923659861087799,-0.8616399765014648],[-0.12309099733829498,-0.4923659861087799,-0.8616399765014648],[0.21898600459098816,-0.45201000571250916,-0.8647149801254272],[0.21898600459098816,-0.45201000571250916,-0.8647149801254272],[0.21898600459098816,-0.45201000571250916,-0.8647149801254272],[0.21898600459098816,-0.45201000571250916,-0.8647149801254272],[0.21898600459098816,-0.45201000571250916,-0.8647149801254272],[0.21898600459098816,-0.45201000571250916,-0.8647149801254272],[-0.21898600459098816,-0.45201000571250916,-0.8647149801254272],[-0.21898600459098816,-0.45201000571250916,-0.8647149801254272],[-0.21898600459098816,-0.45201000571250916,-0.8647149801254272],[-0.21898600459098816,-0.45201000571250916,-0.8647149801254272],[-0.21898600459098816,-0.45201000571250916,-0.8647149801254272],[-0.21898600459098816,-0.45201000571250916,-0.8647149801254272],[0.5901979804039001,-0.6667879819869995,-0.45503801107406616],[0.5901979804039001,-0.6667879819869995,-0.45503801107406616],[0.5901979804039001,-0.6667879819869995,-0.45503801107406616],[0.5901979804039001,-0.6667879819869995,-0.45503801107406616],[0.5901979804039001,-0.6667879819869995,-0.45503801107406616],[0.5901979804039001,-0.6667879819869995,-0.45503801107406616],[-0.5901979804039001,-0.6667879819869995,-0.45503801107406616],[-0.5901979804039001,-0.6667879819869995,-0.45503801107406616],[-0.5901979804039001,-0.6667879819869995,-0.45503801107406616],[-0.5901979804039001,-0.6667879819869995,-0.45503801107406616],[-0.5901979804039001,-0.6667879819869995,-0.45503801107406616],[-0.5901979804039001,-0.6667879819869995,-0.45503801107406616],[0.7688940167427063,-0.6373720169067383,-0.050585098564624786],[0.7688940167427063,-0.6373720169067383,-0.050585098564624786],[0.7688940167427063,-0.6373720169067383,-0.050585098564624786],[0.7688940167427063,-0.6373720169067383,-0.050585098564624786],[0.7688940167427063,-0.6373720169067383,-0.050585098564624786],[0.7688940167427063,-0.6373720169067383,-0.050585098564624786],[-0.7688940167427063,-0.6373720169067383,-0.050585098564624786],[-0.7688940167427063,-0.6373720169067383,-0.050585098564624786],[-0.7688940167427063,-0.6373720169067383,-0.050585098564624786],[-0.7688940167427063,-0.6373720169067383,-0.050585098564624786],[-0.7688940167427063,-0.6373720169067383,-0.050585098564624786],[-0.7688940167427063,-0.6373720169067383,-0.050585098564624786],[0.779649019241333,-0.619720995426178,0.08995950222015381],[0.779649019241333,-0.619720995426178,0.08995950222015381],[0.779649019241333,-0.619720995426178,0.08995950222015381],[0.779649019241333,-0.619720995426178,0.08995950222015381],[0.779649019241333,-0.619720995426178,0.08995950222015381],[0.779649019241333,-0.619720995426178,0.08995950222015381],[-0.779649019241333,-0.619720995426178,0.08995950222015381],[-0.779649019241333,-0.619720995426178,0.08995950222015381],[-0.779649019241333,-0.619720995426178,0.08995950222015381],[-0.779649019241333,-0.619720995426178,0.08995950222015381],[-0.779649019241333,-0.619720995426178,0.08995950222015381],[-0.779649019241333,-0.619720995426178,0.08995950222015381],[0.3241409957408905,-0.4738740026950836,-0.8187649846076965],[0.3241409957408905,-0.4738740026950836,-0.8187649846076965],[0.3241409957408905,-0.4738740026950836,-0.8187649846076965],[0.3241409957408905,-0.4738740026950836,-0.8187649846076965],[0.3241409957408905,-0.4738740026950836,-0.8187649846076965],[0.3241409957408905,-0.4738740026950836,-0.8187649846076965],[-0.3241409957408905,-0.4738740026950836,-0.8187649846076965],[-0.3241409957408905,-0.4738740026950836,-0.8187649846076965],[-0.3241409957408905,-0.4738740026950836,-0.8187649846076965],[-0.3241409957408905,-0.4738740026950836,-0.8187649846076965],[-0.3241409957408905,-0.4738740026950836,-0.8187649846076965],[-0.3241409957408905,-0.4738740026950836,-0.8187649846076965],[0.38572999835014343,-0.6417070031166077,-0.6628909707069397],[0.38572999835014343,-0.6417070031166077,-0.6628909707069397],[0.38572999835014343,-0.6417070031166077,-0.6628909707069397],[0.38572999835014343,-0.6417070031166077,-0.6628909707069397],[0.38572999835014343,-0.6417070031166077,-0.6628909707069397],[0.38572999835014343,-0.6417070031166077,-0.6628909707069397],[-0.38572999835014343,-0.6417070031166077,-0.6628909707069397],[-0.38572999835014343,-0.6417070031166077,-0.6628909707069397],[-0.38572999835014343,-0.6417070031166077,-0.6628909707069397],[-0.38572999835014343,-0.6417070031166077,-0.6628909707069397],[-0.38572999835014343,-0.6417070031166077,-0.6628909707069397],[-0.38572999835014343,-0.6417070031166077,-0.6628909707069397],[0.6894680261611938,-0.5906069874763489,-0.4193060100078583],[0.6894680261611938,-0.5906069874763489,-0.4193060100078583],[0.6894680261611938,-0.5906069874763489,-0.4193060100078583],[0.6894680261611938,-0.5906069874763489,-0.4193060100078583],[0.6894680261611938,-0.5906069874763489,-0.4193060100078583],[0.6894680261611938,-0.5906069874763489,-0.4193060100078583],[-0.6894680261611938,-0.5906069874763489,-0.4193060100078583],[-0.6894680261611938,-0.5906069874763489,-0.4193060100078583],[-0.6894680261611938,-0.5906069874763489,-0.4193060100078583],[-0.6894680261611938,-0.5906069874763489,-0.4193060100078583],[-0.6894680261611938,-0.5906069874763489,-0.4193060100078583],[-0.6894680261611938,-0.5906069874763489,-0.4193060100078583],[0.6587510108947754,-0.6587510108947754,-0.36344900727272034],[0.6587510108947754,-0.6587510108947754,-0.36344900727272034],[0.6587510108947754,-0.6587510108947754,-0.36344900727272034],[0.6587510108947754,-0.6587510108947754,-0.36344900727272034],[0.6587510108947754,-0.6587510108947754,-0.36344900727272034],[0.6587510108947754,-0.6587510108947754,-0.36344900727272034],[-0.6587510108947754,-0.6587510108947754,-0.36344900727272034],[-0.6587510108947754,-0.6587510108947754,-0.36344900727272034],[-0.6587510108947754,-0.6587510108947754,-0.36344900727272034],[-0.6587510108947754,-0.6587510108947754,-0.36344900727272034],[-0.6587510108947754,-0.6587510108947754,-0.36344900727272034],[-0.6587510108947754,-0.6587510108947754,-0.36344900727272034],[0.5465480089187622,-0.7509099841117859,0.37070199847221375],[0.5465480089187622,-0.7509099841117859,0.37070199847221375],[0.5465480089187622,-0.7509099841117859,0.37070199847221375],[0.5465480089187622,-0.7509099841117859,0.37070199847221375],[0.5465480089187622,-0.7509099841117859,0.37070199847221375],[0.5465480089187622,-0.7509099841117859,0.37070199847221375],[-0.5465480089187622,-0.7509099841117859,0.37070199847221375],[-0.5465480089187622,-0.7509099841117859,0.37070199847221375],[-0.5465480089187622,-0.7509099841117859,0.37070199847221375],[-0.5465480089187622,-0.7509099841117859,0.37070199847221375],[-0.5465480089187622,-0.7509099841117859,0.37070199847221375],[-0.5465480089187622,-0.7509099841117859,0.37070199847221375],[0.5064470171928406,-0.5706449747085571,0.6464329957962036],[0.5064470171928406,-0.5706449747085571,0.6464329957962036],[0.5064470171928406,-0.5706449747085571,0.6464329957962036],[0.5064470171928406,-0.5706449747085571,0.6464329957962036],[0.5064470171928406,-0.5706449747085571,0.6464329957962036],[0.5064470171928406,-0.5706449747085571,0.6464329957962036],[-0.5064470171928406,-0.5706449747085571,0.6464329957962036],[-0.5064470171928406,-0.5706449747085571,0.6464329957962036],[-0.5064470171928406,-0.5706449747085571,0.6464329957962036],[-0.5064470171928406,-0.5706449747085571,0.6464329957962036],[-0.5064470171928406,-0.5706449747085571,0.6464329957962036],[-0.5064470171928406,-0.5706449747085571,0.6464329957962036],[0.6092439889907837,-0.601531982421875,0.5167009830474854],[0.6092439889907837,-0.601531982421875,0.5167009830474854],[0.6092439889907837,-0.601531982421875,0.5167009830474854],[0.6092439889907837,-0.601531982421875,0.5167009830474854],[0.6092439889907837,-0.601531982421875,0.5167009830474854],[0.6092439889907837,-0.601531982421875,0.5167009830474854],[-0.6092439889907837,-0.601531982421875,0.5167009830474854],[-0.6092439889907837,-0.601531982421875,0.5167009830474854],[-0.6092439889907837,-0.601531982421875,0.5167009830474854],[-0.6092439889907837,-0.601531982421875,0.5167009830474854],[-0.6092439889907837,-0.601531982421875,0.5167009830474854],[-0.6092439889907837,-0.601531982421875,0.5167009830474854],[-0.04406530037522316,-0.7491099834442139,0.6609789729118347],[-0.04406530037522316,-0.7491099834442139,0.6609789729118347],[-0.04406530037522316,-0.7491099834442139,0.6609789729118347],[-0.04406530037522316,-0.7491099834442139,0.6609789729118347],[-0.04406530037522316,-0.7491099834442139,0.6609789729118347],[-0.04406530037522316,-0.7491099834442139,0.6609789729118347],[0.04406530037522316,-0.7491099834442139,0.6609789729118347],[0.04406530037522316,-0.7491099834442139,0.6609789729118347],[0.04406530037522316,-0.7491099834442139,0.6609789729118347],[0.04406530037522316,-0.7491099834442139,0.6609789729118347],[0.04406530037522316,-0.7491099834442139,0.6609789729118347],[0.04406530037522316,-0.7491099834442139,0.6609789729118347],[-0.7246140241622925,-0.6110140085220337,0.3187420070171356],[-0.7246140241622925,-0.6110140085220337,0.3187420070171356],[-0.7246140241622925,-0.6110140085220337,0.3187420070171356],[-0.7246140241622925,-0.6110140085220337,0.3187420070171356],[-0.7246140241622925,-0.6110140085220337,0.3187420070171356],[-0.7246140241622925,-0.6110140085220337,0.3187420070171356],[0.7246140241622925,-0.6110140085220337,0.3187420070171356],[0.7246140241622925,-0.6110140085220337,0.3187420070171356],[0.7246140241622925,-0.6110140085220337,0.3187420070171356],[0.7246140241622925,-0.6110140085220337,0.3187420070171356],[0.7246140241622925,-0.6110140085220337,0.3187420070171356],[0.7246140241622925,-0.6110140085220337,0.3187420070171356],[-0.5880339741706848,-0.5880339741706848,0.5553659796714783],[-0.5880339741706848,-0.5880339741706848,0.5553659796714783],[-0.5880339741706848,-0.5880339741706848,0.5553659796714783],[-0.5880339741706848,-0.5880339741706848,0.5553659796714783],[-0.5880339741706848,-0.5880339741706848,0.5553659796714783],[-0.5880339741706848,-0.5880339741706848,0.5553659796714783],[0.5880339741706848,-0.5880339741706848,0.5553659796714783],[0.5880339741706848,-0.5880339741706848,0.5553659796714783],[0.5880339741706848,-0.5880339741706848,0.5553659796714783],[0.5880339741706848,-0.5880339741706848,0.5553659796714783],[0.5880339741706848,-0.5880339741706848,0.5553659796714783],[0.5880339741706848,-0.5880339741706848,0.5553659796714783],[0.5360540151596069,-0.7482410073280334,-0.3908720016479492],[0.5360540151596069,-0.7482410073280334,-0.3908720016479492],[0.5360540151596069,-0.7482410073280334,-0.3908720016479492],[0.5360540151596069,-0.7482410073280334,-0.3908720016479492],[0.5360540151596069,-0.7482410073280334,-0.3908720016479492],[0.5360540151596069,-0.7482410073280334,-0.3908720016479492],[-0.5360540151596069,-0.7482410073280334,-0.3908720016479492],[-0.5360540151596069,-0.7482410073280334,-0.3908720016479492],[-0.5360540151596069,-0.7482410073280334,-0.3908720016479492],[-0.5360540151596069,-0.7482410073280334,-0.3908720016479492],[-0.5360540151596069,-0.7482410073280334,-0.3908720016479492],[-0.5360540151596069,-0.7482410073280334,-0.3908720016479492],[0.22069500386714935,-0.855193018913269,-0.4689770042896271],[0.22069500386714935,-0.855193018913269,-0.4689770042896271],[0.22069500386714935,-0.855193018913269,-0.4689770042896271],[0.22069500386714935,-0.855193018913269,-0.4689770042896271],[0.22069500386714935,-0.855193018913269,-0.4689770042896271],[0.22069500386714935,-0.855193018913269,-0.4689770042896271],[-0.22069500386714935,-0.855193018913269,-0.4689770042896271],[-0.22069500386714935,-0.855193018913269,-0.4689770042896271],[-0.22069500386714935,-0.855193018913269,-0.4689770042896271],[-0.22069500386714935,-0.855193018913269,-0.4689770042896271],[-0.22069500386714935,-0.855193018913269,-0.4689770042896271],[-0.22069500386714935,-0.855193018913269,-0.4689770042896271],[-0.07939519733190536,-0.8429399728775024,-0.5321170091629028],[-0.07939519733190536,-0.8429399728775024,-0.5321170091629028],[-0.07939519733190536,-0.8429399728775024,-0.5321170091629028],[-0.07939519733190536,-0.8429399728775024,-0.5321170091629028],[-0.07939519733190536,-0.8429399728775024,-0.5321170091629028],[-0.07939519733190536,-0.8429399728775024,-0.5321170091629028],[0.07939519733190536,-0.8429399728775024,-0.5321170091629028],[0.07939519733190536,-0.8429399728775024,-0.5321170091629028],[0.07939519733190536,-0.8429399728775024,-0.5321170091629028],[0.07939519733190536,-0.8429399728775024,-0.5321170091629028],[0.07939519733190536,-0.8429399728775024,-0.5321170091629028],[0.07939519733190536,-0.8429399728775024,-0.5321170091629028],[-0.08246500045061111,-0.7489629983901978,-0.6574609875679016],[-0.08246500045061111,-0.7489629983901978,-0.6574609875679016],[-0.08246500045061111,-0.7489629983901978,-0.6574609875679016],[-0.08246500045061111,-0.7489629983901978,-0.6574609875679016],[-0.08246500045061111,-0.7489629983901978,-0.6574609875679016],[-0.08246500045061111,-0.7489629983901978,-0.6574609875679016],[0.08246500045061111,-0.7489629983901978,-0.6574609875679016],[0.08246500045061111,-0.7489629983901978,-0.6574609875679016],[0.08246500045061111,-0.7489629983901978,-0.6574609875679016],[0.08246500045061111,-0.7489629983901978,-0.6574609875679016],[0.08246500045061111,-0.7489629983901978,-0.6574609875679016],[0.08246500045061111,-0.7489629983901978,-0.6574609875679016],[0.04570259898900986,-0.822646975517273,-0.5667120218276978],[0.04570259898900986,-0.822646975517273,-0.5667120218276978],[0.04570259898900986,-0.822646975517273,-0.5667120218276978],[0.04570259898900986,-0.822646975517273,-0.5667120218276978],[0.04570259898900986,-0.822646975517273,-0.5667120218276978],[0.04570259898900986,-0.822646975517273,-0.5667120218276978],[-0.04570259898900986,-0.822646975517273,-0.5667120218276978],[-0.04570259898900986,-0.822646975517273,-0.5667120218276978],[-0.04570259898900986,-0.822646975517273,-0.5667120218276978],[-0.04570259898900986,-0.822646975517273,-0.5667120218276978],[-0.04570259898900986,-0.822646975517273,-0.5667120218276978],[-0.04570259898900986,-0.822646975517273,-0.5667120218276978],[0.27842798829078674,-0.9365320205688477,-0.21303999423980713],[0.27842798829078674,-0.9365320205688477,-0.21303999423980713],[0.27842798829078674,-0.9365320205688477,-0.21303999423980713],[0.27842798829078674,-0.9365320205688477,-0.21303999423980713],[0.27842798829078674,-0.9365320205688477,-0.21303999423980713],[0.27842798829078674,-0.9365320205688477,-0.21303999423980713],[-0.27842798829078674,-0.9365320205688477,-0.21303999423980713],[-0.27842798829078674,-0.9365320205688477,-0.21303999423980713],[-0.27842798829078674,-0.9365320205688477,-0.21303999423980713],[-0.27842798829078674,-0.9365320205688477,-0.21303999423980713],[-0.27842798829078674,-0.9365320205688477,-0.21303999423980713],[-0.27842798829078674,-0.9365320205688477,-0.21303999423980713],[0.38130301237106323,-0.9062849879264832,-0.18236200511455536],[0.38130301237106323,-0.9062849879264832,-0.18236200511455536],[0.38130301237106323,-0.9062849879264832,-0.18236200511455536],[0.38130301237106323,-0.9062849879264832,-0.18236200511455536],[0.38130301237106323,-0.9062849879264832,-0.18236200511455536],[0.38130301237106323,-0.9062849879264832,-0.18236200511455536],[-0.38130301237106323,-0.9062849879264832,-0.18236200511455536],[-0.38130301237106323,-0.9062849879264832,-0.18236200511455536],[-0.38130301237106323,-0.9062849879264832,-0.18236200511455536],[-0.38130301237106323,-0.9062849879264832,-0.18236200511455536],[-0.38130301237106323,-0.9062849879264832,-0.18236200511455536],[-0.38130301237106323,-0.9062849879264832,-0.18236200511455536],[0.3357439935207367,-0.8969159722328186,-0.2877810001373291],[0.3357439935207367,-0.8969159722328186,-0.2877810001373291],[0.3357439935207367,-0.8969159722328186,-0.2877810001373291],[0.3357439935207367,-0.8969159722328186,-0.2877810001373291],[0.3357439935207367,-0.8969159722328186,-0.2877810001373291],[0.3357439935207367,-0.8969159722328186,-0.2877810001373291],[-0.3357439935207367,-0.8969159722328186,-0.2877810001373291],[-0.3357439935207367,-0.8969159722328186,-0.2877810001373291],[-0.3357439935207367,-0.8969159722328186,-0.2877810001373291],[-0.3357439935207367,-0.8969159722328186,-0.2877810001373291],[-0.3357439935207367,-0.8969159722328186,-0.2877810001373291],[-0.3357439935207367,-0.8969159722328186,-0.2877810001373291],[0.37623998522758484,-0.9245589971542358,0.060276199132204056],[0.37623998522758484,-0.9245589971542358,0.060276199132204056],[0.37623998522758484,-0.9245589971542358,0.060276199132204056],[0.37623998522758484,-0.9245589971542358,0.060276199132204056],[0.37623998522758484,-0.9245589971542358,0.060276199132204056],[0.37623998522758484,-0.9245589971542358,0.060276199132204056],[-0.37623998522758484,-0.9245589971542358,0.060276199132204056],[-0.37623998522758484,-0.9245589971542358,0.060276199132204056],[-0.37623998522758484,-0.9245589971542358,0.060276199132204056],[-0.37623998522758484,-0.9245589971542358,0.060276199132204056],[-0.37623998522758484,-0.9245589971542358,0.060276199132204056],[-0.37623998522758484,-0.9245589971542358,0.060276199132204056],[-0.13521599769592285,-0.9538900256156921,0.26797398924827576],[-0.13521599769592285,-0.9538900256156921,0.26797398924827576],[-0.13521599769592285,-0.9538900256156921,0.26797398924827576],[-0.13521599769592285,-0.9538900256156921,0.26797398924827576],[-0.13521599769592285,-0.9538900256156921,0.26797398924827576],[-0.13521599769592285,-0.9538900256156921,0.26797398924827576],[0.13521599769592285,-0.9538900256156921,0.26797398924827576],[0.13521599769592285,-0.9538900256156921,0.26797398924827576],[0.13521599769592285,-0.9538900256156921,0.26797398924827576],[0.13521599769592285,-0.9538900256156921,0.26797398924827576],[0.13521599769592285,-0.9538900256156921,0.26797398924827576],[0.13521599769592285,-0.9538900256156921,0.26797398924827576],[0.3960910141468048,-0.8101860284805298,-0.43209901452064514],[0.3960910141468048,-0.8101860284805298,-0.43209901452064514],[0.3960910141468048,-0.8101860284805298,-0.43209901452064514],[0.3960910141468048,-0.8101860284805298,-0.43209901452064514],[0.3960910141468048,-0.8101860284805298,-0.43209901452064514],[0.3960910141468048,-0.8101860284805298,-0.43209901452064514],[-0.3960910141468048,-0.8101860284805298,-0.43209901452064514],[-0.3960910141468048,-0.8101860284805298,-0.43209901452064514],[-0.3960910141468048,-0.8101860284805298,-0.43209901452064514],[-0.3960910141468048,-0.8101860284805298,-0.43209901452064514],[-0.3960910141468048,-0.8101860284805298,-0.43209901452064514],[-0.3960910141468048,-0.8101860284805298,-0.43209901452064514],[0.18555699288845062,-0.9509770274162292,-0.24740900099277496],[0.18555699288845062,-0.9509770274162292,-0.24740900099277496],[0.18555699288845062,-0.9509770274162292,-0.24740900099277496],[0.18555699288845062,-0.9509770274162292,-0.24740900099277496],[0.18555699288845062,-0.9509770274162292,-0.24740900099277496],[0.18555699288845062,-0.9509770274162292,-0.24740900099277496],[-0.18555699288845062,-0.9509770274162292,-0.24740900099277496],[-0.18555699288845062,-0.9509770274162292,-0.24740900099277496],[-0.18555699288845062,-0.9509770274162292,-0.24740900099277496],[-0.18555699288845062,-0.9509770274162292,-0.24740900099277496],[-0.18555699288845062,-0.9509770274162292,-0.24740900099277496],[-0.18555699288845062,-0.9509770274162292,-0.24740900099277496],[0.009906929917633533,-0.9807860255241394,-0.19483600556850433],[0.009906929917633533,-0.9807860255241394,-0.19483600556850433],[0.009906929917633533,-0.9807860255241394,-0.19483600556850433],[0.009906929917633533,-0.9807860255241394,-0.19483600556850433],[0.009906929917633533,-0.9807860255241394,-0.19483600556850433],[0.009906929917633533,-0.9807860255241394,-0.19483600556850433],[-0.009906929917633533,-0.9807860255241394,-0.19483600556850433],[-0.009906929917633533,-0.9807860255241394,-0.19483600556850433],[-0.009906929917633533,-0.9807860255241394,-0.19483600556850433],[-0.009906929917633533,-0.9807860255241394,-0.19483600556850433],[-0.009906929917633533,-0.9807860255241394,-0.19483600556850433],[-0.009906929917633533,-0.9807860255241394,-0.19483600556850433],[0.07206589728593826,-0.713795006275177,-0.696636974811554],[0.07206589728593826,-0.713795006275177,-0.696636974811554],[0.07206589728593826,-0.713795006275177,-0.696636974811554],[0.07206589728593826,-0.713795006275177,-0.696636974811554],[0.07206589728593826,-0.713795006275177,-0.696636974811554],[0.07206589728593826,-0.713795006275177,-0.696636974811554],[-0.07206589728593826,-0.713795006275177,-0.696636974811554],[-0.07206589728593826,-0.713795006275177,-0.696636974811554],[-0.07206589728593826,-0.713795006275177,-0.696636974811554],[-0.07206589728593826,-0.713795006275177,-0.696636974811554],[-0.07206589728593826,-0.713795006275177,-0.696636974811554],[-0.07206589728593826,-0.713795006275177,-0.696636974811554],[0.1863359957933426,-0.7985820174217224,-0.5723170042037964],[0.1863359957933426,-0.7985820174217224,-0.5723170042037964],[0.1863359957933426,-0.7985820174217224,-0.5723170042037964],[0.1863359957933426,-0.7985820174217224,-0.5723170042037964],[0.1863359957933426,-0.7985820174217224,-0.5723170042037964],[0.1863359957933426,-0.7985820174217224,-0.5723170042037964],[-0.1863359957933426,-0.7985820174217224,-0.5723170042037964],[-0.1863359957933426,-0.7985820174217224,-0.5723170042037964],[-0.1863359957933426,-0.7985820174217224,-0.5723170042037964],[-0.1863359957933426,-0.7985820174217224,-0.5723170042037964],[-0.1863359957933426,-0.7985820174217224,-0.5723170042037964],[-0.1863359957933426,-0.7985820174217224,-0.5723170042037964],[0.3156850039958954,-0.90938800573349,-0.2708429992198944],[0.3156850039958954,-0.90938800573349,-0.2708429992198944],[0.3156850039958954,-0.90938800573349,-0.2708429992198944],[0.3156850039958954,-0.90938800573349,-0.2708429992198944],[0.3156850039958954,-0.90938800573349,-0.2708429992198944],[0.3156850039958954,-0.90938800573349,-0.2708429992198944],[-0.3156850039958954,-0.90938800573349,-0.2708429992198944],[-0.3156850039958954,-0.90938800573349,-0.2708429992198944],[-0.3156850039958954,-0.90938800573349,-0.2708429992198944],[-0.3156850039958954,-0.90938800573349,-0.2708429992198944],[-0.3156850039958954,-0.90938800573349,-0.2708429992198944],[-0.3156850039958954,-0.90938800573349,-0.2708429992198944],[0.306302011013031,-0.9515659809112549,-0.026481399312615395],[0.306302011013031,-0.9515659809112549,-0.026481399312615395],[0.306302011013031,-0.9515659809112549,-0.026481399312615395],[0.306302011013031,-0.9515659809112549,-0.026481399312615395],[0.306302011013031,-0.9515659809112549,-0.026481399312615395],[0.306302011013031,-0.9515659809112549,-0.026481399312615395],[-0.306302011013031,-0.9515659809112549,-0.026481399312615395],[-0.306302011013031,-0.9515659809112549,-0.026481399312615395],[-0.306302011013031,-0.9515659809112549,-0.026481399312615395],[-0.306302011013031,-0.9515659809112549,-0.026481399312615395],[-0.306302011013031,-0.9515659809112549,-0.026481399312615395],[-0.306302011013031,-0.9515659809112549,-0.026481399312615395],[0.3265500068664551,-0.9361109733581543,-0.13062000274658203],[0.3265500068664551,-0.9361109733581543,-0.13062000274658203],[0.3265500068664551,-0.9361109733581543,-0.13062000274658203],[0.3265500068664551,-0.9361109733581543,-0.13062000274658203],[0.3265500068664551,-0.9361109733581543,-0.13062000274658203],[0.3265500068664551,-0.9361109733581543,-0.13062000274658203],[-0.3265500068664551,-0.9361109733581543,-0.13062000274658203],[-0.3265500068664551,-0.9361109733581543,-0.13062000274658203],[-0.3265500068664551,-0.9361109733581543,-0.13062000274658203],[-0.3265500068664551,-0.9361109733581543,-0.13062000274658203],[-0.3265500068664551,-0.9361109733581543,-0.13062000274658203],[-0.3265500068664551,-0.9361109733581543,-0.13062000274658203],[-0.013674699701368809,-0.9982560276985168,0.057433899492025375],[-0.013674699701368809,-0.9982560276985168,0.057433899492025375],[-0.013674699701368809,-0.9982560276985168,0.057433899492025375],[-0.013674699701368809,-0.9982560276985168,0.057433899492025375],[-0.013674699701368809,-0.9982560276985168,0.057433899492025375],[-0.013674699701368809,-0.9982560276985168,0.057433899492025375],[0.013674699701368809,-0.9982560276985168,0.057433899492025375],[0.013674699701368809,-0.9982560276985168,0.057433899492025375],[0.013674699701368809,-0.9982560276985168,0.057433899492025375],[0.013674699701368809,-0.9982560276985168,0.057433899492025375],[0.013674699701368809,-0.9982560276985168,0.057433899492025375],[0.013674699701368809,-0.9982560276985168,0.057433899492025375],[-0.002625890076160431,-0.9978389739990234,-0.06564729660749435],[-0.002625890076160431,-0.9978389739990234,-0.06564729660749435],[-0.002625890076160431,-0.9978389739990234,-0.06564729660749435],[-0.002625890076160431,-0.9978389739990234,-0.06564729660749435],[-0.002625890076160431,-0.9978389739990234,-0.06564729660749435],[-0.002625890076160431,-0.9978389739990234,-0.06564729660749435],[0.002625890076160431,-0.9978389739990234,-0.06564729660749435],[0.002625890076160431,-0.9978389739990234,-0.06564729660749435],[0.002625890076160431,-0.9978389739990234,-0.06564729660749435],[0.002625890076160431,-0.9978389739990234,-0.06564729660749435],[0.002625890076160431,-0.9978389739990234,-0.06564729660749435],[0.002625890076160431,-0.9978389739990234,-0.06564729660749435],[0,-1,0],[0,-1,0],[0,-1,0],[0,-1,0],[0,-1,0],[0,-1,0],[0,-1,0],[0,-1,0],[0,-1,0],[0,-1,0],[0,-1,0],[0,-1,0],[0.8173930048942566,0.044183399528265,-0.5743839740753174],[0.8173930048942566,0.044183399528265,-0.5743839740753174],[0.8173930048942566,0.044183399528265,-0.5743839740753174],[0.8173930048942566,0.044183399528265,-0.5743839740753174],[0.8173930048942566,0.044183399528265,-0.5743839740753174],[0.8173930048942566,0.044183399528265,-0.5743839740753174],[-0.8173930048942566,0.044183399528265,-0.5743839740753174],[-0.8173930048942566,0.044183399528265,-0.5743839740753174],[-0.8173930048942566,0.044183399528265,-0.5743839740753174],[-0.8173930048942566,0.044183399528265,-0.5743839740753174],[-0.8173930048942566,0.044183399528265,-0.5743839740753174],[-0.8173930048942566,0.044183399528265,-0.5743839740753174],[0.9493629932403564,0.21437199413776398,0.2296849936246872],[0.9493629932403564,0.21437199413776398,0.2296849936246872],[0.9493629932403564,0.21437199413776398,0.2296849936246872],[0.9493629932403564,0.21437199413776398,0.2296849936246872],[0.9493629932403564,0.21437199413776398,0.2296849936246872],[0.9493629932403564,0.21437199413776398,0.2296849936246872],[-0.9493629932403564,0.21437199413776398,0.2296849936246872],[-0.9493629932403564,0.21437199413776398,0.2296849936246872],[-0.9493629932403564,0.21437199413776398,0.2296849936246872],[-0.9493629932403564,0.21437199413776398,0.2296849936246872],[-0.9493629932403564,0.21437199413776398,0.2296849936246872],[-0.9493629932403564,0.21437199413776398,0.2296849936246872],[0.0824785977602005,0.4123930037021637,0.9072650074958801],[0.0824785977602005,0.4123930037021637,0.9072650074958801],[0.0824785977602005,0.4123930037021637,0.9072650074958801],[0.0824785977602005,0.4123930037021637,0.9072650074958801],[0.0824785977602005,0.4123930037021637,0.9072650074958801],[0.0824785977602005,0.4123930037021637,0.9072650074958801],[-0.0824785977602005,0.4123930037021637,0.9072650074958801],[-0.0824785977602005,0.4123930037021637,0.9072650074958801],[-0.0824785977602005,0.4123930037021637,0.9072650074958801],[-0.0824785977602005,0.4123930037021637,0.9072650074958801],[-0.0824785977602005,0.4123930037021637,0.9072650074958801],[-0.0824785977602005,0.4123930037021637,0.9072650074958801],[-0.8836240172386169,-0.30469799041748047,0.35548099875450134],[-0.8836240172386169,-0.30469799041748047,0.35548099875450134],[-0.8836240172386169,-0.30469799041748047,0.35548099875450134],[-0.8836240172386169,-0.30469799041748047,0.35548099875450134],[-0.8836240172386169,-0.30469799041748047,0.35548099875450134],[-0.8836240172386169,-0.30469799041748047,0.35548099875450134],[0.8836240172386169,-0.30469799041748047,0.35548099875450134],[0.8836240172386169,-0.30469799041748047,0.35548099875450134],[0.8836240172386169,-0.30469799041748047,0.35548099875450134],[0.8836240172386169,-0.30469799041748047,0.35548099875450134],[0.8836240172386169,-0.30469799041748047,0.35548099875450134],[0.8836240172386169,-0.30469799041748047,0.35548099875450134],[0.42070600390434265,-0.22182700037956238,-0.8796589970588684],[0.42070600390434265,-0.22182700037956238,-0.8796589970588684],[0.42070600390434265,-0.22182700037956238,-0.8796589970588684],[0.42070600390434265,-0.22182700037956238,-0.8796589970588684],[0.42070600390434265,-0.22182700037956238,-0.8796589970588684],[0.42070600390434265,-0.22182700037956238,-0.8796589970588684],[-0.42070600390434265,-0.22182700037956238,-0.8796589970588684],[-0.42070600390434265,-0.22182700037956238,-0.8796589970588684],[-0.42070600390434265,-0.22182700037956238,-0.8796589970588684],[-0.42070600390434265,-0.22182700037956238,-0.8796589970588684],[-0.42070600390434265,-0.22182700037956238,-0.8796589970588684],[-0.42070600390434265,-0.22182700037956238,-0.8796589970588684],[0.2873480021953583,-0.7662609815597534,-0.5746960043907166],[0.2873480021953583,-0.7662609815597534,-0.5746960043907166],[0.2873480021953583,-0.7662609815597534,-0.5746960043907166],[0.2873480021953583,-0.7662609815597534,-0.5746960043907166],[0.2873480021953583,-0.7662609815597534,-0.5746960043907166],[0.2873480021953583,-0.7662609815597534,-0.5746960043907166],[-0.2873480021953583,-0.7662609815597534,-0.5746960043907166],[-0.2873480021953583,-0.7662609815597534,-0.5746960043907166],[-0.2873480021953583,-0.7662609815597534,-0.5746960043907166],[-0.2873480021953583,-0.7662609815597534,-0.5746960043907166],[-0.2873480021953583,-0.7662609815597534,-0.5746960043907166],[-0.2873480021953583,-0.7662609815597534,-0.5746960043907166],[-0.6542239785194397,-0.457956999540329,0.601885974407196],[-0.6542239785194397,-0.457956999540329,0.601885974407196],[-0.6542239785194397,-0.457956999540329,0.601885974407196],[-0.6542239785194397,-0.457956999540329,0.601885974407196],[-0.6542239785194397,-0.457956999540329,0.601885974407196],[-0.6542239785194397,-0.457956999540329,0.601885974407196],[0.6542239785194397,-0.457956999540329,0.601885974407196],[0.6542239785194397,-0.457956999540329,0.601885974407196],[0.6542239785194397,-0.457956999540329,0.601885974407196],[0.6542239785194397,-0.457956999540329,0.601885974407196],[0.6542239785194397,-0.457956999540329,0.601885974407196],[0.6542239785194397,-0.457956999540329,0.601885974407196],[0.10522700101137161,-0.6050540208816528,0.7892000079154968],[0.10522700101137161,-0.6050540208816528,0.7892000079154968],[0.10522700101137161,-0.6050540208816528,0.7892000079154968],[0.10522700101137161,-0.6050540208816528,0.7892000079154968],[0.10522700101137161,-0.6050540208816528,0.7892000079154968],[0.10522700101137161,-0.6050540208816528,0.7892000079154968],[-0.10522700101137161,-0.6050540208816528,0.7892000079154968],[-0.10522700101137161,-0.6050540208816528,0.7892000079154968],[-0.10522700101137161,-0.6050540208816528,0.7892000079154968],[-0.10522700101137161,-0.6050540208816528,0.7892000079154968],[-0.10522700101137161,-0.6050540208816528,0.7892000079154968],[-0.10522700101137161,-0.6050540208816528,0.7892000079154968],[0.7581750154495239,-0.5832120180130005,0.29160600900650024],[0.7581750154495239,-0.5832120180130005,0.29160600900650024],[0.7581750154495239,-0.5832120180130005,0.29160600900650024],[0.7581750154495239,-0.5832120180130005,0.29160600900650024],[0.7581750154495239,-0.5832120180130005,0.29160600900650024],[0.7581750154495239,-0.5832120180130005,0.29160600900650024],[-0.7581750154495239,-0.5832120180130005,0.29160600900650024],[-0.7581750154495239,-0.5832120180130005,0.29160600900650024],[-0.7581750154495239,-0.5832120180130005,0.29160600900650024],[-0.7581750154495239,-0.5832120180130005,0.29160600900650024],[-0.7581750154495239,-0.5832120180130005,0.29160600900650024],[-0.7581750154495239,-0.5832120180130005,0.29160600900650024],[0.3889220058917999,-0.5833830237388611,-0.7130240201950073],[0.3889220058917999,-0.5833830237388611,-0.7130240201950073],[0.3889220058917999,-0.5833830237388611,-0.7130240201950073],[0.3889220058917999,-0.5833830237388611,-0.7130240201950073],[0.3889220058917999,-0.5833830237388611,-0.7130240201950073],[0.3889220058917999,-0.5833830237388611,-0.7130240201950073],[-0.3889220058917999,-0.5833830237388611,-0.7130240201950073],[-0.3889220058917999,-0.5833830237388611,-0.7130240201950073],[-0.3889220058917999,-0.5833830237388611,-0.7130240201950073],[-0.3889220058917999,-0.5833830237388611,-0.7130240201950073],[-0.3889220058917999,-0.5833830237388611,-0.7130240201950073],[-0.3889220058917999,-0.5833830237388611,-0.7130240201950073],[0.04627450183033943,-0.9717640280723572,0.23137199878692627],[0.04627450183033943,-0.9717640280723572,0.23137199878692627],[0.04627450183033943,-0.9717640280723572,0.23137199878692627],[0.04627450183033943,-0.9717640280723572,0.23137199878692627],[0.04627450183033943,-0.9717640280723572,0.23137199878692627],[0.04627450183033943,-0.9717640280723572,0.23137199878692627],[-0.04627450183033943,-0.9717640280723572,0.23137199878692627],[-0.04627450183033943,-0.9717640280723572,0.23137199878692627],[-0.04627450183033943,-0.9717640280723572,0.23137199878692627],[-0.04627450183033943,-0.9717640280723572,0.23137199878692627],[-0.04627450183033943,-0.9717640280723572,0.23137199878692627],[-0.04627450183033943,-0.9717640280723572,0.23137199878692627],[0.03348039835691452,-0.9151309728622437,-0.40176498889923096],[0.03348039835691452,-0.9151309728622437,-0.40176498889923096],[0.03348039835691452,-0.9151309728622437,-0.40176498889923096],[0.03348039835691452,-0.9151309728622437,-0.40176498889923096],[0.03348039835691452,-0.9151309728622437,-0.40176498889923096],[0.03348039835691452,-0.9151309728622437,-0.40176498889923096],[-0.03348039835691452,-0.9151309728622437,-0.40176498889923096],[-0.03348039835691452,-0.9151309728622437,-0.40176498889923096],[-0.03348039835691452,-0.9151309728622437,-0.40176498889923096],[-0.03348039835691452,-0.9151309728622437,-0.40176498889923096],[-0.03348039835691452,-0.9151309728622437,-0.40176498889923096],[-0.03348039835691452,-0.9151309728622437,-0.40176498889923096],[-0.4451630115509033,-0.8808540105819702,-0.16101600229740143],[-0.4451630115509033,-0.8808540105819702,-0.16101600229740143],[-0.4451630115509033,-0.8808540105819702,-0.16101600229740143],[-0.4451630115509033,-0.8808540105819702,-0.16101600229740143],[-0.4451630115509033,-0.8808540105819702,-0.16101600229740143],[-0.4451630115509033,-0.8808540105819702,-0.16101600229740143],[0.4451630115509033,-0.8808540105819702,-0.16101600229740143],[0.4451630115509033,-0.8808540105819702,-0.16101600229740143],[0.4451630115509033,-0.8808540105819702,-0.16101600229740143],[0.4451630115509033,-0.8808540105819702,-0.16101600229740143],[0.4451630115509033,-0.8808540105819702,-0.16101600229740143],[0.4451630115509033,-0.8808540105819702,-0.16101600229740143],[-0.21821799874305725,-0.872871994972229,-0.4364359974861145],[-0.21821799874305725,-0.872871994972229,-0.4364359974861145],[-0.21821799874305725,-0.872871994972229,-0.4364359974861145],[-0.21821799874305725,-0.872871994972229,-0.4364359974861145],[-0.21821799874305725,-0.872871994972229,-0.4364359974861145],[-0.21821799874305725,-0.872871994972229,-0.4364359974861145],[0.21821799874305725,-0.872871994972229,-0.4364359974861145],[0.21821799874305725,-0.872871994972229,-0.4364359974861145],[0.21821799874305725,-0.872871994972229,-0.4364359974861145],[0.21821799874305725,-0.872871994972229,-0.4364359974861145],[0.21821799874305725,-0.872871994972229,-0.4364359974861145],[0.21821799874305725,-0.872871994972229,-0.4364359974861145],[0.43406400084495544,-0.8915910124778748,-0.1290459930896759],[0.43406400084495544,-0.8915910124778748,-0.1290459930896759],[0.43406400084495544,-0.8915910124778748,-0.1290459930896759],[0.43406400084495544,-0.8915910124778748,-0.1290459930896759],[0.43406400084495544,-0.8915910124778748,-0.1290459930896759],[0.43406400084495544,-0.8915910124778748,-0.1290459930896759],[-0.43406400084495544,-0.8915910124778748,-0.1290459930896759],[-0.43406400084495544,-0.8915910124778748,-0.1290459930896759],[-0.43406400084495544,-0.8915910124778748,-0.1290459930896759],[-0.43406400084495544,-0.8915910124778748,-0.1290459930896759],[-0.43406400084495544,-0.8915910124778748,-0.1290459930896759],[-0.43406400084495544,-0.8915910124778748,-0.1290459930896759],[0.30075299739837646,-0.9523839950561523,0.050125498324632645],[0.30075299739837646,-0.9523839950561523,0.050125498324632645],[0.30075299739837646,-0.9523839950561523,0.050125498324632645],[0.30075299739837646,-0.9523839950561523,0.050125498324632645],[0.30075299739837646,-0.9523839950561523,0.050125498324632645],[0.30075299739837646,-0.9523839950561523,0.050125498324632645],[-0.30075299739837646,-0.9523839950561523,0.050125498324632645],[-0.30075299739837646,-0.9523839950561523,0.050125498324632645],[-0.30075299739837646,-0.9523839950561523,0.050125498324632645],[-0.30075299739837646,-0.9523839950561523,0.050125498324632645],[-0.30075299739837646,-0.9523839950561523,0.050125498324632645],[-0.30075299739837646,-0.9523839950561523,0.050125498324632645],[0.8122850060462952,-0.49956798553466797,0.3010390102863312],[0.8122850060462952,-0.49956798553466797,0.3010390102863312],[0.8122850060462952,-0.49956798553466797,0.3010390102863312],[0.8122850060462952,-0.49956798553466797,0.3010390102863312],[0.8122850060462952,-0.49956798553466797,0.3010390102863312],[0.8122850060462952,-0.49956798553466797,0.3010390102863312],[-0.8122850060462952,-0.49956798553466797,0.3010390102863312],[-0.8122850060462952,-0.49956798553466797,0.3010390102863312],[-0.8122850060462952,-0.49956798553466797,0.3010390102863312],[-0.8122850060462952,-0.49956798553466797,0.3010390102863312],[-0.8122850060462952,-0.49956798553466797,0.3010390102863312],[-0.8122850060462952,-0.49956798553466797,0.3010390102863312],[0.8753100037574768,-0.40933600068092346,0.25744399428367615],[0.8753100037574768,-0.40933600068092346,0.25744399428367615],[0.8753100037574768,-0.40933600068092346,0.25744399428367615],[0.8753100037574768,-0.40933600068092346,0.25744399428367615],[0.8753100037574768,-0.40933600068092346,0.25744399428367615],[0.8753100037574768,-0.40933600068092346,0.25744399428367615],[-0.8753100037574768,-0.40933600068092346,0.25744399428367615],[-0.8753100037574768,-0.40933600068092346,0.25744399428367615],[-0.8753100037574768,-0.40933600068092346,0.25744399428367615],[-0.8753100037574768,-0.40933600068092346,0.25744399428367615],[-0.8753100037574768,-0.40933600068092346,0.25744399428367615],[-0.8753100037574768,-0.40933600068092346,0.25744399428367615],[0.9384840130805969,-0.30595898628234863,0.16011300683021545],[0.9384840130805969,-0.30595898628234863,0.16011300683021545],[0.9384840130805969,-0.30595898628234863,0.16011300683021545],[0.9384840130805969,-0.30595898628234863,0.16011300683021545],[0.9384840130805969,-0.30595898628234863,0.16011300683021545],[0.9384840130805969,-0.30595898628234863,0.16011300683021545],[-0.9384840130805969,-0.30595898628234863,0.16011300683021545],[-0.9384840130805969,-0.30595898628234863,0.16011300683021545],[-0.9384840130805969,-0.30595898628234863,0.16011300683021545],[-0.9384840130805969,-0.30595898628234863,0.16011300683021545],[-0.9384840130805969,-0.30595898628234863,0.16011300683021545],[-0.9384840130805969,-0.30595898628234863,0.16011300683021545],[0.22370600700378418,-0.7227429747581482,-0.6539099812507629],[0.22370600700378418,-0.7227429747581482,-0.6539099812507629],[0.22370600700378418,-0.7227429747581482,-0.6539099812507629],[0.22370600700378418,-0.7227429747581482,-0.6539099812507629],[0.22370600700378418,-0.7227429747581482,-0.6539099812507629],[0.22370600700378418,-0.7227429747581482,-0.6539099812507629],[-0.22370600700378418,-0.7227429747581482,-0.6539099812507629],[-0.22370600700378418,-0.7227429747581482,-0.6539099812507629],[-0.22370600700378418,-0.7227429747581482,-0.6539099812507629],[-0.22370600700378418,-0.7227429747581482,-0.6539099812507629],[-0.22370600700378418,-0.7227429747581482,-0.6539099812507629],[-0.22370600700378418,-0.7227429747581482,-0.6539099812507629],[-0.1536100059747696,-0.9677429795265198,-0.1996929943561554],[-0.1536100059747696,-0.9677429795265198,-0.1996929943561554],[-0.1536100059747696,-0.9677429795265198,-0.1996929943561554],[-0.1536100059747696,-0.9677429795265198,-0.1996929943561554],[-0.1536100059747696,-0.9677429795265198,-0.1996929943561554],[-0.1536100059747696,-0.9677429795265198,-0.1996929943561554],[0.1536100059747696,-0.9677429795265198,-0.1996929943561554],[0.1536100059747696,-0.9677429795265198,-0.1996929943561554],[0.1536100059747696,-0.9677429795265198,-0.1996929943561554],[0.1536100059747696,-0.9677429795265198,-0.1996929943561554],[0.1536100059747696,-0.9677429795265198,-0.1996929943561554],[0.1536100059747696,-0.9677429795265198,-0.1996929943561554],[-0.2732749879360199,-0.956462025642395,-0.10247799754142761],[-0.2732749879360199,-0.956462025642395,-0.10247799754142761],[-0.2732749879360199,-0.956462025642395,-0.10247799754142761],[-0.2732749879360199,-0.956462025642395,-0.10247799754142761],[-0.2732749879360199,-0.956462025642395,-0.10247799754142761],[-0.2732749879360199,-0.956462025642395,-0.10247799754142761],[0.2732749879360199,-0.956462025642395,-0.10247799754142761],[0.2732749879360199,-0.956462025642395,-0.10247799754142761],[0.2732749879360199,-0.956462025642395,-0.10247799754142761],[0.2732749879360199,-0.956462025642395,-0.10247799754142761],[0.2732749879360199,-0.956462025642395,-0.10247799754142761],[0.2732749879360199,-0.956462025642395,-0.10247799754142761],[-0.09758999943733215,-0.9758999943733215,0.1951799988746643],[-0.09758999943733215,-0.9758999943733215,0.1951799988746643],[-0.09758999943733215,-0.9758999943733215,0.1951799988746643],[-0.09758999943733215,-0.9758999943733215,0.1951799988746643],[-0.09758999943733215,-0.9758999943733215,0.1951799988746643],[-0.09758999943733215,-0.9758999943733215,0.1951799988746643],[0.09758999943733215,-0.9758999943733215,0.1951799988746643],[0.09758999943733215,-0.9758999943733215,0.1951799988746643],[0.09758999943733215,-0.9758999943733215,0.1951799988746643],[0.09758999943733215,-0.9758999943733215,0.1951799988746643],[0.09758999943733215,-0.9758999943733215,0.1951799988746643],[0.09758999943733215,-0.9758999943733215,0.1951799988746643],[-0.15823499858379364,-0.27125999331474304,0.9494100213050842],[-0.15823499858379364,-0.27125999331474304,0.9494100213050842],[-0.15823499858379364,-0.27125999331474304,0.9494100213050842],[-0.15823499858379364,-0.27125999331474304,0.9494100213050842],[-0.15823499858379364,-0.27125999331474304,0.9494100213050842],[-0.15823499858379364,-0.27125999331474304,0.9494100213050842],[0.15823499858379364,-0.27125999331474304,0.9494100213050842],[0.15823499858379364,-0.27125999331474304,0.9494100213050842],[0.15823499858379364,-0.27125999331474304,0.9494100213050842],[0.15823499858379364,-0.27125999331474304,0.9494100213050842],[0.15823499858379364,-0.27125999331474304,0.9494100213050842],[0.15823499858379364,-0.27125999331474304,0.9494100213050842],[-0.6934300065040588,-0.13278399407863617,0.7081829905509949],[-0.6934300065040588,-0.13278399407863617,0.7081829905509949],[-0.6934300065040588,-0.13278399407863617,0.7081829905509949],[-0.6934300065040588,-0.13278399407863617,0.7081829905509949],[-0.6934300065040588,-0.13278399407863617,0.7081829905509949],[-0.6934300065040588,-0.13278399407863617,0.7081829905509949],[0.6934300065040588,-0.13278399407863617,0.7081829905509949],[0.6934300065040588,-0.13278399407863617,0.7081829905509949],[0.6934300065040588,-0.13278399407863617,0.7081829905509949],[0.6934300065040588,-0.13278399407863617,0.7081829905509949],[0.6934300065040588,-0.13278399407863617,0.7081829905509949],[0.6934300065040588,-0.13278399407863617,0.7081829905509949],[-1,0,0],[-1,0,0],[-1,0,0],[-1,0,0],[-1,0,0],[-1,0,0],[1,0,0],[1,0,0],[1,0,0],[1,0,0],[1,0,0],[1,0,0],[0.30514100193977356,-0.1181190013885498,-0.9449530243873596],[0.30514100193977356,-0.1181190013885498,-0.9449530243873596],[0.30514100193977356,-0.1181190013885498,-0.9449530243873596],[0.30514100193977356,-0.1181190013885498,-0.9449530243873596],[0.30514100193977356,-0.1181190013885498,-0.9449530243873596],[0.30514100193977356,-0.1181190013885498,-0.9449530243873596],[-0.30514100193977356,-0.1181190013885498,-0.9449530243873596],[-0.30514100193977356,-0.1181190013885498,-0.9449530243873596],[-0.30514100193977356,-0.1181190013885498,-0.9449530243873596],[-0.30514100193977356,-0.1181190013885498,-0.9449530243873596],[-0.30514100193977356,-0.1181190013885498,-0.9449530243873596],[-0.30514100193977356,-0.1181190013885498,-0.9449530243873596],[0.02981420047581196,-0.9540560245513916,-0.2981419861316681],[0.02981420047581196,-0.9540560245513916,-0.2981419861316681],[0.02981420047581196,-0.9540560245513916,-0.2981419861316681],[0.02981420047581196,-0.9540560245513916,-0.2981419861316681],[0.02981420047581196,-0.9540560245513916,-0.2981419861316681],[0.02981420047581196,-0.9540560245513916,-0.2981419861316681],[-0.02981420047581196,-0.9540560245513916,-0.2981419861316681],[-0.02981420047581196,-0.9540560245513916,-0.2981419861316681],[-0.02981420047581196,-0.9540560245513916,-0.2981419861316681],[-0.02981420047581196,-0.9540560245513916,-0.2981419861316681],[-0.02981420047581196,-0.9540560245513916,-0.2981419861316681],[-0.02981420047581196,-0.9540560245513916,-0.2981419861316681],[0.13529300689697266,-0.9277200102806091,-0.3478949964046478],[0.13529300689697266,-0.9277200102806091,-0.3478949964046478],[0.13529300689697266,-0.9277200102806091,-0.3478949964046478],[-0.13529300689697266,-0.9277200102806091,-0.3478949964046478],[-0.13529300689697266,-0.9277200102806091,-0.3478949964046478],[-0.13529300689697266,-0.9277200102806091,-0.3478949964046478],[-0.508542001247406,-0.8157860040664673,-0.27546000480651855],[-0.508542001247406,-0.8157860040664673,-0.27546000480651855],[-0.508542001247406,-0.8157860040664673,-0.27546000480651855],[-0.508542001247406,-0.8157860040664673,-0.27546000480651855],[-0.508542001247406,-0.8157860040664673,-0.27546000480651855],[-0.508542001247406,-0.8157860040664673,-0.27546000480651855],[0.508542001247406,-0.8157860040664673,-0.27546000480651855],[0.508542001247406,-0.8157860040664673,-0.27546000480651855],[0.508542001247406,-0.8157860040664673,-0.27546000480651855],[0.508542001247406,-0.8157860040664673,-0.27546000480651855],[0.508542001247406,-0.8157860040664673,-0.27546000480651855],[0.508542001247406,-0.8157860040664673,-0.27546000480651855],[-0.38427698612213135,-0.9222649931907654,-0.04192119836807251],[-0.38427698612213135,-0.9222649931907654,-0.04192119836807251],[-0.38427698612213135,-0.9222649931907654,-0.04192119836807251],[-0.38427698612213135,-0.9222649931907654,-0.04192119836807251],[-0.38427698612213135,-0.9222649931907654,-0.04192119836807251],[-0.38427698612213135,-0.9222649931907654,-0.04192119836807251],[0.38427698612213135,-0.9222649931907654,-0.04192119836807251],[0.38427698612213135,-0.9222649931907654,-0.04192119836807251],[0.38427698612213135,-0.9222649931907654,-0.04192119836807251],[0.38427698612213135,-0.9222649931907654,-0.04192119836807251],[0.38427698612213135,-0.9222649931907654,-0.04192119836807251],[0.38427698612213135,-0.9222649931907654,-0.04192119836807251],[-0.20828799903392792,-0.9773529767990112,0.03738509863615036],[-0.20828799903392792,-0.9773529767990112,0.03738509863615036],[-0.20828799903392792,-0.9773529767990112,0.03738509863615036],[-0.20828799903392792,-0.9773529767990112,0.03738509863615036],[-0.20828799903392792,-0.9773529767990112,0.03738509863615036],[-0.20828799903392792,-0.9773529767990112,0.03738509863615036],[0.20828799903392792,-0.9773529767990112,0.03738509863615036],[0.20828799903392792,-0.9773529767990112,0.03738509863615036],[0.20828799903392792,-0.9773529767990112,0.03738509863615036],[0.20828799903392792,-0.9773529767990112,0.03738509863615036],[0.20828799903392792,-0.9773529767990112,0.03738509863615036],[0.20828799903392792,-0.9773529767990112,0.03738509863615036],[-0.5720779895782471,-0.6674240231513977,-0.47673100233078003],[-0.5720779895782471,-0.6674240231513977,-0.47673100233078003],[-0.5720779895782471,-0.6674240231513977,-0.47673100233078003],[-0.5720779895782471,-0.6674240231513977,-0.47673100233078003],[-0.5720779895782471,-0.6674240231513977,-0.47673100233078003],[-0.5720779895782471,-0.6674240231513977,-0.47673100233078003],[0.5720779895782471,-0.6674240231513977,-0.47673100233078003],[0.5720779895782471,-0.6674240231513977,-0.47673100233078003],[0.5720779895782471,-0.6674240231513977,-0.47673100233078003],[0.5720779895782471,-0.6674240231513977,-0.47673100233078003],[0.5720779895782471,-0.6674240231513977,-0.47673100233078003],[0.5720779895782471,-0.6674240231513977,-0.47673100233078003],[-0.13692200183868408,-0.6435340046882629,-0.7530710101127625],[-0.13692200183868408,-0.6435340046882629,-0.7530710101127625],[-0.13692200183868408,-0.6435340046882629,-0.7530710101127625],[-0.13692200183868408,-0.6435340046882629,-0.7530710101127625],[-0.13692200183868408,-0.6435340046882629,-0.7530710101127625],[-0.13692200183868408,-0.6435340046882629,-0.7530710101127625],[0.13692200183868408,-0.6435340046882629,-0.7530710101127625],[0.13692200183868408,-0.6435340046882629,-0.7530710101127625],[0.13692200183868408,-0.6435340046882629,-0.7530710101127625],[0.13692200183868408,-0.6435340046882629,-0.7530710101127625],[0.13692200183868408,-0.6435340046882629,-0.7530710101127625],[0.13692200183868408,-0.6435340046882629,-0.7530710101127625],[0.4088430106639862,-0.6814050078392029,-0.6070700287818909],[0.4088430106639862,-0.6814050078392029,-0.6070700287818909],[0.4088430106639862,-0.6814050078392029,-0.6070700287818909],[0.4088430106639862,-0.6814050078392029,-0.6070700287818909],[0.4088430106639862,-0.6814050078392029,-0.6070700287818909],[0.4088430106639862,-0.6814050078392029,-0.6070700287818909],[-0.4088430106639862,-0.6814050078392029,-0.6070700287818909],[-0.4088430106639862,-0.6814050078392029,-0.6070700287818909],[-0.4088430106639862,-0.6814050078392029,-0.6070700287818909],[-0.4088430106639862,-0.6814050078392029,-0.6070700287818909],[-0.4088430106639862,-0.6814050078392029,-0.6070700287818909],[-0.4088430106639862,-0.6814050078392029,-0.6070700287818909],[0.5740299820899963,-0.7070379853248596,-0.4130220115184784],[0.5740299820899963,-0.7070379853248596,-0.4130220115184784],[0.5740299820899963,-0.7070379853248596,-0.4130220115184784],[0.5740299820899963,-0.7070379853248596,-0.4130220115184784],[0.5740299820899963,-0.7070379853248596,-0.4130220115184784],[0.5740299820899963,-0.7070379853248596,-0.4130220115184784],[-0.5740299820899963,-0.7070379853248596,-0.4130220115184784],[-0.5740299820899963,-0.7070379853248596,-0.4130220115184784],[-0.5740299820899963,-0.7070379853248596,-0.4130220115184784],[-0.5740299820899963,-0.7070379853248596,-0.4130220115184784],[-0.5740299820899963,-0.7070379853248596,-0.4130220115184784],[-0.5740299820899963,-0.7070379853248596,-0.4130220115184784],[0.5665339827537537,-0.8183280229568481,-0.09684350341558456],[0.5665339827537537,-0.8183280229568481,-0.09684350341558456],[0.5665339827537537,-0.8183280229568481,-0.09684350341558456],[0.5665339827537537,-0.8183280229568481,-0.09684350341558456],[0.5665339827537537,-0.8183280229568481,-0.09684350341558456],[0.5665339827537537,-0.8183280229568481,-0.09684350341558456],[-0.5665339827537537,-0.8183280229568481,-0.09684350341558456],[-0.5665339827537537,-0.8183280229568481,-0.09684350341558456],[-0.5665339827537537,-0.8183280229568481,-0.09684350341558456],[-0.5665339827537537,-0.8183280229568481,-0.09684350341558456],[-0.5665339827537537,-0.8183280229568481,-0.09684350341558456],[-0.5665339827537537,-0.8183280229568481,-0.09684350341558456],[0.5703359842300415,-0.8128920197486877,0.11800000071525574],[0.5703359842300415,-0.8128920197486877,0.11800000071525574],[0.5703359842300415,-0.8128920197486877,0.11800000071525574],[0.5703359842300415,-0.8128920197486877,0.11800000071525574],[0.5703359842300415,-0.8128920197486877,0.11800000071525574],[0.5703359842300415,-0.8128920197486877,0.11800000071525574],[-0.5703359842300415,-0.8128920197486877,0.11800000071525574],[-0.5703359842300415,-0.8128920197486877,0.11800000071525574],[-0.5703359842300415,-0.8128920197486877,0.11800000071525574],[-0.5703359842300415,-0.8128920197486877,0.11800000071525574],[-0.5703359842300415,-0.8128920197486877,0.11800000071525574],[-0.5703359842300415,-0.8128920197486877,0.11800000071525574],[0.48228898644447327,-0.6718789935112,0.5621169805526733],[0.48228898644447327,-0.6718789935112,0.5621169805526733],[0.48228898644447327,-0.6718789935112,0.5621169805526733],[0.48228898644447327,-0.6718789935112,0.5621169805526733],[0.48228898644447327,-0.6718789935112,0.5621169805526733],[0.48228898644447327,-0.6718789935112,0.5621169805526733],[-0.48228898644447327,-0.6718789935112,0.5621169805526733],[-0.48228898644447327,-0.6718789935112,0.5621169805526733],[-0.48228898644447327,-0.6718789935112,0.5621169805526733],[-0.48228898644447327,-0.6718789935112,0.5621169805526733],[-0.48228898644447327,-0.6718789935112,0.5621169805526733],[-0.48228898644447327,-0.6718789935112,0.5621169805526733],[0.2604070007801056,-0.7472550272941589,0.6113899946212769],[0.2604070007801056,-0.7472550272941589,0.6113899946212769],[0.2604070007801056,-0.7472550272941589,0.6113899946212769],[0.2604070007801056,-0.7472550272941589,0.6113899946212769],[0.2604070007801056,-0.7472550272941589,0.6113899946212769],[0.2604070007801056,-0.7472550272941589,0.6113899946212769],[-0.2604070007801056,-0.7472550272941589,0.6113899946212769],[-0.2604070007801056,-0.7472550272941589,0.6113899946212769],[-0.2604070007801056,-0.7472550272941589,0.6113899946212769],[-0.2604070007801056,-0.7472550272941589,0.6113899946212769],[-0.2604070007801056,-0.7472550272941589,0.6113899946212769],[-0.2604070007801056,-0.7472550272941589,0.6113899946212769],[0.16395600140094757,-0.9181560277938843,0.3607040047645569],[0.16395600140094757,-0.9181560277938843,0.3607040047645569],[0.16395600140094757,-0.9181560277938843,0.3607040047645569],[0.16395600140094757,-0.9181560277938843,0.3607040047645569],[0.16395600140094757,-0.9181560277938843,0.3607040047645569],[0.16395600140094757,-0.9181560277938843,0.3607040047645569],[-0.16395600140094757,-0.9181560277938843,0.3607040047645569],[-0.16395600140094757,-0.9181560277938843,0.3607040047645569],[-0.16395600140094757,-0.9181560277938843,0.3607040047645569],[-0.16395600140094757,-0.9181560277938843,0.3607040047645569],[-0.16395600140094757,-0.9181560277938843,0.3607040047645569],[-0.16395600140094757,-0.9181560277938843,0.3607040047645569],[-0.017819900065660477,-0.9682160019874573,0.2494789958000183],[-0.017819900065660477,-0.9682160019874573,0.2494789958000183],[-0.017819900065660477,-0.9682160019874573,0.2494789958000183],[-0.017819900065660477,-0.9682160019874573,0.2494789958000183],[-0.017819900065660477,-0.9682160019874573,0.2494789958000183],[-0.017819900065660477,-0.9682160019874573,0.2494789958000183],[0.017819900065660477,-0.9682160019874573,0.2494789958000183],[0.017819900065660477,-0.9682160019874573,0.2494789958000183],[0.017819900065660477,-0.9682160019874573,0.2494789958000183],[0.017819900065660477,-0.9682160019874573,0.2494789958000183],[0.017819900065660477,-0.9682160019874573,0.2494789958000183],[0.017819900065660477,-0.9682160019874573,0.2494789958000183],[0.3273389935493469,-0.8481050133705139,-0.41661301255226135],[0.3273389935493469,-0.8481050133705139,-0.41661301255226135],[0.3273389935493469,-0.8481050133705139,-0.41661301255226135],[0.3273389935493469,-0.8481050133705139,-0.41661301255226135],[0.3273389935493469,-0.8481050133705139,-0.41661301255226135],[0.3273389935493469,-0.8481050133705139,-0.41661301255226135],[-0.3273389935493469,-0.8481050133705139,-0.41661301255226135],[-0.3273389935493469,-0.8481050133705139,-0.41661301255226135],[-0.3273389935493469,-0.8481050133705139,-0.41661301255226135],[-0.3273389935493469,-0.8481050133705139,-0.41661301255226135],[-0.3273389935493469,-0.8481050133705139,-0.41661301255226135],[-0.3273389935493469,-0.8481050133705139,-0.41661301255226135],[0.2810699939727783,-0.9235159754753113,-0.26099398732185364],[0.2810699939727783,-0.9235159754753113,-0.26099398732185364],[0.2810699939727783,-0.9235159754753113,-0.26099398732185364],[0.2810699939727783,-0.9235159754753113,-0.26099398732185364],[0.2810699939727783,-0.9235159754753113,-0.26099398732185364],[0.2810699939727783,-0.9235159754753113,-0.26099398732185364],[-0.2810699939727783,-0.9235159754753113,-0.26099398732185364],[-0.2810699939727783,-0.9235159754753113,-0.26099398732185364],[-0.2810699939727783,-0.9235159754753113,-0.26099398732185364],[-0.2810699939727783,-0.9235159754753113,-0.26099398732185364],[-0.2810699939727783,-0.9235159754753113,-0.26099398732185364],[-0.2810699939727783,-0.9235159754753113,-0.26099398732185364],[-0.2541930079460144,-0.7149159908294678,-0.6513680219650269],[-0.2541930079460144,-0.7149159908294678,-0.6513680219650269],[-0.2541930079460144,-0.7149159908294678,-0.6513680219650269],[-0.2541930079460144,-0.7149159908294678,-0.6513680219650269],[-0.2541930079460144,-0.7149159908294678,-0.6513680219650269],[-0.2541930079460144,-0.7149159908294678,-0.6513680219650269],[0.2541930079460144,-0.7149159908294678,-0.6513680219650269],[0.2541930079460144,-0.7149159908294678,-0.6513680219650269],[0.2541930079460144,-0.7149159908294678,-0.6513680219650269],[0.2541930079460144,-0.7149159908294678,-0.6513680219650269],[0.2541930079460144,-0.7149159908294678,-0.6513680219650269],[0.2541930079460144,-0.7149159908294678,-0.6513680219650269],[-0.02601570077240467,-0.5333229899406433,-0.8455119729042053],[-0.02601570077240467,-0.5333229899406433,-0.8455119729042053],[-0.02601570077240467,-0.5333229899406433,-0.8455119729042053],[-0.02601570077240467,-0.5333229899406433,-0.8455119729042053],[-0.02601570077240467,-0.5333229899406433,-0.8455119729042053],[-0.02601570077240467,-0.5333229899406433,-0.8455119729042053],[0.02601570077240467,-0.5333229899406433,-0.8455119729042053],[0.02601570077240467,-0.5333229899406433,-0.8455119729042053],[0.02601570077240467,-0.5333229899406433,-0.8455119729042053],[0.02601570077240467,-0.5333229899406433,-0.8455119729042053],[0.02601570077240467,-0.5333229899406433,-0.8455119729042053],[0.02601570077240467,-0.5333229899406433,-0.8455119729042053],[-0.35180801153182983,-0.8990659713745117,-0.2605989873409271],[-0.35180801153182983,-0.8990659713745117,-0.2605989873409271],[-0.35180801153182983,-0.8990659713745117,-0.2605989873409271],[-0.35180801153182983,-0.8990659713745117,-0.2605989873409271],[-0.35180801153182983,-0.8990659713745117,-0.2605989873409271],[-0.35180801153182983,-0.8990659713745117,-0.2605989873409271],[0.35180801153182983,-0.8990659713745117,-0.2605989873409271],[0.35180801153182983,-0.8990659713745117,-0.2605989873409271],[0.35180801153182983,-0.8990659713745117,-0.2605989873409271],[0.35180801153182983,-0.8990659713745117,-0.2605989873409271],[0.35180801153182983,-0.8990659713745117,-0.2605989873409271],[0.35180801153182983,-0.8990659713745117,-0.2605989873409271],[-0.3523080050945282,-0.9358189702033997,-0.011009600013494492],[-0.3523080050945282,-0.9358189702033997,-0.011009600013494492],[-0.3523080050945282,-0.9358189702033997,-0.011009600013494492],[-0.3523080050945282,-0.9358189702033997,-0.011009600013494492],[-0.3523080050945282,-0.9358189702033997,-0.011009600013494492],[-0.3523080050945282,-0.9358189702033997,-0.011009600013494492],[0.3523080050945282,-0.9358189702033997,-0.011009600013494492],[0.3523080050945282,-0.9358189702033997,-0.011009600013494492],[0.3523080050945282,-0.9358189702033997,-0.011009600013494492],[0.3523080050945282,-0.9358189702033997,-0.011009600013494492],[0.3523080050945282,-0.9358189702033997,-0.011009600013494492],[0.3523080050945282,-0.9358189702033997,-0.011009600013494492],[-0.13165399432182312,-0.8776909708976746,0.4607880115509033],[-0.13165399432182312,-0.8776909708976746,0.4607880115509033],[-0.13165399432182312,-0.8776909708976746,0.4607880115509033],[-0.13165399432182312,-0.8776909708976746,0.4607880115509033],[-0.13165399432182312,-0.8776909708976746,0.4607880115509033],[-0.13165399432182312,-0.8776909708976746,0.4607880115509033],[0.13165399432182312,-0.8776909708976746,0.4607880115509033],[0.13165399432182312,-0.8776909708976746,0.4607880115509033],[0.13165399432182312,-0.8776909708976746,0.4607880115509033],[0.13165399432182312,-0.8776909708976746,0.4607880115509033],[0.13165399432182312,-0.8776909708976746,0.4607880115509033],[0.13165399432182312,-0.8776909708976746,0.4607880115509033],[-0.034219298511743546,-0.7870439887046814,0.6159470081329346],[-0.034219298511743546,-0.7870439887046814,0.6159470081329346],[-0.034219298511743546,-0.7870439887046814,0.6159470081329346],[-0.034219298511743546,-0.7870439887046814,0.6159470081329346],[-0.034219298511743546,-0.7870439887046814,0.6159470081329346],[-0.034219298511743546,-0.7870439887046814,0.6159470081329346],[0.034219298511743546,-0.7870439887046814,0.6159470081329346],[0.034219298511743546,-0.7870439887046814,0.6159470081329346],[0.034219298511743546,-0.7870439887046814,0.6159470081329346],[0.034219298511743546,-0.7870439887046814,0.6159470081329346],[0.034219298511743546,-0.7870439887046814,0.6159470081329346],[0.034219298511743546,-0.7870439887046814,0.6159470081329346],[0.36026298999786377,-0.7277309894561768,0.5836259722709656],[0.36026298999786377,-0.7277309894561768,0.5836259722709656],[0.36026298999786377,-0.7277309894561768,0.5836259722709656],[0.36026298999786377,-0.7277309894561768,0.5836259722709656],[0.36026298999786377,-0.7277309894561768,0.5836259722709656],[0.36026298999786377,-0.7277309894561768,0.5836259722709656],[-0.36026298999786377,-0.7277309894561768,0.5836259722709656],[-0.36026298999786377,-0.7277309894561768,0.5836259722709656],[-0.36026298999786377,-0.7277309894561768,0.5836259722709656],[-0.36026298999786377,-0.7277309894561768,0.5836259722709656],[-0.36026298999786377,-0.7277309894561768,0.5836259722709656],[-0.36026298999786377,-0.7277309894561768,0.5836259722709656],[0.49878400564193726,-0.6858279705047607,0.5299580097198486],[0.49878400564193726,-0.6858279705047607,0.5299580097198486],[0.49878400564193726,-0.6858279705047607,0.5299580097198486],[0.49878400564193726,-0.6858279705047607,0.5299580097198486],[0.49878400564193726,-0.6858279705047607,0.5299580097198486],[0.49878400564193726,-0.6858279705047607,0.5299580097198486],[-0.49878400564193726,-0.6858279705047607,0.5299580097198486],[-0.49878400564193726,-0.6858279705047607,0.5299580097198486],[-0.49878400564193726,-0.6858279705047607,0.5299580097198486],[-0.49878400564193726,-0.6858279705047607,0.5299580097198486],[-0.49878400564193726,-0.6858279705047607,0.5299580097198486],[-0.49878400564193726,-0.6858279705047607,0.5299580097198486],[0.6666669845581055,-0.6666669845581055,-0.33333298563957214],[0.6666669845581055,-0.6666669845581055,-0.33333298563957214],[0.6666669845581055,-0.6666669845581055,-0.33333298563957214],[0.6666669845581055,-0.6666669845581055,-0.33333298563957214],[0.6666669845581055,-0.6666669845581055,-0.33333298563957214],[0.6666669845581055,-0.6666669845581055,-0.33333298563957214],[-0.6666669845581055,-0.6666669845581055,-0.33333298563957214],[-0.6666669845581055,-0.6666669845581055,-0.33333298563957214],[-0.6666669845581055,-0.6666669845581055,-0.33333298563957214],[-0.6666669845581055,-0.6666669845581055,-0.33333298563957214],[-0.6666669845581055,-0.6666669845581055,-0.33333298563957214],[-0.6666669845581055,-0.6666669845581055,-0.33333298563957214],[0.8164659738540649,-0.5727450251579285,-0.07311639934778214],[0.8164659738540649,-0.5727450251579285,-0.07311639934778214],[0.8164659738540649,-0.5727450251579285,-0.07311639934778214],[0.8164659738540649,-0.5727450251579285,-0.07311639934778214],[0.8164659738540649,-0.5727450251579285,-0.07311639934778214],[0.8164659738540649,-0.5727450251579285,-0.07311639934778214],[-0.8164659738540649,-0.5727450251579285,-0.07311639934778214],[-0.8164659738540649,-0.5727450251579285,-0.07311639934778214],[-0.8164659738540649,-0.5727450251579285,-0.07311639934778214],[-0.8164659738540649,-0.5727450251579285,-0.07311639934778214],[-0.8164659738540649,-0.5727450251579285,-0.07311639934778214],[-0.8164659738540649,-0.5727450251579285,-0.07311639934778214],[0.7840099930763245,-0.6097850203514099,0.11614999920129776],[0.7840099930763245,-0.6097850203514099,0.11614999920129776],[0.7840099930763245,-0.6097850203514099,0.11614999920129776],[0.7840099930763245,-0.6097850203514099,0.11614999920129776],[0.7840099930763245,-0.6097850203514099,0.11614999920129776],[0.7840099930763245,-0.6097850203514099,0.11614999920129776],[-0.7840099930763245,-0.6097850203514099,0.11614999920129776],[-0.7840099930763245,-0.6097850203514099,0.11614999920129776],[-0.7840099930763245,-0.6097850203514099,0.11614999920129776],[-0.7840099930763245,-0.6097850203514099,0.11614999920129776],[-0.7840099930763245,-0.6097850203514099,0.11614999920129776],[-0.7840099930763245,-0.6097850203514099,0.11614999920129776],[-0.5306289792060852,0.2461470067501068,0.8110759854316711],[-0.5306289792060852,0.2461470067501068,0.8110759854316711],[-0.5306289792060852,0.2461470067501068,0.8110759854316711],[-0.5306289792060852,0.2461470067501068,0.8110759854316711],[-0.5306289792060852,0.2461470067501068,0.8110759854316711],[-0.5306289792060852,0.2461470067501068,0.8110759854316711],[0.5306289792060852,0.2461470067501068,0.8110759854316711],[0.5306289792060852,0.2461470067501068,0.8110759854316711],[0.5306289792060852,0.2461470067501068,0.8110759854316711],[0.5306289792060852,0.2461470067501068,0.8110759854316711],[0.5306289792060852,0.2461470067501068,0.8110759854316711],[0.5306289792060852,0.2461470067501068,0.8110759854316711],[-0.8511090278625488,0.3729580044746399,0.3694800138473511],[-0.8511090278625488,0.3729580044746399,0.3694800138473511],[-0.8511090278625488,0.3729580044746399,0.3694800138473511],[-0.8511090278625488,0.3729580044746399,0.3694800138473511],[-0.8511090278625488,0.3729580044746399,0.3694800138473511],[-0.8511090278625488,0.3729580044746399,0.3694800138473511],[0.8511090278625488,0.3729580044746399,0.3694800138473511],[0.8511090278625488,0.3729580044746399,0.3694800138473511],[0.8511090278625488,0.3729580044746399,0.3694800138473511],[0.8511090278625488,0.3729580044746399,0.3694800138473511],[0.8511090278625488,0.3729580044746399,0.3694800138473511],[0.8511090278625488,0.3729580044746399,0.3694800138473511],[-0.2445860058069229,0.433120995759964,0.8675159811973572],[-0.2445860058069229,0.433120995759964,0.8675159811973572],[-0.2445860058069229,0.433120995759964,0.8675159811973572],[-0.2445860058069229,0.433120995759964,0.8675159811973572],[-0.2445860058069229,0.433120995759964,0.8675159811973572],[-0.2445860058069229,0.433120995759964,0.8675159811973572],[0.2445860058069229,0.433120995759964,0.8675159811973572],[0.2445860058069229,0.433120995759964,0.8675159811973572],[0.2445860058069229,0.433120995759964,0.8675159811973572],[0.2445860058069229,0.433120995759964,0.8675159811973572],[0.2445860058069229,0.433120995759964,0.8675159811973572],[0.2445860058069229,0.433120995759964,0.8675159811973572],[0.59238201379776,0.30300599336624146,0.7465059757232666],[0.59238201379776,0.30300599336624146,0.7465059757232666],[0.59238201379776,0.30300599336624146,0.7465059757232666],[0.59238201379776,0.30300599336624146,0.7465059757232666],[0.59238201379776,0.30300599336624146,0.7465059757232666],[0.59238201379776,0.30300599336624146,0.7465059757232666],[-0.59238201379776,0.30300599336624146,0.7465059757232666],[-0.59238201379776,0.30300599336624146,0.7465059757232666],[-0.59238201379776,0.30300599336624146,0.7465059757232666],[-0.59238201379776,0.30300599336624146,0.7465059757232666],[-0.59238201379776,0.30300599336624146,0.7465059757232666],[-0.59238201379776,0.30300599336624146,0.7465059757232666],[0.3685480058193207,0.3117769956588745,0.8757669925689697],[0.3685480058193207,0.3117769956588745,0.8757669925689697],[0.3685480058193207,0.3117769956588745,0.8757669925689697],[0.3685480058193207,0.3117769956588745,0.8757669925689697],[0.3685480058193207,0.3117769956588745,0.8757669925689697],[0.3685480058193207,0.3117769956588745,0.8757669925689697],[-0.3685480058193207,0.3117769956588745,0.8757669925689697],[-0.3685480058193207,0.3117769956588745,0.8757669925689697],[-0.3685480058193207,0.3117769956588745,0.8757669925689697],[-0.3685480058193207,0.3117769956588745,0.8757669925689697],[-0.3685480058193207,0.3117769956588745,0.8757669925689697],[-0.3685480058193207,0.3117769956588745,0.8757669925689697],[0.28213998675346375,0.28798800706863403,0.9151279926300049],[0.28213998675346375,0.28798800706863403,0.9151279926300049],[0.28213998675346375,0.28798800706863403,0.9151279926300049],[0.28213998675346375,0.28798800706863403,0.9151279926300049],[0.28213998675346375,0.28798800706863403,0.9151279926300049],[0.28213998675346375,0.28798800706863403,0.9151279926300049],[-0.28213998675346375,0.28798800706863403,0.9151279926300049],[-0.28213998675346375,0.28798800706863403,0.9151279926300049],[-0.28213998675346375,0.28798800706863403,0.9151279926300049],[-0.28213998675346375,0.28798800706863403,0.9151279926300049],[-0.28213998675346375,0.28798800706863403,0.9151279926300049],[-0.28213998675346375,0.28798800706863403,0.9151279926300049],[0.8561310172080994,0.4990769922733307,0.13402099907398224],[0.8561310172080994,0.4990769922733307,0.13402099907398224],[0.8561310172080994,0.4990769922733307,0.13402099907398224],[0.8561310172080994,0.4990769922733307,0.13402099907398224],[0.8561310172080994,0.4990769922733307,0.13402099907398224],[0.8561310172080994,0.4990769922733307,0.13402099907398224],[-0.8561310172080994,0.4990769922733307,0.13402099907398224],[-0.8561310172080994,0.4990769922733307,0.13402099907398224],[-0.8561310172080994,0.4990769922733307,0.13402099907398224],[-0.8561310172080994,0.4990769922733307,0.13402099907398224],[-0.8561310172080994,0.4990769922733307,0.13402099907398224],[-0.8561310172080994,0.4990769922733307,0.13402099907398224],[0.5342260003089905,0.4375770092010498,-0.7232760190963745],[0.5342260003089905,0.4375770092010498,-0.7232760190963745],[0.5342260003089905,0.4375770092010498,-0.7232760190963745],[0.5342260003089905,0.4375770092010498,-0.7232760190963745],[0.5342260003089905,0.4375770092010498,-0.7232760190963745],[0.5342260003089905,0.4375770092010498,-0.7232760190963745],[-0.5342260003089905,0.4375770092010498,-0.7232760190963745],[-0.5342260003089905,0.4375770092010498,-0.7232760190963745],[-0.5342260003089905,0.4375770092010498,-0.7232760190963745],[-0.5342260003089905,0.4375770092010498,-0.7232760190963745],[-0.5342260003089905,0.4375770092010498,-0.7232760190963745],[-0.5342260003089905,0.4375770092010498,-0.7232760190963745],[0.3849030137062073,0.4368000030517578,-0.8130530118942261],[0.3849030137062073,0.4368000030517578,-0.8130530118942261],[0.3849030137062073,0.4368000030517578,-0.8130530118942261],[0.3849030137062073,0.4368000030517578,-0.8130530118942261],[0.3849030137062073,0.4368000030517578,-0.8130530118942261],[0.3849030137062073,0.4368000030517578,-0.8130530118942261],[-0.3849030137062073,0.4368000030517578,-0.8130530118942261],[-0.3849030137062073,0.4368000030517578,-0.8130530118942261],[-0.3849030137062073,0.4368000030517578,-0.8130530118942261],[-0.3849030137062073,0.4368000030517578,-0.8130530118942261],[-0.3849030137062073,0.4368000030517578,-0.8130530118942261],[-0.3849030137062073,0.4368000030517578,-0.8130530118942261],[0.23351900279521942,0.7800170183181763,-0.5805529952049255],[0.23351900279521942,0.7800170183181763,-0.5805529952049255],[0.23351900279521942,0.7800170183181763,-0.5805529952049255],[0.23351900279521942,0.7800170183181763,-0.5805529952049255],[0.23351900279521942,0.7800170183181763,-0.5805529952049255],[0.23351900279521942,0.7800170183181763,-0.5805529952049255],[-0.23351900279521942,0.7800170183181763,-0.5805529952049255],[-0.23351900279521942,0.7800170183181763,-0.5805529952049255],[-0.23351900279521942,0.7800170183181763,-0.5805529952049255],[-0.23351900279521942,0.7800170183181763,-0.5805529952049255],[-0.23351900279521942,0.7800170183181763,-0.5805529952049255],[-0.23351900279521942,0.7800170183181763,-0.5805529952049255],[0.2448659986257553,0.9678019881248474,-0.058301400393247604],[0.2448659986257553,0.9678019881248474,-0.058301400393247604],[0.2448659986257553,0.9678019881248474,-0.058301400393247604],[0.2448659986257553,0.9678019881248474,-0.058301400393247604],[0.2448659986257553,0.9678019881248474,-0.058301400393247604],[0.2448659986257553,0.9678019881248474,-0.058301400393247604],[-0.2448659986257553,0.9678019881248474,-0.058301400393247604],[-0.2448659986257553,0.9678019881248474,-0.058301400393247604],[-0.2448659986257553,0.9678019881248474,-0.058301400393247604],[-0.2448659986257553,0.9678019881248474,-0.058301400393247604],[-0.2448659986257553,0.9678019881248474,-0.058301400393247604],[-0.2448659986257553,0.9678019881248474,-0.058301400393247604],[0.1162709966301918,0.8836609721183777,-0.4534580111503601],[0.1162709966301918,0.8836609721183777,-0.4534580111503601],[0.1162709966301918,0.8836609721183777,-0.4534580111503601],[0.1162709966301918,0.8836609721183777,-0.4534580111503601],[0.1162709966301918,0.8836609721183777,-0.4534580111503601],[0.1162709966301918,0.8836609721183777,-0.4534580111503601],[-0.1162709966301918,0.8836609721183777,-0.4534580111503601],[-0.1162709966301918,0.8836609721183777,-0.4534580111503601],[-0.1162709966301918,0.8836609721183777,-0.4534580111503601],[-0.1162709966301918,0.8836609721183777,-0.4534580111503601],[-0.1162709966301918,0.8836609721183777,-0.4534580111503601],[-0.1162709966301918,0.8836609721183777,-0.4534580111503601],[0.11519599705934525,0.13882599771022797,-0.9835940003395081],[0.11519599705934525,0.13882599771022797,-0.9835940003395081],[0.11519599705934525,0.13882599771022797,-0.9835940003395081],[0.11519599705934525,0.13882599771022797,-0.9835940003395081],[0.11519599705934525,0.13882599771022797,-0.9835940003395081],[0.11519599705934525,0.13882599771022797,-0.9835940003395081],[-0.11519599705934525,0.13882599771022797,-0.9835940003395081],[-0.11519599705934525,0.13882599771022797,-0.9835940003395081],[-0.11519599705934525,0.13882599771022797,-0.9835940003395081],[-0.11519599705934525,0.13882599771022797,-0.9835940003395081],[-0.11519599705934525,0.13882599771022797,-0.9835940003395081],[-0.11519599705934525,0.13882599771022797,-0.9835940003395081],[0.11836600303649902,0.2259719967842102,-0.966916024684906],[0.11836600303649902,0.2259719967842102,-0.966916024684906],[0.11836600303649902,0.2259719967842102,-0.966916024684906],[0.11836600303649902,0.2259719967842102,-0.966916024684906],[0.11836600303649902,0.2259719967842102,-0.966916024684906],[0.11836600303649902,0.2259719967842102,-0.966916024684906],[-0.11836600303649902,0.2259719967842102,-0.966916024684906],[-0.11836600303649902,0.2259719967842102,-0.966916024684906],[-0.11836600303649902,0.2259719967842102,-0.966916024684906],[-0.11836600303649902,0.2259719967842102,-0.966916024684906],[-0.11836600303649902,0.2259719967842102,-0.966916024684906],[-0.11836600303649902,0.2259719967842102,-0.966916024684906],[0.9597359895706177,0.28077399730682373,-0.00850830040872097],[0.9597359895706177,0.28077399730682373,-0.00850830040872097],[0.9597359895706177,0.28077399730682373,-0.00850830040872097],[0.9597359895706177,0.28077399730682373,-0.00850830040872097],[0.9597359895706177,0.28077399730682373,-0.00850830040872097],[0.9597359895706177,0.28077399730682373,-0.00850830040872097],[-0.9597359895706177,0.28077399730682373,-0.00850830040872097],[-0.9597359895706177,0.28077399730682373,-0.00850830040872097],[-0.9597359895706177,0.28077399730682373,-0.00850830040872097],[-0.9597359895706177,0.28077399730682373,-0.00850830040872097],[-0.9597359895706177,0.28077399730682373,-0.00850830040872097],[-0.9597359895706177,0.28077399730682373,-0.00850830040872097],[0.9318680167198181,0.3241940140724182,0.1628510057926178],[0.9318680167198181,0.3241940140724182,0.1628510057926178],[0.9318680167198181,0.3241940140724182,0.1628510057926178],[0.9318680167198181,0.3241940140724182,0.1628510057926178],[0.9318680167198181,0.3241940140724182,0.1628510057926178],[0.9318680167198181,0.3241940140724182,0.1628510057926178],[-0.9318680167198181,0.3241940140724182,0.1628510057926178],[-0.9318680167198181,0.3241940140724182,0.1628510057926178],[-0.9318680167198181,0.3241940140724182,0.1628510057926178],[-0.9318680167198181,0.3241940140724182,0.1628510057926178],[-0.9318680167198181,0.3241940140724182,0.1628510057926178],[-0.9318680167198181,0.3241940140724182,0.1628510057926178],[0.16260600090026855,0.9864739775657654,0.02069530077278614],[0.16260600090026855,0.9864739775657654,0.02069530077278614],[0.16260600090026855,0.9864739775657654,0.02069530077278614],[0.16260600090026855,0.9864739775657654,0.02069530077278614],[0.16260600090026855,0.9864739775657654,0.02069530077278614],[0.16260600090026855,0.9864739775657654,0.02069530077278614],[-0.16260600090026855,0.9864739775657654,0.02069530077278614],[-0.16260600090026855,0.9864739775657654,0.02069530077278614],[-0.16260600090026855,0.9864739775657654,0.02069530077278614],[-0.16260600090026855,0.9864739775657654,0.02069530077278614],[-0.16260600090026855,0.9864739775657654,0.02069530077278614],[-0.16260600090026855,0.9864739775657654,0.02069530077278614],[-0.018766099587082863,0.9758380055427551,-0.2176869958639145],[-0.018766099587082863,0.9758380055427551,-0.2176869958639145],[-0.018766099587082863,0.9758380055427551,-0.2176869958639145],[-0.018766099587082863,0.9758380055427551,-0.2176869958639145],[-0.018766099587082863,0.9758380055427551,-0.2176869958639145],[-0.018766099587082863,0.9758380055427551,-0.2176869958639145],[0.018766099587082863,0.9758380055427551,-0.2176869958639145],[0.018766099587082863,0.9758380055427551,-0.2176869958639145],[0.018766099587082863,0.9758380055427551,-0.2176869958639145],[0.018766099587082863,0.9758380055427551,-0.2176869958639145],[0.018766099587082863,0.9758380055427551,-0.2176869958639145],[0.018766099587082863,0.9758380055427551,-0.2176869958639145],[0.7537760138511658,0.5883910059928894,-0.2926050126552582],[0.7537760138511658,0.5883910059928894,-0.2926050126552582],[0.7537760138511658,0.5883910059928894,-0.2926050126552582],[0.7537760138511658,0.5883910059928894,-0.2926050126552582],[0.7537760138511658,0.5883910059928894,-0.2926050126552582],[0.7537760138511658,0.5883910059928894,-0.2926050126552582],[-0.7537760138511658,0.5883910059928894,-0.2926050126552582],[-0.7537760138511658,0.5883910059928894,-0.2926050126552582],[-0.7537760138511658,0.5883910059928894,-0.2926050126552582],[-0.7537760138511658,0.5883910059928894,-0.2926050126552582],[-0.7537760138511658,0.5883910059928894,-0.2926050126552582],[-0.7537760138511658,0.5883910059928894,-0.2926050126552582],[0.9196010231971741,0.3678399920463562,0.13794000446796417],[0.9196010231971741,0.3678399920463562,0.13794000446796417],[0.9196010231971741,0.3678399920463562,0.13794000446796417],[0.9196010231971741,0.3678399920463562,0.13794000446796417],[0.9196010231971741,0.3678399920463562,0.13794000446796417],[0.9196010231971741,0.3678399920463562,0.13794000446796417],[-0.9196010231971741,0.3678399920463562,0.13794000446796417],[-0.9196010231971741,0.3678399920463562,0.13794000446796417],[-0.9196010231971741,0.3678399920463562,0.13794000446796417],[-0.9196010231971741,0.3678399920463562,0.13794000446796417],[-0.9196010231971741,0.3678399920463562,0.13794000446796417],[-0.9196010231971741,0.3678399920463562,0.13794000446796417],[0.9297360181808472,0.19439899921417236,0.31272900104522705],[0.9297360181808472,0.19439899921417236,0.31272900104522705],[0.9297360181808472,0.19439899921417236,0.31272900104522705],[0.9297360181808472,0.19439899921417236,0.31272900104522705],[0.9297360181808472,0.19439899921417236,0.31272900104522705],[0.9297360181808472,0.19439899921417236,0.31272900104522705],[-0.9297360181808472,0.19439899921417236,0.31272900104522705],[-0.9297360181808472,0.19439899921417236,0.31272900104522705],[-0.9297360181808472,0.19439899921417236,0.31272900104522705],[-0.9297360181808472,0.19439899921417236,0.31272900104522705],[-0.9297360181808472,0.19439899921417236,0.31272900104522705],[-0.9297360181808472,0.19439899921417236,0.31272900104522705],[0.9120180010795593,0.23285600543022156,0.33764100074768066],[0.9120180010795593,0.23285600543022156,0.33764100074768066],[0.9120180010795593,0.23285600543022156,0.33764100074768066],[0.9120180010795593,0.23285600543022156,0.33764100074768066],[0.9120180010795593,0.23285600543022156,0.33764100074768066],[0.9120180010795593,0.23285600543022156,0.33764100074768066],[-0.9120180010795593,0.23285600543022156,0.33764100074768066],[-0.9120180010795593,0.23285600543022156,0.33764100074768066],[-0.9120180010795593,0.23285600543022156,0.33764100074768066],[-0.9120180010795593,0.23285600543022156,0.33764100074768066],[-0.9120180010795593,0.23285600543022156,0.33764100074768066],[-0.9120180010795593,0.23285600543022156,0.33764100074768066],[0.9406909942626953,0.06068969890475273,0.3337930142879486],[0.9406909942626953,0.06068969890475273,0.3337930142879486],[0.9406909942626953,0.06068969890475273,0.3337930142879486],[0.9406909942626953,0.06068969890475273,0.3337930142879486],[0.9406909942626953,0.06068969890475273,0.3337930142879486],[0.9406909942626953,0.06068969890475273,0.3337930142879486],[-0.9406909942626953,0.06068969890475273,0.3337930142879486],[-0.9406909942626953,0.06068969890475273,0.3337930142879486],[-0.9406909942626953,0.06068969890475273,0.3337930142879486],[-0.9406909942626953,0.06068969890475273,0.3337930142879486],[-0.9406909942626953,0.06068969890475273,0.3337930142879486],[-0.9406909942626953,0.06068969890475273,0.3337930142879486],[0.17609000205993652,0.4402250051498413,-0.8804510235786438],[0.17609000205993652,0.4402250051498413,-0.8804510235786438],[0.17609000205993652,0.4402250051498413,-0.8804510235786438],[0.17609000205993652,0.4402250051498413,-0.8804510235786438],[0.17609000205993652,0.4402250051498413,-0.8804510235786438],[0.17609000205993652,0.4402250051498413,-0.8804510235786438],[-0.17609000205993652,0.4402250051498413,-0.8804510235786438],[-0.17609000205993652,0.4402250051498413,-0.8804510235786438],[-0.17609000205993652,0.4402250051498413,-0.8804510235786438],[-0.17609000205993652,0.4402250051498413,-0.8804510235786438],[-0.17609000205993652,0.4402250051498413,-0.8804510235786438],[-0.17609000205993652,0.4402250051498413,-0.8804510235786438],[0.3707840144634247,0.7990829944610596,-0.4732699990272522],[0.3707840144634247,0.7990829944610596,-0.4732699990272522],[0.3707840144634247,0.7990829944610596,-0.4732699990272522],[0.3707840144634247,0.7990829944610596,-0.4732699990272522],[0.3707840144634247,0.7990829944610596,-0.4732699990272522],[0.3707840144634247,0.7990829944610596,-0.4732699990272522],[-0.3707840144634247,0.7990829944610596,-0.4732699990272522],[-0.3707840144634247,0.7990829944610596,-0.4732699990272522],[-0.3707840144634247,0.7990829944610596,-0.4732699990272522],[-0.3707840144634247,0.7990829944610596,-0.4732699990272522],[-0.3707840144634247,0.7990829944610596,-0.4732699990272522],[-0.3707840144634247,0.7990829944610596,-0.4732699990272522],[0.3106679916381836,0.4660019874572754,-0.828449010848999],[0.3106679916381836,0.4660019874572754,-0.828449010848999],[0.3106679916381836,0.4660019874572754,-0.828449010848999],[0.3106679916381836,0.4660019874572754,-0.828449010848999],[0.3106679916381836,0.4660019874572754,-0.828449010848999],[0.3106679916381836,0.4660019874572754,-0.828449010848999],[-0.3106679916381836,0.4660019874572754,-0.828449010848999],[-0.3106679916381836,0.4660019874572754,-0.828449010848999],[-0.3106679916381836,0.4660019874572754,-0.828449010848999],[-0.3106679916381836,0.4660019874572754,-0.828449010848999],[-0.3106679916381836,0.4660019874572754,-0.828449010848999],[-0.3106679916381836,0.4660019874572754,-0.828449010848999],[0.2793389856815338,0.12869200110435486,-0.9515290260314941],[0.2793389856815338,0.12869200110435486,-0.9515290260314941],[0.2793389856815338,0.12869200110435486,-0.9515290260314941],[0.2793389856815338,0.12869200110435486,-0.9515290260314941],[0.2793389856815338,0.12869200110435486,-0.9515290260314941],[0.2793389856815338,0.12869200110435486,-0.9515290260314941],[-0.2793389856815338,0.12869200110435486,-0.9515290260314941],[-0.2793389856815338,0.12869200110435486,-0.9515290260314941],[-0.2793389856815338,0.12869200110435486,-0.9515290260314941],[-0.2793389856815338,0.12869200110435486,-0.9515290260314941],[-0.2793389856815338,0.12869200110435486,-0.9515290260314941],[-0.2793389856815338,0.12869200110435486,-0.9515290260314941],[0.3138729929924011,0.18071499466896057,-0.9321079850196838],[0.3138729929924011,0.18071499466896057,-0.9321079850196838],[0.3138729929924011,0.18071499466896057,-0.9321079850196838],[0.3138729929924011,0.18071499466896057,-0.9321079850196838],[0.3138729929924011,0.18071499466896057,-0.9321079850196838],[0.3138729929924011,0.18071499466896057,-0.9321079850196838],[-0.3138729929924011,0.18071499466896057,-0.9321079850196838],[-0.3138729929924011,0.18071499466896057,-0.9321079850196838],[-0.3138729929924011,0.18071499466896057,-0.9321079850196838],[-0.3138729929924011,0.18071499466896057,-0.9321079850196838],[-0.3138729929924011,0.18071499466896057,-0.9321079850196838],[-0.3138729929924011,0.18071499466896057,-0.9321079850196838],[0.976161003112793,0.06086369976401329,-0.20834100246429443],[0.976161003112793,0.06086369976401329,-0.20834100246429443],[0.976161003112793,0.06086369976401329,-0.20834100246429443],[0.976161003112793,0.06086369976401329,-0.20834100246429443],[0.976161003112793,0.06086369976401329,-0.20834100246429443],[0.976161003112793,0.06086369976401329,-0.20834100246429443],[-0.976161003112793,0.06086369976401329,-0.20834100246429443],[-0.976161003112793,0.06086369976401329,-0.20834100246429443],[-0.976161003112793,0.06086369976401329,-0.20834100246429443],[-0.976161003112793,0.06086369976401329,-0.20834100246429443],[-0.976161003112793,0.06086369976401329,-0.20834100246429443],[-0.976161003112793,0.06086369976401329,-0.20834100246429443],[0.8267250061035156,-0.2447270005941391,-0.5065919756889343],[0.8267250061035156,-0.2447270005941391,-0.5065919756889343],[0.8267250061035156,-0.2447270005941391,-0.5065919756889343],[0.8267250061035156,-0.2447270005941391,-0.5065919756889343],[0.8267250061035156,-0.2447270005941391,-0.5065919756889343],[0.8267250061035156,-0.2447270005941391,-0.5065919756889343],[-0.8267250061035156,-0.2447270005941391,-0.5065919756889343],[-0.8267250061035156,-0.2447270005941391,-0.5065919756889343],[-0.8267250061035156,-0.2447270005941391,-0.5065919756889343],[-0.8267250061035156,-0.2447270005941391,-0.5065919756889343],[-0.8267250061035156,-0.2447270005941391,-0.5065919756889343],[-0.8267250061035156,-0.2447270005941391,-0.5065919756889343],[0.344853013753891,0.9314860105514526,-0.11580000072717667],[0.344853013753891,0.9314860105514526,-0.11580000072717667],[0.344853013753891,0.9314860105514526,-0.11580000072717667],[0.344853013753891,0.9314860105514526,-0.11580000072717667],[0.344853013753891,0.9314860105514526,-0.11580000072717667],[0.344853013753891,0.9314860105514526,-0.11580000072717667],[-0.344853013753891,0.9314860105514526,-0.11580000072717667],[-0.344853013753891,0.9314860105514526,-0.11580000072717667],[-0.344853013753891,0.9314860105514526,-0.11580000072717667],[-0.344853013753891,0.9314860105514526,-0.11580000072717667],[-0.344853013753891,0.9314860105514526,-0.11580000072717667],[-0.344853013753891,0.9314860105514526,-0.11580000072717667],[0.12026099860668182,-0.23549500107765198,0.9644060134887695],[0.12026099860668182,-0.23549500107765198,0.9644060134887695],[0.12026099860668182,-0.23549500107765198,0.9644060134887695],[0.12026099860668182,-0.23549500107765198,0.9644060134887695],[0.12026099860668182,-0.23549500107765198,0.9644060134887695],[0.12026099860668182,-0.23549500107765198,0.9644060134887695],[-0.12026099860668182,-0.23549500107765198,0.9644060134887695],[-0.12026099860668182,-0.23549500107765198,0.9644060134887695],[-0.12026099860668182,-0.23549500107765198,0.9644060134887695],[-0.12026099860668182,-0.23549500107765198,0.9644060134887695],[-0.12026099860668182,-0.23549500107765198,0.9644060134887695],[-0.12026099860668182,-0.23549500107765198,0.9644060134887695],[0.12751300632953644,0.18513700366020203,0.9744049906730652],[0.12751300632953644,0.18513700366020203,0.9744049906730652],[0.12751300632953644,0.18513700366020203,0.9744049906730652],[0.12751300632953644,0.18513700366020203,0.9744049906730652],[0.12751300632953644,0.18513700366020203,0.9744049906730652],[0.12751300632953644,0.18513700366020203,0.9744049906730652],[-0.12751300632953644,0.18513700366020203,0.9744049906730652],[-0.12751300632953644,0.18513700366020203,0.9744049906730652],[-0.12751300632953644,0.18513700366020203,0.9744049906730652],[-0.12751300632953644,0.18513700366020203,0.9744049906730652],[-0.12751300632953644,0.18513700366020203,0.9744049906730652],[-0.12751300632953644,0.18513700366020203,0.9744049906730652],[0.3492259979248047,0.7241380214691162,0.5946969985961914],[0.3492259979248047,0.7241380214691162,0.5946969985961914],[0.3492259979248047,0.7241380214691162,0.5946969985961914],[0.3492259979248047,0.7241380214691162,0.5946969985961914],[0.3492259979248047,0.7241380214691162,0.5946969985961914],[0.3492259979248047,0.7241380214691162,0.5946969985961914],[-0.3492259979248047,0.7241380214691162,0.5946969985961914],[-0.3492259979248047,0.7241380214691162,0.5946969985961914],[-0.3492259979248047,0.7241380214691162,0.5946969985961914],[-0.3492259979248047,0.7241380214691162,0.5946969985961914],[-0.3492259979248047,0.7241380214691162,0.5946969985961914],[-0.3492259979248047,0.7241380214691162,0.5946969985961914],[0.4152509868144989,0.14485499262809753,0.8981000185012817],[0.4152509868144989,0.14485499262809753,0.8981000185012817],[0.4152509868144989,0.14485499262809753,0.8981000185012817],[0.4152509868144989,0.14485499262809753,0.8981000185012817],[0.4152509868144989,0.14485499262809753,0.8981000185012817],[0.4152509868144989,0.14485499262809753,0.8981000185012817],[-0.4152509868144989,0.14485499262809753,0.8981000185012817],[-0.4152509868144989,0.14485499262809753,0.8981000185012817],[-0.4152509868144989,0.14485499262809753,0.8981000185012817],[-0.4152509868144989,0.14485499262809753,0.8981000185012817],[-0.4152509868144989,0.14485499262809753,0.8981000185012817],[-0.4152509868144989,0.14485499262809753,0.8981000185012817],[0.1845400035381317,-0.6862580180168152,0.7035589814186096],[0.1845400035381317,-0.6862580180168152,0.7035589814186096],[0.1845400035381317,-0.6862580180168152,0.7035589814186096],[0.1845400035381317,-0.6862580180168152,0.7035589814186096],[0.1845400035381317,-0.6862580180168152,0.7035589814186096],[0.1845400035381317,-0.6862580180168152,0.7035589814186096],[-0.1845400035381317,-0.6862580180168152,0.7035589814186096],[-0.1845400035381317,-0.6862580180168152,0.7035589814186096],[-0.1845400035381317,-0.6862580180168152,0.7035589814186096],[-0.1845400035381317,-0.6862580180168152,0.7035589814186096],[-0.1845400035381317,-0.6862580180168152,0.7035589814186096],[-0.1845400035381317,-0.6862580180168152,0.7035589814186096],[0.6055639982223511,-0.1608240008354187,0.7793769836425781],[0.6055639982223511,-0.1608240008354187,0.7793769836425781],[0.6055639982223511,-0.1608240008354187,0.7793769836425781],[0.6055639982223511,-0.1608240008354187,0.7793769836425781],[0.6055639982223511,-0.1608240008354187,0.7793769836425781],[0.6055639982223511,-0.1608240008354187,0.7793769836425781],[-0.6055639982223511,-0.1608240008354187,0.7793769836425781],[-0.6055639982223511,-0.1608240008354187,0.7793769836425781],[-0.6055639982223511,-0.1608240008354187,0.7793769836425781],[-0.6055639982223511,-0.1608240008354187,0.7793769836425781],[-0.6055639982223511,-0.1608240008354187,0.7793769836425781],[-0.6055639982223511,-0.1608240008354187,0.7793769836425781],[0.7033010125160217,0.20526400208473206,0.6806139945983887],[0.7033010125160217,0.20526400208473206,0.6806139945983887],[0.7033010125160217,0.20526400208473206,0.6806139945983887],[0.7033010125160217,0.20526400208473206,0.6806139945983887],[0.7033010125160217,0.20526400208473206,0.6806139945983887],[0.7033010125160217,0.20526400208473206,0.6806139945983887],[-0.7033010125160217,0.20526400208473206,0.6806139945983887],[-0.7033010125160217,0.20526400208473206,0.6806139945983887],[-0.7033010125160217,0.20526400208473206,0.6806139945983887],[-0.7033010125160217,0.20526400208473206,0.6806139945983887],[-0.7033010125160217,0.20526400208473206,0.6806139945983887],[-0.7033010125160217,0.20526400208473206,0.6806139945983887],[0.6679440140724182,0.7166309952735901,0.2007250040769577],[0.6679440140724182,0.7166309952735901,0.2007250040769577],[0.6679440140724182,0.7166309952735901,0.2007250040769577],[0.6679440140724182,0.7166309952735901,0.2007250040769577],[0.6679440140724182,0.7166309952735901,0.2007250040769577],[0.6679440140724182,0.7166309952735901,0.2007250040769577],[-0.6679440140724182,0.7166309952735901,0.2007250040769577],[-0.6679440140724182,0.7166309952735901,0.2007250040769577],[-0.6679440140724182,0.7166309952735901,0.2007250040769577],[-0.6679440140724182,0.7166309952735901,0.2007250040769577],[-0.6679440140724182,0.7166309952735901,0.2007250040769577],[-0.6679440140724182,0.7166309952735901,0.2007250040769577],[0.4947740137577057,0.7527559995651245,0.4342310130596161],[0.4947740137577057,0.7527559995651245,0.4342310130596161],[0.4947740137577057,0.7527559995651245,0.4342310130596161],[0.4947740137577057,0.7527559995651245,0.4342310130596161],[0.4947740137577057,0.7527559995651245,0.4342310130596161],[0.4947740137577057,0.7527559995651245,0.4342310130596161],[-0.4947740137577057,0.7527559995651245,0.4342310130596161],[-0.4947740137577057,0.7527559995651245,0.4342310130596161],[-0.4947740137577057,0.7527559995651245,0.4342310130596161],[-0.4947740137577057,0.7527559995651245,0.4342310130596161],[-0.4947740137577057,0.7527559995651245,0.4342310130596161],[-0.4947740137577057,0.7527559995651245,0.4342310130596161],[0.6423230171203613,0.17612099647521973,0.7459239959716797],[0.6423230171203613,0.17612099647521973,0.7459239959716797],[0.6423230171203613,0.17612099647521973,0.7459239959716797],[0.6423230171203613,0.17612099647521973,0.7459239959716797],[0.6423230171203613,0.17612099647521973,0.7459239959716797],[0.6423230171203613,0.17612099647521973,0.7459239959716797],[-0.6423230171203613,0.17612099647521973,0.7459239959716797],[-0.6423230171203613,0.17612099647521973,0.7459239959716797],[-0.6423230171203613,0.17612099647521973,0.7459239959716797],[-0.6423230171203613,0.17612099647521973,0.7459239959716797],[-0.6423230171203613,0.17612099647521973,0.7459239959716797],[-0.6423230171203613,0.17612099647521973,0.7459239959716797],[0.7182250022888184,-0.1529659926891327,0.6787880063056946],[0.7182250022888184,-0.1529659926891327,0.6787880063056946],[0.7182250022888184,-0.1529659926891327,0.6787880063056946],[0.7182250022888184,-0.1529659926891327,0.6787880063056946],[0.7182250022888184,-0.1529659926891327,0.6787880063056946],[0.7182250022888184,-0.1529659926891327,0.6787880063056946],[-0.7182250022888184,-0.1529659926891327,0.6787880063056946],[-0.7182250022888184,-0.1529659926891327,0.6787880063056946],[-0.7182250022888184,-0.1529659926891327,0.6787880063056946],[-0.7182250022888184,-0.1529659926891327,0.6787880063056946],[-0.7182250022888184,-0.1529659926891327,0.6787880063056946],[-0.7182250022888184,-0.1529659926891327,0.6787880063056946],[0.7388280034065247,-0.5443660020828247,0.39724001288414],[0.7388280034065247,-0.5443660020828247,0.39724001288414],[0.7388280034065247,-0.5443660020828247,0.39724001288414],[0.7388280034065247,-0.5443660020828247,0.39724001288414],[0.7388280034065247,-0.5443660020828247,0.39724001288414],[0.7388280034065247,-0.5443660020828247,0.39724001288414],[-0.7388280034065247,-0.5443660020828247,0.39724001288414],[-0.7388280034065247,-0.5443660020828247,0.39724001288414],[-0.7388280034065247,-0.5443660020828247,0.39724001288414],[-0.7388280034065247,-0.5443660020828247,0.39724001288414],[-0.7388280034065247,-0.5443660020828247,0.39724001288414],[-0.7388280034065247,-0.5443660020828247,0.39724001288414],[0.3427720069885254,0.1578879952430725,0.9260560274124146],[0.3427720069885254,0.1578879952430725,0.9260560274124146],[0.3427720069885254,0.1578879952430725,0.9260560274124146],[0.3427720069885254,0.1578879952430725,0.9260560274124146],[0.3427720069885254,0.1578879952430725,0.9260560274124146],[0.3427720069885254,0.1578879952430725,0.9260560274124146],[-0.3427720069885254,0.1578879952430725,0.9260560274124146],[-0.3427720069885254,0.1578879952430725,0.9260560274124146],[-0.3427720069885254,0.1578879952430725,0.9260560274124146],[-0.3427720069885254,0.1578879952430725,0.9260560274124146],[-0.3427720069885254,0.1578879952430725,0.9260560274124146],[-0.3427720069885254,0.1578879952430725,0.9260560274124146],[0.2269829958677292,-0.7867460250854492,0.5740299820899963],[0.2269829958677292,-0.7867460250854492,0.5740299820899963],[0.2269829958677292,-0.7867460250854492,0.5740299820899963],[0.2269829958677292,-0.7867460250854492,0.5740299820899963],[0.2269829958677292,-0.7867460250854492,0.5740299820899963],[0.2269829958677292,-0.7867460250854492,0.5740299820899963],[-0.2269829958677292,-0.7867460250854492,0.5740299820899963],[-0.2269829958677292,-0.7867460250854492,0.5740299820899963],[-0.2269829958677292,-0.7867460250854492,0.5740299820899963],[-0.2269829958677292,-0.7867460250854492,0.5740299820899963],[-0.2269829958677292,-0.7867460250854492,0.5740299820899963],[-0.2269829958677292,-0.7867460250854492,0.5740299820899963],[-0.17218899726867676,0.9794909954071045,0.1046380028128624],[-0.17218899726867676,0.9794909954071045,0.1046380028128624],[-0.17218899726867676,0.9794909954071045,0.1046380028128624],[-0.17218899726867676,0.9794909954071045,0.1046380028128624],[-0.17218899726867676,0.9794909954071045,0.1046380028128624],[-0.17218899726867676,0.9794909954071045,0.1046380028128624],[0.17218899726867676,0.9794909954071045,0.1046380028128624],[0.17218899726867676,0.9794909954071045,0.1046380028128624],[0.17218899726867676,0.9794909954071045,0.1046380028128624],[0.17218899726867676,0.9794909954071045,0.1046380028128624],[0.17218899726867676,0.9794909954071045,0.1046380028128624],[0.17218899726867676,0.9794909954071045,0.1046380028128624],[0.042460400611162186,-0.4013189971446991,0.9149529933929443],[0.042460400611162186,-0.4013189971446991,0.9149529933929443],[0.042460400611162186,-0.4013189971446991,0.9149529933929443],[0.042460400611162186,-0.4013189971446991,0.9149529933929443],[0.042460400611162186,-0.4013189971446991,0.9149529933929443],[0.042460400611162186,-0.4013189971446991,0.9149529933929443],[-0.042460400611162186,-0.4013189971446991,0.9149529933929443],[-0.042460400611162186,-0.4013189971446991,0.9149529933929443],[-0.042460400611162186,-0.4013189971446991,0.9149529933929443],[-0.042460400611162186,-0.4013189971446991,0.9149529933929443],[-0.042460400611162186,-0.4013189971446991,0.9149529933929443],[-0.042460400611162186,-0.4013189971446991,0.9149529933929443],[-0.16157199442386627,-0.96943199634552,0.18465399742126465],[-0.16157199442386627,-0.96943199634552,0.18465399742126465],[-0.16157199442386627,-0.96943199634552,0.18465399742126465],[0.16157199442386627,-0.96943199634552,0.18465399742126465],[0.16157199442386627,-0.96943199634552,0.18465399742126465],[0.16157199442386627,-0.96943199634552,0.18465399742126465],[0.9791489839553833,-0.04833199828863144,0.1973080039024353],[0.9791489839553833,-0.04833199828863144,0.1973080039024353],[0.9791489839553833,-0.04833199828863144,0.1973080039024353],[0.9791489839553833,-0.04833199828863144,0.1973080039024353],[0.9791489839553833,-0.04833199828863144,0.1973080039024353],[0.9791489839553833,-0.04833199828863144,0.1973080039024353],[-0.9791489839553833,-0.04833199828863144,0.1973080039024353],[-0.9791489839553833,-0.04833199828863144,0.1973080039024353],[-0.9791489839553833,-0.04833199828863144,0.1973080039024353],[-0.9791489839553833,-0.04833199828863144,0.1973080039024353],[-0.9791489839553833,-0.04833199828863144,0.1973080039024353],[-0.9791489839553833,-0.04833199828863144,0.1973080039024353],[0.9469680190086365,-0.30792200565338135,0.09184479713439941],[0.9469680190086365,-0.30792200565338135,0.09184479713439941],[0.9469680190086365,-0.30792200565338135,0.09184479713439941],[0.9469680190086365,-0.30792200565338135,0.09184479713439941],[0.9469680190086365,-0.30792200565338135,0.09184479713439941],[0.9469680190086365,-0.30792200565338135,0.09184479713439941],[-0.9469680190086365,-0.30792200565338135,0.09184479713439941],[-0.9469680190086365,-0.30792200565338135,0.09184479713439941],[-0.9469680190086365,-0.30792200565338135,0.09184479713439941],[-0.9469680190086365,-0.30792200565338135,0.09184479713439941],[-0.9469680190086365,-0.30792200565338135,0.09184479713439941],[-0.9469680190086365,-0.30792200565338135,0.09184479713439941],[0.979449987411499,0.06613650172948837,0.1905360072851181],[0.979449987411499,0.06613650172948837,0.1905360072851181],[0.979449987411499,0.06613650172948837,0.1905360072851181],[0.979449987411499,0.06613650172948837,0.1905360072851181],[0.979449987411499,0.06613650172948837,0.1905360072851181],[0.979449987411499,0.06613650172948837,0.1905360072851181],[-0.979449987411499,0.06613650172948837,0.1905360072851181],[-0.979449987411499,0.06613650172948837,0.1905360072851181],[-0.979449987411499,0.06613650172948837,0.1905360072851181],[-0.979449987411499,0.06613650172948837,0.1905360072851181],[-0.979449987411499,0.06613650172948837,0.1905360072851181],[-0.979449987411499,0.06613650172948837,0.1905360072851181],[0.9937750101089478,0.10695300251245499,0.031194699928164482],[0.9937750101089478,0.10695300251245499,0.031194699928164482],[0.9937750101089478,0.10695300251245499,0.031194699928164482],[0.9937750101089478,0.10695300251245499,0.031194699928164482],[0.9937750101089478,0.10695300251245499,0.031194699928164482],[0.9937750101089478,0.10695300251245499,0.031194699928164482],[-0.9937750101089478,0.10695300251245499,0.031194699928164482],[-0.9937750101089478,0.10695300251245499,0.031194699928164482],[-0.9937750101089478,0.10695300251245499,0.031194699928164482],[-0.9937750101089478,0.10695300251245499,0.031194699928164482],[-0.9937750101089478,0.10695300251245499,0.031194699928164482],[-0.9937750101089478,0.10695300251245499,0.031194699928164482],[0.711562991142273,-0.05005969852209091,-0.7008360028266907],[0.711562991142273,-0.05005969852209091,-0.7008360028266907],[0.711562991142273,-0.05005969852209091,-0.7008360028266907],[0.711562991142273,-0.05005969852209091,-0.7008360028266907],[0.711562991142273,-0.05005969852209091,-0.7008360028266907],[0.711562991142273,-0.05005969852209091,-0.7008360028266907],[-0.711562991142273,-0.05005969852209091,-0.7008360028266907],[-0.711562991142273,-0.05005969852209091,-0.7008360028266907],[-0.711562991142273,-0.05005969852209091,-0.7008360028266907],[-0.711562991142273,-0.05005969852209091,-0.7008360028266907],[-0.711562991142273,-0.05005969852209091,-0.7008360028266907],[-0.711562991142273,-0.05005969852209091,-0.7008360028266907],[0.3721599876880646,-0.08465129882097244,-0.9243000149726868],[0.3721599876880646,-0.08465129882097244,-0.9243000149726868],[0.3721599876880646,-0.08465129882097244,-0.9243000149726868],[0.3721599876880646,-0.08465129882097244,-0.9243000149726868],[0.3721599876880646,-0.08465129882097244,-0.9243000149726868],[0.3721599876880646,-0.08465129882097244,-0.9243000149726868],[-0.3721599876880646,-0.08465129882097244,-0.9243000149726868],[-0.3721599876880646,-0.08465129882097244,-0.9243000149726868],[-0.3721599876880646,-0.08465129882097244,-0.9243000149726868],[-0.3721599876880646,-0.08465129882097244,-0.9243000149726868],[-0.3721599876880646,-0.08465129882097244,-0.9243000149726868],[-0.3721599876880646,-0.08465129882097244,-0.9243000149726868],[0.44652900099754333,-0.23101000487804413,-0.864434003829956],[0.44652900099754333,-0.23101000487804413,-0.864434003829956],[0.44652900099754333,-0.23101000487804413,-0.864434003829956],[0.44652900099754333,-0.23101000487804413,-0.864434003829956],[0.44652900099754333,-0.23101000487804413,-0.864434003829956],[0.44652900099754333,-0.23101000487804413,-0.864434003829956],[-0.44652900099754333,-0.23101000487804413,-0.864434003829956],[-0.44652900099754333,-0.23101000487804413,-0.864434003829956],[-0.44652900099754333,-0.23101000487804413,-0.864434003829956],[-0.44652900099754333,-0.23101000487804413,-0.864434003829956],[-0.44652900099754333,-0.23101000487804413,-0.864434003829956],[-0.44652900099754333,-0.23101000487804413,-0.864434003829956],[0.6065790057182312,-0.24048900604248047,-0.757777988910675],[0.6065790057182312,-0.24048900604248047,-0.757777988910675],[0.6065790057182312,-0.24048900604248047,-0.757777988910675],[0.6065790057182312,-0.24048900604248047,-0.757777988910675],[0.6065790057182312,-0.24048900604248047,-0.757777988910675],[0.6065790057182312,-0.24048900604248047,-0.757777988910675],[-0.6065790057182312,-0.24048900604248047,-0.757777988910675],[-0.6065790057182312,-0.24048900604248047,-0.757777988910675],[-0.6065790057182312,-0.24048900604248047,-0.757777988910675],[-0.6065790057182312,-0.24048900604248047,-0.757777988910675],[-0.6065790057182312,-0.24048900604248047,-0.757777988910675],[-0.6065790057182312,-0.24048900604248047,-0.757777988910675],[0.7324889898300171,-0.24067500233650208,-0.6368169784545898],[0.7324889898300171,-0.24067500233650208,-0.6368169784545898],[0.7324889898300171,-0.24067500233650208,-0.6368169784545898],[-0.7324889898300171,-0.24067500233650208,-0.6368169784545898],[-0.7324889898300171,-0.24067500233650208,-0.6368169784545898],[-0.7324889898300171,-0.24067500233650208,-0.6368169784545898],[0.263731986284256,-0.8532519936561584,-0.4498960077762604],[0.263731986284256,-0.8532519936561584,-0.4498960077762604],[0.263731986284256,-0.8532519936561584,-0.4498960077762604],[-0.263731986284256,-0.8532519936561584,-0.4498960077762604],[-0.263731986284256,-0.8532519936561584,-0.4498960077762604],[-0.263731986284256,-0.8532519936561584,-0.4498960077762604],[0.5568169951438904,0.7673320174217224,-0.3180510103702545],[0.5568169951438904,0.7673320174217224,-0.3180510103702545],[0.5568169951438904,0.7673320174217224,-0.3180510103702545],[0.5568169951438904,0.7673320174217224,-0.3180510103702545],[0.5568169951438904,0.7673320174217224,-0.3180510103702545],[0.5568169951438904,0.7673320174217224,-0.3180510103702545],[-0.5568169951438904,0.7673320174217224,-0.3180510103702545],[-0.5568169951438904,0.7673320174217224,-0.3180510103702545],[-0.5568169951438904,0.7673320174217224,-0.3180510103702545],[-0.5568169951438904,0.7673320174217224,-0.3180510103702545],[-0.5568169951438904,0.7673320174217224,-0.3180510103702545],[-0.5568169951438904,0.7673320174217224,-0.3180510103702545],[0.5004310011863708,0.8189989924430847,-0.2807300090789795],[0.5004310011863708,0.8189989924430847,-0.2807300090789795],[0.5004310011863708,0.8189989924430847,-0.2807300090789795],[0.5004310011863708,0.8189989924430847,-0.2807300090789795],[0.5004310011863708,0.8189989924430847,-0.2807300090789795],[0.5004310011863708,0.8189989924430847,-0.2807300090789795],[-0.5004310011863708,0.8189989924430847,-0.2807300090789795],[-0.5004310011863708,0.8189989924430847,-0.2807300090789795],[-0.5004310011863708,0.8189989924430847,-0.2807300090789795],[-0.5004310011863708,0.8189989924430847,-0.2807300090789795],[-0.5004310011863708,0.8189989924430847,-0.2807300090789795],[-0.5004310011863708,0.8189989924430847,-0.2807300090789795],[0.3189539909362793,0.4204849898815155,-0.8493890166282654],[0.3189539909362793,0.4204849898815155,-0.8493890166282654],[0.3189539909362793,0.4204849898815155,-0.8493890166282654],[0.3189539909362793,0.4204849898815155,-0.8493890166282654],[0.3189539909362793,0.4204849898815155,-0.8493890166282654],[0.3189539909362793,0.4204849898815155,-0.8493890166282654],[-0.3189539909362793,0.4204849898815155,-0.8493890166282654],[-0.3189539909362793,0.4204849898815155,-0.8493890166282654],[-0.3189539909362793,0.4204849898815155,-0.8493890166282654],[-0.3189539909362793,0.4204849898815155,-0.8493890166282654],[-0.3189539909362793,0.4204849898815155,-0.8493890166282654],[-0.3189539909362793,0.4204849898815155,-0.8493890166282654],[0.7197589874267578,0.27930301427841187,-0.6355609893798828],[0.7197589874267578,0.27930301427841187,-0.6355609893798828],[0.7197589874267578,0.27930301427841187,-0.6355609893798828],[0.7197589874267578,0.27930301427841187,-0.6355609893798828],[0.7197589874267578,0.27930301427841187,-0.6355609893798828],[0.7197589874267578,0.27930301427841187,-0.6355609893798828],[-0.7197589874267578,0.27930301427841187,-0.6355609893798828],[-0.7197589874267578,0.27930301427841187,-0.6355609893798828],[-0.7197589874267578,0.27930301427841187,-0.6355609893798828],[-0.7197589874267578,0.27930301427841187,-0.6355609893798828],[-0.7197589874267578,0.27930301427841187,-0.6355609893798828],[-0.7197589874267578,0.27930301427841187,-0.6355609893798828],[0.49720498919487,0.7473329901695251,-0.44077399373054504],[0.49720498919487,0.7473329901695251,-0.44077399373054504],[0.49720498919487,0.7473329901695251,-0.44077399373054504],[-0.49720498919487,0.7473329901695251,-0.44077399373054504],[-0.49720498919487,0.7473329901695251,-0.44077399373054504],[-0.49720498919487,0.7473329901695251,-0.44077399373054504],[0.3505589962005615,-0.8556659817695618,0.380715012550354],[0.3505589962005615,-0.8556659817695618,0.380715012550354],[0.3505589962005615,-0.8556659817695618,0.380715012550354],[0.3505589962005615,-0.8556659817695618,0.380715012550354],[0.3505589962005615,-0.8556659817695618,0.380715012550354],[0.3505589962005615,-0.8556659817695618,0.380715012550354],[-0.3505589962005615,-0.8556659817695618,0.380715012550354],[-0.3505589962005615,-0.8556659817695618,0.380715012550354],[-0.3505589962005615,-0.8556659817695618,0.380715012550354],[-0.3505589962005615,-0.8556659817695618,0.380715012550354],[-0.3505589962005615,-0.8556659817695618,0.380715012550354],[-0.3505589962005615,-0.8556659817695618,0.380715012550354],[0.4565509855747223,-0.873013973236084,0.17148500680923462],[0.4565509855747223,-0.873013973236084,0.17148500680923462],[0.4565509855747223,-0.873013973236084,0.17148500680923462],[0.4565509855747223,-0.873013973236084,0.17148500680923462],[0.4565509855747223,-0.873013973236084,0.17148500680923462],[0.4565509855747223,-0.873013973236084,0.17148500680923462],[-0.4565509855747223,-0.873013973236084,0.17148500680923462],[-0.4565509855747223,-0.873013973236084,0.17148500680923462],[-0.4565509855747223,-0.873013973236084,0.17148500680923462],[-0.4565509855747223,-0.873013973236084,0.17148500680923462],[-0.4565509855747223,-0.873013973236084,0.17148500680923462],[-0.4565509855747223,-0.873013973236084,0.17148500680923462],[0.2582620084285736,-0.9602980017662048,0.10548699647188187],[0.2582620084285736,-0.9602980017662048,0.10548699647188187],[0.2582620084285736,-0.9602980017662048,0.10548699647188187],[0.2582620084285736,-0.9602980017662048,0.10548699647188187],[0.2582620084285736,-0.9602980017662048,0.10548699647188187],[0.2582620084285736,-0.9602980017662048,0.10548699647188187],[-0.2582620084285736,-0.9602980017662048,0.10548699647188187],[-0.2582620084285736,-0.9602980017662048,0.10548699647188187],[-0.2582620084285736,-0.9602980017662048,0.10548699647188187],[-0.2582620084285736,-0.9602980017662048,0.10548699647188187],[-0.2582620084285736,-0.9602980017662048,0.10548699647188187],[-0.2582620084285736,-0.9602980017662048,0.10548699647188187],[0.24552799761295319,-0.9660630226135254,-0.08023779839277267],[0.24552799761295319,-0.9660630226135254,-0.08023779839277267],[0.24552799761295319,-0.9660630226135254,-0.08023779839277267],[0.24552799761295319,-0.9660630226135254,-0.08023779839277267],[0.24552799761295319,-0.9660630226135254,-0.08023779839277267],[0.24552799761295319,-0.9660630226135254,-0.08023779839277267],[-0.24552799761295319,-0.9660630226135254,-0.08023779839277267],[-0.24552799761295319,-0.9660630226135254,-0.08023779839277267],[-0.24552799761295319,-0.9660630226135254,-0.08023779839277267],[-0.24552799761295319,-0.9660630226135254,-0.08023779839277267],[-0.24552799761295319,-0.9660630226135254,-0.08023779839277267],[-0.24552799761295319,-0.9660630226135254,-0.08023779839277267],[0.4642919898033142,-0.8836529850959778,-0.05990869924426079],[0.4642919898033142,-0.8836529850959778,-0.05990869924426079],[0.4642919898033142,-0.8836529850959778,-0.05990869924426079],[0.4642919898033142,-0.8836529850959778,-0.05990869924426079],[0.4642919898033142,-0.8836529850959778,-0.05990869924426079],[0.4642919898033142,-0.8836529850959778,-0.05990869924426079],[-0.4642919898033142,-0.8836529850959778,-0.05990869924426079],[-0.4642919898033142,-0.8836529850959778,-0.05990869924426079],[-0.4642919898033142,-0.8836529850959778,-0.05990869924426079],[-0.4642919898033142,-0.8836529850959778,-0.05990869924426079],[-0.4642919898033142,-0.8836529850959778,-0.05990869924426079],[-0.4642919898033142,-0.8836529850959778,-0.05990869924426079],[0.6224619746208191,-0.7209810018539429,-0.30451399087905884],[0.6224619746208191,-0.7209810018539429,-0.30451399087905884],[0.6224619746208191,-0.7209810018539429,-0.30451399087905884],[0.6224619746208191,-0.7209810018539429,-0.30451399087905884],[0.6224619746208191,-0.7209810018539429,-0.30451399087905884],[0.6224619746208191,-0.7209810018539429,-0.30451399087905884],[-0.6224619746208191,-0.7209810018539429,-0.30451399087905884],[-0.6224619746208191,-0.7209810018539429,-0.30451399087905884],[-0.6224619746208191,-0.7209810018539429,-0.30451399087905884],[-0.6224619746208191,-0.7209810018539429,-0.30451399087905884],[-0.6224619746208191,-0.7209810018539429,-0.30451399087905884],[-0.6224619746208191,-0.7209810018539429,-0.30451399087905884],[0.45002099871635437,-0.6027060151100159,0.6589589715003967],[0.45002099871635437,-0.6027060151100159,0.6589589715003967],[0.45002099871635437,-0.6027060151100159,0.6589589715003967],[0.45002099871635437,-0.6027060151100159,0.6589589715003967],[0.45002099871635437,-0.6027060151100159,0.6589589715003967],[0.45002099871635437,-0.6027060151100159,0.6589589715003967],[-0.45002099871635437,-0.6027060151100159,0.6589589715003967],[-0.45002099871635437,-0.6027060151100159,0.6589589715003967],[-0.45002099871635437,-0.6027060151100159,0.6589589715003967],[-0.45002099871635437,-0.6027060151100159,0.6589589715003967],[-0.45002099871635437,-0.6027060151100159,0.6589589715003967],[-0.45002099871635437,-0.6027060151100159,0.6589589715003967],[-0.2666639983654022,-0.488415002822876,0.8308680057525635],[-0.2666639983654022,-0.488415002822876,0.8308680057525635],[-0.2666639983654022,-0.488415002822876,0.8308680057525635],[-0.2666639983654022,-0.488415002822876,0.8308680057525635],[-0.2666639983654022,-0.488415002822876,0.8308680057525635],[-0.2666639983654022,-0.488415002822876,0.8308680057525635],[0.2666639983654022,-0.488415002822876,0.8308680057525635],[0.2666639983654022,-0.488415002822876,0.8308680057525635],[0.2666639983654022,-0.488415002822876,0.8308680057525635],[0.2666639983654022,-0.488415002822876,0.8308680057525635],[0.2666639983654022,-0.488415002822876,0.8308680057525635],[0.2666639983654022,-0.488415002822876,0.8308680057525635],[-0.8283950090408325,-0.5111370086669922,0.22912999987602234],[-0.8283950090408325,-0.5111370086669922,0.22912999987602234],[-0.8283950090408325,-0.5111370086669922,0.22912999987602234],[-0.8283950090408325,-0.5111370086669922,0.22912999987602234],[-0.8283950090408325,-0.5111370086669922,0.22912999987602234],[-0.8283950090408325,-0.5111370086669922,0.22912999987602234],[0.8283950090408325,-0.5111370086669922,0.22912999987602234],[0.8283950090408325,-0.5111370086669922,0.22912999987602234],[0.8283950090408325,-0.5111370086669922,0.22912999987602234],[0.8283950090408325,-0.5111370086669922,0.22912999987602234],[0.8283950090408325,-0.5111370086669922,0.22912999987602234],[0.8283950090408325,-0.5111370086669922,0.22912999987602234],[-0.5250610113143921,-0.7727320194244385,-0.35664498805999756],[-0.5250610113143921,-0.7727320194244385,-0.35664498805999756],[-0.5250610113143921,-0.7727320194244385,-0.35664498805999756],[-0.5250610113143921,-0.7727320194244385,-0.35664498805999756],[-0.5250610113143921,-0.7727320194244385,-0.35664498805999756],[-0.5250610113143921,-0.7727320194244385,-0.35664498805999756],[0.5250610113143921,-0.7727320194244385,-0.35664498805999756],[0.5250610113143921,-0.7727320194244385,-0.35664498805999756],[0.5250610113143921,-0.7727320194244385,-0.35664498805999756],[0.5250610113143921,-0.7727320194244385,-0.35664498805999756],[0.5250610113143921,-0.7727320194244385,-0.35664498805999756],[0.5250610113143921,-0.7727320194244385,-0.35664498805999756],[0.45463699102401733,-0.687283992767334,-0.5665209889411926],[0.45463699102401733,-0.687283992767334,-0.5665209889411926],[0.45463699102401733,-0.687283992767334,-0.5665209889411926],[0.45463699102401733,-0.687283992767334,-0.5665209889411926],[0.45463699102401733,-0.687283992767334,-0.5665209889411926],[0.45463699102401733,-0.687283992767334,-0.5665209889411926],[-0.45463699102401733,-0.687283992767334,-0.5665209889411926],[-0.45463699102401733,-0.687283992767334,-0.5665209889411926],[-0.45463699102401733,-0.687283992767334,-0.5665209889411926],[-0.45463699102401733,-0.687283992767334,-0.5665209889411926],[-0.45463699102401733,-0.687283992767334,-0.5665209889411926],[-0.45463699102401733,-0.687283992767334,-0.5665209889411926],[0.6996009945869446,-0.5552390217781067,-0.44974300265312195],[0.6996009945869446,-0.5552390217781067,-0.44974300265312195],[0.6996009945869446,-0.5552390217781067,-0.44974300265312195],[0.6996009945869446,-0.5552390217781067,-0.44974300265312195],[0.6996009945869446,-0.5552390217781067,-0.44974300265312195],[0.6996009945869446,-0.5552390217781067,-0.44974300265312195],[-0.6996009945869446,-0.5552390217781067,-0.44974300265312195],[-0.6996009945869446,-0.5552390217781067,-0.44974300265312195],[-0.6996009945869446,-0.5552390217781067,-0.44974300265312195],[-0.6996009945869446,-0.5552390217781067,-0.44974300265312195],[-0.6996009945869446,-0.5552390217781067,-0.44974300265312195],[-0.6996009945869446,-0.5552390217781067,-0.44974300265312195],[0.7220100164413452,0.1126440018415451,-0.6826519966125488],[0.7220100164413452,0.1126440018415451,-0.6826519966125488],[0.7220100164413452,0.1126440018415451,-0.6826519966125488],[0.7220100164413452,0.1126440018415451,-0.6826519966125488],[0.7220100164413452,0.1126440018415451,-0.6826519966125488],[0.7220100164413452,0.1126440018415451,-0.6826519966125488],[-0.7220100164413452,0.1126440018415451,-0.6826519966125488],[-0.7220100164413452,0.1126440018415451,-0.6826519966125488],[-0.7220100164413452,0.1126440018415451,-0.6826519966125488],[-0.7220100164413452,0.1126440018415451,-0.6826519966125488],[-0.7220100164413452,0.1126440018415451,-0.6826519966125488],[-0.7220100164413452,0.1126440018415451,-0.6826519966125488],[-0.1919039934873581,-0.9388239979743958,0.28597500920295715],[-0.1919039934873581,-0.9388239979743958,0.28597500920295715],[-0.1919039934873581,-0.9388239979743958,0.28597500920295715],[-0.1919039934873581,-0.9388239979743958,0.28597500920295715],[-0.1919039934873581,-0.9388239979743958,0.28597500920295715],[-0.1919039934873581,-0.9388239979743958,0.28597500920295715],[0.1919039934873581,-0.9388239979743958,0.28597500920295715],[0.1919039934873581,-0.9388239979743958,0.28597500920295715],[0.1919039934873581,-0.9388239979743958,0.28597500920295715],[0.1919039934873581,-0.9388239979743958,0.28597500920295715],[0.1919039934873581,-0.9388239979743958,0.28597500920295715],[0.1919039934873581,-0.9388239979743958,0.28597500920295715],[0.904807984828949,0.2047480046749115,-0.37336501479148865],[0.904807984828949,0.2047480046749115,-0.37336501479148865],[0.904807984828949,0.2047480046749115,-0.37336501479148865],[0.904807984828949,0.2047480046749115,-0.37336501479148865],[0.904807984828949,0.2047480046749115,-0.37336501479148865],[0.904807984828949,0.2047480046749115,-0.37336501479148865],[-0.904807984828949,0.2047480046749115,-0.37336501479148865],[-0.904807984828949,0.2047480046749115,-0.37336501479148865],[-0.904807984828949,0.2047480046749115,-0.37336501479148865],[-0.904807984828949,0.2047480046749115,-0.37336501479148865],[-0.904807984828949,0.2047480046749115,-0.37336501479148865],[-0.904807984828949,0.2047480046749115,-0.37336501479148865],[0.10341800004243851,-0.982466995716095,0.15512600541114807],[0.10341800004243851,-0.982466995716095,0.15512600541114807],[0.10341800004243851,-0.982466995716095,0.15512600541114807],[0.10341800004243851,-0.982466995716095,0.15512600541114807],[0.10341800004243851,-0.982466995716095,0.15512600541114807],[0.10341800004243851,-0.982466995716095,0.15512600541114807],[-0.10341800004243851,-0.982466995716095,0.15512600541114807],[-0.10341800004243851,-0.982466995716095,0.15512600541114807],[-0.10341800004243851,-0.982466995716095,0.15512600541114807],[-0.10341800004243851,-0.982466995716095,0.15512600541114807],[-0.10341800004243851,-0.982466995716095,0.15512600541114807],[-0.10341800004243851,-0.982466995716095,0.15512600541114807],[0.08405649662017822,-0.3530369997024536,0.9318259954452515],[0.08405649662017822,-0.3530369997024536,0.9318259954452515],[0.08405649662017822,-0.3530369997024536,0.9318259954452515],[0.08405649662017822,-0.3530369997024536,0.9318259954452515],[0.08405649662017822,-0.3530369997024536,0.9318259954452515],[0.08405649662017822,-0.3530369997024536,0.9318259954452515],[-0.08405649662017822,-0.3530369997024536,0.9318259954452515],[-0.08405649662017822,-0.3530369997024536,0.9318259954452515],[-0.08405649662017822,-0.3530369997024536,0.9318259954452515],[-0.08405649662017822,-0.3530369997024536,0.9318259954452515],[-0.08405649662017822,-0.3530369997024536,0.9318259954452515],[-0.08405649662017822,-0.3530369997024536,0.9318259954452515],[0.6446059942245483,-0.7593989968299866,-0.08830220252275467],[0.6446059942245483,-0.7593989968299866,-0.08830220252275467],[0.6446059942245483,-0.7593989968299866,-0.08830220252275467],[0.6446059942245483,-0.7593989968299866,-0.08830220252275467],[0.6446059942245483,-0.7593989968299866,-0.08830220252275467],[0.6446059942245483,-0.7593989968299866,-0.08830220252275467],[-0.6446059942245483,-0.7593989968299866,-0.08830220252275467],[-0.6446059942245483,-0.7593989968299866,-0.08830220252275467],[-0.6446059942245483,-0.7593989968299866,-0.08830220252275467],[-0.6446059942245483,-0.7593989968299866,-0.08830220252275467],[-0.6446059942245483,-0.7593989968299866,-0.08830220252275467],[-0.6446059942245483,-0.7593989968299866,-0.08830220252275467],[0.43093499541282654,-0.767848014831543,0.474029004573822],[0.43093499541282654,-0.767848014831543,0.474029004573822],[0.43093499541282654,-0.767848014831543,0.474029004573822],[0.43093499541282654,-0.767848014831543,0.474029004573822],[0.43093499541282654,-0.767848014831543,0.474029004573822],[0.43093499541282654,-0.767848014831543,0.474029004573822],[-0.43093499541282654,-0.767848014831543,0.474029004573822],[-0.43093499541282654,-0.767848014831543,0.474029004573822],[-0.43093499541282654,-0.767848014831543,0.474029004573822],[-0.43093499541282654,-0.767848014831543,0.474029004573822],[-0.43093499541282654,-0.767848014831543,0.474029004573822],[-0.43093499541282654,-0.767848014831543,0.474029004573822],[0.8032349944114685,-0.34622201323509216,-0.4847109913825989],[0.8032349944114685,-0.34622201323509216,-0.4847109913825989],[0.8032349944114685,-0.34622201323509216,-0.4847109913825989],[0.8032349944114685,-0.34622201323509216,-0.4847109913825989],[0.8032349944114685,-0.34622201323509216,-0.4847109913825989],[0.8032349944114685,-0.34622201323509216,-0.4847109913825989],[-0.8032349944114685,-0.34622201323509216,-0.4847109913825989],[-0.8032349944114685,-0.34622201323509216,-0.4847109913825989],[-0.8032349944114685,-0.34622201323509216,-0.4847109913825989],[-0.8032349944114685,-0.34622201323509216,-0.4847109913825989],[-0.8032349944114685,-0.34622201323509216,-0.4847109913825989],[-0.8032349944114685,-0.34622201323509216,-0.4847109913825989],[0.5811219811439514,-0.7013530135154724,-0.4127970039844513],[0.5811219811439514,-0.7013530135154724,-0.4127970039844513],[0.5811219811439514,-0.7013530135154724,-0.4127970039844513],[0.5811219811439514,-0.7013530135154724,-0.4127970039844513],[0.5811219811439514,-0.7013530135154724,-0.4127970039844513],[0.5811219811439514,-0.7013530135154724,-0.4127970039844513],[-0.5811219811439514,-0.7013530135154724,-0.4127970039844513],[-0.5811219811439514,-0.7013530135154724,-0.4127970039844513],[-0.5811219811439514,-0.7013530135154724,-0.4127970039844513],[-0.5811219811439514,-0.7013530135154724,-0.4127970039844513],[-0.5811219811439514,-0.7013530135154724,-0.4127970039844513],[-0.5811219811439514,-0.7013530135154724,-0.4127970039844513],[0.5910009741783142,-0.6822050213813782,-0.43048200011253357],[0.5910009741783142,-0.6822050213813782,-0.43048200011253357],[0.5910009741783142,-0.6822050213813782,-0.43048200011253357],[0.5910009741783142,-0.6822050213813782,-0.43048200011253357],[0.5910009741783142,-0.6822050213813782,-0.43048200011253357],[0.5910009741783142,-0.6822050213813782,-0.43048200011253357],[-0.5910009741783142,-0.6822050213813782,-0.43048200011253357],[-0.5910009741783142,-0.6822050213813782,-0.43048200011253357],[-0.5910009741783142,-0.6822050213813782,-0.43048200011253357],[-0.5910009741783142,-0.6822050213813782,-0.43048200011253357],[-0.5910009741783142,-0.6822050213813782,-0.43048200011253357],[-0.5910009741783142,-0.6822050213813782,-0.43048200011253357],[0.981814980506897,0.059145499020814896,-0.1803939938545227],[0.981814980506897,0.059145499020814896,-0.1803939938545227],[0.981814980506897,0.059145499020814896,-0.1803939938545227],[0.981814980506897,0.059145499020814896,-0.1803939938545227],[0.981814980506897,0.059145499020814896,-0.1803939938545227],[0.981814980506897,0.059145499020814896,-0.1803939938545227],[-0.981814980506897,0.059145499020814896,-0.1803939938545227],[-0.981814980506897,0.059145499020814896,-0.1803939938545227],[-0.981814980506897,0.059145499020814896,-0.1803939938545227],[-0.981814980506897,0.059145499020814896,-0.1803939938545227],[-0.981814980506897,0.059145499020814896,-0.1803939938545227],[-0.981814980506897,0.059145499020814896,-0.1803939938545227],[0.9104859828948975,0.11748199909925461,-0.39650198817253113],[0.9104859828948975,0.11748199909925461,-0.39650198817253113],[0.9104859828948975,0.11748199909925461,-0.39650198817253113],[0.9104859828948975,0.11748199909925461,-0.39650198817253113],[0.9104859828948975,0.11748199909925461,-0.39650198817253113],[0.9104859828948975,0.11748199909925461,-0.39650198817253113],[-0.9104859828948975,0.11748199909925461,-0.39650198817253113],[-0.9104859828948975,0.11748199909925461,-0.39650198817253113],[-0.9104859828948975,0.11748199909925461,-0.39650198817253113],[-0.9104859828948975,0.11748199909925461,-0.39650198817253113],[-0.9104859828948975,0.11748199909925461,-0.39650198817253113],[-0.9104859828948975,0.11748199909925461,-0.39650198817253113],[0.9972019791603088,0.0725238025188446,-0.018130900338292122],[0.9972019791603088,0.0725238025188446,-0.018130900338292122],[0.9972019791603088,0.0725238025188446,-0.018130900338292122],[-0.9972019791603088,0.0725238025188446,-0.018130900338292122],[-0.9972019791603088,0.0725238025188446,-0.018130900338292122],[-0.9972019791603088,0.0725238025188446,-0.018130900338292122],[0.7313100099563599,-0.19245000183582306,-0.6543300151824951],[0.7313100099563599,-0.19245000183582306,-0.6543300151824951],[0.7313100099563599,-0.19245000183582306,-0.6543300151824951],[0.7313100099563599,-0.19245000183582306,-0.6543300151824951],[0.7313100099563599,-0.19245000183582306,-0.6543300151824951],[0.7313100099563599,-0.19245000183582306,-0.6543300151824951],[-0.7313100099563599,-0.19245000183582306,-0.6543300151824951],[-0.7313100099563599,-0.19245000183582306,-0.6543300151824951],[-0.7313100099563599,-0.19245000183582306,-0.6543300151824951],[-0.7313100099563599,-0.19245000183582306,-0.6543300151824951],[-0.7313100099563599,-0.19245000183582306,-0.6543300151824951],[-0.7313100099563599,-0.19245000183582306,-0.6543300151824951],[0.7867180109024048,-0.10728000104427338,-0.6079189777374268],[0.7867180109024048,-0.10728000104427338,-0.6079189777374268],[0.7867180109024048,-0.10728000104427338,-0.6079189777374268],[0.7867180109024048,-0.10728000104427338,-0.6079189777374268],[0.7867180109024048,-0.10728000104427338,-0.6079189777374268],[0.7867180109024048,-0.10728000104427338,-0.6079189777374268],[-0.7867180109024048,-0.10728000104427338,-0.6079189777374268],[-0.7867180109024048,-0.10728000104427338,-0.6079189777374268],[-0.7867180109024048,-0.10728000104427338,-0.6079189777374268],[-0.7867180109024048,-0.10728000104427338,-0.6079189777374268],[-0.7867180109024048,-0.10728000104427338,-0.6079189777374268],[-0.7867180109024048,-0.10728000104427338,-0.6079189777374268],[0.7022470235824585,-0.11704099923372269,-0.7022470235824585],[0.7022470235824585,-0.11704099923372269,-0.7022470235824585],[0.7022470235824585,-0.11704099923372269,-0.7022470235824585],[0.7022470235824585,-0.11704099923372269,-0.7022470235824585],[0.7022470235824585,-0.11704099923372269,-0.7022470235824585],[0.7022470235824585,-0.11704099923372269,-0.7022470235824585],[-0.7022470235824585,-0.11704099923372269,-0.7022470235824585],[-0.7022470235824585,-0.11704099923372269,-0.7022470235824585],[-0.7022470235824585,-0.11704099923372269,-0.7022470235824585],[-0.7022470235824585,-0.11704099923372269,-0.7022470235824585],[-0.7022470235824585,-0.11704099923372269,-0.7022470235824585],[-0.7022470235824585,-0.11704099923372269,-0.7022470235824585],[0.18404799699783325,0.05112430080771446,0.9815869927406311],[0.18404799699783325,0.05112430080771446,0.9815869927406311],[0.18404799699783325,0.05112430080771446,0.9815869927406311],[0.18404799699783325,0.05112430080771446,0.9815869927406311],[0.18404799699783325,0.05112430080771446,0.9815869927406311],[0.18404799699783325,0.05112430080771446,0.9815869927406311],[-0.18404799699783325,0.05112430080771446,0.9815869927406311],[-0.18404799699783325,0.05112430080771446,0.9815869927406311],[-0.18404799699783325,0.05112430080771446,0.9815869927406311],[-0.18404799699783325,0.05112430080771446,0.9815869927406311],[-0.18404799699783325,0.05112430080771446,0.9815869927406311],[-0.18404799699783325,0.05112430080771446,0.9815869927406311],[0.9351900219917297,-0.12835900485515594,0.3300670087337494],[0.9351900219917297,-0.12835900485515594,0.3300670087337494],[0.9351900219917297,-0.12835900485515594,0.3300670087337494],[0.9351900219917297,-0.12835900485515594,0.3300670087337494],[0.9351900219917297,-0.12835900485515594,0.3300670087337494],[0.9351900219917297,-0.12835900485515594,0.3300670087337494],[-0.9351900219917297,-0.12835900485515594,0.3300670087337494],[-0.9351900219917297,-0.12835900485515594,0.3300670087337494],[-0.9351900219917297,-0.12835900485515594,0.3300670087337494],[-0.9351900219917297,-0.12835900485515594,0.3300670087337494],[-0.9351900219917297,-0.12835900485515594,0.3300670087337494],[-0.9351900219917297,-0.12835900485515594,0.3300670087337494],[0.6633480191230774,-0.05527900159358978,-0.7462670207023621],[0.6633480191230774,-0.05527900159358978,-0.7462670207023621],[0.6633480191230774,-0.05527900159358978,-0.7462670207023621],[0.6633480191230774,-0.05527900159358978,-0.7462670207023621],[0.6633480191230774,-0.05527900159358978,-0.7462670207023621],[0.6633480191230774,-0.05527900159358978,-0.7462670207023621],[-0.6633480191230774,-0.05527900159358978,-0.7462670207023621],[-0.6633480191230774,-0.05527900159358978,-0.7462670207023621],[-0.6633480191230774,-0.05527900159358978,-0.7462670207023621],[-0.6633480191230774,-0.05527900159358978,-0.7462670207023621],[-0.6633480191230774,-0.05527900159358978,-0.7462670207023621],[-0.6633480191230774,-0.05527900159358978,-0.7462670207023621],[-0.008521519601345062,-0.07669369876384735,0.9970179796218872],[-0.008521519601345062,-0.07669369876384735,0.9970179796218872],[-0.008521519601345062,-0.07669369876384735,0.9970179796218872],[-0.008521519601345062,-0.07669369876384735,0.9970179796218872],[-0.008521519601345062,-0.07669369876384735,0.9970179796218872],[-0.008521519601345062,-0.07669369876384735,0.9970179796218872],[0.008521519601345062,-0.07669369876384735,0.9970179796218872],[0.008521519601345062,-0.07669369876384735,0.9970179796218872],[0.008521519601345062,-0.07669369876384735,0.9970179796218872],[0.008521519601345062,-0.07669369876384735,0.9970179796218872],[0.008521519601345062,-0.07669369876384735,0.9970179796218872],[0.008521519601345062,-0.07669369876384735,0.9970179796218872],[0.6236910223960876,-0.33538100123405457,-0.7060660123825073],[0.6236910223960876,-0.33538100123405457,-0.7060660123825073],[0.6236910223960876,-0.33538100123405457,-0.7060660123825073],[0.6236910223960876,-0.33538100123405457,-0.7060660123825073],[0.6236910223960876,-0.33538100123405457,-0.7060660123825073],[0.6236910223960876,-0.33538100123405457,-0.7060660123825073],[-0.6236910223960876,-0.33538100123405457,-0.7060660123825073],[-0.6236910223960876,-0.33538100123405457,-0.7060660123825073],[-0.6236910223960876,-0.33538100123405457,-0.7060660123825073],[-0.6236910223960876,-0.33538100123405457,-0.7060660123825073],[-0.6236910223960876,-0.33538100123405457,-0.7060660123825073],[-0.6236910223960876,-0.33538100123405457,-0.7060660123825073],[0.2733120024204254,-0.3587220013141632,-0.8925349712371826],[0.2733120024204254,-0.3587220013141632,-0.8925349712371826],[0.2733120024204254,-0.3587220013141632,-0.8925349712371826],[0.2733120024204254,-0.3587220013141632,-0.8925349712371826],[0.2733120024204254,-0.3587220013141632,-0.8925349712371826],[0.2733120024204254,-0.3587220013141632,-0.8925349712371826],[-0.2733120024204254,-0.3587220013141632,-0.8925349712371826],[-0.2733120024204254,-0.3587220013141632,-0.8925349712371826],[-0.2733120024204254,-0.3587220013141632,-0.8925349712371826],[-0.2733120024204254,-0.3587220013141632,-0.8925349712371826],[-0.2733120024204254,-0.3587220013141632,-0.8925349712371826],[-0.2733120024204254,-0.3587220013141632,-0.8925349712371826],[-0.832768976688385,0.219977006316185,-0.5080410242080688],[-0.832768976688385,0.219977006316185,-0.5080410242080688],[-0.832768976688385,0.219977006316185,-0.5080410242080688],[-0.832768976688385,0.219977006316185,-0.5080410242080688],[-0.832768976688385,0.219977006316185,-0.5080410242080688],[-0.832768976688385,0.219977006316185,-0.5080410242080688],[0.832768976688385,0.219977006316185,-0.5080410242080688],[0.832768976688385,0.219977006316185,-0.5080410242080688],[0.832768976688385,0.219977006316185,-0.5080410242080688],[0.832768976688385,0.219977006316185,-0.5080410242080688],[0.832768976688385,0.219977006316185,-0.5080410242080688],[0.832768976688385,0.219977006316185,-0.5080410242080688],[-0.8339089751243591,0.4980809986591339,0.23772099614143372],[-0.8339089751243591,0.4980809986591339,0.23772099614143372],[-0.8339089751243591,0.4980809986591339,0.23772099614143372],[-0.8339089751243591,0.4980809986591339,0.23772099614143372],[-0.8339089751243591,0.4980809986591339,0.23772099614143372],[-0.8339089751243591,0.4980809986591339,0.23772099614143372],[0.8339089751243591,0.4980809986591339,0.23772099614143372],[0.8339089751243591,0.4980809986591339,0.23772099614143372],[0.8339089751243591,0.4980809986591339,0.23772099614143372],[0.8339089751243591,0.4980809986591339,0.23772099614143372],[0.8339089751243591,0.4980809986591339,0.23772099614143372],[0.8339089751243591,0.4980809986591339,0.23772099614143372],[-0.5654640197753906,0.2538819909095764,0.7847260236740112],[-0.5654640197753906,0.2538819909095764,0.7847260236740112],[-0.5654640197753906,0.2538819909095764,0.7847260236740112],[-0.5654640197753906,0.2538819909095764,0.7847260236740112],[-0.5654640197753906,0.2538819909095764,0.7847260236740112],[-0.5654640197753906,0.2538819909095764,0.7847260236740112],[0.5654640197753906,0.2538819909095764,0.7847260236740112],[0.5654640197753906,0.2538819909095764,0.7847260236740112],[0.5654640197753906,0.2538819909095764,0.7847260236740112],[0.5654640197753906,0.2538819909095764,0.7847260236740112],[0.5654640197753906,0.2538819909095764,0.7847260236740112],[0.5654640197753906,0.2538819909095764,0.7847260236740112],[-0.05596470087766647,-0.06715759634971619,0.9961720108985901],[-0.05596470087766647,-0.06715759634971619,0.9961720108985901],[-0.05596470087766647,-0.06715759634971619,0.9961720108985901],[-0.05596470087766647,-0.06715759634971619,0.9961720108985901],[-0.05596470087766647,-0.06715759634971619,0.9961720108985901],[-0.05596470087766647,-0.06715759634971619,0.9961720108985901],[0.05596470087766647,-0.06715759634971619,0.9961720108985901],[0.05596470087766647,-0.06715759634971619,0.9961720108985901],[0.05596470087766647,-0.06715759634971619,0.9961720108985901],[0.05596470087766647,-0.06715759634971619,0.9961720108985901],[0.05596470087766647,-0.06715759634971619,0.9961720108985901],[0.05596470087766647,-0.06715759634971619,0.9961720108985901],[0.14449800550937653,-0.9892550110816956,0.022230500355362892],[0.14449800550937653,-0.9892550110816956,0.022230500355362892],[0.14449800550937653,-0.9892550110816956,0.022230500355362892],[0.14449800550937653,-0.9892550110816956,0.022230500355362892],[0.14449800550937653,-0.9892550110816956,0.022230500355362892],[0.14449800550937653,-0.9892550110816956,0.022230500355362892],[-0.14449800550937653,-0.9892550110816956,0.022230500355362892],[-0.14449800550937653,-0.9892550110816956,0.022230500355362892],[-0.14449800550937653,-0.9892550110816956,0.022230500355362892],[-0.14449800550937653,-0.9892550110816956,0.022230500355362892],[-0.14449800550937653,-0.9892550110816956,0.022230500355362892],[-0.14449800550937653,-0.9892550110816956,0.022230500355362892],[0.32745200395584106,-0.9426640272140503,0.06449809670448303],[0.32745200395584106,-0.9426640272140503,0.06449809670448303],[0.32745200395584106,-0.9426640272140503,0.06449809670448303],[0.32745200395584106,-0.9426640272140503,0.06449809670448303],[0.32745200395584106,-0.9426640272140503,0.06449809670448303],[0.32745200395584106,-0.9426640272140503,0.06449809670448303],[-0.32745200395584106,-0.9426640272140503,0.06449809670448303],[-0.32745200395584106,-0.9426640272140503,0.06449809670448303],[-0.32745200395584106,-0.9426640272140503,0.06449809670448303],[-0.32745200395584106,-0.9426640272140503,0.06449809670448303],[-0.32745200395584106,-0.9426640272140503,0.06449809670448303],[-0.32745200395584106,-0.9426640272140503,0.06449809670448303],[0.31266701221466064,-0.9495800137519836,0.023160500451922417],[0.31266701221466064,-0.9495800137519836,0.023160500451922417],[0.31266701221466064,-0.9495800137519836,0.023160500451922417],[0.31266701221466064,-0.9495800137519836,0.023160500451922417],[0.31266701221466064,-0.9495800137519836,0.023160500451922417],[0.31266701221466064,-0.9495800137519836,0.023160500451922417],[-0.31266701221466064,-0.9495800137519836,0.023160500451922417],[-0.31266701221466064,-0.9495800137519836,0.023160500451922417],[-0.31266701221466064,-0.9495800137519836,0.023160500451922417],[-0.31266701221466064,-0.9495800137519836,0.023160500451922417],[-0.31266701221466064,-0.9495800137519836,0.023160500451922417],[-0.31266701221466064,-0.9495800137519836,0.023160500451922417],[0.17098799347877502,-0.9848930239677429,0.027358099818229675],[0.17098799347877502,-0.9848930239677429,0.027358099818229675],[0.17098799347877502,-0.9848930239677429,0.027358099818229675],[0.17098799347877502,-0.9848930239677429,0.027358099818229675],[0.17098799347877502,-0.9848930239677429,0.027358099818229675],[0.17098799347877502,-0.9848930239677429,0.027358099818229675],[-0.17098799347877502,-0.9848930239677429,0.027358099818229675],[-0.17098799347877502,-0.9848930239677429,0.027358099818229675],[-0.17098799347877502,-0.9848930239677429,0.027358099818229675],[-0.17098799347877502,-0.9848930239677429,0.027358099818229675],[-0.17098799347877502,-0.9848930239677429,0.027358099818229675],[-0.17098799347877502,-0.9848930239677429,0.027358099818229675],[0.3486579954624176,-0.8929060101509094,0.28488001227378845],[0.3486579954624176,-0.8929060101509094,0.28488001227378845],[0.3486579954624176,-0.8929060101509094,0.28488001227378845],[0.3486579954624176,-0.8929060101509094,0.28488001227378845],[0.3486579954624176,-0.8929060101509094,0.28488001227378845],[0.3486579954624176,-0.8929060101509094,0.28488001227378845],[-0.3486579954624176,-0.8929060101509094,0.28488001227378845],[-0.3486579954624176,-0.8929060101509094,0.28488001227378845],[-0.3486579954624176,-0.8929060101509094,0.28488001227378845],[-0.3486579954624176,-0.8929060101509094,0.28488001227378845],[-0.3486579954624176,-0.8929060101509094,0.28488001227378845],[-0.3486579954624176,-0.8929060101509094,0.28488001227378845],[0.4005819857120514,-0.9156169891357422,-0.03433559834957123],[0.4005819857120514,-0.9156169891357422,-0.03433559834957123],[0.4005819857120514,-0.9156169891357422,-0.03433559834957123],[0.4005819857120514,-0.9156169891357422,-0.03433559834957123],[0.4005819857120514,-0.9156169891357422,-0.03433559834957123],[0.4005819857120514,-0.9156169891357422,-0.03433559834957123],[-0.4005819857120514,-0.9156169891357422,-0.03433559834957123],[-0.4005819857120514,-0.9156169891357422,-0.03433559834957123],[-0.4005819857120514,-0.9156169891357422,-0.03433559834957123],[-0.4005819857120514,-0.9156169891357422,-0.03433559834957123],[-0.4005819857120514,-0.9156169891357422,-0.03433559834957123],[-0.4005819857120514,-0.9156169891357422,-0.03433559834957123],[0.25719401240348816,-0.9644780158996582,-0.06027989834547043],[0.25719401240348816,-0.9644780158996582,-0.06027989834547043],[0.25719401240348816,-0.9644780158996582,-0.06027989834547043],[0.25719401240348816,-0.9644780158996582,-0.06027989834547043],[0.25719401240348816,-0.9644780158996582,-0.06027989834547043],[0.25719401240348816,-0.9644780158996582,-0.06027989834547043],[-0.25719401240348816,-0.9644780158996582,-0.06027989834547043],[-0.25719401240348816,-0.9644780158996582,-0.06027989834547043],[-0.25719401240348816,-0.9644780158996582,-0.06027989834547043],[-0.25719401240348816,-0.9644780158996582,-0.06027989834547043],[-0.25719401240348816,-0.9644780158996582,-0.06027989834547043],[-0.25719401240348816,-0.9644780158996582,-0.06027989834547043],[0.06369660049676895,-0.9979130029678345,-0.010616100393235683],[0.06369660049676895,-0.9979130029678345,-0.010616100393235683],[0.06369660049676895,-0.9979130029678345,-0.010616100393235683],[0.06369660049676895,-0.9979130029678345,-0.010616100393235683],[0.06369660049676895,-0.9979130029678345,-0.010616100393235683],[0.06369660049676895,-0.9979130029678345,-0.010616100393235683],[-0.06369660049676895,-0.9979130029678345,-0.010616100393235683],[-0.06369660049676895,-0.9979130029678345,-0.010616100393235683],[-0.06369660049676895,-0.9979130029678345,-0.010616100393235683],[-0.06369660049676895,-0.9979130029678345,-0.010616100393235683],[-0.06369660049676895,-0.9979130029678345,-0.010616100393235683],[-0.06369660049676895,-0.9979130029678345,-0.010616100393235683],[-0.3637000024318695,-0.610077977180481,0.703935980796814],[-0.3637000024318695,-0.610077977180481,0.703935980796814],[-0.3637000024318695,-0.610077977180481,0.703935980796814],[-0.3637000024318695,-0.610077977180481,0.703935980796814],[-0.3637000024318695,-0.610077977180481,0.703935980796814],[-0.3637000024318695,-0.610077977180481,0.703935980796814],[0.3637000024318695,-0.610077977180481,0.703935980796814],[0.3637000024318695,-0.610077977180481,0.703935980796814],[0.3637000024318695,-0.610077977180481,0.703935980796814],[0.3637000024318695,-0.610077977180481,0.703935980796814],[0.3637000024318695,-0.610077977180481,0.703935980796814],[0.3637000024318695,-0.610077977180481,0.703935980796814],[0.6298819780349731,-0.7758809924125671,0.03545689955353737],[0.6298819780349731,-0.7758809924125671,0.03545689955353737],[0.6298819780349731,-0.7758809924125671,0.03545689955353737],[0.6298819780349731,-0.7758809924125671,0.03545689955353737],[0.6298819780349731,-0.7758809924125671,0.03545689955353737],[0.6298819780349731,-0.7758809924125671,0.03545689955353737],[-0.6298819780349731,-0.7758809924125671,0.03545689955353737],[-0.6298819780349731,-0.7758809924125671,0.03545689955353737],[-0.6298819780349731,-0.7758809924125671,0.03545689955353737],[-0.6298819780349731,-0.7758809924125671,0.03545689955353737],[-0.6298819780349731,-0.7758809924125671,0.03545689955353737],[-0.6298819780349731,-0.7758809924125671,0.03545689955353737],[0.44721001386642456,-0.8717259764671326,-0.2002429962158203],[0.44721001386642456,-0.8717259764671326,-0.2002429962158203],[0.44721001386642456,-0.8717259764671326,-0.2002429962158203],[0.44721001386642456,-0.8717259764671326,-0.2002429962158203],[0.44721001386642456,-0.8717259764671326,-0.2002429962158203],[0.44721001386642456,-0.8717259764671326,-0.2002429962158203],[-0.44721001386642456,-0.8717259764671326,-0.2002429962158203],[-0.44721001386642456,-0.8717259764671326,-0.2002429962158203],[-0.44721001386642456,-0.8717259764671326,-0.2002429962158203],[-0.44721001386642456,-0.8717259764671326,-0.2002429962158203],[-0.44721001386642456,-0.8717259764671326,-0.2002429962158203],[-0.44721001386642456,-0.8717259764671326,-0.2002429962158203],[0.5071629881858826,-0.8348429799079895,-0.21406200528144836],[0.5071629881858826,-0.8348429799079895,-0.21406200528144836],[0.5071629881858826,-0.8348429799079895,-0.21406200528144836],[0.5071629881858826,-0.8348429799079895,-0.21406200528144836],[0.5071629881858826,-0.8348429799079895,-0.21406200528144836],[0.5071629881858826,-0.8348429799079895,-0.21406200528144836],[-0.5071629881858826,-0.8348429799079895,-0.21406200528144836],[-0.5071629881858826,-0.8348429799079895,-0.21406200528144836],[-0.5071629881858826,-0.8348429799079895,-0.21406200528144836],[-0.5071629881858826,-0.8348429799079895,-0.21406200528144836],[-0.5071629881858826,-0.8348429799079895,-0.21406200528144836],[-0.5071629881858826,-0.8348429799079895,-0.21406200528144836],[0.5258229970932007,-0.8092589974403381,0.2619340121746063],[0.5258229970932007,-0.8092589974403381,0.2619340121746063],[0.5258229970932007,-0.8092589974403381,0.2619340121746063],[0.5258229970932007,-0.8092589974403381,0.2619340121746063],[0.5258229970932007,-0.8092589974403381,0.2619340121746063],[0.5258229970932007,-0.8092589974403381,0.2619340121746063],[-0.5258229970932007,-0.8092589974403381,0.2619340121746063],[-0.5258229970932007,-0.8092589974403381,0.2619340121746063],[-0.5258229970932007,-0.8092589974403381,0.2619340121746063],[-0.5258229970932007,-0.8092589974403381,0.2619340121746063],[-0.5258229970932007,-0.8092589974403381,0.2619340121746063],[-0.5258229970932007,-0.8092589974403381,0.2619340121746063],[0.2979640066623688,-0.7579789757728577,0.5802459716796875],[0.2979640066623688,-0.7579789757728577,0.5802459716796875],[0.2979640066623688,-0.7579789757728577,0.5802459716796875],[-0.2979640066623688,-0.7579789757728577,0.5802459716796875],[-0.2979640066623688,-0.7579789757728577,0.5802459716796875],[-0.2979640066623688,-0.7579789757728577,0.5802459716796875],[0.09303779900074005,0.08050079643726349,-0.992402970790863],[0.09303779900074005,0.08050079643726349,-0.992402970790863],[0.09303779900074005,0.08050079643726349,-0.992402970790863],[0.09303779900074005,0.08050079643726349,-0.992402970790863],[0.09303779900074005,0.08050079643726349,-0.992402970790863],[0.09303779900074005,0.08050079643726349,-0.992402970790863],[-0.09303779900074005,0.08050079643726349,-0.992402970790863],[-0.09303779900074005,0.08050079643726349,-0.992402970790863],[-0.09303779900074005,0.08050079643726349,-0.992402970790863],[-0.09303779900074005,0.08050079643726349,-0.992402970790863],[-0.09303779900074005,0.08050079643726349,-0.992402970790863],[-0.09303779900074005,0.08050079643726349,-0.992402970790863],[0.5005800127983093,-0.007971029728651047,-0.8656529784202576],[0.5005800127983093,-0.007971029728651047,-0.8656529784202576],[0.5005800127983093,-0.007971029728651047,-0.8656529784202576],[0.5005800127983093,-0.007971029728651047,-0.8656529784202576],[0.5005800127983093,-0.007971029728651047,-0.8656529784202576],[0.5005800127983093,-0.007971029728651047,-0.8656529784202576],[-0.5005800127983093,-0.007971029728651047,-0.8656529784202576],[-0.5005800127983093,-0.007971029728651047,-0.8656529784202576],[-0.5005800127983093,-0.007971029728651047,-0.8656529784202576],[-0.5005800127983093,-0.007971029728651047,-0.8656529784202576],[-0.5005800127983093,-0.007971029728651047,-0.8656529784202576],[-0.5005800127983093,-0.007971029728651047,-0.8656529784202576],[0.9285159707069397,-0.27479100227355957,-0.24969600141048431],[0.9285159707069397,-0.27479100227355957,-0.24969600141048431],[0.9285159707069397,-0.27479100227355957,-0.24969600141048431],[0.9285159707069397,-0.27479100227355957,-0.24969600141048431],[0.9285159707069397,-0.27479100227355957,-0.24969600141048431],[0.9285159707069397,-0.27479100227355957,-0.24969600141048431],[-0.9285159707069397,-0.27479100227355957,-0.24969600141048431],[-0.9285159707069397,-0.27479100227355957,-0.24969600141048431],[-0.9285159707069397,-0.27479100227355957,-0.24969600141048431],[-0.9285159707069397,-0.27479100227355957,-0.24969600141048431],[-0.9285159707069397,-0.27479100227355957,-0.24969600141048431],[-0.9285159707069397,-0.27479100227355957,-0.24969600141048431],[0.8392599821090698,0.03778019919991493,0.542415976524353],[0.8392599821090698,0.03778019919991493,0.542415976524353],[0.8392599821090698,0.03778019919991493,0.542415976524353],[0.8392599821090698,0.03778019919991493,0.542415976524353],[0.8392599821090698,0.03778019919991493,0.542415976524353],[0.8392599821090698,0.03778019919991493,0.542415976524353],[-0.8392599821090698,0.03778019919991493,0.542415976524353],[-0.8392599821090698,0.03778019919991493,0.542415976524353],[-0.8392599821090698,0.03778019919991493,0.542415976524353],[-0.8392599821090698,0.03778019919991493,0.542415976524353],[-0.8392599821090698,0.03778019919991493,0.542415976524353],[-0.8392599821090698,0.03778019919991493,0.542415976524353],[-0.23553499579429626,0.2589080035686493,0.936743974685669],[-0.23553499579429626,0.2589080035686493,0.936743974685669],[-0.23553499579429626,0.2589080035686493,0.936743974685669],[-0.23553499579429626,0.2589080035686493,0.936743974685669],[-0.23553499579429626,0.2589080035686493,0.936743974685669],[-0.23553499579429626,0.2589080035686493,0.936743974685669],[0.23553499579429626,0.2589080035686493,0.936743974685669],[0.23553499579429626,0.2589080035686493,0.936743974685669],[0.23553499579429626,0.2589080035686493,0.936743974685669],[0.23553499579429626,0.2589080035686493,0.936743974685669],[0.23553499579429626,0.2589080035686493,0.936743974685669],[0.23553499579429626,0.2589080035686493,0.936743974685669],[-0.4499189853668213,0.12854799628257751,0.8837689757347107],[-0.4499189853668213,0.12854799628257751,0.8837689757347107],[-0.4499189853668213,0.12854799628257751,0.8837689757347107],[-0.4499189853668213,0.12854799628257751,0.8837689757347107],[-0.4499189853668213,0.12854799628257751,0.8837689757347107],[-0.4499189853668213,0.12854799628257751,0.8837689757347107],[0.4499189853668213,0.12854799628257751,0.8837689757347107],[0.4499189853668213,0.12854799628257751,0.8837689757347107],[0.4499189853668213,0.12854799628257751,0.8837689757347107],[0.4499189853668213,0.12854799628257751,0.8837689757347107],[0.4499189853668213,0.12854799628257751,0.8837689757347107],[0.4499189853668213,0.12854799628257751,0.8837689757347107],[-0.5383639931678772,0.8426560163497925,-0.009752959944307804],[-0.5383639931678772,0.8426560163497925,-0.009752959944307804],[-0.5383639931678772,0.8426560163497925,-0.009752959944307804],[-0.5383639931678772,0.8426560163497925,-0.009752959944307804],[-0.5383639931678772,0.8426560163497925,-0.009752959944307804],[-0.5383639931678772,0.8426560163497925,-0.009752959944307804],[0.5383639931678772,0.8426560163497925,-0.009752959944307804],[0.5383639931678772,0.8426560163497925,-0.009752959944307804],[0.5383639931678772,0.8426560163497925,-0.009752959944307804],[0.5383639931678772,0.8426560163497925,-0.009752959944307804],[0.5383639931678772,0.8426560163497925,-0.009752959944307804],[0.5383639931678772,0.8426560163497925,-0.009752959944307804],[-0.19103999435901642,0.9812859892845154,-0.024097399786114693],[-0.19103999435901642,0.9812859892845154,-0.024097399786114693],[-0.19103999435901642,0.9812859892845154,-0.024097399786114693],[-0.19103999435901642,0.9812859892845154,-0.024097399786114693],[-0.19103999435901642,0.9812859892845154,-0.024097399786114693],[-0.19103999435901642,0.9812859892845154,-0.024097399786114693],[0.19103999435901642,0.9812859892845154,-0.024097399786114693],[0.19103999435901642,0.9812859892845154,-0.024097399786114693],[0.19103999435901642,0.9812859892845154,-0.024097399786114693],[0.19103999435901642,0.9812859892845154,-0.024097399786114693],[0.19103999435901642,0.9812859892845154,-0.024097399786114693],[0.19103999435901642,0.9812859892845154,-0.024097399786114693],[0.40462398529052734,0.914097011089325,0.02658119983971119],[0.40462398529052734,0.914097011089325,0.02658119983971119],[0.40462398529052734,0.914097011089325,0.02658119983971119],[-0.40462398529052734,0.914097011089325,0.02658119983971119],[-0.40462398529052734,0.914097011089325,0.02658119983971119],[-0.40462398529052734,0.914097011089325,0.02658119983971119],[-0.7818679809570312,-0.01967789977788925,0.6231330037117004],[-0.7818679809570312,-0.01967789977788925,0.6231330037117004],[-0.7818679809570312,-0.01967789977788925,0.6231330037117004],[-0.7818679809570312,-0.01967789977788925,0.6231330037117004],[-0.7818679809570312,-0.01967789977788925,0.6231330037117004],[-0.7818679809570312,-0.01967789977788925,0.6231330037117004],[0.7818679809570312,-0.01967789977788925,0.6231330037117004],[0.7818679809570312,-0.01967789977788925,0.6231330037117004],[0.7818679809570312,-0.01967789977788925,0.6231330037117004],[0.7818679809570312,-0.01967789977788925,0.6231330037117004],[0.7818679809570312,-0.01967789977788925,0.6231330037117004],[0.7818679809570312,-0.01967789977788925,0.6231330037117004],[0.5427730083465576,0.8141599893569946,-0.2062540054321289],[0.5427730083465576,0.8141599893569946,-0.2062540054321289],[0.5427730083465576,0.8141599893569946,-0.2062540054321289],[0.5427730083465576,0.8141599893569946,-0.2062540054321289],[0.5427730083465576,0.8141599893569946,-0.2062540054321289],[0.5427730083465576,0.8141599893569946,-0.2062540054321289],[-0.5427730083465576,0.8141599893569946,-0.2062540054321289],[-0.5427730083465576,0.8141599893569946,-0.2062540054321289],[-0.5427730083465576,0.8141599893569946,-0.2062540054321289],[-0.5427730083465576,0.8141599893569946,-0.2062540054321289],[-0.5427730083465576,0.8141599893569946,-0.2062540054321289],[-0.5427730083465576,0.8141599893569946,-0.2062540054321289],[-0.2473980039358139,0.2945219874382019,-0.9230660200119019],[-0.2473980039358139,0.2945219874382019,-0.9230660200119019],[-0.2473980039358139,0.2945219874382019,-0.9230660200119019],[-0.2473980039358139,0.2945219874382019,-0.9230660200119019],[-0.2473980039358139,0.2945219874382019,-0.9230660200119019],[-0.2473980039358139,0.2945219874382019,-0.9230660200119019],[0.2473980039358139,0.2945219874382019,-0.9230660200119019],[0.2473980039358139,0.2945219874382019,-0.9230660200119019],[0.2473980039358139,0.2945219874382019,-0.9230660200119019],[0.2473980039358139,0.2945219874382019,-0.9230660200119019],[0.2473980039358139,0.2945219874382019,-0.9230660200119019],[0.2473980039358139,0.2945219874382019,-0.9230660200119019],[0.4389370083808899,0.4389370083808899,-0.7840080261230469],[-0.14987100660800934,-0.4829939901828766,-0.8627020120620728],[-0.3830539882183075,0.45125100016593933,-0.806003987789154],[-0.14987100660800934,-0.4829939901828766,-0.8627020120620728],[0.4389370083808899,0.4389370083808899,-0.7840080261230469],[0.4389370083808899,-0.4389370083808899,-0.7840080261230469],[0.4389370083808899,0.4389370083808899,-0.7840080261230469],[0.6274759769439697,-0.6274759769439697,0.4610300064086914],[0.4389370083808899,-0.4389370083808899,-0.7840080261230469],[0.6274759769439697,-0.6274759769439697,0.4610300064086914],[0.4389370083808899,0.4389370083808899,-0.7840080261230469],[0.6019120216369629,0.6019120216369629,0.5247899889945984],[0.4389370083808899,0.4389370083808899,-0.7840080261230469],[-0.10715699940919876,0.9741740226745605,0.19875399768352509],[0.6019120216369629,0.6019120216369629,0.5247899889945984],[-0.10715699940919876,0.9741740226745605,0.19875399768352509],[0.4389370083808899,0.4389370083808899,-0.7840080261230469],[-0.3830539882183075,0.45125100016593933,-0.806003987789154],[-0.3830539882183075,0.45125100016593933,-0.806003987789154],[-0.2690869867801666,-0.3968220055103302,0.8775669932365417],[-0.10715699940919876,0.9741740226745605,0.19875399768352509],[-0.3830539882183075,0.45125100016593933,-0.806003987789154],[-0.6465709805488586,0.3143100142478943,0.6950939893722534],[-0.2690869867801666,-0.3968220055103302,0.8775669932365417],[-0.14987100660800934,-0.4829939901828766,-0.8627020120620728],[-0.6465709805488586,0.3143100142478943,0.6950939893722534],[-0.3830539882183075,0.45125100016593933,-0.806003987789154],[-0.10715699940919876,0.9741740226745605,0.19875399768352509],[-0.2690869867801666,-0.3968220055103302,0.8775669932365417],[-0.19261200726032257,-0.9048389792442322,0.37969300150871277],[-0.14987100660800934,-0.4829939901828766,-0.8627020120620728],[-0.2371540069580078,0.8661820292472839,0.43987101316452026],[-0.6465709805488586,0.3143100142478943,0.6950939893722534],[-0.2371540069580078,0.8661820292472839,0.43987101316452026],[-0.14987100660800934,-0.4829939901828766,-0.8627020120620728],[-0.1274549961090088,-0.9653649926185608,0.22765399515628815],[-0.14987100660800934,-0.4829939901828766,-0.8627020120620728],[0.6274759769439697,-0.6274759769439697,0.4610300064086914],[-0.1274549961090088,-0.9653649926185608,0.22765399515628815],[0.6274759769439697,-0.6274759769439697,0.4610300064086914],[-0.14987100660800934,-0.4829939901828766,-0.8627020120620728],[0.4389370083808899,-0.4389370083808899,-0.7840080261230469],[0.6274759769439697,-0.6274759769439697,0.4610300064086914],[-0.2371540069580078,0.8661820292472839,0.43987101316452026],[-0.1274549961090088,-0.9653649926185608,0.22765399515628815],[-0.2371540069580078,0.8661820292472839,0.43987101316452026],[0.6274759769439697,-0.6274759769439697,0.4610300064086914],[-0.5128620266914368,0.4571560025215149,0.726622998714447],[-0.5128620266914368,0.4571560025215149,0.726622998714447],[0.6274759769439697,-0.6274759769439697,0.4610300064086914],[-0.45684099197387695,-0.4072200059890747,0.7908650040626526],[0.6019120216369629,0.6019120216369629,0.5247899889945984],[-0.45684099197387695,-0.4072200059890747,0.7908650040626526],[0.6274759769439697,-0.6274759769439697,0.4610300064086914],[-0.10715699940919876,0.9741740226745605,0.19875399768352509],[-0.45684099197387695,-0.4072200059890747,0.7908650040626526],[0.6019120216369629,0.6019120216369629,0.5247899889945984],[-0.45684099197387695,-0.4072200059890747,0.7908650040626526],[-0.10715699940919876,0.9741740226745605,0.19875399768352509],[-0.19261200726032257,-0.9048389792442322,0.37969300150871277],[-0.2690869867801666,-0.3968220055103302,0.8775669932365417],[-0.45684099197387695,-0.4072200059890747,0.7908650040626526],[-0.19261200726032257,-0.9048389792442322,0.37969300150871277],[-0.45684099197387695,-0.4072200059890747,0.7908650040626526],[-0.2690869867801666,-0.3968220055103302,0.8775669932365417],[-0.41957199573516846,-0.3739989995956421,0.8270940184593201],[-0.2690869867801666,-0.3968220055103302,0.8775669932365417],[-0.41957199573516846,0.3739989995956421,0.8270940184593201],[-0.41957199573516846,-0.3739989995956421,0.8270940184593201],[-0.41957199573516846,0.3739989995956421,0.8270940184593201],[-0.2690869867801666,-0.3968220055103302,0.8775669932365417],[-0.6465709805488586,0.3143100142478943,0.6950939893722534],[-0.2371540069580078,0.8661820292472839,0.43987101316452026],[-0.41957199573516846,0.3739989995956421,0.8270940184593201],[-0.6465709805488586,0.3143100142478943,0.6950939893722534],[-0.41957199573516846,0.3739989995956421,0.8270940184593201],[-0.2371540069580078,0.8661820292472839,0.43987101316452026],[-0.5128620266914368,0.4571560025215149,0.726622998714447],[-0.45684099197387695,-0.4072200059890747,0.7908650040626526],[-0.41957199573516846,0.3739989995956421,0.8270940184593201],[-0.5128620266914368,0.4571560025215149,0.726622998714447],[-0.41957199573516846,0.3739989995956421,0.8270940184593201],[-0.45684099197387695,-0.4072200059890747,0.7908650040626526],[-0.41957199573516846,-0.3739989995956421,0.8270940184593201]];
			var fragTexCoord = [];
			var fragNormal = [];
			var vPosition = [];
			var gl_Position = [];
			var mWorld = [[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]];
			var mView = [[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]];
			var mProj = [[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]];
			for (var i in ProgramDataMap[activeProgramNum].uniformData){
				var tem = [[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]];
				tem[0][0] = ProgramDataMap[activeProgramNum].uniformData[i].uniformData[0];	
				tem[0][1] = ProgramDataMap[activeProgramNum].uniformData[i].uniformData[1];	
				tem[0][2] = ProgramDataMap[activeProgramNum].uniformData[i].uniformData[2];	
				tem[0][3] = ProgramDataMap[activeProgramNum].uniformData[i].uniformData[3];	
				tem[1][0] = ProgramDataMap[activeProgramNum].uniformData[i].uniformData[4];	
				tem[1][1] = ProgramDataMap[activeProgramNum].uniformData[i].uniformData[5];	
				tem[1][2] = ProgramDataMap[activeProgramNum].uniformData[i].uniformData[6];	
				tem[2][0] = ProgramDataMap[activeProgramNum].uniformData[i].uniformData[8];	
				tem[2][1] = ProgramDataMap[activeProgramNum].uniformData[i].uniformData[9];	
				tem[2][2] = ProgramDataMap[activeProgramNum].uniformData[i].uniformData[10];	
				tem[2][3] = ProgramDataMap[activeProgramNum].uniformData[i].uniformData[11];	
				tem[3][0] = ProgramDataMap[activeProgramNum].uniformData[i].uniformData[12];	
				tem[3][1] = ProgramDataMap[activeProgramNum].uniformData[i].uniformData[13];	
				tem[3][2] = ProgramDataMap[activeProgramNum].uniformData[i].uniformData[14];	
				tem[3][3] = ProgramDataMap[activeProgramNum].uniformData[i].uniformData[15];
        tem = math.flatten(tem);
				if (ProgramDataMap[activeProgramNum].uniformData[i].shaderName == 'mWorld')	
					mWorld = tem;
				if (ProgramDataMap[activeProgramNum].uniformData[i].shaderName == 'mView')
					mView = tem;
				if (ProgramDataMap[activeProgramNum].uniformData[i].shaderName == 'mProj')
					mProj = tem;
			}
			//var mWorld = [[-0.9040721654891968,0,-0.42737987637519836,0],[0.2670685350894928,0.7807069420814514,-0.5649522542953491,0],[0.3336584270000458,-0.624897301197052,-0.7058154344558716,0],[0,0,0,1]];
			//var mView = [[-1,0,0,0],[0,1,0,0],[0,0,-1,0],[0,0,-7,1]];
			//var mProj = [[2.4142136573791504,0,0,0],[0,2.4142136573791504,0,0],[0,0,-1.0002000331878662,-1],[0,0,-0.20002000033855438,0]];

			function main () {
				for (var bigI = 0;bigI < vertPosition.length;++ bigI) { 
				vPosition[bigI] = my_multiple( mView, new Float32Array([vertPosition[bigI][0], vertPosition[bigI][1], vertPosition[bigI][2], 1]) );
				fragTexCoord[bigI] = vertTexCoord[bigI];
				fragNormal[bigI] = [0, 1, 2].map(x => (my_multiple( mWorld, new Float32Array([vertNormal[bigI][0], vertNormal[bigI][1], vertNormal[bigI][2], 0]) ))[x]);
				gl_Position[bigI] = my_multiple( my_multiple( my_multiple( mProj, mView ), mWorld ), new Float32Array([vertPosition[bigI][0], vertPosition[bigI][1], vertPosition[bigI][2], 1] ));
				}
				};
		}

		var t0 = performance.now();
		main();
		var t1 = performance.now();
		console.log('main', t1 - t0);

  
  
		/*------------------数据输入部分--------------------------------------*/
  
		/*------------------数据输出部分--------------------------------------*/
		/*
		var t0 = performance.now();
		//去掉空个的函数
		function trim(s){ 
		  return trimRight(trimLeft(s)); 
		} 
		//去掉左边的空白 
		function trimLeft(s){ 
		  if(s == null) { 
			return ""; 
		  } 
		  var whitespace = new String(" \t\n\r"); 
		  var str = new String(s); 
		  if (whitespace.indexOf(str.charAt(0)) != -1) { 
			var j=0, i = str.length; 
			while (j < i && whitespace.indexOf(str.charAt(j)) != -1){ 
			  j++; 
			} 
			str = str.substring(j, i); 
		  } 
		  return str; 
		} 
  
		//去掉右边的空白 
		function trimRight(s){ 
		  if(s == null) return ""; 
		  var whitespace = new String(" \t\n\r"); 
		  var str = new String(s); 
		  if (whitespace.indexOf(str.charAt(str.length-1)) != -1){ 
			var i = str.length - 1; 
			while (i >= 0 && whitespace.indexOf(str.charAt(i)) != -1){ 
			  i--; 
			} 
			str = str.substring(0, i+1); 
		  } 
		  return str; 
		}
  
		var words = trim(testShader);		
		function replaceAll(str)  
		{  
		  if(str!=null)  
			str = str.replace(/;/g," ") 
			  str = str.replace (/\n/g," ") 
			  return str;  
		}  
		var strNew = words.replace(";","");  
		strNew = replaceAll(strNew);  
		var test = strNew.split(" ");
		var finalwords = [];
		for (i in test)
		  if (test[i] != "")
			finalwords = finalwords.concat(trim(test[i]));
  
  
  
		//在这里进行输出的赋值
		var VaryingDataMap = [];
		var i = 0;
		while (i < finalwords.length){
		  if (finalwords[i] == "varying"){
			var newData = new Varying_data;
			i++;
			if (finalwords[i] == "vec2")
			  newData.varyEleNum = 2;
			else if (finalwords[i] == "vec3")
			  newData.varyEleNum = 3;
			else if (finalwords[i] == "vec4")
			  newData.varyEleNum = 4;
			i++;
			newData.shaderName = finalwords[i]
			  newData.uniformData = [];
			VaryingDataMap.push(newData);
		  }
		  i++;
		}
  
  
		for (i in VaryingDataMap){
		  var string = "VaryingDataMap[" + i.toString() + "].uniformData = " + VaryingDataMap[i].shaderName + ";";
		  //eval(string);
		}

		var t1 = performance.now();
		console.log('输出接口', t1 - t0);
		*/
	  }
  
	  /*------------------数据输出部分--------------------------------------*/
	  /*------------------readpixel部分--------------------------------------*/
	  
	  var testNumber = 0;
	  if (testNumber == 1){
  
		var maxTextureUnits = gl.getParameter(gl.MAX_TEXTURE_IMAGE_UNITS);
		var pixels = new Uint8Array(canvas.width * canvas.height * 4);
		gl.readPixels(0, 0, canvas.width, canvas.height, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
		var backtexture = textureFromPixelArray(gl, pixels, gl.RGBA, canvas.width, canvas.height);
		function textureFromPixelArray(gl, dataArray, type, width, height) {
		  var texture = gl.createTexture();
		  gl.bindTexture(gl.TEXTURE_2D, texture);
		  //确保不会翻转
		  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
		  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, canvas.width, canvas.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, dataArray);
		  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
		  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
		  return texture;
		}
		//确保不会和前面的texture起冲突
		gl.activeTexture(gl.TEXTURE0 + maxTextureUnits);
		gl.bindTexture(gl.TEXTURE_2D, backtexture);
		var backtextureLoc = gl.my_getUniformLocation(activeProgram,"backtexture");
		gl.my_uniform1i(backtextureLoc, maxTextureUnits);
	  }
	  /*------------------readpixel部分--------------------------------------*/
	  

	  if (vetexID == 1){
		var mWorld = new Float32Array(16);
		var mWorld_fs = new Float32Array(16);
		var mView_fs = new Float32Array(16);
		var mView = new Float32Array(16);
		var mProj = new Float32Array(16);
		var vertPosition = [];
		var vertColor = [];
		var varyingmap = [];
		var __VertexPositionAttributeLocation1;
		//attribute 读取阶段
		for (var i = 0; i < ProgramDataMap[activeProgramNum].attriData.length; i++){
			if (ProgramDataMap[activeProgramNum].attriData[i].shaderName == "vertPosition")
				vertPosition = ProgramDataMap[activeProgramNum].attriData[i].uniformData;					
			if (ProgramDataMap[activeProgramNum].attriData[i].shaderName == "vertColor")
				vertColor = ProgramDataMap[activeProgramNum].attriData[i].uniformData;
		}
		//uniform 读取阶段
		for (var i = 0; i < ProgramDataMap[activeProgramNum].uniformData.length; i++){
			if (ProgramDataMap[activeProgramNum].uniformData[i].shaderName == "mWorld")
				mWorld = ProgramDataMap[activeProgramNum].uniformData[i].uniformData;					
			if (ProgramDataMap[activeProgramNum].uniformData[i].shaderName == "mView")
				mView = ProgramDataMap[activeProgramNum].uniformData[i].uniformData;
			if (ProgramDataMap[activeProgramNum].uniformData[i].shaderName == "mProj")
				mProj = ProgramDataMap[activeProgramNum].uniformData[i].uniformData;
		}

		//进入vetex计算部分
		mat4.copy(mWorld_fs, mWorld);
		mat4.copy(mView_fs, mView);
		mat4.transpose(mWorld, mWorld);
		mat4.transpose(mView, mView);
		mat4.transpose(mProj, mProj);
		mat4.mul(mView, mView, mProj);
		mat4.mul(mWorld, mWorld, mView);

		//进入计算阶段
		//手工去完成自动化的那部分
		
		var newData1 = new Varying_data;
		newData1.shaderName = "tri_point";
		newData1.varyEleNum = 3;
		newData1.uniformData = my_m4.vec_max_mul(vertPosition, mWorld);
		for (var i =0; i < newData1.uniformData.length; i++)
			if (i % 3 != 2)
				newData1.uniformData[i] = Math.round(newData1.uniformData[i] * 1000);
			else
				newData1.uniformData[i] = -1 * Math.round(newData1.uniformData[i] * 1000);
		ProgramDataMap[activeProgramNum].varyingData.push(newData1);

		var newData2 = new Varying_data;
		newData2.shaderName = "tri_color";
		newData2.varyEleNum = 3;
		for (var i = 0; i < vertColor.length; i++){
			newData2.uniformData = newData2.uniformData.concat(vertColor[i]);
			newData2.uniformData[i] = Math.round(((newData2.uniformData[i] )) * 1000);
		}	
		ProgramDataMap[activeProgramNum].varyingData.push(newData2);

		//console.log("ProgramDataMap",ProgramDataMap);

		var canvas_buffer = [-1.0, -1.0, 
			1.0, -1.0, 
			-1.0,  1.0, 
			-1.0,  1.0,
			1.0, -1.0, 
			1.0,  1.0]; 
		var new_vertex_buffer = gl.createBuffer();
		gl.my_bindBuffer(gl.ARRAY_BUFFER, new_vertex_buffer);
		gl.my_glbufferData(gl.ARRAY_BUFFER, new Float32Array(canvas_buffer), gl.STATIC_DRAW);
		__VertexPositionAttributeLocation1 = gl.my_getAttribLocation(activeProgram, 'vertPosition');
		gl.my_vertexAttribPointer(__VertexPositionAttributeLocation1, 2 ,gl.FLOAT, gl.FALSE, 2 * Float32Array.BYTES_PER_ELEMENT , 0);	
		gl.enableVertexAttribArray(__VertexPositionAttributeLocation1);	
		gl.my_useProgram(activeProgram);
		var traingles_vex_loc = gl.my_getUniformLocation(activeProgram, "tri_point");
		var traingles_fra_loc = gl.my_getUniformLocation(activeProgram, "tri_color");
		var traingles_num_loc = gl.my_getUniformLocation(activeProgram, "tri_number");
		gl.my_uniform1i(traingles_num_loc, ProgramDataMap[activeProgramNum].varyingData[0].uniformData.length/3);
		gl.my_uniform3iv(traingles_vex_loc, ProgramDataMap[activeProgramNum].varyingData[0].uniformData);
		gl.my_uniform3iv(traingles_fra_loc, ProgramDataMap[activeProgramNum].varyingData[1].uniformData);
		//console.log("开始画了");
		console.log("ProgramDataMap",ProgramDataMap);
		gl.my_drawArrays(gl.TRIANGLES, 0, 6);




	}//vetexID == 1
  
  
  
  
  
	  /*---------------------自动化连接部分---------------------------------*/
	  if ((vetexID == 3) ||(vetexID == 4) ||  (vetexID == 5)){
		var t0 = performance.now();
		var newData1 = new Varying_data;
		newData1.shaderName = "tri_point";
		newData1.varyEleNum = 3;
		newData1.uniformData = handle_gl_Position(gl_Position);
		ProgramDataMap[activeProgramNum].varyingData.push(newData1);
		var t1 = performance.now();
		console.log('handle gl Position', t1 - t0);
  
		var t0 = performance.now();
		var newData2 = new Varying_data;
		newData2.shaderName = "text_point";
		newData2.varyEleNum = 2;
		newData2.uniformData = fragTexCoord.map(x => x.map(y => Math.floor(y * 1000)))
		ProgramDataMap[activeProgramNum].varyingData.push(newData2);
		var t1 = performance.now();
		console.log('handle fragtex', t1 - t0);


		var newData3 = new Varying_data;
		newData3.shaderName = "nor_point";
		newData3.varyEleNum = 3;
		// fragNormal = math.flatten(fragNormal);
		// console.log(fragNormal);
		newData3.uniformData = fragNormal.map(x => x.map(y => Math.floor(y * 1000)))
      	ProgramDataMap[activeProgramNum].varyingData.push(newData3);
		
		
  
		if(vetexID == 5){
		  var newData4 = new Varying_data;
		  newData4.shaderName = "vPosition";
		  newData4.varyEleNum = 4;
		  newData4.uniformData = fragTexCoord.map(x => x.map(y => Math.floor(y * 1000)))
		  ProgramDataMap[activeProgramNum].varyingData.push(newData4);
		}
  
		//判断是否是正面
		
		var t0 = performance.now();
		var index_num = ProgramDataMap[activeProgramNum].varyingData[0].uniformData.length;
		var x0, y0, x1, y1, z1, x2, y2, z2, x3,  y3, z3;
		var tem_varying = []; //创建临时的varying二维数组去储存所有的数据
		for(j = 0; j < ProgramDataMap[activeProgramNum].varyingData.length; j++)
		  tem_varying.push([]);
		for (var i = 0; i < index_num; i += 3){
		  x1 = ProgramDataMap[activeProgramNum].varyingData[0].uniformData[i][0];
		  y1 = ProgramDataMap[activeProgramNum].varyingData[0].uniformData[i][1];
		  z1 = ProgramDataMap[activeProgramNum].varyingData[0].uniformData[i][2];
		  x2 = ProgramDataMap[activeProgramNum].varyingData[0].uniformData[i + 1][0];
		  y2 = ProgramDataMap[activeProgramNum].varyingData[0].uniformData[i + 1][1];
		  z2 = ProgramDataMap[activeProgramNum].varyingData[0].uniformData[i + 1][2];
		  x3 = ProgramDataMap[activeProgramNum].varyingData[0].uniformData[i + 2][0];
		  y3 = ProgramDataMap[activeProgramNum].varyingData[0].uniformData[i + 2][1];
		  z3 = ProgramDataMap[activeProgramNum].varyingData[0].uniformData[i + 2][2];
		  if (((x2 - x1)*(y3 - y1) - (x3 - x1)*(y2 - y1)) > 0.0){
			for(j = 0; j < ProgramDataMap[activeProgramNum].varyingData.length; j++){
			  for (k = 0; k < 3; k++)
				tem_varying[j].push(ProgramDataMap[activeProgramNum].varyingData[j].uniformData[i + k]);
			}
		  }
		}
		for (var idx in tem_varying)
		  tem_varying[idx] = math.flatten(tem_varying[idx]);
		var t1 = performance.now();
		console.log('remove points', t1 - t0);
  
  
		var t0 = performance.now();
		devide_draw(0, 255, tem_varying, gl);
		var t1 = performance.now();
		console.log('devide', t1 - t0);
	  }//Id = 4
  
	  //数据清楚
	  ProgramDataMap[activeProgramNum].attriData = [];
	  ProgramDataMap[activeProgramNum].uniformData = [];
	  ProgramDataMap[activeProgramNum].varyingData = [];
	  var enddraw = performance.now();
	  console.log('drawarray', enddraw - startdraw);
	}
  
	/*-------------------------draw array--------------------------------------*/
  
	var uniform_number  = 75;
  
	function devide_draw(left, right, tem_varying, gl){
  
	  var tem = [];
	  var left_varying = [];
	  var right_varying = [];
	  var tri_number = tem_varying[0].length / 9;
	  var mid = Math.floor((left + right) / 2);
	  var left_number = 0;
	  var right_number = 0;
	  var __Program;
	  var activeProgramNum;
	  var __VertexPositionAttributeLocation1;
	  __Program = getactiveProgram();
	  activeProgramNum = getactiveProgramNum();
	  var canvas_left;
	  var canvas_mid;
	  var canvas_right;
  
  
	  for (var i = 0; i < tem_varying.length; i++){
		left_varying.push([]);
		right_varying.push([]);
	  }
	  for (var i = 0; i < tri_number; i++){
		if (!((tem_varying[0][i * 9] >= mid) && (tem_varying[0][i * 9 + 3] >= mid) && (tem_varying[0][i * 9 + 6] >= mid))){
		  left_number ++;
		  //后加入同一化的代码
		  for (var j = 0; j < tem_varying.length; j++){
			for (var k = 0; k < 3 * ProgramDataMap[activeProgramNum].varyingData[j].varyEleNum; k++)
			  left_varying[j].push(tem_varying[j][i * 3 * ProgramDataMap[activeProgramNum].varyingData[j].varyEleNum + k]);
		  }
  
		}		
		if (!((tem_varying[0][i * 9] <= mid) && (tem_varying[0][i * 9 + 3] <= mid) && (tem_varying[0][i * 9 + 6] <= mid))){
		  right_number ++;
		  //后加入的代码
		  for (var j = 0; j < tem_varying.length; j++){
			for (var k = 0; k < 3 * ProgramDataMap[activeProgramNum].varyingData[j].varyEleNum; k++)
			  right_varying[j].push(tem_varying[j][i * 3 * ProgramDataMap[activeProgramNum].varyingData[j].varyEleNum + k]);
		  }			
		}
	  }
  
	  if (left_number <= uniform_number){
		if (left_number > 0){
  
		  var right_canvas_buffer = [
			left * 2 / 255 - 1.0,     -1.0, 
			mid * 2 / 255 - 1.0,      -1.0, 
			left * 2 / 255 - 1.0,      1.0, 
			left * 2 / 255 - 1.0,      1.0,
			mid * 2 / 255 - 1.0,      -1.0, 
			mid * 2 / 255 - 1.0,       1.0]; 
  
		  var new_vertex_buffer = gl.createBuffer();
		  gl.my_bindBuffer(gl.ARRAY_BUFFER, new_vertex_buffer);
		  gl.my_glbufferData(gl.ARRAY_BUFFER, new Float32Array(right_canvas_buffer), gl.STATIC_DRAW);
		  __VertexPositionAttributeLocation1 = gl.my_getAttribLocation(__Program, 'vertPosition');
  
		  gl.my_vertexAttribPointer(__VertexPositionAttributeLocation1, 2 ,gl.FLOAT, gl.FALSE, 2 * Float32Array.BYTES_PER_ELEMENT , 0);	
		  gl.enableVertexAttribArray(__VertexPositionAttributeLocation1);	
		  gl.my_useProgram(__Program);
		  var traingles_num_loc = gl.my_getUniformLocation(__Program, "tri_number");
		  gl.my_uniform1i(traingles_num_loc, left_number);
		  transUniform(__Program);
		  //要实现自动化的代码
		  var loc_array = [];
		  for(var i = 0; i < ProgramDataMap[activeProgramNum].varyingData.length; i++){
			loc_array[i] = gl.my_getUniformLocation(__Program, ProgramDataMap[activeProgramNum].varyingData[i].shaderName);
			if (ProgramDataMap[activeProgramNum].varyingData[i].varyEleNum == 2)
			  gl.my_uniform2iv(loc_array[i], left_varying[i]);
			else if (ProgramDataMap[activeProgramNum].varyingData[i].varyEleNum == 3){
			  gl.my_uniform3iv(loc_array[i], left_varying[i]);
			//   console.log("left_varying",i,left_varying[i]);
			}
			else if (ProgramDataMap[activeProgramNum].varyingData[i].varyEleNum == 4)
			  gl.my_uniform4iv(loc_array[i], left_varying[i]);
			else
			  console.log("暂时还没有写这种情况");
		  }
		  //console.log("left");
		  //console.log("left_varying",left_varying);
		  gl.my_drawArrays(gl.TRIANGLES, 0, 6);
		}
	  }
	  else{
		if (mid == right){
  
		  devide_draw_height(left, right, 0, 255, tem_varying , gl);
		  return;
		}	
		devide_draw(left, mid, left_varying, gl);
	  }
  
	  if (right_number <= uniform_number){
		if (right_number > 0){
		  var right_canvas_buffer = [
			mid * 2 / 255 - 1.0, -1.0, 
			right * 2 / 255 - 1.0, -1.0, 
			mid * 2 / 255 - 1.0,  1.0, 
			mid * 2 / 255 - 1.0,  1.0,
			right * 2 / 255 - 1.0, -1.0, 
			right * 2 / 255 - 1.0,  1.0]; 
		  var new_vertex_buffer = gl.createBuffer();
		  gl.my_bindBuffer(gl.ARRAY_BUFFER, new_vertex_buffer);
		  gl.my_glbufferData(gl.ARRAY_BUFFER, new Float32Array(right_canvas_buffer), gl.STATIC_DRAW);
		  __VertexPositionAttributeLocation1 = gl.my_getAttribLocation(__Program, 'vertPosition');
		  gl.my_vertexAttribPointer(__VertexPositionAttributeLocation1, 2 ,gl.FLOAT, gl.FALSE, 2 * Float32Array.BYTES_PER_ELEMENT , 0);	
		  gl.enableVertexAttribArray(__VertexPositionAttributeLocation1);		
		  gl.my_useProgram(__Program);
		  var traingles_num_loc = gl.my_getUniformLocation(__Program, "tri_number");
		  gl.my_uniform1i(traingles_num_loc, right_number);
		  transUniform(__Program);
		  //要实现自动化的代码
		  var loc_array = [];
		  for(var i = 0; i < ProgramDataMap[activeProgramNum].varyingData.length; i++){
			loc_array[i] = gl.my_getUniformLocation(__Program, ProgramDataMap[activeProgramNum].varyingData[i].shaderName);
			if (ProgramDataMap[activeProgramNum].varyingData[i].varyEleNum == 2)
			  gl.my_uniform2iv(loc_array[i], right_varying[i]);
			else if (ProgramDataMap[activeProgramNum].varyingData[i].varyEleNum == 3){
			  gl.my_uniform3iv(loc_array[i], right_varying[i]);
			//   console.log("right_varying",i,  right_varying[i]);
			}
  
			else if (ProgramDataMap[activeProgramNum].varyingData[i].varyEleNum == 4)
			  gl.my_uniform4iv(loc_array[i], right_varying[i]);
			else 
			  console.log("暂时还没有写这种情况");
		  }
  
		  gl.my_drawArrays(gl.TRIANGLES, 0, 6);
		}
	  }
	  else{
		if (mid == left){
  
		  devide_draw_height(left, right, 0, 255, tem_varying, gl);
  
		  return;
		}	
		devide_draw(mid, right, right_varying, gl);
	  }
	  return;
	}
  
  
  
  
	function devide_draw_height(left, right, bot, top, tem_varying, gl){
	  var canvas_left;
	  var canvas_mid;
	  var canvas_right;
	  var canvas_bot;
	  var canvas_top;
	  var tem = [];
	  var bot_varying = [];
	  var top_varying = [];
	  var tri_number = tem_varying[0].length / 9;
	  var mid = Math.floor((bot + top) / 2);
	  var bot_number = 0;
	  var top_number = 0;
	  var __Program;
	  var activeProgramNum;
	  var __VertexPositionAttributeLocation1;
	  __Program = getactiveProgram();
	  activeProgramNum = getactiveProgramNum();
  
  
	  //console.log("中间点", mid);
	  for (var i = 0; i < tem_varying.length; i++){
		bot_varying.push(tem);
		top_varying.push(tem);
	  }
	  for (var i = 0; i < tri_number; i++){
		if (!((tem_varying[0][i * 9 + 1] >= mid) && (tem_varying[0][i * 9 + 4] >= mid) && (tem_varying[0][i * 9 + 7] >= mid))){
		  bot_number ++;
		  //后加入同一化的代码
		  for (var j = 0; j < tem_varying.length; j++){
			for (var k = 0; k < 3 * ProgramDataMap[activeProgramNum].varyingData[j].varyEleNum; k++)
			  bot_varying[j] = bot_varying[j].concat(tem_varying[j][i * 3 * ProgramDataMap[activeProgramNum].varyingData[j].varyEleNum + k]);
		  }	
		}		
		if (!((tem_varying[0][i * 9 + 1] <= mid) && (tem_varying[0][i * 9 + 4] <= mid) && (tem_varying[0][i * 9 + 7] <= mid))){
  
		  top_number ++;
		  //后加入同一化的代码
		  for (var j = 0; j < tem_varying.length; j++){
			for (var k = 0; k < 3 * ProgramDataMap[activeProgramNum].varyingData[j].varyEleNum; k++)
			  top_varying[j] = top_varying[j].concat(tem_varying[j][i * 3 * ProgramDataMap[activeProgramNum].varyingData[j].varyEleNum + k]);
		  }
		}
	  }
	  if (bot_number <= uniform_number){
  
		if (bot_number > 0){
		  var right_canvas_buffer = [
			left * 2 / 255 - 1.0,   bot * 2 / 255 -1.0, 
			right * 2 / 255 - 1.0,    bot * 2 / 255 -1.0, 
			left * 2 / 255 - 1.0,    mid * 2 / 255 -1.0, 
			left * 2 / 255 - 1.0,    mid * 2 / 255 -1.0,
			right * 2 / 255 - 1.0,    bot * 2 / 255 -1.0, 
			right * 2 / 255 - 1.0,    mid * 2 / 255 -1.0]; 
  
		  var new_vertex_buffer = gl.createBuffer();
		  gl.my_bindBuffer(gl.ARRAY_BUFFER, new_vertex_buffer);
		  gl.my_glbufferData(gl.ARRAY_BUFFER, new Float32Array(right_canvas_buffer), gl.STATIC_DRAW);
		  __VertexPositionAttributeLocation1 = gl.my_getAttribLocation(__Program, 'vertPosition');
		  gl.my_vertexAttribPointer(__VertexPositionAttributeLocation1, 2 ,gl.FLOAT, gl.FALSE, 2 * Float32Array.BYTES_PER_ELEMENT , 0);	
		  gl.enableVertexAttribArray(__VertexPositionAttributeLocation1);		
		  gl.my_useProgram(__Program);
		  var traingles_num_loc = gl.my_getUniformLocation(__Program, "tri_number");
		  gl.my_uniform1i(traingles_num_loc, bot_number);
		  transUniform(__Program);
		  //要实现自动化的代码
		  var loc_array = [];
		  for(var i = 0; i < ProgramDataMap[activeProgramNum].varyingData.length; i++){
			loc_array[i] = gl.my_getUniformLocation(__Program, ProgramDataMap[activeProgramNum].varyingData[i].shaderName);
			if (ProgramDataMap[activeProgramNum].varyingData[i].varyEleNum == 2)
			  gl.my_uniform2iv(loc_array[i], bot_varying[i]);
			else if (ProgramDataMap[activeProgramNum].varyingData[i].varyEleNum == 3){
			  gl.my_uniform3iv(loc_array[i], bot_varying[i]);
			//   console.log("bot_varying",i,bot_varying[i]);
			}
  
			else if (ProgramDataMap[activeProgramNum].varyingData[i].varyEleNum == 4)
			  gl.my_uniform4iv(loc_array[i], bot_varying[i]);
			else 
			  console.log("暂时还没有写这种情况");
		  }
  
		  gl.my_drawArrays(gl.TRIANGLES, 0, 6);
		}
	  }
	  else{
		if (mid == top){
  
		  return;
		}	
		devide_draw_height(left, right, bot, mid, bot_varying, gl);
	  }	
  
	  if (top_number <= uniform_number){
  
		if (top_number > 0){
		  var right_canvas_buffer = [
			left * 2 / 255 - 1.0, mid * 2 / 255 -1.0, 
			right * 2 / 255 - 1.0,  mid * 2 / 255 -1.0, 
			left * 2 / 255 - 1.0,  top * 2 / 255 -1.0, 
			left * 2 / 255 - 1.0,  top * 2 / 255 -1.0,
			right * 2 / 255 - 1.0,  mid * 2 / 255 -1.0, 
			right * 2 / 255 - 1.0,  top * 2 / 255 -1.0]; 
  
  
		  var new_vertex_buffer = gl.createBuffer();
		  gl.my_bindBuffer(gl.ARRAY_BUFFER, new_vertex_buffer);
		  gl.my_glbufferData(gl.ARRAY_BUFFER, new Float32Array(right_canvas_buffer), gl.STATIC_DRAW);
		  __VertexPositionAttributeLocation1 = gl.my_getAttribLocation(__Program, 'vertPosition');
		  gl.my_vertexAttribPointer(__VertexPositionAttributeLocation1, 2 ,gl.FLOAT, gl.FALSE, 2 * Float32Array.BYTES_PER_ELEMENT , 0);	
		  gl.enableVertexAttribArray(__VertexPositionAttributeLocation1);		
		  gl.my_useProgram(__Program);
		  var traingles_num_loc = gl.my_getUniformLocation(__Program, "tri_number");
		  gl.my_uniform1i(traingles_num_loc, top_number);
		  transUniform(__Program);
		  //要实现自动化的代码
		  var loc_array = [];
		  for(var i = 0; i < ProgramDataMap[activeProgramNum].varyingData.length; i++){
			loc_array[i] = gl.my_getUniformLocation(__Program, ProgramDataMap[activeProgramNum].varyingData[i].shaderName);
			if (ProgramDataMap[activeProgramNum].varyingData[i].varyEleNum == 2)
			  gl.my_uniform2iv(loc_array[i], top_varying[i]);
			else if (ProgramDataMap[activeProgramNum].varyingData[i].varyEleNum == 3){
			  gl.my_uniform3iv(loc_array[i], top_varying[i]);
			//   console.log("top_varying",i,top_varying[i]);
			}
  
			else if (ProgramDataMap[activeProgramNum].varyingData[i].varyEleNum == 4)
			  gl.my_uniform4iv(loc_array[i], top_varying[i]);
			else 
			  console.log("暂时还没有写这种情况");
		  }
		  gl.my_drawArrays(gl.TRIANGLES, 0, 6);
		}
	  }
	  else{
		if (mid == left){
		  //console.log("left", left, "right", right, "bot", bot, "top", top, "number", top_number);
		  return;
		}	
		devide_draw_height(left, right, mid, top, top_varying, gl);
	  }
	  return;
	}
  
	transUniform = function(__Program){
	  for (var i = 0; i < ProgramDataMap.length; i++){
		if (ProgramDataMap[i].activeFlag == 1){
		  for (var j = 0; j < ProgramDataMap[i].uniformData.length; j++){
			var loc = gl.my_getUniformLocation(__Program, ProgramDataMap[i].uniformData[j].shaderName);
			if (loc != null){	
			  var multiple = 1000;
			  gl.my_uniform3i(loc, ProgramDataMap[i].uniformData[j].uniformData[0] * multiple, ProgramDataMap[i].uniformData[j].uniformData[1] * multiple, ProgramDataMap[i].uniformData[j].uniformData[2] * multiple);
			}
		  }
		}
	  }
	}
  
  
  
  
	/*--------------------------------------------------------------------------*/
  
  
  
  
	/*=========================关于draw部分的代码====================结尾==================*/
  
  
  
  
  
  
  
  
  
  
  
	BBB = function(primitiveType, offset, count){
	  if (primitiveType == gl.LINE_STRIP){
		var line_buffer = [];
		for (var i =0; i < __ActiveBuffer_vertex.length; i++)
		  if (i % 3 != 2)
			__ActiveBuffer_vertex[i] = Math.round(((__ActiveBuffer_vertex[i] + 1)) * 256 /2);
		  else
			__ActiveBuffer_vertex[i] = -1 * __ActiveBuffer_vertex[i];
		for (var i = 0; i < count - 1; i++){
		  line_buffer = line_buffer.concat(__ActiveBuffer_vertex[3 * i]);
		  line_buffer = line_buffer.concat(__ActiveBuffer_vertex[3 * i + 1]);
		  line_buffer = line_buffer.concat(__ActiveBuffer_vertex[3 * i + 2]);
		  line_buffer = line_buffer.concat(__ActiveBuffer_vertex[3 * i + 3]);
		  line_buffer = line_buffer.concat(__ActiveBuffer_vertex[3 * i + 4]);
		  line_buffer = line_buffer.concat(__ActiveBuffer_vertex[3 * i + 5]);
		}
		for (var i = 3 * count; i < __ActiveBuffer_vertex.length; i++)
		  line_buffer = line_buffer.concat(__ActiveBuffer_vertex[i]);
		//console.log(line_buffer);
		var canvas_buffer = [-1.0, -1.0, 
		1.0, -1.0, 
		-1.0,  1.0, 
		-1.0,  1.0,
		1.0, -1.0, 
		1.0,  1.0]; 
		var new_vertex_buffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, new_vertex_buffer);
		gl.my_glbufferData(gl.ARRAY_BUFFER, new Float32Array(canvas_buffer), gl.STATIC_DRAW);
		gl.my_vertexAttribPointer(__VertexPositionAttributeLocation1, 2 ,__VertexType, __VertexNomalize, 2 * Float32Array.BYTES_PER_ELEMENT , 0);		
		gl.my_useProgram(__Program);
		var traingles_vex_loc = gl.getUniformLocation(__Program, "line_point");
		gl.uniform3fv(traingles_vex_loc, line_buffer);
		gl.drawArrays(gl.TRIANGLES, 0, 6);
		return;
	  }
  
	  if (__texture_flag == 0){
		//console.log("FUCK!!!!!!!!!!");
		//在这里进行点数据的转换
		//console.log("原始点的数据", __ActiveBuffer_vertex);
		//console.log("传入的转换矩阵", __Mworld);
		__ActiveBuffer_vertex = my_m4.vec_max_mul(__ActiveBuffer_vertex, __Mworld);
		//console.log("处理后点的数据", __ActiveBuffer_vertex);
		// 这一段就是测试用的
  
		// 这是float版本的
		/*
		   for (var i =0; i < __ActiveBuffer_vertex.length; i++)
		   if (i % 3 != 2)
		   __ActiveBuffer_vertex[i] = Math.round(((__ActiveBuffer_vertex[i] + 1)) * 256 /2);
		   else
		   __ActiveBuffer_vertex[i] = -1 * __ActiveBuffer_vertex[i];
		   */
  
		// 这是int版本的
		for (var i =0; i < __ActiveBuffer_vertex.length; i++)
		  if (i % 3 != 2)
			__ActiveBuffer_vertex[i] = Math.round(((__ActiveBuffer_vertex[i] + 1)) * 256 /2);
		  else
			__ActiveBuffer_vertex[i] = -1 * Math.round(((__ActiveBuffer_vertex[i] + 1)) * 256 /2);
  
  
		//console.log("转化成pixel的位置",__ActiveBuffer_vertex);	
		//console.log("颜色的计算",__ActiveBuffer_frag);	 
  
  
		var canvas_buffer = [-1.0, -1.0, 
		1.0, -1.0, 
		-1.0,  1.0, 
		-1.0,  1.0,
		1.0, -1.0, 
		1.0,  1.0]; 
		var new_vertex_buffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, new_vertex_buffer);
		gl.my_glbufferData(gl.ARRAY_BUFFER, new Float32Array(canvas_buffer), gl.STATIC_DRAW);
		gl.my_vertexAttribPointer(__VertexPositionAttributeLocation1, 2 ,__VertexType, __VertexNomalize, 2 * Float32Array.BYTES_PER_ELEMENT , 0);		
		gl.my_useProgram(__Program);
		var traingles_vex_loc = gl.getUniformLocation(__Program, "tri_point");
		var traingles_fra_loc = gl.getUniformLocation(__Program, "tri_color");
		gl.uniform3fv(traingles_vex_loc, __ActiveBuffer_vertex);
		gl.uniform3fv(traingles_fra_loc, __ActiveBuffer_frag);
		gl.drawArrays(gl.TRIANGLES, 0, 6);
		return;
	  }
  
	  //console.log("在这里调用了draw");
	  //在这里进行点数据的转换
	  //console.log("原始点的数据", __ActiveBuffer_vertex);
	  //console.log("传入的转换矩阵", __Mworld);
	  __ActiveBuffer_vertex_result = my_m4.vec_max_mul(__ActiveBuffer_vertex, __Mworld);
	  //console.log("处理后点的数据", __ActiveBuffer_vertex);
	  // 这一段就是测试用的
  
	  //console.log("__Drawnumber",__Drawnumber);	
  
	  // 这个是float版本
	  /*
		 for (var i =0; i < __ActiveBuffer_vertex_result.length; i++)
		 if (i % 3 != 2)
		 __ActiveBuffer_vertex_result[i] = Math.round(((__ActiveBuffer_vertex_result[i] + 1)) * 256 /2);
		 else
		 __ActiveBuffer_vertex_result[i] = -1 * __ActiveBuffer_vertex_result[i];
		 */
  
	  //这个是int版本
	  for (var i =0; i < __ActiveBuffer_vertex_result.length; i++)
		if (i % 3 != 2)
		  __ActiveBuffer_vertex_result[i] = Math.round(((__ActiveBuffer_vertex_result[i] + 1)) * 256 /2);
		else
		  __ActiveBuffer_vertex_result[i] = -1 * Math.round(((__ActiveBuffer_vertex_result[i] + 1)) * 256 /2);
  
  
	  for (var i =0; i < __ActiveBuffer_vertex_texture.length; i++)
		__ActiveBuffer_vertex_texture[i] = Math.round(((__ActiveBuffer_vertex_texture[i] )) * 255);
  
	  var t_nor = [];	
	  if (__My_buffer_flag == 4){
		//console.log("mWorld_fs",mWorld_fs);
		for (var i =0; i < __ActiveBuffer_vertex_normal.length; i += 3){
		  t_nor = t_nor.concat((__ActiveBuffer_vertex_normal[i] * mWorld_fs[0] + __ActiveBuffer_vertex_normal[i+1] * mWorld_fs[4] + __ActiveBuffer_vertex_normal[i+2] * mWorld_fs[8]));
		  t_nor = t_nor.concat((__ActiveBuffer_vertex_normal[i] * mWorld_fs[1] + __ActiveBuffer_vertex_normal[i+1] * mWorld_fs[5] + __ActiveBuffer_vertex_normal[i+2] * mWorld_fs[9]) );
		  t_nor = t_nor.concat((__ActiveBuffer_vertex_normal[i] * mWorld_fs[2] + __ActiveBuffer_vertex_normal[i+1] * mWorld_fs[6] + __ActiveBuffer_vertex_normal[i+2] * mWorld_fs[10])) ;
		}
		for (var i =0; i < __ActiveBuffer_vertex_normal.length; i++)
		  __ActiveBuffer_vertex_normal[i] = Math.round(((t_nor[i] )) * 100);
		//__ActiveBuffer_vertex_normal = t_nor;
  
	  }
  
  
  
	  //console.log("转化成pixel的位置",__ActiveBuffer_vertex);	
	  //console.log("颜色的计算",__ActiveBuffer_frag);	 
  
	  //console.log("转化成pixel的位置",__ActiveBuffer_vertex_result);	
  
	  var canvas_buffer = [
		0.0, -1.0, 
		1.0, -1.0, 
		0.0,  1.0, 
		0.0,  1.0,
		1.0, -1.0, 
		1.0,  1.0]; 
  
	  var canvas_buffer1 = [
		-1.0, -1.0, 
		0.0, -1.0, 
		-1.0,  1.0, 
		-1.0,  1.0,
		0.0, -1.0, 
		0.0,  1.0]; 
  
	  /*	
		  var canvas_buffer = [
		  -1.0, -1.0, 
		  1.0, -1.0, 
		  -1.0,  1.0, 
		  -1.0,  1.0,
		  1.0, -1.0, 
		  1.0,  1.0]; 
		  var canvas_buffer1 = [
		  -1.0, -1.0, 
		  1.0, -1.0, 
		  -1.0,  1.0, 
		  -1.0,  1.0,
		  1.0, -1.0, 
		  1.0,  1.0]; 
		  */
	  //在这里判断是否是猴子的正面
	  var tri_result= [];
	  var tri_texture = [];
	  var tri_normal = [];
	  var x0, y0, x1, y1, z1, x2, y2, z2, x3,  y3, z3;
	  //console.log("__My_index.length",__My_index.length);
	  for (var i = 0; i < __My_index.length; i+= 3){
		x1 = __ActiveBuffer_vertex_result[i * 3];
		y1 = __ActiveBuffer_vertex_result[i * 3 + 1];
		z1 = __ActiveBuffer_vertex_result[i * 3 + 2];
		x2 = __ActiveBuffer_vertex_result[i * 3 + 3];
		y2 = __ActiveBuffer_vertex_result[i * 3 + 4];
		z2 = __ActiveBuffer_vertex_result[i * 3 + 5];
		x3 = __ActiveBuffer_vertex_result[i * 3 + 6];
		y3 = __ActiveBuffer_vertex_result[i * 3 + 7];
		z3 = __ActiveBuffer_vertex_result[i * 3 + 8];
		if (((x2 - x1)*(y3 - y1) - (x3 - x1)*(y2 - y1)) > 0.0){
		  tri_result = tri_result.concat(__ActiveBuffer_vertex_result[i * 3]);
		  tri_result = tri_result.concat(__ActiveBuffer_vertex_result[i * 3 + 1]);
		  tri_result = tri_result.concat(__ActiveBuffer_vertex_result[i * 3 + 2]);
		  tri_result = tri_result.concat(__ActiveBuffer_vertex_result[i * 3 + 3]);
		  tri_result = tri_result.concat(__ActiveBuffer_vertex_result[i * 3 + 4]);
		  tri_result = tri_result.concat(__ActiveBuffer_vertex_result[i * 3 + 5]);
		  tri_result = tri_result.concat(__ActiveBuffer_vertex_result[i * 3 + 6]);
		  tri_result = tri_result.concat(__ActiveBuffer_vertex_result[i * 3 + 7]);
		  tri_result = tri_result.concat(__ActiveBuffer_vertex_result[i * 3 + 8]);
  
		  tri_texture = tri_texture.concat(__ActiveBuffer_vertex_texture[i * 2]);
		  tri_texture = tri_texture.concat(__ActiveBuffer_vertex_texture[i * 2 + 1]);
		  tri_texture = tri_texture.concat(__ActiveBuffer_vertex_texture[i * 2 + 2]);
		  tri_texture = tri_texture.concat(__ActiveBuffer_vertex_texture[i * 2 + 3]);
		  tri_texture = tri_texture.concat(__ActiveBuffer_vertex_texture[i * 2 + 4]);
		  tri_texture = tri_texture.concat(__ActiveBuffer_vertex_texture[i * 2 + 5]);
  
		  if (__My_buffer_flag == 4){
			tri_normal = tri_normal.concat(__ActiveBuffer_vertex_normal[i * 3]);
			tri_normal = tri_normal.concat(__ActiveBuffer_vertex_normal[i * 3 + 1]);
			tri_normal = tri_normal.concat(__ActiveBuffer_vertex_normal[i * 3 + 2]);
			tri_normal = tri_normal.concat(__ActiveBuffer_vertex_normal[i * 3 + 3]);
			tri_normal = tri_normal.concat(__ActiveBuffer_vertex_normal[i * 3 + 4]);
			tri_normal = tri_normal.concat(__ActiveBuffer_vertex_normal[i * 3 + 5]);
			tri_normal = tri_normal.concat(__ActiveBuffer_vertex_normal[i * 3 + 6]);
			tri_normal = tri_normal.concat(__ActiveBuffer_vertex_normal[i * 3 + 7]);
			tri_normal = tri_normal.concat(__ActiveBuffer_vertex_normal[i * 3 + 8]);
		  }
  
		}
	  }
	  // console.log("__ActiveBuffer_vertex_result",__ActiveBuffer_vertex_result);
	  // console.log("__ActiveBuffer_vertex_texture",__ActiveBuffer_vertex_texture);
	  // console.log("__ActiveBuffer_vertex_normal",__ActiveBuffer_vertex_normal);
  
	  // console.log("tri_result",tri_result);
	  // console.log("tri_texture",tri_texture);
	  // console.log("tri_normal",tri_normal);
  
  
  
  
	  devide_draw(0, 255, tri_result, tri_texture, tri_normal, gl);
  
  
  
  
  
  
  
  
  
  
  
	  /*===================================================================================================*/
  
  
  
  
  
  
  
  
  
  
	}
	return gl;
  }
  
  
  
  
  
  
  
  Mat4 = (function() {
	function Mat4(data1) {
	  this.data = data1;
	  if (this.data == null) {
		this.data = new Float32Array(16);
	  }
	  this.ident();
	}
  
	Mat4.prototype.ident = function() {
	  var d;
	  d = this.data;
	  d[0] = 1;
	  d[1] = 0;
	  d[2] = 0;
	  d[3] = 0;
	  d[4] = 0;
	  d[5] = 1;
	  d[6] = 0;
	  d[7] = 0;
	  d[8] = 0;
	  d[9] = 0;
	  d[10] = 1;
	  d[11] = 0;
	  d[12] = 0;
	  d[13] = 0;
	  d[14] = 0;
	  d[15] = 1;
	  return this;
	};
  
	Mat4.prototype.zero = function() {
	  var d;
	  d = this.data;
	  d[0] = 0;
	  d[1] = 0;
	  d[2] = 0;
	  d[3] = 0;
	  d[4] = 0;
	  d[5] = 0;
	  d[6] = 0;
	  d[7] = 0;
	  d[8] = 0;
	  d[9] = 0;
	  d[10] = 0;
	  d[11] = 0;
	  d[12] = 0;
	  d[13] = 0;
	  d[14] = 0;
	  d[15] = 0;
	  return this;
	};
  
	Mat4.prototype.copy = function(dest) {
	  var dst, src;
	  src = this.data;
	  dst = dest.data;
	  dst[0] = src[0];
	  dst[1] = src[1];
	  dst[2] = src[2];
	  dst[3] = src[3];
	  dst[4] = src[4];
	  dst[5] = src[5];
	  dst[6] = src[6];
	  dst[7] = src[7];
	  dst[8] = src[8];
	  dst[9] = src[9];
	  dst[10] = src[10];
	  dst[11] = src[11];
	  dst[12] = src[12];
	  dst[13] = src[13];
	  dst[14] = src[14];
	  dst[15] = src[15];
	  return dest;
	};
  
	Mat4.prototype.toMat3 = function(dest) {
	  var dst, src;
	  src = this.data;
	  dst = dest.data;
	  dst[0] = src[0];
	  dst[1] = src[1];
	  dst[2] = src[2];
	  dst[3] = src[4];
	  dst[4] = src[5];
	  dst[5] = src[6];
	  dst[6] = src[8];
	  dst[7] = src[9];
	  dst[8] = src[10];
	  return dest;
	};
  
	Mat4.prototype.toMat3Rot = function(dest) {
	  var a00, a01, a02, a10, a11, a12, a20, a21, a22, b01, b11, b21, d, dst, id, src;
	  dst = dest.data;
	  src = this.data;
	  a00 = src[0];
	  a01 = src[1];
	  a02 = src[2];
	  a10 = src[4];
	  a11 = src[5];
	  a12 = src[6];
	  a20 = src[8];
	  a21 = src[9];
	  a22 = src[10];
	  b01 = a22 * a11 - a12 * a21;
	  b11 = -a22 * a10 + a12 * a20;
	  b21 = a21 * a10 - a11 * a20;
	  d = a00 * b01 + a01 * b11 + a02 * b21;
	  id = 1 / d;
	  dst[0] = b01 * id;
	  dst[3] = (-a22 * a01 + a02 * a21) * id;
	  dst[6] = (a12 * a01 - a02 * a11) * id;
	  dst[1] = b11 * id;
	  dst[4] = (a22 * a00 - a02 * a20) * id;
	  dst[7] = (-a12 * a00 + a02 * a10) * id;
	  dst[2] = b21 * id;
	  dst[5] = (-a21 * a00 + a01 * a20) * id;
	  dst[8] = (a11 * a00 - a01 * a10) * id;
	  return dest;
	};
  
	Mat4.prototype.perspective = function(arg) {
	  var aspect, bottom, d, far, fov, left, near, right, top;
	  fov = arg.fov, aspect = arg.aspect, near = arg.near, far = arg.far;
	  if (fov == null) {
		fov = 60;
	  }
	  if (aspect == null) {
		aspect = 1;
	  }
	  if (near == null) {
		near = 0.01;
	  }
	  if (far == null) {
		far = 100;
	  }
	  this.zero();
	  d = this.data;
	  top = near * Math.tan(fov * Math.PI / 360);
	  right = top * aspect;
	  left = -right;
	  bottom = -top;
	  d[0] = (2 * near) / (right - left);
	  d[5] = (2 * near) / (top - bottom);
	  d[8] = (right + left) / (right - left);
	  d[9] = (top + bottom) / (top - bottom);
	  d[10] = -(far + near) / (far - near);
	  d[11] = -1;
	  d[14] = -(2 * far * near) / (far - near);
	  return this;
	};
  
	Mat4.prototype.inversePerspective = function(fov, aspect, near, far) {
	  var bottom, dst, left, right, top;
	  this.zero();
	  dst = this.data;
	  top = near * Math.tan(fov * Math.PI / 360);
	  right = top * aspect;
	  left = -right;
	  bottom = -top;
	  dst[0] = (right - left) / (2 * near);
	  dst[5] = (top - bottom) / (2 * near);
	  dst[11] = -(far - near) / (2 * far * near);
	  dst[12] = (right + left) / (2 * near);
	  dst[13] = (top + bottom) / (2 * near);
	  dst[14] = -1;
	  dst[15] = (far + near) / (2 * far * near);
	  return this;
	};
  
	Mat4.prototype.ortho = function(near, far, top, bottom, left, right) {
	  var fn, rl, tb;
	  if (near == null) {
		near = -1;
	  }
	  if (far == null) {
		far = 1;
	  }
	  if (top == null) {
		top = -1;
	  }
	  if (bottom == null) {
		bottom = 1;
	  }
	  if (left == null) {
		left = -1;
	  }
	  if (right == null) {
		right = 1;
	  }
	  rl = right - left;
	  tb = top - bottom;
	  fn = far - near;
	  return this.set(2 / rl, 0, 0, -(left + right) / rl, 0, 2 / tb, 0, -(top + bottom) / tb, 0, 0, -2 / fn, -(far + near) / fn, 0, 0, 0, 1);
	};
  
	Mat4.prototype.inverseOrtho = function(near, far, top, bottom, left, right) {
	  var a, b, c, d, e, f, g;
	  if (near == null) {
		near = -1;
	  }
	  if (far == null) {
		far = 1;
	  }
	  if (top == null) {
		top = -1;
	  }
	  if (bottom == null) {
		bottom = 1;
	  }
	  if (left == null) {
		left = -1;
	  }
	  if (right == null) {
		right = 1;
	  }
	  a = (right - left) / 2;
	  b = (right + left) / 2;
	  c = (top - bottom) / 2;
	  d = (top + bottom) / 2;
	  e = (far - near) / -2;
	  f = (near + far) / 2;
	  g = 1;
	  return this.set(a, 0, 0, b, 0, c, 0, d, 0, 0, e, f, 0, 0, 0, g);
	};
  
	Mat4.prototype.fromRotationTranslation = function(quat, vec) {
	  var dest, w, wx, wy, wz, x, x2, xx, xy, xz, y, y2, yy, yz, z, z2, zz;
	  x = quat.x;
	  y = quat.y;
	  z = quat.z;
	  w = quat.w;
	  x2 = x + x;
	  y2 = y + y;
	  z2 = z + z;
	  xx = x * x2;
	  xy = x * y2;
	  xz = x * z2;
	  yy = y * y2;
	  yz = y * z2;
	  zz = z * z2;
	  wx = w * x2;
	  wy = w * y2;
	  wz = w * z2;
	  dest = this.data;
	  dest[0] = 1 - (yy + zz);
	  dest[1] = xy + wz;
	  dest[2] = xz - wy;
	  dest[3] = 0;
	  dest[4] = xy - wz;
	  dest[5] = 1 - (xx + zz);
	  dest[6] = yz + wx;
	  dest[7] = 0;
	  dest[8] = xz + wy;
	  dest[9] = yz - wx;
	  dest[10] = 1 - (xx + yy);
	  dest[11] = 0;
	  dest[12] = vec.x;
	  dest[13] = vec.y;
	  dest[14] = vec.z;
	  dest[15] = 1;
	  return this;
	};
  
	Mat4.prototype.trans = function(x, y, z) {
	  var a00, a01, a02, a03, a10, a11, a12, a13, a20, a21, a22, a23, d;
	  d = this.data;
	  a00 = d[0];
	  a01 = d[1];
	  a02 = d[2];
	  a03 = d[3];
	  a10 = d[4];
	  a11 = d[5];
	  a12 = d[6];
	  a13 = d[7];
	  a20 = d[8];
	  a21 = d[9];
	  a22 = d[10];
	  a23 = d[11];
	  d[12] = a00 * x + a10 * y + a20 * z + d[12];
	  d[13] = a01 * x + a11 * y + a21 * z + d[13];
	  d[14] = a02 * x + a12 * y + a22 * z + d[14];
	  d[15] = a03 * x + a13 * y + a23 * z + d[15];
	  return this;
	};
  
	Mat4.prototype.rotatex = function(angle) {
	  var a10, a11, a12, a13, a20, a21, a22, a23, c, d, rad, s;
	  d = this.data;
	  rad = tau * (angle / 360);
	  s = Math.sin(rad);
	  c = Math.cos(rad);
	  a10 = d[4];
	  a11 = d[5];
	  a12 = d[6];
	  a13 = d[7];
	  a20 = d[8];
	  a21 = d[9];
	  a22 = d[10];
	  a23 = d[11];
	  d[4] = a10 * c + a20 * s;
	  d[5] = a11 * c + a21 * s;
	  d[6] = a12 * c + a22 * s;
	  d[7] = a13 * c + a23 * s;
	  d[8] = a10 * -s + a20 * c;
	  d[9] = a11 * -s + a21 * c;
	  d[10] = a12 * -s + a22 * c;
	  d[11] = a13 * -s + a23 * c;
	  return this;
	};
  
	Mat4.prototype.rotatey = function(angle) {
	  var a00, a01, a02, a03, a20, a21, a22, a23, c, d, rad, s;
	  d = this.data;
	  rad = tau * (angle / 360);
	  s = Math.sin(rad);
	  c = Math.cos(rad);
	  a00 = d[0];
	  a01 = d[1];
	  a02 = d[2];
	  a03 = d[3];
	  a20 = d[8];
	  a21 = d[9];
	  a22 = d[10];
	  a23 = d[11];
	  d[0] = a00 * c + a20 * -s;
	  d[1] = a01 * c + a21 * -s;
	  d[2] = a02 * c + a22 * -s;
	  d[3] = a03 * c + a23 * -s;
	  d[8] = a00 * s + a20 * c;
	  d[9] = a01 * s + a21 * c;
	  d[10] = a02 * s + a22 * c;
	  d[11] = a03 * s + a23 * c;
	  return this;
	};
  
	Mat4.prototype.rotatez = function(angle) {
	  var a00, a01, a02, a03, a10, a11, a12, a13, c, d, rad, s;
	  d = this.data;
	  rad = tau * (angle / 360);
	  s = Math.sin(rad);
	  c = Math.cos(rad);
	  a00 = d[0];
	  a01 = d[1];
	  a02 = d[2];
	  a03 = d[3];
	  a10 = d[4];
	  a11 = d[5];
	  a12 = d[6];
	  a13 = d[7];
	  d[0] = a00 * c + a10 * s;
	  d[1] = a01 * c + a11 * s;
	  d[2] = a02 * c + a12 * s;
	  d[3] = a03 * c + a13 * s;
	  d[4] = a00 * -s + a10 * c;
	  d[5] = a01 * -s + a11 * c;
	  d[6] = a02 * -s + a12 * c;
	  d[7] = a03 * -s + a13 * c;
	  return this;
	};
  
	Mat4.prototype.scale = function(scalar) {
	  var a00, a01, a02, a03, a10, a11, a12, a13, a20, a21, a22, a23, d;
	  d = this.data;
	  a00 = d[0];
	  a01 = d[1];
	  a02 = d[2];
	  a03 = d[3];
	  a10 = d[4];
	  a11 = d[5];
	  a12 = d[6];
	  a13 = d[7];
	  a20 = d[8];
	  a21 = d[9];
	  a22 = d[10];
	  a23 = d[11];
	  d[0] = a00 * scalar;
	  d[1] = a01 * scalar;
	  d[2] = a02 * scalar;
	  d[3] = a03 * scalar;
	  d[4] = a10 * scalar;
	  d[5] = a11 * scalar;
	  d[6] = a12 * scalar;
	  d[7] = a13 * scalar;
	  d[8] = a20 * scalar;
	  d[9] = a21 * scalar;
	  d[10] = a22 * scalar;
	  d[11] = a23 * scalar;
	  return this;
	};
  
	Mat4.prototype.mulMat4 = function(other, dst) {
	  var a00, a01, a02, a03, a10, a11, a12, a13, a20, a21, a22, a23, a30, a31, a32, a33, b0, b1, b2, b3, dest, mat, mat2;
	  if (dst == null) {
		dst = this;
	  }
	  dest = dst.data;
	  mat = this.data;
	  mat2 = other.data;
	  a00 = mat[0];
	  a01 = mat[1];
	  a02 = mat[2];
	  a03 = mat[3];
	  a10 = mat[4];
	  a11 = mat[5];
	  a12 = mat[6];
	  a13 = mat[7];
	  a20 = mat[8];
	  a21 = mat[9];
	  a22 = mat[10];
	  a23 = mat[11];
	  a30 = mat[12];
	  a31 = mat[13];
	  a32 = mat[14];
	  a33 = mat[15];
	  b0 = mat2[0];
	  b1 = mat2[1];
	  b2 = mat2[2];
	  b3 = mat2[3];
	  dest[0] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
	  dest[1] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
	  dest[2] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
	  dest[3] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
	  b0 = mat2[4];
	  b1 = mat2[5];
	  b2 = mat2[6];
	  b3 = mat2[7];
	  dest[4] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
	  dest[5] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
	  dest[6] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
	  dest[7] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
	  b0 = mat2[8];
	  b1 = mat2[9];
	  b2 = mat2[10];
	  b3 = mat2[11];
	  dest[8] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
	  dest[9] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
	  dest[10] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
	  dest[11] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
	  b0 = mat2[12];
	  b1 = mat2[13];
	  b2 = mat2[14];
	  b3 = mat2[15];
	  dest[12] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
	  dest[13] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
	  dest[14] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
	  dest[15] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
	  return dst;
	};
  
	Mat4.prototype.mulVec3 = function(vec, dst) {
	  if (dst == null) {
		dst = vec;
	  }
	  return this.mulVal3(vec.x, vec.y, vec.z, dst);
	};
  
	Mat4.prototype.mulVal3 = function(x, y, z, dst) {
	  var d;
	  dst = dst.data;
	  d = this.data;
	  dst[0] = d[0] * x + d[4] * y + d[8] * z;
	  dst[1] = d[1] * x + d[5] * y + d[9] * z;
	  dst[2] = d[2] * x + d[6] * y + d[10] * z;
	  return dst;
	};
  
	Mat4.prototype.mulVec4 = function(vec, dst) {
	  if (dst == null) {
		dst = vec;
	  }
	  return this.mulVal4(vec.x, vec.y, vec.z, vec.w, dst);
	};
  
	Mat4.prototype.mulVal4 = function(x, y, z, w, dst) {
	  var d;
	  dst = dst.data;
	  d = this.data;
	  dst[0] = d[0] * x + d[4] * y + d[8] * z + d[12] * w;
	  dst[1] = d[1] * x + d[5] * y + d[9] * z + d[13] * w;
	  dst[2] = d[2] * x + d[6] * y + d[10] * z + d[14] * w;
	  dst[3] = d[3] * x + d[7] * y + d[11] * z + d[15] * w;
	  return dst;
	};
  
	Mat4.prototype.invert = function(dst) {
	  var a00, a01, a02, a03, a10, a11, a12, a13, a20, a21, a22, a23, a30, a31, a32, a33, b00, b01, b02, b03, b04, b05, b06, b07, b08, b09, b10, b11, d, dest, invDet, mat;
	  if (dst == null) {
		dst = this;
	  }
	  mat = this.data;
	  dest = dst.data;
	  a00 = mat[0];
	  a01 = mat[1];
	  a02 = mat[2];
	  a03 = mat[3];
	  a10 = mat[4];
	  a11 = mat[5];
	  a12 = mat[6];
	  a13 = mat[7];
	  a20 = mat[8];
	  a21 = mat[9];
	  a22 = mat[10];
	  a23 = mat[11];
	  a30 = mat[12];
	  a31 = mat[13];
	  a32 = mat[14];
	  a33 = mat[15];
	  b00 = a00 * a11 - a01 * a10;
	  b01 = a00 * a12 - a02 * a10;
	  b02 = a00 * a13 - a03 * a10;
	  b03 = a01 * a12 - a02 * a11;
	  b04 = a01 * a13 - a03 * a11;
	  b05 = a02 * a13 - a03 * a12;
	  b06 = a20 * a31 - a21 * a30;
	  b07 = a20 * a32 - a22 * a30;
	  b08 = a20 * a33 - a23 * a30;
	  b09 = a21 * a32 - a22 * a31;
	  b10 = a21 * a33 - a23 * a31;
	  b11 = a22 * a33 - a23 * a32;
	  d = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;
	  if (d === 0) {
		return;
	  }
	  invDet = 1 / d;
	  dest[0] = (a11 * b11 - a12 * b10 + a13 * b09) * invDet;
	  dest[1] = (-a01 * b11 + a02 * b10 - a03 * b09) * invDet;
	  dest[2] = (a31 * b05 - a32 * b04 + a33 * b03) * invDet;
	  dest[3] = (-a21 * b05 + a22 * b04 - a23 * b03) * invDet;
	  dest[4] = (-a10 * b11 + a12 * b08 - a13 * b07) * invDet;
	  dest[5] = (a00 * b11 - a02 * b08 + a03 * b07) * invDet;
	  dest[6] = (-a30 * b05 + a32 * b02 - a33 * b01) * invDet;
	  dest[7] = (a20 * b05 - a22 * b02 + a23 * b01) * invDet;
	  dest[8] = (a10 * b10 - a11 * b08 + a13 * b06) * invDet;
	  dest[9] = (-a00 * b10 + a01 * b08 - a03 * b06) * invDet;
	  dest[10] = (a30 * b04 - a31 * b02 + a33 * b00) * invDet;
	  dest[11] = (-a20 * b04 + a21 * b02 - a23 * b00) * invDet;
	  dest[12] = (-a10 * b09 + a11 * b07 - a12 * b06) * invDet;
	  dest[13] = (a00 * b09 - a01 * b07 + a02 * b06) * invDet;
	  dest[14] = (-a30 * b03 + a31 * b01 - a32 * b00) * invDet;
	  dest[15] = (a20 * b03 - a21 * b01 + a22 * b00) * invDet;
	  return dst;
	};
  
	Mat4.prototype.set = function(a00, a10, a20, a30, a01, a11, a21, a31, a02, a12, a22, a32, a03, a13, a23, a33) {
	  var d;
	  d = this.data;
	  d[0] = a00;
	  d[4] = a10;
	  d[8] = a20;
	  d[12] = a30;
	  d[1] = a01;
	  d[5] = a11;
	  d[9] = a21;
	  d[13] = a31;
	  d[2] = a02;
	  d[6] = a12;
	  d[10] = a22;
	  d[14] = a32;
	  d[3] = a03;
	  d[7] = a13;
	  d[11] = a23;
	  d[15] = a33;
	  return this;
	};
  
	return Mat4;
  
  })();
  
  
  
  function min(x,y,z){
	x < y ? x = x : x = y;
	x < z ? x = x : x = z;
	return x;
  }
  
  function PinAB (  x0,  y0,  x1,  y1,  x2,  y2)
  {
	var Kb, Kc;
	Kb = x0*y1 - x1*y0;
	Kc = x0*y2 - x2*y0;
	if  ( ((0 > Kb) && (0 < Kc)) || ((0 < Kb) && (0 > Kc)) ) return 1;
	return 0;
  }
  
  function judgment(x0, y0, x1, y1, x2, y2, x3, y3){
	if ( PinAB ( x0 - x1, y0 -y1, x2 - x1, y2 - y1, x3 - x1, y3 - y1) &&
		PinAB ( x0 - x2, y0 -y2, x3 - x2, y3 - y2, x1 - x2, y1 - y2) &&
		PinAB ( x0 - x3, y0 -y3, x2 - x3, y2 - y3, x1 - x3, y1 - y3) )  
	  return true;
	return false;
  }
  
  var my_m4 = {
  
	projection: function(width, height, depth) {
	  // Note: This matrix flips the Y axis so 0 is at the top.
	  return [
		2 / width, 0, 0, 0,
		0, -2 / height, 0, 0,
		0, 0, 2 / depth, 0,
		-1, 1, 0, 1,
	  ];
	},
  
	vec_max_mul: function(a,b){
	  var result = [];
	  // 这个系数是我确定的，这个之后再确认
	  var number = 0.1 * 1.5;
	  var b00 = b[0 * 4 + 0];
	  var b01 = b[0 * 4 + 1];
	  var b02 = b[0 * 4 + 2];
	  var b03 = b[0 * 4 + 3];
	  var b10 = b[1 * 4 + 0];
	  var b11 = b[1 * 4 + 1];
	  var b12 = b[1 * 4 + 2];
	  var b13 = b[1 * 4 + 3];
	  var b20 = b[2 * 4 + 0];
	  var b21 = b[2 * 4 + 1];
	  var b22 = b[2 * 4 + 2];
	  var b23 = b[2 * 4 + 3];
	  var b30 = b[3 * 4 + 0];
	  var b31 = b[3 * 4 + 1];
	  var b32 = b[3 * 4 + 2];
	  var b33 = b[3 * 4 + 3];
	  //console.log(b00,b01,b02);
	  for (var i = 0; i < a.length; i += 3){
		result = result.concat((a[i] * b00 + a[i+1] * b01 + a[i+2] * b02 + b03) * number);
		result = result.concat((a[i] * b10 + a[i+1] * b11 + a[i+2] * b12 + b13) * number);
		result = result.concat((a[i] * b20 + a[i+1] * b21 + a[i+2] * b22 + b23) * number);
	  }
	  //console.log("result", result);
	  return result;
  
	},
  
	multiply: function(a, b) {
	  var a00 = a[0 * 4 + 0];
	  var a01 = a[0 * 4 + 1];
	  var a02 = a[0 * 4 + 2];
	  var a03 = a[0 * 4 + 3];
	  var a10 = a[1 * 4 + 0];
	  var a11 = a[1 * 4 + 1];
	  var a12 = a[1 * 4 + 2];
	  var a13 = a[1 * 4 + 3];
	  var a20 = a[2 * 4 + 0];
	  var a21 = a[2 * 4 + 1];
	  var a22 = a[2 * 4 + 2];
	  var a23 = a[2 * 4 + 3];
	  var a30 = a[3 * 4 + 0];
	  var a31 = a[3 * 4 + 1];
	  var a32 = a[3 * 4 + 2];
	  var a33 = a[3 * 4 + 3];
	  var b00 = b[0 * 4 + 0];
	  var b01 = b[0 * 4 + 1];
	  var b02 = b[0 * 4 + 2];
	  var b03 = b[0 * 4 + 3];
	  var b10 = b[1 * 4 + 0];
	  var b11 = b[1 * 4 + 1];
	  var b12 = b[1 * 4 + 2];
	  var b13 = b[1 * 4 + 3];
	  var b20 = b[2 * 4 + 0];
	  var b21 = b[2 * 4 + 1];
	  var b22 = b[2 * 4 + 2];
	  var b23 = b[2 * 4 + 3];
	  var b30 = b[3 * 4 + 0];
	  var b31 = b[3 * 4 + 1];
	  var b32 = b[3 * 4 + 2];
	  var b33 = b[3 * 4 + 3];
	  return [
		b00 * a00 + b01 * a10 + b02 * a20 + b03 * a30,
		b00 * a01 + b01 * a11 + b02 * a21 + b03 * a31,
		b00 * a02 + b01 * a12 + b02 * a22 + b03 * a32,
		b00 * a03 + b01 * a13 + b02 * a23 + b03 * a33,
		b10 * a00 + b11 * a10 + b12 * a20 + b13 * a30,
		b10 * a01 + b11 * a11 + b12 * a21 + b13 * a31,
		b10 * a02 + b11 * a12 + b12 * a22 + b13 * a32,
		b10 * a03 + b11 * a13 + b12 * a23 + b13 * a33,
		b20 * a00 + b21 * a10 + b22 * a20 + b23 * a30,
		b20 * a01 + b21 * a11 + b22 * a21 + b23 * a31,
		b20 * a02 + b21 * a12 + b22 * a22 + b23 * a32,
		b20 * a03 + b21 * a13 + b22 * a23 + b23 * a33,
		b30 * a00 + b31 * a10 + b32 * a20 + b33 * a30,
		b30 * a01 + b31 * a11 + b32 * a21 + b33 * a31,
		b30 * a02 + b31 * a12 + b32 * a22 + b33 * a32,
		b30 * a03 + b31 * a13 + b32 * a23 + b33 * a33,
	  ];
	}
  };
  
  
  var my_m3 = {
	projection: function(width, height) {
	  // 注意：这个矩阵翻转了 Y 轴，所以 0 在上方
	  return [
		2 / width, 0, 0,
		0, -2 / height, 0,
		-1, 1, 1
	  ];
	}
  };
  
  
  
  
  
  
  
  getGLAA = function(canvas) {
	var gl = null;
	for (var i = 0; i < 4; ++i) {
	  gl = canvas.getContext(
		  [ "webgl", "experimental-webgl", "moz-webgl", "webkit-3d" ][i], {
			antialias : true,
			preserveDrawingBuffer : true,
			willReadFrequently : false,
			depth: true
		  });
	  if (gl)
		break;
	}
  
	if (!gl) {
	  alert('Your browser does not support WebGL');
	}
	gl = rewrite(gl,canvas);
	return gl;
  }
  
  getGL = function(canvas) {
	var gl = null;
	for (var i = 0; i < 4; ++i) {
  
	  gl = canvas.getContext(
		  [ "webgl", "experimental-webgl", "moz-webgl", "webkit-3d" ][i], {
			antialias : false,
			preserveDrawingBuffer : true,
			willReadFrequently : false,
			depth: true
		  });
	  if (gl)
		break;
	}
  
  
  
	if (!gl) {
	  alert('Your browser does not support WebGL');
	}
	gl = rewrite(gl,canvas);
  
	return gl;
  }
  
  computeKernelWeight = function(kernel) {
	var weight = kernel.reduce(function(prev, curr) { return prev + curr; });
	return weight <= 0 ? 1 : weight;
  }
  
  var loadTextResource = function(url, callback, caller) {
	var request = new XMLHttpRequest();
	request.open('GET', url + '?please-dont-cache=' + Math.random(), true);
	request.onload = function() {
	  if (request.status < 200 || request.status > 299) {
		callback('Error: HTTP Status ' + request.status + ' on resource ' + url);
	  } else {
		callback(null, request.responseText, caller);
	  }
	};
	request.send();
  };
  
  var loadImage = function(url, callback, caller) {
	var image = new Image();
	image.onload = function() { callback(null, image, caller); };
	image.src = url;
  };
  
  var loadJSONResource = function(url, callback, caller) {
	loadTextResource(url, function(err, result, caller) {
	  if (err) {
		callback(err);
	  } else {
		try {
		  callback(null, JSON.parse(result), caller);
		} catch (e) {
		  callback(e);
		}
	  }
	}, caller);
  };
