import db from "../config/db.js";

const Pagamento = {
  create: async ({ preference_id, status }) => {
    const sql = "INSERT INTO pagamentos (preference_id, status) VALUES (?, ?)";
    await db.query(sql, [preference_id, status]);
  },

  updateStatusByPreferenceId: async (preference_id, status) => {
    const sql = "UPDATE pagamentos SET status = ? WHERE preference_id = ?";
    await db.query(sql, [status, preference_id]);
  }
};

export default Pagamento;
