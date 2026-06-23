import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserRole, UserRoleOptions } from '../constants/userRole';
import { createUser } from '../services/authService';
import { showSuccess } from '../services/apiClient';
import {
  Card,
  FieldLabel,
  PageHeader,
  SelectInput,
  TextInput,
} from '../components/ui/PageElements';

const initialForm = {
  name: '',
  email: '',
  password: '',
  role: UserRole.ATTENDANT,
};

export default function AdminUserRegister() {
  const { session } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    try {
      await createUser(session.token, form);
      setForm(initialForm);
      showSuccess('Usuário cadastrado com sucesso.');
      navigate('/admin/users');
    } catch {
      // apiClient already shows toast for errors
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Administração"
        title="Cadastro de usuário"
        description="Cadastre atendentes e mecânicos para acessarem o sistema."
        backTo="/admin/users"
        backLabel="Voltar para usuários"
      />

      <Card>
        <form onSubmit={handleSubmit} noValidate>
          <div className="grid gap-5 md:grid-cols-2">
            <div className="md:col-span-2">
              <FieldLabel htmlFor="name">Nome completo</FieldLabel>
              <TextInput
                id="name"
                type="text"
                value={form.name}
                onChange={(e) => updateField('name', e.target.value)}
                placeholder="Ex.: Maria Silva"
              />
            </div>

            <div>
              <FieldLabel htmlFor="email">E-mail</FieldLabel>
              <TextInput
                id="email"
                type="text"
                value={form.email}
                onChange={(e) => updateField('email', e.target.value)}
                placeholder="usuario@oficina.com"
              />
            </div>

            <div>
              <FieldLabel htmlFor="password">Senha</FieldLabel>
              <TextInput
                id="password"
                type="password"
                value={form.password}
                onChange={(e) => updateField('password', e.target.value)}
                placeholder="Digite a senha"
              />
            </div>

            <div>
              <FieldLabel htmlFor="role">Perfil de acesso</FieldLabel>
              <SelectInput
                id="role"
                value={form.role}
                onChange={(e) => updateField('role', e.target.value)}
              >
                {UserRoleOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </SelectInput>
            </div>
          </div>

          <div className="mt-6 flex flex-col-reverse gap-3 border-t border-slate-100 pt-6 sm:flex-row sm:justify-end">
            <Link to="/admin/users" className="btn-secondary">
              Cancelar
            </Link>
            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? 'Salvando...' : 'Cadastrar usuário'}
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
}
