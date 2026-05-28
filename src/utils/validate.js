export const validate = (form, isLogin = false) => {
    if (!isLogin && !form.name.trim()) return 'Name is required.';
    if (!form.email.trim()) return 'Email is required.';
    if (!/\S+@\S+\.\S+/.test(form.email)) return 'Enter a valid email.';
    if (form.password.length < 6) return 'Password must be at least 6 characters.';
    return null;
};
