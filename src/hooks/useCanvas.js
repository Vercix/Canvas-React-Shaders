
import { useRef, useEffect } from 'react'

const useCanvas = (draw, vertexShaderSource, fragmentShaderSource, options = {}) => {

   const canvasRef = useRef(null)

   function resizeCanvas(canvas) {
      const { width, height } = canvas.getBoundingClientRect()
      console.log('________')
      console.log(width, height)
      console.log('________')
      if (canvas.width !== width || canvas.height !== height) {
         const { devicePixelRatio: ratio = 2 } = window
         canvas.width = width * ratio
         canvas.height = height * ratio
         return true
      }

      return false
   }

   function getGl(canvas) {
      console.log(canvas)
      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;
      var gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
      console.log(gl)
      if (!gl) {
         return null;
      }
      console.log('-BUFFER SIZE-')
      console.log(gl.drawingBufferWidth)
      console.log(gl.drawingBufferHeight) 
      console.log('-BUFFER SIZE-')
      gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
      gl.clearColor(1.0, 1.0, 1.0, 1.0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      return gl;
   }


   useEffect(() => {

      const canvas = canvasRef.current
      resizeCanvas(canvas)
      let gl, program, itemSize, numItems, frameNumber = 1;

      function setUniform(uniformName, value) {
         var positionLoc = gl.getUniformLocation(program, uniformName);
         gl.uniform1f(positionLoc, value);
      }

      function handleMouseMove(e) {

         var xRelativeToCanvas = e.pageX - e.target.offsetLeft;
         var yRelativeToCanvas = e.target.height - ( e.pageY - e.target.offsetTop);

         // console.log(yRelativeToCanvas)
         console.log(xRelativeToCanvas)
         var positionLoc = gl.getUniformLocation(program, 'u_mouse');
         gl.uniform2f(positionLoc, xRelativeToCanvas, yRelativeToCanvas);

      }
      // setUniform('MOUSE_POS', [clickXinWebGLCoords, clickYinWebGLCoords])
      canvas.addEventListener('mousemove', handleMouseMove)

      var buffer;
      function initializeAttributes() {

         var vertices = new Float32Array([
            -1.0, -1.0, 1.0, 1.0, -1.0, 1.0, // Triangle 1
            -1.0, -1.0, 1.0, 1.0, 1.0, -1.0 // Triangle 2
         ]);

         itemSize = 2;
         numItems = vertices.length / itemSize;

         gl.enableVertexAttribArray(0);
         buffer = gl.createBuffer();

         gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
         gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

         program.aVertexPosition = gl.getAttribLocation(program, "aVertexPosition");
         gl.enableVertexAttribArray(program.aVertexPosition);
         gl.vertexAttribPointer(program.aVertexPosition, itemSize, gl.FLOAT, false, 0, 0);

      }

      function cleanup() {
         gl.useProgram(null);
         if (buffer)
            gl.deleteBuffer(buffer);
         if (program)
            gl.deleteProgram(program);
      }

      console.log("******")
      if (!(gl = getGl(canvas))) {
         console.log("No GL")
         return;
      }

      var vertexShader = gl.createShader(gl.VERTEX_SHADER);
      gl.shaderSource(vertexShader, vertexShaderSource);
      gl.compileShader(vertexShader);

      var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
      gl.shaderSource(fragmentShader, fragmentShaderSource);
      gl.compileShader(fragmentShader);

      program = gl.createProgram();
      gl.attachShader(program, vertexShader);
      gl.attachShader(program, fragmentShader);
      gl.linkProgram(program);
      gl.detachShader(program, vertexShader);
      gl.detachShader(program, fragmentShader);
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);

      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
         var linkErrLog = gl.getProgramInfoLog(program);
         cleanup();
         return;
      }

      initializeAttributes();

      gl.useProgram(program);
      program.resolutionPosition = gl.getUniformLocation(program, 'u_resolution');
      console.log(program.resolutionPosition)
      console.log("))))))))")
      console.log(canvas.width)
      console.log(canvas.height)
      gl.uniform2f(program.resolutionPosition , canvas.width, canvas.height);

      function draw() {
         gl.drawArrays(gl.TRIANGLES, 0, numItems);
      }

      function postDraw() {
         frameNumber++;
         var timeLoc = gl.getUniformLocation(program, 'u_time');
         gl.uniform1f(timeLoc, frameNumber);
      }

      const render = () => {
         draw();
         postDraw();
         window.requestAnimationFrame(render)
      }
      render()

      return () => {
         //window.cancelAnimationFrame(animationFrameId)
         canvas.removeEventListener('mousemove', handleMouseMove)
      }
   }, [vertexShaderSource, fragmentShaderSource])

   return canvasRef
}

export default useCanvas