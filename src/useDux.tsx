import { useReducer } from 'react'
import type { Dispatch } from 'react'

/**
 * A minimal React state management library with no additional dependencies. You
 * declare what the state looks like in an object: `initialState` and everything you
 * can do with it in another one: `acts`. Then you can either get and set state
 * directly, or access and manipulate it through the acts. Giving you the freedom to
 * decide how structured or flexible you want your state management to be.
 *
 * @param initialState initial values for all the state variables
 * @param acts object of functions that consume state. I.e. getters, setters,
 * derived state, reactions, etc. N.B. do not confuse with the `act` property.
 */
export function useDux<
  S,
  // A extends Acts<S,A > // Too recursive for TS right now (4.0).
  A extends {
    [key: string]: ({
      state,
      setState,
      act,
    }: {
      state: S
      setState: Dispatch<Partial<S>>
      act: { [K in keyof A]: ReturnType<A[K]> }
    }) => ReturnType<A[keyof A]>
  }
>(initialState: S, acts: A = {} as A) {
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

/**
 * Utility type to represent `setState` function returned by the useDux hook
 * @arg S state, usually `typeof initialState`.
 */
export type SetState<S> = Dispatch<Partial<S>>

/**
 * Utility type to represent the whole return type of the useDux hook which is the
 * same as the argument for dux acts.
 * @arg S state, usually `typeof initialState`.
 * @arg A acts, an object containing stateful interactions.s
 */
export type Dux<S, A extends Acts<S, A>> = {
  act: Act<S, A>
  setState: Dispatch<Partial<S>>
  state: S
}

/**
 * Utility type to represent `act` object returned by the useDux hook
 * @arg A state, usually `typeof initialState`.
 */
export type Act<S, A extends Acts<S, A>> = { [K in keyof A]: ReturnType<A[K]> }

/**
 * Utility type to represent the `acts` argument of useDux. It is an object where
 * every value is a function that consumes state. Acts can be use for all sorts of
 * things, e.g: getters, setters, derived state, reactions, etc.
 */
export type Acts<S, A extends Acts<S, A>> = {
  [key: string]: ({
    state,
    setState,
    act,
  }: {
    state: S
    setState: Dispatch<Partial<S>>
    act: { [K in keyof A]: ReturnType<A[K]> }
  }) => ReturnType<A[keyof A]>
}
