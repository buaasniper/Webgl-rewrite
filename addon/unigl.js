flag = 0;
var vetexID;

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


manualChangeShader = function(shaderSource){

//program 1======================================================================== 
    if (shaderSource.replace("\n"," ").replace(/\s+/g, '') == `uniform mat4 u_mvp;
    uniform mat4 u_effect;
    
    attribute vec3 a_position;
    attribute vec2 a_texcoord;
    attribute vec3 a_normal;
    
    varying vec2 v_texcoord;
    varying vec3 v_normal;
    varying vec3 v_vertex;
    
    void main(void) {
      v_vertex    = a_position;
      v_normal    = vec3(u_mvp * u_effect * vec4(a_normal, 0));
      v_texcoord  = a_texcoord;
      gl_Position = u_mvp * u_effect * vec4(a_position, 1.0);
    }
    `.replace("\n"," ").replace(/\s+/g, '')){
        vetexID = 1;
        console.log("vetexID", vetexID);
        return `
        attribute vec2 coordinates;
        void main(void) {
        gl_Position =  vec4(coordinates, 0.0, 1.0);
        gl_PointSize = 1.0;
        }
        `;
    }


    if (shaderSource.replace("\n"," ").replace(/\s+/g, '') == `#ifdef GL_ES
    precision mediump float;
    #endif
    
    uniform sampler2D u_texture;
    uniform float u_opacity;
    uniform vec4  u_slice1;
    uniform vec4  u_slice2;
    uniform vec4  u_slice3;
    
    varying vec3 v_vertex;
    varying vec3 v_normal;
    varying vec2 v_texcoord;
    
    const vec3 kLightVector = vec3(0.3, 0.3, -0.9);
    const vec3 kHalfVector = vec3(0.154, 0.154, -0.974);
    
    void main(void) {
      vec4 vertex = vec4(v_vertex, 1.0);
      if (dot(vertex, u_slice1) > 0.0 &&
          dot(vertex, u_slice2) > 0.0 &&
          dot(vertex, u_slice3) > 0.0) discard;
        
      vec3 normal = normalize(v_normal);
      // half-Lambert lighting.
      float light = 0.5 + 0.5*dot(normal, kLightVector);
      float diffuse = light*u_opacity;
      // Specular with fake fresnel effect.
      float specular = max(0.0, dot(normal, kHalfVector));
      specular *= 0.7 + 0.3*normal.z;
      specular *= specular;
      specular *= u_opacity;
      vec3 fetch = texture2D(u_texture, v_texcoord).rgb;
      gl_FragData[0] = vec4(diffuse*fetch + vec3(specular), u_opacity);
    }
    `.replace("\n"," ").replace(/\s+/g, '')){
        console.log("I am in the shader A");
        return `#ifdef GL_ES
        precision mediump float;
        #endif
        void main(void) {
         
          gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
        }
        `
    }

    /* 
        uniform sampler2D u_texture;
        uniform float u_opacity;
        uniform vec4  u_slice1;
        uniform vec4  u_slice2;
        uniform vec4  u_slice3;
        
        varying vec3 v_vertex;
        varying vec3 v_normal;
        varying vec2 v_texcoord;
        
        const vec3 kLightVector = vec3(0.3, 0.3, -0.9);
        const vec3 kHalfVector = vec3(0.154, 0.154, -0.974);

         vec4 vertex = vec4(v_vertex, 1.0);
          if (dot(vertex, u_slice1) > 0.0 &&
              dot(vertex, u_slice2) > 0.0 &&
              dot(vertex, u_slice3) > 0.0) discard;
            
          vec3 normal = normalize(v_normal);
          // half-Lambert lighting.
          float light = 0.5 + 0.5*dot(normal, kLightVector);
          float diffuse = light*u_opacity;
          // Specular with fake fresnel effect.
          float specular = max(0.0, dot(normal, kHalfVector));
          specular *= 0.7 + 0.3*normal.z;
          specular *= specular;
          specular *= u_opacity;
          vec3 fetch = texture2D(u_texture, v_texcoord).rgb;
    */

//program 2======================================================================== 
    if (shaderSource.replace("\n"," ").replace(/\s+/g, '') == `uniform mat4 u_mvp;
    uniform mat4 u_effect;
    uniform float u_colorScale;
    
    attribute vec3 a_position;
    attribute vec3 a_normal;
    attribute float a_colorIndex;
    
    varying vec4 v_color;
    varying vec3 v_normal;
    varying vec3 v_vertex;
    
    void main() {
      v_vertex    = a_position;
      float scaledColor = a_colorIndex * u_colorScale;
      float redColor = floor(scaledColor / (256.0 * 256.0));
      float greenColor = floor((scaledColor - redColor * 256.0 * 256.0) / 256.0);
      float blueColor = (scaledColor - greenColor * 256.0 - redColor * 256.0 * 256.0);
      v_color = vec4(redColor / 255.0, greenColor / 255.0, blueColor / 255.0, 1);
      v_normal = vec3(u_mvp * vec4(a_normal, 0));
      gl_Position = u_mvp * u_effect * vec4(a_position, 1.0);
    }
    `.replace("\n"," ").replace(/\s+/g, '')){
        vetexID = 2;
        console.log("vetexID", vetexID);
        return `
        attribute vec2 coordinates;
        void main(void) {
        gl_Position =  vec4(coordinates, 0.0, 1.0);
        gl_PointSize = 1.0;
        }
        `;
    }




    if (shaderSource.replace("\n"," ").replace(/\s+/g, '') == `precision highp float;
    varying vec4 v_color;
    varying vec3 v_vertex;
    
    uniform vec4  u_slice1;
    uniform vec4  u_slice2;
    uniform vec4  u_slice3;
    
    void main() {
      vec4 vertex = vec4(v_vertex, 1.0);
      if (dot(vertex, u_slice1) > 0.0 &&
          dot(vertex, u_slice2) > 0.0 &&
          dot(vertex, u_slice3) > 0.0) discard;
    
      gl_FragColor = v_color;
    }
    
    `.replace("\n"," ").replace(/\s+/g, '')){
        console.log("I am in the shader B");
        return `precision highp float;    
        void main() {
          gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
        }`;
    }


 //program 3======================================================================== 
 if (shaderSource.replace("\n"," ").replace(/\s+/g, '') == `uniform mat4 u_mvp;
 attribute vec3 a_position;
 
 void main() {
   gl_Position = u_mvp * vec4(a_position, 1.0);
 }
 `.replace("\n"," ").replace(/\s+/g, '')){
     vetexID = 3;
     console.log("vetexID", vetexID);
     return `attribute vec2 coordinates;
     void main(void) {
     gl_Position =  vec4(coordinates, 0.0, 1.0);
     gl_PointSize = 1.0;
     }
     `;
 }   



    if (shaderSource.replace("\n"," ").replace(/\s+/g, '') == `#ifdef GL_ES
    precision mediump float;
    #endif
    
    uniform vec4 u_color;
    
    void main() {
      gl_FragColor = u_color;
    }
    
    `.replace("\n"," ").replace(/\s+/g, '')){
        console.log("I am in the shader C");
        return `#ifdef GL_ES
        precision mediump float;
        #endif
        
        uniform vec4 u_color;
        
        void main() {
          gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
        }`;
    }



//program 4======================================================================== 
 if (shaderSource.replace("\n"," ").replace(/\s+/g, '') == `uniform mat4 u_mvp;
 attribute vec3 a_position;
 attribute vec2 a_texcoord;
 
 varying vec2 v_texcoord;
 
 void main() {
   v_texcoord  = a_texcoord;
   gl_Position = u_mvp * vec4(a_position, 1.0);
 }
 `.replace("\n"," ").replace(/\s+/g, '')){
     vetexID = 4;
     console.log("vetexID", vetexID);
     return `
     attribute vec2 coordinates;
    void main(void) {
    gl_Position =  vec4(coordinates, 0.0, 1.0);
    gl_PointSize = 1.0;
    }
     `;
 }   




    if (shaderSource.replace("\n"," ").replace(/\s+/g, '') == `#ifdef GL_ES
    precision mediump float;
    #endif
    
    uniform sampler2D u_texture;
    uniform vec4 u_color;
    varying vec2 v_texcoord;
    
    void main() {
      vec4 fetch = texture2D(u_texture, v_texcoord);
      gl_FragColor = u_color * fetch;
    }
    
    
    `.replace("\n"," ").replace(/\s+/g, '')){
        console.log("I am in the shader D");
        return `#ifdef GL_ES
        precision mediump float;
        #endif
        void main() {
          gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
        }
        `;
    }






    console.log("什么都没有进来！！！！！！！！！！！！！！！！！！！！！！！！");
    return shaderSource;


    }



