import React from 'react';
import FolderEditor from './FolderEditor';

const FolderList = ({ folders, setFolders }) => {

  // Función para actualizar el nombre de una carpeta específica
  const updateFolder = (id, newName) => {
    const updatedFolders = folders.map(folder => {
      if (folder.id === id) {
        return { ...folder, name: newName };
      }
      return folder;
    });
    setFolders(updatedFolders);
    
    // AQUÍ PUEDES AGREGAR LA LLAMADA AL BACKEND SI LA NECESITAS
    // Ejemplo: api.updateFolderName(id, newName);
    console.log(`Carpeta ${id} actualizada a: ${newName}`);
  };

  // Función para borrar (opcional, ya que pusimos el botón)
  const deleteFolder = (id) => {
    const updatedFolders = folders.filter(folder => folder.id !== id);
    setFolders(updatedFolders);
  };

  return (
    <div className="folder-list-container">
      {folders.map((folder) => (
        <FolderEditor
          key={folder.id}
          folder={folder}
          onUpdate={updateFolder}
          onDelete={deleteFolder}
        />
      ))}
    </div>
  );
};

export default FolderList;