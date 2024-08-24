import {
  computedSignal,
  numberGenerator,
  range,
  Signal,
  stringGenerator,
  signal
} from "plicit";

export type User = {
  firstname: string;
  lastname: string;
  age: number;
  id: string;
};

const NUM_PEOPLE = 100;

export type UseFakeDatabase = {
  users: Signal<User[]>;
  totalCount: Signal<number>;
  insertUser: (user: Omit<User, 'id'>) => void;
}

export const useFakeDatabase = (props: {
  query: Signal<string>;
  count?: number;
  seed?: number;
}): UseFakeDatabase => {
  const count = props.count || NUM_PEOPLE;

  const numGen = numberGenerator(props.seed ?? 3919);
  const stringGen = stringGenerator(undefined, numGen);

  const initialUsers = signal(range(count).map((): User => {
    return {
      firstname: stringGen.nextWord(3, 9),
      lastname: stringGen.nextWord(3, 9),
      age: numGen.nextInt(20, 60),
      id: stringGen.next(16)
    };
  }));

  const unfilteredUsers = computedSignal(() => {
    return initialUsers.get();
  });

  const users = computedSignal(() => {
    const qv = props.query.get();
    if (!qv || qv.length <= 1) return initialUsers.get();
    const q = qv.toLowerCase();
    return unfilteredUsers.get().filter((user) => {
      return (
        user.firstname.toLowerCase().includes(q) ||
        user.lastname.toLowerCase().includes(q)
      );
    });
  });

  const totalCount = computedSignal(() => unfilteredUsers.get().length);

  const insertUser = (user: Omit<User, 'id'>) => {
    initialUsers.set((users) => [{...user, id: stringGen.next(16)}, ...users]);
  }

  return {
    users,
    totalCount,
    insertUser
  };
};
