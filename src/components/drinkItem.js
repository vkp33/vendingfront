import React, { Component, audio } from 'react';
import ReactCardFlip from 'react-card-flip';
import drinkItemStyles from './drinkItemStyles'


class DrinkItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isFlipped: false,
      isButtonDisabled: false
    };
    this.handleHover = this.handleHover.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  handleHover(event) {
    event.preventDefault();
    this.setState(prevState => ({ isFlipped: !prevState.isFlipped }));
  }

  handleClick(event){
    event.preventDefault();
    const fileName = JSON.stringify(this.props.drinks.name);
    const data = JSON.stringify(this.props.drinks);
    const apiUrl = 'https://vending-machine-project.herokuapp.com/api/drink/purchase/' + JSON.stringify(this.props.drinks.id);
    this.props.updateStock(fileName, data, apiUrl);
    if(JSON.stringify(this.props.drinks.available_stock) < 4)
    {
      this.setState({
        isButtonDisabled: true
      });

      // **** here's the timeout ****
      setTimeout(() => this.setState({ isButtonDisabled: false }), 2000);
    }
    const audioUrl = process.env.PUBLIC_URL + '/bottledrop.wav';
    const audio = new Audio(audioUrl);
    audio.play();
}
  

  render() {
    return (
      <ReactCardFlip isFlipped={this.state.isFlipped} infinite>
        <div style={drinkItemStyles.card}>
            <img
                onMouseOver={this.handleHover}
                style={drinkItemStyles.image}
                src={this.props.drinks.logo}
                alt={JSON.stringify(this.props.drinks.name)}
            />

        
        </div>

        <div style={drinkItemStyles.cardBack}
            onMouseLeave={this.handleHover}
        >
            <div style={drinkItemStyles.textDrinkTitle}>
              {JSON.stringify(this.props.drinks.name)}
            </div>
            <div style={drinkItemStyles.textDrinkDescription}>
              {JSON.stringify(this.props.drinks.description)}
            </div>
            <div style={drinkItemStyles.textDrinkStock}>
              {JSON.stringify(this.props.drinks.available_stock)}/{JSON.stringify(this.props.drinks.max_stock)}
            </div>
              {JSON.stringify(this.props.drinks.available_stock) > 0 
                ? <div><button onClick = {this.handleClick} disabled={this.state.isButtonDisabled} style={drinkItemStyles.button}>Purchase</button></div>
                : <div style={drinkItemStyles.textDrinkOOS}>OUT OF STOCK</div>
                }
        </div>
      </ReactCardFlip>

    );
  }
}

export default DrinkItem;