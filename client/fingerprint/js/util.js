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
var __Matrix;
var __Program;

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
  gl.my_glbufferData = gl.__proto__.bufferData;
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

/*-----------------------------------------------------*/
  gl.my_vertexAttribPointer = gl.__proto__.vertexAttribPointer;
  gl.vertexAttribPointer = function (positionAttributeLocation, size, type, normalize, stride, offset){
    if (offset == 0){
      __VertexPositionAttributeLocation1 = positionAttributeLocation;
      //console.log("positionAttributeLocation",positionAttributeLocation);
      //console.log("__VertexPositionAttributeLocation1",__VertexPositionAttributeLocation1);
      __VertexSize = size;
    }
    else{
      __VertexPositionAttributeLocation2 = positionAttributeLocation;
      //console.log("color ---> now");
    }
    //__VertexSize = size;
    __VertexType = type;
    __VertexNomalize = normalize;
    __VertexStride = stride;
    __VertexOffset = offset;
    this.my_vertexAttribPointer(positionAttributeLocation, __VertexSize,__VertexType, __VertexNomalize, __VertexStride, __VertexOffset);	

    //这块进行构造数据
    //未经过测试                 用松神的算法进行测试！！！！！！！正方体的那个进行测试
    if (__My_index_flag == 1){
      var __Tem_my_buffer = [];
      for (var i = 0; i < __My_index.length; i++){
        for (var j = __My_index[i] * stride; j < (__My_index[i] + 1) * stride; j++)
          __Tem_my_buffer = __Tem_my_buffer.concat(__My_buffer);
      }
      __My_buffer = __Tem_my_buffer;
    }

    else {
        if (__VertexOffset == 0)
      {
        // __ActiveBuffer_vertex最后存储所有有效的数据。stride参数还没有加入，之后加。
        //console.log("__My_buffer", __My_buffer);
        stride = stride / 4;  // 这个是因为传入的数据内容大小，转换成数据个数
        offset = offset / 4;
        if (stride == 0)
          stride = size;
        
        for (var i = 0; (i + 1) * stride <= __My_buffer.length; i++)
          for (var j = i * stride + offset; j <  i * stride + offset + size ; j++)
            __ActiveBuffer_vertex = __ActiveBuffer_vertex.concat(__My_buffer[j]);
        //console.log("__ActiveBuffer_vertex",__ActiveBuffer_vertex);
        /*
        //console.log("stride", stride);
        for (var i = __VertexOffset ; i < __My_buffer.length ; i++)
            __ActiveBuffer_vertex = __ActiveBuffer_vertex.concat(__My_buffer[i]);
          for (i = offset * __VertexSize; i < __ActiveBuffer_vertex.length; i++)
            __PointBuffer = __PointBuffer.concat(__ActiveBuffer_vertex[i]);
          __ActiveBuffer_vertex = __PointBuffer;
          __PointBuffer = [];
        */
      }
      else{
        __ColorFlag = 1;
        stride = stride / 4;
        offset = offset / 4;
        if (stride == 0)
          stride = size;
        for (var i = 0; (i + 1) * stride <= __My_buffer.length; i++)
          for (var j = i * stride + offset; j <  i * stride + offset + size; j++)
            __ActiveBuffer_frag = __ActiveBuffer_frag.concat(__My_buffer[j]);
        //console.log("__ActiveBuffer_frag",__ActiveBuffer_frag);
      }
    }
    for (var i =0; i < __ActiveBuffer_vertex.length; i++)
      __ActiveBuffer_vertex[i] = Math.floor((2 - (__ActiveBuffer_vertex[i] + 1)) * 256 /2);
    console.log("__ActiveBuffer_vertex",__ActiveBuffer_vertex);

  }




  /*-----------------------------------------------------*/
  gl.my_useProgram =  gl.__proto__.useProgram;
  gl.useProgram = function(a){
      __Program = a;
      this.my_useProgram(a);
  }




  /*-----------------------------------------------------*/
  gl.my_drawArrays = gl.__proto__.drawArrays;
  gl.drawArrays = function(primitiveType, offset, count){
     switch (primitiveType){
     case gl.POINTS:
         this.my_drawArrays(primitiveType,  offset, count);
     break;
     case gl.LINES:
         //gl.my_drawArrays(primitiveType, offset, count);
         //gl.my_drawArrays(primitiveType,  offset, count);				
         // 在这块可以加入一个是应该画出来的判断条件,之后加。
         //console.log("count", count);
         //console.log("__VertexSize", __VertexSize);
         // 我在这块没有考虑这里的offset
         for (i = offset; i < offset + count; i += 2){   // 因为是每次取2个点，所以是2，在三角形的时候要变换
             //console.log("count i", i);
         // 后面跟着flag参数，1代表第一个和第二个点，2代表第二个和第三个点，3代表第一个和第三个点
         //console.log("__VertexSize",__VertexSize);
             switch (__VertexSize){
             case 1:
                 line_1(i,1);
             break;
             case 2:
                 line_2(i,1);
             break;
         case 3:
           //console.log("case 3");
                 line_3(i,1);
             break;
             }
         }
         console.log("__My_buffer", __My_buffer);
         console.log("__ActiveBuffer_vertex", __ActiveBuffer_vertex);
         console.log("__PointBuffer", __PointBuffer);
     break;
     case gl.LINE_STRIP:
      //gl.my_drawArrays(primitiveType, offset, count);
    for (i = offset; i < offset + count - 1; i ++){   // 因为是每次取2个点，所以是2，在三角形的时候要变换
      //console.log("count i", i);
      // 后面跟着flag参数，1代表第一个和第二个点，2代表第二个和第三个点，3代表第一个和第三个点
      //console.log("__VertexSize",__VertexSize);
      switch (__VertexSize){
        case 1:
          line_1(i,1);
        break;
        case 2:
          line_2(i,1);
        break;
        case 3:
          //console.log("case 3");
          line_3(i,1);
        break;
      }
    }
       
     break;
     case gl.TRIANGLES:
         console.log("TRIANGLES");
         //先把三角形给完整的画出来
         //gl.my_drawArrays(primitiveType, offset, count);
         //之后再重新添加点
         
        for (i = offset; i < offset + count; i += 3){   // 3个点
             console.log("count i", i);
         // 后面跟着flag参数，1代表第一个和第二个点，2代表第二个和第三个点，3代表第一个和第三个点
         __Tem_pointbuffer = [];
         __Tem_colorbuffer = [];
         console.log("__VertexSize", __VertexSize);
             switch (__VertexSize){
         case 1:
          //这个是废状态，暂时不用管
                 tem_line_1(i,2);
             break;
             case 2:
           tem_line_2(i,2);
           console.log("__Tem_pointbuffer",__Tem_pointbuffer);
           console.log("__Tem_colorbuffer",__Tem_colorbuffer);
           for (j = 0; j < __Tem_pointbuffer.length/2; j ++)
               if (__ColorFlag == 0)
              tri_line_2(__ActiveBuffer_vertex[i * __VertexSize] , 
                    __ActiveBuffer_vertex[i * __VertexSize + 1],
                    __Tem_pointbuffer[j * __VertexSize],
                    __Tem_pointbuffer[j * __VertexSize + 1]);
            else
              tri_line_2(__ActiveBuffer_vertex[i * __VertexSize] , 
                __ActiveBuffer_vertex[i * __VertexSize + 1],
                __Tem_pointbuffer[j * __VertexSize],
                __Tem_pointbuffer[j * __VertexSize + 1],
                __ActiveBuffer_frag[i * 3] ,
                __ActiveBuffer_frag[i * 3 + 1] ,
                __ActiveBuffer_frag[i * 3 + 2] ,
                __Tem_colorbuffer[j * 3],
                __Tem_colorbuffer[j * 3 + 1],
                __Tem_colorbuffer[j * 3 + 2]
              );
          
             break;
             case 3:
           tem_line_3(i,2);
           //console.log("__Tem_pointbuffer",__Tem_pointbuffer);
           //console.log("__Tem_colorbuffer",__Tem_colorbuffer);
           for (j = 0; j < __Tem_pointbuffer.length/3; j ++)
               if (__ColorFlag == 0)
              tri_line_3(__ActiveBuffer_vertex[i * __VertexSize] , 
                    __ActiveBuffer_vertex[i * __VertexSize + 1],
                    __ActiveBuffer_vertex[i * __VertexSize + 2],
                    __Tem_pointbuffer[j * __VertexSize],
                    __Tem_pointbuffer[j * __VertexSize + 1],
                    __Tem_pointbuffer[j * __VertexSize + 2]);
            else
              tri_line_3(__ActiveBuffer_vertex[i * __VertexSize] , 
                __ActiveBuffer_vertex[i * __VertexSize + 1],
                __ActiveBuffer_vertex[i * __VertexSize + 2],
                __Tem_pointbuffer[j * __VertexSize],
                __Tem_pointbuffer[j * __VertexSize + 1],
                __Tem_pointbuffer[j * __VertexSize + 2],
                __ActiveBuffer_frag[i * 3] ,
                __ActiveBuffer_frag[i * 3 + 1] ,
                __ActiveBuffer_frag[i * 3 + 2] ,
                __Tem_colorbuffer[j * 3],
                __Tem_colorbuffer[j * 3 + 1],
                __Tem_colorbuffer[j * 3 + 2]);
  
             break;
             }
       }
       
         
         
         console.log("__My_buffer", __My_buffer);
         console.log("__ActiveBuffer_vertex", __ActiveBuffer_vertex);
         console.log("__ActiveBuffer_frag", __ActiveBuffer_frag);
  
  
     break;
     }	
     
     // 数据传递到__PointBuffer, 开始在这里进行画图
     Point_Number = __PointBuffer.length;
     console.log("Point_Number", Point_Number);
  
     // 在这里进行人工projection
     //console.log("matrix",matrix)
     
     matrix_mut(__Matrix);
  
  
     // 重新开始传入buffer
     if (__ColorFlag == 0){
      var new_vertex_buffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, new_vertex_buffer);
      gl.my_glbufferData(gl.ARRAY_BUFFER, new Float32Array(__PointBuffer), gl.STATIC_DRAW);
      //gl.bindBuffer(gl.ARRAY_BUFFER, null);
      gl.my_vertexAttribPointer(__VertexPositionAttributeLocation1, __VertexSize,__VertexType, __VertexNomalize, __VertexStride, __VertexOffset);		
      gl.useProgram(__Program);
      gl.bindBuffer(gl.ARRAY_BUFFER, new_vertex_buffer);
      this.my_drawArrays(gl.POINTS, 0, Point_Number/__VertexSize);
  
     }
     else{
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
  
     }
     
  }




  return gl;
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


