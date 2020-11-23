import { createSlice, configureStore } from '@reduxjs/toolkit';
import { useSelector } from 'react-redux';

interface state {
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
    list: (state: state, action) => {
      state.list = action.payload;
    },
    report: (state: state, action) => {
      state.report = action.payload;
    },
    year: (state: state, action) => {
      state.year = action.payload;
    },
    month: (state: state, action) => {
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
    useValue: () => useSelector((state: state) => state.list),
    refresh: () => load("list", {})
  },
  report: {
    useValue: () => useSelector((state: state) => state.report),
    refresh: (Year: number, Month: number) => load("report", { Year, Month })
  },
  year: {
    useValue: () => useSelector((state: state) => state.year),
    set: (value: number) => sss.dispatch(counterSlice.actions.year(value))
  },
  month: {
    useValue: () => useSelector((state: state) => state.month),
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


