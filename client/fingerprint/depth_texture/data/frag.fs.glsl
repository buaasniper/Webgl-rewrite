/*------------------------start--------------------*/

#ifdef GL_FRAGMENT_PRECISION_HIGH
    precision highp int;
    precision highp float;
#else
    precision mediump int;
    precision mediump float;
#endif
#define PI 3.141592653589793
#define TAU 6.283185307179586
#define PIH 1.5707963267948966
//essl
varying vec3 vWorldNormal; varying vec4 vWorldPosition;
uniform mat4 camProj, camView;
uniform mat4 lightProj, lightView; uniform mat3 lightRot;
uniform mat4 model;
//essl
uniform sampler2D sLightDepth;

float linstep(float low, float high, float v){
    return clamp((v-low)/(high-low), 0.0, 1.0);
}

float VSM(sampler2D depths, vec2 uv, float compare){
    vec2 moments = texture2D(depths, uv).xy;
    float p = smoothstep(compare-0.02, compare, moments.x);
    float variance = max(moments.y - moments.x*moments.x, -0.001);
    float d = compare - moments.x;
    float p_max = linstep(0.2, 1.0, variance / (variance + d*d));
    return clamp(max(p, p_max), 0.0, 1.0);
}

float attenuation(vec3 dir){
    float dist = length(dir);
    float radiance = 1.0/(1.0+pow(dist/10.0, 2.0));
    return clamp(radiance*10.0, 0.0, 1.0);
}

float influence(vec3 normal, float coneAngle){
    float minConeAngle = ((360.0-coneAngle-10.0)/360.0)*PI;
    float maxConeAngle = ((360.0-coneAngle)/360.0)*PI;
    return smoothstep(minConeAngle, maxConeAngle, acos(normal.z));
}

float lambert(vec3 surfaceNormal, vec3 lightDirNormal){
    return max(0.0, dot(surfaceNormal, lightDirNormal));
}

vec3 skyLight(vec3 normal){
    return vec3(smoothstep(0.0, PI, PI-acos(normal.y)))*0.4;
}

vec3 gamma(vec3 color){
    return pow(color, vec3(2.2));
}

void main(){
    vec3 worldNormal = normalize(vWorldNormal);

    vec3 camPos = (camView * vWorldPosition).xyz;
    vec3 lightPos = (lightView * vWorldPosition).xyz;
    vec3 lightPosNormal = normalize(lightPos);
    vec3 lightSurfaceNormal = lightRot * worldNormal;
    vec4 lightDevice = lightProj * vec4(lightPos, 1.0);
    vec2 lightDeviceNormal = lightDevice.xy/lightDevice.w;
    vec2 lightUV = lightDeviceNormal*0.5+0.5;

    // shadow calculation
    float lightDepth2 = clamp(length(lightPos)/40.0, 0.0, 1.0);
    float illuminated = VSM(sLightDepth, lightUV, lightDepth2);

    vec3 excident = (
        skyLight(worldNormal) +
        lambert(lightSurfaceNormal, -lightPosNormal) *
        influence(lightPosNormal, 55.0) *
        attenuation(lightPos) *
        illuminated
    );
    gl_FragColor = vec4(gamma(excident), 1.0);
}



/*------------------------end--------------------*/




/*------------------------start--------------------*/

VM180:1 #ifdef GL_FRAGMENT_PRECISION_HIGH
    precision highp int;
    precision highp float;
#else
    precision mediump int;
    precision mediump float;
#endif
#define PI 3.141592653589793
#define TAU 6.283185307179586
#define PIH 1.5707963267948966
//essl
varying vec3 vWorldNormal; varying vec4 vWorldPosition;
uniform mat4 lightProj, lightView; uniform mat3 lightRot;
uniform mat4 model;
//essl
#extension GL_OES_standard_derivatives : enable
void main(){
    vec3 worldNormal = normalize(vWorldNormal);
    vec3 lightPos = (lightView * vWorldPosition).xyz;
    float depth = clamp(length(lightPos)/40.0, 0.0, 1.0);
    float dx = dFdx(depth);
    float dy = dFdy(depth);
    gl_FragColor = vec4(depth, pow(depth, 2.0) + 0.25*(dx*dx + dy*dy), 0.0, 1.0);
}
/*------------------------end--------------------*/

/*------------------------start--------------------*/

#ifdef GL_FRAGMENT_PRECISION_HIGH
    precision highp int;
    precision highp float;
#else
    precision mediump int;
    precision mediump float;
#endif
#define PI 3.141592653589793
#define TAU 6.283185307179586
#define PIH 1.5707963267948966
//essl
varying vec2 texcoord;
//essl
uniform vec2 viewport;
uniform sampler2D source;

vec3 get(float x, float y){
    vec2 off = vec2(x, y);
    return texture2D(source, texcoord+off/viewport).rgb;
}
vec3 get(int x, int y){
    vec2 off = vec2(x, y);
    return texture2D(source, texcoord+off/viewport).rgb;
}
vec3 filter(){
    //essl
return get(0.0, 0.0);
}
void main(){
    gl_FragColor = vec4(filter(), 1.0);
}
/*------------------------end--------------------*/

//和第三个一样


/*------------------------start--------------------*/

#ifdef GL_FRAGMENT_PRECISION_HIGH
    precision highp int;
    precision highp float;
#else
    precision mediump int;
    precision mediump float;
#endif
#define PI 3.141592653589793
#define TAU 6.283185307179586
#define PIH 1.5707963267948966
//essl
varying vec2 texcoord;
//essl
uniform vec2 viewport;
uniform sampler2D source;

vec3 get(float x, float y){
    vec2 off = vec2(x, y);
    return texture2D(source, texcoord+off/viewport).rgb;
}
vec3 get(int x, int y){
    vec2 off = vec2(x, y);
    return texture2D(source, texcoord+off/viewport).rgb;
}
vec3 filter(){
    //essl
vec3 result = vec3(0.0);
for(int x=-1; x<=1; x++){
    for(int y=-1; y<=1; y++){
        result += get(x,y);
    }
}
return result/9.0;
}
void main(){
    gl_FragColor = vec4(filter(), 1.0);
}
/*------------------------end--------------------*/