function matrix_mut (matrix){
	if (__VertexSize == 2){
		for (var i = 0; i < Point_Number; i+=2){
			__PointBuffer[i] = Math.floor((__PointBuffer[i] * matrix[0] + __PointBuffer[i+1] * matrix[3] + matrix[6]) * 1000) / 1000 ;
			__PointBuffer[i + 1] = Math.floor((__PointBuffer[i] * matrix[1] + __PointBuffer[i+1] * matrix[4] + matrix[7]) * 1000) / 1000 ;
		}
	}
 
	if (__VertexSize == 3){
		for (var i = 0; i < Point_Number; i+=3){
		 __PointBuffer[i] = Math.floor((__PointBuffer[i] * matrix[0] 
			 + __PointBuffer[i+1] * matrix[4]
			 + __PointBuffer[i+2] * matrix[8] 
			 + matrix[12]) * 1000) / 1000 ;
		 __PointBuffer[i + 1] = Math.floor((__PointBuffer[i] * matrix[1] 
			 + __PointBuffer[i+1] * matrix[5]
			 + __PointBuffer[i+2] * matrix[9] 
			 + matrix[13]) * 1000) / 1000 ;	
		 __PointBuffer[i + 2] = Math.floor((__PointBuffer[i] * matrix[2] 
			 + __PointBuffer[i+1] * matrix[6]
			 + __PointBuffer[i+2] * matrix[10] 
				+ matrix[14]) * 1000) / 1000 ;
		}
	}
   }

//var n = 3 * 8;
//gl.drawArrays(gl.TRIANGLES, 0, n);	
/*$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$*/




/*$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$*/
		// 较小值返回在前面，较大值在后面, 1 表示交换了， 0 表示没有交换
// 这个也废掉了，不用管
		function line_1 (i, flag){
			if (flag == 1){
				var x1 = i * __VertexSize;
				var x2 = i * __VertexSize + 1;
			}else if (flag == 2){
				var x1 = i * __VertexSize + 1;
				var x2 = i * __VertexSize + 2;
			}else{
				var x1 = i * __VertexSize;
				var x2 = i * __VertexSize + 2;
			}
			
			//concole.log("x1", x1, "x2", x2);
			x1,x2 = sort(x1, x2)[0],[1];				
			for (var j = x1; j <= x2; j++)
			__PointBuffer = __PointBuffer.concat(j);
		}


