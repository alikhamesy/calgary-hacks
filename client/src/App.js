import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'

// import Map from './components/Map'
import Login from './pages/Login'
import Explore from './pages/Explore'

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/Login"></Route>
        <Route path="/explore">
          <Explore />
        </Route>
        <Route path="/">
          <Login />
        </Route>
      </Switch>
    </Router>
  )
}

export default App
