
attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec2 aTextureCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform mat4 uNMatrix;

varying vec2 vTextureCoord;

uniform sampler2D uSampler;		// identifies the piece
uniform sampler2D uSampler2;	// default look

uniform float normScale;

void main() {

	vTextureCoord = aTextureCoord;

	// height (Y) decreases as the color is closer to white
	vec3 height = normScale*vec3(0,1,0)*texture2D(uSampler, vTextureCoord).b;

	gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition - height, 1.0);
}
