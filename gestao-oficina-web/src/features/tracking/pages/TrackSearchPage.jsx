import { Link, useNavigate } from 'react-router-dom';

export default function TrackSearchPage() {
  const navigate = useNavigate();

  return (
    <div className="mx-auto max-w-lg px-4 py-12 text-center">
      <p className="text-shop-500">
        Busca por telefone não está disponível sem login. Entre na sua conta ou use OS + placa.
      </p>
      <Link to="/login" className="btn-primary mt-6 inline-flex">
        Entrar na conta
      </Link>
      <button type="button" className="btn-ghost mt-3 block w-full" onClick={() => navigate('/consulta')}>
        Consultar por OS + placa
      </button>
    </div>
  );
}
