import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserRoleOptions } from '../constants/userRole';
import {
  Card,
  FieldLabel,
  PageHeader,
  SelectInput,
  TextInput,
} from '../components/ui/PageElements';
import { useAuth } from '../context/AuthContext';
import { createUser } from '../services/authService';
import { showSuccess } from '../services/apiClient';

export default function AdminUserRegister() {
  const { session } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState(UserRoleOptions[0].value);
  const [error, setError] = useState('');

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    if (!name.trim() || !email.trim() || password.length < 6) {
      setError('Preencha nome, e-mail e senha com no mínimo 6 caracteres.');
      return;
    }
    try {
      await createUser(session.token, { name, email, password, role });
      showSuccess('Usuário cadastrado.');
      navigate('/admin/users');
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="RF-02"
        title="Novo usuário"
        description="Cadastrar atendente ou mecânico."
        backTo="/admin/users"
      />

      <Card>
        <form className="mx-auto max-w-lg space-y-4" onSubmit={handleSubmit}>
          <div>
            <FieldLabel htmlFor="name">Nome</FieldLabel>
            <TextInput id="name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <FieldLabel htmlFor="email">E-mail</FieldLabel>
            <TextInput id="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div>
            <FieldLabel htmlFor="password">Senha</FieldLabel>
            <TextInput
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div>
            <FieldLabel htmlFor="role">Perfil</FieldLabel>
            <SelectInput id="role" value={role} onChange={(e) => setRole(e.target.value)}>
              {UserRoleOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </SelectInput>
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button type="submit" className="btn-primary">
            Cadastrar
          </button>
        </form>
      </Card>
    </div>
  );
}
