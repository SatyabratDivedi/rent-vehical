import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Vehicle } from '@/app/vehicles/page';

interface VehicleState {
    vehicles: Vehicle[];
    singleVehicle: Vehicle | null;
}

const initialState: VehicleState = {
  vehicles: [],
  singleVehicle: null,
};

export const vehicleSlice = createSlice({
  name: 'vehicle',
  initialState,
  reducers: {
    setVehicle: (state, action: PayloadAction<Vehicle>) => {
      state.vehicles.push(action.payload);
    },
    setSingleVehicle: (state, action: PayloadAction<Vehicle>) => {
      state.vehicles = [action.payload];
    },
    clearVehicle: (state) => {
      state.vehicles = [];
    },
  },
});

export const { setVehicle, setSingleVehicle,  clearVehicle } = vehicleSlice.actions;

export default vehicleSlice.reducer;
