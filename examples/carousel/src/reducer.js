import { combineReducers } from 'redux';
import reduxInternal from 'redux-internal-state';

export default combineReducers({
  statesOfMyComponents: reduxInternal('statesOfMyComponents'),
  carousels: () => [
    {
      id: 'Carousel1',
      slides: [
        'https://www.newton.ac.uk/files/covers/968361.jpg',
        'https://www.wired.com/images_blogs/wiredscience/2012/06/pi-walk-660x516.jpg',
        'http://images5.fanpop.com/image/photos/30400000/World-map-random-30415186-1280-1024.jpg',
        'https://i.ytimg.com/vi/_EL6hcIP5ec/maxresdefault.jpg',
      ],
      width: 400,
      height: 300,
    },
    {
      id: 'Carousel2',
      slides: [
        'https://www.wired.com/images_blogs/wiredscience/2012/06/pi-walk-660x516.jpg',
        'https://www.newton.ac.uk/files/covers/968361.jpg',
        'http://images5.fanpop.com/image/photos/30400000/World-map-random-30415186-1280-1024.jpg',
      ],
      width: 500,
      height: 350,
    },
  ],
});
