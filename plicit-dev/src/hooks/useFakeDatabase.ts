import { computedSignal, numberGenerator, range, Signal, stringGenerator } from "plicit";

export type User = {
  firstname: string;
  lastname: string;
  age: number;
}

const NUM_PEOPLE = 100;

export const useFakeDatabase = (props: {
  query: Signal<string>;
  count?: number;
  seed?: number
}) => {

  const count = props.count || NUM_PEOPLE;
  
  const numGen = numberGenerator(props.seed ?? 3919);
  const stringGen = stringGenerator(undefined, numGen);

  const initialUsers: User[] = range(count).map(() => {
    return {
      firstname: stringGen.nextWord(3, 9),
      lastname: stringGen.nextWord(3, 9),
      age: numGen.nextInt(20, 60)
    }
  });

  const users = computedSignal(() => {
    const qv = props.query.get();
    if (!qv || qv.length <= 1) return initialUsers;
    const q = qv.toLowerCase();
    return initialUsers.filter((user) => {
      return user.firstname.toLowerCase().includes(q) || user.lastname.toLowerCase().includes(q); 
    })
  })

  return {
    users
  }
}
