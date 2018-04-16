var testShader = 
`
attribute vec3 vertPosition;
attribute vec2 vertTexCoord;
attribute vec3 vertNormal = vec3(4);

varying vec2 fragTexCoord;
varying vec3 fragNormal;

uniform mat4 mWorld = mat4(2);
uniform mat4 mView = mat4(5);
uniform mat4 mProj;

void main()
{
  fragTexCoord = vertTexCoord;
  fragNormal = (mWorld * vec4(vertNormal, 1.0));
  console.log(fragNormal.toString());
  console.log((mWorld * mView).toString());
  mProj += mProj;
  mProj /= mProj;
  console.log(mProj.toString());
  if (fragTexCoord == vertNormal) {
    gl_Position = mProj * mView * mWorld * vec4(vertPosition, 1.0);
    gl_Position = gl_Position + gl_Position;
    console.log(gl_Position.toString());
  }else {
    gl_Position = mProj;
    gl_Position = mProj - mView;
  }
  gl_Position = mProj - mView;
  console.log(gl_Position.toString());
}
main();
`;

var Demo = function () {
  var canvas = document.getElementById('game-surface');
  var gl = canvas.getContext('webgl');

  var Compiler = GLSL();
  console.log(testShader);
  compiled = Compiler.compile(testShader);
  console.log(compiled);

  value_dict = {
    'vertNormal': [2,3,4],
    'mWorld': [[1,2,3,4], [2,3,4,5], [3,4,5,6], [7,8,9,10]],
    'mView': [[4,3,2,1], [5,4,3,2], [6,5,4,3], [9,8,7,6]],
    'mProj': [[1,5,2,4], [5,7,4,6], [8,6,9,7], [12,3,4,5]]
  }

  // set the init value of compiled shader
  compiled = set_values(value_dict, compiled);

  console.log(compiled);
  eval(compiled);
}
