import { useReducer } from 'react'

export function useDux<
  S,
  A extends { [key: string]: (state: S) => ReturnType<A[keyof A]> }
>(initialState: S, acts: A) {
  const [state, setState] = useReducer(
    ((state, changes) => Object.assign({}, state, changes)) as (
      state: S,
      changes: Partial<S>,
    ) => S,
    initialState,
  )

  const dux = {} as { [K in keyof A]: ReturnType<A[K]> }
  for (const [name, action] of Object.entries(acts)) {
    dux[name as keyof A] = action(state)
  }

  return { dux, state, setState }
}
