import React from 'react'

export default function FilterByName({setsearchKey}) {
  return (
      <div className="flex items-center min-w-[220px] gap-2">
    <input type="text" placeholder="Search" id="search"  className="input input-success input-sm w-full"/>
     <button className="btn btn-success btn-sm" onClick={()=>{setsearchKey(document.getElementById("search").value)}} >Seach</button>
     </div>
  )
}
