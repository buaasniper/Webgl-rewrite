// Load a text resource from a file over the network
var __My_buffer;
var __My_buffer_Texture;
var __My_buffer_normal;
var __My_buffer_flag;
var __My_index;
var __My_index_flag = 0;  // 0 代表没有index，1代表有index。
var __VertexPositionAttributeLocation1_flag = 1;
var __VertexPositionAttributeLocation1;
var __VertexPositionAttributeLocation2;
var __VertexSize;
var __VertexType;
var __VertexNomalize;
var __VertexStride;
var __VertexOffset;
var __PointBuffer = [];
var __Test_pointBuffer = [];
var __ColorBuffer = [];
var __Tem_pointbuffer = [];
var __Tem_colorbuffer = [];
var __ActiveBuffer_vertex = [];
var __ActiveBuffer_vertex_result = [];
var __ActiveBuffer_vertex_texture = [];
var __ActiveBuffer_vertex_normal = [];
var __ActiveBuffer_frag = [];
var __Tem_Buffer = [];
var __ColorFlag = 0;  // 0代表不需要颜色，1代表需要颜色。
var Point_Number;
var Test_Point_number;
var __Mpro_flag = 0;
var __Matrix0 = new Float32Array(16);  // projection
var __Matrix1 = new Float32Array(16);
var __Mworld_flag = 0;
var __Mworld = new Float32Array(16);  // world
var __Mworld_fs = new Float32Array(16); // 原版world 
var __Mview_flag = 0;
var __Mview = new Float32Array(16);
var __Program;
var __Program_1;
var __x_add; // x,y值的补偿值
var __y_add;
var __Error_flag;  // 判断是否进行了误差计算
var Active_Number;
var __Drawnumber = 1; //判断这个canvas是第几次用draw函数
var __tex;
var __texture_flag;



