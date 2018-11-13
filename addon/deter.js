script = document.createElement('script');

var test = function(b , c){
    return b + c;
}

script.src = "http://localhost:8000/unigl.js"
// script.textContent= `
// flag = 0;
// var observer = new MutationObserver(function(mutations){
// if (document.getElementsByTagName("canvas")[1]!=undefined && flag == 0) {
// var gl = document.getElementsByTagName("canvas")[1].getContext("webgl");




// gl.my_shaderSource = gl.__proto__.shaderSource;
// gl.shaderSource = function(shaderName,shaderSource){
//     console.log("version 16"); 
    
//     shaderSource = manualChangeShader(shaderSource);
//     console.log(shaderSource);
//     gl.my_shaderSource(shaderName,shaderSource);
// }

// var manualChangeShader = function(shaderSource){
//     if ( shaderSource.replace("\\n"," ").replace(/\\s+/g, '') ==   
//     \`  
//     #ifdef GL_ES
//     precision mediump float;
//     #endif
    
//     uniform sampler2D u_texture;
//     uniform float u_opacity;
//     uniform vec4  u_slice1;
//     uniform vec4  u_slice2;
//     uniform vec4  u_slice3;
    
//     varying vec3 v_vertex;
//     varying vec3 v_normal;
//     varying vec2 v_texcoord;
    
//     const vec3 kLightVector = vec3(0.3, 0.3, -0.9);
//     const vec3 kHalfVector = vec3(0.154, 0.154, -0.974);
    
//     void main(void) {
//       vec4 vertex = vec4(v_vertex, 1.0);
//       if (dot(vertex, u_slice1) > 0.0 &&
//           dot(vertex, u_slice2) > 0.0 &&
//           dot(vertex, u_slice3) > 0.0) discard;
        
//       vec3 normal = normalize(v_normal);
//       // half-Lambert lighting.
//       float light = 0.5 + 0.5*dot(normal, kLightVector);
//       float diffuse = light*u_opacity;
//       // Specular with fake fresnel effect.
//       float specular = max(0.0, dot(normal, kHalfVector));
//       specular *= 0.7 + 0.3*normal.z;
//       specular *= specular;
//       specular *= u_opacity;
//       vec3 fetch = texture2D(u_texture, v_texcoord).rgb;
//       gl_FragData[0] = vec4(diffuse*fetch + vec3(specular), u_opacity);
//     }\`.replace("\\n"," ").replace(/\\s+/g, '')    ){
//         shaderSource = \`  
//         #ifdef GL_ES
//         precision mediump float;
//         #endif
        
//         uniform sampler2D u_texture;
//         uniform float u_opacity;
//         uniform vec4  u_slice1;
//         uniform vec4  u_slice2;
//         uniform vec4  u_slice3;
        
//         varying vec3 v_vertex;
//         varying vec3 v_normal;
//         varying vec2 v_texcoord;
        
//         const vec3 kLightVector = vec3(0.3, 0.3, -0.9);
//         const vec3 kHalfVector = vec3(0.154, 0.154, -0.974);
        
//         void main(void) {
//           vec4 vertex = vec4(v_vertex, 1.0);
//           if (dot(vertex, u_slice1) > 0.0 &&
//               dot(vertex, u_slice2) > 0.0 &&
//               dot(vertex, u_slice3) > 0.0) discard;
            
//           vec3 normal = normalize(v_normal);
//           // half-Lambert lighting.
//           float light = 0.5 + 0.5*dot(normal, kLightVector);
//           float diffuse = light*u_opacity;
//           // Specular with fake fresnel effect.
//           float specular = max(0.0, dot(normal, kHalfVector));
//           specular *= 0.7 + 0.3*normal.z;
//           specular *= specular;
//           specular *= u_opacity;
//           vec3 fetch = texture2D(u_texture, v_texcoord).rgb;
//           gl_FragColor = vec4(diffuse*fetch + vec3(specular), u_opacity);
//         }\`;
//         console.log("finish change!!!!!!!!!!!!");

//     }

        
//     return shaderSource;

// }





// flag = 1;
// }
// })

// observer.observe(document.documentElement, {
//                   subtree: true,
//                  childList: true
//                  })


// `;

document.documentElement.appendChild(script);

// manualChangeShader = function(shaderSource){
//     if ( shaderSource.replace("\n"," ").replace(/\s+/g, '') ==  \`
//     #ifdef GL_ES
//     precision mediump float;
//     #endif
    
//     uniform sampler2D u_texture;
//     uniform float u_opacity;
//     uniform vec4  u_slice1;
//     uniform vec4  u_slice2;
//     uniform vec4  u_slice3;
    
//     varying vec3 v_vertex;
//     varying vec3 v_normal;
//     varying vec2 v_texcoord;
    
//     const vec3 kLightVector = vec3(0.3, 0.3, -0.9);
//     const vec3 kHalfVector = vec3(0.154, 0.154, -0.974);
    
//     void main(void) {
//       vec4 vertex = vec4(v_vertex, 1.0);
//       if (dot(vertex, u_slice1) > 0.0 &&
//           dot(vertex, u_slice2) > 0.0 &&
//           dot(vertex, u_slice3) > 0.0) discard;
        
//       vec3 normal = normalize(v_normal);
//       // half-Lambert lighting.
//       float light = 0.5 + 0.5*dot(normal, kLightVector);
//       float diffuse = light*u_opacity;
//       // Specular with fake fresnel effect.
//       float specular = max(0.0, dot(normal, kHalfVector));
//       specular *= 0.7 + 0.3*normal.z;
//       specular *= specular;
//       specular *= u_opacity;
//       vec3 fetch = texture2D(u_texture, v_texcoord).rgb;
//       gl_FragData[0] = vec4(diffuse*fetch + vec3(specular), u_opacity);
//     }\`.replace("\n"," ").replace(/\s+/g, '')){

//         console.log("we test this shader !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
    
//     }
//     return shaderSource;

// }

// reE = document.getElementsByTagName("canvas")[1].getContext("webgl").bindTexture; document.getElementsByTagName("canvas")[1].getContext("webgl").bindTexture = function () {console.log("bindtexture1", arguments); BindTextureE.apply(this, arguments);}  
// drawE = document.getElementsByTagName("canvas")[1].getContext("webgl").drawElements; document.getElementsByTagName("canvas")[1].getContext("webgl").drawElements = function (){console.log("DrawElements",arguments); drawE.apply(this, arguments);};
// useProgramM = document.getElementsByTagName("canvas")[1].getContext("webgl").useProgram; document.getElementsByTagName("canvas")[1].getContext("webgl").useProgram = function() {console.log(arguments); useProgramM.apply(this, arguments);};
// drawA = document.getElementsByTagName("canvas")[1].getContext("webgl").drawArrays; document.getElementsByTagName("canvas")[1].getContext("webgl").drawArrays = function () {console.log("drawArrays", arguments); drawA.apply(this, arguments);}
// textureE = document.getElementsByTagName("canvas")[1].getContext("webgl").texImage2D; document.getElementsByTagName("canvas")[1].getContext("webgl").texImage2D = function () {console.log("texture", arguments); textureE.apply(this, arguments);}
// ActiveTextureE = document.getElementsByTagName("canvas")[1].getContext("webgl").activeTexture; document.getElementsByTagName("canvas")[1].getContext("webgl").activeTexture = function () {console.log("texture1", arguments); ActiveTextureE.apply(this, arguments);}
// BindTextu