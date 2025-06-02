import React, { useState, useEffect } from "react";
/* versione vecchia
const styles = {
  container: {
    backgroundColor: "#121212",
    color: "#eee",
    minHeight: "100vh",
    padding: "20px",
    fontFamily: "sans-serif",
    maxWidth: "100vw",
    boxSizing: "border-box",
    overflowX: "auto",       // permette lo scroll orizzontale se serve
  },
  button: {
    backgroundColor: "#1f1f1f",
    color: "#eee",
    border: "1px solid #333",
    padding: "8px 16px",
    cursor: "pointer",
    margin: "5px",
    fontSize: "1rem",        // aumenta un po’ la leggibilità su mobile
    minWidth: "44px",        // dimensione minima per tap comodo su touch
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "20px",
    tableLayout: "auto",      // evita larghezze fisse delle celle
    fontSize: "0.9rem",       // leggermente più piccolo per adattarsi
  },
  th: {
    border: "1px solid #333",
    padding: "8px",
    backgroundColor: "#222",
    whiteSpace: "nowrap",     // evita che header vadano a capo, meglio scroll
  },
  td: {
    border: "1px solid #333",
    padding: "8px",
    textAlign: "center",
    whiteSpace: "nowrap",     // stessa cosa per le celle dati
  },
  modalOverlay: {
    position: "fixed",
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: "rgba(0,0,0,0.7)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "10px",          // padding per non toccare i bordi schermo su mobile
    overflowY: "auto",
  },
  modal: {
    backgroundColor: "#1e1e1e",
    padding: "20px",
    borderRadius: "8px",
    width: "100%",            // prende tutta la larghezza disponibile
    maxWidth: "400px",        // ma non più larga di 400px
    boxSizing: "border-box",
  },
  input: {
    width: "100%",
    padding: "6px",
    margin: "4px 0",
    backgroundColor: "#333",
    color: "#eee",
    border: "1px solid #444",
    fontSize: "1rem",
    boxSizing: "border-box",
  },
};*/

const styles = {
  container: {
    backgroundColor: "#f9f9f9",
    color: "#333",
    minHeight: "100vh",
    padding: "20px",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: "12px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    padding: "16px 20px",
    marginBottom: "16px",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  label: {
    fontWeight: "600",
    fontSize: "0.9rem",
    color: "#555",
  },
  value: {
    fontWeight: "400",
    fontSize: "1rem",
    color: "#222",
  },
  row: {
    display: "flex",
    justifyContent: "space-between",
  },
  actions: {
    marginTop: "12px",
    display: "flex",
    gap: "12px",
  },
  button: {
    backgroundColor: "transparent",
    border: "none",
    color: "#007BFF",
    cursor: "pointer",
    fontSize: "1.1rem",
    padding: "4px 8px",
    borderRadius: "6px",
    transition: "background-color 0.2s ease",
  },
  buttonHover: {
    backgroundColor: "#e0f0ff",
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
/*
 const renderMatches = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: "15px", marginTop: "20px" }}>
    {matches.map((m) => (
      <div
        key={m.id}
        style={{
          backgroundColor: "#1f1f1f",
          padding: "15px",
          borderRadius: "8px",
          boxShadow: "0 0 8px rgba(0,0,0,0.5)",
          color: "#eee",
        }}
      >
        <div><strong>Data:</strong> {m.data}</div>
        <div><strong>A1:</strong> {m.giocatoreA1}</div>
        <div><strong>A2:</strong> {m.giocatoreA2}</div>
        <div><strong>B1:</strong> {m.giocatoreB1}</div>
        <div><strong>B2:</strong> {m.giocatoreB2}</div>
        <div><strong>Set 1:</strong> {m.set1}</div>
        <div><strong>Set 2:</strong> {m.set2}</div>
        <div><strong>Set 3:</strong> {m.set3 || "-"}</div>
        <div><strong>Risultato:</strong> {m.risultato}</div>
        <div><strong>Valore:</strong> {m.valorePartita.toFixed(2)}</div>
        <div><strong>Punteggio Pre:</strong> {m.punteggioPre.toFixed(2)}</div>
        <div><strong>Punteggio Post:</strong> {m.punteggioPost.toFixed(2)}</div>
        <div style={{ marginTop: "10px" }}>
          <button style={styles.button} onClick={() => openModal(m)}>✏️ Modifica</button>
          <button
            style={{ ...styles.button, marginLeft: "10px" }}
            onClick={() => handleDelete(m.id)}
          >
            🗑️ Cancella
          </button>
        </div>
      </div>
    ))}
  </div>
);
*/
const renderMatches = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: "15px", marginTop: "20px" }}>
    {matches.map((m) => (
      <div
        key={m.id}
        style={{
          backgroundColor: "#1e1e1e",
          borderRadius: "8px",
          padding: "15px 20px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
          color: "#eee",
          display: "flex",
          flexDirection: "column",
          gap: "8px",
        }}
      >
        <div style={{ fontWeight: "600", fontSize: "1.1rem" }}>
          {m.data} — <span style={{ opacity: 0.7 }}>{m.risultato}</span>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.9rem" }}>
          <div>
            <strong>A1:</strong> {m.giocatoreA1}<br />
            <strong>A2:</strong> {m.giocatoreA2}
          </div>
          <div>
            <strong>B1:</strong> {m.giocatoreB1}<br />
            <strong>B2:</strong> {m.giocatoreB2}
          </div>
        </div>

        <div style={{ fontSize: "0.9rem", opacity: 0.8 }}>
          <strong>Set:</strong> {m.set1}, {m.set2}{m.set3 ? `, ${m.set3}` : ""}
        </div>

        <div style={{ fontSize: "0.9rem", display: "flex", justifyContent: "space-between", opacity: 0.7 }}>
          <span>Valore: {m.valorePartita.toFixed(2)}</span>
          <span>Pre: {m.punteggioPre.toFixed(2)}</span>
          <span>Post: {m.punteggioPost.toFixed(2)}</span>
        </div>

        <div style={{ marginTop: "10px", display: "flex", justifyContent: "flex-end", gap: "10px" }}>
          <button style={{ ...styles.button }} onClick={() => openModal(m)}>✏️</button>
          <button
            style={{ ...styles.button }}
            onClick={() => handleDelete(m.id)}
          >
            🗑️
          </button>
        </div>
      </div>
    ))}
  </div>
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
