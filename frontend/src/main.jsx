import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <App />,
)

// 🌸
console.log(
  '%c我其实一直很愧疚，没有当面送你花\n%c这算是我对此的补偿',
  'color: #7aaa8e; font-size: 14px; font-style: italic; padding: 8px 0 2px;',
  'color: #7aaa8e; font-size: 14px; font-style: italic; padding: 2px 0 8px;'
)
