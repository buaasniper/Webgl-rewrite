precision mediump float;
uniform ivec3 tri_point[333];
uniform ivec2 text_point[333];
uniform sampler2D sampler;
struct tri_p {
  int x0, y0, x1, y1, z1, x2, y2, z2, x3,  y3, z3;
};
struct txt_p {
  int x1, y1, x2, y2, x3,  y3;
};
#define uniformNumber 336
#define init tri_p tri; txt_p fragTexCoord; int z; z = -512;gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);int z0;
#define assign tri.x0 = int(gl_FragCoord.x); tri.y0 = int(gl_FragCoord.y); tri.x1 = tri_point[i][0]; tri.y1 = tri_point[i][1]; tri.z1 = tri_point[i][2]; tri.x2 = tri_point[i+1][0]; tri.y2 = tri_point[i+1][1]; tri.z2 = tri_point[i+1][2]; tri.x3 = tri_point[i+2][0]; tri.y3 = tri_point[i+2][1]; tri.z3 = tri_point[i+2][2];fragTexCoord.x1 = text_point[i][0]; fragTexCoord.y1 = text_point[i][1];fragTexCoord.x2 = text_point[i+1][0]; fragTexCoord.y2 = text_point[i+1][1];fragTexCoord.x3 = text_point[i+2][0]; fragTexCoord.y3 = text_point[i+2][1];
int judge(tri_p t);
int PinAB(int tx0, int ty0, int tx1, int ty1, int tx2, int ty2);   
int cal_z(tri_p tri);
int division(int a, int b);  
int mod(int a, int b);  
vec4 D_texture2D(sampler2D sampler, txt_p f, tri_p tri);    
vec4 cal_color(vec4 color0, vec4 color1, vec4 color2, vec4 color3, int wei_x, int wei_y);       
                
void main()
{
  init;
  for (int i = 0; i < uniformNumber; i+= 3){
    assign;
    if (judge(tri) == 1){
      z0 = cal_z(tri);
      if ( (z0 >= -512) && (z0 <= 512) && (z0 > z)){
        z = z0;
        //gl_FragColor = texture2D(sampler, vec2 ( float(tri.x1)/255.0, float(tri.y1)/255.0 ));
        gl_FragColor = D_texture2D(sampler, fragTexCoord, tri);
      } 
    }
  } 
}

int judge(tri_p t) {
    if ( PinAB(t.x0 - t.x1, t.y0 - t.y1, t.x2 - t.x1, t.y2 - t.y1, t.x3 - t.x1, t.y3 - t.y1)+ PinAB(t.x0 - t.x2, t.y0 - t.y2, t.x3 - t.x2, t.y3 - t.y2, t.x1 - t.x2, t.y1 - t.y2) + PinAB(t.x0 - t.x3, t.y0 - t.y3, t.x2 - t.x3, t.y2 - t.y3, t.x1 - t.x3, t.y1 - t.y3) == 3){return 1;}else{return 0;}
}

