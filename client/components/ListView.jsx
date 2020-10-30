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
    this.getBag = this.getBag.bind(this);
    this.addToBag = this.addToBag.bind(this);
    this.removeFromBag = this.removeFromBag.bind(this);
  }

  componentDidMount() {
    this.getBag();
    this.fetchPokemon();
  }

  componentDidUpdate() {
    const props = this.props;

  }

  render() {
    const {
      searchPokemonData = [],
      getBagData,
      getBagLoading,
      searchPokemonLoading,
    } = this.props;

    if (getBagLoading || searchPokemonLoading) return <div />;

    return (
      <Wrapper>
        <Flexbox flexDirection='column' alignItems='center'>
          <Flexbox width='80%' marginTop='15px'>
            <SearchItem onChange={this.debouncedSearch(this.onChange, 250, evt => evt.persist())} placeholder="Search for a Pokémon!" />
          </Flexbox>
        </Flexbox>
        <Flexbox flexDirection='column' alignItems='center'>
          <Flexbox marginTop='15px' padding='0'>
            <Flexbox flexWrap='wrap'>
              {searchPokemonData.map(entry => {
                return <Item entry={entry} bagData={getBagData} key={entry.name}/>
              })}
            </Flexbox>
          </Flexbox>
        </Flexbox>
      </Wrapper>
    )
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

  addToBag(entry) {
    this.props.addToBag(entry.name);
  }

  getBag() {
    this.props.getBag();
  }

  removeFromBag() {
    this.props.removeFromBag();
  }
}


const Wrapper = styled.div`
  display: block;
  width: 100%;
`;

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
  }
)(ListView);
