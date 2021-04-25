// limited scope reducer that manages a single state
function reducer1 (stateKey = {}, action) {
    switch (action.type) {
      case "actionTypeName": return {
          stateKey: logicPlaceholder
      }
      default: return stateKey
    }
  }
  
export default reducer1
