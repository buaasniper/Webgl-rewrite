
var vertCode =
'attribute vec2 vertPosition;' +
'void main(void) {' +
'gl_Position =  vec4(vertPosition, 0.0, 1.0);'+
   'gl_PointSize = 1.0;'+
'}';

var fragCode =`
precision mediump float;
#define uniformNumber 336
uniform ivec3 tri_point[333];
uniform ivec3 tri_color[333];
uniform int tri_number;
struct tri_p {
  int x0, y0, x1, y1, z1, x2, y2, z2, x3,  y3, z3;
};
struct txt_p {
  int x1, y1, x2, y2, x3,  y3;
};
struct col_p {
  int r1, g1, b1, r2, g2, b2, r3, g3, b3;
};
struct col{
  int r, g, b;
};
struct txt_coord{
  int x, y;
};

#define init tri_p tri; col_p colorrgb; ivec3 colrgb; int z; z = -512;gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);int z0; 
#define assign tri.x0 = int(gl_FragCoord.x); tri.y0 = int(gl_FragCoord.y); tri.x1 = tri_point[i][0]; tri.y1 = tri_point[i][1]; tri.z1 = tri_point[i][2]; tri.x2 = tri_point[i+1][0]; tri.y2 = tri_point[i+1][1]; tri.z2 = tri_point[i+1][2]; tri.x3 = tri_point[i+2][0]; tri.y3 = tri_point[i+2][1]; tri.z3 = tri_point[i+2][2];    colorrgb.r1 = tri_color[i][0]; colorrgb.g1 = tri_color[i][1]; colorrgb.b1 = tri_color[i][2]; colorrgb.r2 = tri_color[i+1][0]; colorrgb.g2 = tri_color[i+1][1]; colorrgb.b2 = tri_color[i+1][2]; colorrgb.r3 = tri_color[i+2][0]; colorrgb.g3 = tri_color[i+2][1]; colorrgb.b3 = tri_color[i+2][2];
#define changePosition tri = changevalue(tri); 
#define cal_Zbuffer z0 = cal_z(tri);
#define pixel_on_triangle ( i < (tri_number * 3) ) && (judge(tri) == 1)
#define draw_pixel (z0 >= -512) && (z0 <= 512) && (z0 > z)
#define renew_Zbuffer z = z0; colrgb = calCoord(colorrgb, tri);
int judge(tri_p t);
int f_judge(tri_p t);
int PinAB(int tx0, int ty0, int tx1, int ty1, int tx2, int ty2);   
int f_PinAB(float tx0, float ty0, float tx1, float ty1, float tx2, float ty2);
int cal_z(tri_p tri);
int division(int a, int b);  
int mod(int a, int b);  
int isqrt(int a);
int D_dot(ivec3 x, ivec3 y);
int D_max(int a, int b);
int D_multiple(int a, int b);
ivec3 D_multiple(ivec3 x, int b);
ivec3 D_multiple(ivec3 x, ivec3 y);
ivec3 D_division(ivec3 x, int y);
int D_division(int x, int y);
tri_p changevalue(tri_p tri);
int  wei_1, wei_2, wei_3;


txt_coord calCoord(txt_p f, tri_p t);
ivec3 calCoord(col_p f, tri_p t);
ivec4 D_texture2D(sampler2D sampler,txt_coord t); 
ivec4 cal_color(vec4 color0, vec4 color1, vec4 color2, vec4 color3, int wei_x, int wei_y); 
ivec3 D_normalize(ivec3 a);
vec4 col_transfer(ivec4 color); 
vec4 col_transfer(ivec3 color, int a); 

// r,g,b 0 - 255   a 0 - 100                 
void main()
{
  init;
  for (int i = 0; i < uniformNumber; i+= 3){
    assign;
    changePosition;
    if ( pixel_on_triangle ){
        cal_Zbuffer;
      if ( draw_pixel ){
        renew_Zbuffer;
        gl_FragColor = vec4 (col_transfer( colrgb, 100));
      } 
    }
  } 
}

int judge(tri_p t) {
    if (( PinAB(t.x0 - t.x1, t.y0 - t.y1, t.x2 - t.x1, t.y2 - t.y1, t.x3 - t.x1, t.y3 - t.y1)+ PinAB(t.x0 - t.x2, t.y0 - t.y2, t.x3 - t.x2, t.y3 - t.y2, t.x1 - t.x2, t.y1 - t.y2) 
    + PinAB(t.x0 - t.x3, t.y0 - t.y3, t.x2 - t.x3, t.y2 - t.y3, t.x1 - t.x3, t.y1 - t.y3) == 3)  )
      {return 1;}
    else
      {return 0;}
}

int PinAB(int tx0, int ty0, int tx1, int ty1, int tx2, int ty2){ 
int kb, kc; kb = tx0*ty1 - tx1*ty0; kc = tx0*ty2 - tx2*ty0;
if  ( ((0 >= kb ) && (0 <= kc )) || ((0  <= kb ) && (0 >= kc)) ) 
  return 1;
  return 0;
}

int f_judge(tri_p t){
  if ( f_PinAB( float(t.x0 - t.x1), float(t.y0 - t.y1), float(t.x2 - t.x1), float(t.y2 - t.y1), float(t.x3 - t.x1), float(t.y3 - t.y1))
     + f_PinAB( float(t.x0 - t.x2), float(t.y0 - t.y2), float(t.x3 - t.x2), float(t.y3 - t.y2), float(t.x1 - t.x2), float(t.y1 - t.y2)) 
     + f_PinAB( float(t.x0 - t.x3), float(t.y0 - t.y3), float(t.x2 - t.x3), float(t.y2 - t.y3), float(t.x1 - t.x3), float(t.y1 - t.y3))
    == 3){return 1;}
  else{return 0;}
}

int f_PinAB(float tx0, float ty0, float tx1, float ty1, float tx2, float ty2){ 
  float kb, kc; kb = tx0*ty1 - tx1*ty0; kc = tx0*ty2 - tx2*ty0;
  if  ( ((0.0001 > kb) && (-0.0001 < kc)) || ((-0.0001 < kb) && (0.0001 > kc)) ) {return 1;} return 0; 
}

int cal_z(tri_p t){
  int A, B, C , D , K;
  A = (t.y3 - t.y1)*(t.z3 - t.z1) - (t.z2 - t.z1)*(t.y3 - t.y1);
  B = (t.x3 - t.x1)*(t.z2 - t.z1) - (t.x2 - t.x1)*(t.z3 - t.z1);
  C = (t.x2 - t.x1)*(t.y3 - t.y1) - (t.x3 - t.x1)*(t.y2 - t.y1);
  D = -1 * (A * t.x1 + B * t.y1 + C * t.z1);
  return (-1 *  division( (A * t.x0 + B * t.y0 + D) , C));
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

txt_coord calCoord(txt_p f, tri_p t){
  txt_coord tt;
  int bcs1, bcs2, bcs3, cs1, cs2, cs3;
  bcs1 = (t.x0 * t.y2 + t.x2 * t.y3 + t.x3 * t.y0) - (t.x3 * t.y2 + t.x2 * t.y0 + t.x0 * t.y3);
  cs1 =  (t.x1 * t.y2 + t.x2 * t.y3 + t.x3 * t.y1) - (t.x3 * t.y2 + t.x2 * t.y1 + t.x1 * t.y3);
  wei_1 = division(bcs1 * 1000, cs1);

  bcs2 = (t.x1 * t.y0 + t.x0 * t.y3 + t.x3 * t.y1) - (t.x3 * t.y0 + t.x0 * t.y1 + t.x1 * t.y3);
  cs2 =  (t.x1 * t.y2 + t.x2 * t.y3 + t.x3 * t.y1) - (t.x3 * t.y2 + t.x2 * t.y1 + t.x1 * t.y3);
  wei_2 = division(bcs2 * 1000, cs2);

  bcs3 = (t.x1 * t.y2 + t.x2 * t.y0 + t.x0 * t.y1) - (t.x0 * t.y2 + t.x2 * t.y1 + t.x1 * t.y0);
  cs3 =  (t.x1 * t.y2 + t.x2 * t.y3 + t.x3 * t.y1) - (t.x3 * t.y2 + t.x2 * t.y1 + t.x1 * t.y3);
  wei_3 = division(bcs3 * 1000, cs3);
  // 在这里还是256000这样一个系数

  f.x1 = division( f.x1 * 51, 200);
  f.y1 = division( f.y1 * 51, 200);
  f.x2 = division( f.x2 * 51, 200);
  f.y2 = division( f.y2 * 51, 200);
  f.x3 = division( f.x3 * 51, 200);
  f.y3 = division( f.y3 * 51, 200); 

  tt.x = wei_1 * f.x1 + wei_2 * f.x2 + wei_3 * f.x3;
  tt.y = wei_1 * f.y1 + wei_2 * f.y2 + wei_3 * f.y3;
  return tt;
}

ivec3 calCoord(col_p f, tri_p t){
  col tt;
  int bcs1, bcs2, bcs3, cs1, cs2, cs3;
  bcs1 = (t.x0 * t.y2 + t.x2 * t.y3 + t.x3 * t.y0) - (t.x3 * t.y2 + t.x2 * t.y0 + t.x0 * t.y3);
  cs1 =  (t.x1 * t.y2 + t.x2 * t.y3 + t.x3 * t.y1) - (t.x3 * t.y2 + t.x2 * t.y1 + t.x1 * t.y3);
  wei_1 = division(bcs1 * 1000, cs1);

  bcs2 = (t.x1 * t.y0 + t.x0 * t.y3 + t.x3 * t.y1) - (t.x3 * t.y0 + t.x0 * t.y1 + t.x1 * t.y3);
  cs2 =  (t.x1 * t.y2 + t.x2 * t.y3 + t.x3 * t.y1) - (t.x3 * t.y2 + t.x2 * t.y1 + t.x1 * t.y3);
  wei_2 = division(bcs2 * 1000, cs2);

  bcs3 = (t.x1 * t.y2 + t.x2 * t.y0 + t.x0 * t.y1) - (t.x0 * t.y2 + t.x2 * t.y1 + t.x1 * t.y0);
  cs3 =  (t.x1 * t.y2 + t.x2 * t.y3 + t.x3 * t.y1) - (t.x3 * t.y2 + t.x2 * t.y1 + t.x1 * t.y3);
  wei_3 = division(bcs3 * 1000, cs3);
  // 在这里还是256000这样一个系数

  f.r1 = division( f.r1 * 51, 200);
  f.g1 = division( f.g1 * 51, 200);
  f.b1 = division( f.b1 * 51, 200);
  f.r2 = division( f.r2 * 51, 200);
  f.g2 = division( f.g2 * 51, 200);
  f.b2 = division( f.b2 * 51, 200);
  f.r3 = division( f.r3 * 51, 200);
  f.g3 = division( f.g3 * 51, 200);
  f.b3 = division( f.b3 * 51, 200);

  tt.r = division( wei_1 * f.r1 + wei_2 * f.r2 + wei_3 * f.r3, 1000);
  tt.g = division( wei_1 * f.g1 + wei_2 * f.g2 + wei_3 * f.g3, 1000);
  tt.b = division( wei_1 * f.b1 + wei_2 * f.b2 + wei_3 * f.b3, 1000);

  return ivec3(tt.r, tt.g, tt.b);

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


vec4 col_transfer(ivec3 c, int a){
  return vec4 (  float(c[0])/255.0, float(c[1])/255.0, float(c[2])/255.0, float(a)/ 100.0);
}

ivec3 D_normalize(ivec3 a){
  int rate = isqrt (division(100000000, a[0] * a[0] + a[1] * a[1] + a[2] * a[2])) ;
  return ivec3(division(a[0] * rate, 10), division(a[1] * rate,10), division(a[2] * rate,10));
}

int isqrt(int a){
  for (int i = 0; i < 1000; i++)
    if (i * i >= a)
      return i;
}

ivec3 D_multiple(ivec3 x, int b)
{
  return ivec3(division(x[0] * b,1000), division(x[1] * b,1000), division(x[2] * b,1000));
}

ivec3 D_multiple(ivec3 x, ivec3 y)
{
  return ivec3(division(x[0] * y[0],1000), division(x[1] * y[1],1000), division(x[2] * y[2],1000));
}

ivec3 D_division(ivec3 x, int y)
{
  return ivec3(division(x[0],y), division(x[1],y), division(x[2],y));
}

int D_max(int a, int b)
{
  if (a > b)
    return a;
  else
    return b;
}

int D_dot(ivec3 x, ivec3 y)
{
  int sum = 0;
  for (int i = 0; i < 3; i++)
  {
    sum += x[i] * y[i];
  }
  return division(sum, 1000);
}

tri_p changevalue(tri_p t)
{
  t.x1 = division( (t.x1 + 1000) * 32, 250);
  t.y1 = division( (t.y1 + 1000) * 32, 250);
  t.z1 = division( (t.z1 + 1000) * 32, 250);
  t.x2 = division( (t.x2 + 1000) * 32, 250);
  t.y2 = division( (t.y2 + 1000) * 32, 250);
  t.z2 = division( (t.z2 + 1000) * 32, 250);
  t.x3 = division( (t.x3 + 1000) * 32, 250);
  t.y3 = division( (t.y3 + 1000) * 32, 250);
  t.z3 = division( (t.z3 + 1000) * 32, 250);
  return t;
}



`
;

