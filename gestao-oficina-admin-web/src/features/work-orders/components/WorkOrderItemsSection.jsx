import { Link } from 'react-router-dom';
import { ItemType, ItemTypeLabel, formatMoney } from '../../../constants/labels';
import { Card, EmptyState, FieldLabel, SelectInput, TextInput } from '../../../components/ui/PageElements';

export default function WorkOrderItemsSection({
  order,
  total,
  canManageItems,
  itemsLocked,
  itemForm,
}) {
  const { itemTab, setItemTab, form, catalog, updateField, submit, removeItem } = itemForm;

  return (
    <Card>
      <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
        <div>
          <h2 className="font-display text-lg font-bold text-ink-900">Serviços e peças</h2>
          <p className="text-sm text-ink-500">
            Peças com preço informado na hora do lançamento · Total {formatMoney(total)}
          </p>
        </div>
        {canManageItems && (
          <Link to="/parts" className="text-sm font-semibold text-signal hover:underline">
            Gerenciar peças →
          </Link>
        )}
      </div>

      {order.items.length === 0 ? (
        <EmptyState title="Nenhum item" description="Lance serviços ou peças nesta OS." />
      ) : (
        <div className="mb-6 overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Tipo</th>
                <th>Descrição</th>
                <th className="text-right">Qtd</th>
                <th className="text-right">Unit.</th>
                <th className="text-right">Subtotal</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {order.items.map((item) => (
                <tr key={item.id}>
                  <td>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${
                        item.type === ItemType.PART
                          ? 'bg-amber-100 text-amber-900'
                          : 'bg-sky-100 text-sky-800'
                      }`}
                    >
                      {ItemTypeLabel[item.type]}
                    </span>
                  </td>
                  <td className="font-medium text-ink-900">{item.description}</td>
                  <td className="text-right">{item.quantity}</td>
                  <td className="text-right">{formatMoney(item.unitPrice)}</td>
                  <td className="text-right font-semibold">
                    {formatMoney(item.quantity * item.unitPrice)}
                  </td>
                  <td className="text-right">
                    {canManageItems && !itemsLocked && (
                      <button
                        type="button"
                        className="text-xs font-medium text-red-600 hover:underline"
                        onClick={() => removeItem(item.id)}
                      >
                        Remover
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {canManageItems && !itemsLocked && (
        <div className="rounded-2xl border border-dashed border-ink-200 bg-ink-50/60 p-4">
          <div className="mb-3 flex gap-2">
            <button
              type="button"
              className={
                itemTab === 'part'
                  ? 'btn-primary !px-3 !py-1.5 !text-xs'
                  : 'btn-secondary !px-3 !py-1.5 !text-xs'
              }
              onClick={() => setItemTab('part')}
            >
              Lançar peça
            </button>
            <button
              type="button"
              className={
                itemTab === 'service'
                  ? 'btn-primary !px-3 !py-1.5 !text-xs'
                  : 'btn-secondary !px-3 !py-1.5 !text-xs'
              }
              onClick={() => setItemTab('service')}
            >
              Lançar serviço
            </button>
          </div>

          {itemTab === 'part' && (
            <p className="mb-3 rounded-xl bg-amber-50 px-3 py-2 text-xs text-amber-950">
              O preço da peça é <strong>variável</strong> e deve ser informado nesta OS (custo do
              fornecedor, margem, etc.). A lista só ajuda a não redigitar o nome.
            </p>
          )}

          <form onSubmit={submit} className="grid gap-3 md:grid-cols-6">
            <div className="md:col-span-2">
              <FieldLabel htmlFor="catalog">
                {itemTab === 'part' ? 'Peça do catálogo' : 'Serviço do catálogo'}
              </FieldLabel>
              <SelectInput
                id="catalog"
                value={form.catalogId}
                onChange={(e) => updateField('catalogId', e.target.value)}
              >
                <option value="">
                  {itemTab === 'part' ? 'Avulsa / digitar nome' : 'Avulso / digitar'}
                </option>
                {catalog.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                    {itemTab === 'service' && c.defaultPrice != null && c.defaultPrice !== ''
                      ? ` — ${formatMoney(c.defaultPrice)}`
                      : ''}
                  </option>
                ))}
              </SelectInput>
            </div>
            <div className="md:col-span-4">
              <FieldLabel htmlFor="desc">Descrição</FieldLabel>
              <TextInput
                id="desc"
                value={form.description}
                onChange={(e) => updateField('description', e.target.value)}
                placeholder={
                  itemTab === 'part' ? 'Nome da peça nesta OS' : 'Descrição do serviço'
                }
              />
            </div>
            <div>
              <FieldLabel htmlFor="qty">Qtd</FieldLabel>
              <TextInput
                id="qty"
                value={form.quantity}
                onChange={(e) => updateField('quantity', e.target.value)}
                inputMode="decimal"
              />
            </div>
            <div className="md:col-span-2">
              <FieldLabel htmlFor="price">
                {itemTab === 'part' ? 'Preço cobrado *' : 'Valor unitário *'}
              </FieldLabel>
              <TextInput
                id="price"
                value={form.unitPrice}
                onChange={(e) => updateField('unitPrice', e.target.value)}
                placeholder="0,00"
                inputMode="decimal"
                className={itemTab === 'part' ? '!border-amber-300 focus:!border-signal' : ''}
              />
            </div>
            <div className="flex items-end md:col-span-3">
              <button type="submit" className="btn-primary">
                {itemTab === 'part' ? 'Adicionar peça' : 'Adicionar serviço'}
              </button>
            </div>
            {form.error && (
              <p className="text-sm font-medium text-red-600 md:col-span-6">{form.error}</p>
            )}
          </form>
        </div>
      )}

      {itemsLocked && (
        <p className="mt-2 text-xs text-slate-500">
          Itens bloqueados porque a OS está entregue ou cancelada.
        </p>
      )}
    </Card>
  );
}
