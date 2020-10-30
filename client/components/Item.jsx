import React, { Component, SyntheticEvent } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import Flexbox from 'flexbox-react';

import { actions } from '../store';

class Item extends Component {
  constructor(props) {
    super(props);
    this.state = {};

    this.addToBag = this.addToBag.bind(this);
    this.removeFromBag = this.removeFromBag.bind(this);
  }

  render() {
    const {
      entry = {},
      getBagData = [],
    } = this.props;
    let inBag = this.state.inBag || getBagData.findIndex(item => item.name === entry.name) > -1;

    return (
      <ListItemDisplay key={entry.name}>
        <Flexbox key={entry.name} flexDirection='column'>
          <ListItemTitle>{entry.name}</ListItemTitle>
          <ListItemImage src={entry.image} loading="lazy" />
          {inBag && (
            <RemoveButton onClick={this.removeFromBag.bind(this, entry)}>Remove from Bag</RemoveButton>
          )}
          {!inBag && (
            <AddButton onClick={this.addToBag.bind(this, entry)}>Add to Bag</AddButton>
          )}
        </Flexbox>
      </ListItemDisplay>
    )
  }

  addToBag(entry, evt) {
    evt.preventDefault();
    this.props.addToBag(entry);
    this.setState({
      inBag: true,
    });
  }

  removeFromBag(entry) {
    this.props.removeFromBag(entry.name);
    this.setState({
      inBag: false,
    });
  }
}


const ListItemDisplay = styled.div`
  padding: 10px;
  border: 1px solid #fff;
  border-radius: 10px;
  box-shadow: 0px 0px 5px #ccc;
  transition: all 0.25s linear;
  width: 17vw;
  margin: 5px;

  &:hover {
    box-shadow: 0px 0px 5px #0077c5;
  }
`;

const ListItemTitle = styled.h2`
  font-size: 20px;
  font-weight: normal;
  text-align: center;
`;

const ListItemImage = styled.img`
  display: block;
  margin: 10px auto;
  width: 150px;
  height: 150px;
`;

const AddButton = styled.button`
  padding: 5px 0;
  color: white;
  background: #005CB9;
  border: none;

  &:hover {
    cursor: pointer;
  }
`;

const RemoveButton = styled.button`
  color: white;
  background: #E3280C;
  padding: 5px 0;
  border: none;

  &:hover {
    cursor: pointer;
  }
`;

export default connect(
  ({ pokemon }) => ({
    getBagLoading: pokemon.getBagLoading,
    getBagData: pokemon.getBagData,
    getBagError: pokemon.getBagError,

    addToBagLoading: pokemon.addToBagLoading,
    addToBagData: pokemon.addToBagData,
    addToBagError: pokemon.addToBagError,

  }),
  {
    searchPokemon: payload => actions.pokemon.searchPokemon(payload),
    getBag: () => actions.pokemon.getBag(),
    addToBag: payload => actions.pokemon.addToBag(payload),
    removeFromBag: payload => actions.pokemon.removeFromBag(payload),
  }
)(Item);
