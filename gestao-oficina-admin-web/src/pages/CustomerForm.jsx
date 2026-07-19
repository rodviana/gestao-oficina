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
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(isEdit);
  const [createdAccount, setCreatedAccount] = useState(null);

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
    if (!name.trim() || !phone.trim() || (!isEdit && !email.trim())) {
      setError(
        isEdit
          ? 'Nome e telefone são obrigatórios.'
          : 'Nome, telefone e e-mail são obrigatórios.',
      );
      return;
    }
    try {
      const payload = { name: name.trim(), phone: phone.trim(), document: document.trim() };
      if (isEdit) {
        const saved = await updateCustomer(session.token, id, { ...payload, active: true });
        showSuccess('Cliente atualizado.');
        navigate(saved?.id ? `/customers/${saved.id}` : '/customers');
        return;
      }
      const created = await createCustomer(session.token, {
        ...payload,
        email: email.trim(),
      });
      showSuccess('Cliente cadastrado com conta do portal.');
      setCreatedAccount(created);
    } catch (err) {
      setError(err.message || 'Não foi possível salvar.');
    }
  }

  async function copyCredentials() {
    const text = `Portal da oficina\nLogin: ${createdAccount.portalEmail}\nSenha: ${createdAccount.temporaryPassword}`;
    try {
      await navigator.clipboard.writeText(text);
      showSuccess('Credenciais copiadas.');
    } catch {
      setError('Não foi possível copiar. Anote as credenciais manualmente.');
    }
  }

  if (loading) {
    return <p className="p-6 text-sm text-ink-500">Carregando…</p>;
  }

  if (createdAccount) {
    return (
      <div className="space-y-6">
        <PageHeader
          eyebrow="RF-04"
          title="Cliente cadastrado"
          description="Conta do portal criada. A senha abaixo é exibida só uma vez — copie e envie ao cliente."
        />
        <Card>
          <div className="mx-auto max-w-lg space-y-4">
            <div className="rounded-xl bg-ink-50 px-4 py-3">
              <p className="text-xs font-bold uppercase tracking-wide text-ink-400">Login do portal</p>
              <p className="mt-1 font-mono text-sm text-ink-900">{createdAccount.portalEmail}</p>
            </div>
            <div className="rounded-xl bg-ink-50 px-4 py-3">
              <p className="text-xs font-bold uppercase tracking-wide text-ink-400">Senha temporária</p>
              <p className="mt-1 font-mono text-lg font-bold text-ink-900">
                {createdAccount.temporaryPassword}
              </p>
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <div className="flex flex-wrap gap-2">
              <button type="button" className="btn-primary" onClick={copyCredentials}>
                Copiar credenciais
              </button>
              <button
                type="button"
                className="btn-secondary"
                onClick={() => navigate(`/customers/${createdAccount.customer.id}`)}
              >
                Ir para o cliente
              </button>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="RF-04"
        title={isEdit ? 'Editar cliente' : 'Novo cliente'}
        description={
          isEdit
            ? 'Dados mínimos para o atendimento.'
            : 'Ao cadastrar, uma conta do portal é criada automaticamente para o cliente.'
        }
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
          {!isEdit && (
            <div>
              <FieldLabel htmlFor="email">E-mail (login do portal)</FieldLabel>
              <TextInput
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          )}
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
