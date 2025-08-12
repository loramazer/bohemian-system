import mercadopago from "../config/mercadopago.js";
import Pagamento from "../models/pagamentoModel.js";

export const createPreference = async (req, res) => {
  try {
    const { title, quantity, price } = req.body;

    const preference = {
      items: [
        {
          title,
          quantity: Number(quantity),
          currency_id: "BRL",
          unit_price: Number(price)
        }
      ],
      back_urls: {
        success: "http://localhost:3000/success",
        failure: "http://localhost:3000/failure",
        pending: "http://localhost:3000/pending"
      },
      auto_return: "approved",
      notification_url: "https://seu-dominio.com/webhook"
    };

    const response = await mercadopago.preferences.create(preference);

    // Salva no banco o pagamento pendente
    await Pagamento.create({
      preference_id: response.body.id,
      status: "pendente"
    });

    res.json({ id: response.body.id });
  } catch (error) {
    console.error(error);
    res.status(500).send("Erro ao criar preferência");
  }
};

export const webhook = async (req, res) => {
  try {
    console.log("📩 Webhook recebido:", req.body);

    const { id, topic } = req.query;

    if (topic === "payment") {
      const payment = await mercadopago.payment.findById(id);
      const status = payment.body.status;

      // Atualiza no banco
      await Pagamento.updateStatusByPreferenceId(payment.body.order.id, status);
    }

    res.sendStatus(200);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
};
