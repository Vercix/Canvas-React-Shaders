import useCanvas from '../hooks/useCanvas'


const Canvas = props => {

   const { vertexShaderSource, fragmentShaderSource, ...rest } = props
   const canvasRef = useCanvas(vertexShaderSource, fragmentShaderSource)

   return <canvas  ref={canvasRef} {...rest} />
}

export default Canvas