int PinAB(int tx0, int ty0, int tx1, int ty1, int tx2, int ty2){ 
int kb, kc; kb = tx0*ty1 - tx1*ty0; kc = tx0*ty2 - tx2*ty0;if  ( ((0 >= kb ) && (0 <= kc )) || ((0 <= kb ) && (0 >= kc)) ) {return 1;} return 0; 
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

vec4 D_texture2D(sampler2D sampler, txt_p f, tri_p t){
  int bcs1, bcs2, bcs3, cs1, cs2, cs3, wei_1, wei_2, wei_3, tx, ty, tx0, ty0, wei_x, wei_y;
  vec4 color0, color1, color2, color3;
  bcs1 = (t.x0 * t.y2 + t.x2 * t.y3 + t.x3 * t.y0) - (t.x3 * t.y2 + t.x2 * t.y0 + t.x0 * t.y3);
  cs1 =  (t.x1 * t.y2 + t.x2 * t.y3 + t.x3 * t.y1) - (t.x3 * t.y2 + t.x2 * t.y1 + t.x1 * t.y3);
  wei_1 = division(bcs1 * 1000, cs1);

  bcs2 = (t.x1 * t.y0 + t.x0 * t.y3 + t.x3 * t.y1) - (t.x3 * t.y0 + t.x0 * t.y1 + t.x1 * t.y3);
  cs2 =  (t.x1 * t.y2 + t.x2 * t.y3 + t.x3 * t.y1) - (t.x3 * t.y2 + t.x2 * t.y1 + t.x1 * t.y3);
  wei_2 = division(bcs2 * 1000, cs2);

  bcs3 = (t.x1 * t.y2 + t.x2 * t.y0 + t.x0 * t.y1) - (t.x0 * t.y2 + t.x2 * t.y1 + t.x1 * t.y0);
  cs3 =  (t.x1 * t.y2 + t.x2 * t.y3 + t.x3 * t.y1) - (t.x3 * t.y2 + t.x2 * t.y1 + t.x1 * t.y3);
  wei_3 = division(bcs3 * 1000, cs3);
  // 在这里还是25600这样一个系数
  tx = division (wei_1 * f.x1 + wei_2 * f.x2 + wei_3 * f.x3, 100);
  ty = division (wei_1 * f.y1 + wei_2 * f.y2 + wei_3 * f.y3, 100);

  tx0 = division (wei_1 * f.x1 + wei_2 * f.x2 + wei_3 * f.x3, 1000);
  ty0 = division (wei_1 * f.y1 + wei_2 * f.y2 + wei_3 * f.y3, 1000);
  color0 = texture2D(sampler, vec2 ( float(tx0    )/ 255.0 , float(ty0     )/ 255.0));
  color1 = texture2D(sampler, vec2 ( float(tx0 + 1)/ 255.0 , float(ty0     )/ 255.0));
  color2 = texture2D(sampler, vec2 ( float(tx0    )/ 255.0 , float(ty0  + 1)/ 255.0));
  color3 = texture2D(sampler, vec2 ( float(tx0 + 1)/ 255.0 , float(ty0  + 1)/ 255.0));
  wei_x = mod (tx, 10);
  wei_y = mod (ty, 10);
  //return vec4( float(wei_x * 2) / 255.0, float(wei_y * 2) / 255.0, 0.0, 1.0  );
  //return (color0 * float((100 - wei_x) * (100 - wei_y)) + color1 * float(wei_x * (100 - wei_y)) + color2 * float((100 - wei_x) *  wei_y) + color3 * float(wei_x * wei_y)) / 10000.0; 
  //return texture2D(sampler, vec2 ( float(tx)/255.0, float(ty)/255.0 ));
  //return vec4( float( mod (wei_1, 255 )) / 255.0, float( mod (wei_2, 255 )) / 255.0, float( mod (wei_3, 255 )) / 255.0, 1.0  );
  int t1, t2, t3;
  t1 = int( color2[0] * 255.0);
  t2 = int( color2[1] * 255.0);
  t3 = int( color2[2] * 255.0);
  //return vec4 ( float(t1)/255.0, float(t2)/255.0,float(t3)/255.0, 1.0   );
  return vec4(1.0, 0.0, 0.0, 1.0);
  //return cal_color(color0, color1, color2, color3, wei_x, wei_y);
}

vec4 cal_color(vec4 color0, vec4 color1, vec4 color2, vec4 color3, int wei_x, int wei_y){
  int r, g, b;
  r = division( int(color0[0] * 255.0) * (10 - wei_x) * (10 - wei_y) + int(color1[0] * 255.0) * wei_x * (10 - wei_y) + int(color2[0] * 255.0) * (10 - wei_x) * wei_y + int(color3[0] * 255.0) * wei_x * wei_y, 100);
  g = division( int(color0[1] * 255.0) * (10 - wei_x) * (10 - wei_y) + int(color1[1] * 255.0) * wei_x * (10 - wei_y) + int(color2[1] * 255.0) * (10 - wei_x) * wei_y + int(color3[1] * 255.0) * wei_x * wei_y, 100);
  b = division( int(color0[2] * 255.0) * (10 - wei_x) * (10 - wei_y) + int(color1[2] * 255.0) * wei_x * (10 - wei_y) + int(color2[2] * 255.0) * (10 - wei_x) * wei_y + int(color3[2] * 255.0) * wei_x * wei_y, 100);
  return vec4( float(r)/255.0 , float(g)/255.0, float(b)/255.0, 1.0 );
}