interface Login {
  username: string;
  password: string;
}
interface Register {
  username: string;
  password: string;
  confirmPassword: string;
}

export { Login, Register };
