
/*---------------------start-------------------------*/

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
attribute vec3 position, normal;

void main(){
    vWorldNormal = normal;
    vWorldPosition = model * vec4(position, 1.0);
    gl_Position = camProj * camView * vWorldPosition;
}



/*---------------------end-------------------------*/


//第二个和第一个一样


/*---------------------start-------------------------*/
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
attribute vec2 position;

void main(){
    texcoord = position*0.5+0.5;
    gl_Position = vec4(position, 0.0, 1.0);
}
/*---------------------end-------------------------*/

//和第三个一样
//和第三个一样