import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user:{},
  clientList: [],
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: 'clients',
  initialState,
  reducers: {
    setLogout:(state,action)=>{
      state.user ={} ;
      state.clientList=[]
    },
    setUsers: (state, action) => {
      state.user = action.payload;
    },
    setClientsList: (state, action) => {
      state.clientList = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    setCredits:(state,action)=>{
      state.user.credits=action.payload
    }
  },
});

export const { setUsers,setCredits,setLogout, setClientsList, setLoading, setError } = userSlice.actions;

export default userSlice.reducer;
