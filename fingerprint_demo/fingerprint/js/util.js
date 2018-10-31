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







  /*^^^^^^^^^^^^^^^^^^^^^^buffer 部分 ^^^^^^^^^^^^^^^^^^^^^^^^^^^^*/
  


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
