import React, { Component, SyntheticEvent } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import Flexbox from 'flexbox-react';

import Item from './Item';
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

  render() {

    return (
      <Flexbox width='80%' marginTop='15px'>
        <SearchItem onChange={this.debouncedSearch(this.onChange, 250, evt => evt.persist())} placeholder="Search for a Pokémon!" />
      </Flexbox>
    );
  }

  fetchPokemon(search = "") {
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
}

const SearchItem = styled.input`
  background: #ddd;
  width: 100%;
  padding: 10px;
  border-radius: 0;
  border: none;
  transition: all 0.25s linear;

  margin-left: 20px;
  margin-right: 20px;

  &:hover,
  &:focus {
    border: none;
  }
`;


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
