import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { findByNumberAndPlate, findByPhone } from '../../../data/tracking';

export function useTrackLookup() {
  const navigate = useNavigate();
  const [tab, setTab] = useState('os');
  const [number, setNumber] = useState('');
  const [plate, setPlate] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');

  function clearError() {
    setError('');
  }

  function switchTab(next) {
    setTab(next);
    setError('');
  }

  function fillDemo(demo) {
    setTab('os');
    setNumber(demo.number);
    setPlate(demo.plate);
    setError('');
  }

  function submitByOs(event) {
    event.preventDefault();
    setError('');
    const found = findByNumberAndPlate(number, plate);
    if (!found) {
      setError('Não encontramos essa OS com essa placa. Confira os dados do comprovante.');
      return;
    }
    navigate(`/os/${found.id}`);
  }

  function submitByPhone(event) {
    event.preventDefault();
    setError('');
    const list = findByPhone(phone);
    if (list.length === 0) {
      setError('Nenhuma OS encontrada para este telefone.');
      return;
    }
    if (list.length === 1) {
      navigate(`/os/${list[0].id}`);
      return;
    }
    navigate(`/busca?phone=${encodeURIComponent(phone)}`);
  }

  return {
    tab,
    number,
    plate,
    phone,
    error,
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
