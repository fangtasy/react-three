import { useState, useEffect } from 'react'
import { initScene } from './entry.js';
import './base/index.css';

function App() {
  // const [count, setCount] = useState(0)

  useEffect(() => {
    initScene()
  }, [])

  return (
    <canvas id="canvas-three">您的浏览器不支持canvas</canvas>
  )
}

export default App
