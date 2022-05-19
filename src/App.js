
import Canvas from './components/Canvas'


import globalStyle from './styles/global.css'
import styled from 'styled-components'



const vertexSource = require('./shaders/shader.vert')
const fragmentSource = require('./shaders/shader.frag')

const Container = styled.div`
  display: inline-block;
  margin: 0 auto;
`

const StyledCanvas = styled(Canvas)`
  height: 600px;
  width: 600px;
`


function App(props) {

  return (
    <Container>
      <br />
      <StyledCanvas
        vertexShaderSource={vertexSource}
        fragmentShaderSource={fragmentSource}
        {...props}
      />
      <br />
    </Container>
  );
}

export default App;
