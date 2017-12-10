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
var __Test_pointBuffer = [];
var __ColorBuffer = [];
var __Tem_pointbuffer = [];
var __Tem_colorbuffer = [];
var __ActiveBuffer_vertex = [];
var __ActiveBuffer_frag = [];
var __ColorFlag = 0;  // 0代表不需要颜色，1代表需要颜色。
var Point_Number;
var Test_Point_number;
var __Mpro_flag = 0;
var __Matrix0;  // projection
var __Matrix1;
var __Mworld_flag = 0;
var __Mworld;  // world
var __Mview_flag = 0;
var __Mview;
var __Program;
var __x_add; // x,y值的补偿值
var __y_add;
var __Error_flag;  // 判断是否进行了误差计算


getCanvas = function(canvasName) {
  var canvas = $('#' + canvasName);
  if(!canvas[0]){
      $('#test_canvases').append("<canvas id='" + canvasName + "' width='256' height='256'></canvas>");
  }
  return canvas = $('#' + canvasName)[0];
}

rewrite = function(gl){
	gl.my_glbufferData = gl.__proto__.bufferData;
	gl.bufferData = function (a, b, c){
		if (a == gl.ELEMENT_ARRAY_BUFFER){
			__My_index = b;
			__My_index_flag = 1;
			this.my_glbufferData(a, b, c);
		}
		else{
			__My_buffer = b;
			this.my_glbufferData(a, b, c);
		}
	} 

	gl.my_vertexAttribPointer = gl.__proto__.vertexAttribPointer;
	gl.vertexAttribPointer = function (positionAttributeLocation, size, type, normalize, stride, offset){
		// 在这里无法智能的判断位置和颜色
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
		this.my_vertexAttribPointer(positionAttributeLocation, __VertexSize,__VertexType, __VertexNomalize, __VertexStride, __VertexOffset);

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
				__ActiveBuffer_frag = __ActiveBuffer_frag.concat(__My_buffer[j]);
			// 将float系统转换成int系统
			for (var i =0; i < __ActiveBuffer_frag.length; i++)
				__ActiveBuffer_frag[i] = Math.floor(__ActiveBuffer_frag[i] * 255);	
		}
	}

	gl.my_useProgram =  gl.__proto__.useProgram;
	gl.useProgram = function(a){
		__Program = a;
		this.my_useProgram(a);
	}

	gl.my_drawElements = gl.__proto__.drawElements;
	gl.drawElements = function (a , b, c, d){
	  // 这里暂时默认是三角形
	  gl.drawArrays(a , 0, b * 3);
	}



	gl.my_drawArrays = gl.__proto__.drawArrays;
	gl.drawArrays = function(primitiveType, offset, count){
		// 在这里转换值
		var Active_Number = __ActiveBuffer_vertex.length;
		if (__Mworld_flag)
			matrix_mut_active(__Mworld);
		if (__Mview_flag)
			matrix_mut_active(__Mview);
		if (__Mpro_flag)
			matrix_mut_active(__Matrix0);
		for (var i =0; i < __ActiveBuffer_vertex.length; i++)
			__ActiveBuffer_vertex[i] = Math.floor(((__ActiveBuffer_vertex[i] + 1)) * 256 /2);
		 
		__PointBuffer = [];
		__ColorBuffer = [];


		switch (primitiveType){
			case gl.TRIANGLES:
				for (var i = offset; i < offset + count; i += 3){
					switch (__VertexSize){
						case 3:
							tri_3(i);
						break;
					}
				}
			break;
		}

		// 在这里重新将值转化回来
		matrix_mut(__Matrix1);
		// 数据传递到__PointBuffer, 开始在这里进行画图
		Point_Number = __PointBuffer.length;
		console.log("Point_Number", Point_Number);
		console.log("__PointBuffer",__PointBuffer);	
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
			console.log("=====================================");
		
		}else{
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
			gl.useProgram(__Program);
			//gl.bindBuffer(gl.ARRAY_BUFFER, new_vertex_buffer);
			//gl.bindBuffer(gl.ARRAY_BUFFER, new_frag_buffer);
			this.my_drawArrays(gl.POINTS, 0, Point_Number/__VertexSize);
			console.log("=====================================");
		}


	}
}


function matrix_mut (matrix){
	if (__VertexSize == 2){
		for (var i = 0; i < Point_Number; i+=2){
			__PointBuffer[i] = (__PointBuffer[i] * matrix[0] + __PointBuffer[i+1] * matrix[3] + matrix[6]) ;
			__PointBuffer[i + 1] = (__PointBuffer[i] * matrix[1] + __PointBuffer[i+1] * matrix[4] + matrix[7]) ;
		}
	}
 
	if (__VertexSize == 3){
		for (var i = 0; i < Point_Number; i+=3){
		 __PointBuffer[i] =  (__PointBuffer[i] * matrix[0] 
			 + __PointBuffer[i+1] * matrix[4]
			 + __PointBuffer[i+2] * matrix[8] 
			 + matrix[12]) ;
		 __PointBuffer[i + 1] = -1 * (__PointBuffer[i] * matrix[1] 
			 + __PointBuffer[i+1] * matrix[5]
			 + __PointBuffer[i+2] * matrix[9] 
			 + matrix[13]) ;	
		 __PointBuffer[i + 2] = (__PointBuffer[i] * matrix[2] 
			 + __PointBuffer[i+1] * matrix[6]
			 + __PointBuffer[i+2] * matrix[10] 
				+ matrix[14]);
		}
	}
}


