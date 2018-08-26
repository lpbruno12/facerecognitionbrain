import React, { Component } from 'react';
import Particles from 'react-particles-js';
import Navigation from './components/Navigation/Navigation';
import SignIn from './components/SignIn/SignIn';
import Register from './components/Register/Register';
import Logo from './components/Logo/Logo';
import Rank from './components/Rank/Rank';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Clarifai from 'clarifai';
import './App.css';

const clarifaiApp = new Clarifai.App({
 apiKey: '117db1c6141d43e1915749ec4443e812'
});

const particlesOptions = {
  particles: {
    number: {
      value: 50,
      density: {
        enable: true,
        value_area: 800
      }
    }
  }
}
class App extends Component {
  constructor() {
    super();
    this.state = {
      input: '',
      imageUrl: '',
      boxes: [],
      route: 'signin',
      isSignedIn: false
    }
  }

  displayFaceBox = (data) => {
    const image = document.getElementById('inputImage');
    const width = Number(image.width);
    const height = Number(image.height);

    const regions = data.outputs[0].data.regions;

    const boxes = regions
      .map((region, i) => 
          (
            {
              key: regions[i].id,
              leftCol: regions[i].region_info.bounding_box.left_col * width,
              topRow: regions[i].region_info.bounding_box.top_row * height,
              rightCol: width - (regions[i].region_info.bounding_box.right_col * width),
              bottomRow: height - (regions[i].region_info.bounding_box.bottom_row * height)
            }
          )
      );
    this.setState({ boxes: boxes });
  }

  onInputChange = (event) => {
    this.setState({ input: event.target.value });
  }

  onButtonSubmit = () => {
    this.setState({ imageUrl: this.state.input});
    clarifaiApp.models
      .predict(
          Clarifai.FACE_DETECT_MODEL,
          this.state.input)
      .then(response => this.displayFaceBox(response))
      .catch(err => console.log(err));
  }

  onRouteChange = (route) => {
    if (route === 'signout') {
      this.setState({isSignedIn : false})
    } else if (route === 'home') {
      this.setState({isSignedIn : true})
    }
    this.setState({ route: route });
  }

  render() {
    const { isSignedIn, imageUrl, route, boxes } = this.state;
    return (
      <div className="App">
         <Particles className='particles'
              params={particlesOptions}
            />
        { this.state.route === 'home'
          ?   <div>
                <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange}/>
                <Logo />
                <Rank />
                <ImageLinkForm 
                onInputChange={this.onInputChange} 
                onButtonSubmit={this.onButtonSubmit}/>
                <FaceRecognition boxes={boxes} imageUrl={imageUrl}/>
              </div>
           : ( 
                this.state.route === 'signin'
                ? <SignIn onRouteChange={this.onRouteChange}/>
                : <Register onRouteChange={this.onRouteChange}/>
              ) 
        }
      </div>
    );
  }
}

export default App;