/*------------map部分------开头-------------*/
//建立buffer的map
var Buffer_data = function(){
    this.bufferName = undefined;  //bindBuffer 时候使用的名字  
    this.bufferType = undefined;  //依照这个来判断是array还是element_array
    this.bufferData = undefined;  //存储buffer本身的数值
    this.activeFlag = undefined;  //这个是需要判断当前bindbuffer到底使用的是哪一个buffer，这个buffer是否被激活
    
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

/*------------map部分------结尾-------------*/


getCanvas = function(canvasName) {
  var canvas = $('#' + canvasName);
  if(!canvas[0]){
      $('#test_canvases').append("<canvas id='" + canvasName + "' width='256' height='256'></canvas>");
  }
  return canvas = $('#' + canvasName)[0];
}

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





/*------------map部分------开头-------------*/
	//用在bindbuffer 的几个函数
	  
	// 重新把之前所有active的buffer状态归位inactive
	initBufferMap = function(){
		for (i = 0; i < BufferDataMap.length; i++)
			BufferDataMap[i].activeFlag = 0;
	}

	//判断是否拥有这条buffer，如果没有的话就直接加入这个attribute
	addBufferMap = function(bufferType, bufferName){
		for (i = 0; i < BufferDataMap.length; i++){
			if (BufferDataMap[i].bufferName == bufferName)
				return;
		}
		var newData = new Buffer_data();
		newData.bufferType = bufferType;
		newData.bufferName = bufferName;
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


/*------------map部分------结尾-------------*/




 /*------------map部分------开头-------------*/
	//用bufferdata的函数
	addBufferData = function(bufferData){
		for (i = 0; i < BufferDataMap.length; i++){
			if (BufferDataMap[i].activeFlag == 1){
				BufferDataMap[i].bufferData = bufferData;
			}
		}
	}
 /*------------map部分------结尾-------------*/


 /*------------map部分------开头-------------*/
	//用getAttribLocation的函数
	var __Locnumber = 100; //初始化函数
	//单独建立函数的原因是在单个program的时候，单一__Locnumber是可行的，我担心在three.js多program和多attribute的情况下，可能会出问题，先暂时写成这样，调试的时候再做修改。
	creatNumber = function(){
		__Locnumber++;
		return __Locnumber;

	}
 /*------------map部分------结尾-------------*/ 


 
 /*------------map部分------开头-------------*/
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

	//？？？？？？？？？？？？？？？？？？需要在three.js中调试，到底什么时候会被初始化，是否attribute会被重复赋值（这个版本我先不考虑这个问题）。
	//需要判断是否需要重组bufferdata
	var addAttriMap = function( ShaderData = new Attribute_loc,BufferData = new Buffer_data,EleFlag,size,offset){
		var newAttri = new Attri_data;
		var temData = [];
		newAttri.shaderName = ShaderData.shaderName;
		newAttri.programName = ShaderData.programName;
		newAttri.attriEleNum = size - offset;
		for (var i = 0; i * size < BufferData.bufferData.length; i++){
			for (var j = i * size + offset; j < (i + 1) * size; j++)
			temData = temData.concat(BufferData.bufferData[j]);
		}

		// 这个是为了重组整个数据
		if (EleFlag == 0){
			newAttri.uniformData = temData;
		}else{
			for (var i = 0; i < EleFlag.length; i++){
				for (var j = EleFlag[i] * size; j < (EleFlag[i] + 1) * size; j++)
					newAttri.uniformData = newAttri.uniformData.concat(temData[j]);
			}
		}

		// 将attribute加入map
		AttriDataMap.push(newAttri);
	}

 /*------------map部分------结尾-------------*/ 


 /*------------map部分------开头-------------*/
	//用在gl.uniformXX和gl.uniformMatrix4XX的部分
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

 /*------------map部分------结尾-------------*/ 


  rewrite = function(gl){
			__texture_flag = 1;
			__My_index_flag = 0;  
      __PointBuffer = [];
      __ColorBuffer = [];
      __Tem_pointbuffer = [];
      __Tem_colorbuffer = [];
      __ActiveBuffer_vertex = [];
      __ActiveBuffer_frag = [];
      
	  var vertex_div = function(){
		
		//将数据分到位置和颜色
		
		if (__VertexOffset == 0){	
			// 将数据处理出来
			for (var i = 0; (i + 1) * stride <= __My_buffer.length; i++)
				for (var j = i * stride + offset; j <  i * stride + offset + size ; j++)
				__ActiveBuffer_vertex = __ActiveBuffer_vertex.concat(__My_buffer[j]);
			// 将float系统转换成int系统
			// 在这里256是需要转化的   以后要变成canvas的真实数值，这个以后再来做
			// 在这里vertex是原始数据， 不进行转化
			//for (var i =0; i < __ActiveBuffer_vertex.length; i++)
			//	__ActiveBuffer_vertex[i] = Math.floor(((__ActiveBuffer_vertex[i] + 1)) * 256 /2);
			
		}
		else{
			// 判断以后要用颜色
			__ColorFlag = 1;
			// 将数据处理出来
			for (var i = 0; (i + 1) * stride <= __My_buffer.length; i++)
				for (var j = i * stride + offset; j <  i * stride + offset + size; j++)
				__ActiveBuffer_frag = __ActiveBuffer_frag.concat(__My_buffer[j]);
			// 将float系统转换成int系统
			// 颜色不进行转换
			//for (var i =0; i < __ActiveBuffer_frag.length; i++)
			//	__ActiveBuffer_frag[i] = Math.floor(__ActiveBuffer_frag[i] * 255);	
		}
		
		//console.log("完成");
		//console.log("__ActiveBuffer_vertex", __ActiveBuffer_vertex);
		//console.log("__ActiveBuffer_vertex_texture", __ActiveBuffer_vertex_texture);
		//console.log("__ActiveBuffer_vertex_normal", __ActiveBuffer_vertex_normal);
	}

	__My_buffer_flag = 1;
	//去判断这个是一个是那么状态

/*------------map部分------开头-------------*/
	//重新定义bindbuffer
	//有两种情况，第一个是第一次出现这个buffer，需要完全加入一个新的attribute变量，第二种情况，只是更新目前到底在修饰哪一个buffer
	//bindbuffer这块出现了次数远远多于正常情况的情况
	var bindbuffernum = 0;
	gl.my_bindBuffer = gl.__proto__.bindBuffer;
	gl.bindBuffer = function (bufferType, bufferName){
		console.log("bufferName",bufferName);
		bindbuffernum ++;
		initBufferMap(); // 重新把之前所有active的buffer状态归位inactive
		addBufferMap(bufferType, bufferName);  //判断是否拥有这条buffer，如果没有的话就直接加入这个buffer
		activeBufferMap(bufferType, bufferName); //激活当前的buffer


		//这块还是需要让原始代码运行
		// *******************************这块在去掉另外一套系统后，应该可以删除
		gl.my_bindBuffer(bufferType, bufferName);
	}
/*------------map部分------结尾-------------*/



/*------------map部分------开头-------------*/
	//重新定义getAttribLocation
	//这块需要建立一个新的map，记录随机产生的数字和其对应关系的
	gl.my_getAttribLocation = gl.__proto__.getAttribLocation;
	gl.getAttribLocation = function (programName, shaderName){
		for (i = 0; i < AttributeLocMap.length; i++){
			if ((AttributeLocMap[i].programName == programName) && (AttributeLocMap[i].shaderName == shaderName))
				return AttributeLocMap[i].randomNumber;
		}
		
		// 在这里测试buffermap有没有问题
		//console.log("buffermap", BufferDataMap);
		//console.log("buffermap的位数", BufferDataMap.length);
		//console.log("bindbuffernum的数量", bindbuffernum);
		
		console.log("BufferDataMap","确认bindbuffer的激活情况正确",BufferDataMap);

		var newData = new Attribute_loc;
		newData.randomNumber = creatNumber(); // 通过creatNumber得到一个确定的函数
		newData.programName = programName;
		newData.shaderName = shaderName;
		AttributeLocMap.push(newData);
		// 这块两个系统产生了冲突

		console.log("AttributeLocMap", "确认LocBuffer的激活情况正确",AttributeLocMap);

		//开启map系统
		return newData.randomNumber;   //将位置的数值返回以方便在gl.vertexAttribPointer中将两个map进行关连

		//开启状态机系统
		//return gl.my_getAttribLocation(programName, shaderName);

		
	}
/*------------map部分------结尾-------------*/

/*------------map部分------开头-------------*/
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
/*------------map部分------结尾-------------*/


/*------------map部分------开头-------------*/
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
	gl.uniformMatrix2fv = function (uniformLoc, uniformData){
		AddUniformMap(uniformLoc, uniformData, 1, 12);
	}

	gl.my_uniformMatrix3fv = gl.__proto__.uniformMatrix3fv;
	gl.uniformMatrix3fv = function (uniformLoc, uniformData){
		AddUniformMap(uniformLoc, uniformData, 1, 13);
	}

	gl.my_uniformMatrix4fv = gl.__proto__.uniformMatrix4fv;
	gl.uniformMatrix4fv = function (uniformLoc, uniformData){
		AddUniformMap(uniformLoc, uniformData, 1, 14);
	}

/*------------map部分------结尾-------------*/



	gl.my_glbufferData = gl.__proto__.bufferData;
	gl.bufferData = function (a, b, c){
		/*------------map部分------开头-------------*/
		addBufferData(b);
		/*------------map部分------结尾-------------*/



		if (__texture_flag == 0){
			if (a == gl.ELEMENT_ARRAY_BUFFER){
				__My_index = b;
				__My_index_flag = 1;
				this.my_glbufferData(a, b, c);
				//console.log("__My_index", b);
			}
			else{
				__My_buffer = b;
				this.my_glbufferData(a, b, c);
				//console.log("__My_buffer", b);
			}
			return;
		}

		if (a == gl.ELEMENT_ARRAY_BUFFER){
			__My_index = b;
			__My_index_flag = 1;
			this.my_glbufferData(a, b, c);
		}
		else{
			if (__My_buffer_flag == 1){
				__My_buffer = b;
				__My_buffer_flag++;
			}
			else if (__My_buffer_flag == 2){
				__My_buffer_Texture = b;
				__My_buffer_flag++;
			}
			else{
				__My_buffer_normal = b;
				__My_buffer_flag++;
			}
			
			this.my_glbufferData(a, b, c);
			//console.log("__My_buffer", b);
		}
	} 







	gl.my_vertexAttribPointer = gl.__proto__.vertexAttribPointer;
	gl.vertexAttribPointer = function (positionAttributeLocation, size, type, normalize, stride, offset){
		/*------------map部分------开头-------------*/
		//这块就需要将两个map进行关连，最终合成到一个map中
		//此时，bindbuffer已经激活了一个javascript部分的buffer数据类型，现在需要将其合成
		//在这里要考虑单个buffer最终合成多个attribute这种情况，所以说应该是建立buffer map和attribute map两张表格才可以（上个版本只用了一个表格，是不可以的）
		//在buffer map转化为attribute map的时候，如果出现了element buffer这种情况，将要直接把重复的部分直接合成成新的data

		console.log("判断三个map的状态");
		console.log("BufferDataMap", BufferDataMap);
		console.log("AttriDataMap", AttriDataMap);
		console.log("AttributeLocMap", AttributeLocMap);

		//先提取getAttribLocation能获得的glsl部分的信息
		var ShaderData = new Attribute_loc;
		ShaderData = getShaderData(positionAttributeLocation);

		//提取bufferdata中的信息
		var BufferData = new Buffer_data;
		BufferData = getBufferData();
		//判断是否需要有element array存在,0 表示不存在， bufferdata 表示存在
		var EleFlag;
		EleFlag = getEleFlag();

		console.log("ShaderData",ShaderData);
		console.log("BufferData",BufferData);
		console.log("EleFlag",EleFlag);

		//在这里生成一个新的attribute条目
		//？？？？？？？？？？？？？？？？？？需要在three.js中调试，到底什么时候会被初始化，是否attribute会被重复赋值（这个版本我先不考虑这个问题）。
		addAttriMap(ShaderData,BufferData,EleFlag,size,offset);

		




		/*------------map部分------结尾-------------*/

		if (__texture_flag == 0){
				// 在这里无法智能的判断位置和颜色
			//console.log("进入");
			
			if (offset == 0){
				__VertexPositionAttributeLocation1 = positionAttributeLocation;
				__VertexSize = size;
			}
			else{
				__VertexPositionAttributeLocation2 = positionAttributeLocation;
			}

			__VertexType = type;
			__VertexNomalize = normalize;
			__VertexStride = stride;
			__VertexOffset = offset;
			//this.my_vertexAttribPointer(positionAttributeLocation, __VertexSize,__VertexType, __VertexNomalize, __VertexStride, __VertexOffset);

			// 这个是因为传入的数据内容大小，转换成数据个数
			stride = stride / 4;  
			offset = offset / 4;

			// 重新重构数据
			if (__My_index_flag == 1){
				var __Tem_my_buffer = [];
				for (var i = 0; i < __My_index.length; i++){
					for (var j = __My_index[i] * stride; j < (__My_index[i] + 1) * stride; j++)
						__Tem_my_buffer = __Tem_my_buffer.concat(__My_buffer[j]);
				}
				__My_buffer = __Tem_my_buffer;
				__My_index_flag = 0;
				//console.log("重新赴值__My_buffer", __My_buffer);
			}

			// 这是一个合法的写法，stride等于0，即位没有总长就是数据的长度
			if (stride == 0)
			stride = size;

			//将数据分到位置和颜色
			if (__VertexOffset == 0){	
				// 将数据处理出来
				for (var i = 0; (i + 1) * stride <= __My_buffer.length; i++)
					for (var j = i * stride + offset; j <  i * stride + offset + size ; j++)
					__ActiveBuffer_vertex = __ActiveBuffer_vertex.concat(__My_buffer[j]);
				// 将float系统转换成int系统
				// 在这里256是需要转化的   以后要变成canvas的真实数值，这个以后再来做

				// 在这里vertex是原始数据， 不进行转化

				//for (var i =0; i < __ActiveBuffer_vertex.length; i++)
				//	__ActiveBuffer_vertex[i] = Math.floor(((__ActiveBuffer_vertex[i] + 1)) * 256 /2);
				
			}
			else{
				// 判断以后要用颜色
				__ColorFlag = 1;
				// 将数据处理出来
				for (var i = 0; (i + 1) * stride <= __My_buffer.length; i++)
					for (var j = i * stride + offset; j <  i * stride + offset + size; j++)
					__ActiveBuffer_frag = __ActiveBuffer_frag.concat( Math.round(__My_buffer[j] * 1000) /1000);
				// 将float系统转换成int系统
				// 颜色不进行转换
				//for (var i =0; i < __ActiveBuffer_frag.length; i++)
				//	__ActiveBuffer_frag[i] = Math.floor(__ActiveBuffer_frag[i] * 255);	
			}
			//console.log("完成");
				return;
		}



		// 在这里无法智能的判断位置和颜色
		//console.log("进入");
		if (offset == 0){
			if (__VertexPositionAttributeLocation1_flag == 1){
				__VertexPositionAttributeLocation1 = positionAttributeLocation;
				__VertexPositionAttributeLocation1_flag = 2;
			}
			__VertexSize = size;
		}
		else{
			__VertexPositionAttributeLocation2 = positionAttributeLocation;
		}

		__VertexType = type;
		__VertexNomalize = normalize;
		__VertexStride = stride;
		__VertexOffset = offset;
		//this.my_vertexAttribPointer(positionAttributeLocation, __VertexSize,__VertexType, __VertexNomalize, __VertexStride, __VertexOffset);

		// 这个是因为传入的数据内容大小，转换成数据个数
		stride = stride / 4;  
		offset = offset / 4;
/*
		console.log("*********************************");
		console.log("__My_index", __My_index);
		console.log("__My_buffer",__My_buffer);
		console.log("__My_buffer_Texture",__My_buffer_Texture);
*/
		// 重新重构数据
		if (__My_index_flag == 1){
			var __Tem_my_buffer = [];
			for (var i = 0; i < __My_index.length; i++){
				for (var j = __My_index[i] * 3; j < (__My_index[i] + 1) * 3; j++)
					__Tem_my_buffer = __Tem_my_buffer.concat(__My_buffer[j]);
			}
			__My_buffer = __Tem_my_buffer;

			__Tem_my_buffer = [];
			for (var i = 0; i < __My_index.length; i++){
				for (var j = __My_index[i] * 2; j < (__My_index[i] + 1) * 2; j++)
					__Tem_my_buffer = __Tem_my_buffer.concat(__My_buffer_Texture[j]);
			}
			__My_buffer_Texture = __Tem_my_buffer;


			// 确认这一块出现了向量这个新的参数
			if (__My_buffer_flag == 4){
				__Tem_my_buffer = [];
				for (var i = 0; i < __My_index.length; i++){
					for (var j = __My_index[i] * 3; j < (__My_index[i] + 1) * 3; j++)
						__Tem_my_buffer = __Tem_my_buffer.concat(__My_buffer_normal[j]);
				}
				__My_buffer_normal = __Tem_my_buffer;
			}

			__My_index_flag = 0;
			//console.log("重新赴值__My_buffer", __My_buffer);
		}

		// 这是一个合法的写法，stride等于0，即位没有总长就是数据的长度
		if (stride == 0)
		stride = size;

		__ActiveBuffer_vertex = __My_buffer;
		__ActiveBuffer_vertex_texture = __My_buffer_Texture;
		if (__My_buffer_flag == 4)
			__ActiveBuffer_vertex_normal = __My_buffer_normal;

	}
	

	var draw_line = function(){		
				var t1 = [];
				var t2 = [];
				var t3 = [];
				var t4 = [];
			
				for (var i = 990; i <1026; i++){
					t1 = t1.concat(tri_result[i * 3]);
					t1 = t1.concat(tri_result[i * 3 + 1]);
					t1 = t1.concat(tri_result[i * 3 + 2]);
					t2 = t2.concat(tri_texture[i * 2]); 
					t2 = t2.concat(tri_texture[i * 2 + 1]); 
					t2 = t2.concat(tri_texture[i * 2 + 2]); 
				}
				var new_vertex_buffer = gl.createBuffer();
				gl.bindBuffer(gl.ARRAY_BUFFER, new_vertex_buffer);
				gl.my_glbufferData(gl.ARRAY_BUFFER, new Float32Array(canvas_buffer), gl.STATIC_DRAW);
				gl.my_vertexAttribPointer(__VertexPositionAttributeLocation1, 2 ,__VertexType, __VertexNomalize, 2 * Float32Array.BYTES_PER_ELEMENT , 0);		
				gl.my_useProgram(__Program);
				var traingles_vex_loc = gl.getUniformLocation(__Program, "tri_point");
				var traingles_text_loc = gl.getUniformLocation(__Program, "text_point");
				gl.uniform3fv(traingles_vex_loc, t1);
				gl.uniform2fv(traingles_text_loc, t2);
				console.log("更改过了");
				gl.drawArrays(gl.TRIANGLES, 0, 6);
				console.log("this.my_drawArrays",gl.my_drawArrays);
				console.log("gl.__proto__.drawArrays",gl.__proto__.drawArrays);
				gl.bindTexture(gl.TEXTURE_2D, __tex);
				gl.activeTexture(gl.TEXTURE0);
					
				var t1 = [];
				var t2 = [];
				for (var i = 513; i <1017; i++){
					t1 = t1.concat(tri_result[i * 3]);
					t1 = t1.concat(tri_result[i * 3 + 1]);
					t1 = t1.concat(tri_result[i * 3 + 2]);
					t2 = t2.concat(tri_texture[i * 2]); 
					t2 = t2.concat(tri_texture[i * 2 + 1]); 
					t2 = t2.concat(tri_texture[i * 2 + 2]); 
				}
				var new_vertex_buffer = gl.createBuffer();
				gl.bindBuffer(gl.ARRAY_BUFFER, new_vertex_buffer);
				gl.my_glbufferData(gl.ARRAY_BUFFER, new Float32Array(canvas_buffer1), gl.STATIC_DRAW);
				gl.my_vertexAttribPointer(__VertexPositionAttributeLocation1, 2 ,__VertexType, __VertexNomalize, 2 * Float32Array.BYTES_PER_ELEMENT , 0);		
				gl.my_useProgram(__Program);
				var traingles_vex_loc = gl.getUniformLocation(__Program, "tri_point");
				var traingles_text_loc = gl.getUniformLocation(__Program, "text_point");
				gl.uniform3fv(traingles_vex_loc, t1);
				gl.uniform2fv(traingles_text_loc, t2);
				console.log("更改过了");
				gl.drawArrays(gl.TRIANGLES, 0, 6);
				console.log("this.my_drawArrays",gl.my_drawArrays);
				console.log("gl.__proto__.drawArrays",gl.__proto__.drawArrays);
		}

	
	
	
	
	
	gl.my_useProgram =  gl.__proto__.useProgram;
	gl.useProgram = function(a){
		__Program = a;
		this.my_useProgram(a);
		//console.log("__ActiveBuffer_vertex",__ActiveBuffer_vertex);
		//console.log("__ActiveBuffer_frag",__ActiveBuffer_frag);
	}

	var tri_div_draw = function(){
		__PointBuffer = [];
		__ColorBuffer = [];
		switch (primitiveType){
			case gl.TRIANGLES:
				for (var i = offset; i < offset + count; i += 3){
					switch (__VertexSize){
						case 3:
							console.log("开始画图");
							//console.log("i的数值", i);
							//console.log("__ColorFlag",__ColorFlag)
							//tri_3(i);
						break;
					}
				}
			break;
		}
		// 在这里重新将值转化回来
		//matrix_mut(__Matrix1);
		//__PointBuffer = my_m4.vec_max_mul(__PointBuffer, __Matrix1);
		for (var i = 0; i < __PointBuffer.length; i++){
			__PointBuffer[i] = __PointBuffer[i] / 128 - 1;
		}
			
		// 数据传递到__PointBuffer, 开始在这里进行画图
		Point_Number = __PointBuffer.length;
		//console.log("Point_Number", Point_Number);
		//console.log("转化完成的__PointBuffer",__PointBuffer);	
		// 这个一会会进行修改
		
		if (__ColorFlag == 0){
			var new_vertex_buffer = gl.createBuffer();
			gl.bindBuffer(gl.ARRAY_BUFFER, new_vertex_buffer);
			gl.my_glbufferData(gl.ARRAY_BUFFER, new Float32Array(__PointBuffer), gl.STATIC_DRAW);
			//gl.bindBuffer(gl.ARRAY_BUFFER, null);
			gl.my_vertexAttribPointer(__VertexPositionAttributeLocation1, __VertexSize,__VertexType, __VertexNomalize, __VertexStride, __VertexOffset);		
			gl.useProgram(__Program);
			gl.bindBuffer(gl.ARRAY_BUFFER, new_vertex_buffer);
			this.my_drawArrays(gl.POINTS, 0, Point_Number/__VertexSize);
			//console.log("=====================================");
		
		}else{
			for (var i = 0; i < __ColorBuffer.length; i++){
				__ColorBuffer[i] = __ColorBuffer[i] / 255.0;
			}
			console.log("__PointBuffer",__PointBuffer);
			console.log("__ColorBuffer",__ColorBuffer);
			var result_buffer = [];
			var j = 0;
			var k = 0;
			for (var i = 0; i < Point_Number/__VertexSize; i++){
			  while (j < (i+1) * __VertexSize){
				result_buffer = result_buffer.concat(__PointBuffer[j]);
				j++;
			  }
			  while (k < (i+1) * 3){
				result_buffer = result_buffer.concat(__ColorBuffer[k]);
				k++;
			  }
				
			}
		
			
			console.log("result_buffer",result_buffer);
			
			
			var new_vertex_buffer = gl.createBuffer();
			gl.bindBuffer(gl.ARRAY_BUFFER, new_vertex_buffer);
			gl.my_glbufferData(gl.ARRAY_BUFFER, new Float32Array(result_buffer), gl.STATIC_DRAW);
			console.log("__VertexSize",__VertexSize);
			
			//var new_frag_buffer = gl.createBuffer();
			//gl.bindBuffer(gl.ARRAY_BUFFER, new_frag_buffer);
			//gl.my_glbufferData(gl.ARRAY_BUFFER, new Float32Array(__ColorBuffer), gl.STATIC_DRAW);
			//gl.bindBuffer(gl.ARRAY_BUFFER, null);
			//console.log("__VertexPositionAttributeLocation1",__VertexPositionAttributeLocation1);
			//console.log("__VertexPositionAttributeLocation2",__VertexPositionAttributeLocation2);
			gl.my_vertexAttribPointer(__VertexPositionAttributeLocation1, __VertexSize,__VertexType, __VertexNomalize, (__VertexSize + 3) * Float32Array.BYTES_PER_ELEMENT , 0);	
			gl.my_vertexAttribPointer(__VertexPositionAttributeLocation2, 3 ,__VertexType, __VertexNomalize, (__VertexSize + 3) * Float32Array.BYTES_PER_ELEMENT , __VertexSize * Float32Array.BYTES_PER_ELEMENT);		
			gl.my_useProgram(__Program);
			//gl.bindBuffer(gl.ARRAY_BUFFER, new_vertex_buffer);
			//gl.bindBuffer(gl.ARRAY_BUFFER, new_frag_buffer);
			this.my_drawArrays(gl.POINTS, 0, Point_Number/__VertexSize);
			console.log("画点的数量", Point_Number/__VertexSize);
			console.log("=====================================");
		}
	}
	//gl.my_drawElements = gl.__proto__.drawElements;
	AAA = function (a , b, c, d){
	  // 这里暂时默认是三角形
	  BBB(a , 0, b);
	  //console.log("my_drawElements  b * 3", b * 3);
	}

	var tri_loc = function(){
		for (var i = 0; i < 510; i++){
			t1 = t1.concat(tri_result[i * 3]);
			t1 = t1.concat(tri_result[i * 3 + 1]);
			t1 = t1.concat(tri_result[i * 3 + 2]);
			t2 = t2.concat(tri_texture[i * 2]); 
			t2 = t2.concat(tri_texture[i * 2 + 1]); 
			t2 = t2.concat(tri_texture[i * 2 + 2]); 
		}
		var new_vertex_buffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, new_vertex_buffer);
		gl.my_glbufferData(gl.ARRAY_BUFFER, new Float32Array(canvas_buffer), gl.STATIC_DRAW);
		gl.my_vertexAttribPointer(__VertexPositionAttributeLocation1, 2 ,__VertexType, __VertexNomalize, 2 * Float32Array.BYTES_PER_ELEMENT , 0);		
		gl.my_useProgram(__Program);
		var traingles_vex_loc = gl.getUniformLocation(__Program, "tri_point");
		var traingles_text_loc = gl.getUniformLocation(__Program, "text_point");
		gl.uniform3fv(traingles_vex_loc, t1);
		gl.uniform2fv(traingles_text_loc, t2);
		console.log("更改过了");
		this.my_drawArrays(gl.TRIANGLES, 0, 6);
	}

	//gl.my_drawArrays = gl.__proto__.drawArrays;
	BBB = function(primitiveType, offset, count){
		if (primitiveType == gl.LINE_STRIP){
			var line_buffer = [];
			for (var i =0; i < __ActiveBuffer_vertex.length; i++)
				if (i % 3 != 2)
				__ActiveBuffer_vertex[i] = Math.floor(((__ActiveBuffer_vertex[i] + 1)) * 256 /2);
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
					__ActiveBuffer_vertex[i] = Math.floor(((__ActiveBuffer_vertex[i] + 1)) * 256 /2);
				else
					__ActiveBuffer_vertex[i] = -1 * __ActiveBuffer_vertex[i];
			*/
			
			// 这是int版本的
			for (var i =0; i < __ActiveBuffer_vertex.length; i++)
				if (i % 3 != 2)
					__ActiveBuffer_vertex[i] = Math.floor(((__ActiveBuffer_vertex[i] + 1)) * 256 /2);
				else
					__ActiveBuffer_vertex[i] = -1 * Math.floor(((__ActiveBuffer_vertex[i] + 1)) * 256 /2);

			
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
					__ActiveBuffer_vertex_result[i] = Math.floor(((__ActiveBuffer_vertex_result[i] + 1)) * 256 /2);
				else
					__ActiveBuffer_vertex_result[i] = -1 * __ActiveBuffer_vertex_result[i];
		*/

		//这个是int版本
		for (var i =0; i < __ActiveBuffer_vertex_result.length; i++)
			if (i % 3 != 2)
				__ActiveBuffer_vertex_result[i] = Math.floor(((__ActiveBuffer_vertex_result[i] + 1)) * 256 /2);
			else
				__ActiveBuffer_vertex_result[i] = -1 * Math.floor(((__ActiveBuffer_vertex_result[i] + 1)) * 256 /2);

			
		for (var i =0; i < __ActiveBuffer_vertex_texture.length; i++)
			__ActiveBuffer_vertex_texture[i] = Math.floor(((__ActiveBuffer_vertex_texture[i] )) * 255);

		var t_nor = [];	
		if (__My_buffer_flag == 4){
			console.log("__Mworld_fs",__Mworld_fs);
			for (var i =0; i < __ActiveBuffer_vertex_normal.length; i += 3){
				t_nor = t_nor.concat((__ActiveBuffer_vertex_normal[i] * __Mworld_fs[0] + __ActiveBuffer_vertex_normal[i+1] * __Mworld_fs[4] + __ActiveBuffer_vertex_normal[i+2] * __Mworld_fs[8]));
				t_nor = t_nor.concat((__ActiveBuffer_vertex_normal[i] * __Mworld_fs[1] + __ActiveBuffer_vertex_normal[i+1] * __Mworld_fs[5] + __ActiveBuffer_vertex_normal[i+2] * __Mworld_fs[9]) );
				t_nor = t_nor.concat((__ActiveBuffer_vertex_normal[i] * __Mworld_fs[2] + __ActiveBuffer_vertex_normal[i+1] * __Mworld_fs[6] + __ActiveBuffer_vertex_normal[i+2] * __Mworld_fs[10])) ;
			}
			for (var i =0; i < __ActiveBuffer_vertex_normal.length; i++)
				__ActiveBuffer_vertex_normal[i] = Math.floor(((t_nor[i] )) * 100);
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
		console.log("__ActiveBuffer_vertex_result",__ActiveBuffer_vertex_result);
		console.log("__ActiveBuffer_vertex_texture",__ActiveBuffer_vertex_texture);
		console.log("__ActiveBuffer_vertex_normal",__ActiveBuffer_vertex_normal);

		console.log("tri_result",tri_result);
		console.log("tri_texture",tri_texture);
		console.log("tri_normal",tri_normal);


		devide_draw(0, 255, tri_result, tri_texture, tri_normal, gl);
		










/*===================================================================================================*/

	








	}
	return gl;
}







var uniform_number  = 111;

function devide_draw(left, right, tri_result, tri_texture, tri_normal, gl){
	var left_result = [];
	var left_texture = [];
	var left_normal = [];
	var right_result = [];
	var right_texture = [];
	var right_normal = [];
	var tri_number = tri_result.length / 9;
	var mid = Math.floor((left + right) / 2);
	var left_number = 0;
	var right_number = 0;

	//console.log("中间点", mid);
	for (var i = 0; i < tri_number; i++){
		if (!((tri_result[i * 9] >= mid) && (tri_result[i * 9 + 3] >= mid) && (tri_result[i * 9 + 6] >= mid))){
			
			left_number ++;
			
			for (var j = 0; j < 9; j++)
				left_result =  left_result.concat(tri_result[i * 9 + j]);
			for (var j = 0; j < 6; j++)
				left_texture = left_texture.concat(tri_texture[i * 6 + j]);
			if (__My_buffer_flag == 4){
				for (var j = 0; j < 9; j++)
					left_normal =  left_normal.concat(tri_normal[i * 9 + j]);
			}
			
		}		
		if (!((tri_result[i * 9] <= mid) && (tri_result[i * 9 + 3] <= mid) && (tri_result[i * 9 + 6] <= mid))){
			
			right_number ++;
			
			for (var j = 0; j < 9; j++)
				right_result = right_result.concat(tri_result[i * 9 + j]);
			for (var j = 0; j < 6; j++)
				right_texture = right_texture.concat(tri_texture[i * 6 + j]);
			if (__My_buffer_flag == 4){
					for (var j = 0; j < 9; j++)
						right_normal =  right_normal.concat(tri_normal[i * 9 + j]);
				}
			
		}
	}
	if (left_number <= uniform_number){
		var right_canvas_buffer = [
			left * 2 / 255 - 1.0,     -1.0, 
			mid * 2 / 255 - 1.0,      -1.0, 
			left * 2 / 255 - 1.0,      1.0, 
			left * 2 / 255 - 1.0,      1.0,
			mid * 2 / 255 - 1.0,      -1.0, 
			mid * 2 / 255 - 1.0,       1.0]; 
		var new_vertex_buffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, new_vertex_buffer);
		gl.my_glbufferData(gl.ARRAY_BUFFER, new Float32Array(right_canvas_buffer), gl.STATIC_DRAW);
		gl.my_vertexAttribPointer(__VertexPositionAttributeLocation1, 2 ,__VertexType, __VertexNomalize, 2 * Float32Array.BYTES_PER_ELEMENT , 0);		
		gl.my_useProgram(__Program);
		var traingles_vex_loc = gl.getUniformLocation(__Program, "tri_point");
		var traingles_text_loc = gl.getUniformLocation(__Program, "text_point");
		var traingles_num_loc = gl.getUniformLocation(__Program, "tri_number");

		//console.log("left_result", left_result);
		//console.log("left_texture", left_texture);
		gl.uniform3iv(traingles_vex_loc, left_result);
		gl.uniform2iv(traingles_text_loc, left_texture);
		gl.uniform1i(traingles_num_loc, left_number);

		if (__My_buffer_flag == 4){
			var traingles_nor_loc = gl.getUniformLocation(__Program, "nor_point");
			gl.uniform3iv(traingles_nor_loc, left_normal);
		}
		gl.drawArrays(gl.TRIANGLES, 0, 6);

	}
	else{
		if (mid == right){
			//console.log("分割左右的","left", left, "right", right, "number", left_number);
			devide_draw_height(left, right, 0, 255, tri_result, tri_texture, tri_normal, gl);
			
			return;
		}	
		devide_draw(left, mid, left_result, left_texture, left_normal, gl);
	}

	if (right_number <= uniform_number){
		var right_canvas_buffer = [
			mid * 2 / 255 - 1.0, -1.0, 
			right * 2 / 255 - 1.0, -1.0, 
			mid * 2 / 255 - 1.0,  1.0, 
			mid * 2 / 255 - 1.0,  1.0,
			right * 2 / 255 - 1.0, -1.0, 
			right * 2 / 255 - 1.0,  1.0]; 
		var new_vertex_buffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, new_vertex_buffer);
		gl.my_glbufferData(gl.ARRAY_BUFFER, new Float32Array(right_canvas_buffer), gl.STATIC_DRAW);
		gl.my_vertexAttribPointer(__VertexPositionAttributeLocation1, 2 ,__VertexType, __VertexNomalize, 2 * Float32Array.BYTES_PER_ELEMENT , 0);		
		gl.my_useProgram(__Program);

		var traingles_vex_loc = gl.getUniformLocation(__Program, "tri_point");
		var traingles_text_loc = gl.getUniformLocation(__Program, "text_point");
		var traingles_num_loc = gl.getUniformLocation(__Program, "tri_number");
		gl.uniform3iv(traingles_vex_loc, right_result);
		gl.uniform2iv(traingles_text_loc, right_texture);
		gl.uniform1i(traingles_num_loc, right_number);

		if (__My_buffer_flag == 4){
			var traingles_nor_loc = gl.getUniformLocation(__Program, "nor_point");
			gl.uniform3iv(traingles_nor_loc, right_normal);
		}
		gl.drawArrays(gl.TRIANGLES, 0, 6);
	}
	else{
		if (mid == left){
			//console.log("分割左右的","left", left, "right", right, "number", right_number);
			devide_draw_height(left, right, 0, 255, tri_result, tri_texture, tri_normal, gl);
			
			return;
		}	
		devide_draw(mid, right, right_result, right_texture, right_normal, gl);
	}
	return;
}



/* ===================================分割高低的==================================================*/

function devide_draw_height(left, right, bot, top, tri_result, tri_texture, tri_normal, gl){
	var bot_result = [];
	var bot_texture = [];
	var bot_normal = [];
	var top_result = [];
	var top_texture = [];
	var top_normal = [];
	var tri_number = tri_result.length / 9;
	var mid = Math.floor((bot + top) / 2);
	var bot_number = 0;
	var top_number = 0;
	//console.log("接受的数据", left, right, bot, top, tri_number);

	//console.log("中间点", mid);
	for (var i = 0; i < tri_number; i++){
		if (!((tri_result[i * 9 + 1] >= mid) && (tri_result[i * 9 + 4] >= mid) && (tri_result[i * 9 + 7] >= mid))){
			
			bot_number ++;
			
			for (var j = 0; j < 9; j++)
				bot_result =  bot_result.concat(tri_result[i * 9 + j]);
			for (var j = 0; j < 6; j++)
				bot_texture = bot_texture.concat(tri_texture[i * 6 + j]);
			if (__My_buffer_flag == 4){
				for (var j = 0; j < 9; j++)
					bot_normal =  bot_normal.concat(tri_normal[i * 9 + j]);
			}
			
		}		
		if (!((tri_result[i * 9 + 1] <= mid) && (tri_result[i * 9 + 4] <= mid) && (tri_result[i * 9 + 7] <= mid))){
			
			top_number ++;
			
			for (var j = 0; j < 9; j++)
				top_result = top_result.concat(tri_result[i * 9 + j]);
			for (var j = 0; j < 6; j++)
				top_texture = top_texture.concat(tri_texture[i * 6 + j]);
			if (__My_buffer_flag == 4){
					for (var j = 0; j < 9; j++)
						top_normal =  top_normal.concat(tri_normal[i * 9 + j]);
				}
			
		}
	}
	if (bot_number <= uniform_number){
		//console.log("bot开始画了", bot_number, bot * 2 / 255 -1.0, mid * 2 / 255 -1.0);
		
		var right_canvas_buffer = [
			left * 2 / 255 - 1.0,   bot * 2 / 255 -1.0, 
			right * 2 / 255 - 1.0,    bot * 2 / 255 -1.0, 
			left * 2 / 255 - 1.0,    mid * 2 / 255 -1.0, 
			left * 2 / 255 - 1.0,    mid * 2 / 255 -1.0,
			right * 2 / 255 - 1.0,    bot * 2 / 255 -1.0, 
			right * 2 / 255 - 1.0,    mid * 2 / 255 -1.0]; 

		var new_vertex_buffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, new_vertex_buffer);
		gl.my_glbufferData(gl.ARRAY_BUFFER, new Float32Array(right_canvas_buffer), gl.STATIC_DRAW);
		gl.my_vertexAttribPointer(__VertexPositionAttributeLocation1, 2 ,__VertexType, __VertexNomalize, 2 * Float32Array.BYTES_PER_ELEMENT , 0);		
		gl.my_useProgram(__Program);
		var traingles_vex_loc = gl.getUniformLocation(__Program, "tri_point");
		var traingles_text_loc = gl.getUniformLocation(__Program, "text_point");
		gl.uniform3iv(traingles_vex_loc, bot_result);
		gl.uniform2iv(traingles_text_loc, bot_texture);
		if (__My_buffer_flag == 4){
			var traingles_nor_loc = gl.getUniformLocation(__Program, "nor_point");
			gl.uniform3iv(traingles_nor_loc, bot_normal);
		}
		gl.drawArrays(gl.TRIANGLES, 0, 6);

	}
	else{
		if (mid == top){
			//console.log("left", left, "right", right, "bot", bot, "top", top, "number", bot_number);
			return;
		}	
		devide_draw_height(left, right, bot, mid, bot_result, bot_texture, bot_normal, gl);
	}	
	if (top_number <= uniform_number){
		//console.log("top开始画了", top_number, mid * 2 / 255 -1.0, top * 2 / 255 -1.0);
		var right_canvas_buffer = [
			left * 2 / 255 - 1.0, mid * 2 / 255 -1.0, 
			right * 2 / 255 - 1.0,  mid * 2 / 255 -1.0, 
			left * 2 / 255 - 1.0,  top * 2 / 255 -1.0, 
			left * 2 / 255 - 1.0,  top * 2 / 255 -1.0,
			right * 2 / 255 - 1.0,  mid * 2 / 255 -1.0, 
			right * 2 / 255 - 1.0,  top * 2 / 255 -1.0]; 

		var new_vertex_buffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, new_vertex_buffer);
		gl.my_glbufferData(gl.ARRAY_BUFFER, new Float32Array(right_canvas_buffer), gl.STATIC_DRAW);
		gl.my_vertexAttribPointer(__VertexPositionAttributeLocation1, 2 ,__VertexType, __VertexNomalize, 2 * Float32Array.BYTES_PER_ELEMENT , 0);		
		gl.my_useProgram(__Program);
		var traingles_vex_loc = gl.getUniformLocation(__Program, "tri_point");
		var traingles_text_loc = gl.getUniformLocation(__Program, "text_point");
		gl.uniform3iv(traingles_vex_loc, top_result);
		gl.uniform2iv(traingles_text_loc, top_texture);
		if (__My_buffer_flag == 4){
			var traingles_nor_loc = gl.getUniformLocation(__Program, "nor_point");
			gl.uniform3iv(traingles_nor_loc, top_normal);
		}
		gl.drawArrays(gl.TRIANGLES, 0, 6);
	}
	else{
		if (mid == left){
			//console.log("left", left, "right", right, "bot", bot, "top", top, "number", top_number);
			return;
		}	
		devide_draw_height(left, right, mid, top, top_result, top_texture, top_normal, gl);
	}
	return;
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



