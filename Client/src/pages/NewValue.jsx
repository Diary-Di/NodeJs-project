import React, { useState, useEffect } from 'react';
import './Students.css';
import Swal from 'sweetalert2';
import { useLocation } from 'react-router-dom';

const Students = () => {
  const location = useLocation();
  const studentToEdit = location.state?.studentToEdit || null;

  const [formData, setFormData] = useState({
    numeroet: '',
    nomet: '',
    moyenne: ''
  });

  useEffect(() => {
    if (studentToEdit) {
      setFormData({
        numeroet: studentToEdit.numeroet,
        nomet: studentToEdit.nomet,
        moyenne: studentToEdit.moyenne,
      });
    }
  }, [studentToEdit]);

  const [errors, setErrors] = useState({});
  const [blinkingFields, setBlinkingFields] = useState({});
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors((prev) => ({ ...prev, [name]: false }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!formData.numeroet.trim()) newErrors.numeroet = true;
    if (!formData.nomet.trim()) newErrors.nomet = true;
    if (!formData.moyenne.trim()) newErrors.moyenne = true;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setBlinkingFields(newErrors);
      setTimeout(() => setBlinkingFields({}), 2000);
      return;
    }

    setErrors({}); // Clear any previous errors

    const url = studentToEdit
      ? `http://localhost:5000/api/etudiant/${formData.numeroet}`
      : 'http://localhost:5000/api/etudiant';

    const method = studentToEdit ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        Swal.fire({
          icon: 'success',
          title: studentToEdit ? 'Enregistrement modifié avec succès !' : 'Ajout réussi !',
        });
        setMessage('');
        
        setFormData({
          numeroet: '',
          nomet: '',
          moyenne: ''
        });

      } else {
        Swal.fire({
          icon: 'error',
          title: 'Erreur lors de la soumission',
        });
      }
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: 'error',
        title: 'Erreur réseau',
      });
    }
  };

  return (
    <div className="students-page">
      <h1 className="page-title">{studentToEdit ? 'Modifier un étudiant' : 'Ajouter de nouvelle donnée'}</h1>
      <form className="student-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="numeroet">Numéro de l'étudiant:</label>
          {errors.numeroet && <span className="error-text">Ce champ est requis</span>}
          <input
            type="text"
            id="numeroet"
            name="numeroet"
            value={formData.numeroet}
            onChange={handleChange}
            className={
              errors.numeroet
                ? blinkingFields.numeroet
                  ? 'input-error blinking'
                  : 'input-error'
                : ''
            }
          />
        </div>

        <div className="form-group">
          <label htmlFor="nomet">Nom de l'étudiant:</label>
          {errors.nomet && <span className="error-text">Ce champ est requis</span>}
          <input
            type="text"
            id="nomet"
            name="nomet"
            value={formData.nomet}
            onChange={handleChange}
            className={
              errors.nomet
                ? blinkingFields.nomet
                  ? 'input-error blinking'
                  : 'input-error'
                : ''
            }
          />
        </div>

        <div className="form-group">
          <label htmlFor="moyenne">Moyenne de l'étudiant:</label>
          {errors.moyenne && <span className="error-text">Ce champ est requis</span>}
          <input
            type="text"
            id="moyenne"
            name="moyenne"
            value={formData.moyenne}
            onChange={handleChange}
            className={
              errors.moyenne
                ? blinkingFields.moyenne
                  ? 'input-error blinking'
                  : 'input-error'
                : ''
            }
          />
        </div>

        <button type="submit" className="valider-btn">
          Valider
        </button>
        {message && <p className="form-message">{message}</p>}
      </form>
    </div>
  );
};

export default Students;
