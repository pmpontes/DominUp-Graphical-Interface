#ifdef GL_ES
precision highp float;
#endif

varying vec2 vTextureCoord;

uniform sampler2D uSampler;		// identifies the piece
uniform sampler2D uSampler2;	// default look

void main() {

	// if part of the piece's number
	if(texture2D(uSampler, vTextureCoord).r < 0.1){
		vec4 color = texture2D(uSampler, vTextureCoord);
		gl_FragColor = color;
	}else{
		// display the piece's look
		vec4 color = texture2D(uSampler2, vTextureCoord);
		gl_FragColor = color;
	}
}
