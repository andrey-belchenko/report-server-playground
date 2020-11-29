import { createSlice, configureStore } from '@reduxjs/toolkit';
import { useSelector } from 'react-redux';

export interface reportItem {
    ProjectUID: string;
    Year: number;
    MonthName: string;
    F03: string;
    F04: string;
    F05: number;
    F06: number;
    F07: number;
    F08: number;
    F09: number;
    F10: number;
    F11: number;
    F12: number;
    F13: number;
    F14: number;
    F15: number;
    F16: number;
    F17: number;
    F18: number;
    
}
export interface listItem {
    ProjectName: string;
    ProjectUID: string;
    
}



interface IState {
  report: reportItem[];
  list: listItem[];
  year: number;
  month: number;
  
}

const counterSlice = createSlice({
  name: 'reportData',
  initialState: {
    report: new Array<reportItem>(),
    list: new Array<listItem>(),
    year: 0,
    month: 0,
    
  },
  reducers: {
    report: (state: IState, action) => {
        state.report = action.payload;
    },
    list: (state: IState, action) => {
        state.list = action.payload;
    },
    year: (state: IState, action) => {
        state.year = action.payload;
    },
    month: (state: IState, action) => {
        state.month = action.payload;
    },
    
  },
});


const reportStore = configureStore({
  reducer: counterSlice.reducer
});
export { reportStore };

const baseUrl = "http://localhost:3004/datasets";

const load = (dsName: string, params: any) => {
  fetch(`${baseUrl}/${dsName}/data`,
    {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(params)
    }
  )
    .then(res => res.json())
    .then(
      (result) => {
        let actions: any = counterSlice.actions;
        reportStore.dispatch(actions[dsName](result));
      }
    );
}

const data = {
  report: {
      useValue: () => useSelector((state: IState) => state.report),
      refresh: (Year: number,Month: number,) => load("report", {Year,Month,})
  },
  list: {
      useValue: () => useSelector((state: IState) => state.list),
      refresh: () => load("list", {})
  },
  year: {
      useValue: () => useSelector((state: IState) => state.year),
      set: (value: number) => reportStore.dispatch(counterSlice.actions.year(value))
  },
  month: {
      useValue: () => useSelector((state: IState) => state.month),
      set: (value: number) => reportStore.dispatch(counterSlice.actions.month(value))
  },
  
}
export { data }




