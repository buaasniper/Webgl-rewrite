flag = 0;
var vetexID;
manualChangeShader = function(shaderSource){

//program 1======================================================================== 
    if (shaderSource.replace("\n"," ").replace(/\s+/g, '') == `uniform mat4 u_mvp;
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
    `.replace("\n"," ").replace(/\s+/g, '')){
        vetexID = 1;
        console.log("vetexID", vetexID);
        return `
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
        `;
    }


    if (shaderSource.replace("\n"," ").replace(/\s+/g, '') == `#ifdef GL_ES
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
    `.replace("\n"," ").replace(/\s+/g, '')){
        console.log("I am in the shader A");
        return `#ifdef GL_ES
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
          gl_FragData[0] = vec4(diffuse*fetch + vec3(specular), 1.0);
        }
        `
    }

//program 2======================================================================== 
    if (shaderSource.replace("\n"," ").replace(/\s+/g, '') == `uniform mat4 u_mvp;
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
    `.replace("\n"," ").replace(/\s+/g, '')){
        vetexID = 2;
        console.log("vetexID", vetexID);
        return `
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
        `;
    }




    if (shaderSource.replace("\n"," ").replace(/\s+/g, '') == `precision highp float;
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
    
    `.replace("\n"," ").replace(/\s+/g, '')){
        console.log("I am in the shader B");
        return `precision highp float;
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
        
          gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
        }`;
    }


 //program 3======================================================================== 
 if (shaderSource.replace("\n"," ").replace(/\s+/g, '') == `uniform mat4 u_mvp;
 attribute vec3 a_position;
 
 void main() {
   gl_Position = u_mvp * vec4(a_position, 1.0);
 }
 `.replace("\n"," ").replace(/\s+/g, '')){
     vetexID = 3;
     console.log("vetexID", vetexID);
     return `
     uniform mat4 u_mvp;
    attribute vec3 a_position;

    void main() {
    gl_Position = u_mvp * vec4(a_position, 1.0);
}
     `;
 }   



    if (shaderSource.replace("\n"," ").replace(/\s+/g, '') == `#ifdef GL_ES
    precision mediump float;
    #endif
    
    uniform vec4 u_color;
    
    void main() {
      gl_FragColor = u_color;
    }
    
    `.replace("\n"," ").replace(/\s+/g, '')){
        console.log("I am in the shader C");
        return `#ifdef GL_ES
        precision mediump float;
        #endif
        
        uniform vec4 u_color;
        
        void main() {
          gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
        }`;
    }



//program 4======================================================================== 
 if (shaderSource.replace("\n"," ").replace(/\s+/g, '') == `uniform mat4 u_mvp;
 attribute vec3 a_position;
 attribute vec2 a_texcoord;
 
 varying vec2 v_texcoord;
 
 void main() {
   v_texcoord  = a_texcoord;
   gl_Position = u_mvp * vec4(a_position, 1.0);
 }
 `.replace("\n"," ").replace(/\s+/g, '')){
     vetexID = 4;
     console.log("vetexID", vetexID);
     return `
     uniform mat4 u_mvp;
    attribute vec3 a_position;
    attribute vec2 a_texcoord;

    varying vec2 v_texcoord;

    void main() {
    v_texcoord  = a_texcoord;
    gl_Position = u_mvp * vec4(a_position, 1.0);
    }
     `;
 }   




    if (shaderSource.replace("\n"," ").replace(/\s+/g, '') == `#ifdef GL_ES
    precision mediump float;
    #endif
    
    uniform sampler2D u_texture;
    uniform vec4 u_color;
    varying vec2 v_texcoord;
    
    void main() {
      vec4 fetch = texture2D(u_texture, v_texcoord);
      gl_FragColor = u_color * fetch;
    }
    
    
    `.replace("\n"," ").replace(/\s+/g, '')){
        console.log("I am in the shader D");
        return `#ifdef GL_ES
        precision mediump float;
        #endif
        
        uniform sampler2D u_texture;
        uniform vec4 u_color;
        varying vec2 v_texcoord;
        
        void main() {
          vec4 fetch = texture2D(u_texture, v_texcoord);
          gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
        }
        `;
    }






    console.log("什么都没有进来！！！！！！！！！！！！！！！！！！！！！！！！");
    return shaderSource;


    }

var observer = new MutationObserver(function(mutations){
if (document.getElementsByTagName("canvas")[1]!=undefined && flag == 0) {
    var gl = document.getElementsByTagName("canvas")[1].getContext("webgl");

    console.log("I am in the rewrite part");


    gl.my_shaderSource = gl.__proto__.shaderSource;
    gl.shaderSource = function(shaderName,shaderSource){
        console.log("version 25"); 
        shaderSource = manualChangeShader(shaderSource);
        console.log(shaderSource);
        gl.my_shaderSource(shaderName,shaderSource);
    }



    flag = 1;
}
})

observer.observe(document.documentElement, {
                  subtree: true,
                 childList: true
                 })


