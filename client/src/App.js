import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'

function App() {
  return (
    <Router>
      <Switch>
        <Route path='/Login'></Route>
        <Route path='/Something'></Route>
        <Route path='/'></Route>
      </Switch>
    </Router>
  )
}

export default App
