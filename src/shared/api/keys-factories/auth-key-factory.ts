export const authKeys = {
    all: ['auth'],
    login: () => [...authKeys.all, 'login'],
    register: () => [...authKeys.all, 'register']
};
