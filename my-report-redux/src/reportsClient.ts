import { createSlice, configureStore } from '@reduxjs/toolkit';
import { useSelector } from 'react-redux';

interface IState {
  list: listItem[];
  report: reportItem[];
  year: number;
  month: number;
}

const counterSlice = createSlice({
  name: 'counter',
  initialState: {

    list: new Array<listItem>(),
    report: new Array<reportItem>(),
    year: 0,
    month: 0

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



const sss = configureStore({
  reducer: counterSlice.reducer
});
export { sss };

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
        //callback(result);
        let actions: any = counterSlice.actions;
        sss.dispatch(actions[dsName](result));
      }
    );
}

const data = {
  list: {
    useValue: () => useSelector((state: IState) => state.list),
    refresh: () => load("list", {})
  },
  report: {
    useValue: () => useSelector((state: IState) => state.report),
    refresh: (Year: number, Month: number) => load("report", { Year, Month })
  },
  year: {
    useValue: () => useSelector((state: IState) => state.year),
    set: (value: number) => sss.dispatch(counterSlice.actions.year(value))
  },
  month: {
    useValue: () => useSelector((state: IState) => state.month),
    set: (value: number) => sss.dispatch(counterSlice.actions.month(value))
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