//这个函数暂时废掉，并没有去管这个函数
		function tem_line_1 (i, flag){
			if (flag == 1){
				var x1 = i * __VertexSize;
				var x2 = i * __VertexSize + 1;
			}else if (flag == 2){
				var x1 = i * __VertexSize + 1;
				var x2 = i * __VertexSize + 2;
			}else{
				var x1 = i * __VertexSize;
				var x2 = i * __VertexSize + 2;
			}
			
			//concole.log("x1", x1, "x2", x2);
			x1,x2 = sort(x1, x2)[0],[1];				
			for (var j = x1; j <= x2; j++)
			__PointBuffer = __PointBuffer.concat(j);
		}



		


		function line_2 (i, flag){
			if (flag == 1){
				var x1 = __ActiveBuffer_vertex[i * __VertexSize];
				var y1 = __ActiveBuffer_vertex[i * __VertexSize + 1];
				var x2 = __ActiveBuffer_vertex[i * __VertexSize + 2];
				var y2 = __ActiveBuffer_vertex[i * __VertexSize + 3];
				if (__ColorFlag == 1){
					var r1 = __ActiveBuffer_frag[i * 3];
					var g1 = __ActiveBuffer_frag[i * 3 + 1];
					var b1 = __ActiveBuffer_frag[i * 3 + 2];
					var r2 = __ActiveBuffer_frag[i * 3 + 3];
					var g2 = __ActiveBuffer_frag[i * 3 + 4];
					var b2 = __ActiveBuffer_frag[i * 3 + 5];
				}
			}else if (flag == 2){
				var x1 = __ActiveBuffer_vertex[i * __VertexSize + 2];
				var y1 = __ActiveBuffer_vertex[i * __VertexSize + 3];
				var x2 = __ActiveBuffer_vertex[i * __VertexSize + 4];
				var y2 = __ActiveBuffer_vertex[i * __VertexSize + 5];
				if (__ColorFlag == 1){
					var r1 = __ActiveBuffer_frag[i * 3 + 3];
					var g1 = __ActiveBuffer_frag[i * 3 + 4];
					var b1 = __ActiveBuffer_frag[i * 3 + 5];
					var r2 = __ActiveBuffer_frag[i * 3 + 6];
					var g2 = __ActiveBuffer_frag[i * 3 + 7];
					var b2 = __ActiveBuffer_frag[i * 3 + 8];
				}
			}else{
				var x1 = __ActiveBuffer_vertex[i * __VertexSize];
				var y1 = __ActiveBuffer_vertex[i * __VertexSize + 1];
				var x2 = __ActiveBuffer_vertex[i * __VertexSize + 4];
				var y2 = __ActiveBuffer_vertex[i * __VertexSize + 5];
				if (__ColorFlag == 1){
					var r1 = __ActiveBuffer_frag[i * 3];
					var g1 = __ActiveBuffer_frag[i * 3 + 1];
					var b1 = __ActiveBuffer_frag[i * 3 + 2];
					var r2 = __ActiveBuffer_frag[i * 3 + 6];
					var g2 = __ActiveBuffer_frag[i * 3 + 7];
					var b2 = __ActiveBuffer_frag[i * 3 + 8];
				}
			}
			
			//var __Tem = [];
			//console.log("x1", x1, "y1", y1, "x2", x2, "y2", y2);
			var flag; // 1: 以x为基准， 2： 以y为基准
			Math.abs(x1 - x2) > Math.abs(y1 - y2) ? flag = 1: flag = 2;
			//console.log("flag", flag);
			//console.log("begin", __PointBuffer);
			if (__ColorFlag == 0)
				__PointBuffer = addPoint_2 (x1, y1, x2, y2, __PointBuffer, flag );
			else
				__PointBuffer = addPoint_2 (x1, y1, x2, y2, __PointBuffer, flag,
				                            r1, g1, b1, r2, g2, b2 );
			//__Tem = addPoint_2 (x1, y1, x2, y2, __PointBuffer, flag );
			//__PointBuffer += __Tem;
			//console.log("back __PointBuffer", __PointBuffer);
		}

		function tem_line_2 (i, flag){
			
			if (flag == 1){
				var x1 = __ActiveBuffer_vertex[i * __VertexSize];
				var y1 = __ActiveBuffer_vertex[i * __VertexSize + 1];
				var x2 = __ActiveBuffer_vertex[i * __VertexSize + 2];
				var y2 = __ActiveBuffer_vertex[i * __VertexSize + 3];
				if (__ColorFlag == 1){
					var r1 = __ActiveBuffer_frag[i * 3];
					var g1 = __ActiveBuffer_frag[i * 3 + 1];
					var b1 = __ActiveBuffer_frag[i * 3 + 2];
					var r2 = __ActiveBuffer_frag[i * 3 + 3];
					var g2 = __ActiveBuffer_frag[i * 3 + 4];
					var b2 = __ActiveBuffer_frag[i * 3 + 5];
				}
			}else if (flag == 2){
				var x1 = __ActiveBuffer_vertex[i * __VertexSize + 2];
				var y1 = __ActiveBuffer_vertex[i * __VertexSize + 3];
				var x2 = __ActiveBuffer_vertex[i * __VertexSize + 4];
				var y2 = __ActiveBuffer_vertex[i * __VertexSize + 5];
				if (__ColorFlag == 1){
					var r1 = __ActiveBuffer_frag[i * 3 + 3];
					var g1 = __ActiveBuffer_frag[i * 3 + 4];
					var b1 = __ActiveBuffer_frag[i * 3 + 5];
					var r2 = __ActiveBuffer_frag[i * 3 + 6];
					var g2 = __ActiveBuffer_frag[i * 3 + 7];
					var b2 = __ActiveBuffer_frag[i * 3 + 8];
				}
			}else{
				var x1 = __ActiveBuffer_vertex[i * __VertexSize];
				var y1 = __ActiveBuffer_vertex[i * __VertexSize + 1];
				var x2 = __ActiveBuffer_vertex[i * __VertexSize + 4];
				var y2 = __ActiveBuffer_vertex[i * __VertexSize + 5];
				if (__ColorFlag == 1){
					var r1 = __ActiveBuffer_frag[i * 3];
					var g1 = __ActiveBuffer_frag[i * 3 + 1];
					var b1 = __ActiveBuffer_frag[i * 3 + 2];
					var r2 = __ActiveBuffer_frag[i * 3 + 6];
					var g2 = __ActiveBuffer_frag[i * 3 + 7];
					var b2 = __ActiveBuffer_frag[i * 3 + 8];
				}
			}
			
			//var __Tem = [];
			//console.log("x1", x1, "y1", y1, "x2", x2, "y2", y2);
			var flag; // 1: 以x为基准， 2： 以y为基准
			Math.abs(x1 - x2) > Math.abs(y1 - y2) ? flag = 1: flag = 2;
			//console.log("flag", flag);
			//console.log("begin", __Tem_pointbuffer);
			//console.log("x1", x1, "y1", y1, "x2", x2,"y2", y2,
			//"r1", r1,"g1", g1,"b1", b1,"r2", r2,"g2", g2,"b2", b2,"flag", flag);
			if (__ColorFlag == 0)
				__Tem_pointbuffer = tem_addPoint_2 (x1, y1, x2, y2, __Tem_pointbuffer, flag );
			else
				__Tem_pointbuffer = tem_addPoint_2 (x1, y1, x2, y2, __Tem_pointbuffer, flag,
										r1, g1, b1, r2, g2, b2 );
			
			//__Tem = addPoint_2 (x1, y1, x2, y2, __PointBuffer, flag );
			//__PointBuffer += __Tem;
			//console.log("back __PointBuffer", __Tem_pointbuffer);
		}


		function tri_line_2 (x1 , y1, x2, y2, r1, g1, b1, r2, g2, b2){

			//var __Tem = [];
			//console.log("x1", x1, "y1", y1, "x2", x2, "y2", y2);
			var flag; // 1: 以x为基准， 2： 以y为基准
			Math.abs(x1 - x2) > Math.abs(y1 - y2) ? flag = 1: flag = 2;
			//console.log("flag", flag);
			//console.log("begin", __PointBuffer);
			if (__ColorFlag == 0)
				__PointBuffer = addPoint_2 (x1, y1, x2, y2, __PointBuffer, flag );
			else
				__PointBuffer = addPoint_2 (x1, y1, x2, y2, __PointBuffer, flag ,
											r1, g1, b1, r2, g2, b2 );
			//__Tem = addPoint_2 (x1, y1, x2, y2, __PointBuffer, flag );
			//__PointBuffer += __Tem;
			//console.log("back __PointBuffer", __PointBuffer);
		}







		function line_3(i, flag){
			if (flag == 1){
				var x1 = __ActiveBuffer_vertex[i * __VertexSize];
				var y1 = __ActiveBuffer_vertex[i * __VertexSize + 1];
				var z1 = __ActiveBuffer_vertex[i * __VertexSize + 2];
				var x2 = __ActiveBuffer_vertex[i * __VertexSize + 3];
				var y2 = __ActiveBuffer_vertex[i * __VertexSize + 4];
				var z2 = __ActiveBuffer_vertex[i * __VertexSize + 5];
				if (__ColorFlag == 1){
					var r1 = __ActiveBuffer_frag[i * 3];
					var g1 = __ActiveBuffer_frag[i * 3 + 1];
					var b1 = __ActiveBuffer_frag[i * 3 + 2];
					var r2 = __ActiveBuffer_frag[i * 3 + 3];
					var g2 = __ActiveBuffer_frag[i * 3 + 4];
					var b2 = __ActiveBuffer_frag[i * 3 + 5];
				}
			}else if (flag == 2){
				var x1 = __ActiveBuffer_vertex[i * __VertexSize + 3];
				var y1 = __ActiveBuffer_vertex[i * __VertexSize + 4];
				var z1 = __ActiveBuffer_vertex[i * __VertexSize + 5];
				var x2 = __ActiveBuffer_vertex[i * __VertexSize + 6];
				var y2 = __ActiveBuffer_vertex[i * __VertexSize + 7];
				var z2 = __ActiveBuffer_vertex[i * __VertexSize + 8];
				if (__ColorFlag == 1){
					var r1 = __ActiveBuffer_frag[i * 3 + 3];
					var g1 = __ActiveBuffer_frag[i * 3 + 4];
					var b1 = __ActiveBuffer_frag[i * 3 + 5];
					var r2 = __ActiveBuffer_frag[i * 3 + 6];
					var g2 = __ActiveBuffer_frag[i * 3 + 7];
					var b2 = __ActiveBuffer_frag[i * 3 + 8];
				}
			}else{
				var x1 = __ActiveBuffer_vertex[i * __VertexSize];
				var y1 = __ActiveBuffer_vertex[i * __VertexSize + 1];
				var z1 = __ActiveBuffer_vertex[i * __VertexSize + 2];
				var x2 = __ActiveBuffer_vertex[i * __VertexSize + 6];
				var y2 = __ActiveBuffer_vertex[i * __VertexSize + 7];
				var z2 = __ActiveBuffer_vertex[i * __VertexSize + 8];
				if (__ColorFlag == 1){
					var r1 = __ActiveBuffer_frag[i * 3];
					var g1 = __ActiveBuffer_frag[i * 3 + 1];
					var b1 = __ActiveBuffer_frag[i * 3 + 2];
					var r2 = __ActiveBuffer_frag[i * 3 + 6];
					var g2 = __ActiveBuffer_frag[i * 3 + 7];
					var b2 = __ActiveBuffer_frag[i * 3 + 8];
				}
			}
			
			
			var flag; // 1: 以x为基准， 2： 以y为基准, 3: 以z为基准
			Math.abs(x1 - x2) > Math.abs(y1 - y2) ? (Math.abs(x1 - x2) > Math.abs(z1 - z2) ?  flag = 1: flag = 3):(Math.abs(y1 - y2) > Math.abs(z1 - z2) ?  flag = 2: flag = 3);
			if (__ColorFlag == 0)
				__PointBuffer = addPoint_3 (x1, y1, z1, x2, y2, z2, __PointBuffer, flag );
			else
				__PointBuffer = addPoint_3 (x1, y1, z1, x2, y2, z2, __PointBuffer, flag,
										r1, g1, b1, r2, g2, b2 );

		}



		function tem_line_3(i, flag){
			//console.log("a", a, "b", b, "c", c);
			if (flag == 1){
				var x1 = __ActiveBuffer_vertex[i * __VertexSize];
				var y1 = __ActiveBuffer_vertex[i * __VertexSize + 1];
				var z1 = __ActiveBuffer_vertex[i * __VertexSize + 2];
				var x2 = __ActiveBuffer_vertex[i * __VertexSize + 3];
				var y2 = __ActiveBuffer_vertex[i * __VertexSize + 4];
				var z2 = __ActiveBuffer_vertex[i * __VertexSize + 5];
				if (__ColorFlag == 1){
					var r1 = __ActiveBuffer_frag[i * 3];
					var g1 = __ActiveBuffer_frag[i * 3 + 1];
					var b1 = __ActiveBuffer_frag[i * 3 + 2];
					var r2 = __ActiveBuffer_frag[i * 3 + 3];
					var g2 = __ActiveBuffer_frag[i * 3 + 4];
					var b2 = __ActiveBuffer_frag[i * 3 + 5];
				}
			}else if (flag == 2){
				var x1 = __ActiveBuffer_vertex[i * __VertexSize + 3];
				var y1 = __ActiveBuffer_vertex[i * __VertexSize + 4];
				var z1 = __ActiveBuffer_vertex[i * __VertexSize + 5];
				var x2 = __ActiveBuffer_vertex[i * __VertexSize + 6];
				var y2 = __ActiveBuffer_vertex[i * __VertexSize + 7];
				var z2 = __ActiveBuffer_vertex[i * __VertexSize + 8];
				if (__ColorFlag == 1){
					var r1 = __ActiveBuffer_frag[i * 3 + 3];
					var g1 = __ActiveBuffer_frag[i * 3 + 4];
					var b1 = __ActiveBuffer_frag[i * 3 + 5];
					var r2 = __ActiveBuffer_frag[i * 3 + 6];
					var g2 = __ActiveBuffer_frag[i * 3 + 7];
					var b2 = __ActiveBuffer_frag[i * 3 + 8];
				}
				
			}else{
				var x1 = __ActiveBuffer_vertex[i * __VertexSize];
				var y1 = __ActiveBuffer_vertex[i * __VertexSize + 1];
				var z1 = __ActiveBuffer_vertex[i * __VertexSize + 2];
				var x2 = __ActiveBuffer_vertex[i * __VertexSize + 6];
				var y2 = __ActiveBuffer_vertex[i * __VertexSize + 7];
				var z2 = __ActiveBuffer_vertex[i * __VertexSize + 8];
				if (__ColorFlag == 1){
					var r1 = __ActiveBuffer_frag[i * 3];
					var g1 = __ActiveBuffer_frag[i * 3 + 1];
					var b1 = __ActiveBuffer_frag[i * 3 + 2];
					var r2 = __ActiveBuffer_frag[i * 3 + 6];
					var g2 = __ActiveBuffer_frag[i * 3 + 7];
					var b2 = __ActiveBuffer_frag[i * 3 + 8];
				}
			}
			
			
			var flag; // 1: 以x为基准， 2： 以y为基准, 3: 以z为基准
			Math.abs(x1 - x2) > Math.abs(y1 - y2) ? (Math.abs(x1 - x2) > Math.abs(z1 - z2) ?  flag = 1: flag = 3):(Math.abs(y1 - y2) > Math.abs(z1 - z2) ?  flag = 2: flag = 3);
			
			/*console.log("x1", x1, "y1", y1, "z1", z1,"x2", x2,"y2", y2,"z2", z2,
			"r1", r1,"g1", g1,"b1", b1,"r2", r2,"g2", g2,"b2", b2,"flag", flag);
			*/
			if (__ColorFlag == 0)
				__Tem_pointbuffer = tem_addPoint_3 (x1, y1, z1, x2, y2, z2, __Tem_pointbuffer, flag );
			else
				__Tem_pointbuffer = tem_addPoint_3 (x1, y1, z1, x2, y2, z2, __Tem_pointbuffer, flag,
									r1, g1, b1, r2, g2, b2 );

			

		}

		function tri_line_3(x1, y1, z1, x2, y2, z2,r1, g1, b1, r2, g2, b2){
			var flag; // 1: 以x为基准， 2： 以y为基准, 3: 以z为基准
			Math.abs(x1 - x2) > Math.abs(y1 - y2) ? (Math.abs(x1 - x2) > Math.abs(z1 - z2) ?  flag = 1: flag = 3):(Math.abs(y1 - y2) > Math.abs(z1 - z2) ?  flag = 2: flag = 3);
			
			//console.log("x1", x1, "y1", y1, "z1", z1,"x2", x2,"y2", y2,"z2", z2,
			//"r1", r1,"g1", g1,"b1", b1,"r2", r2,"g2", g2,"b2", b2,"flag", flag);
			if (__ColorFlag == 0)
				__PointBuffer = addPoint_3 (x1, y1, z1, x2, y2, z2, __PointBuffer, flag );
			else
				__PointBuffer = addPoint_3 (x1, y1, z1, x2, y2, z2, __PointBuffer, flag ,
										r1, g1, b1, r2, g2, b2 );

		}



		function sort( a,  b){
			//console.log("a", a, "b",b);
			return a > b ? [b ,a, 1] : [a ,b, 0];
		}

		function exchange (a , b){
			return [b , a];
		}



		// 在二维数据里面增加二维的数据点
		// 1: 以x为基准， 2： 以y为基准
		function addPoint_2 (x1, y1, x2, y2, __PointBuffer, flag, r1, g1, b1, r2, g2, b2){
			//console.log("x1", x1, "y1", y1, "x2", x2, "y2", y2,"flag", flag);
			if (flag == 1){
				var t;
				var returnValue;
				returnValue = sort(x1, x2);
				x1 = returnValue[0];
				x2 = returnValue[1];
				t = returnValue[2];
				if (t == 1){
					returnValue = exchange(y1, y2);
					y1 = returnValue[0];
					y2 = returnValue[1];
					if (__ColorFlag == 1){
						returnValue = exchange(r1, r2);
						r1 = returnValue[0];
						r2 = returnValue[1];
						returnValue = exchange(g1, g2);
						g1 = returnValue[0];
						g2 = returnValue[1];
						returnValue = exchange(b1, b2);
						b1 = returnValue[0];
						b2 = returnValue[1];
					}
				}			
				for (var i = x1; i <= x2; i++){
					__PointBuffer = __PointBuffer.concat(i + 0.5);
					__PointBuffer = __PointBuffer.concat(Math.floor(y1 + (y2 - y1) / (x2 - x1 ) * (i- x1)) + 0.5 );
					if (__ColorFlag == 1){
						__ColorBuffer = __ColorBuffer.concat(Math.floor(r1 + (r2 - r1) / (x2 - x1 ) * (i- x1)));
						__ColorBuffer = __ColorBuffer.concat(Math.floor(g1 + (g2 - g1) / (x2 - x1 ) * (i- x1)));
						__ColorBuffer = __ColorBuffer.concat(Math.floor(b1 + (b2 - b1) / (x2 - x1 ) * (i- x1)));
					}
					
					// 这个公式在之后还要进行变换
				}	
			}
			else{
				var t;
				var returnValue;
				//console.log("y1", y1, "y2", y2, "t",t);
				//console.log("aaa",sort(y1, y2)[0]);
				returnValue = sort(y1, y2);
				y1 = returnValue[0];
				y2 = returnValue[1];
				t = returnValue[2];
				//console.log("y1", y1, "y2", y2, "t",t);
				//console.log("before", x1, x2);
				if (t == 1){
					returnValue = exchange(x1, x2);
					x1 = returnValue[0];
					x2 = returnValue[1];
					if (__ColorFlag == 1){
						returnValue = exchange(r1, r2);
						r1 = returnValue[0];
						r2 = returnValue[1];
						returnValue = exchange(g1, g2);
						g1 = returnValue[0];
						g2 = returnValue[1];
						returnValue = exchange(b1, b2);
						b1 = returnValue[0];
						b2 = returnValue[1];
					}
				}			
				//console.log("after", x1, x2);
				//console.log("after sort  x1",x1, "y1", y1, "x2", x2, "y2", y2, "t", t);
				//console.log("I am here",x1,x2);
				for (var i = y1; i <= y2; i++){
					//console.log("x2 - x1", x2 - x1);
					//console.log("y2 - y1 + 1",y2 - y1 + 1);
					__PointBuffer = __PointBuffer.concat(Math.floor (x1 + (x2 - x1)/ (y2 - y1 ) * (i - y1))+ 0.5 );
					__PointBuffer = __PointBuffer.concat(i + 0.5);
					if (__ColorFlag == 1){
						__ColorBuffer = __ColorBuffer.concat(Math.floor(r1 + (r2 - r1) / (y2 - y1 ) * (i- y1)));
						__ColorBuffer = __ColorBuffer.concat(Math.floor(g1 + (g2 - g1) / (y2 - y1 ) * (i- y1)));
						__ColorBuffer = __ColorBuffer.concat(Math.floor(b1 + (b2 - b1) / (y2 - y1 ) * (i- y1)));
					}
				}	
			}
			return __PointBuffer;
		}

