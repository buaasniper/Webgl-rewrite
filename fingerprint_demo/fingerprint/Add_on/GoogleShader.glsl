//1
uniform mat4 u_mvp;
uniform mat4 u_effect;

attribute vec3 a_position;
attribute vec2 a_texcoord;
attribute vec3 a_normal;

varying vec2 v_texcoord;
varying vec3 v_normal;
varying vec3 v_vertex;

void main(void) {
  v_vertex    = a_position;
  v_normal    = vec3(u_mvp * u_effect * vec4(a_normal, 0));
  v_texcoord  = a_texcoord;
  gl_Position = u_mvp * u_effect * vec4(a_position, 1.0);
}



#ifdef GL_ES
precision mediump float;
#endif

uniform sampler2D u_texture;
uniform float u_opacity;
uniform vec4  u_slice1;
uniform vec4  u_slice2;
uniform vec4  u_slice3;

varying vec3 v_vertex;
varying vec3 v_normal;
varying vec2 v_texcoord;

const vec3 kLightVector = vec3(0.3, 0.3, -0.9);
const vec3 kHalfVector = vec3(0.154, 0.154, -0.974);

void main(void) {
  vec4 vertex = vec4(v_vertex, 1.0);
  if (dot(vertex, u_slice1) > 0.0 &&
      dot(vertex, u_slice2) > 0.0 &&
      dot(vertex, u_slice3) > 0.0) discard;
    
  vec3 normal = normalize(v_normal);
  // half-Lambert lighting.
  float light = 0.5 + 0.5*dot(normal, kLightVector);
  float diffuse = light*u_opacity;
  // Specular with fake fresnel effect.
  float specular = max(0.0, dot(normal, kHalfVector));
  specular *= 0.7 + 0.3*normal.z;
  specular *= specular;
  specular *= u_opacity;
  vec3 fetch = texture2D(u_texture, v_texcoord).rgb;
  gl_FragData[0] = vec4(diffuse*fetch + vec3(specular), u_opacity);
}


//2=====================================================================================================
uniform mat4 u_mvp;
uniform mat4 u_effect;
uniform float u_colorScale;

attribute vec3 a_position;
attribute vec3 a_normal;
attribute float a_colorIndex;

varying vec4 v_color;
varying vec3 v_normal;
varying vec3 v_vertex;

void main() {
  v_vertex    = a_position;
  float scaledColor = a_colorIndex * u_colorScale;
  float redColor = floor(scaledColor / (256.0 * 256.0));
  float greenColor = floor((scaledColor - redColor * 256.0 * 256.0) / 256.0);
  float blueColor = (scaledColor - greenColor * 256.0 - redColor * 256.0 * 256.0);
  v_color = vec4(redColor / 255.0, greenColor / 255.0, blueColor / 255.0, 1);
  v_normal = vec3(u_mvp * vec4(a_normal, 0));
  gl_Position = u_mvp * u_effect * vec4(a_position, 1.0);
}



precision highp float;
varying vec4 v_color;
varying vec3 v_vertex;

uniform vec4  u_slice1;
uniform vec4  u_slice2;
uniform vec4  u_slice3;

void main() {
  vec4 vertex = vec4(v_vertex, 1.0);
  if (dot(vertex, u_slice1) > 0.0 &&
      dot(vertex, u_slice2) > 0.0 &&
      dot(vertex, u_slice3) > 0.0) discard;

  gl_FragColor = v_color;
}


//3========================================================================================================
uniform mat4 u_mvp;
attribute vec3 a_position;

void main() {
  gl_Position = u_mvp * vec4(a_position, 1.0);
}

#ifdef GL_ES
precision mediump float;
#endif

uniform vec4 u_color;

void main() {
  gl_FragColor = u_color;
}



//4============================================================================================================
uniform mat4 u_mvp;
attribute vec3 a_position;
attribute vec2 a_texcoord;

varying vec2 v_texcoord;

void main() {
  v_texcoord  = a_texcoord;
  gl_Position = u_mvp * vec4(a_position, 1.0);
}

#ifdef GL_ES
precision mediump float;
#endif

uniform sampler2D u_texture;
uniform vec4 u_color;
varying vec2 v_texcoord;

void main() {
  vec4 fetch = texture2D(u_texture, v_texcoord);
  gl_FragColor = u_color * fetch;
}
