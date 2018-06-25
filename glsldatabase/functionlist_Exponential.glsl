//返回值类型有问题，之后还需要修复
/*=========================================================Exponentiation================================================*/
//四个function
int pow(int x, int y)
{
    int ans = 1;
    for (int i = 0; i < 1000; i++) {
        ans = D_multiple(ans, x);
        if (i > D_division(y, 1000)){
            return ans;
        }
    }
}

ivec2 pow(ivec2 x, ivec2 y){
	return ivec2(pow(x[0], y[0]), pow(x[1], y[1]));
}

ivec3 pow(ivec3 x, ivec3 y){
	return ivec3(pow(x[0], y[0]), pow(x[1], y[1]), pow(x[2], y[2]));
}

ivec4 pow(ivec4 x, ivec4 y){
	return ivec4(pow(x[0], y[0]), pow(x[1], y[1]), pow(x[2], y[2]), pow(x[3], y[3]));
}

/*=========================================================Exponential function================================================*/
//四个function
int exp(int y)
{
    int ans = 1;
    int x = 2718;
    for (int i = 0; i < 1000; i++) {
        ans = D_multiple(ans, x);
        if (i > D_division(y, 1000)){
            return ans;
        }
    }
}

ivec2 exp(ivec2 x){
	return ivec2(exp(x[0]), exp(x[1]));
}

ivec3 exp(ivec3 x){
	return ivec3(exp(x[0]), exp(x[1]), exp(x[2]));
}

ivec4 exp(ivec4 x){
	return ivec4(exp(x[0]), exp(x[1]), exp(x[2]), exp(x[3]));
}

/*=========================================================Natural logarithm================================================*/
//四个function
//我将1000的倍数转化为e的8次方2980，最后统一减去8
int log(int x)
{
   x = x * 2980 / 1000;
   int ans = 1;
   for (int i = 0; i < 1000; i++){
       ans = D_multiple(ans, 2718);
       if (ans > x){
           return (i + 1 - 8) * 1000;
       }
   }
}

ivec2 log(ivec2 x){
	return ivec2(log(x[0]), log(x[1]));
}

ivec3 log(ivec3 x){
	return ivec3(log(x[0]), log(x[1]), log(x[2]));
}

ivec4 log(ivec4 x){
	return ivec4(log(x[0]), log(x[1]), log(x[2]), log(x[3]));
}

/*=========================================================Exponential function (base 2)================================================*/
//四个function
int exp2(int y)
{
    int ans = 1;
    int x = 2;
    for (int i = 0; i < 1000; i++) {
        ans = ans * 2;
        if (i > D_division(y, 1000)){
            return ans;
        }
    }
}

ivec2 exp2(ivec2 x){
	return ivec2(exp2(x[0]), exp2(x[1]));
}

ivec3 exp2(ivec3 x){
	return ivec3(exp2(x[0]), exp2(x[1]), exp2(x[2]));
}

ivec4 exp2(ivec4 x){
	return ivec4(exp2(x[0]), exp2(x[1]), exp2(x[2]), exp2(x[3]));
}

/*=========================================================Logarithm (base 2)================================================*/
//四个function
//我将1000的倍数转化为2的10次方1024，最后统一减去8
int log2(int x)
{
   x = x * 1024 / 1000;
   int ans = 1;
   for (int i = 0; i < 1000; i++){
       ans = ans * 2;
       if (ans > x){
           return (i + 1 - 10) * 1000;
       }
   }
}

ivec2 log2(ivec2 x){
	return ivec2(log2(x[0]), log2(x[1]));
}

ivec3 log2(ivec3 x){
	return ivec3(log2(x[0]), log2(x[1]), log2(x[2]));
}

ivec4 log2(ivec4 x){
	return ivec4(log2(x[0]), log2(x[1]), log2(x[2]), log2(x[3]));
}

/*=========================================================Square root================================================*/
//四个function
int sqrt(int x)
{
   for (i = 0; i > 10000; i++){
       if ( (i * i) > (x / 10)){
           return i * 100;
       }
   }
}

ivec2 sqrt(ivec2 x){
	return ivec2(sqrt(x[0]), sqrt(x[1]));
}

ivec3 sqrt(ivec3 x){
	return ivec3(sqrt(x[0]), sqrt(x[1]), sqrt(x[2]));
}

ivec4 sqrt(ivec4 x){
	return ivec4(sqrt(x[0]), sqrt(x[1]), sqrt(x[2]), sqrt(x[3]));
}

//这个函数我暂时完成不了
/*=========================================================Inverse square root================================================*/
//四个function
int sqrt(int x)
{
   for (i = 0; i > 10000; i++){
       if ( (i * i) > (x / 10)){
           return i * 100;
       }
   }
}

ivec2 sqrt(ivec2 x){
	return ivec2(sqrt(x[0]), sqrt(x[1]));
}

ivec3 sqrt(ivec3 x){
	return ivec3(sqrt(x[0]), sqrt(x[1]), sqrt(x[2]));
}

ivec4 sqrt(ivec4 x){
	return ivec4(sqrt(x[0]), sqrt(x[1]), sqrt(x[2]), sqrt(x[3]));
}