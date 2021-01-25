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
  A extends (
    state: S,
    setState: SetState<S>,
  ) => {
    [K in keyof ReturnType<A>]: ReturnType<A>[K]
  }
>(initialState: S, getActs: A) {
  const [state, setState] = useReducer(
    ((state, changes) => Object.assign({}, state, changes)) as (
      state: S,
      changes: Partial<S>,
    ) => S,
    initialState,
  )

  return { act: getActs(state, setState), setState, state }
}

/**
 * Utility type to represent `setState` function returned by the useDux hook
 * @arg S state, usually `typeof initialState`.
 */
export type SetState<S> = Dispatch<Partial<S>>

/**
 * This functions types acts correctly
 */
export function typeActs<
  S,
  A extends (
    state: S,
    setState: SetState<S>,
  ) => {
    [K in keyof ReturnType<A>]: ReturnType<A>[K]
  }
>(initialState: S, getActs: A) {
  return getActs
}
