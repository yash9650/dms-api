export type TPagination<T> = {
  currentPage: number;
  totalPages: number;
  data: T[];
};
