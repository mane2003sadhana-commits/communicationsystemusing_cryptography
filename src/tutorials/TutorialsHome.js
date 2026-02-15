import React from "react";

const TutorialsHome = ({ onSelect }) => {
  return (
    <div>
      <h3>Select Cryptography Method</h3>

      <div style={styles.grid}>
        <div style={styles.card} onClick={() => onSelect("caesar")}>
          Caesar Cipher
        </div>       

        <div style={styles.card} onClick={() => onSelect("vigener")}>Vigener Cipher</div>
        <div
  style={styles.card}
  onClick={() => onSelect("railfence")}
>
  Rail Fence Cipher
</div>

        {/* <div style={styles.card}>ColumnarTransposition</div> */}
        <div
          style={styles.card}
          onClick={() => onSelect("columnar")}
        >
          Columnar Transposition
        </div>
      </div>
    </div>
  );
};

export default TutorialsHome;

const styles = {
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: "20px",
    marginTop: "20px",
  },
  card: {
    padding: "20px",
    backgroundColor: "#f1f5f9",
    borderRadius: "10px",
    cursor: "pointer",
    textAlign: "center",
    fontWeight: "bold",
    boxShadow: "0 5px 10px rgba(0,0,0,0.1)",
  },
};
