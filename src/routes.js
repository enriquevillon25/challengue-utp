import React from 'react'
import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom'
import HomeScreen from './screens/home/HomeScreens'


class Routes extends React.Component {

    render = () => (
        <Router>
            <Switch>
                <Route path='/' exact>
                    <HomeScreen/>
                </Route>
            </Switch>
        </Router>
    )
}

export default Routes