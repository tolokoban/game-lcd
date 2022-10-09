#version 300 es

uniform vec2 uniAspectRatioContain;
in vec2 attUV;
out vec2 varUV;

void main() {
    varUV = attUV;
    vec2 point = vec2(2.0 * attUV.x - 1.0, 1.0 - 2.0 * attUV.y);
    gl_Position = vec4(point * uniAspectRatioContain, 0.5, 1.0);
}
