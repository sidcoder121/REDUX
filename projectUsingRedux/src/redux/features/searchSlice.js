import {createSlice} from '@reduxjs/toolkit'

const searchSlice = createSlice({
    name:'search',
    initialstate:{
        query:'',
        activeTab:'photos',
        results:[],
        loading:false,
        error:null,
    },
    reducers:{
        setQuery(state,actions){
            state.query = actions.payload

        },
        setActiveTabs(state,actions){
            state.activeTab=actions.payload
            
        },
        setLoading(state,actions){
            state.loading = true;
            state.error = null;
            
        },
        setResults(state,actions){
            state.loading = false;
            state.results = actions.payload
            
        },
        setError(state,actions){
            state.error = actions.payload;
            state.loading = false;
            
        }
    
    
    }
    
})

export const {setActiveTabs,setError,setLoading,setResults,setQuery} = searchSlice.actions
export default searchSlice