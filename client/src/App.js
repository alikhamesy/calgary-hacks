import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'

// import Map from './components/Map'
import Login from './pages/Login'
import Explore from './pages/Explore'
import Room from './pages/Room'

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/room">
          <Room />
        </Route>
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
