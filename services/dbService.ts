
import { User, Extraction, Project } from '../types';

const STORAGE_KEY = 'ocr_app_data';

export const db = {
  saveData: (data: any) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  },
  loadData: () => {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  },
  clear: () => localStorage.removeItem(STORAGE_KEY)
};
