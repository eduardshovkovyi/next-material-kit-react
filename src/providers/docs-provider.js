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
  STOP_LOADING: "STOP_LOADING",
  START_LOADING: "START_LOADING",
  SET_DATA: "SET_DATA",
  RESET_DATA: "RESET_DATA",
};

const initialState = {
  isLoading: true,
  data: null,
};

const handlers = {
  [HANDLERS.STOP_LOADING]: (state) => ({
    ...state,
    isLoading: false,
  }),
  [HANDLERS.START_LOADING]: (state) => ({
    ...state,
    isLoading: true,
  }),
  [HANDLERS.SET_DATA]: (state, action) => ({
    ...state,
    data: {
      ...state.data,
      ...action.payload,
    },
  }),
  [HANDLERS.RESET_DATA]: (state) => ({
    ...state,
    data: { ...initialState.data }, // здесь initialState.data - ваше начальное состояние данных
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
    dispatch({
      type: HANDLERS.START_LOADING,
    });
    axios
      .get(
        `https://sheets.googleapis.com/v4/spreadsheets/${SPREAD_SHEET_ID}/values/userData!A1:F?key=${API_KEY}`
      )
      .then((response) => {
        const initialData = response.data;
        const data =
          initialData?.values?.length &&
          initialData?.values?.filter((item) => item.includes(user?.email))[0];
        setDataDocs(data);

        if (data?.length) {
          dispatch({
            type: HANDLERS.SET_DATA,
            payload: {
              iframeLinks: {
                iframeLink1: data[3],
                iframeLink2: data[4],
              },
              email: data[0],
              isAdmin: !!data[5],
            },
          });
        } else {
          dispatch({
            type: HANDLERS.RESET_DATA,
          });
          dispatch({
            type: HANDLERS.STOP_LOADING,
          });
        }
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
    return axios
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
    return axios
      .get(
        `https://sheets.googleapis.com/v4/spreadsheets/${SPREAD_SHEET_ID}/values/${dataDocs[2]}!A:Z?key=${API_KEY}`
      )
      .then((response) => {
        dispatch({
          type: HANDLERS.SET_DATA,
          payload: { boxesData: response?.data?.values },
        });
      })
      .catch((error) => {
        console.error("Error on the third query:", error);
      });
  };

  useEffect(() => {
    if (dataDocs?.length) {
      Promise.all([fetchDataTable(), fetchDataBoxes()])
        .then(() => {
          dispatch({
            type: HANDLERS.STOP_LOADING,
          });
        })
        .catch((error) => {
          console.error("Error on loading data:", error);
        });
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
