import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useState,
} from "react";
import axios from "axios";

import { SPREAD_SHEET_ID, API_KEY } from "../utils/variables/s-variables";
import { AuthContext } from "../contexts/auth-context";

const HANDLERS = {
  INITIALIZE: "INITIALIZE",
  SET_DATA: "SET_DATA",
};

const initialState = {
  isLoading: true,
  data: null,
};

const handlers = {
  [HANDLERS.INITIALIZE]: (state) => ({
    ...state,
    isLoading: false,
  }),
  [HANDLERS.SET_DATA]: (state, action) => ({
    ...state,
    data: {
      ...state.data,
      ...action.payload,
    },
  }),
};

const reducer = (state, action) =>
  handlers[action.type] ? handlers[action.type](state, action) : state;

export const DataContext = createContext(undefined);

export const DocxProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { user } = useContext(AuthContext);
  const [dataDocs, setDataDocs] = useState([]);

  const fetchData = () => {
    axios
      .get(
        `https://sheets.googleapis.com/v4/spreadsheets/${SPREAD_SHEET_ID}/values/userData!A1:E?key=${API_KEY}`
      )
      .then((response) => {
        const initialData = response.data;
        const data =
          initialData?.values?.length &&
          initialData?.values?.filter((item) => item.includes(user?.email))[0];
        setDataDocs(data);

        dispatch({
          type: HANDLERS.SET_DATA,
          payload: {
            iframeLinks: {
              iframeLink1: data[3],
              iframeLink2: data[4],
            },
            email: data[0],
          },
        });
      })
      .catch((error) => {
        console.error("Error on the first query:", error);
      });
  };

  useEffect(() => {
    if (user?.email) {
      fetchData();
    }
  }, [user?.email]);

  const fetchDataTable = () => {
    axios
      .get(
        `https://sheets.googleapis.com/v4/spreadsheets/${SPREAD_SHEET_ID}/values/${dataDocs[1]}!A:Z?key=${API_KEY}`
      )
      .then((response) => {
        dispatch({
          type: HANDLERS.SET_DATA,
          payload: { tableData: response?.data?.values },
        });
      })
      .catch((error) => {
        console.error("Error on the second query:", error);
      });
  };

  const fetchDataBoxes = () => {
    dispatch({
      type: HANDLERS.START_LOADING,
    });

    axios
      .get(
        `https://sheets.googleapis.com/v4/spreadsheets/${SPREAD_SHEET_ID}/values/${dataDocs[2]}!A:Z?key=${API_KEY}`
      )
      .then((response) => {
        dispatch({
          type: HANDLERS.SET_DATA,
          payload: { boxesData: response?.data?.values },
        });
        setTimeout(() => {
          dispatch({
            type: HANDLERS.STOP_LOADING,
          });
        }, 10000);
      })
      .catch((error) => {
        console.error("Error on the third query:", error);
      });
  };

  useEffect(() => {
    if (dataDocs?.length) {
      fetchDataTable();
      fetchDataBoxes();
    }
  }, [dataDocs]);

  const setData = (data) => {
    dispatch({ type: HANDLERS.SET_DATA, payload: data });
  };

  return (
    <DataContext.Provider value={{ ...state, setData }}>
      {children}
    </DataContext.Provider>
  );
};

export const useDataContext = () => useContext(DataContext);
