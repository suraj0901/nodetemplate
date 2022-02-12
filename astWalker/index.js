// @ts-check
import { SyncWalker } from "./sync.js";
// import { AsyncWalker } from './async.js';

/** @typedef { import('estree').BaseNode} BaseNode */
/** @typedef { import('./sync.js').SyncHandler} SyncHandler */
// /** @typedef { import('./async.js').AsyncHandler} AsyncHandler */

/**
 *
 * @param {BaseNode} ast
 * @param {{
 *   enter?: SyncHandler
 *   leave?: SyncHandler
 * }} walker
 * @returns {BaseNode}
 */
export function walk(ast, { enter, leave }) {
  const instance = new SyncWalker(enter, leave);
  return instance.visit(ast, null);
}