function tri_3(i){
	var x1 = __ActiveBuffer_vertex[i * __VertexSize];
	var y1 = __ActiveBuffer_vertex[i * __VertexSize + 1];
	var z1 = __ActiveBuffer_vertex[i * __VertexSize + 2];
	var x2 = __ActiveBuffer_vertex[i * __VertexSize + 3];
	var y2 = __ActiveBuffer_vertex[i * __VertexSize + 4];
	var z2 = __ActiveBuffer_vertex[i * __VertexSize + 5];
	var x3 = __ActiveBuffer_vertex[i * __VertexSize + 6];
	var y3 = __ActiveBuffer_vertex[i * __VertexSize + 7];
	var z3 = __ActiveBuffer_vertex[i * __VertexSize + 8];
	if (__ColorFlag == 1){
		var r1 = __ActiveBuffer_frag[i * 3];
		var g1 = __ActiveBuffer_frag[i * 3 + 1];
		var b1 = __ActiveBuffer_frag[i * 3 + 2];
		var r2 = __ActiveBuffer_frag[i * 3 + 3];
		var g2 = __ActiveBuffer_frag[i * 3 + 4];
		var b2 = __ActiveBuffer_frag[i * 3 + 5];
		var r3 = __ActiveBuffer_frag[i * 3 + 6];
		var g3 = __ActiveBuffer_frag[i * 3 + 7];
		var b3 = __ActiveBuffer_frag[i * 3 + 8];
	}
	//console.log("三个点的坐标",x1, y1, x2, y2, x3, y3);
	//这块假设把matrix已经弄完了
	var x_min = min(x1, x2, x3);
	var x_max = max(x1, x2, x3);
	var y_min = min(y1, y2, y3);
	var y_max = max(y1, y2, y3);
	//console.log("x的范围区间", x_min, x_max);
	//console.log("y的范围区间", y_min, y_max);
	if (x1 == x_min) x1--;
	if (x1 == x_max) x1++;
	if (x2 == x_min) x2--;
	if (x2 == x_max) x2++;
	if (x3 == x_min) x3--;
	if (x3 == x_max) x3++;
	if (y1 == y_min) y1--;
	if (y1 == y_max) y1++;
	if (y2 == y_min) y2--;
	if (y2 == y_max) y2++;
	if (y3 == y_min) y3--;
	if (y3 == y_max) y3++;
		

	for (var i = x_min; i <= x_max; i++){
		for (var j = y_min; j <= y_max; j++){
			if (judgment(i, j, x1, y1, x2, y2, x3, y3)){
				//在这里面计算z值，然后输入进去
				//console.log("符合输入的值", i , j);
				var A = (y3 - y1)*(z3 - z1) - (z2 -z1)*(y3 - y1);
				var B = (x3 - x1)*(z2 - z1) - (x2 - x1)*(z3 - z1);
				var C = (x2 - x1)*(y3 - y1) - (x3 - x1)*(y2 - y1);
				var D = -1 * (A * x1 + B * y1 + C * z1);
				var k = Math.floor(-1 * (A * i + B * j + D) / C);
				__PointBuffer = __PointBuffer.concat(i);
				__PointBuffer = __PointBuffer.concat(j);
				__PointBuffer = __PointBuffer.concat(k);
				if (__ColorFlag == 1){
					//console.log("进入颜色计算");
					var dis_1 = Math.pow(0.9, Math.sqrt((x1 - i)*(x1 - i)+(y1 - j)*(y1 - j)));
					var dis_2 = Math.pow(0.9, Math.sqrt((x2 - i)*(x2 - i)+(y2 - j)*(y2 - j)));
					var dis_3 = Math.pow(0.9, Math.sqrt((x3 - i)*(x3 - i)+(y3 - j)*(y3 - j)));
					var dis_mun = dis_1 + dis_2 + dis_3;
					var wei_1 = dis_1 / dis_mun;
					var wei_2 = dis_2 / dis_mun;
					var wei_3 = dis_3 / dis_mun;
					// 颜色这块的转换需要弄明白
					var r = Math.floor(wei_1 * r1 + wei_2 * r2 + wei_3 * r3);
					var g = Math.floor(wei_1 * g1 + wei_2 * g2 + wei_3 * g3);
					var b = Math.floor(wei_1 * b1 + wei_2 * b2 + wei_3 * b3);
					__ColorBuffer = __ColorBuffer.concat(r);
					__ColorBuffer = __ColorBuffer.concat(g);
					__ColorBuffer =__ColorBuffer.concat(b);
				}
			}
		}
	}

}

function max(x,y,z){
	x > y ? x = x : x = y;
	x > z ? x = x : x = z;
	return x;
}



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
  gl = rewrite(gl);
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
  gl = rewrite(gl);
  
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