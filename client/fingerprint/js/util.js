// Load a text resource from a file over the network
var __My_buffer;
var __My_index;
var __My_index_flag = 0;  // 0 代表没有index，1代表有index。
var __VertexPositionAttributeLocation1;
var __VertexPositionAttributeLocation2;
var __VertexSize;
var __VertexType;
var __VertexNomalize;
var __VertexStride;
var __VertexOffset;
var __PointBuffer = [];
var __ColorBuffer = [];
var __Tem_pointbuffer = [];
var __Tem_colorbuffer = [];
var __ActiveBuffer_vertex = [];
var __ActiveBuffer_frag = [];
var __ColorFlag = 0;  // 0代表不需要颜色，1代表需要颜色。
var Point_Number;

//my_glbufferData = gl.bufferData;
/*
tem_func = canvas.getContext;
canvas.getContext = function(a, b, c, d, e){
  console.log("a", a ,"b", b ,"c", c ,"d", d ,"e", e);
  var tem = canvas.getContext(a,b,c,d,e);
  return (tem);
}
*/
getCanvas = function(canvasName) {
  var canvas = $('#' + canvasName);
  if(!canvas[0]){
      $('#test_canvases').append("<canvas id='" + canvasName + "' width='256' height='256'></canvas>");
  }
  return canvas = $('#' + canvasName)[0];
}

rewrite = function(gl){
  //gl.my_glbufferData = gl.__propo__.bufferData;  (console TypeError: Cannot read property 'bufferData' of undefined)
  gl.my_glbufferData = gl.bufferData;
  gl.bufferData = function (a, b, c){
   if (a == gl.ELEMENT_ARRAY_BUFFER){
     __My_index = b;
     __My_index_flag = 1;
   }
   else{
     __My_buffer = b;
     this.my_glbufferData(a, b, c);
   console.log(b);
   //console.log("__My_buffer",__My_buffer);
   }
  } 
  return gl;
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
      /*  
    function my_gl(canvas, i){

        my_glbufferData = this.bufferData;
        this.bufferData = function (a, b, c){
        if (a == gl.ELEMENT_ARRAY_BUFFER){
          console.log("b",b);
          __My_index = b;
          __My_index_flag = 1;
        }
        else{
          __My_buffer = b;
          my_glbufferData(a, b, c);
        //console.log(b);
        //console.log("__My_buffer",__My_buffer);
        }
        } 



        return canvas.getContext(
        [ "webgl", "experimental-webgl", "moz-webgl", "webkit-3d" ][i], {
          antialias : false,
          preserveDrawingBuffer : true,
          willReadFrequently : false,
          depth: true
        });
    }
    gl = my_gl(canvas, i);
    */
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
