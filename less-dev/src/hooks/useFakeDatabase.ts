import { computed, numberGenerator, range, Ref, ref, stringGenerator } from "less";

export type User = {
  firstname: string;
  lastname: string;
  age: number;
}

const NUM_PEOPLE = 100;

export const useFakeDatabase = (props: {
  query: Ref<string>,
  count?: number
}) => {

  const count = props.count || NUM_PEOPLE;
  
  const numGen = numberGenerator(3919);
  const stringGen = stringGenerator(undefined, numGen);

  const initialUsers: User[] = range(count).map(() => {
    return {
      firstname: stringGen.nextWord(3, 9),
      lastname: stringGen.nextWord(3, 9),
      age: numGen.nextInt(20, 60)
    }
  });

  const users = computed(() => {
    if (!props.query.value || props.query.value.length <= 1) return initialUsers;
    const q = props.query.value.toLowerCase();
    return initialUsers.filter((user) => {
      return user.firstname.toLowerCase().includes(q) || user.lastname.toLowerCase().includes(q); 
    })
  } ,[props.query])

  return {
    users
  }
}
