import React, { Component, SyntheticEvent } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import Flexbox from 'flexbox-react';

import { actions } from '../store';

class ListView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pokemon: [],
      offset: 0,
      limit: 20
    };

    this.fetchPokemon = this.fetchPokemon.bind(this);
    this.debouncedSearch = this.debouncedSearch.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  fetchPokemon(search) {
    search = search.toLowerCase();

    this.props.searchPokemon({
      search,
    });
  }

  debouncedSearch(fn, delay, cb) {
    let timer = null,
      debFn = function () {
        let args = arguments;

        cb(...args);

        clearTimeout(timer);
        timer = setTimeout(function () {
          fn(...args);
        }, delay);
      };

    return debFn;
  }

  onChange(evt) {
    this.fetchPokemon(evt.target.value);
  }

  render() {
    const { searchPokemonData = [] } = this.props;
    return (
      <Flexbox flexDirection='column' alignItems='center' width='100vw'>
        <Flexbox width='250px' marginTop='13px'>
          <input onChange={this.debouncedSearch(this.onChange, 250, evt => evt.persist())} placeholder="Search for a Pokémon!"/>
        </Flexbox>
        <Flexbox marginTop='15px' padding='0px 10vw'>
          <Flexbox flexWrap='wrap'>
            {searchPokemonData.map(entry => (
              <ListItemDisplay>
                <Flexbox key={entry.name} flexDirection='column'>
                  <ListItemTitle>{entry.name}</ListItemTitle>
                  <img src={entry.image} />
                </Flexbox>
              </ListItemDisplay>
            ))}
          </Flexbox>
        </Flexbox>
      </Flexbox>
    )
  }
}

export default connect(
  ({ pokemon }) => ({
    searchPokemonLoading: pokemon.searchPokemonLoading,
    searchPokemonData: pokemon.searchPokemonData,
    searchPokemonError: pokemon.searchPokemonError,
  }),
  {
    searchPokemon: payload => actions.pokemon.searchPokemon(payload),
  }
)(ListView);


const ListItemDisplay = styled.div`
    padding: 10px;
    border: 1px solid #fff;
    border-radius: 10px;
    box-shadow: 0px 0px 5px #ccc;
    transition: all 0.25s linear;
    width: 17vw;
    margin: 5px;

    &:hover{
        box-shadow: 0px 0px 5px #0077c5;
    }
`;

const ListItemTitle = styled.h2`
    font-size: 16px;
    font-weight: normal;
`;
