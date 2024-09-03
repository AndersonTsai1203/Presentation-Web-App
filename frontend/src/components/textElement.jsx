import React from 'react';
import axios from 'axios';
import config from '../config.json';
import Error from '../components/error';
import { Menu, MenuItem } from '@mui/material';
import EditTextElement from '../modals/editText';
import { Rnd } from 'react-rnd';

function TextElement ({ slideWidth, slideHeight, slideNum, presentationId, textId, areaPercentage, content, width, height, positionX, positionY, textSize, textColor, textFontFamily, onRefresh }) {
  let [widthPercent, heightPercent] = areaPercentage.split(' ');
  widthPercent = widthPercent.replace('%', '');
  heightPercent = heightPercent.replace('%', '');

  const textWidth = slideWidth * (widthPercent / 100);
  const textHeight = slideHeight * (heightPercent / 100);

  const textStyle = {
    width: `${textWidth}px`,
    height: `${textHeight}px`,
    position: 'absolute',
    left: `${positionX}px`,
    top: `${positionY}px`,
    fontSize: `${textSize}rem`,
    color: textColor,
    overflow: 'hidden',
    textAlign: 'left',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    border: '1px solid #ccc',
    boxSizing: 'border-box',
    padding: '4px',
    fontFamily: textFontFamily,
  };

  const [error, setError] = React.useState('');
  // get old data of current slide of text array from store
  const [store, setStore] = React.useState({});
  const [presentation, setPresentation] = React.useState({});
  const [presentationSlides, setPresentationSlides] = React.useState([]);
  const [currentSlide, setCurrentSlide] = React.useState({});
  const [textArray, setTextArray] = React.useState([]);

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
      setTextArray(response.data.store[presentationId].slides[slideNum - 1].texts);
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

  const handleDelete = (event, textId) => {
    event.preventDefault(); // Prevents the default context menu from appearing
    const indexTextToBeRemove = textArray.findIndex(text => text.id === textId);
    textArray.splice(indexTextToBeRemove, 1)
    // update the code array in the slide
    setCurrentSlide({
      ...currentSlide,
      textArray
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

  // handle edit text details modal
  const [editOpen, setEditOpen] = React.useState(false);
  const handleEditOpen = () => setEditOpen(true);
  const handleEditClose = () => setEditOpen(false);

  const handleEdit = () => {
    handleEditOpen()
    handleContextMenuClose();
  }

  const [RND, SetRND] = React.useState({ width: textWidth, height: textHeight, x: 10, y: 10 });

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
      style={textStyle}
      size={{ width: RND.width, height: RND.height }}
      position={{ x: RND.x, y: RND.y }}
      onDragStop={changePosition}
      onResizeStop={changeSize}
      onContextMenu={(event) => handleContextMenu(event)}
    >
      {content}
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
        <MenuItem onClick={handleEdit}>Edit</MenuItem>
        <MenuItem onClick={(event) => handleDelete(event, textId)}>Delete</MenuItem>
      </Menu>
      {error && <Error message={error.message} onClose={errorHandler} />}
      {editOpen && <EditTextElement isOpen={editOpen} onClose={handleEditClose} slideNum={slideNum} presentationId={presentationId} textId={textId} onRefresh={() => onRefresh()}/>}
    </Rnd>
  );
}

export default TextElement;
