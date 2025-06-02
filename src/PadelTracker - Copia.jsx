import React, { useState, useEffect } from "react";

const styles = {
  container: {
    backgroundColor: "#121212",
    color: "#eee",
    minHeight: "100vh",
    padding: "20px",
    fontFamily: "sans-serif",
  },
  button: {
    backgroundColor: "#1f1f1f",
    color: "#eee",
    border: "1px solid #333",
    padding: "8px 16px",
    cursor: "pointer",
    margin: "5px",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "20px",
  },
  th: {
    border: "1px solid #333",
    padding: "8px",
    backgroundColor: "#222",
  },
  td: {
    border: "1px solid #333",
    padding: "8px",
    textAlign: "center",
  },
  modalOverlay: {
    position: "fixed",
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: "rgba(0,0,0,0.7)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    backgroundColor: "#1e1e1e",
    padding: "20px",
    borderRadius: "8px",
    width: "300px",
  },
  input: {
    width: "100%",
    padding: "6px",
    margin: "4px 0",
    backgroundColor: "#333",
    color: "#eee",
    border: "1px solid #444",
  },
};

const PadelTracker = () => {
  // Carica da localStorage o usa array vuoto
  const [matches, setMatches] = useState(() => {
    const saved = localStorage.getItem("padelMatches");
    return saved ? JSON.parse(saved) : [];
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    id: null,
    data: "",
    giocatoreA2: "",
    giocatoreB1: "",
    giocatoreB2: "",
    set1: "",
    set2: "",
    set3: "",
    valorePartita: "",
    punteggioPre: "",
  });

  // Aggiorna localStorage ogni volta che cambia matches
  useEffect(() => {
    localStorage.setItem("padelMatches", JSON.stringify(matches));
  }, [matches]);

  const openModal = (match = null) => {
    if (match) {
      setFormData(match);
    } else {
      const lastPost = matches.length > 0 ? matches[matches.length - 1].punteggioPost : 0;
      setFormData({
        id: null,
        data: "",
        giocatoreA2: "",
        giocatoreB1: "",
        giocatoreB2: "",
        set1: "",
        set2: "",
        set3: "",
        valorePartita: "",
        punteggioPre: lastPost.toFixed(2),
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setFormData({
      id: null,
      data: "",
      giocatoreA2: "",
      giocatoreB1: "",
      giocatoreB2: "",
      set1: "",
      set2: "",
      set3: "",
      valorePartita: "",
      punteggioPre: "",
    });
  };

  const handleDelete = (id) => {
    const updatedMatches = matches.filter((match) => match.id !== id);
    setMatches(updatedMatches);
  };

  const calcolaRisultato = (set1, set2, set3) => {
    const parseSet = (set) => {
      const [a, b] = set.split("-").map((n) => parseInt(n));
      return { a, b };
    };

    const s1 = parseSet(set1);
    const s2 = parseSet(set2);
    const s3 = set3 ? parseSet(set3) : null;

    let vittorie = 0;
    let sconfitte = 0;

    if (s1.a > s1.b) vittorie++; else sconfitte++;
    if (s2.a > s2.b) vittorie++; else sconfitte++;
    if (s3) {
      if (s3.a > s3.b) vittorie++; else sconfitte++;
    }

    return vittorie > sconfitte ? "Vittoria!" : "Sconfitta";
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const valore = parseFloat(formData.valorePartita) || 0;
    const punteggioPre = parseFloat(formData.punteggioPre) || 0;
    const punteggioPost = parseFloat((punteggioPre + valore).toFixed(2));

    const risultato = calcolaRisultato(formData.set1, formData.set2, formData.set3);

    const newMatch = {
      id: formData.id || Date.now(),
      data: formData.data,
      giocatoreA1: "IO",
      giocatoreA2: formData.giocatoreA2,
      giocatoreB1: formData.giocatoreB1,
      giocatoreB2: formData.giocatoreB2,
      set1: formData.set1,
      set2: formData.set2,
      set3: formData.set3,
      risultato,
      valorePartita: parseFloat(valore.toFixed(2)),
      punteggioPre: parseFloat(punteggioPre.toFixed(2)),
      punteggioPost,
    };

    if (formData.id) {
      setMatches((prev) => prev.map((m) => (m.id === formData.id ? newMatch : m)));
    } else {
      setMatches((prev) => [...prev, newMatch]);
    }

    closeModal();
  };

  const renderMatches = () => (
    <table style={styles.table}>
      <thead>
        <tr>
          <th style={styles.th}>Data</th>
          <th style={styles.th}>A1</th>
          <th style={styles.th}>A2</th>
          <th style={styles.th}>B1</th>
          <th style={styles.th}>B2</th>
          <th style={styles.th}>Set1</th>
          <th style={styles.th}>Set2</th>
          <th style={styles.th}>Set3</th>
          <th style={styles.th}>Risultato</th>
          <th style={styles.th}>Valore</th>
          <th style={styles.th}>Punteggio Pre</th>
          <th style={styles.th}>Punteggio Post</th>
          <th style={styles.th}>Azioni</th>
        </tr>
      </thead>
      <tbody>
        {matches.map((m) => (
          <tr key={m.id}>
            <td style={styles.td}>{m.data}</td>
            <td style={styles.td}>{m.giocatoreA1}</td>
            <td style={styles.td}>{m.giocatoreA2}</td>
            <td style={styles.td}>{m.giocatoreB1}</td>
            <td style={styles.td}>{m.giocatoreB2}</td>
            <td style={styles.td}>{m.set1}</td>
            <td style={styles.td}>{m.set2}</td>
            <td style={styles.td}>{m.set3}</td>
            <td style={styles.td}>{m.risultato}</td>
            <td style={styles.td}>{m.valorePartita.toFixed(2)}</td>
            <td style={styles.td}>{m.punteggioPre.toFixed(2)}</td>
            <td style={styles.td}>{m.punteggioPost.toFixed(2)}</td>
            <td style={styles.td}>
              <button style={styles.button} onClick={() => openModal(m)}>✏️</button>
              <button
                style={{ ...styles.button, marginLeft: "5px" }}
                onClick={() => handleDelete(m.id)}
              >
                🗑️
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  return (
    <div style={styles.container}>
      <h1>Padel Tracker</h1>
      <button style={styles.button} onClick={() => openModal()}>Aggiungi Partita</button>
      {renderMatches()}

      {isModalOpen && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <h2>{formData.id ? "Modifica Partita" : "Nuova Partita"}</h2>
            <form onSubmit={handleSubmit}>
              <input
                style={styles.input}
                type="date"
                value={formData.data}
                onChange={(e) => setFormData({ ...formData, data: e.target.value })}
                required
              />
              <input
                style={styles.input}
                type="text"
                placeholder="A2"
                value={formData.giocatoreA2}
                onChange={(e) => setFormData({ ...formData, giocatoreA2: e.target.value })}
                required
              />
              <input
                style={styles.input}
                type="text"
                placeholder="B1"
                value={formData.giocatoreB1}
                onChange={(e) => setFormData({ ...formData, giocatoreB1: e.target.value })}
                required
              />
              <input
                style={styles.input}
                type="text"
                placeholder="B2"
                value={formData.giocatoreB2}
                onChange={(e) => setFormData({ ...formData, giocatoreB2: e.target.value })}
                required
              />
              <input
                style={styles.input}
                type="text"
                placeholder="Set 1 (es. 6-3)"
                value={formData.set1}
                onChange={(e) => setFormData({ ...formData, set1: e.target.value })}
                required
              />
              <input
                style={styles.input}
                type="text"
                placeholder="Set 2 (es. 4-6)"
                value={formData.set2}
                onChange={(e) => setFormData({ ...formData, set2: e.target.value })}
                required
              />
              <input
                style={styles.input}
                type="text"
                placeholder="Set 3 (es. 7-5) (opzionale)"
                value={formData.set3}
                onChange={(e) => setFormData({ ...formData, set3: e.target.value })}
              />
              <input
                style={styles.input}
                type="number"
                step="0.01"
                placeholder="Valore partita"
                value={formData.valorePartita}
                onChange={(e) => setFormData({ ...formData, valorePartita: e.target.value })}
                required
              />
             <input
  style={styles.input}
  type="number"
  step="0.01"
  placeholder="Punteggio Pre"
  value={formData.punteggioPre}
  onChange={(e) => setFormData({ ...formData, punteggioPre: e.target.value })}
/>
              <div style={{ marginTop: "10px", textAlign: "right" }}>
                <button type="button" style={styles.button} onClick={closeModal}>Annulla</button>
                <button type="submit" style={{ ...styles.button, marginLeft: "10px" }}>Salva</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PadelTracker;
