precision mediump float;
uniform ivec3 tri_point[333];
uniform ivec2 text_point[333];
uniform sampler2D sampler;

void main()
{
  int a = tri_point[0][0];
  int b = tri_point[0][1];
  int c = tri_point[1][1];
  //x0 = gl_FragCoord.x * 1.0; y0 = gl_FragCoord.y * 1.0; z = -2.0;
  float aa = float(a) / 255.0;
  float bb = float(b) / 255.0;
  float cc = float(c) / 255.0;
  gl_FragColor = vec4(aa, bb, cc, 1.0);

}

