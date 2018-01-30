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
#define init tri_p tri; txt_p fragTexCoord; int z; z = -512;gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
#define assign tri.x0 = int(gl_FragCoord.x); tri.y0 = int(gl_FragCoord.y); tri.x1 = tri_point[i][0]; tri.y1 = tri_point[i][1]; tri.z1 = tri_point[i][2]; tri.x2 = tri_point[i+1][0]; tri.y2 = tri_point[i+1][1]; tri.z2 = tri_point[i+1][2]; tri.x3 = tri_point[i+2][0]; tri.y3 = tri_point[i+2][1]; tri.z3 = tri_point[i+2][2];
int judge(tri_p t);
int PinAB(int tx0, int ty0, int tx1, int ty1, int tx2, int ty2);                
                
void main()
{
  init;
  for (int i = 0; i < uniformNumber; i+= 3){
    assign;
    if (judge(tri) == 1){
      gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
    }
  }
  
  
}

int judge(tri_p t) {
    if ( PinAB(t.x0 - t.x1, t.y0 - t.y1, t.x2 - t.x1, t.y2 - t.y1, t.x3 - t.x1, t.y3 - t.y1)+ PinAB(t.x0 - t.x2, t.y0 - t.y2, t.x3 - t.x2, t.y3 - t.y2, t.x1 - t.x2, t.y1 - t.y2) + PinAB(t.x0 - t.x3, t.y0 - t.y3, t.x2 - t.x3, t.y2 - t.y3, t.x1 - t.x3, t.y1 - t.y3) == 3){return 1;}else{return 0;}
}

int PinAB(int tx0, int ty0, int tx1, int ty1, int tx2, int ty2){ 
int kb, kc; kb = tx0*ty1 - tx1*ty0; kc = tx0*ty2 - tx2*ty0;if  ( ((0 > kb ) && (0 < kc )) || ((0 < kb ) && (0 > kc)) ) {return 1;} return 0; 
}
