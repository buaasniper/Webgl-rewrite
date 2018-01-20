precision mediump float;
float judge(float xx0, float yy0, float xx1, float yy1, float xx2, float yy2, float xx3, float yy3);
float PinAB(float tx0, float ty0, float tx1, float ty1, float tx2, float ty2);
float round(float x);
uniform vec3 tri_point[333];
uniform vec2 text_point[333];
uniform sampler2D sampler;

void main()
{
  float x0, y0, x1, y1, z1, x2, y2, z2, x3,  y3, z3, z , tx, ty;
  x0 = gl_FragCoord.x * 1.0; y0 = gl_FragCoord.y * 1.0; z = -2.0;
  gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
  for (int i = 0 ; i < 510; i += 3){
      x1 = tri_point[i][0];   y1 = tri_point[i][1];   z1 = tri_point[i][2];
      x2 = tri_point[i+1][0]; y2 = tri_point[i+1][1]; z2 = tri_point[i+1][2];
      x3 = tri_point[i+2][0]; y3 = tri_point[i+2][1]; z3 = tri_point[i+2][2];
      if (judge(x0, y0, x1, y1, x2, y2, x3, y3) > 0.9) {
        float dis_1, dis_2, dis_3, dis_mun, wei_1, wei_2, wei_3;
        float A, B, C , D , K;
        A = (y3 - y1)*(z3 - z1) - (z2 -z1)*(y3 - y1);
        B = (x3 - x1)*(z2 - z1) - (x2 - x1)*(z3 - z1);
        C = (x2 - x1)*(y3 - y1) - (x3 - x1)*(y2 - y1);
        D = -1.0 * (A * x1 + B * y1 + C * z1);
        K = -1.0 * (A * x0 + B * y0 + D) / C;
        wei_1 = round((x0*y2 + x2*y3 + x3*y0 - x3*y2 - x2*y0- x0*y3)/(x1*y2 + x2*y3 + x3*y1 - x3*y2 - x2*y1 - x1*y3) * 10000.0);
        wei_2 = round((x1*y0 + x0*y3 + x3*y1 - x3*y0 - x0*y1- x1*y3)/(x1*y2 + x2*y3 + x3*y1 - x3*y2 - x2*y1 - x1*y3) * 10000.0);
        wei_3 = round((x1*y2 + x2*y0 + x0*y1 - x0*y2 - x2*y1- x1*y0)/(x1*y2 + x2*y3 + x3*y1 - x3*y2 - x2*y1 - x1*y3) * 10000.0);
        if ((K <= 2.0) && (K >= -2.0) && (K > z)){
          z = K;
          tx = floor ((floor(wei_1) * text_point[i][0] + floor(wei_2) * text_point[i+1][0] + floor(wei_3) * text_point[i+2][0])/10000.0 * 255.0 + 0.1) / 255.0 ;
          ty = floor ((floor(wei_1) * text_point[i][1] + floor(wei_2) * text_point[i+1][1] + floor(wei_3) * text_point[i+2][1])/10000.0 * 255.0 + 0.1) / 255.0 ;
          gl_FragColor = texture2D(sampler, vec2 (x1 / 255.0, y1 / 255.0));
        }
      }
  }

}

float judge(float xx0, float yy0, float xx1, float yy1, float xx2, float yy2, float xx3, float yy3) {
    if ( PinAB(xx0 - xx1, yy0 -yy1, xx2 - xx1, yy2 - yy1, xx3 - xx1, yy3 - yy1)+ PinAB(xx0 - xx2, yy0 -yy2, xx3 - xx2, yy3 - yy2, xx1 - xx2, yy1 - yy2) + PinAB(xx0 - xx3, yy0 -yy3, xx2 - xx3, yy2 - yy3, xx1 - xx3, yy1 - yy3) > 2.5){return 1.0;}else{return 0.0;}
}
float PinAB(float tx0, float ty0, float tx1, float ty1, float tx2, float ty2){ 
float kb, kc; kb = tx0*ty1 - tx1*ty0; kc = tx0*ty2 - tx2*ty0;if  ( ((0.0001 > kb) && (-0.0001 < kc)) || ((-0.0001 < kb) && (0.0001 > kc)) ) {return 1.0;} return 0.0; 
}
float round(float x) {
    if (x - floor(x) > 0.499){return (floor(x) + 0.6) ;}else{return (floor(x) + 0.1);}
}