import React from 'react';
import './App.css';
import {BrowserRouter,Route,Switch,Redirect} from "react-router-dom";
import login from './Pages/login/login';
import Dashboard from './Pages/Dashboard/Dashboard';
import resetPassword from './Pages/login/resetPassword';



function App() {
  return (
      <BrowserRouter>
        <Switch>
            <Route exact path="/sisl-psc-fsi" component={login} />
            <Route exact path="/sisl-psc-fsi/login" component={login} />
            <Route exact path="/sisl-psc-fsi/dashboard" component={Dashboard} />
            <Route exact path="/sisl-psc-fsi/resetPassword" component={resetPassword} />
            <Route path="/:404" ><NotFound/></Route>

        </Switch>
      </BrowserRouter>

  );
}

function NotFound() {
    return (
        "404 page not found"
    );
}

export default App;
