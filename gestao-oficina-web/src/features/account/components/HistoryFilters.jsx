const STATUS_FILTERS = [
  { id: 'all', label: 'Tudo' },
  { id: 'active', label: 'Em andamento' },
  { id: 'history', label: 'Concluídas' },
];

export default function HistoryFilters({
  filter,
  onFilterChange,
  vehicles,
  vehicleId,
  onVehicleChange,
}) {
  return (
    <>
      <div className="mt-5 flex gap-2 overflow-x-auto pb-1">
        {STATUS_FILTERS.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => onFilterChange(item.id)}
            className={`shrink-0 rounded-full px-3.5 py-1.5 text-sm font-semibold transition ${
              filter === item.id
                ? 'bg-shop-900 text-white'
                : 'bg-sand-100 text-shop-600 hover:bg-sand-200'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {vehicles.length > 1 && (
        <div className="mt-3">
          <label htmlFor="vehicleFilter" className="sr-only">
            Filtrar por veículo
          </label>
          <select
            id="vehicleFilter"
            className="field !py-2.5 text-sm"
            value={vehicleId}
            onChange={(e) => onVehicleChange(e.target.value)}
          >
            <option value="all">Todos os veículos</option>
            {vehicles.map((v) => (
              <option key={v.id} value={v.id}>
                {v.plate} — {v.brand} {v.model}
              </option>
            ))}
          </select>
        </div>
      )}
    </>
  );
}
