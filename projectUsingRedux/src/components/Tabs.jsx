import { useDispatch, useSelector } from "react-redux"
import { setActiveTabs } from "../redux/features/searchSlice"


export const Tabs = () => {

    const tabs = ['Photos','Videos']
    const dispatch = useDispatch()
    const activeTab = useSelector((state)=>state.search.activeTab)
  return (
    <div className="flex gap-10 p-10">
        {tabs.map(function(elem,idx){
        return (
        <button className={`${(activeTab == elem?'bg-blue-700':'bg-gray-700')} bg-emerald-600 cursor-pointer px-5 py-2 rounded uppercase`}
         key={idx}
         onClick={()=>{
            dispatch(setActiveTabs(elem))
         }}
         >{elem}</button>
        )
    })}</div>
  )
}
