precision mediump float;
uniform ivec3 tri_point[333];
uniform ivec2 text_point[333];
uniform sampler2D sampler;
struct tri_p {
  int x0, y0, x1, y1, z1, x2, y2, z2, x3,  y3, z3;
};
struct txt_p {
  int x0, y0, x1, y1, x2, y2, x3,  y3;
};
#define uniformNumber 336
#define init tri_p tri; txt_p fragTexCoord; int z; z = -512;gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);int z0;
#define assign tri.x0 = int(gl_FragCoord.x); tri.y0 = int(gl_FragCoord.y); tri.x1 = tri_point[i][0]; tri.y1 = tri_point[i][1]; tri.z1 = tri_point[i][2]; tri.x2 = tri_point[i+1][0]; tri.y2 = tri_point[i+1][1]; tri.z2 = tri_point[i+1][2]; tri.x3 = tri_point[i+2][0]; tri.y3 = tri_point[i+2][1]; tri.z3 = tri_point[i+2][2];
int judge(tri_p t);
int PinAB(int tx0, int ty0, int tx1, int ty1, int tx2, int ty2);   
int cal_z(tri_p tri);
int division(int a, int b);  
vec4 D_texture2D(sampler2D sampler, txt_p f, tri_p tri);           
                
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
int kb, kc; kb = tx0*ty1 - tx1*ty0; kc = tx0*ty2 - tx2*ty0;if  ( ((0 > kb ) && (0 < kc )) || ((0 < kb ) && (0 > kc)) ) {return 1;} return 0; 
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
  if ( (b - 2) * n >= a )
    return (b - 2);
  else if ( (b - 1) * n >= a )
    return (b - 1);
  else if ( b * n >= a )
    return b;
  else if ( (b + 1) * n >= a )
    return (b + 1);
  else
    return (b + 2);
}

vec4 D_texture2D(sampler2D sampler, txt_p f, tri_p t){
  int bcs1, bcs2, bcs3, cs1, cs2, cs3, wei_1, wei_2, wei_3;
  bcs1 = (t.x0 * t.y2 + t.x2 * t.y3 + t.x3 * t.y0) - (t.x3 * t.y2 + t.x2 * t.y0 + t.x0 * t.y3);
  cs1 =  (t.x1 * t.y2 + t.x2 * t.y3 + t.x3 * t.y1) - (t.x3 * t.y2 + t.x2 * t.y1 + t.x1 * t.y3);
  wei_1 = division(bcs1 * 1000, cs1);

  bcs2 = (t.x1 * t.y0 + t.x0 * t.y3 + t.x3 * t.y1) - (t.x3 * t.y0 + t.x0 * t.y1 + t.x1 * t.y3);
  cs2 =  (t.x1 * t.y2 + t.x2 * t.y3 + t.x3 * t.y1) - (t.x3 * t.y2 + t.x2 * t.y1 + t.x1 * t.y3);
  wei_2 = division(bcs2 * 1000, cs2);

  bcs3 = (t.x1 * t.y2 + t.x2 * t.y0 + t.x0 * t.y1) - (t.x0 * t.y2 + t.x2 * t.y1 + t.x1 * t.y0);
  cs3 =  (t.x1 * t.y2 + t.x2 * t.y3 + t.x3 * t.y1) - (t.x3 * t.y2 + t.x2 * t.y1 + t.x1 * t.y3);
  wei_3 = division(bcs3 * 1000, cs3);

  //wei_1 = 724;
  //wei_2 = 21;
  //wei_3 = 12;
  return vec4(float(wei_1) / 500.0, float(wei_2) / 200.0,float(wei_3) / 500.0, 1.0   );
  //return vec4( float( division(wei_1, 255) * 255 - wei_1 ) /  255.0, float( division(wei_2, 255) * 255 - wei_2 ) /  255.0 ,float( division(wei_3, 255) * 255 - wei_3 ) /  255.0  , 1.0 );
  //return texture2D(sampler, vec2 ( float( division(wei_1, 255) * 255 - wei_1 ) /  255.0, float( division(wei_2, 255) * 255 - wei_2 ) /  255.0 ));
  //return texture2D(sampler, vec2 ( float(t.x1)/255.0, float(t.y1)/255.0 ));
}