// 在二维数据里面增加二维的数据点
		// 1: 以x为基准， 2： 以y为基准
		function tem_addPoint_2 (x1, y1, x2, y2, __Tem_pointbuffer, flag, r1, g1, b1, r2, g2, b2){
			console.log("x1", x1, "y1", y1, "x2", x2,"y2", y2,
			"r1", r1,"g1", g1,"b1", b1,"r2", r2,"g2", g2,"b2", b2,"flag", flag);
			//console.log("x1", x1, "y1", y1, "x2", x2, "y2", y2,"flag", flag);
			if (flag == 1){
				var t;
				var returnValue;
				returnValue = sort(x1, x2);
				x1 = returnValue[0];
				x2 = returnValue[1];
				t = returnValue[2];
				if (t == 1){
					returnValue = exchange(y1, y2);
					y1 = returnValue[0];
					y2 = returnValue[1];
					if (__ColorFlag == 1){
						returnValue = exchange(r1, r2);
						r1 = returnValue[0];
						r2 = returnValue[1];
						returnValue = exchange(g1, g2);
						g1 = returnValue[0];
						g2 = returnValue[1];
						returnValue = exchange(b1, b2);
						b1 = returnValue[0];
						b2 = returnValue[1];
					}
				}			
				for (var i = x1; i <= x2; i++){
					__Tem_pointbuffer = __Tem_pointbuffer.concat(i + 0.5);
					__Tem_pointbuffer = __Tem_pointbuffer.concat(Math.floor(y1 + (y2 - y1) / (x2 - x1 ) * (i- x1)) + 0.5 );
					if (__ColorFlag == 1){
						console.log("in the loop");
						__Tem_colorbuffer = __Tem_colorbuffer.concat(Math.floor(r1 + (r2 - r1) / (x2 - x1 ) * (i- x1)));
						__Tem_colorbuffer = __Tem_colorbuffer.concat(Math.floor(g1 + (g2 - g1) / (x2 - x1 ) * (i- x1)));
						__Tem_colorbuffer = __Tem_colorbuffer.concat(Math.floor(b1 + (b2 - b1) / (x2 - x1 ) * (i- x1)));
					}
					// 这个公式在之后还要进行变换
				}	
			}
			else{
				var t;
				var returnValue;
				//console.log("y1", y1, "y2", y2, "t",t);
				//console.log("aaa",sort(y1, y2)[0]);
				returnValue = sort(y1, y2);
				y1 = returnValue[0];
				y2 = returnValue[1];
				t = returnValue[2];
				//console.log("y1", y1, "y2", y2, "t",t);
				//console.log("before", x1, x2);
				if (t == 1){
					returnValue = exchange(x1, x2);
					x1 = returnValue[0];
					x2 = returnValue[1];
					if (__ColorFlag == 1){
						returnValue = exchange(r1, r2);
						r1 = returnValue[0];
						r2 = returnValue[1];
						returnValue = exchange(g1, g2);
						g1 = returnValue[0];
						g2 = returnValue[1];
						returnValue = exchange(b1, b2);
						b1 = returnValue[0];
						b2 = returnValue[1];
					}
				}			
				//console.log("after", x1, x2);
				//console.log("after sort  x1",x1, "y1", y1, "x2", x2, "y2", y2, "t", t);
				//console.log("I am here",x1,x2);
				for (var i = y1; i <= y2; i++){
					//console.log("x2 - x1", x2 - x1);
					//console.log("y2 - y1 + 1",y2 - y1 + 1);
					__Tem_pointbuffer = __Tem_pointbuffer.concat(Math.floor (x1 + (x2 - x1)/ (y2 - y1 ) * (i - y1))+ 0.5 );
					__Tem_pointbuffer = __Tem_pointbuffer.concat(i + 0.5);
					if (__ColorFlag == 1){
						__Tem_colorbuffer = __Tem_colorbuffer.concat(Math.floor(r1 + (r2 - r1) / (y2 - y1 ) * (i- y1)));
						__Tem_colorbuffer = __Tem_colorbuffer.concat(Math.floor(g1 + (g2 - g1) / (y2 - y1 ) * (i- y1)));
						__Tem_colorbuffer = __Tem_colorbuffer.concat(Math.floor(b1 + (b2 - b1) / (y2 - y1 ) * (i- y1)));
					}
				}	
			}
			return __Tem_pointbuffer;
		}







		// 在三维数据里面增加三维的数据点
		// 1: 以x为基准， 2： 以y为基准 3： 以Z为基准
		function addPoint_3 (x1, y1, z1, x2, y2, z2, __PointBuffer, flag, r1, g1, b1, r2, g2, b2 ){
			var t;
			var returnValue;
			//console.log("x1", x1, "y1", y1,"x2", x2,"y2", y2,"z1", z1,"z2", z2);
			//console.log("flag",flag);
			//console.log("x1", x1, "y1", y1, "z1", z1,"x2", x2,"y2", y2,"z2", z2,
			//"r1", r1,"g1", g1,"b1", b1,"r2", r2,"g2", g2,"b2", b2,"flag", flag);
			switch (flag) {
			case 1:
				returnValue = sort(x1, x2);
				x1 = returnValue[0];
				x2 = returnValue[1];
				t = returnValue[2];
				if (t == 1){
					returnValue = exchange(y1, y2);
					y1 = returnValue[0];
					y2 = returnValue[1];
					returnValue = exchange(z1, z2);
					z1 = returnValue[0];
					z2 = returnValue[1];
					if (__ColorFlag == 1){
						returnValue = exchange(r1, r2);
						r1 = returnValue[0];
						r2 = returnValue[1];
						returnValue = exchange(g1, g2);
						g1 = returnValue[0];
						g2 = returnValue[1];
						returnValue = exchange(b1, b2);
						b1 = returnValue[0];
						b2 = returnValue[1];
					}
				}
				for (var i = x1; i <= x2; i++){
					__PointBuffer = __PointBuffer.concat(i + 0.5);
					__PointBuffer = __PointBuffer.concat(Math.floor( y1 + (y2 - y1) / (x2 - x1 ) * (i - x1))+ 0.5 );
					__PointBuffer = __PointBuffer.concat(Math.floor(z1 + (z2 - z1) / (x2 - x1 ) * (i - x1)) + 0.5) ;
					//__PointBuffer = __PointBuffer.concat(Math.floor(z1 + (z2 - z1) / (x2 - x1 ) * (i - x1))) ;
					// 这个公式在之后还要进行变换
					if (__ColorFlag == 1){
						__ColorBuffer = __ColorBuffer.concat(Math.floor(r1 + (r2 - r1) / (x2 - x1 ) * (i- x1)));
						__ColorBuffer = __ColorBuffer.concat(Math.floor(g1 + (g2 - g1) / (x2 - x1 ) * (i- x1)));
						__ColorBuffer = __ColorBuffer.concat(Math.floor(b1 + (b2 - b1) / (x2 - x1 ) * (i- x1)));
					}
				}	
			break;
			case 2:
				returnValue = sort(y1, y2);
				y1 = returnValue[0];
				y2 = returnValue[1];
				t = returnValue[2];
				if (t == 1){
					returnValue = exchange(x1, x2);
					x1 = returnValue[0];
					x2 = returnValue[1];
					returnValue = exchange(z1, z2);
					z1 = returnValue[0];
					z2 = returnValue[1];
					if (__ColorFlag == 1){
						returnValue = exchange(r1, r2);
						r1 = returnValue[0];
						r2 = returnValue[1];
						returnValue = exchange(g1, g2);
						g1 = returnValue[0];
						g2 = returnValue[1];
						returnValue = exchange(b1, b2);
						b1 = returnValue[0];
						b2 = returnValue[1];
					}
				}
				//console.log("x1", x1, "y1", y1,"x2", x2,"y2", y2,"z1", z1,"z2", z2);
				//console.log("flag",flag);
				for (var i = y1; i <= y2; i++){
					__PointBuffer = __PointBuffer.concat(Math.floor(x1 + (x2 - x1)/ (y2 - y1) * (i - y1))+ 0.5);
					__PointBuffer = __PointBuffer.concat(i + 0.5);
					__PointBuffer = __PointBuffer.concat(Math.floor(z1 + (z2 - z1) / (y2 - y1) * (i - y1)) + 0.5);
					//__PointBuffer = __PointBuffer.concat(Math.floor(z1 + (z2 - z1) / (y2 - y1) * (i - x1)));
					// 这个公式在之后还要进行变换
					if (__ColorFlag == 1){
						__ColorBuffer = __ColorBuffer.concat(Math.floor(r1 + (r2 - r1) / (y2 - y1 ) * (i- y1)));
						__ColorBuffer = __ColorBuffer.concat(Math.floor(g1 + (g2 - g1) / (y2 - y1 ) * (i- y1)));
						__ColorBuffer = __ColorBuffer.concat(Math.floor(b1 + (b2 - b1) / (y2 - y1 ) * (i- y1)));
					}
				}	
			break;
			case 3:
				returnValue = sort(z1, z2);
				z1 = returnValue[0];
				z2 = returnValue[1];
				t = returnValue[2];
				if (t == 1){
					returnValue = exchange(x1, x2);
					x1 = returnValue[0];
					x2 = returnValue[1];
					returnValue = exchange(y1, y2);
					y1 = returnValue[0];
					y2 = returnValue[1];
					if (__ColorFlag == 1){
						returnValue = exchange(r1, r2);
						r1 = returnValue[0];
						r2 = returnValue[1];
						returnValue = exchange(g1, g2);
						g1 = returnValue[0];
						g2 = returnValue[1];
						returnValue = exchange(b1, b2);
						b1 = returnValue[0];
						b2 = returnValue[1];
					}
				}
				for (var i = z1; i <= z2; i++){
					__PointBuffer = __PointBuffer.concat(Math.floor(x1 + (x2 - x1)/ (z2 - z1 ) * (i - z1)) + 0.5);
					__PointBuffer = __PointBuffer.concat(Math.floor(y1 + (y2 - y1) / (z2 - z1 ) * (i - z1)) + 0.5);
					__PointBuffer = __PointBuffer.concat(i + 0.5);
					// 这个公式在之后还要进行变换
					if (__ColorFlag == 1){
						__ColorBuffer = __ColorBuffer.concat(Math.floor(r1 + (r2 - r1) / (z2 - z1 ) * (i - z1)));
						__ColorBuffer = __ColorBuffer.concat(Math.floor(g1 + (g2 - g1) / (z2 - z1 ) * (i - z1)));
						__ColorBuffer = __ColorBuffer.concat(Math.floor(b1 + (b2 - b1) / (z2 - z1 ) * (i - z1)));
					}
				}	
			break;
			}
			return __PointBuffer;
		}


		// 在三维数据里面增加三维的数据点
		// 1: 以x为基准， 2： 以y为基准 3： 以Z为基准
		function tem_addPoint_3 (x1, y1, z1, x2, y2, z2, __Tem_pointbuffer, flag, r1, g1, b1, r2, g2, b2 ){
			var t;
			var returnValue;
			//console.log("x1", x1, "y1", y1,"x2", x2,"y2", y2,"z1", z1,"z2", z2);
			//console.log("flag",flag);
			//console.log("x1", x1, "y1", y1, "z1", z1,"x2", x2,"y2", y2,"z2", z2,
			//"r1", r1,"g1", g1,"b1", b1,"r2", r2,"g2", g2,"b2", b2,"flag", flag);
			switch (flag) {
			case 1:
				returnValue = sort(x1, x2);
				x1 = returnValue[0];
				x2 = returnValue[1];
				t = returnValue[2];
				if (t == 1){
					returnValue = exchange(y1, y2);
					y1 = returnValue[0];
					y2 = returnValue[1];
					returnValue = exchange(z1, z2);
					z1 = returnValue[0];
					z2 = returnValue[1];
					if (__ColorFlag == 1){
						returnValue = exchange(r1, r2);
						r1 = returnValue[0];
						r2 = returnValue[1];
						returnValue = exchange(g1, g2);
						g1 = returnValue[0];
						g2 = returnValue[1];
						returnValue = exchange(b1, b2);
						b1 = returnValue[0];
						b2 = returnValue[1];
					}
				}
				for (var i = x1; i <= x2; i++){
					__Tem_pointbuffer = __Tem_pointbuffer.concat(i + 0.5);
					__Tem_pointbuffer = __Tem_pointbuffer.concat(Math.floor( y1 + (y2 - y1) / (x2 - x1 ) * (i - x1))+ 0.5 );
					__Tem_pointbuffer = __Tem_pointbuffer.concat(Math.floor(z1 + (z2 - z1) / (x2 - x1 ) * (i - x1)) + 0.5) ;
					//__PointBuffer = __PointBuffer.concat(Math.floor(z1 + (z2 - z1) / (x2 - x1 ) * (i - x1))) ;
					// 这个公式在之后还要进行变换
					if (__ColorFlag == 1){
						__Tem_colorbuffer = __Tem_colorbuffer.concat(Math.floor(r1 + (r2 - r1) / (x2 - x1 ) * (i- x1)));
						__Tem_colorbuffer = __Tem_colorbuffer.concat(Math.floor(g1 + (g2 - g1) / (x2 - x1 ) * (i- x1)));
						__Tem_colorbuffer = __Tem_colorbuffer.concat(Math.floor(b1 + (b2 - b1) / (x2 - x1 ) * (i- x1)));
					}
					
				}	
			break;
			case 2:
				returnValue = sort(y1, y2);
				y1 = returnValue[0];
				y2 = returnValue[1];
				t = returnValue[2];
				if (t == 1){
					returnValue = exchange(x1, x2);
					x1 = returnValue[0];
					x2 = returnValue[1];
					returnValue = exchange(z1, z2);
					z1 = returnValue[0];
					z2 = returnValue[1];
					if (__ColorFlag == 1){
						returnValue = exchange(r1, r2);
						r1 = returnValue[0];
						r2 = returnValue[1];
						returnValue = exchange(g1, g2);
						g1 = returnValue[0];
						g2 = returnValue[1];
						returnValue = exchange(b1, b2);
						b1 = returnValue[0];
						b2 = returnValue[1];
					}
				}
				//console.log("x1", x1, "y1", y1,"x2", x2,"y2", y2,"z1", z1,"z2", z2);
				//console.log("flag",flag);
				
				for (var i = y1; i <= y2; i++){
					__Tem_pointbuffer = __Tem_pointbuffer.concat(Math.floor(x1 + (x2 - x1)/ (y2 - y1) * (i - y1))+ 0.5);
					__Tem_pointbuffer = __Tem_pointbuffer.concat(i + 0.5);
					__Tem_pointbuffer = __Tem_pointbuffer.concat(Math.floor(z1 + (z2 - z1) / (y2 - y1) * (i - y1)) + 0.5);
					//__PointBuffer = __PointBuffer.concat(Math.floor(z1 + (z2 - z1) / (y2 - y1) * (i - x1)));
					// 这个公式在之后还要进行变换
					if (__ColorFlag == 1){
						/*
						console.log("__ColorFlag",__ColorFlag);
						console.log("result",Math.floor(g1 + (g2 - g1) / (y2 - y1 ) * (i- y1)));
						console.log("x1", x1, "y1", y1, "z1", z1,"x2", x2,"y2", y2,"z2", z2,
						"r1", r1,"g1", g1,"b1", b1,"r2", r2,"g2", g2,"b2", b2,"flag", flag);
						console.log("(g2 - g1)",(g2 - g1));
						console.log("(y2 - y1 )",(y2 - y1 ));
						console.log("(i- y1)", (i- y1));
						*/
						__Tem_colorbuffer = __Tem_colorbuffer.concat(Math.floor(r1 + (r2 - r1) / (y2 - y1 ) * (i- y1)));
						__Tem_colorbuffer = __Tem_colorbuffer.concat(Math.floor(g1 + (g2 - g1) / (y2 - y1 ) * (i- y1)));
						__Tem_colorbuffer = __Tem_colorbuffer.concat(Math.floor(b1 + (b2 - b1) / (y2 - y1 ) * (i- y1)));
						//console.log("__Tem_colorbuffer",__Tem_colorbuffer);
					}
				}	
				
			break;
			case 3:
				returnValue = sort(z1, z2);
				z1 = returnValue[0];
				z2 = returnValue[1];
				t = returnValue[2];
				if (t == 1){
					returnValue = exchange(x1, x2);
					x1 = returnValue[0];
					x2 = returnValue[1];
					returnValue = exchange(y1, y2);
					y1 = returnValue[0];
					y2 = returnValue[1];
					if (__ColorFlag == 1){
						returnValue = exchange(r1, r2);
						r1 = returnValue[0];
						r2 = returnValue[1];
						returnValue = exchange(g1, g2);
						g1 = returnValue[0];
						g2 = returnValue[1];
						returnValue = exchange(b1, b2);
						b1 = returnValue[0];
						b2 = returnValue[1];
					}
				}
				for (var i = z1; i <= z2; i++){
					__Tem_pointbuffer = __Tem_pointbuffer.concat(Math.floor(x1 + (x2 - x1)/ (z2 - z1 ) * (i - z1)) + 0.5);
					__Tem_pointbuffer = __Tem_pointbuffer.concat(Math.floor(y1 + (y2 - y1) / (z2 - z1 ) * (i - z1)) + 0.5);
					__Tem_pointbuffer = __Tem_pointbuffer.concat(i + 0.5);
					// 这个公式在之后还要进行变换
					if (__ColorFlag == 1){
						__Tem_colorbuffer = __Tem_colorbuffer.concat(Math.floor(r1 + (r2 - r1) / (z2 - z1 ) * (i - z1)));
						__Tem_colorbuffer = __Tem_colorbuffer.concat(Math.floor(g1 + (g2 - g1) / (z2 - z1 ) * (i - z1)));
						__Tem_colorbuffer = __Tem_colorbuffer.concat(Math.floor(b1 + (b2 - b1) / (z2 - z1 ) * (i - z1)));
					}
				}	
			break;
			}
			return __Tem_pointbuffer;
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
