precision mediump float;

struct DirectionalLight
{
	vec3 direction;
	vec3 diffuse;
	vec3 specular;
};
uniform ivec3 tri_point[333];
uniform ivec2 text_point[333];
uniform int tri_number;
struct tri_p {
  int x0, y0, x1, y1, z1, x2, y2, z2, x3,  y3, z3;
};
struct txt_p {
  int x1, y1, x2, y2, x3,  y3;
};
struct txt_coord{
  int x, y;
};
#define uniformNumber 336
#define init tri_p tri; txt_p texcoord; int z; z = -512;gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);int z0; txt_coord fragTexCoord;
#define assign tri.x0 = int(gl_FragCoord.x); tri.y0 = int(gl_FragCoord.y); tri.x1 = tri_point[i][0]; tri.y1 = tri_point[i][1]; tri.z1 = tri_point[i][2]; tri.x2 = tri_point[i+1][0]; tri.y2 = tri_point[i+1][1]; tri.z2 = tri_point[i+1][2]; tri.x3 = tri_point[i+2][0]; tri.y3 = tri_point[i+2][1]; tri.z3 = tri_point[i+2][2];texcoord.x1 = text_point[i][0]; texcoord.y1 = text_point[i][1];texcoord.x2 = text_point[i+1][0]; texcoord.y2 = text_point[i+1][1];texcoord.x3 = text_point[i+2][0]; texcoord.y3 = text_point[i+2][1];
#define cal_Zbuffer z0 = cal_z(tri);
#define pixel_on_triangle ( i < (tri_number * 3) ) && (judge(tri) == 1)
#define draw_pixel (z0 >= -512) && (z0 <= 512) && (z0 > z)
#define renew_Zbuffer z = z0; fragTexCoord = calCoord(texcoord, tri);
int judge(tri_p t);
int f_judge(tri_p t);
int PinAB(int tx0, int ty0, int tx1, int ty1, int tx2, int ty2);   
int f_PinAB(float tx0, float ty0, float tx1, float ty1, float tx2, float ty2);
int cal_z(tri_p tri);
int division(int a, int b);  
int mod(int a, int b);  
int isqrt(int a);
txt_coord calCoord(txt_p f, tri_p t);
ivec4 D_texture2D(sampler2D sampler,txt_coord t); 
ivec4 cal_color(vec4 color0, vec4 color1, vec4 color2, vec4 color3, int wei_x, int wei_y); 
ivec3 D_normalize(ivec3 a);
vec4 col_transfer(ivec4 color);    
// r,g,b 0 - 255   a 0 - 100      
vec4 color0, color1, color2, color3;
uniform ivec3 nor_point[333];
uniform ivec2 map[256];
uniform ivec3 ambientLightIntensity;
uniform DirectionalLight sun;
uniform sampler2D sampler;
uniform mat4 mWorld;
int  wei_1, wei_2, wei_3;

