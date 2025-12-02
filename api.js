const express = require("express");
const path = require("path");
const cors = require("cors")

const app = express();

app.use(cors());
// app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static(path.join(__dirname)));

app.post("/login", async (req, res) => {
    try {
        
        const { nome, senha } = req.body

        if (!nome || !senha) {
            return res.status(400).json({
                message: "O campo de usuário ou senha não foi preenchido!"
            });
        }

        if (nome !== "admin" || senha !== "123456") {
            return res.status(401).json({
                message: "O nome de usuário ou senha está incorreto ou não foi cadastrado!"
            });
        }

        return res.status(200).json({
            id: 1,
            nome: "admin",
            email: "admin@email.com"
        });

    } catch (error) {
        return res.status(500).json({
            message: "Falha na comunicação com o servidor!",
            error: String(error)
        });
    }
});

// 👉 GET = envia metas para o Angular
app.get("/metas", (req, res) => {
    return res.status(200).json({ metas: metasSalvas });
});

// 👉 POST = salva metas atualizadas
app.post("/metas", (req, res) => {
    const { metas } = req.body;

    if (!metas) {
        return res.status(400).json({
            message: "Nenhuma meta recebida!"
        });
    }

    metasSalvas = metas;

    return res.status(200).json({
        message: "Metas salvas com sucesso!"
    });
});

app.listen(3001, () => {
    console.log("API running on http://localhost:3001/");
});