
import { useRef, useEffect } from 'react'

const useCanvas = (vertexShaderSource, fragmentShaderSource, options = {}) => {

   const canvasRef = useRef(null)

   function resizeCanvas(context, canvas) {
      const { width, height } = canvas.getBoundingClientRect()

      if (canvas.width !== width || canvas.height !== height) {
         const { devicePixelRatio: ratio = 1 } = window
         canvas.width = width * ratio
         canvas.height = height * ratio
         context.scale(ratio, ratio)
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
      gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
      gl.clearColor(1.0, 1.0, 1.0, 1.0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      return gl;
   }


   useEffect(() => {

      const canvas = canvasRef.current
      let gl, program;


      var buffer;
      function initializeAttributes() {
         gl.enableVertexAttribArray(0);
         buffer = gl.createBuffer();
         gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
         gl.vertexAttribPointer(0, 1, gl.FLOAT, false, 0, 0);
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
      var positionLoc = gl.getUniformLocation(program, "position");
      
      console.log(positionLoc)
      gl.uniform1f(positionLoc, 0.0);  // set element 0
      console.log(positionLoc)
      console.log("((((((((((((")
      const render = () => {
         gl.drawArrays(gl.POINTS, 0, 1);
         window.requestAnimationFrame(render)
      }
      render()

      // return () => {
      //    window.cancelAnimationFrame(animationFrameId)
      // }
   }, [vertexShaderSource, fragmentShaderSource])

   return canvasRef
}

export default useCanvas