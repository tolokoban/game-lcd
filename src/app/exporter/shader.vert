#version 300 es

uniform vec2 uniAspectRatioContain;
uniform float uniZ;
in vec2 attPoint;
in vec2 attUV;
out vec2 varUV;

void main() {
    varUV = attUV;
    gl_Position = vec4(attPoint * uniAspectRatioContain, uniZ, 1.0);
}
