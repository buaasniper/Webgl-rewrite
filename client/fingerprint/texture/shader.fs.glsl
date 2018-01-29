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
#define uniformNumber 12
#define init tri_p tri; txt_p fragTexCoord; 
#define assign tri.x0 = int(gl_FragCoord.x); tri.y0 = int(gl_FragCoord.y); tri.x1 = tri_point[i][0]; tri.y1 = tri_point[i][1]; tri.z1 = tri_point[i][2]; tri.x2 = tri_point[i+1][0]; tri.y2 = tri_point[i+1][1]; tri.z2 = tri_point[i+1][2]; tri.x3 = tri_point[i+2][0]; tri.y3 = tri_point[i+2][1]; tri.z3 = tri_point[i+2][2];
                
                
void main()
{
  init;
  for (int i = 0; i < uniformNumber; i+= 3){
    assign;
  }
  
  int a = tri.x1;
  int b = tri.y1;
  float aa = float(a) / 255.0;
  float bb = float(b) / 255.0;
  //float cc = float(c) / 255.0;
  gl_FragColor = vec4(aa, bb, 0.0, 1.0);

}

