#version 100
precision highp float;

uniform float position;

void main() {
  gl_Position = vec4(position, 0.0, 0.0, 1.0);
  gl_PointSize = 16.0;
}