void main()
{
  float a[5] = float[](3.4, 4.2, 5.0, 5.2, 1.1);
  init;
  for (int i = 0; i < uniformNumber; i+= 3){
    assign;
    if ( pixel_on_triangle ){
        cal_Zbuffer;
      if ( draw_pixel ){
        renew_Zbuffer;
        ivec3 vertNormal = ivec3 ( division(wei_1 * nor_point[i][0] + wei_2 * nor_point[i+1][0] + wei_3 * nor_point[i+2][0], 1000)   , division(wei_1 * nor_point[i][1] + wei_2 * nor_point[i+1][1] + wei_3 * nor_point[i+2][1] , 1000) , division(wei_1 * nor_point[i][2] + wei_2 * nor_point[i+1][2] + wei_3 * nor_point[i+2][2],1000)    );
        vec3 fragNormal = (mWorld * vec4(vertNormal, 0.0)).xyz;
		  	vec3 vertPosition = vec3(x0 / 255.0 * 2.0 - 1.0, y0 / 255.0 * 2.0 - 1.0, K);
            ivec4 vPosition = mView * ivec4(vertPosition, 1.0);
            ivec3 lightDirection = D_normalize(sun.direction - vPosition.xyz);
            ivec3 normSunDir = D_normalize(sun.direction);
            ivec3 surfaceNormal = D_normalize(fragNormal);
            ivec4 texel = D_texture2D(sampler, fragTexCoord);

            int specularLightWeighting = 0;
            ivec3 eyeDirection = D_normalize(-vPosition.xyz);
            ivec3 reflectionDirection = reflect(-lightDirection, surfaceNormal);
            specularLightWeighting = int(pow(max(dot(reflectionDirection, eyeDirection), 0.0), 16.0));

            int diffuseLightWeighting = max(dot(surfaceNormal, sun.direction), 0.0);

            ivec3 lightIntensity = ambientLightIntensity +
                division(sun.specular * specularLightWeighting, 1000)  + 
                division(sun.diffuse * diffuseLightWeighting, 1000);
                

            gl_FragColor = vec4(col_transfer(division(texel.rgb * lightIntensity, 1000)) , 1.0);


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
  txt_coord ttt;
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

  tt.x = wei_1 * f.x1 + wei_2 * f.x2 + wei_3 * f.x3;
  tt.y = wei_1 * f.y1 + wei_2 * f.y2 + wei_3 * f.y3;
  ttt.x = tt.x + map[tt.x][0];
  ttt.y = tt.y + map[tt.y][1];
  return ttt;
}


ivec4 D_texture2D(sampler2D sampler,txt_coord t){
  int tx0, ty0, wei_x, wei_y;
  
  tx0 = division ( t.x, 1000);
  ty0 = division ( t.y, 1000);
  color0 = texture2D(sampler, vec2 ( (float(tx0 ) + 0.1) / 255.0 , (float(ty0) + 0.1)/ 255.0));
  color1 = texture2D(sampler, vec2 ( float(tx0 + 1)/ 255.0 , float(ty0     )/ 255.0));
  color2 = texture2D(sampler, vec2 ( float(tx0    )/ 255.0 , float(ty0  + 1)/ 255.0));
  color3 = texture2D(sampler, vec2 ( float(tx0 + 1)/ 255.0 , float(ty0  + 1)/ 255.0));

  wei_x = mod (t.x, 1000);
  wei_y = mod (t.y, 1000);
  return cal_color(color0, color1, color2, color3, wei_x, wei_y);
}

ivec4 cal_color(vec4 color0, vec4 color1, vec4 color2, vec4 color3, int wei_x, int wei_y){
  int r, g, b;
  r = division( int(color0[0] * 255.0 + 0.1) * (1000 - wei_x) * (1000 - wei_y) + int(color1[0] * 255.0 + 0.1) * wei_x * (1000 - wei_y) + int(color2[0] * 255.0 + 0.1) * (1000 - wei_x) * wei_y + int(color3[0] * 255.0 + 0.1) * wei_x * wei_y, 1000000);
  g = division( int(color0[1] * 255.0 + 0.1) * (1000 - wei_x) * (1000 - wei_y) + int(color1[1] * 255.0 + 0.1) * wei_x * (1000 - wei_y) + int(color2[1] * 255.0 + 0.1) * (1000 - wei_x) * wei_y + int(color3[1] * 255.0 + 0.1) * wei_x * wei_y, 1000000);
  b = division( int(color0[2] * 255.0 + 0.1) * (1000 - wei_x) * (1000 - wei_y) + int(color1[2] * 255.0 + 0.1) * wei_x * (1000 - wei_y) + int(color2[2] * 255.0 + 0.1) * (1000 - wei_x) * wei_y + int(color3[2] * 255.0 + 0.1) * wei_x * wei_y, 1000000);
  return ivec4( r, g, b, 100 );
}

vec4 col_transfer( ivec4 c){
  return vec4 (  float(c[0])/255.0, float(c[1])/255.0, float(c[2])/255.0, float(c[3])/ 100.0);
}

ivec3 D_normalize(ivec3 a){
  int rate = isqrt (division(a[0] * a[0] + a[1] * a[1] + a[2] * a[2], 100)) ;
  return ivec3( division( a[0] * rate, 10),  division( a[1] * rate, 10), division( a[2] * rate, 10));
}

int isqrt(int a){
  for (int i = 0; i < 1000; i++)
    if (i * i >= a)
      return i;
}

ivec3 D_normalize(ivec3 a){
  vec3 b = division(a, 1000);
  vec3 c = normalize(b);
  return int(c * 1000);
}

//I - 2.0 * dot(N, I) * N
ivec3 D_reflect(ivec3 x, ivec3 y)
{
	return ivec3(x[0] - 2 * D_dot(x,y)*y[0],x[1] - 2 * D_dot(x,y)*y[1], x[2] - 2 * D_dot(x,y)*y[2]);
}

int D_pow(int a, int b)
{
    int ans = 1;
    for (int i = 0; i < b; i++) {
        ans = division(ans * a, 10);
    }
    return ans;
}
			
