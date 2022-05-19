#version 100
precision highp float;

attribute vec2 aVertexPosition;

uniform vec2 MOUSE_POS;

void main() {
  gl_Position = vec4(aVertexPosition, 0.0, 1.0);
}