var CameraTest = function() {
    var ID = sender.getID();
    this.begin = function(canvas, cb, level) {
        var gl = getGL(canvas);
/*
        __texture_flag = 0;
    __My_index_flag = 0;  
    __PointBuffer = [];
    __ColorBuffer = [];
    __Tem_pointbuffer = [];
    __Tem_colorbuffer = [];
    __ActiveBuffer_vertex = [];
    __ActiveBuffer_frag = [];
    __ColorFlag = 1;  // 0代表不需要颜色，1代表需要颜色。
    __Mworld_flag = 1;
    __Mview_flag = 1;
    __Mpro_flag = 1;
    __Drawnumber = 1
    */
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
    gl.shaderSource(fragmentShader, fragCode);

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
/*  

    var boxIndices = [0, 1, 2, 0, 2, 3,3]; */ 
    var boxVertexBufferObject = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, boxVertexBufferObject);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(boxVertices), gl.STATIC_DRAW);

    var boxIndexBufferObject = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, boxIndexBufferObject);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(boxIndices),
                  gl.STATIC_DRAW);

    //出现了这种特殊情况，需要加入这种特殊情况
    gl.bindBuffer(gl.ARRAY_BUFFER, boxVertexBufferObject);
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
    mat4.lookAt(viewMatrix, [ 2,1,-5 ], [ 0, 0, 0 ], [ 0, 1, 0 ]);
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
    //   mat4.copy(__Mworld, worldMatrix);
    //   mat4.transpose(__Mworld, __Mworld);
    //   mat4.transpose(__Mview, __Mview);
    //   mat4.transpose(__Matrix0, __Matrix0);
    //   mat4.mul(__Mview, __Mview, __Matrix0);
      //console.log("第一次计算", __Mview);
      //mat4.mul(__Mworld, __Mworld, __Mview);
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
      //__Matrix1 = my_m4.projection(gl.canvas.clientWidth, gl.canvas.clientHeight, 256);
      //console.log("__Mworld", __Mworld);
      //console.log("__Mview", __Mview);
      //console.log("__Matrix0", __Matrix0);



      //    gl.clearColor(1.0, 1.0, 1.0, 1.0);
      gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);
      gl.drawElements(gl.TRIANGLES, boxIndices.length, gl.UNSIGNED_SHORT, 0);
        if (count == 20) {
                sender.getData(canvas, ID);
                cancelAnimationFrame(frame);
                cb(level);
            }
        };
        requestAnimationFrame(loop);
    };
};
