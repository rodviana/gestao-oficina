import { useEffect, useState } from 'react';
import { ItemType } from '../../../mock/labels';
import { showSuccess } from '../../../services/apiClient';

const emptyForm = () => ({
  catalogId: '',
  description: '',
  quantity: '1',
  unitPrice: '',
  error: '',
});

export function useWorkOrderItemForm({ orderId, store, services, parts }) {
  const [itemTab, setItemTab] = useState('part');
  const [form, setForm] = useState(emptyForm);

  const itemType = itemTab === 'part' ? ItemType.PART : ItemType.SERVICE;
  const catalog = itemTab === 'part' ? parts : services;

  useEffect(() => {
    setForm(emptyForm());
  }, [itemTab]);

  useEffect(() => {
    if (!form.catalogId) return;
    const item = catalog.find((c) => c.id === form.catalogId);
    if (!item) return;

    setForm((prev) => ({
      ...prev,
      description: item.name,
      unitPrice:
        itemTab === 'service' && item.defaultPrice != null && item.defaultPrice !== ''
          ? String(item.defaultPrice)
          : prev.unitPrice,
    }));
  }, [form.catalogId, catalog, itemTab]);

  function updateField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value, error: '' }));
  }

  function validate() {
    if (!form.description.trim()) return 'Informe a descrição do item.';
    if (Number(form.quantity) <= 0) return 'Quantidade inválida.';
    if (
      form.unitPrice === '' ||
      Number(form.unitPrice) < 0 ||
      Number.isNaN(Number(form.unitPrice))
    ) {
      return itemTab === 'part'
        ? 'Informe o preço cobrado desta peça nesta OS.'
        : 'Informe o valor unitário.';
    }
    return '';
  }

  function submit(event) {
    event.preventDefault();
    const message = validate();
    if (message) {
      setForm((prev) => ({ ...prev, error: message }));
      return;
    }

    try {
      store.addWorkOrderItem(orderId, {
        type: itemType,
        description: form.description,
        quantity: form.quantity,
        unitPrice: form.unitPrice,
      });
      showSuccess(itemTab === 'part' ? 'Peça lançada na OS.' : 'Serviço lançado.');
      setForm(emptyForm());
    } catch (err) {
      setForm((prev) => ({ ...prev, error: err.message }));
    }
  }

  function removeItem(itemId) {
    try {
      store.removeWorkOrderItem(orderId, itemId);
      showSuccess('Item removido.');
    } catch (err) {
      setForm((prev) => ({ ...prev, error: err.message }));
    }
  }

  return {
    itemTab,
    setItemTab,
    form,
    catalog,
    updateField,
    submit,
    removeItem,
  };
}
