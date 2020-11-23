import { createSlice,configureStore } from '@reduxjs/toolkit';

export const counterSlice = createSlice({
  name: 'counter',
  initialState: {
    dataSets:{
      v:0
    },
  },
  reducers: {
    incrementByAmount: (state, action) => {
      state.dataSets.v += action.payload;
      
    },
  },
});

export const {incrementByAmount } = counterSlice.actions;

// The function below is called a thunk and allows us to perform async logic. It
// can be dispatched like a regular action: `dispatch(incrementAsync(10))`. This
// will call the thunk with the `dispatch` function as the first argument. Async
// code can then be executed and other actions can be dispatched
export const incrementAsync = amount => dispatch => {
  setTimeout(() => {
    dispatch(incrementByAmount(amount));
  }, 1000);
};

// The function below is called a selector and allows us to select a dataSets from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state) => state.counter.dataSets)`
export const selectCount = state => state.counter.dataSets.v;

// export default counterSlice.reducer;

const sss=configureStore({
  reducer: {
    counter:  counterSlice.reducer,
  },
});
export {sss}
