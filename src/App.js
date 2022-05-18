
import Canvas from './components/Canvas'


import globalStyle from './styles/global.css'
import styled from 'styled-components'



const vertexSource = require('./shaders/shader.vert')
const fragmentSource = require('./shaders/shader.frag')

const Container = styled.div`
  display: inline-block;
  border: 1px solid black;
  margin: 0 auto;
`

const StyledCanvas = styled(Canvas)`
  height: 400px;
  width: 400px;
`

function App(props) {
  return (
    <Container>
      <StyledCanvas
        vertexShaderSource={vertexSource}
        fragmentShaderSource={fragmentSource}
        {...props}
      />
    </Container>
  );
}

export default App;
