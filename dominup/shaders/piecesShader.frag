#ifdef GL_ES
precision highp float;
#endif

varying vec2 vTextureCoord;

uniform sampler2D uSampler;		// identifies the piece look
uniform sampler2D uSampler2;		// identifies the piece number

void main() {
	vec4 color = texture2D(uSampler, vTextureCoord);
	gl_FragColor = color;
}
