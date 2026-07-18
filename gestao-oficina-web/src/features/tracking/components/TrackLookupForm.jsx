export default function TrackLookupForm({ lookup }) {
  const {
    tab,
    number,
    plate,
    phone,
    error,
    setNumber,
    setPlate,
    setPhone,
    switchTab,
    submitByOs,
    submitByPhone,
  } = lookup;

  return (
    <>
      <div className="mb-4 flex rounded-2xl bg-sand-100 p-1">
        <button
          type="button"
          className={`flex-1 rounded-xl py-2.5 text-sm font-semibold transition ${
            tab === 'os' ? 'bg-white text-shop-900 shadow-sm' : 'text-shop-500'
          }`}
          onClick={() => switchTab('os')}
        >
          Por OS + placa
        </button>
        <button
          type="button"
          className={`flex-1 rounded-xl py-2.5 text-sm font-semibold transition ${
            tab === 'phone' ? 'bg-white text-shop-900 shadow-sm' : 'text-shop-500'
          }`}
          onClick={() => switchTab('phone')}
        >
          Por telefone
        </button>
      </div>

      <div className="rounded-3xl border border-sand-200 bg-white/90 p-5 shadow-soft backdrop-blur sm:p-6">
        {tab === 'os' ? (
          <form className="space-y-4" onSubmit={submitByOs}>
            <div>
              <label htmlFor="number" className="mb-1.5 block text-sm font-semibold text-shop-700">
                Número da OS
              </label>
              <input
                id="number"
                className="field"
                value={number}
                onChange={(e) => setNumber(e.target.value.toUpperCase())}
                placeholder="Ex.: OS-2026-001"
                autoComplete="off"
              />
            </div>
            <div>
              <label htmlFor="plate" className="mb-1.5 block text-sm font-semibold text-shop-700">
                Placa do veículo
              </label>
              <input
                id="plate"
                className="field"
                value={plate}
                onChange={(e) => setPlate(e.target.value.toUpperCase())}
                placeholder="Ex.: ABC1D23"
                autoComplete="off"
              />
            </div>
            {error && <p className="text-sm font-medium text-red-700">{error}</p>}
            <button type="submit" className="btn-primary w-full">
              Ver andamento
            </button>
          </form>
        ) : (
          <form className="space-y-4" onSubmit={submitByPhone}>
            <div>
              <label htmlFor="phone" className="mb-1.5 block text-sm font-semibold text-shop-700">
                Telefone cadastrado
              </label>
              <input
                id="phone"
                className="field"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Ex.: 11999887766"
                inputMode="tel"
              />
            </div>
            {error && <p className="text-sm font-medium text-red-700">{error}</p>}
            <button type="submit" className="btn-primary w-full">
              Buscar minhas OS
            </button>
          </form>
        )}
      </div>
    </>
  );
}
