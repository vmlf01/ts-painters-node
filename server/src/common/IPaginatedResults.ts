interface IPaginatedResults<T> {
  data: T[];
  total: number;
  skip: number;
  take: number;
}

export default IPaginatedResults;
