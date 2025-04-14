import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "./ListPage.css";

const ListPage = () => {
  const [students, setStudents] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:5000/api/etudiant")
      .then((res) => res.json())
      .then((data) => setStudents(data))
      .catch((err) => console.error("Failed to fetch students:", err));
  }, []);

  const getObservation = (moyenne) => {
    if (moyenne >= 10) return "Admis";
    if (moyenne >= 5) return "Redoublant";
    return "Exclu";
  };

  const getClassAverage = () => {
    if (students.length === 0) return 0;
    const total = students.reduce((sum, s) => sum + parseFloat(s.moyenne), 0);
    return (total / students.length).toFixed(2);
  };

  const getMinAverage = () => {
    if (students.length === 0) return 0;
    return Math.min(...students.map((s) => parseFloat(s.moyenne))).toFixed(2);
  };

  const getMaxAverage = () => {
    if (students.length === 0) return 0;
    return Math.max(...students.map((s) => parseFloat(s.moyenne))).toFixed(2);
  };

  const handleEdit = (student) => {
    navigate("/students", { state: { studentToEdit: student } });
  };

  const handleDelete = (numeroet) => {
    Swal.fire({
      title: "Confirmer la suppression",
      text: "Voulez-vous vraiment supprimer cet enregistrement ?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Oui, supprimer",
      cancelButtonText: "Annuler",
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(`http://localhost:5000/api/etudiant/${numeroet}`, {
          method: "DELETE",
        })
          .then((res) => res.json())
          .then(() => {
            Swal.fire("Supprimé !", "L’enregistrement a été supprimé.", "success");
            setStudents((prev) => prev.filter((s) => s.numeroet !== numeroet));
          })
          .catch(() => {
            Swal.fire("Erreur", "Impossible de supprimer l’étudiant.", "error");
          });
      }
    });
  };

  return (
    <div className="list-page">
      <h1>Liste des Étudiants</h1>
      <div className="students-table-container">
  <table className="students-table">
    <thead>
      <tr>
        <th>Nom</th>
        <th>Moyenne</th>
        <th>Observation</th>
        <th></th> {/* Actions */}
      </tr>
    </thead>
  </table>

  <div className="scrollable-tbody">
    <table className="students-table">
      <tbody>
        {students.map((student, index) => (
          <tr key={index}>
            <td>{student.nomet}</td>
            <td>{student.moyenne}</td>
            <td>{getObservation(parseFloat(student.moyenne))}</td>
            <td>
              <button
                className="action-btn edit"
                data-tooltip="Modifier"
                onClick={() => handleEdit(student)}
              >
                <i className="fas fa-edit"></i>
              </button>

              <button
                className="action-btn delete"
                data-tooltip="Supprimer"
                onClick={() => handleDelete(student.numeroet)}
              >
                <i className="fas fa-trash-alt"></i>
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>

  {/* Averages below table */}
  <div className="averages-section">
    <div className="average-field">
      <label>Moyenne de la classe</label>
      <input type="text" value={getClassAverage()} readOnly />
    </div>
    <div className="average-field">
      <label>Moyenne minimale</label>
      <input type="text" value={getMinAverage()} readOnly />
    </div>
    <div className="average-field">
      <label>Moyenne maximale</label>
      <input type="text" value={getMaxAverage()} readOnly />
    </div>
  </div>
</div>

    </div>
  );
};

export default ListPage;
