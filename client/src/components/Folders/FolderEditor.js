import React, { useState } from 'react';

const FolderEditor = ({ folder, onUpdate, onDelete, isActive }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(folder.name);

  // Guardar cambios
  const handleSave = () => {
    if (newName.trim() === "") return; // Evitar nombres vacíos
    onUpdate(folder.id, newName);
    setIsEditing(false);
  };

  // Cancelar edición
  const handleCancel = () => {
    setNewName(folder.name); // Revertir al nombre original
    setIsEditing(false);
  };

  // Estilos básicos para que se vea bien en fondo oscuro
  const styles = {
    container: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '10px',
      backgroundColor: isActive ? '#333' : 'transparent', // Resalta si está activa
      color: 'white',
      borderRadius: '5px',
      marginBottom: '5px',
      cursor: 'pointer'
    },
    input: {
      backgroundColor: '#222',
      border: '1px solid #555',
      color: 'white',
      padding: '5px',
      borderRadius: '4px',
      outline: 'none',
      width: '100px'
    },
    btnGroup: {
      display: 'flex',
      gap: '5px'
    },
    iconBtn: {
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      fontSize: '14px',
      color: '#ccc'
    }
  };

  if (isEditing) {
    return (
      <div style={styles.container}>
        <input
          style={styles.input}
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          autoFocus
        />
        <div style={styles.btnGroup}>
          <button style={styles.iconBtn} onClick={handleSave} title="Save">✅</button>
          <button style={styles.iconBtn} onClick={handleCancel} title="Cancel">❌</button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <span style={{ flexGrow: 1 }}>📁 {folder.name}</span>
      <div style={styles.btnGroup}>
        {/* Botón Editar */}
        <button style={styles.iconBtn} onClick={() => setIsEditing(true)} title="Rename">
          ✏️
        </button>
        {/* Botón Borrar */}
        <button style={styles.iconBtn} onClick={() => onDelete(folder.id)} title="Delete">
          🗑️
        </button>
      </div>
    </div>
  );
};

export default FolderEditor;