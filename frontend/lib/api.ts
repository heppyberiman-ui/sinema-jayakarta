import axios, { type AxiosError } from "axios";

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:5000";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ INTERFACE SUDAH LENGKAP
export interface Film {
  id_film?: number;
  judul: string;
  genre: string | null;
  tahun: number | null;
  image: string;
  sinopsis: string | null;
}

// ✅ GET ALL FILMS
const normalizeFilmsResponse = (data: any): Film[] => {
  if (Array.isArray(data)) return data;
  if (data && Array.isArray(data.data)) return data.data;
  console.error("Unexpected /api/movies response format", data);
  return [];
};

export const getFilms = async (): Promise<Film[]> => {
  try {
    const response = await apiClient.get("/api/movies");
    return normalizeFilmsResponse(response.data);
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      console.error("Axios error fetching films:", {
        message: axiosError.message,
        url: `${API_BASE_URL}/api/movies`,
        status: axiosError.response?.status,
        responseData: axiosError.response?.data,
        headers: axiosError.response?.headers,
        request: axiosError.request,
      });
    } else {
      console.error("Unknown error fetching films:", error);
    }
    return [];
  }
};

// ✅ GET FILM BY ID
export const getFilmById = async (id: number): Promise<Film | null> => {
  try {
    const response = await apiClient.get(`/api/movies/${id}`);
    return response.data.data || response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      console.error(`Axios error fetching film ${id}:`, {
        message: axiosError.message,
        url: `${API_BASE_URL}/api/movies/${id}`,
        status: axiosError.response?.status,
        responseData: axiosError.response?.data,
        headers: axiosError.response?.headers,
        request: axiosError.request,
      });
    } else {
      console.error(`Unknown error fetching film ${id}:`, error);
    }
    return null;
  }
};

// ✅ DELETE FILM
export const deleteFilm = async (id: number): Promise<boolean> => {
  try {
    const response = await apiClient.delete(`/api/movies/${id}`);
    return response.status === 200 || response.status === 204;
  } catch (error: any) {
    console.error(`Error deleting film ${id}:`, error);
    return false;
  }
};

// ✅ UPDATE FILM
export const updateFilm = async (
  id: number,
  film: Film,
): Promise<Film | null> => {
  try {
    const response = await apiClient.put(`/api/movies/${id}`, film);
    return response.data.data || response.data;
  } catch (error: any) {
    console.error(`Error updating film ${id}:`, error);
    throw error;
  }
};