var observer = new MutationObserver(function(mutations){
if (document.getElementsByTagName("canvas")[1]!=undefined && flag == 0) {
    var gl = document.getElementsByTagName("canvas")[1].getContext("webgl");
    ProgramDataMap = [];
    ShaderDataMap = [];
    BufferDataMap = [];
    AttriDataMap = [];
    AttributeLocMap = [];
    UniformDataMap = [];
    UniformLocMap = [];

    console.log("I am in the rewrite part");

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
        // console.log("version 25"); 

        //shaderSource = manualChangeShader(shaderSource);

        console.log(shaderSource);
        gl.my_shaderSource(shaderName,shaderSource);
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
    // var t0 = performance.now();
  
    //先提取getAttribLocation能获得的glsl部分的信息
    var ShaderData = new Attribute_loc;
    ShaderData = getShaderData(positionAttributeLocation);
  
    //提取bufferdata中的信息
    var BufferData = new Buffer_data;
    BufferData = getBufferData();
 
    //在这里生成一个新的attribute条目
    // 这个版本需要考虑重复赋值这种情况
    addAttriMap(ShaderData,BufferData,size,stride/4,offset/4);
    // console.log("vertexAttribPointer", performance.now() - t0);
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
        AttriDataMap[i].uniformData = [];
        var a = [];
        // console.log("BufferData.bufferData.length",BufferData.bufferData.length);
        for (var j = 0; j * stride < BufferData.bufferData.length; j++){
          for (var k = j * stride + offset; k < j * stride + offset + size; k++){
            a.push(BufferData.bufferData[k]);
            // AttriDataMap[i].uniformData = AttriDataMap[i].uniformData.concat(BufferData.bufferData[j]);
            // console.log(i , j);
          }
        }
        // console.log("aaaaa",a);
        AttriDataMap[i].uniformData = a;
        return;
      }
    }
    newAttri.attriEleNum = size;
    for (var i = 0; i * stride < BufferData.bufferData.length; i++){
      for (var j = i * stride + offset; j < i * stride + offset + size; j++)
        newAttri.uniformData.push(BufferData.bufferData[j]);
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
    // var t0 = performance.now();
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
  
    // console.log("getUniformLocation", performance.now() - t0);
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
    if (uniformLoc != undefined){
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
  }
  
  var getUniformLoc = function(randomNumber){
    for (var i = 0; i < UniformLocMap.length; i++)
    if (randomNumber == UniformLocMap[i].randomNumber)
      return UniformLocMap[i];
  }
  
  /*---------------------------------------------------------------*/ 
  

/*^^^^^^^^^^^^^^^^^^^^^^^^uniform 部分^^^^^^^^^^^^^^^^^^^^^^^^^^^*/




/*~~~~~~~~~~~~~~~~~~~~~~~texture 部分 ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
// gl.my_createTexture = gl.__proto__.createTexture;
// gl.createBuffer = function(){
//   console.log("gl.createBuffer");
//   return gl.my_createTexture();
// }


// gl.my_bindTexture = gl.__proto__.bindTexture;
// gl.bindTexture = function(a , b){
//   console.log("gl.bindTexture");
//   gl.my_bindTexture(a,b);
// }

// gl.my_texImage2D = gl.__proto__.texImage2D;
// gl.texImage2D = function(a,b,c,d,e,f,g,h,i){
//   console.log("gl.texImage2D");
//   gl.my_texImage2D(a,b,c,d,e,f,g,h,i);

// }


//强制要求是 gl.NEAREST
gl.my_texParameteri = gl.__proto__.texParameteri;
gl.my_texParameteri = function(a , b, c){
  gl.my_texParameteri(a, b, gl.NEAREST); 
}





/*^^^^^^^^^^^^^^^^^^^^^^^^texture 部分^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^*/
var tt5;

/*~~~~~~~~~~~~~~~~~~~~~~~ draw 部分 ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
//attribute的数据将要在这里重复形成最新的数据
gl.my_drawElements = gl.__proto__.drawElements;
gl.drawElements = function(mode, count, type, offset){
  // console.log("我要开始画了");
  //tt5 = performance.now();
  // var t0 = performance.now();
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
  // console.log("ProgramDataMap",ProgramDataMap);
  // console.log("drawElements",performance.now() - t0);
  // t0 = performance.now();
  gl.drawArrays(mode, 0 , count);
  // console.log("drawarrays", performance.now() - t0);
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

var Num = 0;
var NumID = 0;
/*^^^^^^^^^^^^^^^^^^^^^^^^draw 部分^^^^^^^^^^^^^^^^^^^^^^^^^^^*/
//mode
  //gl.POINTS 0
  //gl.LINES 1
  //gl.LINE_LOOP 2
  //gl.LINE_STRIP 3
  //gl.TRIANGLES 4
  var varyingmap = [];
  gl.my_drawArrays = gl.__proto__.drawArrays;
  gl.drawArrays = function(mode, first, count){

    console.log(Num, NumID);
    var activeProgram;
    var activeProgramNum;
    activeProgram = getactiveProgram();
    activeProgramNum = getactiveProgramNum();

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
//改回来!!!!!!!!!!!!!!!!!!!
    if (ProgramDataMap[activeProgramNum].shaderJsID == 1000){
      //读取数据
      //attribute 读取
      //vec3 vec2
      //一维数据变二维数据
      var a_position = [];
      var a_texcoord = [];
      var a_normal = [];
      for (i = 0; i < ProgramDataMap[activeProgramNum].attriData.length; i++){
        if (ProgramDataMap[activeProgramNum].attriData[i].shaderName == 'a_position'){
          var number = ProgramDataMap[activeProgramNum].attriData[i].attriEleNum;
          var tem =  ProgramDataMap[activeProgramNum].attriData[i].uniformData;
          for (j = 0; j < tem.length / number; j++){
            if (number == 3)
              a_position.push( [tem[j*3], tem[j*3+1], tem[j*3+2]]);
            else
              a_position.push( [tem[j*2], tem[j*2+1]]);
          }
        }
      }

      for (i = 0; i < ProgramDataMap[activeProgramNum].attriData.length; i++){
        if (ProgramDataMap[activeProgramNum].attriData[i].shaderName == 'a_texcoord'){
          var number = ProgramDataMap[activeProgramNum].attriData[i].attriEleNum;
          var tem =  ProgramDataMap[activeProgramNum].attriData[i].uniformData;
          for (j = 0; j < tem.length / number; j++){
            if (number == 3)
              a_texcoord.push( [tem[j*3], tem[j*3+1], tem[j*3+2]]);
            else
              a_texcoord.push( [tem[j*2], tem[j*2+1]]);
          }
        }
      }

      for (i = 0; i < ProgramDataMap[activeProgramNum].attriData.length; i++){
        if (ProgramDataMap[activeProgramNum].attriData[i].shaderName == 'a_normal'){
          var number = ProgramDataMap[activeProgramNum].attriData[i].attriEleNum;
          var tem =  ProgramDataMap[activeProgramNum].attriData[i].uniformData;
          for (j = 0; j < tem.length / number; j++){
            if (number == 3)
              a_normal.push( [tem[j*3], tem[j*3+1], tem[j*3+2]]);
            else
              a_normal.push( [tem[j*2], tem[j*2+1]]);
          }
        }
      }    

      //uniform 读取
      var u_mvp = [];
      var u_effect = [];
      for (var i in ProgramDataMap[activeProgramNum].uniformData){
        if (ProgramDataMap[activeProgramNum].uniformData[i].shaderName == 'u_mvp') 
          u_mvp = ProgramDataMap[activeProgramNum].uniformData[i].uniformData;
        if (ProgramDataMap[activeProgramNum].uniformData[i].shaderName == 'u_effect')
          u_effect = ProgramDataMap[activeProgramNum].uniformData[i].uniformData;
      }

      //vertex shader 运行
      var v_texcoord = [];
      var gl_Position = [];
      var v_normal = [];
      var v_vertex = [];
      var Mt = [];
      Mt = my_multiple( u_mvp, u_effect );
      var tt = [];
      v_texcoord = a_texcoord;
      v_vertex = a_position;
      for (var bigI = 0,  ll = ProgramDataMap[activeProgramNum].attriData[0].uniformData.length / 3 ;bigI <  ll; ++bigI ) { 
        tt = my_multiple( Mt, new Float32Array([a_normal[bigI][0], a_normal[bigI][1], a_normal[bigI][2], 0]));
        v_normal[bigI] = [tt[0],tt[1],tt[2]];
        gl_Position[bigI] = my_multiple( Mt, new Float32Array([a_position[bigI][0], a_position[bigI][1], a_position[bigI][2], 1] ));
      }

       //放进varying数据
       var newData1 = new Varying_data;
       newData1.shaderName = "tri_point";
       newData1.varyEleNum = 3;
       newData1.uniformData = handle_gl_Position(gl_Position);
       ProgramDataMap[activeProgramNum].varyingData.push(newData1);
 
     
       var t0 = performance.now();
       var newData2 = new Varying_data;
       newData2.shaderName = "text_point";
       newData2.varyEleNum = 2;
       newData2.uniformData = v_texcoord.map(x => x.map(y => Math.floor(y * 1000)))
       ProgramDataMap[activeProgramNum].varyingData.push(newData2);
  
       var newData3 = new Varying_data;
       newData3.shaderName = "nor_point";
       newData3.varyEleNum = 3;
       newData3.uniformData = v_normal.map(x => x.map(y => Math.floor(y * 1000)))
           ProgramDataMap[activeProgramNum].varyingData.push(newData3);
 
       var newData4 = new Varying_data;
       newData4.shaderName = "vPosition";
       newData4.varyEleNum = 3;
       newData4.uniformData = v_vertex.map(x => x.map(y => Math.floor(y * 1000)))
       ProgramDataMap[activeProgramNum].varyingData.push(newData4);


        //判断是否是正面
      var t0 = performance.now();
      var index_num = ProgramDataMap[activeProgramNum].varyingData[0].uniformData.length;
      var x0, y0, x1, y1, z1, x2, y2, z2, x3,  y3, z3;
      var tem_varying = []; //创建临时的varying二维数组去储存所有的数据
      for(j = 0; j < ProgramDataMap[activeProgramNum].varyingData.length; j++)
        tem_varying.push([]);
      var tem_uniformData = ProgramDataMap[activeProgramNum].varyingData[0].uniformData;
      for (var i = 0; i < index_num; i += 3){
        x1 = tem_uniformData[i][0];
        y1 = tem_uniformData[i][1];
        z1 = tem_uniformData[i][2];
        x2 = tem_uniformData[i + 1][0];
        y2 = tem_uniformData[i + 1][1];
        z2 = tem_uniformData[i + 1][2];
        x3 = tem_uniformData[i + 2][0];
        y3 = tem_uniformData[i + 2][1];
        z3 = tem_uniformData[i + 2][2];
        if (((x2 - x1)*(y3 - y1) - (x3 - x1)*(y2 - y1)) > 0.0){
        var t_length = ProgramDataMap[activeProgramNum].varyingData.length;
        var t_varyingData = ProgramDataMap[activeProgramNum].varyingData;
          for(j = 0; j < t_length; j++){
            for (k = 0; k < 3; k++)
            tem_varying[j].push(t_varyingData[j].uniformData[i + k]);
          }
        }
      }
      for (var idx in tem_varying)
        tem_varying[idx] = math.flatten(tem_varying[idx]);


      
      devide_draw(0, 255, tem_varying, gl);




    }//end ID = 1

     //数据清除
     ProgramDataMap[activeProgramNum].attriData = [];
     ProgramDataMap[activeProgramNum].uniformData = [];
     ProgramDataMap[activeProgramNum].varyingData = [];
 

  }//drawarray





    /*-------------------------draw array--------------------------------------*/
  
    // var uniform_number  = 75;
    var uniform_number  = 0;
  
    function devide_draw(left, right, tem_varying, gl){
      console.log("version 1");
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
        // console.log("left",left, "right", mid);
    
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
        // console.log("left",mid, "right", right);
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
    
  





    flag = 1;
}
})

observer.observe(document.documentElement, {
                  subtree: true,
                 childList: true
                 })


