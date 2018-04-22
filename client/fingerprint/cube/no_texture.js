
var image_id = 0;
var serverConnector = new ServerConnector('123', 2);
var vertCode =
'attribute vec2 vertPosition;' +
'void main(void) {' +
'gl_Position =  vec4(vertPosition, 0.0, 1.0);'+
   'gl_PointSize = 1.0;'+
'}';

var fragCod1e =
'precision mediump float;' +
'float grid(float size);'+
'float judge(float xx0, float yy0, float xx1, float yy1, float xx2, float yy2, float xx3, float yy3);'+
'float PinAB(float tx0, float ty0, float tx1, float ty1, float tx2, float ty2);'+
'float round(float x);'+
'uniform vec3 tri_point[100];' +
'uniform vec3 tri_color[100];' +
'void main(void) {' +
   'float x0, y0, x1, y1, z1, x2, y2, z2, x3,  y3, z3, r1, g1, b1, r2, g2, b2, r3, g3, b3 , z, r ,g , b;'+
   'x0 = gl_FragCoord.x * 1.0; y0 = gl_FragCoord.y * 1.0; z = -2.0;'+
   'gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);'+
   'for (int i = 0 ; i < 36; i += 3){'+
      'x1 = tri_point[i][0];   y1 = tri_point[i][1];   z1 = tri_point[i][2];'+
      'x2 = tri_point[i+1][0]; y2 = tri_point[i+1][1]; z2 = tri_point[i+1][2];'+
      'x3 = tri_point[i+2][0]; y3 = tri_point[i+2][1]; z3 = tri_point[i+2][2];'+
      'r1 = tri_color[i][0];   g1 = tri_color[i][1];   b1 = tri_color[i][2];'+
      'r2 = tri_color[i+1][0]; g2 = tri_color[i+1][1]; b2 = tri_color[i+1][2];'+
      'r3 = tri_color[i+2][0]; g3 = tri_color[i+2][1]; b3 = tri_color[i+2][2];'+
      'if (judge(x0, y0, x1, y1, x2, y2, x3, y3) > 0.9) {'+
          'float dis_1, dis_2, dis_3, dis_mun, wei_1, wei_2, wei_3;'+
          'float A, B, C , D , K;'+
          'A = (y3 - y1)*(z3 - z1) - (z2 -z1)*(y3 - y1);'+
          'B = (x3 - x1)*(z2 - z1) - (x2 - x1)*(z3 - z1);'+
          'C = (x2 - x1)*(y3 - y1) - (x3 - x1)*(y2 - y1);'+
          'D = -1.0 * (A * x1 + B * y1 + C * z1);'+
          'K = -1.0 * (A * x0 + B * y0 + D) / C;'+
          'wei_1 = round((x0*y2 + x2*y3 + x3*y0 - x3*y2 - x2*y0- x0*y3)/(x1*y2 + x2*y3 + x3*y1 - x3*y2 - x2*y1 - x1*y3) * 1000.0);'+
          'wei_2 = round((x1*y0 + x0*y3 + x3*y1 - x3*y0 - x0*y1- x1*y3)/(x1*y2 + x2*y3 + x3*y1 - x3*y2 - x2*y1 - x1*y3) * 1000.0);'+
          'wei_3 = round((x1*y2 + x2*y0 + x0*y1 - x0*y2 - x2*y1- x1*y0)/(x1*y2 + x2*y3 + x3*y1 - x3*y2 - x2*y1 - x1*y3) * 1000.0);'+
          'if ((C > 0.0) && (K <= 2.0) && (K >= -2.0) && (K > z)){'+
              'z = K;'+
              'r = floor ((floor(wei_1) * r1 + floor(wei_2) * r2 + floor(wei_3) * r3)/1000.0 * 255.0 + 0.1) / 255.0 ; '+
              'g = floor ((floor(wei_1) * g1 + floor(wei_2) * g2 + floor(wei_3) * g3)/1000.0 * 255.0 + 0.1) / 255.0 ; '+
              'b = floor ((floor(wei_1) * b1 + floor(wei_2) * b2 + floor(wei_3) * b3)/1000.0 * 255.0 + 0.1) / 255.0 ; '+
              'gl_FragColor = vec4(r, g , b, 1.0);'+
          '}'+
      '}'+
   '}'+
'}' +
'float grid(float size) {return 1.0;}'+
'float judge(float xx0, float yy0, float xx1, float yy1, float xx2, float yy2, float xx3, float yy3) {'+
    'if ( PinAB(xx0 - xx1, yy0 -yy1, xx2 - xx1, yy2 - yy1, xx3 - xx1, yy3 - yy1)+ PinAB(xx0 - xx2, yy0 -yy2, xx3 - xx2, yy3 - yy2, xx1 - xx2, yy1 - yy2) + PinAB(xx0 - xx3, yy0 -yy3, xx2 - xx3, yy2 - yy3, xx1 - xx3, yy1 - yy3) > 2.5){return 1.0;}else{return 0.0;}'+
