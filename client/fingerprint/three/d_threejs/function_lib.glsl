//light
int division(int a, int b);
int mod(int a, int b);
D_multiple(ivec3 x, int b);
D_add(ivec3 x, ivec y);
D_division(ivec3 x, ivec3 y);
D_clamp(ivec3 x, int a, int b);
int D_max(int a, int b);
ivec3 D_max(ivec3 a, ivec3 b);
int D_pow(int a, int b);
ivec3 D_pow(ivec3 x, ivec3 y);

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

int mod(int a, int b)
{
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

D_multiple(ivec3 x, int b)
{
	return ivec3(division(x[0] * b, 1000),division(x[1] * b, 1000),division(x[2] * b, 1000));
}

D_add(ivec3 x, ivec y)
{
	return ivec3(x[0]+y[0], x[1]+y[1], x[2]+y[2]);
}

D_division(ivec3 x, ivec3 y)
{
	return ivec3(division(x[0]*100, y[0])*10,division(x[1]*100, y[1])*10, division(x[2]*100, y[2])*10);
}


D_clamp(ivec3 x, int a, int b)
{
	int m, n, p;
	if ((x[0] > a) && (x[0] < b))
		m = x[0];
	else if (x[0] <= a)
		m = a;
	else
		m = b;
	if ((x[1] > a) && (x[1] < b))
		n = x[1];
	else if (x[1] <= a)
		n = a;
	else
		n = b;
	if ((x[2] > a) && (x[2] < b))
		p = x[0];
	else if (x[2] <= a)
		p = a;
	else
		p = b;
	return ivec3(m,n,p);
}

int D_max(int a, int b)
{
	if (a > b)
		return a;
	else
		return b;
}

ivec3 D_max(ivec3 a, ivec3 b)
{
	return ivec3(D_max(a[0],b[0]), D_max(a[1],b[1]), D_max(a[2],b[2]));
}

int D_pow(int a, int b)
{
    int ans = a;
    for (int i = 0; i < b-1; i++) {
        ans = division(ans * a, 1000);
    }
    return ans;
}

ivec3 D_pow(ivec3 x, ivec3 y)
{
	return ivec3(D_pow(x[0],y[0]),D_pow(x[1],y[1]), D_pow(x[2],y[2]));
}


