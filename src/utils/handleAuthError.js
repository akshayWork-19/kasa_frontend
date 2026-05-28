export const handleAuthError = (err) => {
    if (!err.response) return 'Unable to connect. Please check your connection.';
    if (err.response.status === 401) return 'Invalid email or password.';
    if (err.response.status === 409) return 'An account with this email already exists.';
    if (err.response.status === 422) return err.response.data?.message || 'Invalid input.';
    if (err.response.status >= 500) return 'Something went wrong on our end. Try again shortly.';
    return err.response.data?.message || 'Something went wrong.';
};