
import React from 'react'
import useCanvas from '../hooks/useCanvas'


const Canvas = props => {

   const { vertexShaderSource, fragmentShaderSource, options, draw, ...rest } = props
   const { context, ...moreConfig } = options || {};
   const canvasRef = useCanvas(draw, vertexShaderSource, fragmentShaderSource, {context})

   return <canvas  ref={canvasRef} {...rest} />
}

export default Canvas