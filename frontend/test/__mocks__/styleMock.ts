// Mock for plain CSS imports in tests.
// CSS files don't contain JavaScript, so we export an empty object.
// CSS Modules use identity-obj-proxy instead (returns class names as-is).
export default {};
