interface APIResponseContainer<T> {
  status: number;
  message: string;
  data: null | T;
}

export { type APIResponseContainer };