function matrix_mut_active (matrix){
	if (__VertexSize == 2){
		for (var i = 0; i < Active_Number; i+=2){
			__ActiveBuffer_vertex[i] = (__ActiveBuffer_vertex[i] * matrix[0] + __ActiveBuffer_vertex[i+1] * matrix[3] + matrix[6]) ;
			__ActiveBuffer_vertex[i + 1] = (__ActiveBuffer_vertex[i] * matrix[1] + __ActiveBuffer_vertex[i+1] * matrix[4] + matrix[7]) ;
		}
	}
 
	if (__VertexSize == 3){
		for (var i = 0; i < Active_Number; i+=3){
			__ActiveBuffer_vertex[i] =  (__ActiveBuffer_vertex[i] * matrix[0] 
			 + __ActiveBuffer_vertex[i+1] * matrix[4]
			 + __ActiveBuffer_vertex[i+2] * matrix[8] 
			 + matrix[12]) ;
			 __ActiveBuffer_vertex[i + 1] = -1 * (__ActiveBuffer_vertex[i] * matrix[1] 
			 + __ActiveBuffer_vertex[i+1] * matrix[5]
			 + __ActiveBuffer_vertex[i+2] * matrix[9] 
			 + matrix[13]) ;	
			 __ActiveBuffer_vertex[i + 2] = (__ActiveBuffer_vertex[i] * matrix[2] 
			 + __ActiveBuffer_vertex[i+1] * matrix[6]
			 + __ActiveBuffer_vertex[i+2] * matrix[10] 
				+ matrix[14]);
		}
	}
}



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
	//这块假设把matrix已经弄完了
	var x_min = min(x1, x2, x3);
	var x_max = max(x1, x2, x3);
	var y_min = min(y1, y2, y3);
	var y_max = max(y1, y2, y3);
	for (var i = x_min; i <= x_max; i++){
		for (var j = y_min; j <= y_max; j++){
			if (judgment(i, j, x1, y1, x2, y2, x3, y3)){
				//在这里面计算z值，然后输入进去
				var A = (y3 - y1)*(z3 - z1) - (z2 -z1)*(y3 - y1);
				var B = (x3 - x1)*(z2 - z1) - (x2 - x1)*(z3 - z1);
				var C = (x2 - x1)*(y3 - y1) - (x3 - x1)*(y2 - y1);
				var D = -1 * (A * x1 + B * y1 + C * z1);
				var k = Math.floor(-1 * (A * i + B * j + D) / C);
				__PointBuffer = __PointBuffer.concat(i);
				__PointBuffer = __PointBuffer.concat(j);
				__PointBuffer = __PointBuffer.concat(k);
				if (__ColorBuffer == 1){
					var dis_1 = Math.sqrt((x1 - i)*(x1 - i)+(y1 - j)*(y1 - j));
					var dis_2 = Math.sqrt((x2 - i)*(x2 - i)+(y2 - j)*(y2 - j));
					var dis_3 = Math.sqrt((x3 - i)*(x3 - i)+(y3 - j)*(y3 - j));
					// 颜色这块的转换需要弄明白
					var r = Math.floor((1 / exp(dis_1)) * r1 + (1 / exp(dis_2)) * r2 + (1 / exp(dis_3)) * r3);
					var g = Math.floor((1 / exp(dis_1)) * g1 + (1 / exp(dis_2)) * g2 + (1 / exp(dis_3)) * g3);
					var b = Math.floor((1 / exp(dis_1)) * b1 + (1 / exp(dis_2)) * b2 + (1 / exp(dis_3)) * b3);
					__ColorBuffer.concat(r);
					__ColorBuffer.concat(g);
					__ColorBuffer.concat(b);
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

function judgment(i, j, x1, y1, x2, y2, x3, y3){
	// 在这里我们把新的点记为0
	var t_10 = (j - y1) / (i - x1);
	var t_12 = (y2 - y1) / (x2 - x1);
	var t_13 = (y3 - y1) / (x3 - x1);
	var t_20 = (j - y2) / (i - x2);
	var t_21 = (y1 - y2) / (x1 - x2);
	var t_23 = (y3 - y2) / (x3 - x2);
	var t_30 = (j - y3) / (i - x3);
	var t_31 = (y1 - y3) / (x1 - x3);
	var t_32 = (y2 - y3) / (x2 - x3);
	if ((t_10 - t_12) * (t_10 - t_13) > 0)
		return false;
	if ((t_20 - t_21) * (t_20 - t_23) > 0)
		return false;
	if ((t_10 - t_31) * (t_30 - t_32) > 0)
		return false;
	return true;
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
