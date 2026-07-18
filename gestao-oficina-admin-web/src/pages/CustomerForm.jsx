import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useMockStore } from '../mock/MockStore';
import { Card, FieldLabel, PageHeader, TextInput } from '../components/ui/PageElements';
import { PrototypeBanner } from '../components/PrototypeChrome';
import { showSuccess } from '../services/apiClient';

export default function CustomerForm() {
  const { id } = useParams();
  const store = useMockStore();
  const navigate = useNavigate();
  const existing = id ? store.getCustomer(id) : null;

  const [name, setName] = useState(existing?.name || '');
  const [phone, setPhone] = useState(existing?.phone || '');
  const [document, setDocument] = useState(existing?.document || '');
  const [error, setError] = useState('');

  function handleSubmit(event) {
    event.preventDefault();
    setError('');
    if (!name.trim() || !phone.trim()) {
      setError('Nome e telefone são obrigatórios.');
      return;
    }
    const saved = store.saveCustomer({ id: existing?.id, name, phone, document });
    showSuccess(existing ? 'Cliente atualizado.' : 'Cliente cadastrado.');
    navigate(saved?.id ? `/customers/${saved.id}` : '/customers');
  }

  return (
    <div className="space-y-6">
      <PrototypeBanner />
      <PageHeader
        eyebrow="RF-04"
        title={existing ? 'Editar cliente' : 'Novo cliente'}
        description="Dados mínimos para o atendimento."
        backTo="/customers"
      />

      <Card>
        <form className="mx-auto max-w-lg space-y-4" onSubmit={handleSubmit}>
          <div>
            <FieldLabel htmlFor="name">Nome</FieldLabel>
            <TextInput id="name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <FieldLabel htmlFor="phone">Telefone</FieldLabel>
            <TextInput id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>
          <div>
            <FieldLabel htmlFor="document">Documento (opcional)</FieldLabel>
            <TextInput id="document" value={document} onChange={(e) => setDocument(e.target.value)} />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button type="submit" className="btn-primary">
            Salvar
          </button>
        </form>
      </Card>
    </div>
  );
}
