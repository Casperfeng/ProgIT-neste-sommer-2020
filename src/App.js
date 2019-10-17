import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [imageTiles, setImageTiles] = useState();
  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get(
        'https://europe-west1-progit-playground.cloudfunctions.net/progit-photo-api'
      );
      setImageTiles(response.data.tiles);
    };
    fetchData();
  }, []);

  function retrieveCoords(url) {
    const splitUrl = url.split('.');
    let coords = splitUrl[splitUrl.length - 2].split('-');
    coords = coords.map(val => val - 0);
    return [url, ...coords.slice(3, 5)];
  }

  function getDimensions(urlCoordList) {
    let width = 0,
      height = 0;
    for (const urlCoords of urlCoordList) {
      if (height < urlCoords[2]) {
        height = urlCoords[2];
      }
      if (width < urlCoords[1]) {
        width = urlCoords[1];
      }
    }
    return [width + 1, height + 1];
  }

  function createImageTiles(dimensions, urlCoordList) {
    const imageMatrix = new Array(dimensions[1]);
    for (let i = 0; i < imageMatrix.length; i++) {
      imageMatrix[i] = new Array(dimensions[0]);
    }

    for (const urlCoord of urlCoordList) {
      imageMatrix[urlCoord[1]][urlCoord[2]] = urlCoord[0];
    }
    return imageMatrix;
  }
  let resultMatrix, resultList, urlCoordList, dimensions, images;

  if (imageTiles) {
    urlCoordList = imageTiles.map(url => retrieveCoords(url));
    dimensions = getDimensions(urlCoordList);
    resultMatrix = createImageTiles(dimensions, urlCoordList);
    resultList = [];
    for (let i = 0; i < resultMatrix.length; i++) {
      for (let j = 0; j < resultMatrix.length; j++) {
        resultList.push(resultMatrix[j][i]);
      }
    }
    images = resultList.map((val, i) => (
      <span key={i + 'sdaidoj'}>
        <img className='progitImage' src={val} alt='' />
        {(i === dimensions[1] - 1 || (i + 1) % dimensions[1] === 0) && <br />}
      </span>
    ));
  }

  return (
    <div className='App'>
      <h3>ProgIT Solution:</h3>
      <div className='imageContainer'>{imageTiles && images}</div>
    </div>
  );
}

export default App;
