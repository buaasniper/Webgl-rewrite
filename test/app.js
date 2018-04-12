var vertexShaderText = 
[
'precision mediump float;',
'',
'attribute vec2 vertPosition;',
'attribute vec3 vertColor;',
'varying vec3 fragColor;',
'',
'void main()',
'{',
'  fragColor = vertColor;',
'  gl_Position = vec4(vertPosition, 0.0, 1.0);',
'}'
].join('\n');

var fragmentShaderText =
[
'precision mediump float;',
'',
'varying vec3 fragColor;',
'void main()',
'{',
'  gl_FragColor = vec4(fragColor, 1.0);',
'}'
].join('\n');

var testShader = 
`
attribute vec3 vertPosition;
attribute vec2 vertTexCoord;
attribute vec3 vertNormal;

varying vec2 fragTexCoord;
varying vec3 fragNormal;

uniform mat4 mWorld = mat4(2);
uniform mat4 mView;
uniform mat4 mProj;

void main()
{
  fragTexCoord = vertTexCoord;
  fragNormal = (mWorld * vec4(vertNormal, 0.0)).xyz;
  mProj += mProj;
  mProj /= mProj;
  if (fragTexCoord == vertNormal) {
    gl_Position = mProj * mView * mWorld * vec4(vertPosition, 1.0);
    gl_Position = gl_Position + gl_Position;
  }else {
    gl_Position = mProj;
    gl_Position = mProj - mView;
  }
}
`

var Demo = function () {
	var canvas = document.getElementById('game-surface');
	var gl = canvas.getContext('webgl');

	if (!gl) {
		console.log('WebGL not supported, falling back on experimental-webgl');
		gl = canvas.getContext('experimental-webgl');
	}
  var Compiler = GLSL();
  //console.log(Compiler.compile(fragmentShaderText));
  //console.log(Compiler.compile(vertexShaderText));
  console.log(testShader);
  console.log(Compiler.compile(testShader));
}
