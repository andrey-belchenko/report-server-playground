
import React, { useEffect } from 'react';


import './App.css';
// import { useModel, controller } from './reportsClient'

import {
  model,
  listLoad1,
  reportLoad1
} from './reportsClient';


// import {
//   incrementByAmount,
//   incrementAsync,
//   selectCount,
// } from './counterSlice'

function App() {


  // const [error, setError] = useState(null as any);
  // const [isLoaded, setIsLoaded] = useState(false);
  //  const [items, setItems] = useState(reportsClient.list.empty);
  // var z = useStateX(reportsClient.list.empty);

  //var list={items:z[0],setItems:z[1]}
  // var items = z[0];
  // var setItems = z[1];

  const list1 = model.useList();
  const report1 = model.useReport();
  // const dispatch = useDispatch();

  // const count = useSelector(selectCount);
  // const dispatch = useDispatch();

  // var model = useModel();


  // const [i, setI] = useState(0);

  // const [i1, setI1] = useState(0);
  // const [j, setJ] = useState(0);
  useEffect(() => {
    // dispatch(reportLoad());
    reportLoad1()
    // setI1(i1 + 1);
  }, []);

  // useEffect(() => {
  //   controller.report.refresh();
  //   setI1(i1 + 1);
  // }, [j]);

  // useEffect(() => {
  //   controller.list.refresh();
  //   setI(i + 1);
  // }, [model.report]);

  var x = (
    <div>
      <input type="button" value="GO"
          onClick={() =>
            // dispatch(listLoad())//dispatch(listLoad())
            listLoad1()
          }></input>
      <ul>
        {<div>1111</div>}
        {report1.map(item => (
          <li key={item.ProjectUID}>
            {item.ProjectUID} {item.MonthName}
          </li>
        ))}
        {<div>222</div>}
        {list1.map(item => (
          <li key={item.ProjectUID}>
            {item.ProjectUID} {item.ProjectName}
          </li>
        ))}
      </ul>
    </div>

  );
  return x;
}

export default App;
