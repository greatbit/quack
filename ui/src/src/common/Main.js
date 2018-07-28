import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom'
import TestCases from '../testcases/TestCases'
import TestSuites from '../testsuites/TestSuites'
import Projects from '../projects/Projects'
import Launches from '../launches/Launches'
import Attributes from '../attributes/Attributes'
import ProjectForm from '../projects/ProjectForm'
import TestCaseForm from '../testcases/TestCaseForm'
import TestCase from '../testcases/TestCase'


const Main = () => (
  <main>
    <Switch>
      <Route exact path='/' component={Projects}/>
      <Route exact path='/projects' component={Projects}/>
      <Route exact path='/projects/new' component={ProjectForm}/>
      <Route exact path='/:project/testcases/new' component={TestCaseForm}/>
      <Route path='/:project/testcases/:testcase' component={TestCase}/>
      <Route path='/:project/testcases/' component={TestCases}/>
      <Route path='/:project/testsuites' component={TestSuites}/>
      <Route path='/:project/launches' component={Launches}/>
      <Route path='/:project/attributes' component={Attributes}/>
    </Switch>
  </main>
)

export default Main;
