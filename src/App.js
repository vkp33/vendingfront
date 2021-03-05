import './App.css';
import React, {useState, useEffect} from 'react';
import DrinkItem from './components/drinkItem';
import drinkItemStyles from '../src/components/drinkItemStyles'
import exportFromJSON from 'export-from-json'

function App() {
  //state for holding list of drinks 
  const [update, setUpdate] = useState(
    {
      update: 0
    }
  )
  const [drinks, setDrinks] = useState({
    //loading finished makes sure that call to api has completed before passing data to component
    loadingfinished: false,
    drinks: []});


  useEffect(() => {
    //gets list of all drinks 
    const apiUrl = 'https://vending-machine-project.herokuapp.com/api/drink/';
    fetch(apiUrl)
    .then(res => res.json())
    .then((data) => {
      setDrinks({loadingfinished: true, drinks: data});
      //console.log(data)
    })
 }, [update] );


  //called from drinkItem component when item is purchased to download file, send request to update db, and update stock in UI
  function onPurchase(fileName, data, apiUrl){
    const exportType = 'json';
    const requestOptions = {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
    };
    //sends a request to change the available stock of the drink that is being purchased, and upon a successful request the file is downloaded
    fetch(apiUrl, requestOptions)
      .then(response => response.json())
      .then(exportFromJSON({ data, fileName, exportType }))
      .then( data =>
        {
          setTimeout(500);
          setUpdate({update: update + 1});
        }
      )
  };

  return (
    <div className="App">
      <header className="App-header">
        <img
          style = {drinkItemStyles.bgimage}
          src={process.env.PUBLIC_URL + '/colacologo.png'}
          alt="Cola Co"
        />
      </header>
      {
        //ensures that the drink items only appear after the api has loaded the data into the state
        drinks.loadingfinished &&
        //maps drink items to the DrinkItem object, passing the item as props 
        <header className = "App-body">
          <div className="Container">
            {drinks.drinks.map((drink) =>
            {
              return <DrinkItem key = {JSON.stringify(drink.id)} drinks = {drink} updateStock = {onPurchase} />
            })
            }
          </div>
        </header>
      }
    </div>
  );
}

export default App;

