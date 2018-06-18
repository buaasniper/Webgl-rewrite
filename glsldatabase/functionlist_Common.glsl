//乘和除不是系统的，是我自己添加的
/*============================================================乘================================================*/

//------------------------------------------------>return int
// int * int
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

//------------------------------------------------>return ivec2
//ivec2 * int
ivec2 D_multiple(ivec2 x, int b)
{
  return ivec2(D_multiple(x[0] ,b), D_multiple(x[1] ,b));
}

//int * ivec2 
ivec2 D_multiple(int b, ivec2 x)
{
  return ivec2(D_multiple(x[0] ,b), D_multiple(x[1] ,b));
}

//ivec2 * ivec2
ivec2 D_multiple(ivec2 x, int b)
{
  return ivec2(D_multiple(x[0] ,y[0]), D_multiple(x[1] ,y[1]));
}

//------------------------------------------------>return ivec3
// ivec3 * int
ivec3 D_multiple(ivec3 x, int b)
{
  return ivec3(D_multiple(x[0] ,b), D_multiple(x[1] ,b), D_multiple(x[2] ,b));
}

// int * ivec3
ivec3 D_multiple(int b, ivec3 x)
{
  return ivec3(D_multiple(x[0] ,b), D_multiple(x[1] ,b), D_multiple(x[2] ,b));
}

ivec3 D_multiple(ivec3 x, ivec3 y)
{
  return ivec3(D_multiple(x[0] ,y[0]), D_multiple(x[1] ,y[1]), D_multiple(x[2] ,y[2]));
}

//------------------------------------------------>return ivec4
// ivec4 * int
ivec4 D_multiple(ivec4 x, int b)
{
  return ivec4(D_multiple(x[0] ,b), D_multiple(x[1] ,b), D_multiple(x[2] ,b), D_multiple(x[3] ,b));
}

// int * ivec4
ivec4 D_multiple(int b, ivec4 x)
{
  return ivec4(D_multiple(x[0] ,b), D_multiple(x[1] ,b), D_multiple(x[2] ,b), D_multiple(x[3] ,b));
}

ivec4 D_multiple(ivec4 x, ivec4 y)
{
  return ivec4(D_multiple(x[0] ,y[0]), D_multiple(x[1] ,y[1]), D_multiple(x[2] ,y[2]), D_multiple(x[3] ,y[3]));
}

//需要判断是否存在vec2 * vec3这种情况


/*============================================================除================================================*/

