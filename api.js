const express = require("express");
const path = require("path");
const cors = require("cors")

const app = express();

const usuarios = [
  {
    id: 1,
    nome: "admin",
    email: "admin@email.com",
    senha: "123456"
  }
];
const metasPorUsuario = {};

app.use(cors());
// app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static(path.join(__dirname)));

app.post("/login", async (req, res) => {
    try {
        const { nome, senha } = req.body;

        if (!nome || !senha) {
            return res.status(400).json({
                message: "O campo de usuário ou senha não foi preenchido!"
            });
        }

        // ADMIN FIXO
        if (nome === "admin" && senha === "123456") {
            return res.status(200).json({
                id: 1,
                nome: "admin",
                email: "admin@email.com"
            });
        }

        // 👤 USUÁRIOS CADASTRADOS
        const usuario = usuarios.find(
            u => (u.nome === nome || u.email === nome) && u.senha === senha
        );

        if (!usuario) {
            return res.status(401).json({
                message: "O nome de usuário ou senha está incorreto ou não foi cadastrado!"
            });
        }

        return res.status(200).json({
            id: usuario.id,
            nome: usuario.nome,
            email: usuario.email
        });

    } catch (error) {
        return res.status(500).json({
            message: "Falha na comunicação com o servidor!",
            error: String(error)
        });
    }
});

app.post("/usuarios", async (req, res) => {
    try {
        const { nome, email, senha } = req.body;

        if (!nome || !email || !senha) {
            return res.status(400).json({
                message: "Preencha todos os campos obrigatórios."
            });
        }

        const usuarioExiste = usuarios.find(
            u => u.nome === nome || u.email === email
        );

        if (usuarioExiste) {
            return res.status(409).json({
                message: "Usuário já cadastrado."
            });
        }

        const novoUsuario = {
            id: usuarios.length + 2, // começa depois do admin
            nome,
            email,
            senha
        };

        usuarios.push(novoUsuario);

        return res.status(201).json({
            message: "Usuário cadastrado com sucesso!",
            usuario: {
                id: novoUsuario.id,
                nome: novoUsuario.nome,
                email: novoUsuario.email
            }
        });

    } catch (error) {
        return res.status(500).json({
            message: "Erro no servidor",
            error: String(error)
        });
    }
});

// 👉 GET = envia metas para o Angular
app.get("/metas/:userId", (req, res) => {
  const { userId } = req.params;

  return res.status(200).json({
    metas: metasPorUsuario[userId] || []
  });
});

// 👉 POST = salva metas atualizadas
app.post("/metas", (req, res) => {
  const { userId, metas } = req.body;

  if (!userId || !metas) {
    return res.status(400).json({ message: "Dados inválidos" });
  }

  metasPorUsuario[userId] = metas;

  return res.status(200).json({ message: "Metas salvas com sucesso!" });
});

app.listen(3001, () => {
    console.log("API running on http://localhost:3001/");
});