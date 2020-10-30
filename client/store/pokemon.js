import { createActions, handleActions } from 'redux-actions';
import { all, call, fork, put, takeLatest } from 'redux-saga/effects';
import * as api from "../api";
import { processError, keyMirror } from "./utils";

export const ActionTypes = keyMirror("pokemon", {
    SEARCH_POKEMON: null,
    SEARCH_POKEMON_SUCCESS: null,
    SEARCH_POKEMON_ERROR: null,

    GET_BAG: null,
    GET_BAG_SUCCESS: null,
    GET_BAG_ERROR: null,

    ADD_TO_BAG: null,
    ADD_TO_BAG_SUCCESS: null,
    ADD_TO_BAG_ERROR: null,

    REMOVE_FROM_BAG: null,
    REMOVE_FROM_BAG_SUCCESS: null,
    REMOVE_FROM_BAG_ERROR: null,
});

const actionsMap = {};
for (const key in ActionTypes) {
    actionsMap[ActionTypes[key]] = payload => payload;
}

const actions = createActions(actionsMap);

let previousSearchTerm;
const reducer = handleActions({
    // SEARCH_POKEMON
    [ActionTypes.SEARCH_POKEMON]: state => ({
        ...state,
        searchPokemonLoading: true,
        searchPokemonError: undefined,
    }),

    // SEARCH_POKEMON_SUCCESS
    [ActionTypes.SEARCH_POKEMON_SUCCESS]: (state, { payload }) => {
        let previousData;

        if (payload.search === "" && !previousSearchTerm && state.searchPokemonData) {
            previousData = state.searchPokemonData.concat(payload.res);
        }

        previousSearchTerm = payload.search;

        return {
            ...state,
            searchPokemonLoading: false,
            searchPokemonData: previousData || payload.res,
            searchPokemonError: undefined,
        };
    },

    // SEARCH_POKEMON_ERROR
    [ActionTypes.SEARCH_POKEMON_ERROR]: (state, { payload }) => ({
        ...state,
        searchPokemonLoading: false,
        searchPokemonData: undefined,
        searchPokemonError: payload,
    }),

    // GET_BAG
    [ActionTypes.GET_BAG]: state => ({
        ...state,
        getBagLoading: true,
        getBagError: undefined,
    }),

    // GET_BAG_SUCCESS
    [ActionTypes.GET_BAG_SUCCESS]: (state, { payload }) => ({
        ...state,
        getBagLoading: false,
        getBagData: payload,
        getBagError: undefined,
    }),

    // GET_BAG_ERROR
    [ActionTypes.GET_BAG_ERROR]: (state, { payload }) => ({
        ...state,
        getBagLoading: false,
        getBagData: undefined,
        getBagError: payload,
    }),

    // ADD_TO_BAG
    [ActionTypes.ADD_TO_BAG]: state => ({
        ...state,
        addToBagLoading: true,
        addToBagData: undefined,
        addToBagError: undefined,
    }),

    // ADD_TO_BAG_SUCCESS
    [ActionTypes.ADD_TO_BAG_SUCCESS]: (state, { payload }) => ({
        ...state,
        addToBagLoading: false,
        addToBagData: payload,
        addToBagError: undefined,
    }),

    // ADD_TO_BAG_ERROR
    [ActionTypes.GET_BAG_ERROR]: (state, { payload }) => ({
        ...state,
        addToBagLoading: false,
        addToBagData: undefined,
        addToBagError: payload,
    }),

    // REMOVE_FROM_BAG
    [ActionTypes.REMOVE_FROM_BAG]: state => ({
        ...state,
        removeFromBagLoading: true,
        removeFromBagData: undefined,
        removeFromBagError: undefined,
    }),

    // REMOVE_FROM_BAG_SUCCESS
    [ActionTypes.REMOVE_FROM_BAG_SUCCESS]: (state, { payload }) => ({
        ...state,
        removeFromBagLoading: false,
        removeFromBagData: payload,
        removeFromBagError: undefined,
    }),

    // REMOVE_FROM_BAG_ERROR
    [ActionTypes.REMOVE_FROM_BAG_ERROR]: (state, { payload }) => ({
        ...state,
        removeFromBagLoading: false,
        removeFromBagData: undefined,
        removeFromBagError: payload,
    }),
    
}, {
    searchPokemonLoading: false,
    searchPokemonData: undefined,
    searchPokemonError: undefined,

    getBagLoading: false,
    getBagData: undefined,
    getBagError: undefined,

    addToBagLoading: false,
    addToBagData: undefined,
    addToBagError: undefined,

    removeFromBagLoading: false,
    removeFromBagData: undefined,
    removeFromBagError: undefined,
});

const sagas = function* saga() {
    yield all([
		// SEARCH_POKEMON
		fork(function* () {
			yield takeLatest(ActionTypes.SEARCH_POKEMON, function* (action) {
                const {
                    search,
                    offset,
                } = action.payload;

                debugger;
				try {
					const res = yield call(api.get, "pokemon", {
                        search,
                        limit: search === "" ? 20 : undefined,
                        offset: search === "" ? (previousSearchTerm ? 0 : offset) : undefined,
                    });
					yield put(actions.pokemon.searchPokemonSuccess({
                        res,
                        search: action.payload.search,
                    }));
				} catch (err) {
					yield processError(err, actions.pokemon.searchPokemonError);
				}
			});
        }),

        // GET_BAG
        fork(function* () {
            yield takeLatest(ActionTypes.GET_BAG, function* (action) {
                try {
                    const res = yield call(api.client_get, "bag");
                    yield put(actions.pokemon.getBagSuccess(res));
                } catch (err) {
                    yield processError(err, actions.pokemon.getBagError);
                }
            });
        }),
 
        // ADD_TO_BAG
        fork(function* () {
            yield takeLatest(ActionTypes.ADD_TO_BAG, function* (action) {
                try {
                    const res = yield call(api.client_post, "bag", action.payload);
                    yield put(actions.pokemon.addToBagSuccess(res));
                    yield put(actions.pokemon.getBag());
                } catch (err) {
                    yield processError(err, actions.pokemon.addToBagError);
                }
            });
        }),

        // REMOVE_FROM_BAG
        fork(function* () {
            yield takeLatest(ActionTypes.REMOVE_FROM_BAG, function* (action) {
                try {
                    const res = yield call(api.client_del, "bag", action.payload);
                    yield put(actions.pokemon.removeFromBagSuccess(res));
                    yield put(actions.pokemon.getBag());
                } catch (err) {
                    yield processError(err, actions.pokemon.removeFromBagError);
                }
            });
        }),
    ]);
}

export default {
    actions,
    reducer,
    sagas,
};