/*=========================================================Radians================================================*/
//四个function
//这块精度定为.xy
int radians(int degrees){
    return D_division(degrees * 314, 18000);
}

ivec2 radians(ivec2 degrees){
    return ivec2( radians(degrees[0]), radians(degrees[1]));
}

ivec3 radians(ivec3 degrees){
    return ivec3(radians(degrees[0]), radians(degrees[1]), radians(degrees[2]));
}

ivec4 radians(ivec4 degrees){
    return ivec4(radians(degrees[0]), radians(degrees[1]), radians(degrees[2]), radians(degrees[3]));
}


/*=========================================================Radians================================================*/
//四个function
//这块精度定为.xy
int degrees(int degrees){
    return D_division(degrees * 18000, 314);
}

ivec2 degrees(ivec2 degrees){
    return ivec2( degrees(radians[0]), degrees(radians[1]));
}

ivec3 degrees(ivec3 degrees){
    return ivec3(degrees(radians[0]), degrees(radians[1]), degrees(radians[2]));
}

ivec4 degrees(ivec4 degrees){
    return ivec4(degrees(radians[0]), degrees(radians[1]), degrees(radians[2]), degrees(radians[3]));
}

//在所有三角函数中，我没有使用表格，这个需要在测试中确认结果
/*=========================================================Sine================================================*/
//四个function
int sin(int x){
	return   int(sin(float(x) / 1000.0) * 1000.0) ;
}

ivec2 sin(ivec2 x){
	return ivec2(sin(x[0]) , sin(x[1]));
}

ivec3 sin(ivec3 x){
	return ivec3(sin(x[0]) , sin(x[1]), sin(x[2]));
}

ivec4 sin(ivec4 x){
	return ivec4(sin(x[0]) , sin(x[1]), sin(x[2]), sin(x[3]));
}

/*=========================================================Cosine================================================*/
//四个function
int cos(int x){
	return   int(cos(float(x) / 1000.0) * 1000.0) ;
}

ivec2 cos(ivec2 x){
	return ivec2(cos(x[0]) , cos(x[1]));
}

ivec3 cos(ivec3 x){
	return ivec3(cos(x[0]) , cos(x[1]), cos(x[2]));
}

ivec4 cos(ivec4 x){
	return ivec4(cos(x[0]) , cos(x[1]), cos(x[2]), cos(x[3]));
}

/*=========================================================Tangent================================================*/
//四个function
int tan(int x){
	return   int(tan(float(x) / 1000.0) * 1000.0) ;
}

ivec2 tan(ivec2 x){
	return ivec2(tan(x[0]) , tan(x[1]));
}

ivec3 tan(ivec3 x){
	return ivec3(tan(x[0]) , tan(x[1]), tan(x[2]));
}

ivec4 tan(ivec4 x){
	return ivec4(tan(x[0]) , tan(x[1]), tan(x[2]), tan(x[3]));
}

/*=========================================================Arcsine================================================*/
//四个function
int asin(int x){
	return   int(asin(float(x) / 1000.0) * 1000.0) ;
}

ivec2 asin(ivec2 x){
	return ivec2(asin(x[0]) , asin(x[1]));
}

ivec3 asin(ivec3 x){
	return ivec3(asin(x[0]) , asin(x[1]), asin(x[2]));
}

ivec4 asin(ivec4 x){
	return ivec4(asin(x[0]) , asin(x[1]), asin(x[2]), asin(x[3]));
}

/*=========================================================Arccosine================================================*/
//四个function
int acos(int x){
	return   int(acos(float(x) / 1000.0) * 1000.0) ;
}

ivec2 acos(ivec2 x){
	return ivec2(acos(x[0]) , acos(x[1]));
}

ivec3 acos(ivec3 x){
	return ivec3(acos(x[0]) , acos(x[1]), acos(x[2]));
}

ivec4 acos(ivec4 x){
	return ivec4(acos(x[0]) , acos(x[1]), acos(x[2]), acos(x[3]));
}

//Arctangent 其余的四个函数我暂时没有弄明白具体含义，之后再添加
/*=========================================================Arctangent================================================*/
//8个function
int atan(int x){
	return   int(atan(float(x) / 1000.0) * 1000.0) ;
}

ivec2 atan(ivec2 x){
	return ivec2(atan(x[0]) , atan(x[1]));
}

ivec3 atan(ivec3 x){
	return ivec3(atan(x[0]) , atan(x[1]), atan(x[2]));
}

ivec4 atan(ivec4 x){
	return ivec4(atan(x[0]) , atan(x[1]), atan(x[2]), atan(x[3]));
}