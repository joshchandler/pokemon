import React, { Component, SyntheticEvent } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import Flexbox from 'flexbox-react';

import Item from './Item';
// import Search from './Search';

import { actions } from '../store';

class ListView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filter: false,
    };

    this.fetchPokemon = this.fetchPokemon.bind(this);
    this.debouncedSearch = this.debouncedSearch.bind(this);

    this.getBag = this.getBag.bind(this);
    this.filterInBag = this.filterInBag.bind(this);
  }

  componentDidMount() {
    this.getBag();
    this.fetchPokemon();
  }

  render() {
    let {
      searchPokemonData = [],
      getBagData,
    } = this.props;
    let pokemon = this.state.filter ? getBagData : searchPokemonData;

    return (
      <Wrapper>
        <Flexbox flexDirection='column' alignItems='center'>
          <Flexbox width='80%' marginTop='15px'>
            <SearchItem
              onChange={this.debouncedSearch(this.fetchPokemon, 250, evt => evt.persist())}
              placeholder="Search for a Pokémon!"
            />
            <FilterButton onClick={this.filterInBag}>Filter Pokémon in bag</FilterButton>
          </Flexbox>
        </Flexbox>
        <Flexbox flexDirection='column' alignItems='center'>
          <Flexbox marginTop='15px' padding='0'>
            <Flexbox flexWrap='wrap'>
              {pokemon.map(entry => {
                return <Item entry={entry} bagData={getBagData} key={entry.name}/>
              })}
            </Flexbox>
          </Flexbox>
        </Flexbox>
      </Wrapper>
    );
  }

  fetchPokemon(evt) {
    let val = evt ? evt.target.value : "";
    let search = val.toLowerCase();

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

  getBag() {
    this.props.getBag();
  }

  filterInBag() {
    this.setState({
      filter: !this.state.filter,
    });
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

const FilterButton = styled.button`
  border: none;
  border-radius: none;

  &:hover {
    cursor: pointer;
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
  }),
  {
    searchPokemon: payload => actions.pokemon.searchPokemon(payload),
    getBag: () => actions.pokemon.getBag(),
  }
)(ListView);
