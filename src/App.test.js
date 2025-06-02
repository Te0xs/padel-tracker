import React, { useState, useEffect } from "react";

const App = () => {
  const [partite, setPartite] = useState([]);
  const [form, setForm] = useState({
    data: "",
    giocatoreA2: "",
    giocatoreB1: "",
    giocatoreB2: "",
    set1: "",
    set2: "",
    set3: "",
    valorePartita: 0,
    commenti: "",
  });
  const [iniziaPunteggioPre, setIniziaPunteggioPre] = useState(0);

  useEffect(() => {
    const partiteSalvate = localStorage.getItem("partite");
    if (partiteSalvate) {
      setPartite(JSON.parse(partiteSalvate));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("partite", JSON.stringify(partite));
  }, [partite]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const calcolaRisultato = (set1, set2, set3) => {
    const sets = [set1, set2, set3].filter(Boolean);
    let vittorieA = 0;
    let vittorieB = 0;

    sets.forEach((s) => {
      const [punteggioA, punteggioB] = s.split("-").map((n) => parseInt(n.trim(), 10));
      if (punteggioA > punteggioB) {
        vittorieA++;
      } else if (punteggioB > punteggioA) {
        vittorieB++;
      }
    });

    return vittorieA > vittorieB ? "Vittoria" : "Sconfitta";
  };

  const aggiungiPartita = () => {
    const risultato = calcolaRisultato(form.set1, form.set2, form.set3);

    // Se è la prima partita, usa il valore iniziale
    const punteggioPre =
      partite.length === 0 ? parseFloat(iniziaPunteggioPre) : partite[0].punteggioPost;

    const punteggioPost = punteggioPre + parseFloat(form.valorePartita);

    const nuovaPartita = {
      ...form,
      id: Date.now(),
      giocatoreA1: "IO", // Valore fisso
      punteggioPre,
      punteggioPost,
      risultato,
    };

    setPartite((prev) => [nuovaPartita, ...prev]);

    setForm({
      data: "",
      giocatoreA2: "",
      giocatoreB1: "",
      giocatoreB2: "",
      set1: "",
      set2: "",
      set3: "",
      valorePartita: 0,
      commenti: "",
    });
  };

  const eliminaPartita = (id) => {
    setPartite((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Padel Tracker</h1>

      {/* Punteggio Pre solo la prima volta */}
      {partite.length === 0 && (
        <div className="mb-4">
          <label className="font-semibold mr-2">Imposta Punteggio Pre Iniziale:</label>
          <input
            type="number"
            value={iniziaPunteggioPre}
            onChange={(e) => setIniziaPunteggioPre(e.target.value)}
            className="border p-2"
          />
        </div>
      )}

      <div className="bg-gray-100 p-4 rounded mb-4">
        <h2 className="font-semibold mb-2">Aggiungi Partita</h2>
        <input
          type="date"
          name="data"
          value={form.data}
          onChange={handleChange}
          className="border p-2 mr-2"
        />
        <input
          type="text"
          name="giocatoreA2"
          placeholder="Giocatore A2"
          value={form.giocatoreA2}
          onChange={handleChange}
          className="border p-2 mr-2"
        />
        <input
          type="text"
          name="giocatoreB1"
          placeholder="Giocatore B1"
          value={form.giocatoreB1}
          onChange={handleChange}
          className="border p-2 mr-2"
        />
        <input
          type="text"
          name="giocatoreB2"
          placeholder="Giocatore B2"
          value={form.giocatoreB2}
          onChange={handleChange}
          className="border p-2 mr-2"
        />
        <br />
        <input
          type="text"
          name="set1"
          placeholder="Set 1 (es: 6-4)"
          value={form.set1}
          onChange={handleChange}
          className="border p-2 mr-2 mt-2"
        />
        <input
          type="text"
          name="set2"
          placeholder="Set 2 (es: 3-6)"
          value={form.set2}
          onChange={handleChange}
          className="border p-2 mr-2 mt-2"
        />
        <input
          type="text"
          name="set3"
          placeholder="Set 3 (es: 6-4)"
          value={form.set3}
          onChange={handleChange}
          className="border p-2 mr-2 mt-2"
        />
        <br />
        <input
          type="number"
          name="valorePartita"
          placeholder="Valore Partita"
          value={form.valorePartita}
          onChange={handleChange}
          className="border p-2 mr-2 mt-2"
        />
        <input
          type="text"
          name="commenti"
          placeholder="Commenti"
          value={form.commenti}
          onChange={handleChange}
          className="border p-2 mr-2 mt-2"
        />
        <br />
        <button
          onClick={aggiungiPartita}
          className="bg-blue-500 text-white px-4 py-2 mt-2 rounded"
        >
          Aggiungi
        </button>
      </div>

      <h2 className="font-semibold mb-2">Partite Giocate</h2>
      <ul>
        {partite.map((p) => (
          <li key={p.id} className="border p-2 my-1">
            <strong>{p.data}</strong> - A1: {p.giocatoreA1} A2: {p.giocatoreA2}, B1: {p.giocatoreB1}, B2: {p.giocatoreB2} <br />
            Set: {p.set1}, {p.set2}, {p.set3} <br />
            <strong>Risultato:</strong> {p.risultato} <br />
            Valore: {p.valorePartita} | Punteggio Pre: {p.punteggioPre} | Post: {p.punteggioPost} <br />
            Commenti: {p.commenti} <br />
            <button
              onClick={() => eliminaPartita(p.id)}
              className="bg-red-500 text-white px-2 py-1 rounded"
            >
              Elimina
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
