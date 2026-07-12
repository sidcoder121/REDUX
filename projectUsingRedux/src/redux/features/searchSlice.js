import {createSlice} from '@reduxjs/toolkit'

const searchSlice = createSlice({
    name:'search',
    initialState:{
        query:'',
        activeTab:'photos',
        results:[],
        loading:false,
        error:null,
    },
    reducers:{
        setQuery(state,action){
            state.query = action.payload

        },
        setActiveTabs(state,action){
            state.activeTab=action.payload
            
        },
        setLoading(state,action){
            state.loading = true;
            state.error = null;
            
        },
        setResults(state,action){
            state.loading = false;
            state.results = action.payload
            
        },
        setError(state,action){
            state.error = action.payload;
            state.loading = false;
            
        }
    }    
})

export const {setActiveTabs,setError,setLoading,setResults,setQuery} = searchSlice.actions
export default searchSlice.reducer