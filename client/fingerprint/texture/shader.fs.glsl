precision mediump float;
float judge(float xx0, float yy0, float xx1, float yy1, float xx2, float yy2, float xx3, float yy3);
float PinAB(float tx0, float ty0, float tx1, float ty1, float tx2, float ty2);
float round(float x);
float w(float x) ;
float division(float a, float b) ;
uniform vec3 tri_point[333];
uniform vec2 text_point[333];
uniform sampler2D sampler;

void main()
{
  int i = 107;
  int j = 107;
  int k = 4;
  int l = 7;
  int m = 28;
  if ((i /j * k * l / m) == 1)
     gl_FragColor = vec4(0.0, 0.0, 1.0, 1.0);
  else
    gl_FragColor = vec4(0.0, 1.0, 0.0, 1.0);
}

