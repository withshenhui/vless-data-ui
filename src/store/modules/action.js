import { fetchList, createAction, updateAction, removeAction } from '@/api/action'

const action = {
  state: {
   list:[],
   count:0
  },

  mutations: {
    GET_ACTION_LIST: (state, list, count) => {
      state.list = list
      state.count = count
    }
  },

  actions: {
    // GET LIST
    GetActionList({ commit }, actionQuery) {
      console.log("get action List")
      return new Promise((resolve, reject) => {
        fetchList(actionQuery).then(response => {
          commit('GET_ACTION_LIST', response.data.data, response.data.count)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    }
  }
}

export default action
