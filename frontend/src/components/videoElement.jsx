import React from 'react';
import axios from 'axios';
import config from '../config.json';
import Error from '../components/error';
import { Menu, MenuItem } from '@mui/material';
import { Rnd } from 'react-rnd';

function VideoElement ({ slideWidth, slideHeight, slideNum, presentationId, videoId, areaPercentage, source, width, height, positionX, positionY, autoPlay, onRefresh }) {
  let [widthPercent, heightPercent] = areaPercentage.split(' ');
  widthPercent = widthPercent.replace('%', '');
  heightPercent = heightPercent.replace('%', '');

  const videoWidth = slideWidth * (widthPercent / 100);
  const videoHeight = slideHeight * (heightPercent / 100);

  const videoStyle = {
    width: videoWidth,
    height: videoHeight,
    position: 'absolute',
    left: `${positionX}px`,
    top: `${positionY}px`
  };

  const sourceId = (source.split('si=')[1]).split('&')[0];

  const iframeSrc = `https://www.youtube.com/embed/${sourceId}?autoplay=${autoPlay ? '1' : '0'}`;

  const [error, setError] = React.useState('');

  // get old data of current slide of text array from store
  const [store, setStore] = React.useState({});
  const [presentation, setPresentation] = React.useState({});
  const [presentationSlides, setPresentationSlides] = React.useState([]);
  const [currentSlide, setCurrentSlide] = React.useState({});
  const [videoArray, setVideoArray] = React.useState([]);

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
      setVideoArray(response.data.store[presentationId].slides[slideNum - 1].videos);
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

  const handleDelete = (event, videoId) => {
    event.preventDefault(); // Prevents the default context menu from appearing
    event.stopPropagation();
    const indexVideoToBeRemove = videoArray.findIndex(video => video.id === videoId);
    videoArray.splice(indexVideoToBeRemove, 1)
    // update the video array in the slide
    setCurrentSlide({
      ...currentSlide,
      videoArray
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

  const [RND, SetRND] = React.useState({ width: videoWidth, height: videoHeight, x: 10, y: 10 });

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
      style={videoStyle}
      size={{ width: RND.width, height: RND.height }}
      position={{ x: RND.x, y: RND.y }}
      onDragStop={changePosition}
      onResizeStop={changeSize}
      onContextMenu={(event) => handleContextMenu(event)}
    >
      <iframe
        width="100%"
        height="100%"
        src={iframeSrc}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        title="Embedded youtube"
        style="border: 2px solid black;"
      />
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
        <MenuItem onClick={(event) => handleDelete(event, videoId)}>Delete</MenuItem>
      </Menu>
      {error && <Error message={error.message} onClose={errorHandler} />}
    </Rnd>
  );
}

export default VideoElement;
