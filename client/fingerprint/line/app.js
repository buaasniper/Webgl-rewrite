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

        console.log("vertices",vertices);

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
                var fragCode =
        'precision mediump float;' +
        'float round(float x);'+
        'uniform vec3 line_point[600];' +
        'void main(void) {' +
        'float x0, y0 , x1, y1, x2, y2, k, b, y;'+
        'x0 = gl_FragCoord.x * 1.0; y0 = gl_FragCoord.y * 1.0; '+
        'gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);'+
        'for (int i = 0 ; i < 600; i += 2){'+
            'x1 = line_point[i][0];   y1 = line_point[i][1];  '+
            'x2 = line_point[i+1][0]; y2 = line_point[i+1][1]; '+
            'if (((x1 - x0) * (x2 - x0) < 0.0001) && ((y1 - y0) * (y2 - y0) < 0.0001)){' +
                'k = (y2 - y1)/ (x2 - x1); y = y1 + (x0 - x1) * k; if (abs(y0 - y) < 1.0) {gl_FragColor = vec4(0.9, 0.9, 0.9, 1.0);}'+
            '}'+
        
   '}'+
'}' 
;
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
                    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

                    // Set the view port
                    gl.viewport(0, 0, canvas.width, canvas.height);

                    // Draw the triangle
                    //gl.drawArrays(gl.LINES, 0, 256);
                    
                    gl.drawArrays(gl.LINE_STRIP, 0, 262);
                    //gl.drawArrays(gl.LINES, 256, 6);


                    //gl.drawArrays(gl.LINES, 0, 6);

                    dataURL = canvas.toDataURL('image/png', 1.0);
                    console.log("Line test result:", calcSHA1(dataURL));
                    //console.log(dataURL);
                    sender.getData(gl, ID);
                    cb(level);
                }
                // POINTS, LINE_STRIP, LINE_LOOP, LINES,
                // TRIANGLE_STRIP,TRIANGLE_FAN, TRIANGLES
            }
