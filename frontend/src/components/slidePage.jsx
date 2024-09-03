import React from 'react';
import axios from 'axios';
import config from '../config.json';
import Error from '../components/error';
import TextElement from './textElement';
import VideoElement from './videoElement';
import ImageElement from './imageElement';
import CodeElement from './codeElement';
import { Card, CardContent, Box } from '@mui/material';

function SlidePage ({ slideNum, presentationId, onRefresh }) {
  const [error, setError] = React.useState('');
  // get old data of current slide of text array from store
  const [background, setBackground] = React.useState('');
  const [textArray, setTextArray] = React.useState([]);
  const [videoArray, setVideoArray] = React.useState([]);
  const [imageArray, setImageArray] = React.useState([]);
  const [codeArray, setCodeArray] = React.useState([]);

  React.useEffect(() => {
    axios.get('http://localhost:' + config.BACKEND_PORT + '/store', {
      headers: {
        Authorization: localStorage.getItem('token')
      }
    }).then((response) => {
      setBackground(response.data.store[presentationId].slides[slideNum - 1].background);
      setTextArray(response.data.store[presentationId].slides[slideNum - 1].texts);
      setVideoArray(response.data.store[presentationId].slides[slideNum - 1].videos);
      setImageArray(response.data.store[presentationId].slides[slideNum - 1].images);
      setCodeArray(response.data.store[presentationId].slides[slideNum - 1].codes);
    });
  }, [slideNum, onRefresh]);

  const errorHandler = () => {
    setError(null);
  }

  const [screenSize, setScreenSize] = React.useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  React.useEffect(() => {
    const handleResize = () => {
      setScreenSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const slidePercentage = 60;
  const slideWidth = screenSize.width * (slidePercentage / 100);
  const slideHeight = screenSize.height * (slidePercentage / 100);

  return (
    <Card
      sx={{
        maxWidth: '80vw',
        width: `${slideWidth}px`,
        height: `${slideHeight}px`,
        m: 'auto',
        mt: 5,
        boxShadow: 3,
        position: 'relative',
      }}
      style={{ background: `${background}` }}
    >
      <CardContent sx={{
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        height: '100%',
        position: 'relative'
      }}>
        <Box sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          p: 1,
        }}>
          {textArray.map((text) => (
            <Card key={text.id}>
              <TextElement
                slideWidth={slideWidth}
                slideHeight={slideHeight}
                slideNum={slideNum}
                presentationId={presentationId}
                textId={text.id}
                areaPercentage={text.percentage}
                content={text.content}
                width={text.width}
                height={text.height}
                positionX={text.positionX}
                positionY={text.positionY}
                fontSize={text.textSize}
                textColor={text.color}
                textFontFamily={text.fontFamily}
                onRefresh={() => onRefresh()}
                />
            </Card>
          ))}
          {imageArray.map((image) => (
            <Card key={image.id}>
              <ImageElement
                slideWidth={slideWidth}
                slideHeight={slideHeight}
                slideNum={slideNum}
                presentationId={presentationId}
                imageId={image.id}
                areaPercentage={image.percentage}
                source={image.source}
                width={image.width}
                height={image.height}
                positionX={image.positionX}
                positionY={image.positionY}
                tag={image.tag}
                onRefresh={() => onRefresh()}
              />
            </Card>
          ))}
          {videoArray.map((video) => (
            <Card key={video.id}>
              <VideoElement
                slideWidth={slideWidth}
                slideHeight={slideHeight}
                slideNum={slideNum}
                presentationId={presentationId}
                videoId={video.id}
                areaPercentage={video.percentage}
                source={video.source}
                width={video.width}
                height={video.height}
                positionX={video.positionX}
                positionY={video.positionY}
                autoPlay={video.autoPlay}
                onRefresh={onRefresh()}
              />
            </Card>
          ))}
          {codeArray.map((code) => (
            <Card key={code.id}>
              <CodeElement
                slideWidth={slideWidth}
                slideHeight={slideHeight}
                slideNum={slideNum}
                presentationId={presentationId}
                codeId={code.id}
                areaPercentage={code.percentage}
                content={code.content}
                width={code.width}
                height={code.height}
                positionX={code.positionX}
                positionY={code.positionY}
                codeSize={code.codeSize}
                onRefresh={() => onRefresh()}
                />
            </Card>
          ))}
        </Box>
        <Box sx={{
          position: 'absolute',
          bottom: 40,
          left: 5,
          p: 1,
          textAlign: 'left'
        }}>
          {slideNum}
        </Box>
      </CardContent>
      {error && <Error message={error.message} onClose={errorHandler} />}
    </Card>
  );
}

export default SlidePage;
