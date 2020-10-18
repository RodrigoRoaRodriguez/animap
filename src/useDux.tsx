import { useReducer } from 'react'

export function useDux<
  S,
  A extends {
    [key: string]: ({
      state,
      setState,
      act,
    }: {
      state: S
      setState: React.Dispatch<Partial<S>>
      act: { [K in keyof A]: ReturnType<A[K]> }
    }) => ReturnType<A[keyof A]>
  }
>(initialState: S, acts: A) {
  const [state, setState] = useReducer(
    ((state, changes) => Object.assign({}, state, changes)) as (
      state: S,
      changes: Partial<S>,
    ) => S,
    initialState,
  )

  const act = {} as { [K in keyof A]: ReturnType<A[K]> }
  for (const [name, action] of Object.entries(acts)) {
    act[name as keyof A] = action({ act, setState, state })
  }

  return { act, setState, state }
}
