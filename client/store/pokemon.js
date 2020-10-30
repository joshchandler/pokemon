import { createActions, handleActions } from 'redux-actions';
import { all, call, fork, put, takeLatest } from 'redux-saga/effects';
import * as api from "../api";
import { processError, keyMirror } from "./utils";

export const ActionTypes = keyMirror("pokemon", {
    SEARCH_POKEMON: null,
    SEARCH_POKEMON_SUCCESS: null,
    SEARCH_POKEMON_ERROR: null,
});

const actionsMap = {};
for (const key in ActionTypes) {
    actionsMap[ActionTypes[key]] = payload => payload;
}

const actions = createActions(actionsMap);

const reducer = handleActions({
    // SEARCH_POKEMON
    [ActionTypes.SEARCH_POKEMON]: state => ({
        ...state,
        searchPokemonLoading: true,
        searchPokemonData: undefined,
        searchPokemonError: undefined,
    }),

    // SEARCH_POKEMON_SUCCESS
    [ActionTypes.SEARCH_POKEMON_SUCCESS]: (state, { payload }) => ({
        ...state,
        searchPokemonLoading: false,
        searchPokemonData: payload,
        searchPokemonError: undefined,
    }),

    // SEARCH_POKEMON_ERROR
    [ActionTypes.SEARCH_POKEMON_ERROR]: (state, { payload }) => ({
        ...state,
        searchPokemonLoading: false,
        searchPokemonData: undefined,
        searchPokemonError: payload,
    }),
}, {
    searchPokemonLoading: false,
    searchPokemonData: undefined,
    searchPokemonError: undefined,
});

const sagas = function* saga() {
    yield all([

		// SEARCH_POKEMON
		fork(function*() {
			yield takeLatest(ActionTypes.SEARCH_POKEMON, function* (action) {
				try {
					const res = yield call(api.get, "pokemon", {
                        search: action.payload.search,
                    });
					yield put(actions.pokemon.searchPokemonSuccess(res));
				} catch (err) {
					yield processError(err, actions.pokemon.searchPokemonError);
				}
			});
		}),
 
    ])
}

export default {
    actions,
    reducer,
    sagas,
};