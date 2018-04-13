var SimpleLightTest = function(vertices, indices, texCoords, normals, texture) {
  this.vertices = vertices;
  this.indices = indices;
  this.texCoords = texCoords;
  this.texture = texture;
  this.normals = normals;
  this.canvas = null;
  this.cb = null;
  this.level = null;
  this.numChildren = 1;
  this.children = [];
  this.IDs = sender.getIDs(this.numChildren);

  this.numChildrenRun = 0;
  this.childComplete = function() {
    if (++this.numChildrenRun == this.numChildren) {
      this.cb(this.level);
    } else {
      var index = this.numChildrenRun;
      this.children[index].begin(this.canvas);
    }
  };

  this.numChildrenLoaded = 0;
  this.childLoaded = function() {
    if (++this.numChildrenLoaded == this.numChildren) {
      var index = this.numChildrenRun;
      this.children[index].begin(this.canvas);
    }
  };

  var RunSimpleLight = function(vertexShaderText, fragmentShaderText,
                                childNumber, parent) {
    this.begin = function(canvas) {
      var gl = getGL(canvas);
      var WebGL = true;

      __ColorFlag = 1;  // 0代表不需要颜色，1代表需要颜色。
      __Mworld_flag = 1;
      __Mview_flag = 1;
      __Mpro_flag = 1;
      __Drawnumber = 1

      gl.clearColor(0.0, 0.0, 0.0, 0.0);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      gl.enable(gl.DEPTH_TEST);
      gl.enable(gl.CULL_FACE);
      gl.frontFace(gl.CCW);
      gl.cullFace(gl.BACK);

      //
      // Create shaders
      //
      var vertexShader = gl.createShader(gl.VERTEX_SHADER);
      var vertexShader1 = gl.createShader(gl.VERTEX_SHADER);

      console.log("gl.VERTEX_SHADER",gl.VERTEX_SHADER);
      console.log("gl.FRAGMENT_SHADER",gl.FRAGMENT_SHADER);
      if (vertexShader == vertexShader1){
        console.log("gl.createShader(gl.VERTEX_SHADER)创建的值是一样的");
      }else{
        console.log("gl.createShader(gl.VERTEX_SHADER)创建的值是不一样的");
      }
      //可以把gl.createShader的返回值当作shader的标志

      var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

      gl.shaderSource(vertexShader, vertexShaderText);
      gl.shaderSource(fragmentShader, fragmentShaderText);
      //vertexShader的值是固定的
      console.log("vertexShader", vertexShader);
      console.log("vertexShaderText", vertexShaderText);
      //fragmentShader的值是固定的
      console.log("fragmentShader",fragmentShader);
      console.log("fragmentShaderText",fragmentShaderText);

      gl.compileShader(vertexShader);
      if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
        console.error('ERROR compiling vertex shader!',
                      gl.getShaderInfoLog(vertexShader));
        return;
      }

      gl.compileShader(fragmentShader);
      if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
        console.error('ERROR compiling fragment shader!',
                      gl.getShaderInfoLog(fragmentShader));
        return;
      }


      //测试一下所有的shader的精度情况
      /*
      console.log(gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.LOW_FLOAT));
      console.log(gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.MEDIUM_FLOAT));
      console.log(gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.HIGH_FLOAT));
      console.log(gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.LOW_INT));
      console.log(gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.MEDIUM_INT));
      console.log(gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.HIGH_INT));

      console.log(gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.LOW_FLOAT));
      console.log(gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.MEDIUM_FLOAT));
      console.log(gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.HIGH_FLOAT));
      console.log(gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.LOW_INT));
      console.log(gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.MEDIUM_INT));
      console.log(gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.HIGH_INT));
      */

  

  var test1 = new Attri_data();
  test1.bufferData = [1,2,3];
  var test2 = new Attri_data();
  console.log("dsaasfdfdsfdsfdsfdsfdsfdsfdsfdsfdsfd",test1.bufferData);
  var map = [];
  map.push(test1);
  map.push(test2);
  console.log(map.length);


      var program = gl.createProgram();
      gl.attachShader(program, vertexShader);
      gl.attachShader(program, fragmentShader);
      gl.linkProgram(program);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error('ERROR linking program!', gl.getProgramInfoLog(program));
        return;
      }
      gl.validateProgram(program);
      if (!gl.getProgramParameter(program, gl.VALIDATE_STATUS)) {
        console.error('ERROR validating program!',
                      gl.getProgramInfoLog(program));
        return;
      }

      //
      // Create buffer
      //
      var vertices = parent.vertices;
      var indices = parent.indices;
      var texCoords = parent.texCoords;
      var normals = parent.normals;

      var susanPosVertexBufferObject = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, susanPosVertexBufferObject);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices),
                    gl.STATIC_DRAW);
      //console.log("vertices",vertices);
      //console.log("BufferDataMap","1",BufferDataMap);

      var susanTexCoordVertexBufferObject = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, susanTexCoordVertexBufferObject);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texCoords),
                    gl.STATIC_DRAW);
      //console.log("texCoords",texCoords);
      //console.log("BufferDataMap","2",BufferDataMap);

      var susanIndexBufferObject = gl.createBuffer();
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, susanIndexBufferObject);
      gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices),
                    gl.STATIC_DRAW);
      //console.log("indices",indices);
      //console.log("BufferDataMap","3",BufferDataMap);

      var susanNormalBufferObject = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, susanNormalBufferObject);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);
      //console.log("normals",normals);
      //console.log("BufferDataMap","4",BufferDataMap);



      //console.log("gl.ARRAY_BUFFER", gl.ARRAY_BUFFER);
      //console.log("gl.ELEMENT_ARRAY_BUFFER", gl.ELEMENT_ARRAY_BUFFER);

      gl.bindBuffer(gl.ARRAY_BUFFER, susanPosVertexBufferObject);
      //console.log("BufferDataMap","5",BufferDataMap);
      var positionAttribLocation =
          gl.getAttribLocation(program, 'vertPosition');
      //console.log("***********************************************************************************");
      console.log("positionAttribLocation",positionAttribLocation);
      gl.vertexAttribPointer(
          positionAttribLocation, // Attribute location
          3,                      // Number of elements per attribute
          gl.FLOAT,               // Type of elements
          gl.FALSE,
          3 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
          0 // Offset from the beginning of a single vertex to this attribute
          );
      gl.enableVertexAttribArray(positionAttribLocation);
      

    
      gl.bindBuffer(gl.ARRAY_BUFFER, susanTexCoordVertexBufferObject);
      //console.log("BufferDataMap","6",BufferDataMap);
      var texCoordAttribLocation =
          gl.getAttribLocation(program, 'vertTexCoord');
      console.log("texCoordAttribLocation",texCoordAttribLocation);
      gl.vertexAttribPointer(
          texCoordAttribLocation, // Attribute location
          2,                      // Number of elements per attribute
          gl.FLOAT,               // Type of elements
          gl.FALSE,
          2 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
          0);
      gl.enableVertexAttribArray(texCoordAttribLocation);

      gl.bindBuffer(gl.ARRAY_BUFFER, susanNormalBufferObject);
      //console.log("BufferDataMap","7",BufferDataMap);
      var normalAttribLocation = gl.getAttribLocation(program, 'vertNormal');
      console.log("normalAttribLocation",normalAttribLocation);
      gl.vertexAttribPointer(normalAttribLocation, 3, gl.FLOAT, gl.TRUE,
                             3 * Float32Array.BYTES_PER_ELEMENT, 0);
      gl.enableVertexAttribArray(normalAttribLocation);

      //
      // Create texture
      //
      var tex = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE,
                    parent.texture);
      gl.bindTexture(gl.TEXTURE_2D, null);

      // Tell OpenGL state machine which program should be active.
      gl.useProgram(program);

      var matWorldUniformLocation = gl.getUniformLocation(program, 'mWorld');
      var matViewUniformLocation = gl.getUniformLocation(program, 'mView');
      var matProjUniformLocation = gl.getUniformLocation(program, 'mProj');

      var worldMatrix = new Float32Array(16);
      var viewMatrix = new Float32Array(16);
      var projMatrix = new Float32Array(16);
      mat4.identity(worldMatrix);
      // mat4.lookAt(viewMatrix, [0, 0, -8], [0, 0, 0], [0, 1, 0]);

      mat4.lookAt(viewMatrix, [ 0, 0, -7 ], [ 0, 0, 0 ], [ 0, 1, 0 ]);

      mat4.perspective(projMatrix, glMatrix.toRadian(45),
                       canvas.width / canvas.height, 0.1, 1000.0);

      mat4.copy(__Mview,viewMatrix);
      mat4.copy(__Matrix0,projMatrix);
      mat4.identity(worldMatrix);
      mat4.identity(viewMatrix);
      mat4.identity(projMatrix);
      console.log("^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^");
		  console.log("worldMatrix",worldMatrix);
      gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldMatrix);

      gl.uniformMatrix4fv(matViewUniformLocation, gl.FALSE, viewMatrix);
      gl.uniformMatrix4fv(matProjUniformLocation, gl.FALSE, projMatrix);

      var xRotationMatrix = new Float32Array(16);
      var yRotationMatrix = new Float32Array(16);

      //
      // Lighting information
      //
      gl.useProgram(program);

      var ambientUniformLocation =
          gl.getUniformLocation(program, 'ambientLightIntensity');
      var sunlightDirUniformLocation =
          gl.getUniformLocation(program, 'sun.direction');
      var sunlightIntUniformLocation =
          gl.getUniformLocation(program, 'sun.color');

  
      gl.uniform3i(ambientUniformLocation, 30, 30, 30);
      gl.uniform3i(sunlightDirUniformLocation, 300, 400, -200);
      gl.uniform3i(sunlightIntUniformLocation, 200, 200, 200);

      //
      // Main render loop
      //
      var angle = 0;
      var count = 49;
      var identityMatrix = new Float32Array(16);
      mat4.identity(identityMatrix);
      gl.enable(gl.DEPTH_TEST);
      var loop = function() {
        var frame = requestAnimationFrame(loop);
        angle = count++ / 20;
        mat4.rotate(yRotationMatrix, identityMatrix, angle, [ 0, 1, 0 ]);
        mat4.rotate(xRotationMatrix, identityMatrix, angle / 4, [ 1, 0, 0 ]);
        mat4.mul(worldMatrix, yRotationMatrix, xRotationMatrix);
        gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldMatrix);
        console.log("worldMatrix",worldMatrix);
        console.log("***********************************************");
        console.log("UniformDataMap",UniformDataMap);
        console.log("UniformLocMap", UniformLocMap);
        mat4.copy(__Mworld_fs, worldMatrix);
        mat4.copy(__Mworld, worldMatrix);
        mat4.transpose(__Mworld, __Mworld);
        mat4.transpose(__Mview, __Mview);
        mat4.transpose(__Matrix0, __Matrix0);
        mat4.mul(__Mview, __Mview, __Matrix0);
        mat4.mul(__Mworld, __Mworld, __Mview);

        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);

        gl.bindTexture(gl.TEXTURE_2D, tex);
        gl.activeTexture(gl.TEXTURE0);



        //检验一下数据收集情况
        console.log("检验一下数据收集情况");
        console.log("AttriDataMap",AttriDataMap);
        console.log("UniformDataMap",UniformDataMap);
        //暂时暂停一下
        //AAA(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);
        //这个还原到原函数，drawElements和drawArrays 
        console.log("indices.length",indices.length);
        console.log("indices", indices);
        //gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);


        if (count == 50) {
          dataURL = canvas.toDataURL('image/png', 1.0);
          console.log("light test result:", calcSHA1(dataURL));
          cancelAnimationFrame(frame);
          sender.getData(gl, parent.IDs[childNumber]);
          parent.childComplete();
        }
      };
      requestAnimationFrame(loop);
    };
  };

  this.begin = function(canvas, cb, level) {
    this.canvas = canvas;
    this.cb = cb;
    this.level = level;
    var root = './simpleLight/'
    loadTextResource(root + 'shader.vs.glsl', function(vsErr, vsText, self) {
      if (vsErr) {
        alert('Fatal error getting vertex shader (see console)');
        console.error(vsErr);
      } else {
        loadTextResource(
            root + 'shader.fs.glsl', function(fsErr, fsText, self) {
              if (fsErr) {
                alert('Fatal error getting fragment shader (see console)');
                console.error(fsErr);
              } else {
                self.children.push(new RunSimpleLight(vsText, fsText, 0, self));
                self.childLoaded();
              }
            }, self);
      }
    }, this);

  };
};
