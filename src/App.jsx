import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { dbTests } from './tests/LocalDB.test'

function App() {
  const [count, setCount] = useState(0)
  const [testResults, setTestResults] = useState([])
  const [isTestRunning, setIsTestRunning] = useState(false)

  const handleRunTests = async () => {
    setIsTestRunning(true)
    setTestResults([]) // Limpiar resultados anteriores
    
    try {
      // Capturar los console.log
      const originalLog = console.log
      const logs = []
      console.log = (...args) => {
        logs.push(args.join(' '))
        originalLog.apply(console, args)
      }

      // Ejecutar pruebas
      await dbTests.runAllTests()
      
      // Restaurar console.log
      console.log = originalLog
      
      // Actualizar resultados
      setTestResults(logs)
    } catch (error) {
      console.error('Error en las pruebas:', error)
      setTestResults(prev => [...prev, `❌ Error: ${error.message}`])
    } finally {
      setIsTestRunning(false)
    }
  }

  const TestResults = () => (
    testResults.length > 0 && (
      <div className="test-results">
        <h3>Resultados de las pruebas:</h3>
        <div className="results-container">
          {testResults.map((result, index) => (
            <div 
              key={index}
              className={`result-item ${
                result.includes('✅') ? 'success' : 
                result.includes('❌') ? 'error' : ''
              }`}
            >
              {result}
            </div>
          ))}
        </div>
      </div>
    )
  )

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>

      {/* Sección de pruebas */}
      <div className="test-section">
        <button 
          onClick={handleRunTests}
          disabled={isTestRunning}
          className={`test-button ${isTestRunning ? 'running' : ''}`}
        >
          {isTestRunning ? 'Ejecutando pruebas...' : 'Probar Base de Datos'}
        </button>

        <TestResults />
      </div>

      <style>
        {`
          .test-section {
            margin-top: 2rem;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 1rem;
          }

          .test-button {
            background: #646cff;
            color: white;
            border: none;
            padding: 0.6em 1.2em;
            border-radius: 8px;
            transition: all 0.25s;
          }

          .test-button:hover {
            background: #747bff;
          }

          .test-button.running {
            opacity: 0.5;
            cursor: not-allowed;
          }

          .test-results {
            width: 100%;
            max-width: 600px;
          }

          .test-results h3 {
            margin-bottom: 1rem;
            color: #fff;
          }

          .results-container {
            background: #1a1a1a;
            border-radius: 8px;
            padding: 1rem;
            max-height: 300px;
            overflow-y: auto;
            text-align: left;
          }

          .result-item {
            margin-bottom: 0.5rem;
            padding: 0.25rem 0;
            color: #fff;
          }

          .result-item.success {
            color: #4ade80;
          }

          .result-item.error {
            color: #ef4444;
          }
        `}
      </style>
    </>
  )
}

export default App