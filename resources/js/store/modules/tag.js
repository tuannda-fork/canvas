import Vue from 'vue';
import request from '../../mixins/request';
import router from '../../router';

const initialState = {
    id: '',
    name: '',
    slug: '',
    updatedAt: '',
    errors: [],
};

const state = { ...initialState };

const actions = {
    fetchTag(context, id) {
        request.methods
            .request()
            .get(`/api/tags/${id}`)
            .then(({ data }) => {
                context.commit('SET_TAG', data);
            })
            .catch(() => {
                router.push({ name: 'tags' });
            });
    },

    updateTag(context, payload) {
        request.methods
            .request()
            .post(`/api/tags/${payload.id}`, {
                name: payload.name,
                slug: payload.slug,
            })
            .then(({ data }) => {
                context.commit('UPDATE_TAG', data);
                Vue.toasted.show(context.rootGetters['settings/trans'].saved, {
                    className: 'bg-success',
                });
            })
            .catch((error) => {
                state.errors = error.response.data.errors;
                Vue.toasted.show(error.response.data.errors.slug[0], {
                    className: 'bg-danger',
                });
            });
    },

    deleteTag(context, id) {
        request.methods
            .request()
            .delete(`/api/tags/${id}`)
            .then(() => {
                context.commit('RESET_STATE');
            })
            .catch(() => {
                router.push({ name: 'tags' });
            });
    },

    resetState({ commit }) {
        commit('RESET_STATE');
    },
};

const mutations = {
    SET_TAG(state, tag) {
        state.id = tag.id;
        state.name = tag.name || '';
        state.slug = tag.slug || '';
        state.updatedAt = tag.updated_at || '';
    },

    UPDATE_TAG(state, tag) {
        state.id = tag.id;
        state.name = tag.name;
        state.slug = tag.slug;
        state.updatedAt = tag.updated_at || '';
        state.errors = [];
    },

    RESET_STATE(state) {
        for (let f in state) {
            Vue.set(state, f, initialState[f]);
        }
    },
};

const getters = {
    activeTag(state) {
        return state;
    },
};

export default {
    namespaced: true,
    state,
    actions,
    mutations,
    getters,
};