/*=========================================================Length================================================*/
//四个function
//在这里调用sqrt
int length(int x)
{
   return x;
}

int length(ivec2 x){
	x = x / 10;
    return sqrt(x[0] * x[0] + x[1] * x[1]) * 100;
}

int length(ivec3 x){
    x = x / 10;
	return sqrt(x[0] * x[0] + x[1] * x[1] + x[2] * x[2]) * 100;
}

int length(ivec4 x){
    x = x / 10;
	return sqrt(x[0] * x[0] + x[1] * x[1] + x[2] * x[2] + x[3] * x[3]) * 100;
}

/*=========================================================Distance================================================*/
//四个function
//在这里调用length
int distance(int p0, int p1)
{
   return length(p0 - p1);
}

int distance(ivec2 p0, ivec2 p1){
    return length(p0[0] - p1[0], p0[1] - p1[1]);
}

int distance(ivec3 p0, ivec3 p1){
    return length(p0[0] - p1[0], p0[1] - p1[1], p0[2] - p1[2]);
}

int distance(ivec4 p0, ivec4 p1){
	return length(p0[0] - p1[0], p0[1] - p1[1], p0[2] - p1[2], p0[3] - p1[3]);
}

/*=========================================================Dot product================================================*/
//四个function
int dot(int x, int y)
{
  int sum = 0;
  sum += D_multiple(x, y);
  return sum;
}

int dot(ivec2 x, ivec2 y)
{
  int sum = 0;
  for (int i = 0; i < 2; i++)
  {
    sum += D_multiple(x[i], y[i]);
  }
  return sum;
}

int dot(ivec3 x, ivec3 y)
{
  int sum = 0;
  for (int i = 0; i < 3; i++)
  {
    sum += D_multiple(x[i], y[i]);
  }
  return sum;
}

int dot(ivec4 x, ivec4 y)
{
  int sum = 0;
  for (int i = 0; i < 4; i++)
  {
    sum += D_multiple(x[i], y[i]);
  }
  return sum;
}

/*=========================================================Cross product================================================*/
ivec3 cross(ivec3 x, ivec3 y){
    return ivec3(D_multiple(x[1], y[2]) - D_multiple(x[2], y[1]), D_multiple(x[2], y[0]) - D_multiple(x[0], y[2]),  D_multiple(x[0], y[1]) - D_multiple(x[1], y[0]));
}

/*=========================================================Normalize================================================*/
//四个function
int normalize(int a){
  return 1000;
}

ivec2 normalize(ivec2 x){
  int rate = sqrt (division(100000, D_multiple(a[0],a[0]) + D_multiple(a[1],a[1]))) ;
  return ivec3(division(a[0] * rate, 10), division(a[1] * rate,10));
}

ivec3 normalize(ivec3 a){
  int rate = sqrt (division(100000, D_multiple(a[0],a[0]) + D_multiple(a[1],a[1]) + D_multiple(a[2],a[2]))) ;
  return ivec3(division(a[0] * rate, 10), division(a[1] * rate,10), division(a[2] * rate,10));
}

ivec4 normalize(ivec4 a){
  int rate = sqrt (division(100000, D_multiple(a[0],a[0]) + D_multiple(a[1],a[1]) + D_multiple(a[2],a[2]) + D_multiple(a[3],a[3]) )) ;
  return ivec4(division(a[0] * rate, 10), division(a[1] * rate,10), division(a[2] * rate,10), , division(a[3] * rate,10));
}


/*=========================================================Faceforward================================================*/
//四个function
//在这里使用dot
int faceforward(int N, int I, int Nref){
  if (dot(Nref, I) < 0)
    return N;
  return -1 * N;
}

ivec2 faceforward(ivec2 N, ivec2 I, ivec2 Nref){
  if (dot(Nref, I) < 0)
    return N;
  return -1 * N;
}

ivec3 faceforward(ivec3 N, ivec3 I, ivec3 Nref){
  if (dot(Nref, I) < 0)
    return N;
  return -1 * N;
}

ivec4 faceforward(ivec4 N, ivec4 I, ivec4 Nref){
  if (dot(Nref, I) < 0)
    return N;
  return -1 * N;
}


/*=========================================================Reflect================================================*/
//四个function
////I - 2.0 * dot(N, I) * N
int reflect(int x, int y){
  return x - 2 *  D_multiple(dot(x,y),y)
}

ivec2 reflect(ivec2 x, ivec2 y){
  return ivec2(x[0] - 2 * D_multiple(dot(x,y),y[0]),x[1] - 2 * D_multiple(dot(x,y),y[1]));
}

ivec3 reflect(ivec3 x, ivec3 y){
	return ivec3(x[0] - 2 * D_multiple(dot(x,y),y[0]),x[1] - 2 * D_multiple(dot(x,y),y[1]), x[2] - 2 * D_multiple(dot(x,y),y[2]));
}

ivec4 reflect(ivec4 x, ivec4 y){
	return ivec4(x[0] - 2 * D_multiple(dot(x,y),y[0]),x[1] - 2 * D_multiple(dot(x,y),y[1]), x[2] - 2 * D_multiple(dot(x,y),y[2]), x[3] - 2 * D_multiple(dot(x,y),y[3]));
}


/*=========================================================refract================================================*/
//这个暂时没有想明白改怎么写
//四个function
////I - 2.0 * dot(N, I) * N
int reflect(int x, int y){
  return x - 2 *  D_multiple(dot(x,y),y)
}

ivec2 reflect(ivec2 x, ivec2 y){
  return ivec2(x[0] - 2 * D_multiple(dot(x,y),y[0]),x[1] - 2 * D_multiple(dot(x,y),y[1]));
}

ivec3 reflect(ivec3 x, ivec3 y){
	return ivec3(x[0] - 2 * D_multiple(dot(x,y),y[0]),x[1] - 2 * D_multiple(dot(x,y),y[1]), x[2] - 2 * D_multiple(dot(x,y),y[2]));
}

ivec4 reflect(ivec4 x, ivec4 y){
	return ivec4(x[0] - 2 * D_multiple(dot(x,y),y[0]),x[1] - 2 * D_multiple(dot(x,y),y[1]), x[2] - 2 * D_multiple(dot(x,y),y[2]), x[3] - 2 * D_multiple(dot(x,y),y[3]));
}
