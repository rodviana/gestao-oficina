import { Link, useParams } from 'react-router-dom';
import { EmptyState } from '../components/ui/PageElements';

export default function VehicleHistory() {
  const { id } = useParams();

  return (
    <div className="space-y-6">
      <EmptyState
        title="Histórico integrado ao detalhe"
        description="O histórico de OS do veículo está na página de detalhe."
        action={
          <Link to={`/vehicles/${id}`} className="btn-secondary">
            Ver veículo
          </Link>
        }
      />
    </div>
  );
}
