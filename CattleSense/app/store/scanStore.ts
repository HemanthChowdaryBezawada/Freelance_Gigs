import { create } from 'zustand';

interface ScanState {
    capturedImage: string | null;
    setCapturedImage: (uri: string | null) => void;
    predictions: any[];
    setPredictions: (preds: any[]) => void;
    resetScan: () => void;
}

export const useScanStore = create<ScanState>((set) => ({
    capturedImage: null,
    setCapturedImage: (uri) => set({ capturedImage: uri }),
    predictions: [],
    setPredictions: (preds) => set({ predictions: preds }),
    resetScan: () => set({ capturedImage: null, predictions: [] }),
}));
