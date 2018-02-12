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


getCanvas = function(canvasName) {
  var canvas = $('#' + canvasName);
  if(!canvas[0]){
      $('#test_canvases').append("<canvas id='" + canvasName + "' width='256' height='256'></canvas>");
  }
  return canvas = $('#' + canvasName)[0];
}

rewrite = function(gl){
			__texture_flag = 1;
			__My_index_flag = 0;  
      __PointBuffer = [];
      __ColorBuffer = [];
      __Tem_pointbuffer = [];
      __Tem_colorbuffer = [];
      __ActiveBuffer_vertex = [];
      __ActiveBuffer_frag = [];
      

	__My_buffer_flag = 1;
	//去判断这个是一个是那么状态
	gl.my_glbufferData = gl.__proto__.bufferData;
	gl.bufferData = function (a, b, c){
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

		
		//将数据分到位置和颜色
		/*
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
		*/
		//console.log("完成");
		//console.log("__ActiveBuffer_vertex", __ActiveBuffer_vertex);
		//console.log("__ActiveBuffer_vertex_texture", __ActiveBuffer_vertex_texture);
		//console.log("__ActiveBuffer_vertex_normal", __ActiveBuffer_vertex_normal);
	}
	


	gl.my_useProgram =  gl.__proto__.useProgram;
	gl.useProgram = function(a){
		__Program = a;
		this.my_useProgram(a);
		//console.log("__ActiveBuffer_vertex",__ActiveBuffer_vertex);
		//console.log("__ActiveBuffer_frag",__ActiveBuffer_frag);
	}

	//gl.my_drawElements = gl.__proto__.drawElements;
	AAA = function (a , b, c, d){
	  // 这里暂时默认是三角形
	  BBB(a , 0, b);
	  //console.log("my_drawElements  b * 3", b * 3);
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
		


		/* =================================================================================================*/
/*		
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
*/







/*===================================================================================================*/
	/*
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
		*/
		/*
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
		*/
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