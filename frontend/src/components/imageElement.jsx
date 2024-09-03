import React from 'react';
import axios from 'axios';
import config from '../config.json';
import Error from '../components/error';
import { Menu, MenuItem } from '@mui/material';
import { Rnd } from 'react-rnd';

function ImageElement ({ slideWidth, slideHeight, slideNum, presentationId, imageId, areaPercentage, source, width, height, positionX, positionY, tag, onRefresh }) {
  let [widthPercent, heightPercent] = areaPercentage.split(' ');
  widthPercent = widthPercent.replace('%', '');
  heightPercent = heightPercent.replace('%', '');

  const imageWidth = slideWidth * (widthPercent / 100);
  const imageHeight = slideHeight * (heightPercent / 100);

  const imageStyle = {
    width: imageWidth,
    height: imageHeight,
    position: 'absolute',
    left: `${positionX}px`,
    top: `${positionY}px`,
    overflow: 'hidden',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  };

  const [error, setError] = React.useState('');

  // get old data of current slide of image array from store
  const [store, setStore] = React.useState({});
  const [presentation, setPresentation] = React.useState({});
  const [presentationSlides, setPresentationSlides] = React.useState([]);
  const [currentSlide, setCurrentSlide] = React.useState({});
  const [imageArray, setImageArray] = React.useState([]);

  React.useEffect(() => {
    axios.get('http://localhost:' + config.BACKEND_PORT + '/store', {
      headers: {
        Authorization: localStorage.getItem('token')
      }
    }).then((response) => {
      setStore(response.data.store);
      setPresentation(response.data.store[presentationId]);
      setPresentationSlides(response.data.store[presentationId].slides);
      setCurrentSlide(response.data.store[presentationId].slides[slideNum - 1]);
      setImageArray(response.data.store[presentationId].slides[slideNum - 1].images);
    });
  }, [slideNum]);

  const errorHandler = () => {
    setError(null);
  }

  const [contextMenu, setContextMenu] = React.useState(null);

  const handleContextMenu = (event) => {
    event.preventDefault(); // Prevents the default context menu from appearing
    setContextMenu(
      contextMenu === null
        ? {
            mouseX: event.clientX + 2,
            mouseY: event.clientY - 6,
          }
        : null,
    );
  };

  const handleContextMenuClose = () => {
    if (contextMenu) {
      setContextMenu(null);
    }
  };

  const handleDelete = (event, imageId) => {
    event.preventDefault(); // Prevents the default context menu from appearing
    const indexImageToBeRemove = imageArray.findIndex(image => image.id === imageId);
    imageArray.splice(indexImageToBeRemove, 1)
    // update the image array in the slide
    setCurrentSlide({
      ...currentSlide,
      imageArray
    });
    // update the slide in the slide array
    const newArray = Array.from(presentationSlides);
    newArray[slideNum - 1] = currentSlide;

    axios.put('http://localhost:' + config.BACKEND_PORT + '/store', {
      store: {
        ...store,
        [presentationId]: {
          ...presentation,
          slides: newArray
        }
      }
    },
    {
      headers: {
        Authorization: localStorage.getItem('token')
      }
    });
    handleContextMenuClose();
    onRefresh();
  }

  const [RND, SetRND] = React.useState({ width: imageWidth, height: imageHeight, x: 10, y: 10 });

  const changePosition = (e, d) => {
    SetRND({
      ...RND,
      x: d.x,
      y: d.y
    });
    console.log(RND);
  };

  const changeSize = (e, direction, ref, delta, position) => {
    SetRND({
      ...RND,
      width: ref.style.width,
      height: ref.style.height,
    });
    console.log(RND);
  };

  return (
    <Rnd
      style={imageStyle}
      size={{ width: RND.width, height: RND.height }}
      position={{ x: RND.x, y: RND.y }}
      onDragStop={changePosition}
      onResizeStop={changeSize}
      onContextMenu={(event) => handleContextMenu(event)}
    >
      <img src={source} alt={tag} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
      <Menu
      open={contextMenu !== null}
      onClose={handleContextMenuClose}
      anchorReference="anchorPosition"
      anchorPosition={
        contextMenu !== null
          ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
          : undefined
      }
    >
      <MenuItem onClick={(event) => handleDelete(event, imageId)}>Delete</MenuItem>
    </Menu>
    {error && <Error message={error.message} onClose={errorHandler} />}
    </Rnd>
  );
}
export default ImageElement;
