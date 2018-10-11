//一直不终止
//如何修改成Transferable objects
while(1){
    self.addEventListener('message', function(VaryingDataMap) {
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
        if ((vetexID == 3) ){
            function main () {
              for (var bigI = 0;bigI < ProgramDataMap[activeProgramNum].attriData[0].uniformData.length / 3;++ bigI) { 
              fragTexCoord[bigI] = vertTexCoord[bigI];
              gl_Position[bigI] = my_multiple( my_multiple( my_multiple( mProj, mView ), mWorld ), new Float32Array([vertPosition[bigI][0], vertPosition[bigI][1], vertPosition[bigI][2], 1] ));
            }
            };
              
      
            }else{
            function main () {
              for (var bigI = 0;bigI < ProgramDataMap[activeProgramNum].attriData[0].uniformData.length / 3;++ bigI) { 
              vPosition[bigI] = my_multiple( mView, new Float32Array([vertPosition[bigI][0], vertPosition[bigI][1], vertPosition[bigI][2], 1]) );
              fragTexCoord[bigI] = vertTexCoord[bigI];
              fragNormal[bigI] = [0, 1, 2].map(x => (my_multiple( mWorld, new Float32Array([vertNormal[bigI][0], vertNormal[bigI][1], vertNormal[bigI][2], 0]) ))[x]);
              gl_Position[bigI] = my_multiple( my_multiple( my_multiple( mProj, mView ), mWorld ), new Float32Array([vertPosition[bigI][0], vertPosition[bigI][1], vertPosition[bigI][2], 1] ));
              }
              };
            }
        //   var t0 = performance.now();
          main();
          // console.log(map1.size, map2.size);
        //   var t1 = performance.now();
        //   console.log('main', t1 - t0);
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
        for (i in VaryingDataMap){
            var string = "VaryingDataMap[" + i.toString() + "].uniformData = " + VaryingDataMap[i].shaderName + ";";
            //eval(string);
          }
      
          var t1 = performance.now();
          console.log('输出接口', t1 - t0);      
          var t0 = performance.now();
        
          var newData1 = new Varying_data;
        newData1.shaderName = "tri_point";
        newData1.varyEleNum = 3;
        newData1.uniformData = handle_gl_Position(gl_Position);
        ProgramDataMap[activeProgramNum].varyingData.push(newData1);
        var t1 = performance.now();
        // console.log('handle gl Position', t1 - t0);
      
        var t0 = performance.now();
        var newData2 = new Varying_data;
        newData2.shaderName = "text_point";
        
        newData2.varyEleNum = 2;
        newData2.uniformData = fragTexCoord.map(x => x.map(y => Math.floor(y * 1000)))
        ProgramDataMap[activeProgramNum].varyingData.push(newData2);
        var t1 = performance.now();
        // console.log('handle fragtex', t1 - t0);
    
    
        var newData3 = new Varying_data;
        newData3.shaderName = "nor_point";
        newData3.varyEleNum = 3;
        // fragNormal = math.flatten(fragNormal);
        // console.log(fragNormal);
        newData3.uniformData = fragNormal.map(x => x.map(y => Math.floor(y * 1000)))
            ProgramDataMap[activeProgramNum].varyingData.push(newData3);
      
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
            // console.log('remove points', t1 - t0);
          
    

        
        self.postMessage(tem_varying,[tem_varying]);
      }, false);

}



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
      // var t0 = performance.now();
      var Compiler = GLSL();
      //console.log("testShader",testShader);
      compiled = Compiler.compile(testShader);
      // console.log("shader",testShader);
      // console.log("compiled",compiled);
  
      // var t1 = performance.now();
      // console.log('compile', t1 - t0);

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
    // var t0 = performance.now();
    elementArray = getElementArray(count,offset);
    // var t1 = performance.now();
    // console.log('prepare for drawarrays', t1 - t0);
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