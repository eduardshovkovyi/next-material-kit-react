import { createContext, useContext, useReducer, useEffect } from "react";
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

  useEffect(() => {
    const fetchData = async () => {
      let initialData;
      try {
        const response = await axios.get(
          `https://sheets.googleapis.com/v4/spreadsheets/${SPREAD_SHEET_ID}/values/userData!A1:E?key=${API_KEY}`
        );
        initialData = response.data;
      } catch (error) {
        console.error("Error on the first query:", error);
        dispatch({ type: HANDLERS.INITIALIZE });
        return;
      }
      let data = initialData?.values?.filter((item) =>
        item.includes(user?.email)
      )[0];

      if (!user?.email) {
        return null;
      } else {
        try {
          const response = await axios.get(
            `https://sheets.googleapis.com/v4/spreadsheets/${SPREAD_SHEET_ID}/values/${data[1]}!A:Z?key=${API_KEY}`
          );
          dispatch({
            type: HANDLERS.SET_DATA,
            payload: { tableData: response?.data?.values },
          });
        } catch (error) {
          console.error("Error on the second query:", error);
        }

        try {
          const response = await axios.get(
            `https://sheets.googleapis.com/v4/spreadsheets/${SPREAD_SHEET_ID}/values/${data[2]}!A:Z?key=${API_KEY}`
          );
          dispatch({
            type: HANDLERS.SET_DATA,
            payload: { boxesData: response?.data?.values },
          });
        } catch (error) {
          console.error("Error on the third query:", error);
        }
      }

      dispatch({ type: HANDLERS.INITIALIZE });
    };

    fetchData();
  }, [user]);

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
