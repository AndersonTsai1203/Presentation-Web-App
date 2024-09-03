import React from 'react';
import axios from 'axios';
import config from '../config.json';
import Error from '../components/error';
import { Menu, MenuItem } from '@mui/material';
import { LightAsync as SyntaxHighlighter } from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { c, python, javascript } from 'react-syntax-highlighter/dist/esm/languages/hljs';
import { Rnd } from 'react-rnd';

function CodeElement ({ slideWidth, slideHeight, slideNum, presentationId, codeId, areaPercentage, content, width, height, positionX, positionY, codeSize, onRefresh }) {
  SyntaxHighlighter.registerLanguage('c', c);
  SyntaxHighlighter.registerLanguage('python', python);
  SyntaxHighlighter.registerLanguage('javascript', javascript);

  const detectLanguage = (content) => {
    if (content.includes('function') || content.includes('=>')) {
      return 'javascript';
    } else if (content.includes('def') || content.includes('import')) {
      return 'python';
    } else if (content.includes('#include') || content.includes('int main()')) {
      return 'c';
    }
    return 'javascript';
  };

  let [widthPercent, heightPercent] = areaPercentage.split(' ');
  widthPercent = widthPercent.replace('%', '');
  heightPercent = heightPercent.replace('%', '');

  const codeWidth = slideWidth * (widthPercent / 100);
  const codeHeight = slideHeight * (heightPercent / 100);

  const codeStyle = {
    position: 'absolute',
    left: `${positionX}px`,
    top: `${positionY}px`,
    width: codeWidth,
    height: codeHeight,
    fontSize: `${codeSize}em`,
    overflow: 'auto', // Enable scrolling
  };

  const [error, setError] = React.useState('');

  // get old data of current slide of code array from store
  const [store, setStore] = React.useState({});
  const [presentation, setPresentation] = React.useState({});
  const [presentationSlides, setPresentationSlides] = React.useState([]);
  const [currentSlide, setCurrentSlide] = React.useState({});
  const [codeArray, setCodeArray] = React.useState([]);

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
      setCodeArray(response.data.store[presentationId].slides[slideNum - 1].codes);
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

  const handleDelete = (event, codeId) => {
    event.preventDefault(); // Prevents the default context menu from appearing
    const indexCodeToBeRemove = codeArray.findIndex(code => code.id === codeId);
    codeArray.splice(indexCodeToBeRemove, 1)
    // update the code array in the slide
    setCurrentSlide({
      ...currentSlide,
      codeArray
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
    handleContextMenuClose()
    onRefresh();
  }

  const [RND, SetRND] = React.useState({ width: codeWidth, height: codeHeight, x: 10, y: 10 });

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
      style={codeStyle}
      size={{ width: RND.width, height: RND.height }}
      position={{ x: RND.x, y: RND.y }}
      onDragStop={changePosition}
      onResizeStop={changeSize}
      onContextMenu={(event) => handleContextMenu(event)}
    >
      <SyntaxHighlighter language={detectLanguage(content)} style={docco}>
        {content}
      </SyntaxHighlighter>
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
        <MenuItem onClick={(event) => handleDelete(event, codeId)}>Delete</MenuItem>
      </Menu>
      {error && <Error message={error.message} onClose={errorHandler} />}
    </Rnd>
  );
}

export default CodeElement;
