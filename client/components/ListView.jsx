import React, { Component, SyntheticEvent } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import Flexbox from 'flexbox-react';

import Item from './Item';
import Search from './Search';

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
    this.getBag = this.getBag.bind(this);
  }

  componentDidMount() {
    this.getBag();
    this.fetchPokemon();
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
          <Search />
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

  getBag() {
    this.props.getBag();
  }
}


const Wrapper = styled.div`
  display: block;
  width: 100%;
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
