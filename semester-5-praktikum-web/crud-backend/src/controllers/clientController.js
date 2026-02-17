import * as clientService from "../services/clientServices.js";

export const getClients = async (req, res) => {
  try {
    const clients = await clientService.getClients();
    console.log(clients);
    res.status(200).json(clients);
  } catch (error) {
    console.error(`Error fetching clients: ${error}`);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const createClient = async (req, res) => {
  try {
    const { name, email, job, rate, isactive } = req.body;

    // validasi
    if (!name || !email || !job || !rate) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (typeof isactive !== "boolean") {
      return res.status(400).json({ message: "'isactive' must be a boolean" });
    }

    // buat client baru
    const newClient = await clientService.createGetClient({
      name,
      email,
      job,
      rate,
      isactive,
    });

    res.status(201).json(newClient);
  } catch (error) {
    console.error(`Error creating client: ${error.message}`);

    if (error.message.includes("Email already exists")) {
      return res.status(409).json({ message: "Email already exists" }); // ini conflict inget
    }

    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateClient = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    if (!id || !updatedData) {
      return res
        .status(400)
        .json({ message: "ID and updated data are required" });
    }

    const updatedClient = await clientService.updateClient(id, updatedData);

    res.status(200).json(updatedClient);
  } catch (error) {
    console.error(`Error updating client: ${error.message}`);

    if (error.message.includes("not found")) {
      return res.status(404).json({ message: "Client not found" });
    }

    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deleteClient = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "ID is required" });
    }

    const deletedClient = await clientService.deleteClient(id);

    res.status(200).json({
      message: "Client deleted successfully",
      client: deletedClient,
    });
  } catch (error) {
    console.error(`Error deleting client: ${error.message}`);

    if (error.message.includes("not found")) {
      return res.status(404).json({ message: "Client not found" });
    }

    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const searchClient = async (req, res) => {
  try {
    const { query } = req.query; // ngambil parameter query dari URL
    if (!query) {
      return res.status(400).json({ message: "Search query is required" });
    }

    const clients = await clientService.searchClient(query);

    if (clients.length === 0) {
      return res.status(404).json({ message: "No clients found" });
    }

    res.status(200).json(clients); // data yang cocok
  } catch (error) {
    console.error(`Error searching client: ${error.message}`);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
