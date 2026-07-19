import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, FieldLabel, PageHeader, TextInput } from '../components/ui/PageElements';
import { useAuth } from '../context/AuthContext';
import { createCustomer, fetchCustomer, updateCustomer } from '../services/customerService';
import { showSuccess } from '../services/apiClient';

export default function CustomerForm() {
  const { id } = useParams();
  const { session } = useAuth();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [document, setDocument] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(isEdit);

  useEffect(() => {
    if (!isEdit || !session?.token) return undefined;
    let cancelled = false;

    (async () => {
      setLoading(true);
      try {
        const customer = await fetchCustomer(session.token, id);
        if (!cancelled) {
          setName(customer.name || '');
          setPhone(customer.phone || '');
          setDocument(customer.document || '');
        }
      } catch {
        if (!cancelled) navigate('/customers');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [isEdit, session?.token, id, navigate]);

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    if (!name.trim() || !phone.trim()) {
      setError('Nome e telefone são obrigatórios.');
      return;
    }
    try {
      const payload = { name: name.trim(), phone: phone.trim(), document: document.trim() };
      const saved = isEdit
        ? await updateCustomer(session.token, id, { ...payload, active: true })
        : await createCustomer(session.token, payload);
      showSuccess(isEdit ? 'Cliente atualizado.' : 'Cliente cadastrado.');
      navigate(saved?.id ? `/customers/${saved.id}` : '/customers');
    } catch (err) {
      setError(err.message || 'Não foi possível salvar.');
    }
  }

  if (loading) {
    return <p className="p-6 text-sm text-ink-500">Carregando…</p>;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="RF-04"
        title={isEdit ? 'Editar cliente' : 'Novo cliente'}
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
