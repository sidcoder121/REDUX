import { useDispatch, useSelector } from 'react-redux'
import { fetchPhotos, fetchVideos } from '../api/mediaApi'
import { setQuery, setLoading, setError, setResults } from '../redux/features/searchSlice'
import { useEffect } from 'react'

export const ResultGrid = () => {
    // 1. FIX: Assign useDispatch to a variable
    const dispatch = useDispatch() 
    
    // 2. FIX: Ensure activeTab matches your Redux state name (assuming 'activeTab' based on Tabs.jsx)
    const { query, loading, activeTab, results, error } = useSelector((store) => store.search)
   
    const getdata = async () => {
        if (activeTab === 'Photos') {
            const data = await fetchPhotos(query)
            console.log(data)
            // You'll likely want to dispatch your results here:
            // dispatch(setResults(data))
        }
    }

    return (
        <div>
            <button onClick={getdata}>Get DATA</button>
        </div>
    )
}

export default ResultGrid