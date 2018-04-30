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
  
	  //在这里显示map的值
  
	  // console.log("ProgramDataMap",ProgramDataMap);
	  // console.log("ShaderDataMap",ShaderDataMap);
	  // console.log("BufferDataMap",BufferDataMap);
	  // console.log("AttriDataMap",AttriDataMap);
	  // console.log("AttributeLocMap",AttributeLocMap);
	  // console.log("UniformDataMap",UniformDataMap);
	  // console.log("UniformLocMap",UniformLocMap);
  
  
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
  
	gl.my_uniform3iv = gl.__proto__.uniform3iv;
	gl.uniform3iv = function (uniformLoc, uniformData){
	  AddUniformMap(uniformLoc, uniformData, 0, 3);
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
	  elementArray = getElementArray(count,offset);
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
	  for (var i = offset; i < offset + count; i++)
		returnArray = returnArray.concat(elementArray[i]);
	  return returnArray;
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
  
  
	  var parsingflag = 1;
	  if (parsingflag == 1){
		/*------------------自动化连接部分------------------------------------*/
		/*------------------数据输入部分--------------------------------------*/
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
		main();
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
		main();
		`
		}
		  //console.log("ProgramDataMap",ProgramDataMap);
		  var Compiler = GLSL();
		//console.log("testShader",testShader);
		compiled = Compiler.compile(testShader);
		// console.log("shader",testShader);
		// console.log("compiled",compiled);
  
		//需要进行mat从一维到二维的转化
		//先进行一个临时的转化
		var Tem_uniform_data = function(){
		  this.shaderName = undefined;
		  this.uniformData = undefined;
		}
		//console.log("ProgramDataMap",ProgramDataMap);
		var TemUniformDataMap = [];
		set_value_dict = {};
  
		//这里是转化的第一个版本
  
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
		// console.log("TemUniformDataMap",TemUniformDataMap);
		for (var i in TemUniformDataMap){
		  set_value_dict[TemUniformDataMap[i].shaderName] = TemUniformDataMap[i].uniformData;
		}
		//console.log([[1,2],[3]]);
		// console.log("set_value_dict",set_value_dict);
		var t0 = performance.now();
		compiled = set_values(set_value_dict, compiled,TemUniformDataMap[0].length);
		eval(compiled);
		var t1 = performance.now();
		console.log('eval', t1 - t0);
  
  
		/*------------------数据输入部分--------------------------------------*/
  
		/*------------------数据输出部分--------------------------------------*/
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
			  //console.log("left_varying",i,left_varying[i]);
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
			  //console.log("right_varying",i,  right_varying[i]);
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
			  //console.log("bot_varying",i,bot_varying[i]);
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
			  //console.log("top_varying",i,top_varying[i]);
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