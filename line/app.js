var LineTest = function(type) {
    var ID = sender.getID();
    this.begin = function(canvas, cb, level) {
        var gl = getGL(canvas);
        if (type == 'normal') gl = getGL(canvas);
        else {
            canvas = getCanvas("can_aa");
            gl = getGLAA(canvas);
        }
        vetexID = 0;

        function getPoints(){
            var res = [];

            for (var x = 0; x < 256; x ++) {
                var y = 256 - 100 * Math.cos(2.0 * Math.PI * x / 100.0) + 30 * Math.cos(4.0 * Math.PI * x / 100.0) + 6 * Math.cos(6.0 * Math.PI * x / 100.0);
                res.push(x / 150 - 0.8, y / 200 - 1.4, 0);
            }
            return res;
        }


        /*======= Defining and storing the geometry ======*/
        var vertices = getPoints();
        vertices.push.apply(vertices, [
        -0.7,-0.1,0,
        -0.3,0.6,0,
        -0.3,-0.3,0,
        0.2,0.6,0,
        0.3,-0.3,0,
        0.7,0.6,0
            ]);

            // Create an empty buffer object


        // Create an empty buffer object
        var vertex_buffer = gl.createBuffer();

        // Bind appropriate array buffer to it
        gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);

        // Pass the vertex data to the buffer
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

        // Unbind the buffer
        gl.bindBuffer(gl.ARRAY_BUFFER, null);

        // console.log("vertices",vertices);

        /*=================== Shaders ====================*/

        // Vertex shader source code
        var vertCode = 
        'attribute vec2 coordinates;' +
            'void main(void) {' +
                ' gl_Position = vec4(coordinates, 0.0 , 1.0);' +
                ' gl_PointSize = 1.0;'+
                    '}';

                // Create a vertex shader object
                var vertShader = gl.createShader(gl.VERTEX_SHADER);

                // Attach vertex shader source code
                gl.shaderSource(vertShader, vertCode);

                // Compile the vertex shader
                gl.compileShader(vertShader);
                if (!gl.getShaderParameter(vertShader, gl.COMPILE_STATUS)) {
                    console.error('ERROR compiling vertex shader!',
                                  gl.getShaderInfoLog(vertShader));
                    return;
                  }

                // Fragment shader source code
                var fragCode =`
        precision mediump float;
        uniform ivec3 line_point[600];
        int division(int a, int b);
        int D_abs(int a, int b);
        int mod(int a, int b); 
        uniform sampler2D backtexture;
        struct txt_coord{
            int x, y;
          };
        vec4 col_transfer(ivec4 color); 
        ivec4 D_texture2D(sampler2D sampler,txt_coord t); 
        ivec4 cal_color(vec4 color0, vec4 color1, vec4 color2, vec4 color3, int wei_x, int wei_y); 
        void main(void) {
        int x0, y0 , x1, y1, x2, y2, k, b, y ;
        x0 = int(gl_FragCoord.x) ; 
        y0 = int(gl_FragCoord.y) ; 
        txt_coord fragTexCoord;
        fragTexCoord.x = x0;
        fragTexCoord.y = y0;
        //gl_FragColor = col_transfer( D_texture2D(backtexture, fragTexCoord));
        gl_FragColor = texture2D(backtexture,vec2( (gl_FragCoord.x)/256.0  ,  (gl_FragCoord.y )/256.0 ) ); 
        //gl_FragColor = vec4 (1.0, 0.0, 0.0, 1.0 );
        for (int i = 0 ; i < 600; i += 2){
            x1 = division( (line_point[i][0] + 1000) * 32 , 250);  
            y1 = division( (line_point[i][1] + 1000) * 32 , 250);  
            x2 = division( (line_point[i + 1][0] + 1000) * 32 , 250);  
            y2 = division( (line_point[i + 1][1] + 1000) * 32 , 250);   
            if ((x0 == x1) && (y0 == y1))
                gl_FragColor = vec4(0.9, 0.9, 0.9, 1.0);
            else{
                if (D_abs(x1,x2) > D_abs(y1,y2)){
                    k = division ( (y1 - y2) * 1000, (x1 - x2));
                    b = y1 * 1000 - k * x1;
                    if (x1 > x2){
                        x1 = x1 + x2;
                        x2 = x1 - x2;
                        x1 = x1 - x2;
                    }
                    for (int j = 0; j < 255; j++)
                        if ((j > x1) && (j < x2) && (x0 == j) && (y0 == division(k * x0 + b, 1000))  )
                            gl_FragColor = vec4(0.9, 0.9, 0.9, 1.0);
                }else{
                    k = division ( (x1 - x2) * 1000, (y1 - y2));
                    b = x1 * 1000 - k * y1;
                    if (y1 > y2){
                        y1 = y1 + y2;
                        y2 = y1 - y2;
                        y1 = y1 - y2;
                    }
                    for (int j = 0; j < 255; j++)
                        if ((j > y1) && (j < y2) && (y0 == j) && (x0 == division(k * y0 + b, 1000))  )
                            gl_FragColor = vec4(0.9, 0.9, 0.9, 1.0);
                
                }
                
            }
        
        }
        }
        int division(int a, int b){
            int n = a / b;
            if ( (n - 2) * b >= a )
              return (n - 3);
            else if ( (n - 1) * b >= a )
              return (n - 2);
            else if ( b * n >= a )
              return (n - 1);
            else if ( (n + 1) * b >= a )
              return n ;
            else
              return (n + 1);
          }
        int D_abs(int a, int b){
            if (a > b)
                return a - b;
            else
                return b - a;
          }
          ivec4 D_texture2D(sampler2D sampler,txt_coord t){
            int tx0, ty0, wei_x, wei_y;
            vec4 color0, color1, color2, color3;
            tx0 = division ( t.x, 1000);
            ty0 = division ( t.y, 1000);
            color0 = texture2D(sampler, vec2 ( float(tx0    )/ 255.0 , float(ty0     )/ 255.0));
            color1 = texture2D(sampler, vec2 ( float(tx0 + 1)/ 255.0 , float(ty0     )/ 255.0));
            color2 = texture2D(sampler, vec2 ( float(tx0    )/ 255.0 , float(ty0  + 1)/ 255.0));
            color3 = texture2D(sampler, vec2 ( float(tx0 + 1)/ 255.0 , float(ty0  + 1)/ 255.0));
          
            wei_x = mod (t.x, 1000);
            wei_y = mod (t.y, 1000);
            return cal_color(color0, color1, color2, color3, wei_x, wei_y);
          }
          
          ivec4 cal_color(vec4 color0, vec4 color1, vec4 color2, vec4 color3, int wei_x, int wei_y){
            int r, g, b;
            r = division( int(color0[0] * 255.0) * (1000 - wei_x) * (1000 - wei_y) + int(color1[0] * 255.0) * wei_x * (1000 - wei_y) + int(color2[0] * 255.0) * (1000 - wei_x) * wei_y + int(color3[0] * 255.0) * wei_x * wei_y, 1000000);
            g = division( int(color0[1] * 255.0) * (1000 - wei_x) * (1000 - wei_y) + int(color1[1] * 255.0) * wei_x * (1000 - wei_y) + int(color2[1] * 255.0) * (1000 - wei_x) * wei_y + int(color3[1] * 255.0) * wei_x * wei_y, 1000000);
            b = division( int(color0[2] * 255.0) * (1000 - wei_x) * (1000 - wei_y) + int(color1[2] * 255.0) * wei_x * (1000 - wei_y) + int(color2[2] * 255.0) * (1000 - wei_x) * wei_y + int(color3[2] * 255.0) * wei_x * wei_y, 1000000);
            return ivec4( r, g, b, 100 );
          }
        vec4 col_transfer( ivec4 c){
            return vec4 (  float(c[0])/255.0, float(c[1])/255.0, float(c[2])/255.0, float(c[3])/ 100.0);
        }
        int mod(int a, int b){
            int n = a / b;
            if ( (n - 2) * b >= a )
              return a - (n - 3) * b;
            else if ( (n - 1) * b >= a )
              return a - (n - 2) * b;
            else if ( b * n >= a )
              return a - (n - 1) * b;
            else if ( (n + 1) * b >= a )
              return a - n * b;
            else
              return a - (n + 1) * b;
          }
`;
                    // Create fragment shader object
                    var fragShader = gl.createShader(gl.FRAGMENT_SHADER);

                    // Attach fragment shader source code
                    gl.shaderSource(fragShader, fragCode);

                    // Compile the fragmentt shader
                    gl.compileShader(fragShader);
                    if (!gl.getShaderParameter(fragShader, gl.COMPILE_STATUS)) {
                        console.error('ERROR compiling fragment shader!',
                                      gl.getShaderInfoLog(fragShader));
                        return;
                      }

                    // Create a shader program object to store
                    // the combined shader program
                    var shaderProgram = gl.createProgram();

                    // Attach a vertex shader
                    gl.attachShader(shaderProgram, vertShader);

                    // Attach a fragment shader
                    gl.attachShader(shaderProgram, fragShader);

                    // Link both the programs
                    gl.linkProgram(shaderProgram);

                    // Use the combined shader program object
                    gl.useProgram(shaderProgram);

                    /*======= Associating shaders to buffer objects ======*/

                    // Bind vertex buffer object
                    gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);

                    // Get the attribute location
                    var coord = gl.getAttribLocation(shaderProgram, "coordinates");

                    // Point an attribute to the currently bound VBO
                    gl.vertexAttribPointer(coord, 3, gl.FLOAT, false, 0, 0);

                    // Enable the attribute
                    gl.enableVertexAttribArray(coord);

                    /*============ Drawing the triangle =============*/

                    // Clear the canvas
                    gl.clearColor(0, 0, 0, 1.0);

                    // Enable the depth test
                    gl.enable(gl.DEPTH_TEST);

                    // Clear the color and depth buffer
                    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT );

                    // Set the view port
                    gl.viewport(0, 0, canvas.width, canvas.height);

                    // Draw the triangle
                    //gl.drawArrays(gl.LINES, 0, 256);
                    
                    

                    gl.drawArrays(gl.LINE_STRIP, 0, 256);
                    gl.drawArrays(gl.LINES, 256, 6);


                    sender.getData(canvas, ID);
                    cb(level);
                }
                // POINTS, LINE_STRIP, LINE_LOOP, LINES,
                // TRIANGLE_STRIP,TRIANGLE_FAN, TRIANGLES
            }