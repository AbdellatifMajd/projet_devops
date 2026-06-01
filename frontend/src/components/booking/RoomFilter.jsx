import { filterOptions } from "../../config";


function RoomFilter({ filters, handleFilters }) {
  return (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b border-stone-100">
        <h2 className="text-xl font-bold text-stone-800">Filtres</h2>
      </div>

      <div className="p-6 space-y-8">
        {Object.keys(filterOptions).map((keyItem) => (
          <div key={keyItem}>
            <h3 className="text-sm font-bold text-stone-800 uppercase tracking-wider mb-4">
              {keyItem}
            </h3>
            <div className="space-y-3">
              {filterOptions[keyItem].map((option) => (
                <label key={option.id} className="flex items-center gap-3 cursor-pointer group">
                  <input 
                    type="checkbox" 
                    className="w-5 h-5 rounded border-stone-300 text-stone-800 focus:ring-stone-500 cursor-pointer"
                    onChange={() => handleFilters(keyItem, option.id)}
                    checked={filters && filters[keyItem]?.indexOf(option.id) > -1}
                  /> 
                  <span className="text-stone-600 group-hover:text-stone-900 transition-colors">
                    {option.label}
                  </span>
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
export default RoomFilter;