import { useState, useEffect } from 'react'
import './App.css'
import * as signalR from '@microsoft/signalr';
 


function App() {
  const url_back = import.meta.env.VITE_URL_BACK;
  const[connection, setConnection] =  useState(null);
  const[chat, setChat] = useState([]);
  const[user,setUser] = useState("");
  const[message,setMessage] = useState("");
  useEffect(()=>{
    const newConnection = new signalR.HubConnectionBuilder()
      .withUrl(url_back)
      .withAutomaticReconnect()
      .build()

      setConnection(newConnection);

  },[]);

useEffect(() => {
    if (connection) {
      connection
        .start()
        .then(() => {
          console.log("Conectado al SignalR Hub");

          connection.on("ReceiveMessage", (user, message) => {
            setChat(prev => [...prev, { user, message }]);
          });
        })
        .catch(error => console.error("Error al conectar con el hub:", error));
    }
  }, [connection]);

   const sendMessage = async () => {
    if (connection._connectionStarted) {
      try {
        await connection.invoke("SendMessage", user, message);
        setMessage('');
      } catch (error) {
        console.error("Error al enviar mensaje:", error);
      }
    } else {
      alert("No conectado aún.");
    }
  };
     return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Card Principal */}
        <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-xl border-0 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6">
            <h1 className="flex items-center gap-2 text-xl font-semibold">💬 Chat en Tiempo Real</h1>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Input Section */}
            <div className="space-y-4 mb-6">
              {/* Input Nombre */}
              <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">👤</div>
                <input
                  type="text"
                  placeholder="Tu nombre"
                  value={user}
                  onChange={(e) => setUser(e.target.value)}
                  className="w-full pl-10 h-12 text-lg border-2 border-gray-200 rounded-md px-3 py-2 focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>

              {/* Input Mensaje y Botón */}
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Mensaje"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      sendMessage()
                    }
                  }}
                  className="flex-1 h-12 text-lg border-2 border-gray-200 rounded-md px-3 py-2 focus:outline-none focus:border-blue-500 transition-colors"
                />
                <button
                  onClick={sendMessage}
                  disabled={!user.trim() || !message.trim()}
                  className="h-12 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-md font-medium transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  📤 Enviar
                </button>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="border-2 border-gray-100 rounded-lg overflow-hidden">
              {/* Messages Header */}
              <div className="bg-gray-50 p-4 border-b border-gray-100">
                <h3 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
                  💬 Mensajes ({chat.length})
                </h3>
              </div>

              {/* Messages Content */}
              <div className="p-4">
                <div className="h-96 overflow-y-auto">
                  {chat.length === 0 ? (
                    <div className="flex items-center justify-center h-full text-gray-500">
                      <div className="text-center">
                        <div className="text-4xl mb-3 opacity-50">💬</div>
                        <p>No hay mensajes aún. ¡Sé el primero en escribir!</p>
                      </div>
                    </div>
                  ) : (
                    <ul className="space-y-3">
                      {chat.map((msg, i) => (
                        <li key={i}>
                          <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                            {/* Avatar */}
                            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                              {msg.user.charAt(0).toUpperCase()}
                            </div>
                            {/* Message Content */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <strong className="text-blue-600 font-semibold">{msg.user}</strong>
                                <span className="text-xs text-gray-400">
                                  {new Date().toLocaleTimeString("es-ES", {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                                </span>
                              </div>
                              <p className="text-gray-700 break-words">{msg.message}</p>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
