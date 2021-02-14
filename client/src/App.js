import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'

import Map from './components/Map'

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/Login"></Route>
        <Route path="/Something"></Route>
        <Route path="/">
          <Map />
        </Route>
      </Switch>
    </Router>
  )
}

export default App
