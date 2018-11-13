varying vec2 a;
varying float b;
uniform mat4 matrixClipFromModel;
uniform vec2 modelToPixelScale,iconSize;attribute vec3 vert;uniform vec3 pivot;uniform float opacity,texCoordOffset,texCoordScale;void main(){a=.5*vert.xy+.5;a.y=texCoordScale*a.y+texCoordOffset;gl_Position=matrixClipFromModel*vec4(pivot,1);if(gl_Position.z<-gl_Position.w)b=0.;else b=opacity;gl_Position=vec4(gl_Position.x/gl_Position.w+vert.x*modelToPixelScale.x,gl_Position.y/gl_Position.w+vert.y*modelToPixelScale.y,0,1);}", "precision highp float;varying vec2 a;varying float b;uniform sampler2D iconSampler;void main(){if(b==0.)discard;gl_FragColor=texture2D(iconSampler,a);gl_FragColor.w*=b;}");
            