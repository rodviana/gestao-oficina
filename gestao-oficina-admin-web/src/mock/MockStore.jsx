import { createContext, useContext, useMemo, useState } from 'react';
import { createSeedState, workOrderTotal } from './seed';
import { WorkOrderStatus } from './labels';

const MockStoreContext = createContext(null);

function nowIso() {
  return new Date().toISOString();
}

function normalizePlate(plate) {
  return String(plate || '')
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '');
}

function normalizePhone(phone) {
  return String(phone || '').replace(/\D/g, '');
}

export function MockStoreProvider({ children }) {
  const [state, setState] = useState(createSeedState);

  const api = useMemo(() => {
    function update(updater) {
      setState((prev) => updater(structuredClone(prev)));
    }

    return {
      getState: () => state,

      listCustomers(query = '') {
        const q = query.trim().toLowerCase();
        return state.customers
          .filter((c) => {
            if (!q) return true;
            return (
              c.name.toLowerCase().includes(q) ||
              normalizePhone(c.phone).includes(normalizePhone(q)) ||
              (c.document || '').toLowerCase().includes(q)
            );
          })
          .sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'));
      },

      getCustomer(id) {
        return state.customers.find((c) => c.id === id) || null;
      },

      saveCustomer(payload) {
        let saved = null;
        update((draft) => {
          if (payload.id) {
            const idx = draft.customers.findIndex((c) => c.id === payload.id);
            if (idx >= 0) {
              draft.customers[idx] = {
                ...draft.customers[idx],
                name: payload.name.trim(),
                phone: normalizePhone(payload.phone),
                document: (payload.document || '').trim(),
              };
              saved = draft.customers[idx];
            }
          } else {
            saved = {
              id: `c-${draft.nextIds.customer++}`,
              name: payload.name.trim(),
              phone: normalizePhone(payload.phone),
              document: (payload.document || '').trim(),
              createdAt: nowIso(),
            };
            draft.customers.push(saved);
          }
          return draft;
        });
        return saved;
      },

      listVehicles({ customerId, query } = {}) {
        const q = (query || '').trim().toLowerCase();
        return state.vehicles
          .filter((v) => {
            if (customerId && v.customerId !== customerId) return false;
            if (!q) return true;
            const plate = normalizePlate(v.plate).toLowerCase();
            return (
              plate.includes(normalizePlate(q).toLowerCase()) ||
              v.brand.toLowerCase().includes(q) ||
              v.model.toLowerCase().includes(q)
            );
          })
          .sort((a, b) => a.plate.localeCompare(b.plate));
      },

      getVehicle(id) {
        return state.vehicles.find((v) => v.id === id) || null;
      },

      saveVehicle(payload) {
        const plate = normalizePlate(payload.plate);
        let saved = null;
        let error = null;
        update((draft) => {
          const duplicate = draft.vehicles.find(
            (v) => normalizePlate(v.plate) === plate && v.id !== payload.id,
          );
          if (duplicate) {
            error = 'Já existe um veículo com esta placa.';
            return draft;
          }
          if (payload.id) {
            const idx = draft.vehicles.findIndex((v) => v.id === payload.id);
            if (idx >= 0) {
              draft.vehicles[idx] = {
                ...draft.vehicles[idx],
                customerId: payload.customerId,
                plate,
                brand: payload.brand.trim(),
                model: payload.model.trim(),
                year: Number(payload.year) || null,
              };
              saved = draft.vehicles[idx];
            }
          } else {
            saved = {
              id: `v-${draft.nextIds.vehicle++}`,
              customerId: payload.customerId,
              plate,
              brand: payload.brand.trim(),
              model: payload.model.trim(),
              year: Number(payload.year) || null,
              createdAt: nowIso(),
            };
            draft.vehicles.push(saved);
          }
          return draft;
        });
        if (error) throw new Error(error);
        return saved;
      },

      quickSearch(term) {
        const raw = (term || '').trim();
        if (!raw) return { customers: [], vehicles: [] };
        const phone = normalizePhone(raw);
        const plate = normalizePlate(raw).toLowerCase();

        const vehicles = state.vehicles.filter((v) =>
          normalizePlate(v.plate).toLowerCase().includes(plate),
        );
        const customersByPhone = phone
          ? state.customers.filter((c) => normalizePhone(c.phone).includes(phone))
          : [];
        const customersByName = state.customers.filter((c) =>
          c.name.toLowerCase().includes(raw.toLowerCase()),
        );
        const customerMap = new Map();
        [...customersByPhone, ...customersByName].forEach((c) => customerMap.set(c.id, c));
        vehicles.forEach((v) => {
          const c = state.customers.find((x) => x.id === v.customerId);
          if (c) customerMap.set(c.id, c);
        });

        return {
          customers: [...customerMap.values()],
          vehicles,
        };
      },

      listWorkOrders(filters = {}) {
        return state.workOrders
          .filter((wo) => {
            if (filters.status && wo.status !== filters.status) return false;
            if (filters.paymentStatus && wo.paymentStatus !== filters.paymentStatus) return false;
            if (filters.vehicleId && wo.vehicleId !== filters.vehicleId) return false;
            if (filters.customerId && wo.customerId !== filters.customerId) return false;
            if (filters.query) {
              const q = filters.query.trim().toLowerCase();
              const vehicle = state.vehicles.find((v) => v.id === wo.vehicleId);
              const customer = state.customers.find((c) => c.id === wo.customerId);
              const hay = [
                wo.number,
                wo.description,
                vehicle?.plate,
                customer?.name,
                customer?.phone,
              ]
                .filter(Boolean)
                .join(' ')
                .toLowerCase();
              if (!hay.includes(q) && !normalizePlate(vehicle?.plate || '').toLowerCase().includes(normalizePlate(q).toLowerCase())) {
                return false;
              }
            }
            return true;
          })
          .sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)));
      },

      getWorkOrder(id) {
        return state.workOrders.find((wo) => wo.id === id) || null;
      },

      createWorkOrder(payload) {
        let saved = null;
        update((draft) => {
          const number = `OS-2026-${String(draft.nextIds.workOrder).padStart(3, '0')}`;
          saved = {
            id: `os-${draft.nextIds.workOrder++}`,
            number,
            customerId: payload.customerId,
            vehicleId: payload.vehicleId,
            description: payload.description.trim(),
            status: WorkOrderStatus.OPEN,
            paymentStatus: 'UNPAID',
            mechanicId: payload.mechanicId || null,
            createdById: payload.createdById,
            createdAt: nowIso(),
            updatedAt: nowIso(),
            items: [],
          };
          draft.workOrders.unshift(saved);
          return draft;
        });
        return saved;
      },

      updateWorkOrderStatus(id, status) {
        update((draft) => {
          const wo = draft.workOrders.find((x) => x.id === id);
          if (wo) {
            wo.status = status;
            wo.updatedAt = nowIso();
          }
          return draft;
        });
      },

      updateWorkOrderPayment(id, paymentStatus) {
        update((draft) => {
          const wo = draft.workOrders.find((x) => x.id === id);
          if (wo) {
            wo.paymentStatus = paymentStatus;
            wo.updatedAt = nowIso();
          }
          return draft;
        });
      },

      assignMechanic(id, mechanicId) {
        update((draft) => {
          const wo = draft.workOrders.find((x) => x.id === id);
          if (wo) {
            wo.mechanicId = mechanicId || null;
            wo.updatedAt = nowIso();
          }
          return draft;
        });
      },

      addWorkOrderItem(orderId, item) {
        const locked = [WorkOrderStatus.DELIVERED, WorkOrderStatus.CANCELLED];
        const current = state.workOrders.find((x) => x.id === orderId);
        if (!current) throw new Error('OS não encontrada.');
        if (locked.includes(current.status)) {
          throw new Error('Não é possível alterar itens nesta OS.');
        }
        update((draft) => {
          const wo = draft.workOrders.find((x) => x.id === orderId);
          wo.items.push({
            id: `i-${draft.nextIds.item++}`,
            type: item.type,
            description: item.description.trim(),
            quantity: Number(item.quantity),
            unitPrice: Number(item.unitPrice),
          });
          wo.updatedAt = nowIso();
          return draft;
        });
      },

      removeWorkOrderItem(orderId, itemId) {
        const locked = [WorkOrderStatus.DELIVERED, WorkOrderStatus.CANCELLED];
        const current = state.workOrders.find((x) => x.id === orderId);
        if (!current) throw new Error('OS não encontrada.');
        if (locked.includes(current.status)) {
          throw new Error('Não é possível alterar itens nesta OS.');
        }
        update((draft) => {
          const wo = draft.workOrders.find((x) => x.id === orderId);
          wo.items = wo.items.filter((i) => i.id !== itemId);
          wo.updatedAt = nowIso();
          return draft;
        });
      },

      listServiceCatalog() {
        return state.serviceCatalog.slice().sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'));
      },

      listPartCatalog() {
        return state.partCatalog.slice().sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'));
      },

      saveServiceCatalogItem(payload) {
        update((draft) => {
          if (payload.id) {
            const idx = draft.serviceCatalog.findIndex((s) => s.id === payload.id);
            if (idx >= 0) {
              draft.serviceCatalog[idx] = {
                ...draft.serviceCatalog[idx],
                name: payload.name.trim(),
                defaultPrice: Number(payload.defaultPrice),
                active: Boolean(payload.active),
              };
            }
          } else {
            draft.serviceCatalog.push({
              id: `svc-${draft.nextIds.service++}`,
              name: payload.name.trim(),
              defaultPrice: Number(payload.defaultPrice),
              active: true,
            });
          }
          return draft;
        });
      },

      savePartCatalogItem(payload) {
        update((draft) => {
          if (payload.id) {
            const idx = draft.partCatalog.findIndex((s) => s.id === payload.id);
            if (idx >= 0) {
              draft.partCatalog[idx] = {
                ...draft.partCatalog[idx],
                name: payload.name.trim(),
                active: Boolean(payload.active),
              };
              delete draft.partCatalog[idx].defaultPrice;
            }
          } else {
            draft.partCatalog.push({
              id: `prt-${draft.nextIds.part++}`,
              name: payload.name.trim(),
              active: true,
            });
          }
          return draft;
        });
      },

      listUsers(filters = {}) {
        return state.users
          .filter((u) => {
            if (filters.role && u.role !== filters.role) return false;
            if (filters.active === true && !u.active) return false;
            if (filters.active === false && u.active) return false;
            if (filters.query) {
              const q = filters.query.toLowerCase();
              if (!u.name.toLowerCase().includes(q) && !u.email.toLowerCase().includes(q)) {
                return false;
              }
            }
            return true;
          })
          .sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'));
      },

      createUser(payload) {
        let saved = null;
        let error = null;
        update((draft) => {
          if (draft.users.some((u) => u.email.toLowerCase() === payload.email.toLowerCase())) {
            error = 'E-mail já cadastrado.';
            return draft;
          }
          saved = {
            id: `u-${draft.nextIds.user++}`,
            name: payload.name.trim(),
            email: payload.email.trim().toLowerCase(),
            role: payload.role,
            active: true,
            createdAt: nowIso(),
          };
          draft.users.push(saved);
          return draft;
        });
        if (error) throw new Error(error);
        return saved;
      },

      mechanics() {
        return state.users.filter((u) => u.role === 'MECHANIC' && u.active);
      },

      workOrderTotal,
      reset() {
        setState(createSeedState());
      },
    };
  }, [state]);

  return <MockStoreContext.Provider value={api}>{children}</MockStoreContext.Provider>;
}

export function useMockStore() {
  const ctx = useContext(MockStoreContext);
  if (!ctx) throw new Error('useMockStore must be used within MockStoreProvider');
  return ctx;
}
