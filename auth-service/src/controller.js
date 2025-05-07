import { loginService, registerService } from './service.js';

export const login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const token = await loginService(username, password);
    res.status(200).json({ token });
  } catch (err) {
    console.error('Login failed:', err);
    res.status(401).json({ message: 'Niepoprawne dane logowania' });
  }
};

export const register = async (req, res) => {
  const { username, password, email } = req.body;
  try {
    await registerService(username, password, email);
    const token = await loginService(username, password);
    res.status(200).json({ token });
  } catch (err) {
    console.error('Rejestracja nieudana:', err?.response?.data || err.message);
    res.status(500).send({err: err});
  }
};

