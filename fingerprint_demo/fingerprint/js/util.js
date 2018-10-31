// Load a text resource from a file over the network

/*=============map部分===============================开头============================================*/
  //建立program的map
  var Program_data = function(){
    this.activeFlag = undefined //这个program是否被激活
      this.programName = undefined; //program的名字
    this.vertexSource = undefined; //vetex的source
    this.fragSource = undefined //frag的source
    this.shaderJsID = undefined; //Js code 执行的ID
      this.attriData = [];  //重新建立一个新的Attri_data object的array
    this.uniformData = []; //重新建立一个新的Uniform_data object的array
    this.varyingData = []; //重新建立一个新的Varying_data object的array
    }
    var ProgramDataMap = [];
    
    var Shader_data = function(){
    this.shaderTpye = undefined; //35633为vetex 35632为frag
    this.shaderName = undefined; //shader的实际赋值
    this.shaderSource = undefined; //shader的源代码（这块是直接用来修改的）
    this.shaderJsID = undefined; //Js code 执行的ID
    }
    var ShaderDataMap = [];
    
    //建立buffer的map
    var Buffer_data = function(){
    this.bufferName = undefined;  //bindBuffer 时候使用的名字  
    this.bufferType = undefined;  //依照这个来判断是array还是element_array
    this.bufferData = undefined;  //存储buffer本身的数值
    this.activeFlag = undefined;  //ARRAY_BUFFER绑定状态
    this.activeElement = undefined;  //ELEMENT_ARRAY_BUFFER绑定状态
    
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

    var vetexID;
    
    /*==========================map部分======================================结尾*/

rewrite = function(gl, canvas){
  console.log("version 5");
  ProgramDataMap = [];
  ShaderDataMap = [];
  BufferDataMap = [];
  AttriDataMap = [];
  AttributeLocMap = [];
  UniformDataMap = [];
  UniformLocMap = [];

  
  
  
  
  /*~~~~~~~~~~~~~~~~~~~~ program 部分 和 shader 部分 ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
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

    /*============================demo===================================*/
    //正式使用时候的
    //shaderSource = manualChangeShader(shaderSource);
    gl.my_shaderSource(shaderName,shaderSource);
    //测试时使用的
    // console.log(shaderSource);
    shaderSource = manualChangeShader(shaderSource);

    for (var i = 0; i < ShaderDataMap.length; i++){
    if (ShaderDataMap[i].shaderName == shaderName){
      ShaderDataMap[i].shaderSource = shaderSource;
      if (ShaderDataMap[i].shaderTpye == 35633)
        ShaderDataMap[i].shaderJsID = vetexID;
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
      ProgramDataMap[i].shaderJsID = shaderData.shaderJsID;
      } 
      else
      ProgramDataMap[i].fragSource = shaderData.shaderSource; 
      //console.log(shaderData.shaderSource);
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
  }

  /*^^^^^^^^^^^^program 部分 和 shader 部分 ^^^^^^^^^^^^^^^^^^^^^^^^*/

  /*~~~~~~~~~~~~~~~~~~~~ buffer 部分 ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
  //bindbuffer 用于激活  而且bind的buffer有两种形式
  //gl.ARRAY_BUFFER 34962
  //gl.ELEMENT_ARRAY_BUFFER 34963
  gl.my_bindBuffer = gl.__proto__.bindBuffer;
  gl.bindBuffer = function (bufferType, bufferName){
    //console.log("bufferName",bufferName);
    //bindbuffernum ++;
    initBufferMap(bufferType); // 重新把之前所有active的buffer状态归位inactive
    addBufferMap(bufferType, bufferName);  //判断是否拥有这条buffer，如果没有的话就直接加入这个buffer
    activeBufferMap(bufferType, bufferName); //激活当前的buffer
  
  
    //这块还是需要让原始代码运行
    // *******************************这块在去掉另外一套系统后，应该可以删除
    gl.my_bindBuffer(bufferType, bufferName);
  }
    /*------------用在bindbuffer 的几个函数-------------*/   
  // 重新把之前所有active的buffer状态归位inactive
  initBufferMap = function(bufferType){

    if (bufferType == 34963){
      for (i = 0; i < BufferDataMap.length; i++)
        BufferDataMap[i].activeElement = 0;
    }
    else{
      for (i = 0; i < BufferDataMap.length; i++)
        BufferDataMap[i].activeFlag = 0;  

    }
  }
  
  //判断是否拥有这条buffer，如果没有的话就直接加入这个buffer
  addBufferMap = function(bufferType, bufferName){
    //如果出现了重复的buffer，要在原始基础上直接赋值
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
      if (bufferType == 34962)
        BufferDataMap[i].activeFlag = 1;
      else
        BufferDataMap[i].activeElement = 1;
      return;
    }
  }
  /*----------------------------------------------------*/
  //重新定义bufferData
  gl.my_glbufferData = gl.__proto__.bufferData;
  gl.bufferData = function (bufferType, bufferData, c){
    if (bufferType == 34962){
      for (i = 0; i < BufferDataMap.length; i++){
        if (BufferDataMap[i].activeFlag == 1)
          BufferDataMap[i].bufferData = bufferData;
      }
    }else{
      for (i = 0; i < BufferDataMap.length; i++){
        if (BufferDataMap[i].activeElement == 1)
          BufferDataMap[i].bufferData = bufferData;
      }
    }
  } 
  
  /*^^^^^^^^^^^^^^^^^^^^^^buffer 部分 ^^^^^^^^^^^^^^^^^^^^^^^^^^^^*/



  /*~~~~~~~~~~~~~~~~~~~~ attribute 部分 ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

  /*------------gl.getAttribLocation------开头-------------*/
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
  
    //先提取getAttribLocation能获得的glsl部分的信息
    var ShaderData = new Attribute_loc;
    ShaderData = getShaderData(positionAttributeLocation);
  
    //提取bufferdata中的信息
    var BufferData = new Buffer_data;
    BufferData = getBufferData();
 
    //在这里生成一个新的attribute条目
    // 这个版本需要考虑重复赋值这种情况
    addAttriMap(ShaderData,BufferData,size,stride/4,offset/4);
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
  

/*^^^^^^^^^^^^^^^^^^^^^^^^attribute 部分^^^^^^^^^^^^^^^^^^^^^^^^*/

/*~~~~~~~~~~~~~~~~~~~~~ uniform 部分 ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
//my_getUniformLocation
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
    AddUniformMap(uniformLoc, uniformData, 1, 14);
  }
  
  
  /*------------gl.uniformXX和gl.uniformMatrix4XX------开头-------------*/
  //需要考虑重复赋值的情况
  var AddUniformMap = function(uniformLoc, uniformData, type, size){
    var newUniform = new Uniform_data;
    var newUniformLoc = new Uniform_loc;
    newUniformLoc = getUniformLoc(uniformLoc);
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
  

/*^^^^^^^^^^^^^^^^^^^^^^^^uniform 部分^^^^^^^^^^^^^^^^^^^^^^^^^^^*/




  


  return gl;
}

getCanvas = function(canvasName) {
    var canvas = $('#' + canvasName);
    if(!canvas[0]){
        $('#test_canvas').append("<canvas id='" + canvasName + "' width='256' height='256'></canvas>");
    }
    return canvas = $('#' + canvasName)[0];
}

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
