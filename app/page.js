"use client";
import { useState } from "react";

export default function Home() {
  const [channelLink, setChannelLink] = useState(""); // Para almacenar el canal ingresado
  const [error, setError] = useState(null); // Para manejar posibles errores
  const [videoLinks, setVideoLinks] = useState([]); // Para almacenar los links de los videos

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevenir el comportamiento predeterminado del formulario

    try {
      const response = await fetch("/api/links", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ channelLink }), // Enviar como JSON
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Datos de la API:", data); // Verifica los datos recibidos de la API
        setVideoLinks(Array.isArray(data.array) ? data.array : []);
        setError(null); // Limpiar cualquier error
      } else {
        const errorData = await response.json();
        setError(errorData.error); // Establecer el mensaje de error
        setVideoLinks([]); // Limpiar los videos si hay error
      }
    } catch (error) {
      console.error("Error en la solicitud:", error);
      setError("Hubo un error al procesar la solicitud.");
      setVideoLinks([]);
    }
  };

  // Función para copiar todos los links al portapapeles
  const copyLinksToClipboard = () => {
    const links = videoLinks.map((link) => link.href).join("\n");
    navigator.clipboard
      .writeText(links)
      .then(() => {
        alert("Links copiados al portapapeles");
      })
      .catch((err) => {
        console.error("Error al copiar al portapapeles:", err);
      });
  };

  console.log("Video Links:", videoLinks);

  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        padding: "2rem",
        backgroundColor: "#f4f4f9",
        color: "#333",
      }}
    >
      <h1
        style={{
          textAlign: "center",
          marginBottom: "1rem",
          color: "#2c3e50",
        }}
      >
        YouTube Links
      </h1>

      <form
        onSubmit={handleSubmit}
        style={{
          marginBottom: "1rem",
          textAlign: "center",
          padding: "1rem",
          borderRadius: "8px",
          backgroundColor: "#ffffff",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        }}
      >
        <input
          type="text"
          name="channelLink"
          value={channelLink}
          onChange={(e) => setChannelLink(e.target.value)}
          placeholder="Pega el enlace del canal de YouTube"
          style={{
            width: "80%",
            padding: "8px",
            marginBottom: "12px",
            borderRadius: "5px",
            border: "1px solid #ccc",
            fontSize: "14px",
            color: "#000000",
          }}
          required
        />
        <br />
        <button
          type="submit"
          style={{
            padding: "8px 16px",
            backgroundColor: "#0070f3",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            fontSize: "14px",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          }}
        >
          Obtener Links
        </button>
      </form>

      {/* Botón para copiar los links */}
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <button
          onClick={copyLinksToClipboard}
          style={{
            padding: "8px 16px",
            backgroundColor: "#28a745",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            fontSize: "14px",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          }}
        >
          Copiar al portapapeles
        </button>
      </div>

      {/* Indicador de cantidad de links */}
      {videoLinks.length > 0 && (
        <p
          style={{
            textAlign: "center",
            marginBottom: "1rem",
            fontSize: "16px",
            color: "#0070f3",
            fontWeight: "bold",
          }}
        >
          {videoLinks.length} Links
        </p>
      )}

      {error && (
        <p style={{ color: "red", textAlign: "center", fontSize: "14px" }}>
          {error}
        </p>
      )}

      {/* Mostrar los links en columnas con scroll */}
      {Array.isArray(videoLinks) && videoLinks.length > 0 && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "8px",
            maxHeight: "400px",
            overflowY: "auto",
            padding: "1rem",
            border: "1px solid #ccc",
            borderRadius: "5px",
            backgroundColor: "#ffffff",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          }}
        >
          {videoLinks.map((link, index) => (
            <div
              key={index}
              style={{
                padding: "8px",
                backgroundColor: "#ecf0f1",
                borderRadius: "5px",
                border: "1px solid #ddd",
                textAlign: "center",
                overflow: "hidden",
                wordBreak: "break-word",
              }}
            >
              <a
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: "#3498db",
                  fontSize: "14px",
                  textDecoration: "none",
                }}
              >
                {link.href}
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
