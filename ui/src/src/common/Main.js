import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom'
import TestCases from '../testcases/TestCases'
import TestSuites from '../testsuites/TestSuites'
import Projects from '../projects/Projects'
import Launches from '../launches/Launches'


const Main = () => (
  <main>
    <Switch>
      <Route exact path='/' component={Projects}/>
      <Route exact path='/projects' component={Projects}/>
      <Route path='/testcases' component={TestCases}/>
      <Route path='/testsuites' component={TestSuites}/>
      <Route path='/launches' component={Launches}/>
    </Switch>
  </main>
)

export default Main;
