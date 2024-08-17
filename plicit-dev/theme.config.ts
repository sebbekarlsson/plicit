import { theme } from './theme';

// @ts-ignore
if (typeof module !== 'undefined') {
  // @ts-ignore
  module.exports = {
    extend: theme
  }
}

export default theme
