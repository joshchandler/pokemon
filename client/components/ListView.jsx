import React, { Component, SyntheticEvent } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import Flexbox from 'flexbox-react';

import Item from './Item';

import { actions } from '../store';

let listener;

class ListView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      search: "",
      filter: false,
      offset: 0,
    };

    this.ref = React.createRef();

    this.fetchPokemon = this.fetchPokemon.bind(this);
    this.debouncedSearch = this.debouncedSearch.bind(this);
    this.onChange = this.onChange.bind(this);
    this.getBag = this.getBag.bind(this);
    this.filterInBag = this.filterInBag.bind(this);
  }

  componentDidMount() {
    this.getBag();
    this.fetchPokemon();

    window.addEventListener('scroll', listener = evt => {
      let element = this.ref.current,
        height = element.offsetHeight,
        scrollPosition = window.innerHeight + window.pageYOffset;

      if (height < scrollPosition) {
        this.fetchPokemon();
      }
    });
  }

  componentWillUnmount() {
    listener && window.removeEventListener('scroll', listener);
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
              onChange={this.debouncedSearch(this.onChange, 250, evt => evt.persist())}
              placeholder="Search for a Pokémon!"
            />
            <FilterButton onClick={this.filterInBag}>Filter Pokémon in bag</FilterButton>
          </Flexbox>
        </Flexbox>
        <Flexbox flexDirection='column' alignItems='center'>
          <Flexbox marginTop='15px' padding='0'>
            <div ref={this.ref}>
              <Flexbox flexWrap='wrap'>
                {pokemon.map(entry => {
                  return <Item entry={entry} bagData={getBagData} key={entry.name}/>
                })}
              </Flexbox>
            </div>
          </Flexbox>
        </Flexbox>
      </Wrapper>
    );
  }

  fetchPokemon(evt) {
    let val = evt ? evt.target.value : "";
    let search = evt ? val.toLowerCase() : this.state.search.toLowerCase();
    let offset = this.state.offset;

    if (this.props.searchPokemonData) {
      offset += 20;
    }

    this.props.searchPokemon({
      search,
      offset,
    });

    this.setState({
      search: search,
      offset: offset,
    })
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
    this.setState({
      offset: 0,
    });

    this.fetchPokemon(evt);
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
