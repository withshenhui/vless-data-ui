import { fetchActionTypeList, createActionType, updateActionType, removeActionType } from '@/api/actionType'

const actionType = {
  state: {
   list:[],
   count:0,
   actionTypeKeyValue:[]
  },

  mutations: {
    GET_LIST: (state, list, count) => {
      state.list = list
      state.count = count
      state.actionTypeKeyValue=list.reduce((acc, cur) => {
          acc[cur.actionName] = cur.id
          return acc
          }, {})    
    },
    CREATE_ACTION_TYPE: (state, actionType) => {
      state.list.unshift(actionType)
      state.actionTypeKeyValue[actionType.actionName]=actionType.id
      // for(var prop in state.actionTypeKeyValue){
      //   if(state.actionTypeKeyValue.hasOwnProperty(prop)){
      //     console.log('key is ' + prop +' and value is' + state.actionTypeKeyValue[prop]);
      //   }
      // } 
    },
    UPDATE_ACTION_TYPE: (state, actionType) => {
      for (const v of state.list) {
        if (v.id === actionType.id) {
          const index = state.list.indexOf(v)
          state.list.splice(index, 1, actionType)
          break
        }
      }

      for(var prop in state.actionTypeKeyValue){
        if(state.actionTypeKeyValue.hasOwnProperty(prop)&&state.actionTypeKeyValue[prop]==actionType.id){
          delete state.actionTypeKeyValue[prop]
          state.actionTypeKeyValue[actionType.actionName]=actionType.id
        }
      } 

    },
    REMOVE_ACTION_TYPE: (state, id) => {
      state.list.splice(state.list.findIndex(item => item.id === id), 1)
      for(var prop in state.actionTypeKeyValue){
        if(state.actionTypeKeyValue.hasOwnProperty(prop)&&state.actionTypeKeyValue[prop]==id){
          delete state.actionTypeKeyValue[prop]
        }
      } 
    }
  },

  actions: {
    // GET LIST
    GetActionTypeList({ commit }, actionTypeQuery) {
      return new Promise((resolve, reject) => {
        fetchActionTypeList(actionTypeQuery).then(response => {
          commit('GET_LIST', response.data.data, response.data.count)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    // CREATE ACTIONTYPE
    CreateActionType({ commit }, actionType) {
      return new Promise((resolve, reject) => {
        createActionType(actionType).then(response => {
          commit('CREATE_ACTION_TYPE', response.data)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },    
      // UPDATE ACTIONTYPE
    UpdateActionType({ commit }, actionType) {
      return new Promise((resolve, reject) => {
        updateActionType(actionType).then(response => {
          commit('UPDATE_ACTION_TYPE', response.data)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },   
    // REMOVE ACTIONTYPE
    RemoveActionType({ commit }, id) {
      return new Promise((resolve, reject) => {
        removeActionType(id).then(response => {
          commit('REMOVE_ACTION_TYPE', id)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    }

  }
}

export default actionType
