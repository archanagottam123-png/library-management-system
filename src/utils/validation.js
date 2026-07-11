// Reusable form validation helpers.

// Returns an object of { fieldName: errorString }.
// Empty object means the form is valid.
export function validateForm(values, rules) {
  const errors = {};
  for (const field in rules) {
    const value = values[field];
    const rule = rules[field];

    if (rule.required && (!value || String(value).trim() === '')) {
      errors[field] = `${rule.label} is required`;
      continue;
    }
    if (value && rule.min && Number(value) < rule.min) {
      errors[field] = `${rule.label} must be at least ${rule.min}`;
    }
    if (value && rule.pattern && !rule.pattern.test(String(value))) {
      errors[field] = rule.message || `${rule.label} is invalid`;
    }
  }
  return errors;
}