//------------------------------------------------>return int
//我在原来的代码里面，用的是division，现在所有的函数改为D_division
// int / int 
int D_division(int a, int b){
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

//------------------------------------------------>return ivec2
//ivec2 / int
ivec2 D_division(ivec2 x, int b)
{
  return ivec2(D_division(x[0] ,b), D_division(x[1] ,b));
}

//------------------------------------------------>return ivec3
// ivec3 / int
ivec3 D_division(ivec3 x, int b)
{
  return ivec3(D_division(x[0] ,b), D_division(x[1] ,b), D_division(x[2] ,b));
}

//------------------------------------------------>return ivec4
// ivec4 / int
ivec4 D_division(ivec4 x, int b)
{
  return ivec4(D_division(x[0] ,b), D_division(x[1] ,b), D_division(x[2] ,b), D_division(x[3] ,b));
}



/*=========================================================Absolute value================================================*/
//四个function
int abs(int x){
	if (x < 0)
		return -1 * x;
	return x;
}

ivec2 abs(ivec2 x){
	return ivec2(abs(x[0]) , abs(x[1]));
}

ivec3 abs(ivec3 x){
	return ivec3(abs(x[0]) , abs(x[1]), abs(x[2]));
}

ivec4 abs(ivec4 x){
	return ivec4(abs(x[0]) , abs(x[1]), abs(x[2]), abs(x[3]));
}

/*=========================================================Sign================================================*/
//四个function
int sign(int x){
	if (x > 0)
		return 1;
	if (x == 0)
		return 0;
	return -1;
}

ivec2 sign(ivec2 x){
	return ivec2(sign(x[0]) , sign(x[1]));
}

ivec3 sign(ivec3 x){
	return ivec3(sign(x[0]) , sign(x[1]), sign(x[2]));
}

ivec4 sign(ivec4 x){
	return ivec4(sign(x[0]) , sign(x[1]), sign(x[2]), sign(x[3]));
}

/*=========================================================Floor================================================*/
//四个function
//因为是以1000为基数，所以要考虑成1000
int floor(int x){
	int n = x / 1000;
	if ( (n - 2) * 1000 > a )
    return (n - 3) * 1000;
  else if ( (n - 1) * 1000 > a )
    return (n - 2) * 1000;
  else if ( 1000 * n > a )
    return (n - 1) * 1000;
  else if ( (n + 1) * 1000 > a )
    return n * 1000;
  else
    return (n + 1) * 1000;
}

ivec2 floor(ivec2 x){
	return ivec2(floor(x[0]) , floor(x[1]));
}

ivec3 floor(ivec3 x){
	return ivec3(floor(x[0]) , floor(x[1]), floor(x[2]));
}

ivec4 floor(ivec4 x){
	return ivec4(floor(x[0]) , floor(x[1]), floor(x[2]), floor(x[3]));
}

/*=========================================================Ceiling================================================*/
//四个function
//因为是以1000为基数，所以要考虑成1000
int ceil(int x){
	int n = x / 1000;
	if ( (n - 2) * 1000 >= a )
    return (n - 2) * 1000;
  else if ( (n - 1) * 1000 >= a )
    return (n - 1) * 1000;
  else if ( 1000 * n >= a )
    return n * 1000;
  else if ( (n + 1) * 1000 >= a )
    return (n + 1) * 1000 ;
  else
    return (n + 2) * 1000;
}

ivec2 ceil(ivec2 x){
	return ivec2(ceil(x[0]) , ceil(x[1]));
}

ivec3 ceil(ivec3 x){
	return ivec3(ceil(x[0]) , ceil(x[1]), ceil(x[2]));
}

ivec4 ceil(ivec4 x){
	return ivec4(ceil(x[0]) , ceil(x[1]), ceil(x[2]), ceil(x[3]));
}

/*=========================================================Fractional part================================================*/
//四个function
int fract(int x) {
	return x - floor(x);
} 

ivec2 fract(ivec2 x){
	return ivec2(fract(x[0]) , fract(x[1]));
}

ivec3 fract(ivec3 x){
	return ivec3(fract(x[0]) , fract(x[1]), fract(x[2]));
}

ivec4 fract(ivec4 x){
	return ivec4(fract(x[0]) , fract(x[1]), fract(x[2]), fract(x[3]));
}

/*=========================================================Modulo================================================*/
//7个function
//------------------------------------------------>return int
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

//------------------------------------------------>return ivec2
ivec2 mod(ivec2 a, int b){
	return ivec2( mod(a[0], b) , mod(a[1], b));
}

ivec2 mod(ivec2 a, ivec2 b){
	return ivec2( mod(a[0], b[0]) , mod(a[1], b[1]));
}

//------------------------------------------------>return ivec3
ivec3 mod(ivec3 a, int b){
	return ivec3( mod(a[0], b) , mod(a[1], b), mod(a[2], b));
}

ivec3 mod(ivec3 a, ivec3 b){
	return ivec3( mod(a[0], b[0]) , mod(a[1], b[1]), mod(a[2], b[2]) );
}


//------------------------------------------------>return ivec4
ivec4 mod(ivec4 a, int b){
	return ivec4( mod(a[0], b) , mod(a[1], b), mod(a[2], b), mod(a[3], b));
}

ivec4 mod(ivec4 a, ivec4 b){
	return ivec4( mod(a[0], b[0]) , mod(a[1], b[1]), mod(a[2], b[2]), mod(a[3], b[3]) );
}

/*=========================================================Minimum================================================*/
//7个function
//------------------------------------------------>return int
int min(int x, int y) {
	if (x > y)
		return y;
	return x;
}

//------------------------------------------------>return ivec2
ivec2 min(ivec2 a, int b){
	return ivec2( min(a[0], b) , min(a[1], b));
}

ivec2 min(ivec2 a, ivec2 b){
	return ivec2( min(a[0], b[0]) , min(a[1], b[1]));
}

//------------------------------------------------>return ivec3
ivec3 min(ivec3 a, int b){
	return ivec3( min(a[0], b) , min(a[1], b), min(a[2], b));
}

ivec3 min(ivec3 a, ivec3 b){
	return ivec3( min(a[0], b[0]) , min(a[1], b[1]), min(a[2], b[2]) );
}


//------------------------------------------------>return ivec4
ivec4 min(ivec4 a, int b){
	return ivec4( min(a[0], b) , min(a[1], b), min(a[2], b), min(a[3], b));
}

ivec4 min(ivec4 a, ivec4 b){
	return ivec4( min(a[0], b[0]) , min(a[1], b[1]), min(a[2], b[2]), min(a[3], b[3]) );
}

/*=========================================================Maximum================================================*/
//7个function
//------------------------------------------------>return int
int max(int x, int y) {
	if (x > y)
		return x;
	return y;
}

//------------------------------------------------>return ivec2
ivec2 max(ivec2 a, int b){
	return ivec2( max(a[0], b) , max(a[1], b));
}

ivec2 max(ivec2 a, ivec2 b){
	return ivec2( max(a[0], b[0]) , max(a[1], b[1]));
}

//------------------------------------------------>return ivec3
ivec3 max(ivec3 a, int b){
	return ivec3( max(a[0], b) , max(a[1], b), max(a[2], b));
}

ivec3 max(ivec3 a, ivec3 b){
	return ivec3( max(a[0], b[0]) , max(a[1], b[1]), max(a[2], b[2]) );
}


//------------------------------------------------>return ivec4
ivec4 max(ivec4 a, int b){
	return ivec4( max(a[0], b) , max(a[1], b), max(a[2], b), max(a[3], b));
}

ivec4 max(ivec4 a, ivec4 b){
	return ivec4( max(a[0], b[0]) , max(a[1], b[1]), max(a[2], b[2]), max(a[3], b[3]) );
}

/*=========================================================Clamp================================================*/
//7个function
//------------------------------------------------>return int
int clamp(int x, int min, int max){
	if (x < min)
		return min;
	if (x > max)
		return max;
	return x;
}

//------------------------------------------------>return ivec2
ivec2 clamp(ivec2 x, ivec2 min, ivec2 max){
	return ivec2( clamp(x[0], min[0], max[0]), clamp(x[1], min[1], max[1]) );
}

ivec2 clamp(ivec2 x, int min, int max){
	return ivec2( clamp(x[0], min, max), clamp(x[1], min, max) );
}

//------------------------------------------------>return ivec3
ivec3 clamp(ivec3 x, ivec3 min, ivec3 max){
	return ivec3( clamp(x[0], min[0], max[0]), clamp(x[1], min[1], max[1]), clamp(x[2], min[2], max[2]) );
}

ivec3 clamp(ivec3 x, int min, int max){
	return ivec3( clamp(x[0], min, max), clamp(x[1], min, max), clamp(x[2], min, max) );
}

//------------------------------------------------>return ivec4
ivec4 clamp(ivec4 x, ivec4 min, ivec4 max){
	return ivec4( clamp(x[0], min[0], max[0]), clamp(x[1], min[1], max[1]), clamp(x[2], min[2], max[2]), clamp(x[3], min[3], max[3]) );
}

ivec4 clamp(ivec4 x, int min, int max){
	return ivec4( clamp(x[0], min, max), clamp(x[1], min, max), clamp(x[2], min, max), clamp(x[3], min, max) );
}


/*=========================================================Mix================================================*/
//7个function
//------------------------------------------------>return int
int mix(int x, int y, int a){
	return x + D_multiple((y - x), a);
}

//------------------------------------------------>return ivec2
ivec2 mix(ivec2 x, ivec2 y, int a){
	return ivec2( mix(x[0], y[0], a), mix(x[1], y[1], a));
}

ivec2 mix(ivec2 x, ivec2 y, ivec2 a){
	return ivec2( mix(x[0], y[0], a[0]), mix(x[1], y[1], a[1]));
}

//------------------------------------------------>return ivec3
ivec3 mix(ivec3 x, ivec3 y, int a){
	return ivec3( mix(x[0], y[0], a), mix(x[1], y[1], a), mix(x[2], y[2], a));
}

ivec3 mix(ivec3 x, ivec3 y, ivec3 a){
	return ivec3( mix(x[0], y[0], a[0]), mix(x[1], y[1], a[1]), mix(x[2], y[2], a[2]));
}

//------------------------------------------------>return ivec4
ivec4 mix(ivec4 x, ivec4 y, int a){
	return ivec4( mix(x[0], y[0], a), mix(x[1], y[1], a), mix(x[2], y[2], a), mix(x[3], y[3], a));
}

ivec4 mix(ivec4 x, ivec4 y, ivec4 a){
	return ivec4( mix(x[0], y[0], a[0]), mix(x[1], y[1], a[1]), mix(x[2], y[2], a[2]), mix(x[3], y[3], a[3]));
}


/*=========================================================Step================================================*/
//7个function
//------------------------------------------------>return int
int step(int x, int y) {
	if (x > y)
		return 0;
	return 1;
}

//------------------------------------------------>return ivec2
ivec2 step(ivec2 a, int b){
	return ivec2( step(a[0], b) , step(a[1], b));
}

ivec2 step(ivec2 a, ivec2 b){
	return ivec2( step(a[0], b[0]) , step(a[1], b[1]));
}

//------------------------------------------------>return ivec3
ivec3 step(ivec3 a, int b){
	return step( min(a[0], b) , step(a[1], b), step(a[2], b));
}

ivec3 step(ivec3 a, ivec3 b){
	return ivec3( step(a[0], b[0]) , step(a[1], b[1]), step(a[2], b[2]) );
}


//------------------------------------------------>return ivec4
ivec4 step(ivec4 a, int b){
	return ivec4( step(a[0], b) , step(a[1], b), step(a[2], b), step(a[3], b));
}

ivec4 step(ivec4 a, ivec4 b){
	return ivec4( step(a[0], b[0]) , step(a[1], b[1]), step(a[2], b[2]), step(a[3], b[3]) );
}


//暂时不考虑smoothstep   有些问题
/*=========================================================Smoothstep================================================*/
//t = clamp((x - edge0) / (edge1 - edge0), 0.0, 1.0);
//return t * t * (3.0 - 2.0 * t);
//在这里0.0，1.0变成0， 1000
//7个function
//------------------------------------------------>return int
int step(int x, int y) {
	if (x > y)
		return 0;
	return 1;
}

//------------------------------------------------>return ivec2
ivec2 step(ivec2 a, int b){
	return ivec2( step(a[0], b) , step(a[1], b));
}

ivec2 step(ivec2 a, ivec2 b){
	return ivec2( step(a[0], b[0]) , step(a[1], b[1]));
}

//------------------------------------------------>return ivec3
ivec3 step(ivec3 a, int b){
	return step( min(a[0], b) , step(a[1], b), step(a[2], b));
}

ivec3 step(ivec3 a, ivec3 b){
	return ivec3( step(a[0], b[0]) , step(a[1], b[1]), step(a[2], b[2]) );
}


//------------------------------------------------>return ivec4
ivec4 step(ivec4 a, int b){
	return ivec4( step(a[0], b) , step(a[1], b), step(a[2], b), step(a[3], b));
}

ivec4 step(ivec4 a, ivec4 b){
	return ivec4( step(a[0], b[0]) , step(a[1], b[1]), step(a[2], b[2]), step(a[3], b[3]) );
}
