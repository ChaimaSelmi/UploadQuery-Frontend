import React, { useState, useEffect } from "react";
import axios from "axios";
import { api_url } from "./config";

const UploadAndQuery = () => {
  const [files, setFiles] = useState([]); 
  const [question, setQuestion] = useState(""); 
  const [response, setResponse] = useState(""); 
  const [selectedFile, setSelectedFile] = useState(null); 
  const [loading, setLoading] = useState(false); 
  const [error, setError] = useState(null); 
  
  console.log('api_url', api_url)
  const fetchFiles = async () => {
    try {
      const res = await axios.get(api_url+'/uploads');
      setFiles(res.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des fichiers :", error);
      setError("Erreur lors de la récupération des fichiers.");
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  // Fonction pour gérer le drag 
  const handleDragStart = (e, file) => {
    e.dataTransfer.setData("file", JSON.stringify(file));
  };

  // Fonction pour gérer le drop 
  const handleDrop = (e) => {
    e.preventDefault();
    const file = JSON.parse(e.dataTransfer.getData("file"));
    setSelectedFile(file);
    setQuestion(""); 
  };

  const askQuestion = async () => {
    if (!selectedFile) {
      alert("Veuillez sélectionner un fichier avant de poser une question !");
      return;
    }

    if (!question.trim()) {
      alert("Veuillez poser une question !");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await axios.post(api_url+'/query', {
        question,
        fileId: selectedFile._id,
      });
      setResponse(res.data.answer);  
    } catch (error) {
      console.error("Erreur lors de la requête :", error);
      setError("Erreur lors de la requête. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0]; 
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      await axios.post(api_url+'/uploads/upload', formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      fetchFiles(); 
    } catch (error) {
      console.error("Erreur lors de l'upload du fichier :", error);
      setError("Erreur lors de l'upload du fichier.");
    }
  };

  return (
    <div className="container">
      <div className="files-list">
        <h3>Fichiers Uploadés</h3>
        <input 
          type="file" 
          id="fileInput" 
          style={{ display: 'none' }} 
          onChange={handleFileChange} 
        />
        <button onClick={() => document.getElementById("fileInput").click()} className="upload-button">
          Uploader un fichier
        </button>
        <ul>
          {files.map((file, index) => (
            <li
              key={index}
              draggable
              onDragStart={(e) => handleDragStart(e, file)} 
            >
              {file.filename}
            </li>
          ))}
        </ul>
      </div>

      <div className="right-section">
        <div
          className="question-drop-zone"
          onDrop={handleDrop} 
          onDragOver={(e) => e.preventDefault()} 
        >
          <div className="dropped-files">
            <h4>Fichier Sélectionné :</h4>
            {selectedFile ? (
              <div className="selected-file">
                <p>{selectedFile.filename}</p>
              </div>
            ) : (
              <p>Glissez et déposez un fichier ici...</p>
            )}
          </div>

          <textarea
            placeholder="Posez une question..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            disabled={!selectedFile} 
          />
        </div>

        <button onClick={askQuestion} className="ask-button" disabled={loading || !selectedFile}>
          {loading ? "Chargement..." : "Envoyer"}
        </button>

        {response && (
          <div className="response-section">
            <h3>Réponse</h3>
            <p>{response}</p>
          </div>
        )}

        {error && (
          <div className="error-section">
            <h3>Erreur</h3>
            <p>{error}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadAndQuery;
