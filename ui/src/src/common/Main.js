import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom'
import TestCases from '../testcases/TestCases'
import TestSuites from '../testsuites/TestSuites'
import Projects from '../projects/Projects'
import Launches from '../launches/Launches'
import Attributes from '../attributes/Attributes'
import ProjectForm from '../projects/ProjectForm'


const Main = () => (
  <main>
    <Switch>
      <Route exact path='/' component={Projects}/>
      <Route exact path='/projects' component={Projects}/>
      <Route exact path='/projects/new' component={ProjectForm}/>
      <Route path='/:project/testcases' component={TestCases}/>
      <Route path='/:project/testsuites' component={TestSuites}/>
      <Route path='/:project/launches' component={Launches}/>
      <Route path='/attributes/:project' component={Attributes}/>
    </Switch>
  </main>
)

export default Main;
