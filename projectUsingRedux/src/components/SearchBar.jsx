import { useState } from "react";
import {useDispatch} from 'react-redux'
import {setQuery} from '../redux/features/searchSlice'

export const SearchBar = () => {
    const [text, setText] = useState('')
    const dispatch = useDispatch()

    const submitHandler =(e)=>{
        e.preventDefault()
        dispatch(setQuery(text))
        setText('')
    }


  return (
    <div >
        <form className="bg-gray-900  flex gap-5 p-10"
        onSubmit={(e)=>{
            submitHandler(e)
            }}>
            <input 
            required
            value={text}
            onChange={(e)=>{
                setText(e.target.value)
            }}
            className="w-full border-2 px-4 py-2 text-xl rounded outline-none"
            type='text' placeholder="Search..."></input>

            <button
            className="cursor-pointer active:scale-95 border-2 px-4 py-2 text-xl rounded outline-none"
            >Search</button>
        </form>
    </div>
  )
}

export default SearchBar;
