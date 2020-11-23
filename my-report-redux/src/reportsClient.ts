import { createSlice, Dispatch, configureStore } from '@reduxjs/toolkit';
import { useSelector } from 'react-redux';

interface state {
  dataSets: {
    list: listItem[];
    report: reportItem[];
  }
}

const counterSlice = createSlice({
  name: 'counter',
  initialState: {
    dataSets: {
      list: new Array<listItem>(),
      report: new Array<reportItem>()
    },
  },
  reducers: {
    listSet: (state: state, action) => {
      state.dataSets.list = action.payload;
    },
    reportSet: (state: state, action) => {
      state.dataSets.report = action.payload;
    },
  },
});

function buildFetchInit(params: any) {
  return {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(params)
  }
}

const listFetch = () => (dispatch: Dispatch) => {

  fetch("http://localhost:3004/datasets/list/data", buildFetchInit({}))
    .then(res => res.json())
    .then(
      (result) => {
        dispatch(counterSlice.actions.listSet(result));
      }
    );
};
// { "Year": 2020, "Month": 6 }
const reportFetch = (params: any) => (dispatch: Dispatch) => {
  fetch("http://localhost:3004/datasets/report/data", buildFetchInit(params))
    .then(res => res.json())
    .then(
      (result) => {
        dispatch(counterSlice.actions.reportSet(result));
      }
    );
};

const listSelect = (state: state) => state.dataSets.list;
const reportSelect = (state: state) => state.dataSets.report;


const sss = configureStore({
  reducer: counterSlice.reducer
});
export { sss };

var dispatch: any = sss.dispatch;


const data = {
  list: {
    useData: function () {
      return useSelector(listSelect)
    },
    refresh: function () {
      dispatch(listFetch());
    }
  },
  report: {
    useData: function () {
      return useSelector(reportSelect)
    },
    refresh: function (Year: number, Month: number) {
      dispatch(reportFetch({Year,Month}));
    }
  }
}
export { data }


export interface reportItem {
  ProjectUID: string;
  MonthName: string;
}

export interface listItem {
  ProjectUID: string;
  ProjectName: string;
}


