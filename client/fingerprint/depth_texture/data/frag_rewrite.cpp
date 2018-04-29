
int D_linstep(int low, int high, int v);
int D_clamp(int x, int min, int max);
int division(int a, int b);
ivec4 D_texture2D(sampler2D sampler,txt_coord t);
ivec4 cal_color(vec4 color0, vec4 color1, vec4 color2, vec4 color3, int wei_x, int wei_y);
int D_smoothstep(int edge0, int edge1, int x);
int D_max(int a, int b);
int D_pow(int a, int b);
int D_multiple(int a, int b);
int D_dot(ivec3 x, ivec3 y);
int D_lambert(ivec3 surfaceNormal, ivec3 lightDirNormal);
ivec3 D_multiple(ivec3 x, ivec3 y);
ivec3 D_multiple(ivec3 x, int b);
ivec3 D_skyLight(ivec3 normal);
ivec3 D_pow(ivec3 a, ivec3 b);
ivec3 D_gamma(ivec3 color);
ivec3 D_normalize(ivec3 a);
int D_attenuation(ivec3 dir);
int D_influence(ivec3 normal, int coneAngle);
int D_abs(int a);
int isqrt(int a);
int D_acos(int a);
ivec3 D_get(int x, int y);


ivec4 cal_color(vec4 color0, vec4 color1, vec4 color2, vec4 color3, int wei_x, int wei_y)
{
  int r, g, b;
  r = division( int(color0[0] * 255.0) * (1000 - wei_x) * (1000 - wei_y) + int(color1[0] * 255.0) * wei_x * (1000 - wei_y) + int(color2[0] * 255.0) * (1000 - wei_x) * wei_y + int(color3[0] * 255.0) * wei_x * wei_y, 1000000);
  g = division( int(color0[1] * 255.0) * (1000 - wei_x) * (1000 - wei_y) + int(color1[1] * 255.0) * wei_x * (1000 - wei_y) + int(color2[1] * 255.0) * (1000 - wei_x) * wei_y + int(color3[1] * 255.0) * wei_x * wei_y, 1000000);
  b = division( int(color0[2] * 255.0) * (1000 - wei_x) * (1000 - wei_y) + int(color1[2] * 255.0) * wei_x * (1000 - wei_y) + int(color2[2] * 255.0) * (1000 - wei_x) * wei_y + int(color3[2] * 255.0) * wei_x * wei_y, 1000000);
  return ivec4( r, g, b, 100 );
}

ivec4 D_texture2D(sampler2D sampler,txt_coord t)
{
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

int division(int a, int b)
{
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

int D_clamp(int x, int min, int max)
{
	if ((a > min) && (a < max))
	{
		return x;
	}
	if (a <= min)
	{
		return min;
	}
	if (a >= max)
	{
		return max;
	}
}

int D_linstep(int low, int high, int v)
{
	return D_clamp(division((v-low),(high-low)), 0, 1);	
}

int D_smoothstep(int edge0, int edge1, int x)
{
    x = D_clamp((x - edge0) / (edge1 - edge0), 0, 1);
    return x*x*(3 - 2 * x);
}

int D_max(int a, int b)
{
	if (a > b)
		return a;
	else
		return b;
}

int D_multiple(int a, int b)
{
  if (division(b, 1000) > 100)
	{
		return a * division(b, 1000);
	}	
  else if (division(a, 1000) > 100)
	{
		return b * division(a, 1000);
	}	
	else
	{
		return division(a * b, 1000);
	}
}

int D_pow(int a, int b)
{
    int ans = 1;
    for (int i = 0; i < 16; i++)
    {
        ans = D_multiple(ans, a);
    }
    return ans;
}

ivec3 D_pow(ivec3 a, ivec3 b)
{
    return(ivec3(D_pow(a[0],b[0]),D_pow(a[1],b[1]),D_pow(a[2],b[2])))
}

int D_dot(ivec3 x, ivec3 y)
{
	int sum = 0;
	for (int i = 0; i < 3; i++)
	{
		sum += D_multiple(x[i], y[i]);
	}
	return sum;
}

int D_abs(int a)
{
	if (a < 0)
		return -a;
	else
		return a;
}

int D_acos(int a)
{
	if (a < 0)
	{
		int negate = -1;
	}
	a = abs(a);
	int ret = - 18;
	ret = ret * a;
	ret = ret + 74;
	ret = ret * a;
	ret = ret - 212;
	ret = ret * x;
	ret = ret + 1570
	ret = ret * isqrt(1000-x);
	ret = ret - 2 * negate * ret;
	return negate * 3141 + ret;
}

int isqrt(int a)
{
	for (int i = 0; i < 1000; i++)
		if (i * i >= a)
			return i;
}


int D_lambert(ivec3 surfaceNormal, ivec3 lightDirNormal)
{
    return D_max(0, D_dot(surfaceNormal, lightDirNormal));
}

ivec3 D_multiple(ivec3 x, int b)
{
  return ivec3(D_multiple(x[0] ,b), D_multiple(x[1] ,b), D_multiple(x[2] ,b));
}

ivec3 D_multiple(ivec3 x, ivec3 y)
{
  return ivec3(D_multiple(x[0] ,y[0]), D_multiple(x[1] ,y[1]), D_multiple(x[2] ,y[2]));
}

ivec3 D_skyLight(ivec3 normal)
{
    return D_multiple(vec3(D_smoothstep(0, PI, PI-acos(normal.y))),400);
}

ivec3 D_gamma(ivec3 color)
{
    return D_pow(color, ivec3(2200));
}

ivec3 D_normalize(ivec3 a)
{
	int rate = isqrt (division(100000, D_multiple(a[0],a[0]) + D_multiple(a[1],a[1]) + D_multiple(a[2],a[2]))) ;
	return ivec3(division(a[0] * rate, 10), division(a[1] * rate,10), division(a[2] * rate,10));
}

int D_attenuation(ivec3 dir){
    int dist = length(dir);
    int radiance = 1000/(1000+D_pow(dist/100000, 2000));
    return clamp(radiance*10000, 0, 1000);
}

int D_influence(ivec3 normal, int coneAngle)
{
    int minConeAngle = ((360000-coneAngle-10000)/360000)*PI;
    int maxConeAngle = ((360000-coneAngle)/360000)*PI;
    return D_smoothstep(minConeAngle, maxConeAngle, D_acos(normal.z));
}

// float D_VSM(sampler2D depths, vec2 uv, float compare)
// {
//     vec2 moments = texture2D(depths, uv).xy;
//     float p = smoothstep(compare-20, compare, moments.x);
//     float variance = max(moments.y - moments.x*moments.x, -1);
//     float d = compare - moments.x;
//     float p_max = linstep(200, 1000, variance / (variance + d*d));
//     return clamp(max(p, p_max), 0, 1000);
// }


ivec3 D_get(int x, int y)
{
    ivec2 off = ivec2(x, y);
    // ivec3 tmp = D_texture2D(source, texcoord+off/viewport).rgb;
    return D_texture2D(source, texcoord+off/viewport).rgb;
}