'}'+
'float round(float x) {'+
    'if (x - floor(x) > 0.499){return (floor(x) + 0.6) ;}else{return (floor(x) + 0.1);}'+
'}'+
'float PinAB(float tx0, float ty0, float tx1, float ty1, float tx2, float ty2){ '+
'float kb, kc; kb = tx0*ty1 - tx1*ty0; kc = tx0*ty2 - tx2*ty0;if  ( ((0.0001 > kb) && (-0.0001 < kc)) || ((-0.0001 < kb) && (0.0001 > kc)) ) {return 1.0;} return 0.0; '+

'}'
;

//'gl_FragColor = vec4(wei_1 * r1 + wei_2 * r2 + wei_3 * r3, wei_1 * g1 + wei_2 * g2 + wei_3 * g3, wei_1 * b1 + wei_2 * b2 + wei_3 * b3, 1.0);'+
var CubeTest = function(type) {
	var ID = sender.getID();
  this.begin = function(canvas, cb, level) {
    var gl;
    if (type == 'normal') gl = getGL(canvas);
    else {
        canvas = getCanvas("can_aa");
        gl = getGLAA(canvas);
    }
    // __texture_flag = 0;
    // __My_index_flag = 0;  
    // __PointBuffer = [];
    // __ColorBuffer = [];
    // __Tem_pointbuffer = [];
    // __Tem_colorbuffer = [];
    // __ActiveBuffer_vertex = [];
    // __ActiveBuffer_frag = [];
    // __ColorFlag = 1;  // 0代表不需要颜色，1代表需要颜色。
    // __Mworld_flag = 1;
    // __Mview_flag = 1;
    // __Mpro_flag = 1;
    // __Drawnumber = 1

    vetexID = 1;

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.CULL_FACE);
    gl.frontFace(gl.CCW);
    gl.cullFace(gl.BACK);

    //
    // Create shaders
    //
    var vertexShader = gl.createShader(gl.VERTEX_SHADER);
    var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

    gl.shaderSource(vertexShader, vertCode);
    gl.shaderSource(fragmentShader, fragCod1e);

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
      console.error('ERROR validating program!', gl.getProgramInfoLog(program));
      return;
    }

    //
    // Create buffer
    //
   
    var boxVertices = [
      // X, Y, Z           R, G, B
      // Top
      -1.0, 1.0, -1.0,   0.1, 0.1, 0.1,
      -1.0, 1.0, 1.0,    0.8, 0.5, 0.3,
      1.0, 1.0, 1.0,     0.2, 0.4, 0.7,
      1.0, 1.0, -1.0,    0.1, 1.0, 0.6,

      // Left
      -1.0,1.0,1.0,      0.75,0.25,0.5,
      -1.0,-1.0,1.0,     0.1,0.25,0.85,
      -1.0,-1.0,-1.0,    0.9,0.12,0.53,
      -1.0,1.0,-1.0,     0.3,0.4, 0.7,

      // Right
      1.0,1.0,1.0,       1.0,0.25,0.2,
      1.0,-1.0,1.0,      0.52,0.24,0.75,
      1.0,-1.0,-1.0,     0.1,0.26,0.75,
      1.0,1.0,-1.0,      0.9,0.95,0.75,

      // Front
      1.0,1.0,1.0,       0.4,0.0,0.7,
      1.0,-1.0,1.0,      0.98,0.0,0.54,
      -1.0,-1.0,1.0,     1.0,5.3,0.34,
      -1.0,1.0,1.0,      0.2,0.5,0.9,

      // Back
      1.0,1.0,-1.0,      0.34,0.3,0.34,
      1.0,-1.0,-1.0,     0.78,0.76,0.56,
      -1.0,-1.0,-1.0,    0.3,1.0,0.67,
      -1.0,1.0,-1.0,     0.1,1.0,0.2,

      // Bottom
      -1.0,-1.0,-1.0,    0.5,0.8,0.8,
      -1.0,-1.0,1.0,     0.3,0.7,0.1,
      1.0,-1.0,1.0,      0.6,0.6,0.5,
      1.0,-1.0,-1.0,     0.8,0.4,0.2,
    ];


    var boxIndices = [
      // Top
      0, 1, 2, 0, 2, 3,

      // Left
      5, 4, 6, 6, 4, 7,

      // Right
      8, 9, 10, 8, 10, 11,

      // Front
      13, 12, 14, 15, 14, 12,

      // Back
      16, 17, 18, 16, 18, 19,

      // Bottom
      21, 20, 22, 22, 20, 23
    ];

    var boxVertexBufferObject = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, boxVertexBufferObject);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(boxVertices), gl.STATIC_DRAW);

    var boxIndexBufferObject = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, boxIndexBufferObject);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(boxIndices),
                  gl.STATIC_DRAW);

    var positionAttribLocation = gl.getAttribLocation(program, 'vertPosition');
    var colorAttribLocation = gl.getAttribLocation(program, 'vertColor');
    gl.vertexAttribPointer(
        positionAttribLocation, // Attribute location
        3,                      // Number of elements per attribute
        gl.FLOAT,               // Type of elements
        gl.FALSE,
        6 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
        0 // Offset from the beginning of a single vertex to this attribute
        );
    gl.vertexAttribPointer(
        colorAttribLocation, // Attribute location
        3,                   // Number of elements per attribute
        gl.FLOAT,            // Type of elements
        gl.FALSE,
        6 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
        3 * Float32Array.BYTES_PER_ELEMENT  // Offset from the beginning of a
                                            // single vertex to this attribute
        );

    gl.enableVertexAttribArray(positionAttribLocation);
    gl.enableVertexAttribArray(colorAttribLocation);

    // Tell OpenGL state machine which program should be active.
    gl.useProgram(program);

    var matWorldUniformLocation = gl.getUniformLocation(program, 'mWorld');
    var matViewUniformLocation = gl.getUniformLocation(program, 'mView');
    var matProjUniformLocation = gl.getUniformLocation(program, 'mProj');

    var worldMatrix = new Float32Array(16);
    var viewMatrix = new Float32Array(16);
    var projMatrix = new Float32Array(16);
    mat4.identity(worldMatrix);
    mat4.lookAt(viewMatrix, [ 0, 0, -5 ], [ 0, 0, 0 ], [ 0, 1, 0 ]);
    mat4.perspective(projMatrix, glMatrix.toRadian(45),
                     canvas.width / canvas.height, 0.1, 1000.0);
    //mat4.transpose(viewMatrix, viewMatrix);
    //mat4.transpose(projMatrix, projMatrix);
    // mat4.copy(__Mworld, worldMatrix);
    // mat4.copy(__Mview,viewMatrix);
    // mat4.copy(__Matrix0,projMatrix);
    // mat4.identity(worldMatrix);
    // mat4.identity(viewMatrix);
    // mat4.identity(projMatrix);
    //console.log("worldMatrix", worldMatrix);
    //console.log("viewMatrix", viewMatrix);
    //console.log("projMatrix", projMatrix);
    gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldMatrix);
    gl.uniformMatrix4fv(matViewUniformLocation, gl.FALSE, viewMatrix);
    gl.uniformMatrix4fv(matProjUniformLocation, gl.FALSE, projMatrix);

    var xRotationMatrix = new Float32Array(16);
    var yRotationMatrix = new Float32Array(16);

    //
    // Main render loop
    //
    var angle = 0;
    var count = 0;
    var ven, ren;
    var identityMatrix = new Float32Array(16);
    mat4.identity(identityMatrix);

    var count = 19;
    var angle = 0;
    var loop = function() {
      var frame = requestAnimationFrame(loop);
      angle = count++ / 20;
      mat4.rotate(yRotationMatrix, identityMatrix, angle, [ 0, 1, 0 ]);
      mat4.rotate(xRotationMatrix, identityMatrix, angle / 4, [ 1, 0, 0 ]);
      mat4.mul(worldMatrix, yRotationMatrix, xRotationMatrix);
      // mat4.copy(__Mworld, worldMatrix);
      // mat4.transpose(__Mworld, __Mworld);
      // mat4.transpose(__Mview, __Mview);
      // mat4.transpose(__Matrix0, __Matrix0);
      // mat4.mul(__Mview, __Mview, __Matrix0);
      //console.log("第一次计算", __Mview);
      // mat4.mul(__Mworld, __Mworld, __Mview);
      //console.log("传入的矩阵", __Mworld);
      /*
      console.log("第二次计算", __Mworld);
      mat4.copy(worldMatrix, __Mworld);
      console.log("转置之前", __Mworld);     
      mat4.transpose(worldMatrix, worldMatrix);
      mat4.identity(worldMatrix);
      console.log("最终结果", worldMatrix);
      */
      gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldMatrix);
      // __Matrix1 = my_m4.projection(gl.canvas.clientWidth, gl.canvas.clientHeight, 256);
      //console.log("__Mworld", __Mworld);
      //console.log("__Mview", __Mview);
      //console.log("__Matrix0", __Matrix0);


      //console.log("aaaaaaaaaaaa");
      //    gl.clearColor(1.0, 1.0, 1.0, 1.0);
      gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);
      gl.drawElements(gl.TRIANGLES, boxIndices.length, gl.UNSIGNED_SHORT, 0);
      if (count == 20) {
        dataURL = canvas.toDataURL('image/png', 1.0);
        console.log("cube test result:", calcSHA1(dataURL));
        //console.log(dataURL);
        //window.open(dataURL);
        serverConnector.updatePicture(ID, dataURL);
        cancelAnimationFrame(frame);
        cb(level);
      }
      
    };
    requestAnimationFrame(loop);
  };
};


