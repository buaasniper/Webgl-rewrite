precision mediump float;
struct tri_p {
  int x0, y0, x1, y1, z1, x2, y2, z2, x3,  y3, z3;
};
struct txt_p {
  int x0, y0, x1, y1, x2, y2, x3,  y3;
};
uniform ivec3 tri_point[333];
uniform ivec2 text_point[333];
uniform sampler2D sampler;
#define assign tri_p triangle; txt_p fragTexCoord; 
                
                
void main()
{
  assign;
  int a = int(gl_FragCoord.x);
  int b = int(gl_FragCoord.y);
  float aa = float(a) / 255.0;
  float bb = float(b) / 255.0;
  //float cc = float(c) / 255.0;
  gl_FragColor = vec4(aa, bb, 1.0, 1.0);

}

