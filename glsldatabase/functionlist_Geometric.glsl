ivec3 D_normalize(ivec3 a){
  int rate = isqrt (division(100000, D_multiple(a[0],a[0]) + D_multiple(a[1],a[1]) + D_multiple(a[2],a[2]))) ;
  return ivec3(division(a[0] * rate, 10), division(a[1] * rate,10), division(a[2] * rate,10));
}

int isqrt(int a){
  for (int i = 0; i < 1000; i++)
    if (i * i >= a)
      return i;
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

//I - 2.0 * dot(N, I) * N
ivec3 D_reflect(ivec3 x, ivec3 y)
{
	return ivec3(x[0] - 2 * D_multiple(D_dot(x,y),y[0]),x[1] - 2 * D_multiple(D_dot(x,y),y[1]), x[2] - 2 * D_multiple(D_dot(x,y),y[2]));
}
