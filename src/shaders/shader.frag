// Author: @patriciogv
// Title: 4 cells voronoi

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

// 2D Random
float random (in vec2 st) {
    return fract(sin(dot(st.xy,
                         vec2(12.9898,78.233)))
                 * 43758.5453123);
}

float noise (in vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);

    // Four corners in 2D of a tile
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));

    // Smooth Interpolation

    // Cubic Hermine Curve.  Same as SmoothStep()
    vec2 u = f*f*(3.0-2.0*f);
    // u = smoothstep(0.,1.,f);

    // Mix 4 coorners percentages
    return mix(a, b, u.x) +
            (c - a)* u.y * (1.0 - u.x) +
            (d - b) * u.x * u.y;
}


void main() {
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    st.x *= u_resolution.x/u_resolution.y;

    vec3 color = vec3(.0);

    // Cell positions
    vec2 point[5];
    point[0] = vec2(0.83,0.75);
    point[1] = vec2(0.70,0.17);
    point[2] = vec2(0.18,0.64);
    point[3] =  vec2(1.0,1.0);
    point[4] = u_mouse/u_resolution;
    
    
    // Cell colors
    vec3 colorArr[5];
    colorArr[0] = vec3(0.83, 0.75, 0.2);
    colorArr[1] = vec3(0.60, 0.07, 0.2);
    colorArr[2] = vec3(0.18, 0.64, 0.2);
    colorArr[3] = vec3(0.55, 0.26, 0.2);
    colorArr[4] = vec3(1.0, 0.26, 0.2);

    float m_dist = 4.;  // minimum distance
    vec3 m_color = vec3(0.0);        // minimum position

    // Iterate through the points positions
    for (int i = 0; i < 5; i++) {
        //with noise: + 0.05 * vec2(noise(st * 50.0))
        float dist = distance(st, point[i]) ;
        if ( dist < m_dist ) {
            // Keep the closer distance
            m_dist = dist;

            // Keep the position of the closer point
            m_color = colorArr[i];
        }
    }

    // Add distance field to closest point center

    // tint acording the closest point position
    color.rg = m_color.rg;
    //color *= 1.0 - m_dist*4.;

    // Show isolines
    //color -= abs(sin(200.0*m_dist + -u_time * 0.1))*0.07;

    // Draw point center
    color += 1.-step(.02, m_dist);

    // float n = noise(st * 5.0)

     gl_FragColor = vec4(color,1.0);

    // Scale the coordinate system to see
    // some noise in action
    //vec2 pos = vec2(st*25.0);

    // Use the noise function
    //float n = noise(pos);

    //gl_FragColor = vec4(vec3(n), 1.0);
}
