#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

void main() {
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    vec3 color = vec3(.0);

    // mouse positions
    vec2 point = u_mouse/u_resolution;
    float dist = distance(st, point) ;
    
    color.rg = st;
    // Draw point center
    color += 1.-step(.005, dist);
    gl_FragColor = vec4(color.rg, 0.0,1.0);
}
