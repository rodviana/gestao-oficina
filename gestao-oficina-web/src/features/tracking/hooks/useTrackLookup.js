import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { findByNumberAndPlate } from '../../../data/tracking';

export function useTrackLookup() {
  const navigate = useNavigate();
  const [tab, setTab] = useState('os');
  const [number, setNumber] = useState('');
  const [plate, setPlate] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  function clearError() {
    setError('');
  }

  function switchTab(next) {
    setTab(next);
    setError('');
  }

  function fillDemo(demo) {
    setTab('os');
    setNumber(demo.number || '');
    setPlate(demo.plate);
    setError('');
  }

  async function submitByOs(event) {
    event.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const found = await findByNumberAndPlate(number, plate);
      if (!found) {
        setError('Não encontramos essa OS com essa placa. Confira os dados do comprovante.');
        return;
      }
      navigate(`/os/${found.id}`, { state: { order: found } });
    } catch (err) {
      setError(err.message || 'Não foi possível consultar a OS.');
    } finally {
      setSubmitting(false);
    }
  }

  function submitByPhone(event) {
    event.preventDefault();
    setError('');
    setError('Para ver todas as suas OS, entre na sua conta. Ou use OS + placa na consulta rápida.');
  }

  return {
    tab,
    number,
    plate,
    phone,
    error,
    submitting,
    setNumber,
    setPlate,
    setPhone,
    switchTab,
    fillDemo,
    submitByOs,
    submitByPhone,
    clearError,
  };
}
