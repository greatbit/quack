import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom'
import TestCases from '../testcases/TestCases'
import TestSuites from '../testsuites/TestSuites'
import Projects from '../projects/Projects'
import Launches from '../launches/Launches'
import Attributes from '../attributes/Attributes'
import ProjectForm from '../projects/ProjectForm'
import TestcaseForm from '../testcases/TestcaseForm'


const Main = () => (
  <main>
    <Switch>
      <Route exact path='/' component={Projects}/>
      <Route exact path='/projects' component={Projects}/>
      <Route exact path='/projects/new' component={ProjectForm}/>
      <Route exact path='/testcases/:project/new' component={TestcaseForm}/>
      <Route path='/testcases/:project' component={TestCases}/>
      <Route path='/testsuites/:project' component={TestSuites}/>
      <Route path='/launches/:project' component={Launches}/>
      <Route path='/attributes/:project' component={Attributes}/>
    </Switch>
  </main>
)

export default Main;
