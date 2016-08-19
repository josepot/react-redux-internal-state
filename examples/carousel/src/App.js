import React from 'react';
import R from 'ramda';
import { connect } from 'react-redux';
import './App.css';
import Carousel from './components/carousel';

const App = ({ carousels }) => (
  <div className="App">
    {
      carousels.map(({ id, slides, width, height }) => (
        <Carousel key={id} instanceId={id}
          width={width} height={height} slidesSrc={slides} />
      ))
    }
  </div>
);

export default connect(R.pick(['carousels']))(App);
